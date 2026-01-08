from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy.future import select
from fastapi import HTTPException
from services.pdf import generate_invoice_pdf
from starlette.concurrency import run_in_threadpool
from services.email.send_mail import send_email
from services.email.model import Model
from db.models import ProductPrinting, Devis, DevisDeleted, Customer, Admin, CustomerCategory, AuditLog
from schemas.devis_schemas import DevisCreate, DevisUpdate, DevisStatus, DevisValidate, DevisDelete, DevisRecovery
from messages.exceptions import DevisNotFound

class DevisCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

#--------------------------------------------------------------------------------------
# Create audit log
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
# Websocket template simulation devis
#--------------------------------------------------------------------------------------
    async def websocket_simulate_devis(self, websocket: WebSocket):
        try:
            while True:
                data = await websocket.receive_json()
                devis_id = data.get("devis_id")

                if devis_id:
                    devis = (await self.db.execute(
                        select(Devis).where(Devis.id == int(devis_id))
                    )).scalar_one_or_none()
                    if not devis:
                        await websocket.send_json({"error": "Devis introuvable"})
                        continue
                    product = (await self.db.execute(
                        select(ProductPrinting).where(ProductPrinting.id == devis.id_product)
                    )).scalar_one_or_none()
                    if not product:
                        await websocket.send_json({"error": "Produit introuvable"})
                        continue

                    quantity = int(data.get("quantity", devis.quantity))
                    impression = data.get("impression", devis.impression)

                    taux = devis.taux_applique
                    TVA = devis.tva

                else:
                    id_product = int(data.get("id_product"))
                    id_customer = int(data.get("id_customer"))
                    quantity = int(data.get("quantity", 1))
                    impression = data.get("impression")

                    product = (await self.db.execute(
                        select(ProductPrinting).where(ProductPrinting.id == id_product)
                    )).scalar_one_or_none()

                    if not product:
                        await websocket.send_json({"error": "Produit introuvable"})
                        continue

                    customer = (await self.db.execute(
                        select(Customer).where(Customer.id == id_customer)
                    )).scalar_one_or_none()

                    if not customer:
                        await websocket.send_json({"error": "Client introuvable"})
                        continue

                    category = (await self.db.execute(
                        select(CustomerCategory).where(CustomerCategory.name == customer.category)
                    )).scalar_one_or_none()

                    taux = category.rate if category else 0
                    TVA = 0.1925

                if impression == "recto":
                    prix_unitaire = product.front_price
                elif impression == "recto_verso":
                    prix_unitaire = product.front_back_price
                else:
                    prix_unitaire = 0

                prix_base = prix_unitaire * quantity
                prix_apres_taux = prix_base * (1 + taux / 100)
                montant_tva = prix_apres_taux * TVA
                montant_ttc = prix_apres_taux + montant_tva

                await websocket.send_json({
                    "action": "simulation_result",
                    "prix_unitaire": prix_unitaire,
                    "prix_base": prix_base,
                    "taux_applique": taux,
                    "price_taux": prix_apres_taux,
                    "montant_tva": montant_tva,
                    "montant_ttc": montant_ttc,
                    "tva": TVA
                })

        except WebSocketDisconnect:
            print("Client déconnecté")
            
            

#--------------------------------------------------------------------------------------
# Create devis
#--------------------------------------------------------------------------------------
    async def create_devis(self, devis_data: DevisCreate, current_user):
        try:
            query = select(Customer).where(Customer.id == devis_data.id_customer)
            customer = (await self.db.execute(query)).scalar_one_or_none()
            if not customer:
                raise HTTPException(status_code=404, detail="Client introuvable")

            admin_id = int(current_user["sub"])
            query = select(Admin).where(Admin.id == admin_id)
            admin = (await self.db.execute(query)).scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=404, detail="Admin introuvable")

            query = select(CustomerCategory).where(CustomerCategory.name == customer.category)
            category = (await self.db.execute(query)).scalar_one_or_none()
            if not category:
                raise HTTPException(status_code=404, detail="Catégorie client introuvable")

            taux = category.rate

            query = select(ProductPrinting).where(ProductPrinting.id == devis_data.id_product)
            product = (await self.db.execute(query)).scalar_one_or_none()
            if not product:
                raise HTTPException(status_code=404, detail="Produit introuvable")

            if devis_data.impression == "recto":
                prix_unitaire = product.front_price
            elif devis_data.impression == "recto_verso":
                prix_unitaire = product.front_back_price
            else:
                raise HTTPException(400, "Type d'impression invalide (recto ou recto_verso)")

            prix_base = prix_unitaire * devis_data.quantity
            prix_apres_taux = prix_base * (1 + taux / 100)
            TVA = 0.1925
            montant_tva = prix_apres_taux * TVA
            montant_ttc = prix_apres_taux + montant_tva

            devis = Devis(
                name_product=product.name,
                description=product.description,
                format=product.format,
                quantity=devis_data.quantity,
                impression=devis_data.impression,
                printing_time=devis_data.printing_time,
                description_devis=devis_data.description_devis,
                name_customer=customer.name,
                first_name_customer=customer.first_name,
                email_customer=customer.email,
                taux_applique=taux,
                prix_base=prix_base,
                price_taux=prix_apres_taux,
                tva=TVA,
                montant_tva=montant_tva,
                montant_ttc=montant_ttc,
                id_product=product.id,
                id_customer=customer.id,
                id_admin=admin.id,
                status="attente"
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
        
        
        

#--------------------------------------------------------------------------------------
# Update devis
#--------------------------------------------------------------------------------------
    async def update_devis(self, devis_data: DevisUpdate, current_user):
        try:
            admin_id = int(current_user["sub"])
            query = select(Admin).where(Admin.id == admin_id)
            admin = (await self.db.execute(query)).scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=404, detail="Admin introuvable")

            query = select(Devis).where(Devis.id == devis_data.id)
            devis = (await self.db.execute(query)).scalar_one_or_none()
            if not devis:
                raise HTTPException(status_code=404, detail="Devis introuvable")

            query = select(ProductPrinting).where(ProductPrinting.id == devis.id_product)
            product = (await self.db.execute(query)).scalar_one_or_none()
            if not product:
                raise HTTPException(status_code=404, detail="Produit du devis introuvable")

            if devis_data.quantity is not None:
                devis.quantity = devis_data.quantity
            if devis_data.printing_time is not None:
                devis.printing_time = devis_data.printing_time
            if devis_data.description_devis is not None:
                devis.description_devis = devis_data.description_devis

            if devis.impression == "recto":
                prix_unitaire = product.front_price
            elif devis.impression == "recto_verso":
                prix_unitaire = product.front_back_price
            else:
                raise HTTPException(status_code=400, detail="Type d'impression invalide")

            prix_base = prix_unitaire * devis.quantity
            prix_apres_taux = prix_base * (1 + devis.taux_applique / 100)
            TVA = devis.tva
            montant_tva = prix_apres_taux * TVA
            montant_ttc = prix_apres_taux + montant_tva

            devis.prix_base = prix_base
            devis.price_taux = prix_apres_taux
            devis.montant_tva = montant_tva
            devis.montant_ttc = montant_ttc
            devis.status = "attente"

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




    async def validate_devis(self, devis_data: DevisValidate, current_user):
        try:
            admin_id = int(current_user["sub"])
            performed_by_email = current_user["email"]

            # 1. RÉCUPÉRATION (Utilisation de execute sans begin manuel)
            admin = (await self.db.execute(select(Admin).where(Admin.id == admin_id))).scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=404, detail="Admin introuvable")

            devis = (await self.db.execute(select(Devis).where(Devis.id == devis_data.id))).scalar_one_or_none()
            if not devis:
                raise HTTPException(status_code=404, detail="Devis introuvable")

            if devis.status == devis_data.status.rejeter:
                raise HTTPException(status_code=400, detail="Le devis est déjà rejeté.")

            pdf_path = None

            # 2. VALIDATION : GÉNÉRATION PDF ET ENVOI EMAIL
            if devis_data.status == devis_data.status.valide:
                devis_pdf_data = {
                    "id": devis.id,
                    "name_customer": devis.name_customer,
                    "first_name_customer": devis.first_name_customer,
                    "email_customer": devis.email_customer,
                    "name_product": devis.name_product,
                    "description_devis": devis.description_devis,
                    "quantity": devis.quantity,
                    "prix_base": devis.prix_base,
                    "taux_applique": devis.taux_applique,
                    "price_taux": devis.price_taux,
                    "tva": devis.tva,
                    "montant_tva": devis.montant_tva,
                    "montant_ttc": devis.montant_ttc,
                }

                pdf_path = await run_in_threadpool(generate_invoice_pdf, devis_pdf_data)
                
                # Envoi de l'email (si échec, l'erreur 503 est levée ici)
                try:
                    email_subject = f"Votre devis validé - {devis.name_product}"
                    email_content = Model.html_update_template(
                        email_subject,
                        f"Bonjour {devis.first_name_customer}, votre devis a été validé. La facture est jointe."
                    )
                    await send_email(
                        subject=email_subject,
                        html_content=email_content,
                        recipient_email=devis.email_customer,
                        pdf_path=pdf_path
                    )
                except Exception as e:
                    raise HTTPException(status_code=503, detail=f"Échec envoi email : {str(e)}")

            # 3. MISE À JOUR DE LA BASE (Gestion propre de la transaction)
            # Au lieu de 'async with self.db.begin():', on utilise un try/commit
            try:
                # Mise à jour du statut
                devis.status = devis_data.status
                self.db.add(devis)
                
                # Audit log
                action_desc = {
                    devis_data.status.valide: f"Validé et envoyé par email ({pdf_path})",
                    devis_data.status.rejeter: "Devis rejeté",
                    devis_data.status.revoquer: "Devis révoqué"
                }.get(devis_data.status, "Action effectuée")

                await self.create_audit_log(
                    object_id=devis.id,
                    action=action_desc,
                    performed_by=admin_id,
                    performed_by_email=performed_by_email
                )

                # On flush et on commit manuellement pour éviter le conflit "transaction already begun"
                await self.db.commit()

            except Exception as db_error:
                await self.db.rollback()
                raise HTTPException(status_code=500, detail=f"Erreur DB : {str(db_error)}")

            return {
                "message": "Opération réussie",
                "pdf_sent": True if pdf_path else False
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur système : {str(e)}")




#--------------------------------------------------------------------------------------
# Delete devis
#--------------------------------------------------------------------------------------
    async def delete_devis(self, devis_data: DevisDelete, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Vérifier que l'admin existe encore (il peut avoir été supprimé par le superadmin)
                query = select(Admin).where(Admin.id == performed_by)
                admin = (await self.db.execute(query)).scalar_one_or_none()
                if not admin:
                    raise HTTPException(status_code=404, detail="Admin introuvable")

                # Vérifier que le devis existe
                result = await self.db.execute(
                    select(Devis).where(Devis.id == devis_data.id)
                )
                devis = result.scalars().first()
                if not devis:
                    raise DevisNotFound()

                # Copier le devis dans la table DevisDeleted
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
                    created_at=devis.created_at
                )
                self.db.add(deleted_devis)

                # Supprimer le devis de la table principale
                await self.db.delete(devis)

                # Ajouter un log dans AuditLog
                action_desc = (
                    f"Suppression du devis {devis.name_product} "
                )
                await self.create_audit_log(
                    object_id=devis.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Devis '{deleted_devis.name}' supprimé avec succès et journalisé."}

        except Exception as e:
            await self.db.rollback()
            raise e


#--------------------------------------------------------------------------------------
# Recovery devis
#--------------------------------------------------------------------------------------
    async def recovery_devis(self, devis_data: DevisRecovery, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Vérifier que l'admin existe encore (il peut avoir été supprimé par le superadmin)
                query = select(Admin).where(Admin.id == performed_by)
                admin = (await self.db.execute(query)).scalar_one_or_none()
                if not admin:
                    raise HTTPException(status_code=404, detail="Admin introuvable")

                # Récupérer le devis supprimé
                result = await self.db.execute(
                    select(DevisDeleted).where(DevisDeleted.id == devis_data.id)
                )
                deleted_devis = result.scalars().first()
                if not deleted_devis:
                    raise DevisNotFound()

                # Restaurer le devis dans la table principale
                restored_devis = Devis(
                    id=deleted_devis.original_id,
                    name_product=deleted_devis.name,
                    description=deleted_devis.description,
                    format=deleted_devis.format,
                    quantity=deleted_devis.quantity,
                    impression=deleted_devis.impression,
                    printing_time=deleted_devis.printing_time,
                    description_devis=deleted_devis.description_devis,
                    tva=deleted_devis.tva,
                    prix_base=deleted_devis.prix_base,
                    price_taux=deleted_devis.price_taux,
                    montant_tva=deleted_devis.montant_tva,
                    montant_ttc=deleted_devis.montant_ttc,
                    taux_applique=deleted_devis.taux_applique,
                    name_customer=deleted_devis.name_customer,
                    first_name_customer=deleted_devis.first_name_customer,
                    email_customer=deleted_devis.email_customer,
                    id_product=deleted_devis.id_product,
                    id_customer=deleted_devis.id_customer,
                    id_admin=deleted_devis.id_admin,
                    status=deleted_devis.status,
                    created_at=deleted_devis.created_at
                )
                self.db.add(restored_devis)
                await self.db.flush()

                # Supprimer le devis de la table supprimée
                await self.db.delete(deleted_devis)

                # Ajouter un log dans AuditLog
                action_desc = f"Restauration du devis: {restored_devis.name_product}"

                await self.create_audit_log(
                    object_id=restored_devis.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Devis '{restored_devis.name_product}' restauré avec succès et journalisé."}

        except Exception as e:
            await self.db.rollback()
            raise e


#--------------------------------------------------------------------------------------
# Get devis
#--------------------------------------------------------------------------------------
    async def get_devis(self, status: DevisStatus | None = None, current_user: dict | None = None):
        try:
            async with self.db.begin():
                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                if status == DevisStatus.supprime:
                    result = await self.db.execute(select(DevisDeleted))
                    devis = result.scalars().all()

                    action_desc = "Consultation de la liste des devis supprimes "

                else:
                    result = await self.db.execute(select(Devis))
                    devis = result.scalars().all()

                    action_desc = "Consultation de la liste des devis "

                await self.create_audit_log(
                    object_id=0,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return devis

        except Exception as e:
            await self.db.rollback()
            raise e