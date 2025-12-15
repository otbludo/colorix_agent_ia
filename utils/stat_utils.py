from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Customer, CustomerDeleted, Admin, AdminDeleted, Devis, DevisDeleted, ProductPrinting, ProductPrintingDeleted


class StatsCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stats(self):
        
        #--------------------------------------------------------------------------------------
        # Admins
        #--------------------------------------------------------------------------------------
        
        total_admins_query = await self.db.execute(
            select(func.count(Admin.id))
        )
        total_admins = total_admins_query.scalar()

        total_admin_by_status_query = await self.db.execute(
            select(Admin.status, func.count(Admin.id))
            .group_by(Admin.status)
        )
        total_admins_by_status = {
            status: count for status, count in total_admin_by_status_query.all()
        }

        total_admins_deleted_query = await self.db.execute(
            select(func.count(AdminDeleted.id))
        )
        total_admins_deleted = total_admins_deleted_query.scalar()
        
        
        #--------------------------------------------------------------------------------------
        # Customers
        #--------------------------------------------------------------------------------------

        total_customers_query = await self.db.execute(
            select(func.count(Customer.id))
        )
        total_customers = total_customers_query.scalar()
        
        total_customers_by_status_query = await self.db.execute(
            select(Customer.status, func.count(Customer.id))
            .group_by(Customer.status)
        )
        total_customers_by_status = {
            status: count for status, count in total_customers_by_status_query.all()
        }

        total_customers_deleted_query = await self.db.execute(
            select(func.count(CustomerDeleted.id))
        )
        total_customers_deleted = total_customers_deleted_query.scalar()
        
        
        #--------------------------------------------------------------------------------------
        # Products
        #--------------------------------------------------------------------------------------

        total_products_query = await self.db.execute(
            select(func.count(ProductPrinting.id))
        )
        total_products = total_products_query.scalar()

        total_products_deleted_query = await self.db.execute(
            select(func.count(ProductPrintingDeleted.id))
        )
        total_products_deleted = total_products_deleted_query.scalar()
        
        
        #--------------------------------------------------------------------------------------
        # Devis
        #--------------------------------------------------------------------------------------
        
        total_devis_query = await self.db.execute(
            select(func.count(Devis.id))
        )
        total_devis = total_devis_query.scalar()
        
        devis_by_status_query = await self.db.execute(
            select(Devis.status, func.count(Devis.id))
            .group_by(Devis.status)
        )
        devis_by_status = {
            status: count for status, count in devis_by_status_query.all()
        }
        
        total_devis_deleted_query = await self.db.execute(
            select(func.count(DevisDeleted.id))
        )
        total_devis_deleted = total_devis_deleted_query.scalar()


        return {
            "admins":{
                "total_admins": total_admins,
                "total_admins_by_status": total_admins_by_status,
                "total_admins_deleted": total_admins_deleted
            },
            "customers":{
                "total_customers": total_customers,
                "total_customers_by_status": total_customers_by_status,
                "total_customers_deleted": total_customers_deleted
            },
            "products":{
                "total_products": total_products,
                "total_products_deleted": total_products_deleted
            },
            "devis":{
                "total_devis": total_devis,
                "total_devis_by_status": devis_by_status,
                "devis_deleted": total_devis_deleted
            },
            
        }
