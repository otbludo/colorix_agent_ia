import os
from fastapi.responses import HTMLResponse
from fastapi import APIRouter, Depends, status, Request, Form
from db.database import get_db, AsyncSession
from utils.admin_utils import AdminCRUD
from schemas.admin_schemas import AdminUpdateInit
from dependencies.auth import admin_required
from fastapi.templating import Jinja2Templates


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


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




















