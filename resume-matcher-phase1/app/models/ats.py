import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ATSReport(Base):
    __tablename__ = 'ats_reports'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('resumes.id'), nullable=False, unique=True)
    parseability_score: Mapped[float] = mapped_column(Numeric(4, 3), nullable=False)
    issues_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    resume: Mapped['Resume'] = relationship(back_populates='ats_report')
