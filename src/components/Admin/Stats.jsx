import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Shield, CheckCircle, PauseCircle, Trash } from 'lucide-react'
import { OverviewCardBlue, OverviewCardGreen, OverviewCardYellow, OverviewCardRed } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsAdmins({token}) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCardBlue
        Icon={Shield}
        title={"Total admins"}
        value={`${data?.admins?.total_admins || 0}`}
      />
      <OverviewCardGreen
        Icon={CheckCircle}
        title={"Total admins actifs"}
        value={`${data?.admins?.total_admins_by_status.actif || 0}`}
      />
      <OverviewCardYellow
        Icon={PauseCircle}
        title={"Total admins inactifs"}
        value={`${data?.admins?.total_admins_by_status.inactif || 0}`}
      />
      <OverviewCardRed
        Icon={Trash}
        title={"Total admins supprimes"}
        value={`${data?.admins?.total_admins_deleted || 0}`}
      />
    </div>
  )
}