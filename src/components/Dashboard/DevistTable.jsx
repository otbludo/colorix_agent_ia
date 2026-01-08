import { Filter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { GetDevis } from '../../api/get/GetDevis'
import { CustomerFilterDropdown } from './DevisFilter'
import { CustomersActionsDropdown } from '../Customer/CustomerActionsDropdown'
import { DeleteConfirmModal } from '../global/DeleteConfirmModal'

const statusColors = {
  attente: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  valide: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  rejeter: 'bg-red-500/20 text-red-300 border border-red-500/30',
  revoquer: 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
}

export function DevistTable({ token, onEditDevis, onDeleteDevis }) {
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
    if (isError) toast.error(error?.detail || error?.message || 'Erreur réseau')
  }, [isError])

  // Debug: Afficher les données reçues
  useEffect(() => {
    if (devisList) {
      console.log('DevistTable devisList:', devisList)
    }
  }, [devisList])

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


  const filteredDevis = Array.isArray(devisList) ? devisList
    .filter((devis) => {
      if (!devis || typeof devis !== 'object') return false

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
          `${devis.name_customer || ''} ${devis.first_name_customer || ''}`.toLowerCase()
        if (!name.includes(activeFilters.customer.toLowerCase())) return false
      }

      // 🔹 date
      if (activeFilters.dateRange.start && devis.created_at) {
        try {
          const start = new Date(activeFilters.dateRange.start)
          const createdAt = new Date(devis.created_at)
          if (
            createdAt.getFullYear() !== start.getFullYear() ||
            createdAt.getMonth() !== start.getMonth() ||
            createdAt.getDate() !== start.getDate()
          ) {
            return false
          }
        } catch (error) {
          return false
        }
      }

      if (activeFilters.dateRange.end && devis.printing_time) {
        try {
          const end = new Date(activeFilters.dateRange.end)
          const printingTime = new Date(devis.printing_time)
          if (
            printingTime.getFullYear() !== end.getFullYear() ||
            printingTime.getMonth() !== end.getMonth() ||
            printingTime.getDate() !== end.getDate()
          ) {
            return false
          }
        } catch (error) {
          return false
        }
      }

      return true
    })
    // 🔹 trier par date décroissante (plus récent d'abord)
    .sort((a, b) => {
      try {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      } catch (error) {
        return 0
      }
    })
    // 🔹 limiter à 5 devis
    .slice(0, 5) : []



  if (isPending) {
    return <div className="futuristic-card rounded-2xl p-6 text-slate-400 slide-in-up">Chargement des devis…</div>
  }

  /* ================= RENDER ================= */

  return (
    <div className="futuristic-card rounded-2xl p-4 sm:p-6 slide-in-up">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-bold glow-text">
          Liste des devis
        </h2>

        <div className="relative">
          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-sm backdrop-blur-sm ${hasActiveFilters()
              ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
              : 'border-slate-600/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:border-indigo-500/50'
              }`}
          >
            <div className="relative">
              <Filter className="w-4 h-4" />
              {hasActiveFilters() && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              )}
            </div>
            <span>Filtrer</span>

            {hasActiveFilters() && (
              <span className="ml-1 px-1.5 py-0.5 bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-medium border border-indigo-400/30">
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
            <tr className="border-b border-slate-600/50">
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Produit
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Client
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Impression
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Montant TTC
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Créé le
              </th>
              <th className="py-4 px-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredDevis && filteredDevis.length > 0 ? filteredDevis.map((devis, index) => (
              <tr
                key={devis?.id || index}
                className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <td className="py-4 px-4 text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                  {devis?.name_product || '—'}
                </td>

                <td className="py-4 px-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {devis?.name_customer || ''} {devis?.first_name_customer || ''}
                </td>

                <td className="py-4 px-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {devis?.impression || '—'}
                </td>

                <td className="py-4 px-4 text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {devis?.montant_ttc ? devis.montant_ttc.toLocaleString('fr-FR') : '—'} FCFA
                </td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${statusColors[devis.status] || 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                      }`}
                  >
                    {devis.status}
                  </span>
                </td>

                <td className="py-4 px-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {formatDate(devis.created_at)}
                </td>

                <td className="py-4 px-4">
                  <CustomersActionsDropdown
                    onEdit={() => {
                      if (onEditDevis && typeof onEditDevis === 'function' && devis) {
                        onEditDevis(devis)
                      }
                    }}
                    onDelete={() => {
                      if (devis) {
                        setSelectedDevis(devis)
                      }
                    }}
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <span className="text-slate-500">📄</span>
                    </div>
                    <span>Aucun devis trouvé</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation de suppression */}
      {selectedDevis && (
        <DeleteConfirmModal
          isOpen={!!selectedDevis}
          onClose={() => setSelectedDevis(null)}
          entityName={selectedDevis.name_product || 'ce devis'}
          entityId={selectedDevis.id}
          deleteApi={() => {
            // Simulation de suppression - à remplacer par l'API réelle
            console.log('Suppression du devis:', selectedDevis);
            alert(`Devis "${selectedDevis.name_product}" supprimé avec succès`);
            setSelectedDevis(null);
          }}
          isPending={false}
          isSuccess={false}
          isError={false}
          data={null}
          error={null}
        />
      )}
    </div>
  )
}
