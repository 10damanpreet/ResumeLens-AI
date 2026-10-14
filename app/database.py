from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

# SQLite-compatible async engine
connect_args = {}
if 'sqlite' in settings.DATABASE_URL:
    connect_args = {'check_same_thread': False}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args=connect_args,
)
async_session_factory = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        # pgvector extension only needed for PostgreSQL — skip for SQLite
        if 'postgresql' in settings.DATABASE_URL:
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS vector;'))
        await conn.run_sync(Base.metadata.create_all)
