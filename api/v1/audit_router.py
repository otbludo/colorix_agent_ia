import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from utils.audit_logs_utils import auditLogsCRUD


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.get("/audit_logs", status_code=status.HTTP_200_OK)
async def get_audit_logs(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    logs_service = auditLogsCRUD(db)
    return await logs_service.get_audit_logs()