import os
import uuid

import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.resume import Resume, ResumeSection
from app.schemas.resume import ResumeOut, ResumeSectionOut, ResumeUploadResponse

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user)
):
    # Determine format
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx']:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX supported")

    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")

    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # Create DB entry
    db_resume = Resume(
        candidate_id=current_user.id,
        original_filename=file.filename,
        file_format=ext,
        storage_path=file_path,
        parse_status="processing"
    )
    db.add(db_resume)
    await db.commit()
    await db.refresh(db_resume)

    # Instead of sending to Celery (Phase 2), we instantly mark it parsed for the Phase 1 demo
    db_resume.parse_status = "parsed"
    await db.commit()
    await db.refresh(db_resume)

    return ResumeUploadResponse(
        resume_id=db_resume.id,
        parse_status="parsed",
        message="Resume uploaded and parsed successfully.",
        task_id=None
    )

@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(resume_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: Candidate = Depends(get_current_user)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id, Resume.candidate_id == current_user.id))
    resume = result.scalar_one_or_none()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.get("/{resume_id}/sections", response_model=list[ResumeSectionOut])
async def get_resume_sections(resume_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: Candidate = Depends(get_current_user)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id, Resume.candidate_id == current_user.id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Resume not found")

    sections_result = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == resume_id))
    return sections_result.scalars().all()
