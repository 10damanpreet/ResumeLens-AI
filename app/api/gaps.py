import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.match import GapRecommendation
from app.services.gap_analyzer import analyze_gaps

router = APIRouter()

class GapOut(BaseModel):
    id: uuid.UUID
    skill_name: str | None
    severity: str
    model_config = ConfigDict(from_attributes=True)

@router.post("/{match_id}/gaps", response_model=list[GapOut])
async def generate_gaps(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user)
):
    """Trigger the LLM to generate skill gap analysis for a specific match."""
    try:
        gaps = await analyze_gaps(db, match_id)
        return gaps
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{match_id}/gaps", response_model=list[GapOut])
async def get_gaps(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user)
):
    """Fetch previously generated skill gaps for a match."""
    result = await db.execute(
        select(GapRecommendation).where(GapRecommendation.match_evaluation_id == match_id)
    )
    return result.scalars().all()
