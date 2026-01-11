from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, extract
from datetime import datetime
from db.models import Customer, CustomerDeleted, Devis, DevisDeleted, AuditLog       
from schemas.customer_schemas import CustomerCreate, CustomerUpdate, CustomerStatus, CustomerDelete, CustomerRecovery, GetDevisFromCustomer
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
                    category=customer_data.category,
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

                # Suppression en cascade : déplacer tous les devis associés vers DevisDeleted
                devis_result = await self.db.execute(
                    select(Devis).where(Devis.id_customer == customer.id)
                )
                devis_list = devis_result.scalars().all()

                # D'abord, créer toutes les copies dans DevisDeleted
                deleted_devis_list = []
                for devis in devis_list:
                    deleted_devis = DevisDeleted(
                        original_id=devis.id,
                        name=devis.name_product,
                        description=devis.description,
                        format=devis.format,
                        quantity=devis.quantity,
                        impression=devis.impression,
                        printing_time=devis.printing_time,
                        description_devis=devis.description_devis,
                        tva=devis.tva,
                        prix_base=devis.prix_base,
                        price_taux=devis.price_taux,
                        montant_tva=devis.montant_tva,
                        montant_ttc=devis.montant_ttc,
                        taux_applique=devis.taux_applique,
                        name_customer=devis.name_customer,
                        first_name_customer=devis.first_name_customer,
                        email_customer=devis.email_customer,
                        id_product=devis.id_product,
                        id_customer=devis.id_customer,
                        id_admin=devis.id_admin,
                        status=devis.status,
                        deleted_cascade=True,  # Marquer comme supprimé en cascade
                        created_at=devis.created_at
                    )
                    self.db.add(deleted_devis)
                    deleted_devis_list.append((devis, deleted_devis))

                # Ensuite, supprimer tous les devis de la table principale
                for devis, _ in deleted_devis_list:
                    await self.db.delete(devis)

                # Enfin, créer les logs d'audit pour chaque devis supprimé
                for devis, _ in deleted_devis_list:
                    devis_action_desc = f"Suppression en cascade du devis {devis.name_product} (client supprimé: {customer.email})"
                    audit_entry = AuditLog(
                        object_id=devis.id,
                        action=devis_action_desc,
                        performed_by=performed_by,
                        performed_by_email=performed_by_email
                    )
                    self.db.add(audit_entry)

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

                audit_entry = AuditLog(
                    object_id=customer.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )
                self.db.add(audit_entry)

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
                    category=deleted_customer.category,
                    status=deleted_customer.status
                )

                self.db.add(restored_customer)
                await self.db.flush()

                # Restauration en cascade : récupérer tous les devis supprimés associés à ce client lors de la suppression en cascade
                devis_deleted_result = await self.db.execute(
                    select(DevisDeleted).where(
                        DevisDeleted.id_customer == deleted_customer.original_id,
                        DevisDeleted.deleted_cascade == True
                    )
                )
                devis_deleted_list = devis_deleted_result.scalars().all()

                # Restaurer tous les devis
                restored_devis_list = []
                for devis_deleted in devis_deleted_list:
                    restored_devis = Devis(
                        id=devis_deleted.original_id,
                        name_product=devis_deleted.name,
                        description=devis_deleted.description,
                        format=devis_deleted.format,
                        quantity=devis_deleted.quantity,
                        impression=devis_deleted.impression,
                        printing_time=devis_deleted.printing_time,
                        description_devis=devis_deleted.description_devis,
                        tva=devis_deleted.tva,
                        prix_base=devis_deleted.prix_base,
                        price_taux=devis_deleted.price_taux,
                        montant_tva=devis_deleted.montant_tva,
                        montant_ttc=devis_deleted.montant_ttc,
                        taux_applique=devis_deleted.taux_applique,
                        name_customer=devis_deleted.name_customer,
                        first_name_customer=devis_deleted.first_name_customer,
                        email_customer=devis_deleted.email_customer,
                        id_product=devis_deleted.id_product,
                        id_customer=devis_deleted.id_customer,
                        id_admin=devis_deleted.id_admin,
                        status=devis_deleted.status,
                        created_at=devis_deleted.created_at
                    )
                    self.db.add(restored_devis)
                    restored_devis_list.append((restored_devis, devis_deleted))

                # Supprimer toutes les lignes de devis_deleted
                for _, devis_deleted in restored_devis_list:
                    await self.db.delete(devis_deleted)

                # Créer les logs d'audit pour chaque devis restauré
                for restored_devis, _ in restored_devis_list:
                    devis_action_desc = f"Restauration en cascade du devis {restored_devis.name_product} (client restauré: {restored_customer.email})"
                    audit_entry = AuditLog(
                        object_id=restored_devis.id,
                        action=devis_action_desc,
                        performed_by=performed_by,
                        performed_by_email=performed_by_email
                    )
                    self.db.add(audit_entry)

                # Supprimer la ligne de customer_deleted
                await self.db.delete(deleted_customer)

                # Audit log
                action_desc = (
                   f"recovery customer: {restored_customer.email}"
                )
                audit_entry = AuditLog(
                    object_id=restored_customer.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )
                self.db.add(audit_entry)

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
        
        
    async def get_devis_from_customer(self, customer_id: int, current_user: dict | None = None):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]
                
               # Utilisation de selectinload pour charger la relation 'devis'
                result = await self.db.execute(
                    select(Customer)
                    .options(selectinload(Customer.devis)) 
                    .where(Customer.id == customer_id)
                )
                customer = result.scalars().first()

                if not customer:
                    raise CustomerNotFound()
                
                # Maintenant devis_list contient bien les données
                devis_list = customer.devis

                action_desc = (
                    f"Consultation des devis du client: {customer.email} "
                )

                # Ajouter un log dans AuditLog
                await self.create_audit_log(
                    object_id=customer.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return devis_list

        except Exception as e:
            await self.db.rollback()
            raise e


#--------------------------------------------------------------------------------------
# update customer status based on devis validation
#--------------------------------------------------------------------------------------
    async def update_customer_status_based_on_devis(self):
        """
        Met à jour automatiquement le statut des clients :
        - "client" si le client a au moins un devis validé créé dans le mois en cours
        - "potentiel" sinon
        """
        try:
            async with self.db.begin():

                # Récupérer tous les clients
                result = await self.db.execute(select(Customer))
                customers = result.scalars().all()

                current_month = datetime.now().month
                current_year = datetime.now().year

                for customer in customers:
                    # Vérifier si le client a des devis validés créés dans le mois en cours
                    devis_result = await self.db.execute(
                        select(Devis).where(
                            Devis.id_customer == customer.id,
                            Devis.status == "valide",
                            extract('month', Devis.created_at) == current_month,
                            extract('year', Devis.created_at) == current_year
                        )
                    )
                    valid_current_month_devis = devis_result.scalars().all()

                    # Déterminer le nouveau statut
                    new_status = "client" if valid_current_month_devis else "potentiel"

                    # Mettre à jour le statut si nécessaire
                    if customer.status != new_status:
                        old_status = customer.status
                        customer.status = new_status
                        self.db.add(customer)

                return {"message": "Mise à jour automatique des statuts clients terminée"}

        except Exception as e:
            await self.db.rollback()
            raise e
