from pydantic import BaseModel
from typing import Dict, Optional

class Evolution(BaseModel):
    current: int
    previous: int
    percentage: float
    trend: str  # "up" | "down" | "equal"

class StatsResponse(BaseModel):
    total_customers: int
    total_admins: int
    total_devis: int

    customers_evolution: Evolution
    devis_evolution: Evolution

    # Ajout des décompositions par statut
    devis_by_status: Dict[str, int]
    customers_by_status: Dict[str, int]

    class Config:
        orm_mode = True
