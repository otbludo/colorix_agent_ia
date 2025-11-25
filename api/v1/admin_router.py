import os
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, status, Request, Query, Form
from sqlalchemy.orm import Session
from db.database import get_db, AsyncSession
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminUpdateInit
from schemas.customer_schemas import CustomerCreate, CustomerGet, CustomerDelete, CustomerUpdate
from schemas.product_schemas import ProductCreate, ProductUpdate
from utils.manage_customers_utils import CustomerCRUD
from utils.manage_product_utils import ProductCRUD
from dependencies.auth import superadmin_required, admin_required
from utils.stat_utils import StatsCRUD
from fastapi.templating import Jinja2Templates


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)



router = APIRouter()




@router.post("/get-customer", status_code=status.HTTP_201_CREATED)
async def get_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.list_customers(customer_data, current_user)


@router.post("/add-customer", status_code=status.HTTP_201_CREATED)
async def add_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.create_customer(customer_data, current_user)
   

@router.put("/modify_customers", status_code=status.HTTP_200_OK)
async def modify_customer(customer_data: CustomerUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer(customer_data, current_user)


@router.delete("/remove_customers",status_code=status.HTTP_200_OK)
async def remove_customer(customer_data: CustomerDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.delete_customer(customer_data)


@router.post("/request-update-info", status_code=status.HTTP_200_OK)
async def request_update_info(admin_data: AdminUpdateInit, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.request_update_info(admin_data, current_user)


@router.get("/update-info", response_class=HTMLResponse)
async def update_info_page(request: Request, token: str, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    admin = await admin_crud.get_admin_from_token(token)

    # Rendu du formulaire HTML
    return templates.TemplateResponse("update_info.html", {
        "request": request,
        "token": token,
        "email": current_user["email"],
        "phone": current_user["number"] or ""
    })


@router.post("/apply-update", status_code=status.HTTP_200_OK)
async def apply_update(token: str = Form(...), new_email: str = Form(...), new_phone: str = Form(...), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    admin = await admin_crud.get_admin_from_token(token)

    # Mise à jour des informations
    admin.email = new_email
    admin.number = new_phone
    db.add(admin)
    await db.commit()
    await db.refresh(admin)

    return HTMLResponse(content="<h3>Vos informations ont été mises à jour avec succès !</h3>")


@router.post("/get-customers", status_code=status.HTTP_200_OK)
async def get_customers(
    data: CustomerGet,
    current_user: dict = Depends(admin_required),
    db: AsyncSession = Depends(get_db)
):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.list_customers(data.status)


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_stats(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    stats_service = StatsCRUD(db)
    return await stats_service.get_stats()




# -----------------------------------------------------------------------------
# manage product
#------------------------------------------------------------------------------

@router.post("/create_product", status_code=status.HTTP_201_CREATED)
async def create_product(product_data: ProductCreate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.create_product(product_data, current_user)


@router.put("/update_product", status_code=status.HTTP_201_CREATED)
async def update_product(product_data: ProductUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = ProductCRUD(db)
    return await customer_crud.update_product(product_data, current_user)