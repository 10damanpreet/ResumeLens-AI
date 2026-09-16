import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.job import JobDescription
from app.schemas.job import JobCreateRequest, JobOut

router = APIRouter()

@router.post("", response_model=JobOut)
async def create_job(
    request: JobCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user)
):
    job = JobDescription(
        candidate_id=current_user.id,
        title=request.title,
        company=request.company,
        raw_text=request.raw_text
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job

@router.get("/{job_id}", response_model=JobOut)
async def get_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user)
):
    result = await db.execute(select(JobDescription).where(JobDescription.id == job_id, JobDescription.candidate_id == current_user.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
