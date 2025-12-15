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

  const colorixGreen = '#15803d'
  const colorixGold = '#ca8a04'

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Progression des devis</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 sm:w-64 sm:h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="12" />
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-800">{percentage}%</div>
            <div className="text-sm text-gray-500">Validé</div>
          </div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">0</div>
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">100</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 w-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{totalDevis}</div>
            <div className="text-xs text-gray-500 mt-1">Total devis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalValide}</div>
            <div className="text-xs text-gray-500 mt-1">Validé</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalAttente}</div>
            <div className="text-xs text-gray-500 mt-1">En attente</div>
          </div>
          {totalRejeter > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalRejeter}</div>
              <div className="text-xs text-gray-500 mt-1">Rejeté</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
