from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Customer, CustomerDeleted, Admin, AdminDeleted, Devis, DevisDeleted, ProductPrinting, ProductPrintingDeleted, AuditLog
from messages.exceptions import CustomerNotFound


class StatsCRUD:
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


    #--------------------------------------------------------------------------------------
    # Stats from a specific customer
    #--------------------------------------------------------------------------------------

    async def get_stats_from_customer(self, customer_id: int, current_user: dict | None = None):
        try:
            performed_by = int(current_user["sub"])
            performed_by_email = current_user["email"]
            
            result = await self.db.execute(select(Customer).where(Customer.id == customer_id))
            customer = result.scalars().first()
            
            if not customer:
                raise CustomerNotFound()

            count_result = await self.db.execute(
            select(func.count(Devis.id)).where(Devis.id_customer == customer_id)
            )
            total_devis_count = count_result.scalar() or 0
        
            stats_status = await self.db.execute(
                select(Devis.status, func.count(Devis.id))
                .where(Devis.id_customer == customer_id)
                .group_by(Devis.status)
            )

            status_distribution = {row[0]: row[1] for row in stats_status.all()} 

            stats_prices = await self.db.execute(
                select(Devis.name_product, func.max(Devis.montant_ttc))
                .where(Devis.id_customer == customer_id)
                .group_by(Devis.name_product)
            )
            max_prices_per_product = {row[0]: row[1] for row in stats_prices.all()}
            
            await self.create_audit_log(
                object_id=customer.id,
                action=f"Retrieved dynamic devis stats for customer: {customer.email}",
                performed_by=performed_by,
                performed_by_email=performed_by_email
            )

            return {
                "stats": {
                    "total_devis": total_devis_count,
                    "by_status": status_distribution, 
                    "max_prices_by_product": max_prices_per_product,
                    "total_devis": sum(status_distribution.values())
                }
            }

        except Exception as e:
            await self.db.rollback()
            raise e