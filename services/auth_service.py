from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Admin
from schemas.auth_schemas import Login
from db.security.jwt import create_access_token
from db.security.hash import verify_password

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def login(self, login_data: Login):
        # Vérifier si l'email existe
        result = await self.db.execute(select(Admin).filter(Admin.email == login_data.email))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=400, detail="Email incorrect")

        # Vérifier le mot de passe
        if not verify_password(login_data.password, user.password):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")

        # Payload JWT
        token_payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "name": user.name
        }

        token = create_access_token(token_payload)

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": token_payload
        }
