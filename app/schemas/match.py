import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MatchRequest(BaseModel):
    """Request to compute a match."""
    resume_id: uuid.UUID
    job_id: uuid.UUID


class MatchScoreOut(BaseModel):
    """Full match evaluation result."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    resume_id: uuid.UUID
    job_id: uuid.UUID
    final_match_score: float
    dense_score: float
    sparse_score: float | None = None
    skill_overlap_score: float
    experience_score: float
    weights_version: str
    evaluated_at: datetime


class GapRecommendationOut(BaseModel):
    """A single skill gap recommendation."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    skill_name: str | None
    severity: str  # critical | moderate | minor
    target_proficiency: str | None = None
    estimated_hours: int | None = None
    llm_model_version: str | None = None
