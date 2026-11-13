import json
import uuid

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import JobDescription
from app.models.match import GapRecommendation, MatchEvaluation
from app.models.resume import ResumeSection
from app.services.llm_gateway import generate_comprehensive_analysis


def _normalize_severity(sev: str) -> str:
    s = str(sev).lower().strip()
    if s in ['critical', 'high']:
        return 'critical'
    if s in ['moderate', 'medium']:
        return 'moderate'
    return 'minor'


async def analyze_comprehensive(db: AsyncSession, match_id: uuid.UUID) -> dict:
    """Run full Gemini analysis (strengths, weaknesses, gaps, summary) and store in DB."""
    # 1. Fetch match
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    match_eval = result.scalar_one_or_none()
    if not match_eval:
        raise ValueError('Match evaluation not found')

    # 2. Fetch Job
    job_res = await db.execute(select(JobDescription).where(JobDescription.id == match_eval.job_id))
    job = job_res.scalar_one_or_none()

    # 3. Fetch Resume Sections
    sec_res = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == match_eval.resume_id))
    sections = sec_res.scalars().all()

    resume_text = '\n\n'.join([f"[{s.section_type.upper()}]\n{s.redacted_text}" for s in sections])
    job_text = job.raw_text if job else ''

    # 4. Call Gemini Gateway (with 3.6 Flash -> Flash Lite fallback)
    analysis = await generate_comprehensive_analysis(resume_text, job_text)

    # 5. Store serialized analysis on MatchEvaluation
    match_eval.ai_analysis = json.dumps(analysis)

    # 6. Clean up any existing gaps for this match to prevent duplicates
    await db.execute(delete(GapRecommendation).where(GapRecommendation.match_evaluation_id == match_eval.id))

    # 7. Store individual roadmap gaps
    gaps_data = analysis.get('gaps', [])
    seen_skills = set()
    for fb in gaps_data:
        skill = fb.get('skill_name', 'General Domain Fit').strip()
        skill_key = skill.lower()
        if skill_key in seen_skills:
            continue
        seen_skills.add(skill_key)

        raw_sev = fb.get('severity', 'minor')
        gap = GapRecommendation(
            match_evaluation_id=match_eval.id,
            skill_name=skill,
            severity=_normalize_severity(raw_sev),
            target_proficiency=fb.get('target_proficiency', 'Intermediate'),
            estimated_hours=fb.get('estimated_hours', 30),
            llm_model_version=analysis.get('model_used', 'Gemini Flash AI'),
        )
        db.add(gap)

    await db.commit()
    return analysis


async def get_cached_or_generate_analysis(db: AsyncSession, match_id: uuid.UUID) -> dict:
    """Fetch existing comprehensive analysis if available, otherwise compute it."""
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    match_eval = result.scalar_one_or_none()
    if not match_eval:
        raise ValueError('Match evaluation not found')

    if match_eval.ai_analysis:
        try:
            return json.loads(match_eval.ai_analysis)
        except Exception:
            pass

    return await analyze_comprehensive(db, match_id)


async def analyze_gaps(db: AsyncSession, match_id: uuid.UUID) -> list[GapRecommendation]:
    """Compatibility function: ensures analysis is run and returns the GapRecommendation ORM list."""
    await analyze_comprehensive(db, match_id)
    res = await db.execute(
        select(GapRecommendation).where(GapRecommendation.match_evaluation_id == match_id)
    )
    return res.scalars().all()
