import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status, Query
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from utils.manage_product_utils import ProductCRUD
from schemas.product_schemas import ProductCreate, ProductUpdate, ProductDelete, ProductRecovery, ProductStatus


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.post("/create_product", status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.create_product(product_data, current_user)


@router.put("/update_product", status_code=status.HTTP_201_CREATED)
async def update_product(product_data: ProductUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.update_product(product_data, current_user)


@router.delete("/delete_product", status_code=status.HTTP_200_OK)
async def delete_product(product_data: ProductDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.delete_product(product_data, current_user)


@router.post("/recovery_product", status_code=status.HTTP_200_OK)
async def recovery_product(product_data: ProductRecovery, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.recovery_product(product_data, current_user)


@router.get("/get_product", status_code=status.HTTP_200_OK)
async def get_product(product_data: ProductStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    product_crud = ProductCRUD(db)
    return await product_crud.get_product(product_data, current_user)