from logging.config import fileConfig
from sqlalchemy import pool
from alembic import context
import os
import sys

from sqlalchemy.ext.asyncio import create_async_engine
from db.database import Base
from db.models import *

# Ajout du path du projet
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

config = context.config

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata
target_metadata = Base.metadata

# 🔥 Récupère l'URL depuis l'ENV Render
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise Exception("DATABASE_URL environment variable is not set!")

# 🔥 Forcer async si Render n'a pas mis le prefix
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = create_async_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
    )

    async def do_migrations(conn):
        await conn.run_sync(
            lambda sync_conn: context.configure(
                connection=sync_conn,
                target_metadata=target_metadata
            )
        )
        await conn.run_sync(lambda _: context.run_migrations())

    import asyncio
    async def run():
        async with connectable.connect() as connection:
            await do_migrations(connection)

    asyncio.run(run())


# Execution
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
