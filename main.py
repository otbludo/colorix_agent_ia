from fastapi import FastAPI
from core.middleware import add_cors_middleware
from api.v1.auth_router import router as auth_router
from api.v1.admin_router import router as admin_router
from api.v1.super_admin_router import router as super_admin_router
from api.v1.customer_category_router import router as customer_category_router
from api.v1.customer_router import router as customer_router
from api.v1.product_router import router as product_router
from api.v1.devis_router import router as devis_router
from api.v1.stats_router import router as stats_router
from api.v1.audit_router import router as audit_router
from messages.error import register_error_handlers
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from utils.maintenance_utils import clean_expired_archives
from utils.automatique_cron_utils import update_customer_statuses

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
    # Mise à jour perpétuelle des statuts clients toutes les secondes
    scheduler.add_job(
        update_customer_statuses,
        'interval',
        seconds=1
    )
    scheduler.start()
    print("Scheduler démarré : Nettoyage mensuel et mise à jour perpétuelle des statuts clients activés.")

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
app.include_router(customer_category_router, prefix="/api/v1", tags=["customer_category_router"])
app.include_router(customer_router, prefix="/api/v1", tags=["customer_router"])
app.include_router(product_router, prefix="/api/v1", tags=["product_router"])
app.include_router(devis_router, prefix="/api/v1", tags=["devis_router"])
app.include_router(stats_router, prefix="/api/v1", tags=["stats_router"])
app.include_router(audit_router, prefix="/api/v1", tags=["audit_router"])