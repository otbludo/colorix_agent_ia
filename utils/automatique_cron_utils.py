from utils.manage_customers_utils import CustomerCRUD
from db.database import get_db


async def update_customer_statuses():
    """Fonction appelée périodiquement pour mettre à jour les statuts des clients"""
    try:
        async for db in get_db():
            customer_crud = CustomerCRUD(db)
            await customer_crud.update_customer_status_based_on_devis()
            break  # On sort après la première itération
    except Exception as e:
        # Log silencieux des erreurs sans affichage console
        pass
