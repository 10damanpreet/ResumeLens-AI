from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database — defaults to local SQLite (no install needed)
    DATABASE_URL: str = 'sqlite+aiosqlite:///./resumematcher.db'
    DATABASE_URL_SYNC: str = 'sqlite:///./resumematcher.db'

    # JWT Auth
    JWT_SECRET_KEY: str = 'dev-secret-key-change-in-production-please'
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRY_MINUTES: int = 60

    # LLM Keys (optional — falls back to mock data if empty)
    GEMINI_API_KEY: str = ''
    MINIMAX_API_KEY: str = ''

    # App
    DEBUG: bool = False
    APP_NAME: str = 'ResumeMatcher AI'
    MAX_UPLOAD_SIZE_MB: int = 10

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')


@lru_cache
def get_settings() -> Settings:
    return Settings()
