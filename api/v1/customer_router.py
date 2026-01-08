import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status, Query
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from utils.manage_customers_utils import CustomerCRUD
from schemas.customer_schemas import CustomerCreate, CustomerDelete, CustomerUpdate, CustomerRecovery, CustomerStatus


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.get("/get_customer", status_code=status.HTTP_200_OK)
async def get_customer(customer_data: CustomerStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.get_customer(customer_data, current_user)


@router.get("/get_devis_from_customer/{customer_id}",status_code=status.HTTP_200_OK)
async def get_customer(customer_id: int, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.get_devis_from_customer(customer_id, current_user=current_user)



@router.post("/add_customer", status_code=status.HTTP_201_CREATED)
async def add_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.create_customer(customer_data, current_user)
   

@router.put("/update_customer", status_code=status.HTTP_200_OK)
async def modify_customer(customer_data: CustomerUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer(customer_data, current_user)


@router.delete("/delete_customer",status_code=status.HTTP_200_OK)
async def delete_customer(customer_data: CustomerDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.delete_customer(customer_data, current_user)


@router.post("/recovery_customer",status_code=status.HTTP_200_OK)
async def recovery_customer(customer_data: CustomerRecovery, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.recovery_customer(customer_data, current_user)


@router.post("/update-customer-status", status_code=status.HTTP_200_OK)
async def update_customer_status(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer_status_based_on_devis()