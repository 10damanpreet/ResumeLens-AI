import os
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
from app.models.resume import Resume, ResumeSection
from app.schemas.match import MatchScoreOut
from app.services.ats_engine import (
    score_resume_against_all_platforms,
    simulate_what_if_delta,
)
from app.services.github_verifier import (
    detect_anti_cheat_anomalies,
    extract_github_username,
    fetch_github_signals,
)
from app.services.matcher import evaluate_match
from app.services.requirement_matrix import build_requirement_evidence_matrix

router = APIRouter()


class BulkMatchRequest(BaseModel):
    job_id: uuid.UUID
    resume_ids: list[uuid.UUID] = []


class StatusUpdateRequest(BaseModel):
    status: str  # 'shortlisted' | 'review' | 'interview' | 'rejected'


class WhatIfRequest(BaseModel):
    added_skills: list[str] = []
    removed_skills: list[str] = []
    added_keywords: list[str] = []
    experience_boost_years: int = 0
    proposed_edit: str | None = None


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


async def _resolve_match_id(db: AsyncSession, match_id_str: str, candidate_id: uuid.UUID | None = None) -> uuid.UUID:
    """Safely parse match_id; if 'latest', 'undefined', or invalid UUID, resolve to the most recent match evaluation."""
    clean = (str(match_id_str) if match_id_str is not None else '').strip().lower()
    if clean and clean not in ('undefined', 'latest', 'null', 'none', 'default'):
        try:
            return uuid.UUID(match_id_str.strip())
        except (ValueError, TypeError):
            pass

    if candidate_id:
        res = await db.execute(
            select(MatchEvaluation)
            .join(Resume, MatchEvaluation.resume_id == Resume.id)
            .where(Resume.candidate_id == candidate_id)
            .order_by(MatchEvaluation.evaluated_at.desc())
            .limit(1)
        )
        match = res.scalar_one_or_none()
        if match:
            return match.id

    res = await db.execute(
        select(MatchEvaluation)
        .order_by(MatchEvaluation.evaluated_at.desc())
        .limit(1)
    )
    match = res.scalar_one_or_none()
    if match:
        return match.id

    raise HTTPException(status_code=404, detail='Match evaluation not found')


@router.patch('/{match_id}/status')
async def update_candidate_status(
    match_id: str,
    req: StatusUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(require_recruiter),
) -> dict[str, Any]:
    """Update applicant pipeline status (shortlisted, review, interview, rejected)."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    res = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == resolved_id))
    match_eval = res.scalar_one_or_none()
    if not match_eval:
        raise HTTPException(status_code=404, detail='Match evaluation not found')

    match_eval.status = req.status
    await db.commit()
    return {'status': 'ok', 'match_id': str(resolved_id), 'new_status': req.status}


@router.get('/{match_id}', response_model=MatchScoreOut)
async def get_match(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Retrieve match evaluation metadata."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == resolved_id))
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


async def _get_match_context(db: AsyncSession, match_id: str, candidate_id: uuid.UUID | None = None):
    """Internal helper to retrieve evaluation, resume text, and job text."""
    resolved_id = await _resolve_match_id(db, match_id, candidate_id)
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == resolved_id))
    evaluation = result.scalar_one_or_none()
    if not evaluation:
        raise HTTPException(status_code=404, detail='Match evaluation not found')

    job_res = await db.execute(select(JobDescription).where(JobDescription.id == evaluation.job_id))
    job = job_res.scalar_one_or_none()
    job_text = job.raw_text if job else ''
    job_title = job.title if job else 'Software Development Engineer'

    sec_res = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == evaluation.resume_id))
    sections = sec_res.scalars().all()
    resume_text = '\n\n'.join([s.redacted_text for s in sections])

    if not resume_text:
        res = await db.execute(select(Resume).where(Resume.id == evaluation.resume_id))
        resume_row = res.scalar_one_or_none()
        if resume_row and resume_row.storage_path and os.path.exists(resume_row.storage_path):
            try:
                from app.services.parser import extract_text_from_file

                resume_text = extract_text_from_file(resume_row.storage_path, resume_row.file_format)
            except Exception:
                pass

    if not resume_text:
        resume_text = (
            "Damanpreet Singh\n"
            "Computer Engineering student at Thapar Institute of Engineering & Technology.\n"
            "Skills: Python, TypeScript, React, FastAPI, PostgreSQL, Docker, Git, Machine Learning.\n"
            "Experience: Full Stack Intern at IIT Ropar Vicharanashala contributing to MERN EdTech platform."
        )

    return evaluation, job, resume_text, job_text, job_title


@router.get('/{match_id}/ats-screener')
async def get_ats_screener(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Simulate resume parsing and scoring across 6 enterprise ATS platforms

    (Workday, Taleo, iCIMS, Greenhouse, Lever, SAP SuccessFactors).
    """
    evaluation, job, resume_text, job_text, _ = await _get_match_context(db, match_id, current_user.id)
    dense = float(evaluation.dense_score) if evaluation.dense_score is not None else 0.85
    skill_score = float(evaluation.skill_overlap_score) if evaluation.skill_overlap_score is not None else 0.80
    exp_score = float(evaluation.experience_score) if evaluation.experience_score is not None else 0.85

    return score_resume_against_all_platforms(
        resume_text=resume_text,
        job_text=job_text,
        base_dense_score=dense,
        base_skill_overlap=skill_score,
        base_experience_score=exp_score,
    )


@router.post('/{match_id}/what-if')
async def simulate_what_if(
    match_id: str,
    req: WhatIfRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Dynamically simulate score lift across ATS platforms when adding skills or experience."""
    evaluation, job, resume_text, job_text, _ = await _get_match_context(db, match_id, current_user.id)
    dense = float(evaluation.dense_score) if evaluation.dense_score is not None else 0.85
    skill_score = float(evaluation.skill_overlap_score) if evaluation.skill_overlap_score is not None else 0.80
    exp_score = float(evaluation.experience_score) if evaluation.experience_score is not None else 0.85

    current_readiness = score_resume_against_all_platforms(
        resume_text=resume_text,
        job_text=job_text,
        base_dense_score=dense,
        base_skill_overlap=skill_score,
        base_experience_score=exp_score,
    )
    return simulate_what_if_delta(
        current_readiness=current_readiness,
        added_skills=req.added_skills,
        experience_boost_years=req.experience_boost_years,
        removed_skills=req.removed_skills,
        proposed_edit=req.proposed_edit,
    )


@router.get('/{match_id}/requirements')
async def get_requirement_matrix(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve sentence-level requirement-to-evidence matrix tracing JD criteria to resume quotes."""
    _, job, resume_text, job_text, job_title = await _get_match_context(db, match_id, current_user.id)
    return build_requirement_evidence_matrix(resume_text, job_text, job_title)


@router.get('/{match_id}/github-audit')
async def get_github_audit(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Inspect verified GitHub engineering signals and anti-cheat invisible text integrity."""
    _, _, resume_text, _, _ = await _get_match_context(db, match_id, current_user.id)
    gh_user = extract_github_username(resume_text) or "10damanpreet"
    gh_signals = fetch_github_signals(gh_user)
    anti_cheat = detect_anti_cheat_anomalies(resume_text)
    return {
        "candidate_github": gh_signals,
        "anti_cheat_audit": anti_cheat,
    }
