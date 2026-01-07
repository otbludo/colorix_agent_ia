import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { toast } from 'react-toastify'

export function DeleteConfirmModal({
  isOpen,
  onClose,
  entityName,
  entityId,
  deleteApi,
  isPending,
  isSuccess,
  isError,
  data,
  error
}) {
  const token = localStorage.getItem('colorix_token')

  const handleConfirm = async () => {
    deleteApi({ id: entityId })
  }

  useEffect(() => {
    if (isSuccess) {
      if (data?.message) toast.success(data.message)
      if (data?.detail) toast.error(data.detail)
      onClose()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) toast.error(error?.message || 'Erreur réseau !')
  }, [isError, error])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative futuristic-card rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-10 rounded-2xl">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Particules flottantes en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-4 right-6 w-2 h-2 bg-red-400/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-4 w-1 h-1 bg-red-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-full border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Confirmer la suppression</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group">
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
        <div className="relative z-10 mb-6">
          <p className="text-slate-300">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-white">"{entityName}"</span> ?
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Cette action est irréversible et toutes les données associées seront perdues.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-slate-800/50 text-slate-300 rounded-2xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 font-medium backdrop-blur-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`flex-1 px-4 py-2 rounded-2xl transition-all duration-300 font-medium border ${isPending
                ? 'bg-red-500/50 text-red-300 border-red-500/30'
                : 'bg-red-600 hover:bg-red-500 text-white border-red-500/30 shadow-lg shadow-red-500/20'
              }`}
          >
            {isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}
