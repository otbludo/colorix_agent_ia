import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStats } from '../../api/get/stats'
import { Users2, UserCheck2, UserPlus2, Shield } from 'lucide-react';
import { OverviewCardDashbord } from '../global/OverviewCard'


export function Stats() {
  const token = localStorage.getItem('colorix_token');
  const { data, isPending, isError, error } = useStats(token);

  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);

  return (
    <div className=" ">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewCardDashbord
          icon={<Shield className="w-6 h-6 text-white" />}
          title="Total admins"
          value={`${data?.admins?.total_admins || 0}`}
          subtitle="Administrateurs actifs"
          iconBgColor="from-emerald-500 to-emerald-400"
        />

        <OverviewCardDashbord
          icon={<Users2 className="w-6 h-6 text-white" />}
          title="Total customers"
          value={`${data?.customers?.total_customers || 0}`}
          subtitle="Base clients totale"
          iconBgColor="from-indigo-600 to-indigo-400"
        />

        <OverviewCardDashbord
          icon={<UserCheck2 className="w-6 h-6 text-white" />}
          title="Customers approved"
          value={`${data?.customers?.total_customers_by_status?.client || 0}`}
          subtitle="Clients validés"
          iconBgColor="from-sky-500 to-sky-400"
        />

        <OverviewCardDashbord
          icon={<UserPlus2 className="w-6 h-6 text-white" />}
          title="Potential customers"
          value={`${data?.customers?.total_customers_by_status?.potentiel || 0}`}
          subtitle="Prospects à convertir"
          iconBgColor="from-orange-500 to-amber-400"
        />
      </div>

      {/* Effet de particules en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}