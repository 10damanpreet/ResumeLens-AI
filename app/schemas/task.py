from datetime import datetime

from pydantic import BaseModel


class TaskStatusOut(BaseModel):
    """Status of an async task."""
    task_id: str
    task_type: str
    status: str  # queued | processing | completed | failed
    retry_count: int = 0
    error_message: str | None = None
    created_at: datetime
    completed_at: datetime | None = None
