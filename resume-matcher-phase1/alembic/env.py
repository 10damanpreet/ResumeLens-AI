from logging.config import fileConfig

from sqlalchemy.engine import Connection

from alembic import context
from app.config import get_settings

# Import all models so alembic sees them
from app.models import Base  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

settings = get_settings()
# Override sqlalchemy.url with our actual database URL (sync version for alembic)
config.set_main_option('sqlalchemy.url', settings.DATABASE_URL_SYNC)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations in 'online' mode using async engine."""
    # For online migrations, we use the sync URL through alembic's config
    from sqlalchemy import create_engine
    connectable = create_engine(config.get_main_option('sqlalchemy.url'))

    with connectable.connect() as connection:
        do_run_migrations(connection)

    connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Use sync engine for alembic migrations
    from sqlalchemy import create_engine
    connectable = create_engine(config.get_main_option('sqlalchemy.url'))

    with connectable.connect() as connection:
        do_run_migrations(connection)

    connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
