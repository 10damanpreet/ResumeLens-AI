import uuid

import numpy as np
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import JobDescription
from app.models.match import MatchEvaluation
from app.models.resume import ResumeSection


def cosine_similarity(v1: list[float] | None, v2: list[float] | None) -> float:
    if not v1 or not v2:
        return 0.0
    vec1 = np.array(v1)
    vec2 = np.array(v2)
    norm = np.linalg.norm(vec1) * np.linalg.norm(vec2)
    if norm == 0:
        return 0.0
    return float(np.dot(vec1, vec2) / norm)

async def evaluate_match(db: AsyncSession, resume_id: uuid.UUID, job_id: uuid.UUID) -> MatchEvaluation:
    """Calculate the hybrid match score between a resume and a job description."""

    # 1. Fetch Resume Sections
    res_sections = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == resume_id))
    sections = res_sections.scalars().all()

    # 2. Fetch Job Description
    res_job = await db.execute(select(JobDescription).where(JobDescription.id == job_id))
    job = res_job.scalar_one_or_none()

    if not job or not sections:
        raise ValueError("Resume or Job not found, or Resume has no parsed sections.")

    # 3. Dense Similarity (Vector Math)
    # Compare job embedding to the "summary" or "work_experience" section embedding
    job_embedding = job.embedding or [0.0] * 384
    dense_scores = []

    for sec in sections:
        if sec.embedding:
            score = cosine_similarity(job_embedding, sec.embedding)
            dense_scores.append(score)

    avg_dense_score = sum(dense_scores) / len(dense_scores) if dense_scores else 0.0

    # 4. Skill Overlap (Sparse)
    # Placeholder for actual skill extraction/matching implementation
    skill_score = 0.5  # Mock value for now

    # 5. Experience Score
    exp_score = 0.5    # Mock value for now

    # 6. Final Weighted Calculation
    # Formula: w1(0.4)*Dense + w2(0.4)*Skill + w3(0.2)*Experience
    final_score = (0.4 * avg_dense_score) + (0.4 * skill_score) + (0.2 * exp_score)

    # 7. Save Evaluation
    evaluation = MatchEvaluation(
        resume_id=resume_id,
        job_id=job_id,
        final_match_score=round(final_score, 4),
        dense_score=round(avg_dense_score, 4),
        sparse_score=0.0,
        skill_overlap_score=round(skill_score, 4),
        experience_score=round(exp_score, 4),
        weights_version="1.0"
    )
    db.add(evaluation)
    await db.commit()
    await db.refresh(evaluation)

    return evaluation
