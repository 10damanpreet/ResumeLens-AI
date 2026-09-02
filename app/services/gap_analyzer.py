import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import JobDescription
from app.models.match import GapRecommendation, MatchEvaluation
from app.models.resume import ResumeSection
from app.services.llm_gateway import generate_skill_gap_feedback


async def analyze_gaps(db: AsyncSession, match_id: uuid.UUID) -> list[GapRecommendation]:
    """Fetch texts, call LLM for gap analysis, and store recommendations."""

    # 1. Fetch match
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    match_eval = result.scalar_one_or_none()
    if not match_eval:
        raise ValueError("Match evaluation not found")

    # 2. Fetch Job
    job_res = await db.execute(select(JobDescription).where(JobDescription.id == match_eval.job_id))
    job = job_res.scalar_one_or_none()

    # 3. Fetch Resume Sections
    sec_res = await db.execute(select(ResumeSection).where(ResumeSection.resume_id == match_eval.resume_id))
    sections = sec_res.scalars().all()

    resume_text = "\n".join([s.redacted_text for s in sections])
    job_text = job.raw_text if job else ""

    # 4. Call LLM
    feedbacks = await generate_skill_gap_feedback(resume_text, job_text)

    # 5. Save Gaps to DB
    gaps = []
    for fb in feedbacks:
        gap = GapRecommendation(
            match_evaluation_id=match_eval.id,
            skill_name=fb.get("skill_name", "Unknown"),
            severity=fb.get("severity", "minor"),
            llm_model_version="gemini-1.5-flash"
        )
        db.add(gap)
        gaps.append(gap)

    await db.commit()
    for gap in gaps:
        await db.refresh(gap)

    return gaps
