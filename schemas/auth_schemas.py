from pydantic import BaseModel

class Login(BaseModel):
    email: str = None
    password: str = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict