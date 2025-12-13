import { useEffect } from 'react'
import {
  FileText,
  Eye,
  Edit,
  Download,
  Calendar,
  User,
} from 'lucide-react'
import { toast } from 'react-toastify'
import { GetDevis } from '../../api/get/GetDevis'

export function Estimates({ token, onEditDevis }) {
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
          : 'bg-gray-100 text-gray-800'
  );

  const getStatusLabel = () => 'Devis'

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
                  <User className="w-4 h-4" />
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
                  <button className="p-2 hover:bg-blue-50 rounded-lg">
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
