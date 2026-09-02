import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

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

from app.main import app  # noqa: E402


@pytest_asyncio.fixture
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac


def _db_is_available():
    """Check if PostgreSQL is reachable (for integration tests)."""
    try:
        import asyncio
        from sqlalchemy import text
        from sqlalchemy.ext.asyncio import create_async_engine
        engine = create_async_engine(os.environ['DATABASE_URL'])

        async def _check():
            async with engine.connect() as conn:
                await conn.execute(text('SELECT 1'))
            await engine.dispose()

        asyncio.get_event_loop().run_until_complete(_check())
        return True
    except Exception:
        return False


requires_db = pytest.mark.skipif(
    not _db_is_available(),
    reason='PostgreSQL is not available'
)
