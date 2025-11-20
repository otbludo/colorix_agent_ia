from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db, AsyncSession
from services.admin_service import AdminCRUD
from services.admin_service import AdminCreate
from dependencies.auth import superadmin_required

router = APIRouter()


@router.post("/init-superadmin", status_code=status.HTTP_200_OK)
async def init_superadmin(admin_data: AdminCreate, db: AsyncSession = Depends(get_db)):
    crud = AdminCRUD(db)
    return await crud.Creat_admin(admin_data)
    


@router.post("/add-admin", status_code=status.HTTP_200_OK)
async def add_admin(admin_data: AdminCreate, current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.Creat_admin(admin_data)
   