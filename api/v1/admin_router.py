from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db, AsyncSession
from services.admin_service import AdminCRUD
from schemas.admin_schemas import AdminCreate
from schemas.customer_schemas import CustomerCreate, CustomerDelete, CustomerUpdate
from services.manage_customers_service import CustomerCRUD
from dependencies.auth import superadmin_required, admin_required

router = APIRouter()


@router.post("/init-superadmin", status_code=status.HTTP_200_OK)
async def init_superadmin(admin_data: AdminCreate, db: AsyncSession = Depends(get_db)):
    crud = AdminCRUD(db)
    return await crud.Creat_admin(admin_data)
    


@router.post("/add-admin", status_code=status.HTTP_200_OK)
async def add_admin(admin_data: AdminCreate, current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.Creat_admin(admin_data)
   

@router.post("/add-customer", status_code=status.HTTP_201_CREATED)
async def add_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.create_customer(customer_data)
   

@router.delete("/remove_customers",status_code=status.HTTP_200_OK)
async def remove_customer(customer_data: CustomerDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.delete_customer(customer_data)


@router.put("modify_customers", status_code=status.HTTP_200_OK)
async def modify_customer(customer_data: CustomerUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer(customer_data)