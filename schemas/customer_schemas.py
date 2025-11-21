from pydantic import BaseModel, EmailStr
from typing import List, Optional

class CustomerCreate(BaseModel):
    name: str
    first_name: str
    number: str
    email: EmailStr
    company: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    status: Optional[str] = "potentiel"

    class Config:
        orm_mode = True