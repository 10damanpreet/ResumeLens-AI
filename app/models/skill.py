import uuid
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SkillsTaxonomy(Base):
    __tablename__ = 'skills_taxonomy'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    canonical_name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    source: Mapped[str] = mapped_column(String(20), nullable=False)
    category: Mapped[str | None] = mapped_column(String(80), nullable=True)

    aliases: Mapped[list['SkillAlias']] = relationship(back_populates='skill', cascade='all, delete-orphan')
    relations: Mapped[list['SkillRelation']] = relationship(
        'SkillRelation',
        primaryjoin='SkillsTaxonomy.id == SkillRelation.skill_id',
        back_populates='skill',
        cascade='all, delete-orphan'
    )

class SkillAlias(Base):
    __tablename__ = 'skill_aliases'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    alias_text: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)

    skill: Mapped['SkillsTaxonomy'] = relationship(back_populates='aliases')

class SkillRelation(Base):
    __tablename__ = 'skill_relations'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    related_skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    relation_strength: Mapped[float] = mapped_column(Numeric(4, 3), nullable=False)

    skill: Mapped['SkillsTaxonomy'] = relationship(
        'SkillsTaxonomy',
        foreign_keys=[skill_id],
        back_populates='relations'
    )
    related_skill: Mapped['SkillsTaxonomy'] = relationship(
        'SkillsTaxonomy',
        foreign_keys=[related_skill_id]
    )

class ExtractedSkill(Base):
    __tablename__ = 'extracted_skills'

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resume_section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('resume_sections.id'), nullable=False)
    skill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey('skills_taxonomy.id'), nullable=False)
    raw_mention: Mapped[str | None] = mapped_column(String(150), nullable=True)
    extracted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    resume_section: Mapped['ResumeSection'] = relationship(back_populates='extracted_skills')
    skill: Mapped['SkillsTaxonomy'] = relationship()
