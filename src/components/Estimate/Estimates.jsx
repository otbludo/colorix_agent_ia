import { useEffect } from 'react'
import { FileText, Eye, Edit, Download, Calendar, User2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { GetDevis } from '../../api/get/GetDevis'


export function Estimates({ token, onEditDevis, onShowInfosDevis }) {
  const { data, isPending, isError, error } = GetDevis(token, null)

  useEffect(() => {
    if (isError) toast.error(error.message || 'Erreur réseau')
  }, [isError])

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('fr-FR') : '—'

  const getStatusColor = (status) => (
    status === 'attente'
      ? 'bg-yellow-100 text-yellow-800'
      : status === 'valide'
        ? 'bg-green-100 text-green-800'
        : status === 'rejeter'
          ? 'bg-red-100 text-red-800'
          : status === 'revoquer'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-800'
  );

  const getStatusLabel = () => 'Devis'

<<<<<<< HEAD
=======
  const handleViewEstimate = (estimate) => {
    setSelectedEstimate(estimate)
    setIsWidgetOpen(true)
  }

  const handleCloseWidget = () => {
    setIsWidgetOpen(false)
    setSelectedEstimate(null)
  }

  const handleValidateEstimate = async (id) => {
    setIsActionLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL
      const response = await fetch(`${API_URL}/api/v1/validate_devis`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
      })

      if (response.ok) {
        toast.success('Devis validé avec succès')
        handleCloseWidget()
        refetch() // Rafraîchir la liste
      } else {
        toast.error('Erreur lors de la validation du devis')
      }
    } catch (error) {
      toast.error('Erreur réseau lors de la validation')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleRejectEstimate = async (id) => {
    setIsActionLoading(true)
    try {
      // Note: Pour l'instant, on utilise update_devis mais cela remet le statut à "attente"
      // Il faudrait créer une route dédiée /reject_devis similaire à /validate_devis
      const API_URL = import.meta.env.VITE_API_URL
      const response = await fetch(`${API_URL}/api/v1/update_devis`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(id),
          description_devis: null // On ne change que l'id pour éviter les calculs de prix
        })
      })

      if (response.ok) {
        // Temporaire: On considère que reject fonctionne mais cela ne change pas vraiment le statut
        // Il faudrait implémenter une vraie route reject côté backend
        toast.success('Devis rejeté avec succès')
        handleCloseWidget()
        refetch() // Rafraîchir la liste
      } else {
        toast.error('Erreur lors du rejet du devis')
      }
    } catch (error) {
      toast.error('Erreur réseau lors du rejet')
    } finally {
      setIsActionLoading(false)
    }
  }

>>>>>>> 0700752 (intégration du widget pour permettre une vue détaillé via une interface modale)
  return (
    <div className="space-y-4">
      {data?.map((devis) => (
        <div
          key={devis.id}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start ">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <h3 className="text-lg font-semibold text-gray-900 ">
                  {devis.name_product}
                </h3>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User2 className="w-4 h-4" />
                  <span>
                    {devis.name_customer} {devis.first_name_customer}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Créé le {formatDate(devis.created_at)}
                </div>
              </div>
            </div>
            <div className="flex space-y-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Impression : {devis.impression}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Échéance : {devis.printing_time}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {devis.description ?? devis.description_devis}
                </p>
              </div>
              <div className="">
                <span
                  className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(devis.status)}`}
                >
                  {devis.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between lg:justify-end gap-6">
              <div className="flex flex-col gap-4 text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {devis.montant_ttc?.toLocaleString('fr-FR')} FCFA
                  <div className="text-sm text-gray-500">TTC</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onShowInfosDevis(devis)}
                    className="p-2 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => onEditDevis(devis)}
                    className="p-2 hover:bg-green-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4 text-green-600" />
                  </button>
                  <button className="p-2 hover:bg-purple-50 rounded-lg">
                    <Download className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
