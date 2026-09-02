import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobCreateRequest(BaseModel):
    """Request to create a job description."""
    title: str | None = None
    company: str | None = None
    raw_text: str = Field(min_length=50, description="Full job description text")


class JobOut(BaseModel):
    """Job description metadata."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str | None
    company: str | None
    required_years: float | None
    required_education: str | None
    created_at: datetime


class JobSkillOut(BaseModel):
    """A required skill from a job description."""
    model_config = ConfigDict(from_attributes=True)

    skill_name: str
    requirement_level: str  # required | preferred
