# crud/customer_category_crud.py

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import CustomerCategory, AuditLog, CustomerCategoryDeleted
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
                await self.create_audit_log(
                    object_id=category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

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

                # Supprimer la catégorie de la table supprimée
                await self.db.delete(deleted_category)

                # Ajouter un log dans AuditLog
                action_desc = (
                    f"Restauration de la catégorie: {restored_category.name}"
                )
                await self.create_audit_log(
                    object_id=restored_category.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

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