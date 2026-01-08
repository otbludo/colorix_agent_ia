import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ChevronDown } from 'lucide-react'
import { useStats } from '../../api/get/stats'

export function ProgressGauge({ token }) {
  const { data, isSuccess, isPending, isError, error } = useStats(token)

  useEffect(() => {
    if (isError) toast.error(error || 'Erreur réseau')
  }, [isError])

  // Récupération des stats de devis
  const totalDevis = data?.devis?.total_devis || 0
  const totalValide = data?.devis?.total_devis_by_status?.valide || 0
  const totalAttente = data?.devis?.total_devis_by_status?.attente || 0
  const totalRejeter = data?.devis?.total_devis_by_status?.rejeter || 0

  // Calcul du pourcentage pour le cercle
  const percentage = totalDevis > 0 ? Math.round((totalValide / totalDevis) * 100) : 0
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const colorixGreen = '#10b981'
  const colorixGold = '#f59e0b'

  return (
    <div className="futuristic-card rounded-2xl p-4 sm:p-6 slide-in-up">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold glow-text">Progression des devis</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64">
          {/* Effet de lumière en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

          <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="12" />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorixGreen} />
                <stop offset="50%" stopColor={colorixGold} />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="drop-shadow-lg"
            />
          </svg>
          <div className="absolute -top-[7px] inset-0 flex flex-col items-center justify-center  z-20">
            <div className="text-5xl font-bold text-white glow-text mb-1">{percentage}%</div>
            <div className="text-sm text-slate-400 -mt-1">Validé</div>
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-slate-500">0</div>
          <div className="absolute bottom-2 right-4 text-xs text-slate-500">100</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 w-full">
          <div className="futuristic-card p-4 rounded-2xl text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">{totalDevis}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Total</div>
          </div>
          <div className="futuristic-card p-4 rounded-2xl text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">{totalValide}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Validé</div>
          </div>
          <div className="futuristic-card p-4 rounded-2xl text-center group hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">{totalAttente}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Attente</div>
          </div>
          {totalRejeter > 0 && (
            <div className="futuristic-card p-4 rounded-2xl text-center group hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-red-400 group-hover:text-red-300 transition-colors">{totalRejeter}</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Rejeté</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
