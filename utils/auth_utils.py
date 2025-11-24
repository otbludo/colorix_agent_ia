from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Admin
from db.security.hash import verify_password
from db.security.jwt import create_access_token
from messages.exceptions import InvalidEmail, InvalidPassword
from messages.exceptions import AdminInactive


class AuthCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, username: str, password: str):
        result = await self.db.execute(
            select(Admin).filter(Admin.email == username)
        )
        user = result.scalars().first()

        if not user:
            raise InvalidEmail()

        if not verify_password(password, user.password):
            raise InvalidPassword()

        return user



    async def login(self, username: str, password: str):
        user = await self.authenticate_user(username, password)

        if user.status != "actif":
            raise AdminInactive()
        
        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "status": user.status
        }

        token = create_access_token(payload)

        return {
            "access_token": token,
            "token_type": "bearer"
        }
        
