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
os.environ['DEBUG'] = 'true'
os.environ['APP_NAME'] = 'Resume Matcher Test'

from app.main import app  # noqa: E402


@fixture_decorator
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac
