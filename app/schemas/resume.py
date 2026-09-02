import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResumeUploadResponse(BaseModel):
    resume_id: uuid.UUID
    parse_status: str
    message: str
    task_id: str | None = None


class ResumeSectionOut(BaseModel):
    """A parsed resume section."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    section_type: str
    redacted_text: str
    confidence_score: float | None = None


class ResumeOut(BaseModel):
    """Resume metadata."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    original_filename: str
    file_format: str
    parse_status: str
    uploaded_at: datetime
