import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ShoppingBag, Trash } from 'lucide-react'
import { OverviewCardBlue, OverviewCardRed } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsProducts({ token }) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCardBlue
        Icon={ShoppingBag}
        title={"Total produits"}
        value={`${data?.products.total_products || 0}`}
      />
      <OverviewCardRed
        Icon={Trash}
        title={"Total produits supprimes"}
        value={`${data?.products.total_products_deleted || 0}`}
      />
    </div>
  )
}