import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ShoppingBag, Trash } from 'lucide-react'
import { OverviewCard } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsProducts({ token }) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || error || 'Erreur réseau !');
    }
  }, [isError]);


  // Valeurs par défaut si les données ne sont pas disponibles
  const totalProducts = data?.products?.total_products ?? 0;
  const totalDeletedProducts = data?.products?.total_products_deleted ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        variant="blue"
        icon={<ShoppingBag />}
        title={"Total produits"}
        value={totalProducts.toString()}
      />
      <OverviewCard
        variant="red"
        icon={<Trash />}
        title={"Total produits supprimes"}
        value={totalDeletedProducts.toString()}
      />
    </div>
  )
}