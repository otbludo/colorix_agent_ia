from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from schemas.auth_schemas import Login, Token
from services.auth_service import AuthService

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(auth_data: Login, db: AsyncSession = Depends(get_db)):
    auth = AuthService(db)
    return await auth.login(auth_data)
