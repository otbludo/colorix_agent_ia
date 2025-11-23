import os
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, HTTPException, status, Request, Query, Form
from sqlalchemy.orm import Session
from db.database import get_db, AsyncSession
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminCreate, AdminUpdateInit
from schemas.customer_schemas import CustomerCreate, CustomerGet, CustomerDelete, CustomerUpdate
from utils.manage_customers_utils import CustomerCRUD
from dependencies.auth import superadmin_required, admin_required
from utils.stat_utils import StatsCRUD
from fastapi.templating import Jinja2Templates


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.post("/init-superadmin", status_code=status.HTTP_200_OK)
async def init_superadmin(admin_data: AdminCreate, db: AsyncSession = Depends(get_db)):
    crud = AdminCRUD(db)
    return await crud.Creat_admin(admin_data)
    

@router.post("/add-admin", status_code=status.HTTP_200_OK)
async def add_admin(admin_data: AdminCreate, current_user: dict = Depends(superadmin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.Creat_admin(admin_data)
   

@router.post("/get-customer", status_code=status.HTTP_201_CREATED)
async def get_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.select_customer(customer_data)


@router.post("/add-customer", status_code=status.HTTP_201_CREATED)
async def add_customer(customer_data: CustomerCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.create_customer(customer_data)
   

@router.put("/modify_customers", status_code=status.HTTP_200_OK)
async def modify_customer(customer_data: CustomerUpdate, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    customer_crud = CustomerCRUD(db)
    return await customer_crud.update_customer(customer_data)


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