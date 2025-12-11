from pydantic import BaseModel, EmailStr
from typing import List, Optional
from enum import Enum


class DevisCreate(BaseModel):
    id_customer: int
    id_product: int
    quantity: int
    printing_time: str
    impression: str  # "recto" | "recto_verso"

class DevisUpdate(BaseModel):
    devis_id: int
    quantity: Optional[int] = None
    printing_time: Optional[str] = None


