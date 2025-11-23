from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Customer, Admin, Devis


class StatsCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stats(self):
        # Total Customers
        total_customers_query = await self.db.execute(
            select(func.count(Customer.id))
        )
        total_customers = total_customers_query.scalar()

        # Total Admins
        total_admins_query = await self.db.execute(
            select(func.count(Admin.id))
        )
        total_admins = total_admins_query.scalar()

        # # Total Devis
        # total_devis_query = await self.db.execute(
        #     select(func.count(Devis.id))
        # )
        # total_devis = total_devis_query.scalar()

        # # Devis by status
        # devis_by_status_query = await self.db.execute(
        #     select(Devis.status, func.count(Devis.id))
        #     .group_by(Devis.status)
        # )
        # devis_by_status = {
        #     status: count for status, count in devis_by_status_query.all()
        # }

        # Customers by status
        customers_by_status_query = await self.db.execute(
            select(Customer.status, func.count(Customer.id))
            .group_by(Customer.status)
        )
        customers_by_status = {
            status: count for status, count in customers_by_status_query.all()
        }

        # Return dict structure (StatsResponse va convertir automatiquement)
        return {
            "total_customers": total_customers,
            "total_admins": total_admins,
            # "total_devis": total_devis,
            # "devis_by_status": devis_by_status,
            "customers_by_status": customers_by_status
        }
