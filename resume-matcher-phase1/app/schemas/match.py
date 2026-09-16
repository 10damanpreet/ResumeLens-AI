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

    skill_name: str
    severity: str  # critical | moderate | minor
    target_proficiency: str | None
    course_title: str | None
    course_url: str | None
    course_provider: str | None
    estimated_hours: int | None


class GapReportOut(BaseModel):
    """Complete skill gap analysis report."""
    match_id: uuid.UUID
    final_match_score: float
    total_gaps: int
    critical_count: int
    moderate_count: int
    minor_count: int
    gaps: list[GapRecommendationOut]
