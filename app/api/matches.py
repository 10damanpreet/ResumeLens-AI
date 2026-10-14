import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.candidate import Candidate
from app.models.match import MatchEvaluation
from app.schemas.match import MatchScoreOut
from app.services.matcher import evaluate_match

router = APIRouter()


@router.post('', response_model=MatchScoreOut)
async def create_match(
    resume_id: uuid.UUID,
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    try:
        evaluation = await evaluate_match(db, resume_id, job_id)
        return evaluation
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get('/{match_id}', response_model=MatchScoreOut)
async def get_match(
    match_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Candidate = Depends(get_current_user),
):
    result = await db.execute(select(MatchEvaluation).where(MatchEvaluation.id == match_id))
    evaluation = result.scalar_one_or_none()
    if not evaluation:
        raise HTTPException(status_code=404, detail='Match evaluation not found')
    return evaluation
