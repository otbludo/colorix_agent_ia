from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.models import Admin
from db.security.hash import hash_password
from schemas.admin_schemas import AdminCreate
from fastapi import HTTPException

class AdminCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def Creat_admin(self, admin_data: AdminCreate):
        # Vérifier si un superadmin existe déjà
        result_email = await self.db.execute(select(Admin).filter(Admin.email == admin_data.email))
        existing_email = result_email.scalars().first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")

        # Vérifier si le numéro existe déjà
        result_number = await self.db.execute(select(Admin).filter(Admin.number == admin_data.number))
        existing_number = result_number.scalars().first()
        if existing_number:
            raise HTTPException(status_code=400, detail="Ce numéro est déjà utilisé.")

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
