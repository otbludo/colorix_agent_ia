import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from utils.stat_utils import StatsCRUD


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_stats(current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    stats_service = StatsCRUD(db)
    return await stats_service.get_stats()

@router.get("/stats_from_customer/{customer_id}", status_code=status.HTTP_200_OK)
async def get_stats_from_customer(customer_id:int, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    stats_service = StatsCRUD(db)
    return await stats_service.get_stats_from_customer(customer_id, current_user)