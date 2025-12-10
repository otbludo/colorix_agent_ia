import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useStats } from '../../api/get/stats';
import { OverviewCard } from '../global/OverviewCard';
import { BarChart3, FolderKanban, Clock, Users, ChevronDown, Shield } from 'lucide-react';

export function Stats() {
  const token = localStorage.getItem('colorix_token');
  const { data, isPending, isError, error } = useStats(token);

  // Gestion des erreurs réseau
  useEffect(() => {
    if (isError) {
      toast.error(error || 'Erreur réseau !');
    }
  }, [isError]);


  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <OverviewCard
        icon={<Shield className="w-6 h-6 text-white" />}
        title="Total admins"
        value={`${data?.total_admins}`}
        subtitle=""
        // trend="down"
        // trendValue="10% decrease from last month"
        iconBgColor="from-[#10b981] to-[#34d399]"
      />
      <OverviewCard
        icon={<Users className="w-6 h-6 text-white" />}
        title="Total customer"
        value={`${data?.total_customers}`}
        subtitle=""
        // trend="up"
        // trendValue="0% increase from last month"
        iconBgColor="from-[#4361ee] to-[#5ab9ff]"
      />
      <OverviewCard
        icon={<Clock className="w-6 h-6 text-white" />}
        title="Customers aproved"
        value={`${data?.customers_by_status.client || 0}`}
        subtitle=""
        // trend="up"
        // trendValue="8% increase from last month"
        iconBgColor="from-[#0ea5e9] to-[#38bdf8]"
      />
      <OverviewCard
        icon={<Users className="w-6 h-6 text-white" />}
        title="Potential customers"
        value={`${data?.customers_by_status.potentiel || 0}`}
        subtitle=""
        // trend="up"
        // trendValue="2% increase from last month"
        iconBgColor="from-[#f97316] to-[#fbbf24]"
      />
    </div>
  )
}