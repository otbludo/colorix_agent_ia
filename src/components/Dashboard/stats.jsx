import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useStats} from '../../api/get/stats';
import { OverviewCard } from '../global/OverviewCard';
import {BarChart3, FolderKanban, Clock,Users, ChevronDown} from 'lucide-react';

export function Stats() {
  const navigate = useNavigate();
  const token = localStorage.getItem('colorix_token');
  const { data, isPending, isError, error } = useStats(token);

  // Gestion des erreurs réseau
  useEffect(() => {
    if (isError) {
      // Si l'API retourne une erreur 401 ou message "Token expiré"
      if (error?.message?.toLowerCase().includes('unauthorized') || error?.message?.toLowerCase().includes('token')) {
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        localStorage.removeItem('colorix_token'); // Supprimer le token expiré
        navigate('/login'); 
      } else {
        toast.error(error?.message || 'Erreur réseau !');
      }
    }
  }, [isError, error, navigate]);


    return(
         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewCard
                icon={<BarChart3 className="w-6 h-6 text-white" />}
                title="Total customer"
                value={`$${data?.total_customers}`}
                subtitle=""
                // trend="up"
                // trendValue="0% increase from last month"
                iconBgColor="from-[#4361ee] to-[#5ab9ff]"
              />
              <OverviewCard
                icon={<FolderKanban className="w-6 h-6 text-white" />}
                title="Total admins"
                value={`$${data?.total_admins}`}
                subtitle=""
                // trend="down"
                // trendValue="10% decrease from last month"
                iconBgColor="from-[#f97316] to-[#fbbf24]"
              />
              <OverviewCard
                icon={<Clock className="w-6 h-6 text-white" />}
                title="Time spent"
                value="1022"
                subtitle="/1300 Hrs"
                // trend="up"
                // trendValue="8% increase from last month"
                iconBgColor="from-[#0ea5e9] to-[#38bdf8]"
              />
              <OverviewCard
                icon={<Users className="w-6 h-6 text-white" />}
                title="Resources"
                value="101"
                subtitle="/120"
                // trend="up"
                // trendValue="2% increase from last month"
                iconBgColor="from-[#10b981] to-[#34d399]"
              />
            </div>
    )
}