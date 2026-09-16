import uuid
from datetime import UTC, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class JobDescription(Base):
    __tablename__ = 'job_descriptions'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('candidates.id'), nullable=False)
    title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    company: Mapped[str | None] = mapped_column(String(200), nullable=True)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    required_years: Mapped[float | None] = mapped_column(Numeric(4, 1), nullable=True)
    required_education: Mapped[str | None] = mapped_column(String(50), nullable=True)
    embedding = mapped_column(Vector(384), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    candidate: Mapped['Candidate'] = relationship(back_populates='job_descriptions')
    required_skills: Mapped[list['JobRequiredSkill']] = relationship(back_populates='job', cascade='all, delete-orphan')
    match_evaluations: Mapped[list['MatchEvaluation']] = relationship(
        back_populates='job', cascade='all, delete-orphan',
    )


class JobRequiredSkill(Base):
    __tablename__ = 'job_required_skills'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('job_descriptions.id'), nullable=False)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    requirement_level: Mapped[str] = mapped_column(String(15), nullable=False)

    job: Mapped['JobDescription'] = relationship(back_populates='required_skills')
    skill: Mapped['SkillsTaxonomy'] = relationship()
