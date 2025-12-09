from sqlalchemy.future import select
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import AuditLog


class auditLogsCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_audit_logs(self):
        try:
            async with self.db.begin():
                result = await self.db.execute(select(AuditLog))
                logs = result.scalars().all()

            return logs
        
        except Exception as e:
            await self.db.rollback()
            raise e