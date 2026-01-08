import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ShoppingBag, Trash } from 'lucide-react'
import { OverviewCardBlue, OverviewCardRed } from '../global/OverviewCard'
import { useStats } from '../../api/get/stats'


export function StatsProducts({ token }) {
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || error || 'Erreur réseau !');
    }
  }, [isError]);

  // Debug: Afficher les données reçues
  useEffect(() => {
    if (data) {
      console.log('StatsProducts data:', data);
    }
  }, [data]);

  // Valeurs par défaut si les données ne sont pas disponibles
  const totalProducts = data?.products?.total_products ?? 0;
  const totalDeletedProducts = data?.products?.total_products_deleted ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <OverviewCardBlue
        Icon={ShoppingBag}
        title={"Total produits"}
        value={totalProducts.toString()}
      />
      <OverviewCardRed
        Icon={Trash}
        title={"Total produits supprimes"}
        value={totalDeletedProducts.toString()}
      />
    </div>
  )
}