from fastapi import FastAPI
from core.middleware import add_cors_middleware
from api.v1.auth_router import router as auth_router
from api.v1.admin_router import router as admin_router





app = FastAPI()
add_cors_middleware(app)

app.include_router(auth_router, prefix="/api/v1", tags=["auth_router"])
app.include_router(admin_router, prefix="/api/v1", tags=["admin_router"])


