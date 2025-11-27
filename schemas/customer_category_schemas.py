from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class CustomerCategoryStatus(str, Enum):
    supprime = "supprime"
    
class CustomerCategoryCreate(BaseModel):
    name: str = Field(..., max_length=50)
    rate: float = 1.0

class CustomerCategoryUpdate(BaseModel):
    id: int
    name: Optional[str] = None
    rate: Optional[float] = None

class CustomerCategoryDelete(BaseModel):
    id: int

class CustomerCategoryRecovery(BaseModel):
    id: int