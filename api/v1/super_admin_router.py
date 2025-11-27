from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminCreate, AdminStatus, AdminDelete,AdminRecovery, AdminEditStatusRequest
from db.database import get_db
from dependencies.auth import superadmin_required


router = APIRouter()



@router.post("/init-superadmin", status_code=status.HTTP_200_OK)
async def init_superadmin(
    admin_data: AdminCreate, 
    db: AsyncSession = Depends(get_db)):
    crud = AdminCRUD(db)
    return await crud.init_super_admin(admin_data)
   

@router.post("/add-admin", status_code=status.HTTP_200_OK)
async def add_admin(
    admin_data: AdminCreate, 
    current_user: dict = Depends(superadmin_required), 
    db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.create_admin(admin_data, current_user)


@router.get("/get_admins", status_code=status.HTTP_200_OK)
async def get_admins(status: AdminStatus | None = Query(None), current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return await admin_crud.get_admins_by_status(status, current_user)



@router.patch("/edit-statuts-admin", status_code=status.HTTP_200_OK)
async def edit_statut_admin(
    admin_data: AdminEditStatusRequest,
    current_user: dict = Depends(superadmin_required),
    db: AsyncSession = Depends(get_db)
):
    admin_crud = AdminCRUD(db)
    return await admin_crud.change_admin_status(admin_data, current_user)


@router.delete("/delete-admin")
async def delete_admin(admin_data: AdminDelete, current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return await admin_crud.delete_admin(admin_data, current_user)


@router.post("/recovery-admin")
async def recovery_admin(admin_data: AdminRecovery, current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return await admin_crud.recovery_admin(admin_data, current_user)

