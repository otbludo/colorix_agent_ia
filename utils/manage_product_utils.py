from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import ProductPrinting, AdminAudit       
from schemas.product_schemas import ProductCreate, ProductUpdate
from messages.exceptions import ProductNameExists, ProductNotFound


class ProductCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

#--------------------------------------------------------------------------------------
# create audit_log
#--------------------------------------------------------------------------------------     
    async def create_audit_log(self, object_id: int, action: str, performed_by: int, performed_by_email: str):
        audit_entry = AdminAudit(
            object_id=object_id,
            action=action,
            performed_by=performed_by,
            performed_by_email=performed_by_email
        )
        self.db.add(audit_entry)
        await self.db.commit()



#--------------------------------------------------------------------------------------
# create product
#--------------------------------------------------------------------------------------
    async def create_product(self, product_data: ProductCreate, current_user: dict):
        try:
            # Démarrer une transaction
            async with self.db.begin():

                # Vérifier si le produit existe déjà
                query = await self.db.execute(
                    select(ProductPrinting).where(ProductPrinting.name == product_data.name)
                )
                existing_product = query.scalars().first()
                if existing_product:
                    raise ProductNameExists()

                # Créer un nouveau produit
                new_product = ProductPrinting(
                    name=product_data.name,
                    description=product_data.description,
                    format=product_data.format,
                    papier_grammage=product_data.papier_grammage,
                    color=product_data.color,
                    quantity=product_data.quantity,
                    front_price=product_data.front_price,
                    back_price=product_data.back_price
                )

                self.db.add(new_product)
                await self.db.flush()   # Pour générer new_product.id sans commit

                # Créer le log d’audit (si ça échoue → rollback)
                await self.create_audit_log(
                    object_id=new_product.id,
                    action=f"create product: {product_data.name}",
                    performed_by=int(current_user["sub"]),
                    performed_by_email=current_user["email"]
                )

            # Si tout est OK → COMMIT automatique
            return new_product

        except Exception as e:
            # Rollback garanti en cas d’échec
            await self.db.rollback()
            raise e
    


#--------------------------------------------------------------------------------------
# update product
#--------------------------------------------------------------------------------------
    async def update_product(self, product_data: ProductUpdate, current_user: dict):
        try:
            async with self.db.begin():

                # Vérifier si le produit existe
                result = await self.db.execute(
                    select(ProductPrinting).where(ProductPrinting.id == product_data.id)
                )
                product = result.scalars().first()

                if not product:
                    raise ProductNotFound()

                # Sauvegarder l'ancien nom avant modification
                old_name = product.name

                # Détecter les changements
                updated_fields = []

                # Vérifier unicité du nouveau nom
                if product_data.name and product_data.name != product.name:
                    duplicate = await self.db.execute(
                        select(ProductPrinting).where(
                            ProductPrinting.name == product_data.name,
                            ProductPrinting.id != product.id
                        )
                    )
                    if duplicate.scalars().first():
                        raise ProductNameExists()

                # ---- UPDATE PARTIEL ----
                updates = product_data.dict(exclude_unset=True)

                for field, new_value in updates.items():
                    if field == "id":
                        continue

                    old_value = getattr(product, field)

                    # S'il y a un changement réel → on l’ajoute dans les logs
                    if old_value != new_value:
                        updated_fields.append(f"{field}({old_value}→{new_value})")
                        setattr(product, field, new_value)

                self.db.add(product)
                await self.db.flush()

                # Nouveau nom final
                new_name = product.name

                # Construire le message de champs mis à jour
                fields_log = ", ".join(updated_fields) if updated_fields else "no change"

                # ---- Audit log ----
                await self.create_audit_log(
                    object_id=product.id,
                    action=f"update product: {old_name} -> fields: {fields_log}",
                    performed_by=int(current_user["sub"]),
                    performed_by_email=current_user["email"]
                )

            return product

        except Exception as e:
            await self.db.rollback()
            raise e
