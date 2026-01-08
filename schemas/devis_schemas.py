from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum


class DevisStatus(str, Enum):
    supprime = "supprime"

class DevisValidationStatus(str, Enum):
    valide = "valide"
    rejeter = "rejeter"
    revoquer = "revoquer"

class DevisCreate(BaseModel):
    id_customer: int
    id_product: int
    description_devis: Optional[str] = None
    quantity: int
    printing_time: str
    impression: str  # "recto" | "recto_verso"

class DevisUpdate(BaseModel):
    id: int
    description_devis: Optional[str] = None
    quantity: Optional[int] = None
    printing_time: Optional[str] = None
    impression: Optional[str] = None  # "recto" | "recto_verso"

class DevisValidate(BaseModel):
    id: int
    status: DevisValidationStatus


class DevisDelete(BaseModel):
    id: int


class DevisRecovery(BaseModel):
    id: int


class DevisGet(BaseModel):
    status: Optional[str] = None


