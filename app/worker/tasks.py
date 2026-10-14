"""
Resume processing background task — runs directly via FastAPI BackgroundTasks.
No Celery or Redis needed.
"""
import json
import logging
import uuid

from sqlalchemy import select

from app.database import async_session_factory
from app.models.resume import Resume, ResumeSection
from app.services.embedding import generate_embedding
from app.services.parsers.docx_parser import DocxParser
from app.services.parsers.pdf_parser import PDFParser
from app.services.pii_redactor import redact
from app.services.segmenter import segment

logger = logging.getLogger(__name__)


async def process_resume_task(resume_id: uuid.UUID, file_path: str, ext: str):
    """Parse, segment, redact, and embed a resume file. Runs as a FastAPI background task."""
    async with async_session_factory() as db:
        result = await db.execute(select(Resume).where(Resume.id == resume_id))
        resume = result.scalar_one_or_none()

        if not resume:
            logger.error(f"Resume {resume_id} not found in database")
            return

        try:
            with open(file_path, 'rb') as f:
                content = f.read()

            # Parse
            parser = PDFParser() if ext == 'pdf' else DocxParser()
            raw_text = parser.extract_text(content)

            # Segment
            sections = segment(raw_text)

            # Redact & embed
            for sec_type, text in sections.items():
                if text.strip():
                    redacted_text = redact(text)
                    vector = generate_embedding(redacted_text)

                    db_section = ResumeSection(
                        resume_id=resume.id,
                        section_type=sec_type,
                        redacted_text=redacted_text,
                        # Store embedding as JSON string for SQLite
                        embedding=json.dumps(vector),
                    )
                    db.add(db_section)

            resume.parse_status = 'parsed'
            await db.commit()
            logger.info(f"Successfully processed resume {resume_id}")

        except Exception as e:
            logger.error(f"Failed to process resume {resume_id}: {str(e)}")
            resume.parse_status = 'failed'
            await db.commit()
