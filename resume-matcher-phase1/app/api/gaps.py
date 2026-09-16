import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.match import GapRecommendation

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
    # --- PHASE 1 MOCK ---
    # Instead of calling Google Gemini (Phase 2), we inject mock skill gaps.
    mock_gaps = [
        GapRecommendation(
            evaluation_id=match_id,
            skill_name="Docker Containerization",
            severity="critical",
            current_level="None mentioned in resume",
            required_level="Required for deployment in the job description",
            recommendation="Review the official Docker getting started guide and build a small containerized app."
        ),
        GapRecommendation(
            evaluation_id=match_id,
            skill_name="AWS Cloud Services",
            severity="moderate",
            current_level="Mentions basic cloud exposure",
            required_level="Prefers experience with AWS EC2/S3",
            recommendation="Consider the AWS Cloud Practitioner certification path."
        )
    ]

    db.add_all(mock_gaps)
    await db.commit()

    # Return them in Pydantic schema format
    return [
        GapRecommendationOut(
            id=gap.id,
            skill_name=gap.skill_name,
            severity=gap.severity,
            current_level=gap.current_level,
            required_level=gap.required_level,
            recommendation=gap.recommendation
        ) for gap in mock_gaps
    ]

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
