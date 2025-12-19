import { Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { GetDevis } from '../../api/get/GetDevis'
import { CustomerFilterDropdown } from './DevisFilter'
import { CustomersActionsDropdown } from '../Customer/CustomerActionsDropdown'

const statusColors = {
  attente: 'bg-yellow-100 text-yellow-700',
  valide: 'bg-green-100 text-green-700',
  rejeter: 'bg-red-100 text-red-700',
  revoquer: 'bg-purple-100 text-purple-700'
}

export function DevistTable({ token, onEditDevis }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedDevis, setSelectedDevis] = useState(null)

  const [activeFilters, setActiveFilters] = useState({
    status: {
      attente: false,
      valide: false,
      rejeter: false,
    },
    customer: '',
    dateRange: {
      start: '',
      end: '',
    },
  })

  const { data: devisList, isSuccess, isPending, isError, error } = GetDevis(token, null)

  useEffect(() => {
    if (isError) toast.error(error?.datail || 'Erreur réseau')
  }, [isError])

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('fr-FR') : '—'

  /* ================= FILTER LOGIC ================= */

  const hasActiveFilters = () =>
    activeFilters.status.attente ||
    activeFilters.status.valide ||
    activeFilters.status.rejeter ||
    activeFilters.customer ||
    activeFilters.dateRange.start ||
    activeFilters.dateRange.end


  const filteredDevis = devisList
    ?.filter((devis) => {
      // 🔹 statut
      if (
        activeFilters.status.attente ||
        activeFilters.status.valide ||
        activeFilters.status.rejeter
      ) {
        const match =
          (activeFilters.status.attente && devis.status === 'attente') ||
          (activeFilters.status.valide && devis.status === 'valide') ||
          (activeFilters.status.rejeter && devis.status === 'rejeter')

        if (!match) return false
      }

      // 🔹 client
      if (activeFilters.customer) {
        const name =
          `${devis.name_customer} ${devis.first_name_customer}`.toLowerCase()
        if (!name.includes(activeFilters.customer.toLowerCase())) return false
      }

      // 🔹 date
      if (activeFilters.dateRange.start) {
        const start = new Date(activeFilters.dateRange.start)
        const createdAt = new Date(devis.created_at)
        if (
          createdAt.getFullYear() !== start.getFullYear() ||
          createdAt.getMonth() !== start.getMonth() ||
          createdAt.getDate() !== start.getDate()
        ) {
          return false
        }
      }

      if (activeFilters.dateRange.end) {
        const end = new Date(activeFilters.dateRange.end)
        const printingTime = new Date(devis.printing_time)
        if (
          printingTime.getFullYear() !== end.getFullYear() ||
          printingTime.getMonth() !== end.getMonth() ||
          printingTime.getDate() !== end.getDate()
        ) {
          return false
        }
      }

      return true
    })
    // 🔹 trier par date décroissante (plus récent d’abord)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    // 🔹 limiter à 5 devis
    .slice(0, 5)



  if (isPending) {
    return <div className="p-6 text-gray-500">Chargement des devis…</div>
  }

  /* ================= RENDER ================= */

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">
          Liste des devis
        </h2>

        <div className="relative">
          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${hasActiveFilters()
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              }`}
          >
            <div className="relative">
              <Filter className="w-4 h-4" />
              {hasActiveFilters() && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>
            <span>Filtrer</span>

            {hasActiveFilters() && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {filteredDevis.length}
              </span>
            )}
          </button>

          <CustomerFilterDropdown
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApplyFilters={setActiveFilters}
            currentFilters={activeFilters}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Produit
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Client
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Impression
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Montant TTC
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Statut
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Créé le
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDevis?.map((devis) => (
              <tr
                key={devis.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {devis.name_product}
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  {devis.name_customer} {devis.first_name_customer}
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  {devis.impression}
                </td>

                <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                  {devis.montant_ttc?.toLocaleString('fr-FR')} FCFA
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[devis.status] || 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {devis.status}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-gray-600">
                  {formatDate(devis.created_at)}
                </td>

                <td className="py-4 px-4">
                  <CustomersActionsDropdown
                    onEdit={() => onEditDevis(devis)}
                    onDelete={() => openDeleteModal(devis)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
