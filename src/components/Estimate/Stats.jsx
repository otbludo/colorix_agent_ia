import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { FileText, CheckCircle, PauseCircle, Trash } from 'lucide-react'
import { OverviewCardBlue, OverviewCardGreen, OverviewCardYellow, OverviewCardRed } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'

export function StatEstimate({ token }) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCardBlue
        Icon={FileText}
        title={"Total devis"}
        value={`${data?.devis?.total_devis || 0}`}
      />
      <OverviewCardGreen
        Icon={CheckCircle}
        title={"Total devis valides"}
        value={`${data?.devis?.total_devis_by_status.valide || 0}`}
      />
      <OverviewCardYellow
        Icon={PauseCircle}
        title={"Total devis en attentes"}
        value={`${data?.devis?.total_devis_by_status.attente || 0}`}
      />
      <OverviewCardRed
        Icon={Trash}
        title={"Total devis supprimes"}
        value={`${data?.devis?.devis_deleted || 0}`}
      />
    </div>
  )
}