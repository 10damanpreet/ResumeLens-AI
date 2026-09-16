import uuid
from datetime import UTC, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CourseCatalog(Base):
    __tablename__ = 'course_catalog'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    provider: Mapped[str | None] = mapped_column(String(80), nullable=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    skill_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=True)
    syllabus_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    syllabus_embedding = mapped_column(Vector(384), nullable=True)
    verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    skill: Mapped['SkillsTaxonomy'] = relationship()
