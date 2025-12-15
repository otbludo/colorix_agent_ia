from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import AuditLog
from datetime import datetime, timedelta, timezone

class auditLogsCRUD:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_audit_logs(self):
        try:
            async with self.db.begin():
                result = await self.db.execute(select(AuditLog))
                logs = result.scalars().all()

            # Dates de référence (aware UTC)
            now = datetime.now(timezone.utc)
            today_start = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
            last_7_days_start = today_start - timedelta(days=7)

            # Pour le mois précédent
            first_day_this_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
            last_day_last_month = first_day_this_month - timedelta(seconds=1)
            first_day_last_month = datetime(last_day_last_month.year, last_day_last_month.month, 1, tzinfo=timezone.utc)

            # Filtrage
            logs_dict = {
                "all": logs,
                "today": [log for log in logs if log.timestamp >= today_start],
                "last_7_days": [log for log in logs if log.timestamp >= last_7_days_start],
                "last_month": [log for log in logs if first_day_last_month <= log.timestamp <= last_day_last_month],
            }

            return logs_dict

        except Exception as e:
            await self.db.rollback()
            raise e
