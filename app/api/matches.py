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
from app.models.match import MatchEvaluation
from app.models.resume import Resume
from app.schemas.match import MatchScoreOut
from app.services.matcher import evaluate_match

router = APIRouter()


class BulkMatchRequest(BaseModel):
    job_id: uuid.UUID
    resume_ids: list[uuid.UUID] = []


class StatusUpdateRequest(BaseModel):
    status: str  # 'shortlisted' | 'review' | 'interview' | 'rejected'


@router.post('', response_model=MatchScoreOut)
async def create_match(
    resume_id: uuid.UUID,
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Compute tri-factor hybrid match score for a single resume and job."""
    try:
        evaluation = await evaluate_match(db, resume_id, job_id)
        return evaluation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/leaderboard/{job_id}')
async def get_job_leaderboard(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(require_recruiter),
) -> list[dict[str, Any]]:
    """Retrieve ranked applicant leaderboard for recruiter screening."""
    stmt = (
        select(MatchEvaluation, Resume, Candidate)
        .join(Resume, MatchEvaluation.resume_id == Resume.id)
        .join(Candidate, Resume.candidate_id == Candidate.id)
        .where(MatchEvaluation.job_id == job_id)
        .order_by(MatchEvaluation.final_match_score.desc())
    )
    res = await db.execute(stmt)
    rows = res.all()

    leaderboard = []
    for rank, (match_eval, resume, candidate) in enumerate(rows, start=1):
        name = getattr(candidate, 'full_name', None) or candidate.email.split('@')[0].replace('.', ' ').title()
        leaderboard.append({
            'rank': rank,
            'match_id': str(match_eval.id),
            'resume_id': str(resume.id),
            'candidate_name': name,
            'candidate_email': candidate.email,
            'filename': resume.original_filename,
            'final_match_score': float(match_eval.final_match_score),
            'dense_score': float(match_eval.dense_score),
            'skill_overlap_score': float(match_eval.skill_overlap_score),
            'experience_score': float(match_eval.experience_score),
            'status': match_eval.status or 'review',
            'evaluated_at': match_eval.evaluated_at.isoformat() if match_eval.evaluated_at else None,
        })
    return leaderboard


@router.post('/bulk')
async def bulk_screen_candidates(
    req: BulkMatchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(require_recruiter),
) -> list[dict[str, Any]]:
    """Batch-screen multiple candidate resumes against an open requisition."""
    target_ids = req.resume_ids
    if not target_ids:
        res = await db.execute(select(Resume.id).order_by(Resume.uploaded_at.desc()))
        target_ids = res.scalars().all()

    for r_id in target_ids:
        try:
            await evaluate_match(db, r_id, req.job_id)
        except Exception:
            continue

    return await get_job_leaderboard(req.job_id, db, current_user)


@router.patch('/{match_id}/status')
async def update_candidate_status(
    match_id: uuid.UUID,
    req: StatusUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(require_recruiter),
) -> dict[str, Any]:
    """Update applicant pipeline status (shortlisted, review, interview, rejected)."""
    res = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    match_eval = res.scalar_one_or_none()
    if not match_eval:
        raise HTTPException(status_code=404, detail='Match evaluation not found')

    match_eval.status = req.status
    await db.commit()
    return {'status': 'ok', 'match_id': str(match_id), 'new_status': req.status}


@router.get('/{match_id}', response_model=MatchScoreOut)
async def get_match(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Retrieve match evaluation metadata."""
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    evaluation = result.scalar_one_or_none()
    if not evaluation:
        raise HTTPException(status_code=404, detail='Match evaluation not found')

    job_res = await db.execute(select(JobDescription).where(JobDescription.id == evaluation.job_id))
    job = job_res.scalar_one_or_none()
    res_res = await db.execute(select(Resume).where(Resume.id == evaluation.resume_id))
    resume = res_res.scalar_one_or_none()

    return MatchScoreOut(
        id=evaluation.id,
        resume_id=evaluation.resume_id,
        job_id=evaluation.job_id,
        final_match_score=float(evaluation.final_match_score),
        dense_score=float(evaluation.dense_score),
        sparse_score=float(evaluation.sparse_score) if evaluation.sparse_score is not None else None,
        skill_overlap_score=float(evaluation.skill_overlap_score),
        experience_score=float(evaluation.experience_score),
        weights_version=evaluation.weights_version,
        status=evaluation.status or 'review',
        evaluated_at=evaluation.evaluated_at,
        job_title=job.title if job else 'Target Role',
        company=job.company if job else 'Target Organization',
        resume_filename=resume.original_filename if resume else 'Uploaded_Resume.pdf',
    )
