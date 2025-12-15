import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useStats } from '../../api/get/stats'
import { OverviewCard } from '../global/OverviewCard';
import { Users2, UserCheck2, UserPlus2, Shield } from 'lucide-react';

export function Stats() {
  const token = localStorage.getItem('colorix_token');
  const { data, isPending, isError, error } = useStats(token);

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
        value={`${data?.admins?.total_admins || 0}`}
        subtitle=""
        iconBgColor="from-[#10b981] to-[#34d399]"
      />
      <OverviewCard
        icon={<Users2 className="w-6 h-6 text-white" />}
        title="Total customer"
        value={`${data?.customers?.total_customers || 0}`}
        subtitle=""
        iconBgColor="from-[#4361ee] to-[#5ab9ff]"
      />
      <OverviewCard
        icon={<UserCheck2 className="w-6 h-6 text-white" />}
        title="Customers aproved"
        value={`${data?.customers?.total_customers_by_status.client || 0}`}
        subtitle=""
        iconBgColor="from-[#0ea5e9] to-[#38bdf8]"
      />
      <OverviewCard
        icon={<UserPlus2 className="w-6 h-6 text-white" />}
        title="Potential customers"
        value={`${data?.customers?.total_customers_by_status.potentiel || 0}`}
        subtitle=""
        iconBgColor="from-[#f97316] to-[#fbbf24]"
      />
    </div>
  )
}