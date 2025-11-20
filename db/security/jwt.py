from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, datetime
import jwt

SECRET_KEY = "SUPER_SECRET_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def create_access_token(data: dict):
    """
    Création d’un JWT contenant l'utilisateur.
    """
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str = Depends(oauth2_scheme)):
    """
    Vérifie le token et retourne son contenu décodé.
    Utilisé dans toutes les routes protégées.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # Contient: id, email, role, name, exp

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")

    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
