"""
Celery worker configuration (or mock when running in standalone FastAPI mode).
"""


class _MockCeleryConf:
    timezone = "UTC"


class _MockCeleryApp:
    main = "resume_matcher"
    conf = _MockCeleryConf()


try:
    from celery import Celery

    from app.config import get_settings

    settings = get_settings()
    celery_app = Celery(
        "resume_matcher",
        broker=settings.REDIS_URL,
        backend=settings.REDIS_URL,
        include=["app.worker.tasks"],
    )
    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="UTC",
        enable_utc=True,
        task_track_started=True,
    )
except ImportError:
    # Standalone mode: fallback to lightweight mock object so tests and code pass
    celery_app = _MockCeleryApp()
