from utils.manage_customers_utils import CustomerCRUD
from db.database import get_db


async def update_customer_statuses():
    """Fonction appelée périodiquement pour mettre à jour les statuts des clients"""
    try:
        async for db in get_db():
            customer_crud = CustomerCRUD(db)
            result = await customer_crud.update_customer_status_based_on_devis()
            print(f"Mise à jour automatique des statuts clients: {result['message']}")
            break  # On sort après la première itération
    except Exception as e:
        print(f"Erreur lors de la mise à jour automatique des statuts clients: {e}")
