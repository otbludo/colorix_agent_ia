import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status, Query
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from utils.customer_category_utils import CustomerCategoryCRUD
from schemas.customer_category_schemas import CustomerCategoryCreate, CustomerCategoryUpdate, CustomerCategoryDelete, CustomerCategoryRecovery, CustomerCategoryStatus


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.post("/add_category_customer", status_code=status.HTTP_201_CREATED)
async def add_customer_category(category_data: CustomerCategoryCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.create_customer_category(category_data, current_user)


@router.put("/update_customer_category", status_code=status.HTTP_200_OK)
async def update_customer_category(category_data: CustomerCategoryUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.update_customer_category(category_data, current_user)


@router.delete("/delete_customer_category")
async def delete_customer_category(category_data: CustomerCategoryDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db),):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.delete_customer_category(category_data, current_user)


@router.post("/recovery_customer_category")
async def recovery_customer_category(category_data: CustomerCategoryRecovery, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.recovery_customer_category(category_data, current_user)


@router.get("/get_customer_category", status_code=status.HTTP_200_OK)
async def get_customer_category(category_data: CustomerCategoryStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_category_crud = CustomerCategoryCRUD(db)
    return await customer_category_crud.get_customer_category(category_data, current_user)