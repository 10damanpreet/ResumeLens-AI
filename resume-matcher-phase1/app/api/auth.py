from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.candidate import Candidate
from app.schemas.auth import CandidateOut, LoginRequest, RegisterRequest, TokenResponse

router = APIRouter()


@router.post('/register', response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new candidate account."""
    # Check if email already exists
    existing = await db.execute(select(Candidate).where(Candidate.email == request.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Email already registered',
        )

    # Create new candidate
    candidate = Candidate(
        email=request.email,
        password_hash=hash_password(request.password),
    )
    db.add(candidate)
    await db.commit()
    await db.refresh(candidate)
    return candidate


@router.post('/login', response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login and receive a JWT access token."""
    result = await db.execute(select(Candidate).where(Candidate.email == request.email))
    candidate = result.scalar_one_or_none()

    if not candidate or not verify_password(request.password, candidate.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password',
        )

    token = create_access_token(data={'sub': str(candidate.id), 'role': candidate.role})
    return TokenResponse(access_token=token)


@router.get('/me', response_model=CandidateOut)
async def get_me(current_user: Candidate = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    return current_user
