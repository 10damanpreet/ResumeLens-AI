import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ATSReport(Base):
    __tablename__ = 'ats_reports'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('resumes.id'), nullable=False, unique=True)
    parseability_score: Mapped[float] = mapped_column(Numeric(4, 3), nullable=False)
    # Use Text instead of JSONB for SQLite compatibility
    issues_json: Mapped[str] = mapped_column(Text, nullable=False, default='{}')
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    resume: Mapped['Resume'] = relationship(back_populates='ats_report')
