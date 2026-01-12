import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'



export function OverviewCard({ icon, title, value, subtitle, variant = "indigo" }) {
  const baseClasses =
    "relative futuristic-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-500";

  const variants = {
    indigo: {
      glow: "from-indigo-500/20 to-purple-500/20",
      icon: "from-indigo-600 to-indigo-500",
      border: "border-indigo-500/50",
    },
    blue: {
      glow: "from-blue-500/20 to-indigo-500/20",
      icon: "from-blue-600 to-blue-500",
      border: "border-blue-500/50",
    },
    green: {
      glow: "from-emerald-500/20 to-green-500/20",
      icon: "from-emerald-600 to-emerald-500",
      border: "border-emerald-500/50",
    },
    yellow: {
      glow: "from-amber-500/20 to-yellow-500/20",
      icon: "from-amber-600 to-amber-500",
      border: "border-amber-500/50",
    },
    red: {
      glow: "from-red-500/20 to-rose-500/20",
      icon: "from-red-600 to-red-500",
      border: "border-red-500/50",
    },
  };

  const styles = variants[variant] || variants.indigo;

  return (
    <div className={baseClasses}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}>
        </div>
      </div>

      {/* Animated glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${styles.glow} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${styles.icon} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>

        <h3 className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-wider">
          {title}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </span>
          {subtitle && <span className="text-slate-500 text-lg">{subtitle}</span>}
        </div>
      </div>

      {/* Hover border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className={`absolute inset-0 rounded-2xl border-2 ${styles.border} blur-sm`}
        ></div>
      </div>
    </div>
  );
}



export function OverviewCardDashbord({ icon, title, value, subtitle, iconBgColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] border border-slate-700/50">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}>
        </div>
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
