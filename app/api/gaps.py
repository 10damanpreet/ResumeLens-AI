import logging
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.match import GapRecommendation, MatchEvaluation
from app.models.resume import Resume
from app.schemas.match import GapRecommendationOut
from app.services.gap_analyzer import (
    analyze_comprehensive,
    analyze_gaps,
    get_cached_or_generate_analysis,
)

logger = logging.getLogger(__name__)
router = APIRouter()


async def _resolve_match_id(db: AsyncSession, match_id_str: str, candidate_id: uuid.UUID | None = None) -> uuid.UUID:
    """Safely parse match_id; if 'latest', 'undefined', or invalid UUID, resolve to the most recent match evaluation."""
    clean = (str(match_id_str) if match_id_str is not None else '').strip().lower()
    if clean and clean not in ('undefined', 'latest', 'null', 'none', 'default'):
        try:
            return uuid.UUID(match_id_str.strip())
        except (ValueError, TypeError):
            pass

    # Fallback to latest match for current user
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

    # Fallback to any latest match evaluation in the database
    res = await db.execute(
        select(MatchEvaluation)
        .order_by(MatchEvaluation.evaluated_at.desc())
        .limit(1)
    )
    match = res.scalar_one_or_none()
    if match:
        return match.id

    raise HTTPException(status_code=404, detail='No match evaluation found. Please evaluate a resume first.')


@router.post('/{match_id}/analysis')
async def trigger_full_analysis(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Trigger fresh comprehensive Gemini analysis (strengths, weaknesses, gaps, summary)."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    try:
        return await analyze_comprehensive(db, resolved_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.warning(f'Analysis execution exception: {e}; returning cached or default analysis.')
        return await get_cached_or_generate_analysis(db, resolved_id)


@router.get('/{match_id}/analysis')
async def get_full_analysis(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve full AI analysis including executive summary, verified strengths, and weaknesses."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    try:
        return await get_cached_or_generate_analysis(db, resolved_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post('/{match_id}/gaps', response_model=list[GapRecommendationOut])
async def generate_gaps(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Trigger the LLM to generate skill gap analysis for a specific match."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    try:
        gaps = await analyze_gaps(db, resolved_id)
        return gaps
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{match_id}/gaps', response_model=list[GapRecommendationOut])
async def get_gaps(
    match_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Fetch previously generated skill gaps for a match."""
    resolved_id = await _resolve_match_id(db, match_id, current_user.id)
    result = await db.execute(
        select(GapRecommendation).where(GapRecommendation.match_evaluation_id == resolved_id)
    )
    return result.scalars().all()
