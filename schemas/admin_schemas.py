from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum



class AdminStatus(str, Enum):
    actif = "actif"
    inactif = "inactif"
    supprimé = "supprimé"

class AdminEditStatus(str, Enum):
    actif = "actif"
    inactif = "inactif"
    
class AdminDeleteStatus(str, Enum):
    supprimé = "supprimé"

class AdminRecoveryStatus(str, Enum):
    actif = "actif"



class AdminCreate(BaseModel):
    name: str
    first_name: str
    number: str
    email: EmailStr
    post: str
    role: Optional[str] 
    password: str
    status: Optional[str] = "actif"
    devis_ids: Optional[List[int]] = []
    
    class Config:
        orm_mode = True


class AdminUpdateInit(BaseModel):
    email: EmailStr



class AdminDelete(BaseModel):
    id: int
    status: AdminDeleteStatus 


class AdminEditStatusRequest(BaseModel):
    id: int
    status: AdminEditStatus


class AdminRecovery(BaseModel):
    id: int
    status: AdminRecoveryStatus 