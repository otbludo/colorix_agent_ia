from pydantic import BaseModel, EmailStr
from typing import List, Optional

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


