from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import Customer, CustomerCategory, AuditLog       
from schemas.customer_schemas import CustomerCreate, CustomerUpdate, CustomerGet, CustomerDelete
from messages.exceptions import CustomerEmailExists, CustomerNumberExists, CustomerNotFound, CustomerEmailUsedByOther, CustomerNumberUsedByOther



class CustomerCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db


#--------------------------------------------------------------------------------------
# create audit_log
#--------------------------------------------------------------------------------------     
    async def create_audit_log(self, object_id: int, action: str, performed_by: int, performed_by_email: str):
        audit_entry = AuditLog(
            object_id=object_id,
            action=action,
            performed_by=performed_by,
            performed_by_email=performed_by_email
        )
        self.db.add(audit_entry)
        await self.db.commit()




#--------------------------------------------------------------------------------------
# create customer
#--------------------------------------------------------------------------------------
    async def create_customer(self, customer_data: CustomerCreate, current_user: dict):
        try:
            async with self.db.begin():

                # Vérifier email existant
                result_email = await self.db.execute(
                    select(Customer).filter(Customer.email == customer_data.email)
                )
                if result_email.scalars().first():
                    raise CustomerEmailExists()

                # Vérifier numéro existant
                result_number = await self.db.execute(
                    select(Customer).filter(Customer.number == customer_data.number)
                )
                if result_number.scalars().first():
                    raise CustomerNumberExists()

                # Créer le client
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
                await self.db.flush()  # Générer l'ID avant audit

                # Audit log obligatoire
                await self.create_audit_log(
                    object_id=customer.id,
                    action=f"create customer: {customer.email}",
                    performed_by=int(current_user["sub"]),
                    performed_by_email=current_user["email"]
                )

            # Commit automatique si tout est OK
            await self.db.refresh(customer)
            return customer

        except Exception as e:
            await self.db.rollback()
            raise e




#--------------------------------------------------------------------------------------
# list customers
#--------------------------------------------------------------------------------------
    async def list_customers(self, status: CustomerGet = None, current_user: dict = None):
        try:
            async with self.db.begin():  # transaction pour s'assurer que l'audit est enregistré

                # Construire la requête
                query = select(Customer)
                if status:
                    query = query.where(Customer.status == status)

                result = await self.db.execute(query)
                customers = result.scalars().all()

                # Enregistrer l'audit log
                action_detail = f"list customers"
                if status:
                    action_detail += f" with status={status}"

                await self.create_audit_log(
                    object_id=0,  # 0 ou None pour indiquer que c'est une lecture globale
                    action=action_detail,
                    performed_by=int(current_user["sub"]) if current_user else None,
                    performed_by_email=current_user["email"] if current_user else None
                )

                return customers

        except Exception as e:
            await self.db.rollback()
            raise e




#--------------------------------------------------------------------------------------
# update customer
#--------------------------------------------------------------------------------------
    async def update_customer(self, customer_data: CustomerUpdate, current_user: dict):
        try:
            async with self.db.begin():

                # Récupérer le client à mettre à jour
                result = await self.db.execute(
                    select(Customer).filter(Customer.id == customer_data.id)
                )
                customer = result.scalars().first()
                if not customer:
                    raise CustomerNotFound()

                old_email = customer.email
                old_number = customer.number

                # Vérifier unicité du nouvel email
                if customer_data.email and customer_data.email != customer.email:
                    result_email = await self.db.execute(
                        select(Customer)
                        .filter(Customer.email == customer_data.email)
                        .filter(Customer.id != customer_data.id)
                    )
                    if result_email.scalars().first():
                        raise CustomerEmailUsedByOther()

                # Vérifier unicité du nouveau numéro
                if customer_data.number and customer_data.number != customer.number:
                    result_number = await self.db.execute(
                        select(Customer)
                        .filter(Customer.number == customer_data.number)
                        .filter(Customer.id != customer_data.id)
                    )
                    if result_number.scalars().first():
                        raise CustomerNumberUsedByOther()

                # ---- UPDATE PARTIEL ----
                updated_fields = []
                updates = customer_data.dict(exclude_unset=True)

                for field, new_value in updates.items():
                    old_value = getattr(customer, field)
                    if old_value != new_value:
                        updated_fields.append(f"{field}({old_value}→{new_value})")
                        setattr(customer, field, new_value)

                self.db.add(customer)
                await self.db.flush()  # appliquer avant audit

                # ---- Audit log obligatoire ----
                fields_log = ", ".join(updated_fields) if updated_fields else "no change"
                await self.create_audit_log(
                    object_id=customer.id,
                    action=f"update customer: {old_email} -> {customer.email} | fields: {fields_log}",
                    performed_by=int(current_user["sub"]),
                    performed_by_email=current_user["email"]
                )

            # Commit automatique si tout est OK
            return customer

        except Exception as e:
            await self.db.rollback()
            raise e