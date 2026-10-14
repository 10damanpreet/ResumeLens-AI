import json
import re
import uuid

import numpy as np
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import JobDescription
from app.models.match import MatchEvaluation
from app.models.resume import ResumeSection

# Comprehensive technology and skill dictionary for intelligent matching
SKILL_TAXONOMY = [
    'python', 'pandas', 'numpy', 'scikit-learn', 'sklearn', 'scipy', 'pytorch', 'tensorflow',
    'keras', 'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'sqlite', 'redis',
    'machine learning', 'deep learning', 'nlp', 'natural language processing', 'computer vision',
    'data science', 'data analysis', 'data analytics', 'data engineering', 'data pipelines',
    'tableau', 'power bi', 'spark', 'pyspark', 'hadoop', 'kafka', 'airflow', 'statistics',
    'mathematics', 'r', 'matlab', 'fastapi', 'flask', 'django', 'react', 'vue', 'angular',
    'node.js', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'cloud', 'git', 'github', 'ci/cd', 'linux', 'bash', 'c++', 'c#', 'java',
    'rest api', 'graphql', 'system design', 'agile', 'scrum'
]


def cosine_similarity(v1: list[float] | None, v2: list[float] | None) -> float:
    if not v1 or not v2:
        return 0.0
    vec1 = np.array(v1)
    vec2 = np.array(v2)
    norm = np.linalg.norm(vec1) * np.linalg.norm(vec2)
    if norm == 0:
        return 0.0
    return float(np.dot(vec1, vec2) / norm)


def _parse_embedding(embedding_field) -> list[float] | None:
    """Parse embedding from either JSON string (SQLite) or list (PostgreSQL)."""
    if embedding_field is None:
        return None
    if isinstance(embedding_field, str):
        try:
            return json.loads(embedding_field)
        except (json.JSONDecodeError, ValueError):
            return None
    if isinstance(embedding_field, list):
        return embedding_field
    return None


def _extract_matched_skills(text: str) -> set[str]:
    """Find known tech skills present in text using boundary-safe search."""
    text_lower = text.lower()
    found = set()
    for skill in SKILL_TAXONOMY:
        # Match as full word or phrase
        pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
        if re.search(pattern, text_lower):
            found.add(skill)
    return found


def _calculate_experience_fit(resume_text: str, job_text: str) -> float:
    """Estimate experience fit based on seniority terms, project volume, and years."""
    res_lower = resume_text.lower()
    job_lower = job_text.lower()

    # Look for years in job description
    years_match = re.search(r'(\d+)\+?\s*(?:years?|yrs?)', job_lower)
    required_years = int(years_match.group(1)) if years_match else 2

    # Check candidate seniority signals
    candidate_years_matches = re.findall(r'(\d+)\+?\s*(?:years?|yrs?)', res_lower)
    candidate_years = max([int(y) for y in candidate_years_matches], default=2)

    if candidate_years >= required_years:
        base_exp = 0.85
    else:
        ratio = max(0.4, candidate_years / max(required_years, 1))
        base_exp = min(0.85, ratio)

    # Bonus if candidate has projects / work experience
    if 'project' in res_lower or 'experience' in res_lower:
        base_exp = min(1.0, base_exp + 0.1)

    return round(base_exp, 2)


async def evaluate_match(db: AsyncSession, resume_id: uuid.UUID, job_id: uuid.UUID) -> MatchEvaluation:
    """Calculate the hybrid match score between a resume and a job description."""

    # 1. Fetch Resume Sections
    res_sections = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == resume_id))
    sections = res_sections.scalars().all()

    # 2. Fetch Job Description
    res_job = await db.execute(select(JobDescription).where(JobDescription.id == job_id))
    job = res_job.scalar_one_or_none()

    if not job or not sections:
        raise ValueError('Resume or Job not found, or Resume has no parsed sections.')

    # 3. Dense Similarity (Vector Math)
    job_embedding = _parse_embedding(job.embedding) or [0.0] * 384
    dense_scores = []

    for sec in sections:
        sec_embedding = _parse_embedding(sec.embedding)
        if sec_embedding:
            score = cosine_similarity(job_embedding, sec_embedding)
            # Clip cosine similarity between 0 and 1 for positive score interpretation
            dense_scores.append(max(0.0, score))

    avg_dense_score = max(dense_scores) if dense_scores else 0.0

    # 4. Accurate Skill Overlap (Sparse extraction)
    full_resume_text = ' '.join([s.redacted_text for s in sections])
    job_skills = _extract_matched_skills(job.raw_text)
    resume_skills = _extract_matched_skills(full_resume_text)

    if job_skills:
        overlap = job_skills.intersection(resume_skills)
        skill_score = min(1.0, max(0.2, len(overlap) / len(job_skills)))
    else:
        # If job text has no specific tech keywords, fallback to general semantic fit
        skill_score = max(0.5, avg_dense_score)

    # 5. Experience Score
    exp_score = _calculate_experience_fit(full_resume_text, job.raw_text)

    # 6. Final Weighted Score: 0.4*Dense + 0.4*Skill + 0.2*Experience
    final_score = (0.4 * avg_dense_score) + (0.4 * skill_score) + (0.2 * exp_score)
    final_score = min(1.0, max(0.05, final_score))

    # 7. Save Evaluation
    evaluation = MatchEvaluation(
        resume_id=resume_id,
        job_id=job_id,
        final_match_score=round(final_score, 4),
        dense_score=round(avg_dense_score, 4),
        sparse_score=0.0,
        skill_overlap_score=round(skill_score, 4),
        experience_score=round(exp_score, 4),
        weights_version='2.0',
    )
    db.add(evaluation)
    await db.commit()
    await db.refresh(evaluation)

    return evaluation
