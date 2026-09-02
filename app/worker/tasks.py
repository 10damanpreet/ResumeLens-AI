import asyncio
import logging
import uuid

from celery import shared_task
from sqlalchemy import select

from app.database import async_session_factory
from app.models.resume import Resume, ResumeSection
from app.models.task import TaskLog
from app.services.embedding import generate_embedding
from app.services.parsers.docx_parser import DocxParser
from app.services.parsers.pdf_parser import PDFParser
from app.services.pii_redactor import redact
from app.services.segmenter import segment

logger = logging.getLogger(__name__)

async def async_process_resume(resume_id: uuid.UUID, file_path: str, ext: str, task_id: str):
    async with async_session_factory() as db:
        # Create TaskLog
        task_log = TaskLog(id=uuid.UUID(task_id), task_name="process_resume", status="processing")
        db.add(task_log)

        # Fetch Resume
        result = await db.execute(select(Resume).where(Resume.id == resume_id))
        resume = result.scalar_one_or_none()

        if not resume:
            task_log.status = "failed"
            task_log.error_message = "Resume not found in database"
            await db.commit()
            return

        try:
            # Read file
            with open(file_path, "rb") as f:
                content = f.read()

            # Parse
            parser = PDFParser() if ext == "pdf" else DocxParser()
            raw_text = parser.extract_text(content)

            # Segment
            sections = segment(raw_text)

            # Redact & Save
            for sec_type, text in sections.items():
                if text.strip():
                    redacted_text = redact(text)
                    # Generate 384-dim vector embedding for the section
                    vector = generate_embedding(redacted_text)

                    db_section = ResumeSection(
                        resume_id=resume.id,
                        section_type=sec_type,
                        redacted_text=redacted_text,
                        embedding=vector
                    )
                    db.add(db_section)

            resume.parse_status = "parsed"
            task_log.status = "completed"
            await db.commit()
            logger.info(f"Successfully processed resume {resume_id}")

        except Exception as e:
            logger.error(f"Failed to process resume {resume_id}: {str(e)}")
            resume.parse_status = "failed"
            task_log.status = "failed"
            task_log.error_message = str(e)
            await db.commit()


@shared_task(bind=True, name="process_resume_task")
def process_resume_task(self, resume_id_str: str, file_path: str, ext: str):
    resume_id = uuid.UUID(resume_id_str)
    task_id = self.request.id

    # Run the async function inside the synchronous Celery worker
    asyncio.run(async_process_resume(resume_id, file_path, ext, task_id))

    return {"status": "completed", "resume_id": resume_id_str}
