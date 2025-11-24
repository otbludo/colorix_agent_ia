from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from db.security.jwt import verify_token
from messages.exceptions import InvalidToken, AdminInactive, AdminAccessDenied

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise InvalidToken()
    return payload


async def superadmin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "superadmin":
        raise AdminAccessDenied()
    
    if current_user.get("status") != "actif":
        raise AdminInactive() 
    return current_user
    

async def admin_required(current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["admin", "superadmin"]:
        raise AdminAccessDenied()
    
    if current_user.get("status") != "actif":
        raise AdminInactive() 
    return current_user

