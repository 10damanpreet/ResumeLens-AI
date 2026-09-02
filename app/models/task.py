import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TaskLog(Base):
    __tablename__ = 'task_logs'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    task_id: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    task_type: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    candidate_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey('candidates.id'), nullable=True)
    resume_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey('resumes.id'), nullable=True)
    job_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey('job_descriptions.id'), nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
