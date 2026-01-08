import os
from db.database import get_db, AsyncSession
from fastapi import APIRouter, Depends, status, Query, WebSocket
from utils.manage_devis_utils import DevisCRUD
from fastapi.templating import Jinja2Templates
from dependencies.auth import admin_required
from schemas.devis_schemas import DevisCreate, DevisUpdate, DevisStatus, DevisValidate, DevisDelete, DevisRecovery


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


router = APIRouter()


@router.websocket("/ws/simulate_devis")
async def ws_simulate_devis(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    devis_crud = DevisCRUD(db)
    await devis_crud.websocket_simulate_devis(websocket)


@router.post("/add_devis", status_code=status.HTTP_201_CREATED)
async def add_devis(devis_data: DevisCreate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.create_devis(devis_data, current_user)


@router.put("/update_devis", status_code=status.HTTP_201_CREATED)
async def update_devis(devis_data: DevisUpdate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.update_devis(devis_data, current_user)


@router.put("/validate_devis", status_code=status.HTTP_201_CREATED)
async def validate_devis(devis_data: DevisValidate, current_user: dict = Depends(admin_required),db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.validate_devis(devis_data, current_user)


@router.delete("/delete_devis", status_code=status.HTTP_200_OK)
async def delete_devis(devis_data: DevisDelete, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.delete_devis(devis_data, current_user)


@router.post("/recovery_devis", status_code=status.HTTP_200_OK)
async def recovery_devis(devis_data: DevisRecovery, current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.recovery_devis(devis_data, current_user)


@router.get("/get_devis", status_code=status.HTTP_200_OK)
async def get_devis(devis_data: DevisStatus | None = Query(None), current_user: dict = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    devis_crud = DevisCRUD(db)
    return await devis_crud.get_devis(devis_data, current_user)