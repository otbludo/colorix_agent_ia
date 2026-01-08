from fastapi import Depends, Request
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


async def flexible_admin_required(request: Request):
    """
    Authentification flexible qui accepte le token soit des headers, soit des paramètres de requête/formulaire.
    Utile pour les routes accessibles via liens d'email.
    """
    token = None

    # Essayer de récupérer le token des headers (Authorization: Bearer)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer"):
        token = auth_header.split(" ")[1]
    else:
        # Essayer de récupérer le token des paramètres de requête
        token = request.query_params.get("token")

        # Ou des données de formulaire (pour les requêtes POST)
        if not token and hasattr(request, 'form') and hasattr(request, '_form'):
            try:
                form_data = await request.form()
                token = form_data.get("token")
            except:
                pass

    if not token:
        raise InvalidToken()

    payload = verify_token(token)
    if not payload:
        raise InvalidToken()

    # Vérifier le rôle et le statut
    role = payload.get("role")
    if role not in ["admin", "superadmin"]:
        raise AdminAccessDenied()

    if payload.get("status") != "actif":
        raise AdminInactive()

    return payload

