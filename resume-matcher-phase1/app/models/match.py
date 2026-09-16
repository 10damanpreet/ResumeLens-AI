import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MatchEvaluation(Base):
    __tablename__ = 'match_evaluations'
    __table_args__ = (UniqueConstraint('resume_id', 'job_id', name='uq_resume_job'),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('resumes.id'), nullable=False)
    job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('job_descriptions.id'), nullable=False)
    dense_score: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    sparse_score: Mapped[float | None] = mapped_column(Numeric(5, 4), nullable=True)
    skill_overlap_score: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    experience_score: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    final_match_score: Mapped[float] = mapped_column(Numeric(5, 4), nullable=False)
    weights_version: Mapped[str] = mapped_column(String(50), nullable=False)
    evaluated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    resume: Mapped['Resume'] = relationship(back_populates='match_evaluations')
    job: Mapped['JobDescription'] = relationship(back_populates='match_evaluations')
    gap_recommendations: Mapped[list['GapRecommendation']] = relationship(
        back_populates='match_evaluation', cascade='all, delete-orphan',
    )


class GapRecommendation(Base):
    __tablename__ = 'gap_recommendations'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    match_evaluation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('match_evaluations.id'), nullable=False)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    severity: Mapped[str] = mapped_column(String(10), nullable=False)
    target_proficiency: Mapped[str | None] = mapped_column(String(30), nullable=True)
    course_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey('course_catalog.id'), nullable=True)
    estimated_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    llm_model_version: Mapped[str | None] = mapped_column(String(40), nullable=True)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    match_evaluation: Mapped['MatchEvaluation'] = relationship(back_populates='gap_recommendations')
    skill: Mapped['SkillsTaxonomy'] = relationship()
    course: Mapped['CourseCatalog'] = relationship()
