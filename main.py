from fastapi import FastAPI
from core.middleware import add_cors_middleware
from api.v1.auth_router import router as auth_router
from api.v1.admin_router import router as admin_router
from api.v1.super_admin_router import router as super_admin_router
from messages.error import register_error_handlers
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from utils.maintenance_utils import clean_expired_archives

app = FastAPI()

# Configuration du Scheduler 
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    scheduler.add_job(
        clean_expired_archives, 
        'cron', 
        day=1, 
        hour=0, 
        minute=0
    )
    scheduler.start()
    print("Scheduler démarré : Nettoyage mensuel activé.")

@app.on_event("shutdown")
def stop_scheduler():
    scheduler.shutdown()
    print("Scheduler arrêté.")
# ----------------------------------

add_cors_middleware(app)
register_error_handlers(app)

app.include_router(auth_router, prefix="/api/v1", tags=["auth_router"])
app.include_router(super_admin_router, prefix="/api/v1", tags=["super_admin_router"])
app.include_router(admin_router, prefix="/api/v1", tags=["admin_router"])