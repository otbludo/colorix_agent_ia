from fastapi import HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Admin, AuditLog
from db.security.hash import verify_password
from db.security.jwt import create_access_token
from messages.exceptions import InvalidEmail, InvalidPassword
from messages.exceptions import AdminInactive


class AuthCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db


#--------------------------------------------------------------------------------------
# create audit_log
#--------------------------------------------------------------------------------------  
    async def create_audit_log(self, object_id: int, action: str, performed_by: int, performed_by_email: str):
        audit_entry = AuditLog(
            object_id=object_id,
            action=action,
            performed_by=performed_by,
            performed_by_email=performed_by_email
        )
        self.db.add(audit_entry)
        await self.db.commit()





#--------------------------------------------------------------------------------------
# authenticate_user
#--------------------------------------------------------------------------------------  
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





#--------------------------------------------------------------------------------------
# Login
#--------------------------------------------------------------------------------------
    async def login(self, username: str, password: str):
        try:
            async with self.db.begin():
                # Authentifier l'utilisateur
                user = await self.authenticate_user(username, password)

                if user.status != "actif":
                    raise AdminInactive()

                # Générer le token
                payload = {
                    "sub": str(user.id),
                    "email": user.email,
                    "role": user.role,
                    "status": user.status
                }
                token = create_access_token(payload)

                # Ajouter un log d'audit pour la connexion
                action_desc = f"Connexion réussie pour l'admin {user.email} ({user.name} {user.first_name})"
                await self.create_audit_log(
                    object_id=user.id,
                    action=action_desc,
                    performed_by=user.id,
                    performed_by_email=user.email
                )

            # Commit automatique si tout est OK
            return {
                "access_token": token,
                "token_type": "bearer"
            }

        except Exception as e:
            await self.db.rollback()
            raise e

        
