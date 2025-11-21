from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import Customer         
from schemas.customer_schemas import CustomerCreate

class CustomerCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_customer(self, customer_data: CustomerCreate):

        # Vérifier email existant
        result_email = await self.db.execute(
            select(Customer).filter(Customer.email == customer_data.email)
        )
        existing_email = result_email.scalars().first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")

        # Vérifier numéro existant
        result_number = await self.db.execute(
            select(Customer).filter(Customer.number == customer_data.number)
        )
        existing_number = result_number.scalars().first()
        if existing_number:
            raise HTTPException(status_code=400, detail="Ce numéro est déjà utilisé.")

        # Création du customer
        customer = Customer(
            name=customer_data.name,
            first_name=customer_data.first_name,
            number=customer_data.number,
            email=customer_data.email,
            company=customer_data.company,
            city=customer_data.city,
            country=customer_data.country,
            status=customer_data.status
        )

        self.db.add(customer)
        await self.db.commit()
        await self.db.refresh(customer)

        return customer
