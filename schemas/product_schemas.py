
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum



class ProductStatus(str, Enum):
    supprime = "supprime"


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = Field(None, max_length=255)
    format: Optional[str] = Field(None, max_length=255)
    papier_grammage: Optional[List[str]] = Field(default=None)
    peliculage: Optional[List[str]] = Field(default=None)
    color: Optional[str] = Field(None, max_length=55)
    quantity: Optional[int] = Field(1, ge=1)          # quantité minimale = 1
    category: str = Field(..., max_length=255)
    front_price: float = Field(..., ge=0)             # prix >= 0
    front_back_price: Optional[float] = Field(0, ge=0)      # prix >= 0, par défaut 0 

    class Config:
        orm_mode = True


class ProductUpdate(BaseModel):
    id: int
    name: str | None = None
    description: str | None = None
    format: str | None = None
    papier_grammage: List[str] | None = None
    peliculage: List[str] | None = None
    color: str | None = None
    quantity: int | None = None
    front_price: float | None = None
    front_back_price: float | None = None


class ProductDelete(BaseModel):
    id: int


class ProductRecovery(BaseModel):
    id: int