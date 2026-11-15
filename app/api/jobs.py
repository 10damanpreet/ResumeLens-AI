import json
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, require_recruiter
from app.database import get_db
from app.models.candidate import Candidate
from app.models.job import JobDescription
from app.schemas.job import JobCreateRequest, JobOut
from app.services.embedding import generate_embedding
from app.services.tailor_service import generate_job_description

router = APIRouter()


class JobGenerateRequest(BaseModel):
    title: str
    seniority: str = 'Mid-Level'
    skills: str = ''


@router.get('', response_model=list[JobOut])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Retrieve all active job postings for candidate selection and recruiter pipeline."""
    result = await db.execute(select(JobDescription).order_by(JobDescription.created_at.desc()))
    return result.scalars().all()


@router.post('/generate')
async def generate_jd_with_ai(
    req: JobGenerateRequest,
    current_user: Candidate = Depends(require_recruiter),
) -> dict[str, Any]:
    """Use Gemini to dynamically draft a structured, inclusive job description."""
    return await generate_job_description(req.title, req.seniority, req.skills)


@router.post('', response_model=JobOut)
async def create_job(
    request: JobCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Create a new job description with dense vector embedding."""
    embedding_vec = generate_embedding(request.raw_text)

    job = JobDescription(
        candidate_id=current_user.id,
        title=request.title or 'Target Role',
        company=request.company or 'Target Company',
        raw_text=request.raw_text,
        embedding=json.dumps(embedding_vec),
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


@router.get('/{job_id}', response_model=JobOut)
async def get_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Retrieve a single job description."""
    result = await db.execute(select(JobDescription).where(JobDescription.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return job
