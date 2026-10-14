import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import JobDescription
from app.models.match import GapRecommendation, MatchEvaluation
from app.models.resume import ResumeSection
from app.services.llm_gateway import generate_skill_gap_feedback


def _normalize_severity(sev: str) -> str:
    s = str(sev).lower().strip()
    if s in ['critical', 'high']:
        return 'critical'
    if s in ['moderate', 'medium']:
        return 'moderate'
    return 'minor'


async def analyze_gaps(db: AsyncSession, match_id: uuid.UUID) -> list[GapRecommendation]:
    """Fetch texts, call Gemini LLM for specific gap analysis, and store recommendations."""

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

    # 4. Call Gemini
    feedbacks = await generate_skill_gap_feedback(resume_text, job_text)

    # 5. Save Gaps to DB with full details (hours, proficiency, normalized severity)
    gaps = []
    for fb in feedbacks:
        raw_sev = fb.get('severity', 'minor')
        gap = GapRecommendation(
            match_evaluation_id=match_eval.id,
            skill_name=fb.get('skill_name', 'General Domain Fit'),
            severity=_normalize_severity(raw_sev),
            target_proficiency=fb.get('target_proficiency', 'Intermediate'),
            estimated_hours=fb.get('estimated_hours', 30),
            llm_model_version='gemini-3.8-flash',
        )
        db.add(gap)
        gaps.append(gap)

    await db.commit()
    for gap in gaps:
        await db.refresh(gap)

    return gaps
