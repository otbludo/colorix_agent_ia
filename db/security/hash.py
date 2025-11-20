from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash un mot de passe en utilisant bcrypt.
    """
    truncated_password_bytes = password.encode('utf-8')[:72]
    return pwd_context.hash(truncated_password_bytes)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie si le mot de passe en clair correspond au hash.
    """
    return pwd_context.verify(plain_password, hashed_password)
