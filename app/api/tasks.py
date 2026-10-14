from fastapi import APIRouter

router = APIRouter()


@router.get('/{task_id}')
async def get_task_status(task_id: str):
    """Background task status — tasks run inline with FastAPI BackgroundTasks."""
    # Tasks are now processed inline via FastAPI BackgroundTasks (no Celery/Redis needed)
    return {
        'task_id': task_id,
        'status': 'processing',
        'message': 'Task is being processed in the background.',
    }
