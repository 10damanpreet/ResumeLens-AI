import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.match import GapRecommendation
from app.schemas.match import GapRecommendationOut
from app.services.gap_analyzer import (
    analyze_comprehensive,
    analyze_gaps,
    get_cached_or_generate_analysis,
)

router = APIRouter()


@router.post('/{match_id}/analysis')
async def trigger_full_analysis(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Trigger fresh comprehensive Gemini analysis (strengths, weaknesses, gaps, summary)."""
    try:
        return await analyze_comprehensive(db, match_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{match_id}/analysis')
async def get_full_analysis(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve full AI analysis including executive summary, verified strengths, and weaknesses."""
    try:
        return await get_cached_or_generate_analysis(db, match_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post('/{match_id}/gaps', response_model=list[GapRecommendationOut])
async def generate_gaps(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Trigger the LLM to generate skill gap analysis for a specific match."""
    try:
        gaps = await analyze_gaps(db, match_id)
        return gaps
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{match_id}/gaps', response_model=list[GapRecommendationOut])
async def get_gaps(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    """Fetch previously generated skill gaps for a match."""
    result = await db.execute(
        select(GapRecommendation).where(GapRecommendation.match_evaluation_id == match_id)
    )
    return result.scalars().all()
