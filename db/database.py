import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Crée le moteur asynchrone
engine = create_async_engine(DATABASE_URL, echo=True)

# Crée une AsyncSession
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base pour les modèles SQLAlchemy
Base = declarative_base()

# Générateur de session pour FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
