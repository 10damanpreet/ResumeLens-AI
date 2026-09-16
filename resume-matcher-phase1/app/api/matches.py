import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.match import MatchScoreOut

router = APIRouter()

@router.post("", response_model=MatchScoreOut)
async def create_match(
    resume_id: uuid.UUID,
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    try:
        # --- PHASE 1 MOCK ---
        # Instead of running the actual Sentence-BERT and Cosine Similarity (Phase 2),
        # we return a highly realistic mock result for the mid-term presentation.

        mock_eval = MatchEvaluation(
            resume_id=resume_id,
            job_id=job_id,
            dense_score=0.74,
            skill_score=0.82,
            exp_score=0.90,
            hybrid_score=0.80,
            weights_version="phase1_mock"
        )
        db.add(mock_eval)
        await db.commit()
        await db.refresh(mock_eval)

        return mock_eval
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
