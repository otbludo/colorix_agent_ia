from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import Customer, CustomerDeleted, AuditLog       
from schemas.customer_schemas import CustomerCreate, CustomerUpdate, CustomerStatus, CustomerDelete, CustomerRecovery
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
            return {"message": f"Client {customer.email} cree avec succes"}

        except Exception as e:
            await self.db.rollback()
            raise e







#--------------------------------------------------------------------------------------
# update customer
#--------------------------------------------------------------------------------------
    async def update_customer(self, customer_data: CustomerUpdate, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

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
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Client {customer.email} mis a jour avec succes"}

        except Exception as e:
            await self.db.rollback()
            raise e
        





#--------------------------------------------------------------------------------------
# delete customer
#--------------------------------------------------------------------------------------
    async def delete_customer(self, customer_data: CustomerDelete, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Vérifier que le client existe dans la table principale
                result = await self.db.execute(
                    select(Customer).where(Customer.id == customer_data.id)
                )
                customer = result.scalars().first()
                if not customer:
                    raise CustomerNotFound()

                # Créer une copie du client dans la table deleted
                deleted_customer = CustomerDeleted(
                    original_id=customer.id,
                    name=customer.name,
                    first_name=customer.first_name,
                    number=customer.number,
                    email=customer.email,
                    company=customer.company,
                    city=customer.city,
                    country=customer.country,
                    category=customer.category,
                    status=customer.status
                )

                self.db.add(deleted_customer)

                # Supprimer le client de la table principale
                await self.db.delete(customer)

                # Audit log
                action_desc = (
                    f"delete customer: {customer.email}"
                )

                await self.create_audit_log(
                    object_id=customer.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout va bien
            return {"message": f"Client '{deleted_customer.email}' supprimé avec succès (soft delete)."}

        except Exception as e:
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# Recovery customer
#--------------------------------------------------------------------------------------
    async def recovery_customer(self, customer_data: CustomerRecovery, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Récupérer le customer supprimé
                result = await self.db.execute(
                    select(CustomerDeleted).where(CustomerDeleted.id == customer_data.id)
                )
                deleted_customer = result.scalars().first()

                if not deleted_customer:
                    raise CustomerNotFound()

                # Vérifier email déjà réutilisé
                email_check = await self.db.execute(
                    select(Customer).filter(Customer.email == deleted_customer.email)
                )
                if email_check.scalars().first():
                    raise CustomerEmailExists()

                # Vérifier numéro déjà réutilisé
                number_check = await self.db.execute(
                    select(Customer).filter(Customer.number == deleted_customer.number)
                )
                if number_check.scalars().first():
                    raise CustomerNumberExists()

                # Restaurer le customer dans la table principale
                restored_customer = Customer(
                    id=deleted_customer.original_id,
                    name=deleted_customer.name,
                    first_name=deleted_customer.first_name,
                    number=deleted_customer.number,
                    email=deleted_customer.email,
                    company=deleted_customer.company,
                    city=deleted_customer.city,
                    country=deleted_customer.country,
                    status=deleted_customer.status 
                )

                self.db.add(restored_customer)
                await self.db.flush()

                # Supprimer la ligne de customer_deleted
                await self.db.delete(deleted_customer)

                # Audit log
                action_desc = (
                   f"recovery customer: {restored_customer.email}"
                )
                await self.create_audit_log(
                    object_id=restored_customer.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return {"message": f"Customer ({restored_customer.email}) restauré avec succès."}

        except Exception as e:
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# get customer
#--------------------------------------------------------------------------------------
    async def get_customer(self, status: CustomerStatus | None = None, current_user: dict | None = None):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Cas : statut = supprime → table ProductPrintingDeleted
                if status == CustomerStatus.supprime:
                    result = await self.db.execute(select(CustomerDeleted))
                    customers = result.scalars().all()

                    action_desc = (
                        "Consultation de la liste des client supprimes "
                    )

                else:
                    result = await self.db.execute(select(Customer))
                    customers = result.scalars().all()

                    action_desc = (
                        "Consultation de la liste des clients "
                    )

                # Ajouter un log dans AuditLog
                await self.create_audit_log(
                    object_id=0,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return customers

        except Exception as e:
            await self.db.rollback()
            raise e
