from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_db
from schemas.auth_schemas import Token
from services.auth_service import AuthService

router = APIRouter()

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    auth = AuthService(db)
    token, user_payload = await auth.login(
        form_data.username,
        form_data.password
    )
    return {
        "access_token": token,
        "token_type": "bearer"
    }
