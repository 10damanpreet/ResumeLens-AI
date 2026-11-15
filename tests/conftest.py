import os

import pytest
from httpx import ASGITransport, AsyncClient

try:
    import pytest_asyncio

    fixture_decorator = pytest_asyncio.fixture
except ImportError:
    fixture_decorator = pytest.fixture

# Set test environment variables BEFORE importing app
os.environ['DATABASE_URL'] = os.environ.get(
    'DATABASE_URL',
    'sqlite+aiosqlite:///./test.db',
)
os.environ['DATABASE_URL_SYNC'] = os.environ.get(
    'DATABASE_URL_SYNC',
    'sqlite:///./test.db',
)
os.environ['REDIS_URL'] = os.environ.get('REDIS_URL', 'redis://localhost:6379/1')
os.environ['JWT_SECRET_KEY'] = 'test-secret-key-for-testing'
os.environ['JWT_ALGORITHM'] = 'HS256'
os.environ['JWT_EXPIRY_MINUTES'] = '60'
os.environ['DEBUG'] = 'false'
os.environ['APP_NAME'] = 'Resume Matcher Test'

import app.models  # noqa: E402, F401
from app.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@fixture_decorator(autouse=True)
async def setup_test_database():
    """Ensure a clean, isolated database schema for every test."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@fixture_decorator
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac
