import os
from typing import Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from db.models import Admin, AuditLog, AdminDeleted
from db.security.hash import hash_password
from schemas.admin_schemas import AdminCreate, AdminUpdateInit, AdminStatus, AdminDelete, AdminRecovery
from fastapi import HTTPException
from services.email.model import Model
from services.email.send_mail import send_email
from db.security.jwt import verify_token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from messages.exceptions import AdminEmailExists, AdminNumberExists, AdminNotFound, AdminEmailMismatch, AdminStatusAlreadySet




class AdminCRUD:
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





    async def init_super_admin(self, admin_data: AdminCreate):
        # Vérifier si un superadmin existe déjà
        result_email = await self.db.execute(select(Admin).filter(Admin.email == admin_data.email))
        existing_email = result_email.scalars().first()
        if existing_email:
            raise AdminEmailExists()

        # Vérifier si le numéro existe déjà
        result_number = await self.db.execute(select(Admin).filter(Admin.number == admin_data.number))
        existing_number = result_number.scalars().first()
        if existing_number:
            raise AdminNumberExists()

        admin = Admin(
            name=admin_data.name,
            first_name=admin_data.first_name,
            number=admin_data.number,
            email=admin_data.email,
            post=admin_data.post,
            role=admin_data.role,
            password=hash_password(admin_data.password),
            status=admin_data.status
        )
        self.db.add(admin)
        await self.db.commit()
        await self.db.refresh(admin)
        return admin
    




#--------------------------------------------------------------------------------------
# create admin with audit log
#--------------------------------------------------------------------------------------
    async def create_admin(self, admin_data: AdminCreate, current_user: dict):
        try:
            async with self.db.begin():

                # Vérifier si l'email existe déjà
                result_email = await self.db.execute(
                    select(Admin).filter(Admin.email == admin_data.email)
                )
                if result_email.scalars().first():
                    raise AdminEmailExists()

                # Vérifier si le numéro existe déjà
                result_number = await self.db.execute(
                    select(Admin).filter(Admin.number == admin_data.number)
                )
                if result_number.scalars().first():
                    raise AdminNumberExists()

                # Créer l'admin
                admin = Admin(
                    name=admin_data.name,
                    first_name=admin_data.first_name,
                    number=admin_data.number,
                    email=admin_data.email,
                    post=admin_data.post,
                    role=admin_data.role,
                    password=hash_password(admin_data.password),
                    status=admin_data.status
                )

                self.db.add(admin)
                await self.db.flush()  # Générer admin.id avant audit

                # Audit log obligatoire
                await self.create_audit_log(
                    object_id=admin.id,
                    action=f"create admin: {admin.email}",
                    performed_by=int(current_user["sub"]) if current_user else None,
                    performed_by_email=current_user["email"] if current_user else None
                )

            # Commit automatique si tout est OK
            await self.db.refresh(admin)
            return {"message": f"Admin {admin.email} cree avec succes"}

        except Exception as e:
            await self.db.rollback()
            raise e

    



#--------------------------------------------------------------------------------------
# get admins by status 
#--------------------------------------------------------------------------------------
    async def get_admins_by_status(
        self, status: AdminStatus | None = None, current_user: dict | None = None
    ):
        if not current_user:
            raise HTTPException(status_code=401, detail="Utilisateur non authentifié")

        performed_by = int(current_user["sub"])
        performed_by_email = current_user["email"]

        try:
            async with self.db.begin():  # Transaction pour sécuriser l'audit

                if status == "supprime":
                    query = select(AdminDeleted)
                    result = await self.db.execute(query)
                    admins = result.scalars().all()

                    action_desc = (
                        f"Consultation de la liste des administrateurs SUPPRIMÉS "
                        f"par {performed_by_email}"
                    )
                else:
                    query = select(Admin)
                    if status:
                        query = query.filter(Admin.status == status)

                    result = await self.db.execute(query)
                    admins = result.scalars().all()

                    action_desc = (
                        f"Consultation de la liste des administrateurs avec statut '{status}' "
                        f"par {performed_by_email}"
                        if status
                        else f"Consultation de TOUS les administrateurs par {performed_by_email}"
                    )

                # Enregistrement du log
                await self.create_audit_log(
                    object_id=0,  # aucune entité spécifique
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            return admins

        except Exception as e:
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# Request admin info update
#--------------------------------------------------------------------------------------
    async def request_update_info(self, admin_update: AdminUpdateInit, current_user: dict):
        current_admin_id = int(current_user["sub"])

        try:
            async with self.db.begin():  # transaction pour sécuriser toute l'opération

                # Récupération de l'admin connecté
                result = await self.db.execute(
                    select(Admin).filter(Admin.id == current_admin_id)
                )
                connected_admin = result.scalars().first()

                if not connected_admin:
                    raise AdminNotFound()

                # Vérifier si l'email fourni correspond à celui actuel
                if admin_update.email != connected_admin.email:
                    raise AdminEmailMismatch()

                # Créer le lien sécurisé pour la mise à jour (expire après 5 minutes)
                payload = {
                    "sub": str(connected_admin.id),
                    "email": connected_admin.email,
                    "role": connected_admin.role,
                    "status": connected_admin.status
                }

                # Créer un token qui expire après 5 minutes
                token = create_access_token(payload, expires_delta_minutes=5)

                update_url = f"{os.getenv('FRONTEND_URL')}/api/v1/update-info?token={token}"

                subject = "Mise à jour de vos informations personnelles"
                content = f"""
                    Cliquez ici pour mettre à jour votre email ou numéro :<br>
                    <a href='{update_url}'>Mettre à jour mes informations</a><br>
                    Ce lien expire dans {ACCESS_TOKEN_EXPIRE_MINUTES} minutes.
                """

                html_message = Model.html_update_template(subject, content)

                # Envoi du mail
                await send_email(subject, html_message, connected_admin.email)

                # Audit log obligatoire
                action_desc = (
                    f"Demande d'initialisation de mise à jour des informations "
                    f"par l'admin {connected_admin.email} "
                    f"({connected_admin.name} {connected_admin.first_name})"
                )

                await self.create_audit_log(
                    object_id=connected_admin.id,
                    action=action_desc,
                    performed_by=connected_admin.id,
                    performed_by_email=connected_admin.email
                )

            # Commit automatique si tout est OK
            return {"message": "Email envoyé pour mettre à jour vos informations."}

        except Exception as e:
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# Get admin from token
#--------------------------------------------------------------------------------------
    async def get_admin_from_token(self, token: str):
        """
        Vérifie le token et retourne l'admin correspondant.
        """
        payload = verify_token(token)
        admin_id = int(payload["sub"])
        result = await self.db.execute(select(Admin).filter(Admin.id == admin_id))
        admin = result.scalars().first()
        if not admin:
            raise HTTPException(status_code=404, detail="Administrateur introuvable.")
        return admin
    




#--------------------------------------------------------------------------------------
# Change admin status with transactional audit log
#--------------------------------------------------------------------------------------
    async def change_admin_status(
        self, 
        admin_data: Union[AdminDelete, AdminRecovery],
        current_user: dict
    ):
        try:
            # Transaction pour le changement + audit log
            async with self.db.begin():
                admin_id = int(admin_data.id)
                performed_by = int(current_user["sub"])
                performed_by_email = current_user.get("email")  # email du superadmin
                new_status = admin_data.status.value

                # Vérifier si l'admin existe
                result = await self.db.execute(select(Admin).filter(Admin.id == admin_id))
                admin = result.scalars().first()
                if not admin:
                    raise AdminNotFound()

                old_status = admin.status
                if old_status == new_status:
                    raise AdminStatusAlreadySet()

                # Modifier le statut
                admin.status = new_status
                self.db.add(admin)
                await self.db.flush()  # Génère l'état pour l'audit log

                # Création du log d’audit
                action_desc = f"Changement de statut admin {admin.email}: {old_status} -> {new_status}"
                await self.create_audit_log(
                    object_id=admin.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Statut de l'administrateur {admin.email} changé de {old_status} à {new_status} avec succès."}

        except Exception as e:
            # Rollback automatique si erreur
            await self.db.rollback()
            raise e





#--------------------------------------------------------------------------------------
# Delete admin
#--------------------------------------------------------------------------------------
    async def delete_admin(self, admin_data: AdminDelete, current_user: dict):
        try:
            async with self.db.begin():
                admin_id = int(admin_data.id)
                performed_by = int(current_user["sub"])
                performed_by_email = current_user.get("email")

                # Vérifier que l'admin existe
                result = await self.db.execute(select(Admin).filter(Admin.id == admin_id))
                admin = result.scalars().first()
                if not admin:
                    raise AdminNotFound()

                # Copier dans la table AdminDeleted
                deleted_admin = AdminDeleted(
                    original_id=admin.id,
                    name=admin.name,
                    first_name=admin.first_name,
                    number=admin.number,
                    email=admin.email,
                    post=admin.post,
                    role=admin.role,
                    password=admin.password,
                )
                self.db.add(deleted_admin)
                await self.db.flush()  # Générer ID si nécessaire

                # Supprimer de la table principale
                await self.db.delete(admin)

                # Ajouter un log dans AuditLog
                action_desc = f"Suppression de l'admin {admin.email} ({admin.name} {admin.first_name})"
                await self.create_audit_log(
                    object_id=admin.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Admin {deleted_admin.email} supprimé avec succès et journalisé."}

        except Exception as e:
            # Rollback automatique en cas d'erreur
            await self.db.rollback()
            raise e

    



#--------------------------------------------------------------------------------------
# Recovery admin
#--------------------------------------------------------------------------------------
    async def recovery_admin(self, admin_data: AdminRecovery, current_user: dict):
        try:
            async with self.db.begin():
                deleted_id = int(admin_data.id)
                performed_by = int(current_user["sub"])
                performed_by_email = current_user.get("email")

                # Vérifier que l'admin existe dans AdminDeleted
                result = await self.db.execute(select(AdminDeleted).filter(AdminDeleted.id == deleted_id))
                deleted_admin = result.scalars().first()
                if not deleted_admin:
                    raise AdminNotFound()

                # Vérifier si un admin avec le même email existe déjà
                result_email = await self.db.execute(select(Admin).filter(Admin.email == deleted_admin.email))
                if result_email.scalars().first():
                    raise AdminEmailExists()

                # Vérifier si un admin avec le même numéro existe déjà
                result_number = await self.db.execute(select(Admin).filter(Admin.number == deleted_admin.number))
                if result_number.scalars().first():
                    raise AdminNumberExists()

                # Réinsérer dans la table principale
                admin = Admin(
                    id=deleted_admin.original_id,
                    name=deleted_admin.name,
                    first_name=deleted_admin.first_name,
                    number=deleted_admin.number,
                    email=deleted_admin.email,
                    post=deleted_admin.post,
                    role=deleted_admin.role,
                    password=deleted_admin.password,
                    status="actif"
                )
                self.db.add(admin)
                await self.db.flush()  # Pour générer l'id avant l'audit

                # Supprimer de la table AdminDeleted
                await self.db.delete(deleted_admin)

                # Ajouter un log
                action_desc = f"Admin {admin.email} ({admin.name} {admin.first_name}) réactivé par {performed_by_email}"
                await self.create_audit_log(
                    object_id=admin.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )

            # Commit automatique si tout est OK
            return {"message": f"Admin {admin.email} réactivé avec succès et journalisé."}

        except Exception as e:
            await self.db.rollback()
            raise e


#--------------------------------------------------------------------------------------
# get current admin info
#--------------------------------------------------------------------------------------
    async def get_current_admin_info(self, current_user: dict):
        try:
            async with self.db.begin():

                performed_by = int(current_user["sub"])
                performed_by_email = current_user["email"]

                # Récupérer les informations complètes de l'admin depuis la base de données
                result = await self.db.execute(
                    select(Admin).where(Admin.id == performed_by)
                )
                admin = result.scalars().first()
                if not admin:
                    raise AdminNotFound()

                # Créer un log d'audit pour cette consultation
                action_desc = f"Consultation des informations personnelles par l'admin {admin.email}"
                audit_entry = AuditLog(
                    object_id=admin.id,
                    action=action_desc,
                    performed_by=performed_by,
                    performed_by_email=performed_by_email
                )
                self.db.add(audit_entry)

                # Retourner les informations de l'admin (sans le mot de passe)
                admin_info = {
                    "id": admin.id,
                    "name": admin.name,
                    "first_name": admin.first_name,
                    "email": admin.email,
                    "number": admin.number,
                    "status": admin.status,
                    "role": admin.role,
                    "created_at": admin.created_at
                }

                return admin_info

        except Exception as e:
            await self.db.rollback()
            raise e

