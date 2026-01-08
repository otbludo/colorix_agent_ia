from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum


class CustomerStatus(str, Enum):
    supprime = "supprime"
    
    
class GetDevisFromCustomer(BaseModel):
    id: int

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


class CustomerUpdate(BaseModel):
    id: int
    name: Optional[str]
    first_name: Optional[str]
    number: Optional[str]
    email: Optional[EmailStr]
    company: Optional[str]
    city: Optional[str]
    country: Optional[str]
    status: Optional[str]

    class Config:
        orm_mode = True


class CustomerGet(BaseModel):
    status: Optional[str] = None


class CustomerDelete(BaseModel):
    id: int

class CustomerRecovery(BaseModel):
    id: int


