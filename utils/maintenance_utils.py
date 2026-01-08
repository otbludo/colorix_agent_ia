from sqlalchemy import delete
from datetime import datetime, timedelta
from db.database import AsyncSessionLocal  # Nom corrigé ici
import db.models as models

async def clean_expired_archives():
    """Supprime les données de plus de 30 jours (Version Asynchrone)."""
    # On définit la date limite
    threshold_date = datetime.now() - timedelta(days=30)
    
    archive_tables = [
        models.AdminDeleted,
        models.CustomerDeleted,
        models.DevisDeleted,
        models.ProductPrintingDeleted,
        models.CustomerCategoryDeleted
    ]
    
    async with AsyncSessionLocal() as db:
        try:
            for table in archive_tables:
                # Détecte la colonne de date (deleted_at ou created_at)
                date_col = getattr(table, 'deleted_at', getattr(table, 'created_at', None))
                
                if date_col is not None:
                    # Utilisation de la syntaxe delete() de SQLAlchemy 2.0
                    stmt = delete(table).where(date_col < threshold_date)
                    await db.execute(stmt)
            
            await db.commit()
            print(f"[{datetime.now()}] Maintenance asynchrone réussie.")
        except Exception as e:
            await db.rollback()
            print(f"Erreur maintenance : {e}")