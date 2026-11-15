import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    """Request body for user registration."""
    email: EmailStr
    password: str = Field(min_length=6, max_length=128, description="Password (6-128 chars)")
    role: str = "user"  # 'user' | 'recruiter'


class LoginRequest(BaseModel):
    """Request body for user login."""
    email: EmailStr
    password: str
    portal: str | None = None  # 'candidate' | 'recruiter'



class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    role: str = "user"


class RecruiterVerifyRequest(BaseModel):
    """Request to verify enterprise recruiter access key."""
    access_key: str


class CandidateOut(BaseModel):
    """Public candidate profile."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    role: str
    created_at: datetime
