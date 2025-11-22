from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import Customer         
from schemas.customer_schemas import CustomerCreate,CustomerUpdate, CustomerDelete

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



    async def update_customer(self, customer_data: CustomerUpdate):
        # Récupérer le client à mettre à jour
        result = await self.db.execute(select(Customer).filter(Customer.id == customer_data.id))
        customer = result.scalars().first()

        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        # Vérifier si le nouvel email existe pour un autre client
        if customer_data.email:
            result_email = await self.db.execute(
                select(Customer)
                .filter(Customer.email == customer_data.email)
                .filter(Customer.id != customer_data.id)
            )
            existing_email = result_email.scalars().first()
            if existing_email:
                raise HTTPException(status_code=400, detail="Cet email est déjà utilisé par un autre client.")

        # Vérifier si le nouveau numéro existe pour un autre client
        if customer_data.number:
            result_number = await self.db.execute(
                select(Customer)
                .filter(Customer.number == customer_data.number)
                .filter(Customer.id != customer_data.id)
            )
            existing_number = result_number.scalars().first()
            if existing_number:
                raise HTTPException(status_code=400, detail="Ce numéro est déjà utilisé par un autre client.")

        # Mettre à jour uniquement les champs fournis
        for field, value in customer_data.dict(exclude_unset=True).items():
            setattr(customer, field, value)

        self.db.add(customer)
        await self.db.commit()
        await self.db.refresh(customer)
        return customer
    
    

    async def delete_customer(self, customer_data: CustomerDelete):
        result = await self.db.execute(
            select(Customer).filter(Customer.id == customer_data.id)
        )

        customer = result.scalars().first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        # Suppression
        await self.db.delete(customer)
        await self.db.commit()
        return {"message": "Customer deleted successfully"}
    


    # async def select_customer():
    