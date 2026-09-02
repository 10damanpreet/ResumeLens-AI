from app.worker.celery_app import celery_app


def test_celery_app_initialization():
    assert celery_app.main == "resume_matcher"
    assert celery_app.conf.timezone == "UTC"
