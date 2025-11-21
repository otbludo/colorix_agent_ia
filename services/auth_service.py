from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Admin
from db.security.hash import verify_password
from db.security.jwt import create_access_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, username: str, password: str):
        result = await self.db.execute(
            select(Admin).filter(Admin.email == username)
        )
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=400, detail="Email incorrect")

        if not verify_password(password, user.password):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")

        return user

    async def login(self, username: str, password: str):
        user = await self.authenticate_user(username, password)

        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }

        token = create_access_token(payload)

        return token, payload
