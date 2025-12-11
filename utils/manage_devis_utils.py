from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from db.models import ProductPrinting, Devis, Customer, Admin, CustomerCategory
from schemas.devis_schemas import DevisCreate, DevisUpdate

class DevisCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_devis(self, devis_data: DevisCreate, current_user):
        try:
            # 1️⃣ Vérifier si le client existe
            query = select(Customer).where(Customer.id == devis_data.id_customer)
            customer = (await self.db.execute(query)).scalar_one_or_none()
            if not customer:
                raise HTTPException(status_code=404, detail="Client introuvable")

            # 2️⃣ Vérifier si l'admin existe
            admin_id = int(current_user["sub"])
            query = select(Admin).where(Admin.id == admin_id)
            admin = (await self.db.execute(query)).scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=404, detail="Admin introuvable")

            # 3️⃣ Vérifier si la catégorie du client existe
            query = select(CustomerCategory).where(CustomerCategory.name == customer.category)
            category = (await self.db.execute(query)).scalar_one_or_none()
            if not category:
                raise HTTPException(status_code=404, detail="Catégorie client introuvable")

            taux = category.rate  # positif = bonus, négatif = réduction

            # 4️⃣ Vérifier si le produit existe
            query = select(ProductPrinting).where(ProductPrinting.id == devis_data.id_product)
            product = (await self.db.execute(query)).scalar_one_or_none()
            if not product:
                raise HTTPException(status_code=404, detail="Produit introuvable")

            # 5️⃣ Déterminer le prix unitaire
            if devis_data.impression == "recto":
                prix_unitaire = product.front_price
            elif devis_data.impression == "recto_verso":
                prix_unitaire = product.front_back_price
            else:
                raise HTTPException(400, "Type d'impression invalide (recto ou recto_verso)")

            # 6️⃣ Calcul du prix avec le taux appliqué
            prix_base = prix_unitaire * devis_data.quantity
            prix_apres_taux = prix_base * (1 + taux / 100)  # taux positif ou négatif
            TVA = 0.1925
            montant_tva = prix_apres_taux * TVA
            montant_ttc = prix_apres_taux + montant_tva

            # 7️⃣ Enregistrement en base
            devis = Devis(
                name=product.name,
                description=product.description,
                format=product.format,
                quantity=devis_data.quantity,
                impression=devis_data.impression,
                printing_time=devis_data.printing_time,
                taux_applique=taux,  # nouveau champ
                prix_base=prix_base,
                price_taux=prix_apres_taux,
                tva=TVA,
                montant_tva=montant_tva,
                montant_ttc=montant_ttc,
                id_product=product.id,
                id_customer=customer.id,
                id_admin=admin.id,
            )

            self.db.add(devis)
            await self.db.commit()
            await self.db.refresh(devis)

            return {
                "message": "Devis créé avec succès",
                "devis": devis
            }

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Erreur lors de la création du devis: {str(e)}")
        
    


    async def update_devis(self, devis_data: DevisUpdate, current_user):
        try:
            # 1️⃣ Vérifier si l'admin existe
            admin_id = int(current_user["sub"])
            query = select(Admin).where(Admin.id == admin_id)
            admin = (await self.db.execute(query)).scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=404, detail="Admin introuvable")

            # 2️⃣ Récupérer le devis
            query = select(Devis).where(Devis.id == devis_data.devis_id)
            devis = (await self.db.execute(query)).scalar_one_or_none()
            if not devis:
                raise HTTPException(status_code=404, detail="Devis introuvable")

            # 3️⃣ Récupérer le produit lié
            query = select(ProductPrinting).where(ProductPrinting.id == devis.id_product)
            product = (await self.db.execute(query)).scalar_one_or_none()
            if not product:
                raise HTTPException(status_code=404, detail="Produit du devis introuvable")

            # 4️⃣ Mise à jour des champs simples
            if devis_data.quantity is not None:
                devis.quantity = devis_data.quantity
            if devis_data.printing_time is not None:
                devis.printing_time = devis_data.printing_time

            # 5️⃣ Recalcul complet des prix
            # Déterminer le prix unitaire
            if devis.impression == "recto":
                prix_unitaire = product.front_price
            elif devis.impression == "recto_verso":
                prix_unitaire = product.front_back_price
            else:
                raise HTTPException(status_code=400, detail="Type d'impression invalide")

            # Calcul des montants
            prix_base = prix_unitaire * devis.quantity
            prix_apres_taux = prix_base * (1 + devis.taux_applique / 100)  # taux = bonus ou réduction
            TVA = devis.tva  # déjà enregistré (0.1925)
            montant_tva = prix_apres_taux * TVA
            montant_ttc = prix_apres_taux + montant_tva

            # 6️⃣ Mise à jour des valeurs calculées
            devis.prix_base = prix_base
            devis.price_taux = prix_apres_taux
            devis.montant_tva = montant_tva
            devis.montant_ttc = montant_ttc

            # 7️⃣ Commit final
            self.db.add(devis)
            await self.db.commit()
            await self.db.refresh(devis)

            return {
                "message": "Devis mis à jour avec succès",
                "devis": devis
            }

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise HTTPException(
                status_code=500, 
                detail=f"Erreur lors de la mise à jour du devis: {str(e)}"
            )
