import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Users2, UserCheck2, UserPlus2, Trash } from 'lucide-react'
import { OverviewCard } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsCustomers({ token }) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        variant="blue"
        icon={<Users2 />}
        title={"Total clients"}
        value={`${data?.customers?.total_customers || 0}`}
      />
      <OverviewCard
        variant="green"
        icon={<UserCheck2 />}
        title={"Total clients confirmes"}
        value={`${data?.customers?.total_customers_by_status.client || 0}`}
      />
      <OverviewCard
        variant="yellow"
        icon={<UserPlus2 />}
        title={"Total clients potentiels"}
        value={`${data?.customers?.total_customers_by_status.potentiel || 0}`}
      />
      <OverviewCard
        variant="red"
        icon={<Trash />}
        title={"Total clients supprimes"}
        value={`${data?.customers?.total_customers_deleted || 0}`}
      />
    </div>
  )
}