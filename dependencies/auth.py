from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from db.security.jwt import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    return payload

async def superadmin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Action réservée aux superadmins")
    return current_user

async def admin_required(current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Action réservée aux admins et superadmins")
    return current_user

