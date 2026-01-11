import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStats } from '../../api/get/stats'
import { Users2, UserCheck2, UserPlus2, Shield } from 'lucide-react';

// Composant OverviewCard stylisé
function OverviewCard({ icon, title, value, subtitle, iconBgColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] border border-slate-700/50">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Effet de lumière animé */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* Icône géante en arrière-plan avec opacité */}
      <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="scale-[3]">
          {React.cloneElement(icon, { className: "w-32 h-32" })}
        </div>
      </div>

      <div className="relative z-10">
        {/* Icône avec dégradé */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${iconBgColor} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Titre */}
        <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
          {title}
        </h3>

        {/* Valeur principale */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </span>
        </div>

        {/* Ligne de progression décorative */}
        {/* <div className="mt-4 h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${iconBgColor} rounded-full group-hover:w-full w-2/3 transition-all duration-1000`}></div>
        </div> */}

        {subtitle && (
          <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
        )}
      </div>

      {/* Bordure lumineuse au hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 blur-sm"></div>
      </div>
    </div>
  );
}

// Composant Stats
export function Stats() {
  // Simulation de données pour la démo
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
        <OverviewCard
          icon={<Shield className="w-6 h-6 text-white" />}
          title="Total admins"
          value={`${data?.admins?.total_admins || 0}`}
          subtitle="Administrateurs actifs"
          iconBgColor="from-emerald-500 to-emerald-400"
        />

        <OverviewCard
          icon={<Users2 className="w-6 h-6 text-white" />}
          title="Total customers"
          value={`${data?.customers?.total_customers || 0}`}
          subtitle="Base clients totale"
          iconBgColor="from-indigo-600 to-indigo-400"
        />

        <OverviewCard
          icon={<UserCheck2 className="w-6 h-6 text-white" />}
          title="Customers approved"
          value={`${data?.customers?.total_customers_by_status?.client || 0}`}
          subtitle="Clients validés"
          iconBgColor="from-sky-500 to-sky-400"
        />

        <OverviewCard
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