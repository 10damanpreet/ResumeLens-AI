from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    DATABASE_URL_SYNC: str
    REDIS_URL: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = 'HS256'
    JWT_EXPIRY_MINUTES: int = 60
    GEMINI_API_KEY: str = ''
    MINIMAX_API_KEY: str = ''
    DEBUG: bool = False
    APP_NAME: str = 'Resume Matcher'
    MAX_UPLOAD_SIZE_MB: int = 10

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

@lru_cache
def get_settings() -> Settings:
    return Settings()
