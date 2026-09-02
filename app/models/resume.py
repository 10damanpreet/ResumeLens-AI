import uuid
from datetime import UTC, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Resume(Base):
    __tablename__ = 'resumes'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('candidates.id'), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_format: Mapped[str] = mapped_column(String(10), nullable=False)
    storage_path: Mapped[str] = mapped_column(Text, nullable=False)
    file_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    parse_status: Mapped[str] = mapped_column(String(20), nullable=False, default='queued')
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    candidate: Mapped['Candidate'] = relationship(back_populates='resumes')
    sections: Mapped[list['ResumeSection']] = relationship(back_populates='resume', cascade='all, delete-orphan')
    ats_report: Mapped['ATSReport'] = relationship(
        back_populates='resume', uselist=False, cascade='all, delete-orphan',
    )
    match_evaluations: Mapped[list['MatchEvaluation']] = relationship(
        back_populates='resume', cascade='all, delete-orphan',
    )


class ResumeSection(Base):
    __tablename__ = 'resume_sections'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('resumes.id'), nullable=False)
    section_type: Mapped[str] = mapped_column(String(30), nullable=False)
    redacted_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding = mapped_column(Vector(384), nullable=True)
    confidence_score: Mapped[float | None] = mapped_column(Numeric(4, 3), nullable=True)

    resume: Mapped['Resume'] = relationship(back_populates='sections')
    extracted_skills: Mapped[list['ExtractedSkill']] = relationship(
        back_populates='resume_section', cascade='all, delete-orphan',
    )
