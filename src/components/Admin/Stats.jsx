import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Shield, CheckCircle, PauseCircle, Trash } from 'lucide-react'
import { OverviewCard } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsAdmins({ token }) {
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
        icon={<Shield />}
        title={"Total admins"}
        value={`${data?.admins?.total_admins || 0}`}
      />
      <OverviewCard
        variant="green"
        icon={<CheckCircle />}
        title={"Total admins actifs"}
        value={`${data?.admins?.total_admins_by_status.actif || 0}`}
      />
      <OverviewCard
        variant="yellow"
        icon={<PauseCircle />}
        title={"Total admins inactifs"}
        value={`${data?.admins?.total_admins_by_status.inactif || 0}`}
      />
      <OverviewCard
        variant="red"
        icon={<Trash />}
        title={"Total admins supprimes"}
        value={`${data?.admins?.total_admins_deleted || 0}`}
      />
    </div>
  )
}