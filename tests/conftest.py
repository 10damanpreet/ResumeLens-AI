import asyncio
import os

import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Set test environment variables BEFORE importing app
os.environ['DATABASE_URL'] = os.environ.get(
    'DATABASE_URL',
    'postgresql+asyncpg://postgres:postgres@localhost:5432/resume_matcher_test'
)
os.environ['DATABASE_URL_SYNC'] = os.environ.get(
    'DATABASE_URL_SYNC',
    'postgresql://postgres:postgres@localhost:5432/resume_matcher_test'
)
os.environ['REDIS_URL'] = os.environ.get('REDIS_URL', 'redis://localhost:6379/1')
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-for-testing'
os.environ['JWT_ALGORITHM'] = 'HS256'
os.environ['JWT_EXPIRY_MINUTES'] = '60'
os.environ['DEBUG'] = 'true'
os.environ['APP_NAME'] = 'Resume Matcher Test'

from app.config import get_settings  # noqa: E402
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

settings = get_settings()

# Create test engine
test_engine = create_async_engine(settings.DATABASE_URL, echo=False)
test_session_factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with test_session_factory() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(scope='session')
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope='session', autouse=True)
async def setup_database():
    """Create all tables before tests, drop after."""
    async with test_engine.begin() as conn:
        # Create pgvector extension if it exists (skip if not available)
        try:
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS vector'))
        except Exception:
            pass  # pgvector not available in test env, tests will still work for non-vector features
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture
async def db_session():
    """Provide a transactional database session for each test."""
    async with test_session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac
