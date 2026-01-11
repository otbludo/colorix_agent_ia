# crud/customer_category_crud.py

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import CustomerCategory, CustomerCategoryDeleted, Customer, CustomerDeleted, Devis, DevisDeleted, AuditLog
from messages.exceptions import CustomerCategoryNameExists, CustomerCategoryNotFound
from schemas.customer_category_schemas import CustomerCategoryCreate, CustomerCategoryUpdate, CustomerCategoryDelete, CustomerCategoryRecovery, CustomerCategoryStatus

class CustomerCategoryCRUD:
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
# create create_category
#--------------------------------------------------------------------------------------    
    async def create_customer_category(self, category_data: CustomerCategoryCreate, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Vérifier si la catégorie existe déjà
                result = await self.db.execute(
                    select(CustomerCategory).where(CustomerCategory.name == category_data.name)
                )
                existing = result.scalars().first()
                if existing:
                    raise CustomerCategoryNameExists()

                # Créer la nouvelle catégorie
                new_category = CustomerCategory(
                    name=category_data.name,
                    rate=category_data.rate
                )
                self.db.add(new_category)
                await self.db.flush()  # génère new_category.id

                # Créer l'entrée d'audit
                action_desc = (f"create customer category: {new_category.name}")
                await self.create_audit_log(
                    object_id=new_category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

                # si tout OK, la transaction (begin) fera le commit automatiquement
                return {"message": f"Catégorie '{category_data.name}' ajoutée avec succès."}

        except Exception:
            await self.db.rollback()
            raise






#--------------------------------------------------------------------------------------
# update_customer_category
#--------------------------------------------------------------------------------------
    async def update_customer_category(self, category_data: CustomerCategoryUpdate, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Vérifier si la catégorie existe
                result = await self.db.execute(
                    select(CustomerCategory).where(CustomerCategory.id == category_data.id)
                )
                category = result.scalars().first()

                if not category:
                    raise CustomerCategoryNotFound()

                old_name = category.name
                updated_fields = []

                # Extraire les données envoyées (partial update)
                updates = category_data.dict(exclude_unset=True)

                # Vérifier unicité du nouveau name
                if "name" in updates and updates["name"] != category.name:
                    result = await self.db.execute(
                        select(CustomerCategory).where(
                            CustomerCategory.name == updates["name"],
                            CustomerCategory.id != category.id
                        )
                    )
                    duplicate = result.scalars().first()
                    if duplicate:
                        raise CustomerCategoryNameExists()

                # Appliquer les mises à jour
                for field, new_value in updates.items():
                    if field == "id":
                        continue

                    old_value = getattr(category, field)

                    if new_value != old_value:
                        updated_fields.append(f"{field}({old_value}→{new_value})")
                        setattr(category, field, new_value)

                self.db.add(category)
                await self.db.flush()

                # Créer le message des champs modifiés
                fields_log = ", ".join(updated_fields) if updated_fields else "no change"

                # Audit log
                action_desc = (
                    f"update customer category: {old_name} -> fields: {fields_log}"
                )

                await self.create_audit_log(
                    object_id=category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

                return {"message": f"Catégorie '{category.name}' mise à jour avec succès."}

        except Exception:
            await self.db.rollback()
            raise






#--------------------------------------------------------------------------------------
# Delete customer category
#--------------------------------------------------------------------------------------
    async def delete_customer_category(self, category_data: CustomerCategoryDelete, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]
                
                # Vérifier que la catégorie existe
                result = await self.db.execute(select(CustomerCategory).filter(CustomerCategory.id == category_data.id))
                category = result.scalars().first()
                if not category:
                    raise CustomerCategoryNotFound()

                # Suppression en cascade : supprimer tous les clients de cette catégorie
                customers_result = await self.db.execute(
                    select(Customer).where(Customer.category == category.name)
                )
                customers_list = customers_result.scalars().all()

                # Pour chaque client, faire une suppression en cascade de ses devis
                for customer in customers_list:
                    # Supprimer en cascade les devis du client
                    devis_result = await self.db.execute(
                        select(Devis).where(Devis.id_customer == customer.id)
                    )
                    devis_list = devis_result.scalars().all()

                    # Créer les copies des devis dans DevisDeleted
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

                        # Log pour chaque devis supprimé
                        devis_action_desc = f"Suppression en cascade du devis {devis.name_product} (catégorie supprimée: {category.name})"
                        audit_entry = AuditLog(
                            object_id=devis.id,
                            action=devis_action_desc,
                            performed_by=performed_by,
                            performed_by_email=performed_by_email
                        )
                        self.db.add(audit_entry)

                        # Supprimer le devis
                        await self.db.delete(devis)

                    # Créer la copie du client dans CustomerDeleted
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
                        status=customer.status,
                        deleted_cascade=True,
                        created_at=customer.created_at
                    )
                    self.db.add(deleted_customer)

                    # Log pour chaque client supprimé
                    customer_action_desc = f"Suppression en cascade du client {customer.email} (catégorie supprimée: {category.name})"
                    audit_entry = AuditLog(
                        object_id=customer.id,
                        action=customer_action_desc,
                        performed_by=performed_by,
                        performed_by_email=performed_by_email
                    )
                    self.db.add(audit_entry)

                    # Supprimer le client
                    await self.db.delete(customer)

                # Copier dans la table CustomerCategoryDeleted
                deleted_category = CustomerCategoryDeleted(
                    original_id=category.id,
                    name=category.name,
                    rate=category.rate
                )
                self.db.add(deleted_category)
                await self.db.flush()  # Générer ID si nécessaire

                # Supprimer de la table principale
                await self.db.delete(category)

                # Ajouter un log dans AuditLog
                action_desc = f"Suppression de la catégorie {category.name}"
                audit_entry = AuditLog(
                    object_id=category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )
                self.db.add(audit_entry)

            # Commit automatique si tout est OK
            return {"message": f"Catégorie '{deleted_category.name}' supprimée avec succès et journalisée."}

        except Exception as e:
            # Rollback automatique en cas d'erreur
            await self.db.rollback()
            raise e






#--------------------------------------------------------------------------------------
# Recovery category
#--------------------------------------------------------------------------------------
    async def recovery_customer_category(self, category_data: CustomerCategoryRecovery, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Récupérer la catégorie supprimée
                result = await self.db.execute(
                    select(CustomerCategoryDeleted).where(CustomerCategoryDeleted.id == category_data.id)
                )
                deleted_category = result.scalars().first()
                if not deleted_category:
                    raise CustomerCategoryNotFound()

                # Vérifier si une catégorie avec le même nom existe déjà
                query = await self.db.execute(
                    select(CustomerCategory).where(CustomerCategory.name == deleted_category.name)
                )
                existing_category = query.scalars().first()
                if existing_category:
                    raise CustomerCategoryNameExists()

                # Restaurer la catégorie dans la table principale
                restored_category = CustomerCategory(
                    id=deleted_category.original_id,  
                    name=deleted_category.name,
                    rate=deleted_category.rate
                )
                self.db.add(restored_category)
                await self.db.flush()

                # Restauration en cascade : récupérer tous les clients supprimés de cette catégorie lors de la suppression en cascade
                customers_deleted_result = await self.db.execute(
                    select(CustomerDeleted).where(
                        CustomerDeleted.category == deleted_category.name,
                        CustomerDeleted.deleted_cascade == True
                    )
                )
                customers_deleted_list = customers_deleted_result.scalars().all()

                # Restaurer tous les clients
                restored_customers_list = []
                for customer_deleted in customers_deleted_list:
                    # Vérifier que l'email n'existe pas déjà dans la table Customer
                    email_check = await self.db.execute(
                        select(Customer).where(Customer.email == customer_deleted.email)
                    )
                    if email_check.scalars().first():
                        # L'email existe déjà, on ne restaure pas ce client
                        continue

                    restored_customer = Customer(
                        id=customer_deleted.original_id,
                        name=customer_deleted.name,
                        first_name=customer_deleted.first_name,
                        number=customer_deleted.number,
                        email=customer_deleted.email,
                        company=customer_deleted.company,
                        city=customer_deleted.city,
                        country=customer_deleted.country,
                        category=customer_deleted.category,
                        status=customer_deleted.status,
                        created_at=customer_deleted.created_at
                    )
                    self.db.add(restored_customer)
                    restored_customers_list.append((restored_customer, customer_deleted))

                # Pour chaque client restauré, restaurer ses devis
                for restored_customer, customer_deleted in restored_customers_list:
                    # Chercher les devis supprimés de ce client lors de la suppression en cascade
                    devis_deleted_result = await self.db.execute(
                        select(DevisDeleted).where(
                            DevisDeleted.id_customer == customer_deleted.original_id,
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

                    # Supprimer tous les devis de la table supprimée et créer les logs
                    for restored_devis, devis_deleted in restored_devis_list:
                        await self.db.delete(devis_deleted)

                        # Log pour chaque devis restauré
                        devis_action_desc = f"Restauration en cascade du devis {restored_devis.name_product} (catégorie restaurée: {restored_category.name})"
                        audit_entry = AuditLog(
                            object_id=restored_devis.id,
                            action=devis_action_desc,
                            performed_by=performed_by,
                            performed_by_email=performed_by_email
                        )
                        self.db.add(audit_entry)

                # Supprimer tous les clients de la table supprimée et créer les logs
                for restored_customer, customer_deleted in restored_customers_list:
                    await self.db.delete(customer_deleted)

                    # Log pour chaque client restauré
                    customer_action_desc = f"Restauration en cascade du client {restored_customer.email} (catégorie restaurée: {restored_category.name})"
                    audit_entry = AuditLog(
                        object_id=restored_customer.id,
                        action=customer_action_desc,
                        performed_by=performed_by,
                        performed_by_email=performed_by_email
                    )
                    self.db.add(audit_entry)

                # Supprimer la catégorie de la table supprimée
                await self.db.delete(deleted_category)

                # Ajouter un log dans AuditLog
                action_desc = (
                    f"Restauration de la catégorie: {restored_category.name}"
                )
                audit_entry = AuditLog(
                    object_id=restored_category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )
                self.db.add(audit_entry)

            return {"message": f"Catégorie '{deleted_category.name}' restaurée avec succès."}

        except Exception as e:
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# get customer by status 
#--------------------------------------------------------------------------------------
    async def get_customer_category(self, status: CustomerCategoryStatus | None = None, current_user: dict | None = None):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                
                if status == CustomerCategoryStatus.supprime:
                    result = await self.db.execute(select(CustomerCategoryDeleted))
                    customer_category = result.scalars().all()

                    action_desc = (
                        "Consultation de la liste des produits SUPPRIMÉS "
                        f"par {performed_by_email}"
                    )

                else:
                    result = await self.db.execute(select(CustomerCategory))
                    customer_category = result.scalars().all()

                    action_desc = (
                        "Consultation de la liste des produits "
                        f"par {performed_by_email}"
                    )

                # Ajouter un log dans AuditLog
                await self.create_audit_log(
                    object_id=0,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return customer_category

        except Exception as e:
            await self.db.rollback()
            raise e