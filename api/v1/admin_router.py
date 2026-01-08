import os
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, status, Request, Form, HTTPException
from db.database import get_db, AsyncSession
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminUpdateInit
from dependencies.auth import admin_required, flexible_admin_required
from fastapi.templating import Jinja2Templates
from sqlalchemy.future import select
from db.models import Admin


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.post("/request-update-info", status_code=status.HTTP_200_OK)
async def request_update_info(admin_data: AdminUpdateInit, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return  await admin_crud.request_update_info(admin_data, current_user)


@router.get("/update-info", response_class=HTMLResponse)
async def update_info_page(request: Request, current_user: dict = Depends(flexible_admin_required), db: AsyncSession = Depends(get_db)):
    # Rendu du formulaire HTML
    return templates.TemplateResponse("update_info.html", {
        "request": request,
        "token": request.query_params.get("token", ""),
        "email": current_user["email"],
        "phone": current_user.get("number", "")
    })


@router.post("/apply-update", status_code=status.HTTP_200_OK)
async def apply_update(request: Request, new_email: str = Form(...), new_phone: str = Form(...), current_user: dict = Depends(flexible_admin_required), db: AsyncSession = Depends(get_db)):
    # Récupérer l'admin depuis la base de données
    admin_id = int(current_user["sub"])
    result = await db.execute(select(Admin).where(Admin.id == admin_id))
    admin = result.scalars().first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    # Mise à jour des informations
    admin.email = new_email
    admin.number = new_phone
    db.add(admin)
    await db.commit()
    await db.refresh(admin)

    return HTMLResponse(content="<h3>Vos informations ont été mises à jour avec succès !</h3>")


@router.get("/current_admin_info", status_code=status.HTTP_200_OK)
async def get_current_admin_info(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    admin_crud = AdminCRUD(db)
    return await admin_crud.get_current_admin_info(current_user)




















