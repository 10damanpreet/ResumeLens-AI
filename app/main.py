from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.gaps import router as gaps_router
from app.api.health import router as health_router
from app.api.jobs import router as jobs_router
from app.api.matches import router as matches_router
from app.api.resumes import router as resumes_router
from app.api.tasks import router as tasks_router
from app.config import get_settings
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description='Intelligent Resume <-> Job Matching & Skill Gap Advisory System',
    version='0.1.0',
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Restrict in production
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Register routers
app.include_router(health_router, tags=['Health'])
app.include_router(auth_router, prefix='/auth', tags=['Authentication'])
app.include_router(resumes_router, prefix='/resumes', tags=['Resumes'])
app.include_router(jobs_router, prefix='/jobs', tags=['Jobs'])
app.include_router(tasks_router, prefix='/tasks', tags=['Tasks'])
app.include_router(matches_router, prefix='/matches', tags=['Matches'])
app.include_router(gaps_router, prefix='/matches', tags=['Gaps Analysis'])
