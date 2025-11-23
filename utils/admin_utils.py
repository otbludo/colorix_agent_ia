import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.models import Admin
from db.security.hash import hash_password
from schemas.admin_schemas import AdminCreate, AdminUpdateInit
from fastapi import HTTPException
from services.email.model import Model
from services.email.send_mail import send_email
from db.security.jwt import verify_token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from messages.exceptions import AdminEmailExists, AdminNumberExists, AdminNotFound, AdminEmailMismatch



class AdminCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def Creat_admin(self, admin_data: AdminCreate):
        # Vérifier si un superadmin existe déjà
        result_email = await self.db.execute(select(Admin).filter(Admin.email == admin_data.email))
        existing_email = result_email.scalars().first()
        if existing_email:
            raise AdminEmailExists()

        # Vérifier si le numéro existe déjà
        result_number = await self.db.execute(select(Admin).filter(Admin.number == admin_data.number))
        existing_number = result_number.scalars().first()
        if existing_number:
            raise AdminNumberExists()

        admin = Admin(
            name=admin_data.name,
            first_name=admin_data.first_name,
            number=admin_data.number,
            email=admin_data.email,
            post=admin_data.post,
            role=admin_data.role,
            password=hash_password(admin_data.password),
            status=admin_data.status,
            devis_ids=admin_data.devis_ids
        )
        self.db.add(admin)
        await self.db.commit()
        await self.db.refresh(admin)
        return admin



    async def request_update_info(self, admin_update: AdminUpdateInit, current_user):

        current_admin_id = int(current_user["sub"])

        result = await self.db.execute(
            select(Admin).filter(Admin.id == current_admin_id)
        )
        connected_admin = result.scalars().first()

        if not connected_admin:
            raise AdminNotFound()

        if admin_update.email != connected_admin.email:
            raise AdminEmailMismatch()
        
        # Créer le lien sécurisé
        payload = {
            "sub": str(connected_admin.id),
            "email": connected_admin.email,
            "role": connected_admin.role
        }

        token = create_access_token(payload)

        update_url = f"{os.getenv('FRONTEND_URL')}/api/v1/update-info?token={token}"

        subject = "Mise à jour de vos informations personnelles"
        content = f"""
            Cliquez ici pour mettre à jour votre email ou numéro :<br>
            <a href='{update_url}'>Mettre à jour mes informations</a><br>
            Ce lien expire dans {ACCESS_TOKEN_EXPIRE_MINUTES} minutes.
        """

        html_message = Model.html_update_template(subject, content)

        # Envoi du mail
        await send_email(subject, html_message, connected_admin.email)
        return {"message": "Email envoyé pour mettre à jour vos informations."}



    async def get_admin_from_token(self, token: str):
        """
        Vérifie le token et retourne l'admin correspondant.
        """
        payload = verify_token(token)
        admin_id = int(payload["sub"])
        result = await self.db.execute(select(Admin).filter(Admin.id == admin_id))
        admin = result.scalars().first()
        if not admin:
            raise HTTPException(status_code=404, detail="Administrateur introuvable.")
        return admin
