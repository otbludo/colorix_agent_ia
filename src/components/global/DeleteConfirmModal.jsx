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
        className="absolute inset-0 bg-opacity-20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-900">"{entityName}"</span> ?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Cette action est irréversible et toutes les données associées seront perdues.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${isPending ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white`}
          >
            {isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}
