import React, { useState, useEffect } from 'react'
import { Plus, Filter } from 'lucide-react'
import { toast } from 'react-toastify'
import { GetCustomerCategory } from '../../api/get/GetCustomerCategory'
import { RecoveryCustomerCategory } from '../../api/post/RecoveryCustomerCategory'
import { CustomerCategoryActionsDropdown } from './CustomerCategoryActionsDropdown'
import { CustomerCategoryFilter } from './CustomerCategoryFilter'
import { ButtonRecovery, ButtonFilter } from '../global/Button'

export function CustomerCategoryLoad({ token, onDeleteCategory, onEditCategory, onAddCategory }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: { supprime: false },
  })

  const getSelectedStatus = () => {
    if (filters.status.supprime) return 'supprime'
    return null
  }

  const statusFilter = getSelectedStatus()

  const { mutate: recoverCategory, isPending: isRecovering, isSuccess: isRecoverySuccess, data: recoveryData, isError: isRecoveryError, error: recoveryError } = RecoveryCustomerCategory(token)
  const { data, isPending, isError, error } = GetCustomerCategory(token, statusFilter)


  const handleAddCategory = () => {
    if (onAddCategory) {
      onAddCategory()
    }
  }

  useEffect(() => {
    if (isRecoverySuccess && recoveryData?.message) {
      toast.success(recoveryData.message)
    }
    if (isRecoverySuccess && recoveryData?.detail) toast.error(recoveryData.detail)
  }, [isRecoverySuccess, recoveryData])

  useEffect(() => {
    if (isRecoveryError) toast.error((recoveryError || recoveryError) || 'Erreur réseau !')
  }, [isRecoveryError, recoveryError])

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || error || 'Erreur lors du chargement des catégories')
    }
  }, [isError, error])


  // Couleurs futuristes pour les catégories
  const colors = [
    'bg-gradient-to-br from-red-500 to-rose-500',
    'bg-gradient-to-br from-emerald-500 to-green-500',
    'bg-gradient-to-br from-amber-500 to-yellow-500',
    'bg-gradient-to-br from-blue-500 to-indigo-500'
  ]

  return (
    <div className="futuristic-card rounded-2xl p-4 sm:p-6 slide-in-up">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between mb-6">
        <h2 className="text-xl font-bold glow-text">Catégories clients</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <ButtonFilter
              isActive={!!statusFilter}
              count={data?.length}
              onClick={() => setIsFilterOpen(prev => !prev)}
            />
            <CustomerCategoryFilter
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={setFilters}
              currentFilters={filters}
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 hover:scale-105 border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 py-4 sm:py-8">
        {isPending ? (
          <div className="text-slate-400">Chargement des catégories...</div>
        ) : Array.isArray(data) && data.length > 0 ? data
          .filter(item => item && typeof item === 'object')
          .map((item, index) => (
            <div key={item?.id || index} className="flex flex-col items-center group relative">
              {/* Menu d'actions */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                <CustomerCategoryActionsDropdown
                  category={item}
                  onEdit={() => item && onEditCategory && onEditCategory(item)}
                  onDelete={() => item && onDeleteCategory && onDeleteCategory(item)}
                />
              </div>

              {/* Icône de récupération pour les catégories supprimées */}
              {statusFilter === 'supprime' && (
                <div className="absolute -top-2 -left-2 z-10">
                  <ButtonRecovery onClick={() => item.id && recoverCategory({ id: item.id })} />
                </div>
              )}

              {/* Cercle avec effet futuriste */}
              <div className="relative mb-4">
                <div
                  className={`w-20 h-20 ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 shadow-2xl group-hover:scale-110 transition-all duration-500 ring-4 ring-slate-600/30`}
                >
                  {item?.rate || 0}%
                </div>
                {/* Cercle lumineux autour */}
                <div className={`absolute inset-0 rounded-full ${colors[index % colors.length]} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
              </div>

              <div className="text-sm text-slate-300 mb-3 group-hover:text-white transition-colors font-medium">{item?.name || 'Nom inconnu'}</div>

              {/* Barre verticale futuriste */}
              <div className="relative">
                <div className="w-1 h-16 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full shadow-lg"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-lg animate-pulse"></div>
              </div>

              {/* Indicateur en bas futuriste */}
              <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full mt-3 ring-2 ring-slate-500/50 shadow-lg group-hover:ring-indigo-400/50 transition-all duration-300"></div>
            </div>
          )) : (
          <div className="text-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                <span className="text-slate-500">📊</span>
              </div>
              <span>Aucune catégorie trouvée</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
