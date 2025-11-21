import { Filter } from 'lucide-react'
import { useState } from 'react'
import { AddClientModal } from './AddClientModal'
import { ClientFilterModal } from './ClientFilterModal'
import { ClientActionsDropdown } from './ClientActionsDropdown'
import { EditClientModal } from './EditClientModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'
interface Client {
  name: string
  email: string
  company: string
  status: 'Active' | 'Inactive' | 'Pending'
  joinDate: string
}
const clients: Client[] = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@techcorp.com',
    company: 'TechCorp Inc.',
    status: 'Active',
    joinDate: 'Jan 15, 2024',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@innovate.com',
    company: 'Innovate Solutions',
    status: 'Active',
    joinDate: 'Feb 20, 2024',
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael.r@startup.io',
    company: 'Startup Inc.',
    status: 'Pending',
    joinDate: 'Mar 10, 2024',
  },
  {
    name: 'Emma Davis',
    email: 'emma.davis@enterprise.com',
    company: 'Enterprise Corp',
    status: 'Inactive',
    joinDate: 'Dec 5, 2023',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@consulting.com',
    company: 'Wilson Consulting',
    status: 'Active',
    joinDate: 'Jan 28, 2024',
  },
]
const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-700',
  Pending: 'bg-yellow-100 text-yellow-700',
}
interface FilterOptions {
  status: {
    active: boolean
    inactive: boolean
    pending: boolean
  }
  company: string
  dateRange: {
    start: string
    end: string
  }
}

export function ProjectTable() {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: {
      active: false,
      inactive: false,
      pending: false
    },
    company: '',
    dateRange: {
      start: '',
      end: ''
    }
  })

  const handleAddClient = (clientData: { name: string; email: string; company: string }) => {
    // Simulation de l'ajout du client
    console.log('Nouveau client ajouté:', clientData)
    alert(`Client ajouté avec succès!\n\nNom: ${clientData.name}\nEmail: ${clientData.email}\nEntreprise: ${clientData.company}`)

    // Ici, on pourrait faire un appel API avec React Query
    // mutation.mutate(clientData)
  }

  const handleEditClient = (clientId: string, clientData: Omit<Client, 'joinDate'>) => {
    // Simulation de la modification du client
    console.log('Client modifié:', clientId, clientData)
    alert(`Client modifié avec succès!\n\nNom: ${clientData.name}\nEmail: ${clientData.email}\nEntreprise: ${clientData.company}`)

    // Ici, on pourrait faire un appel API avec React Query
    // updateMutation.mutate({ id: clientId, ...clientData })
  }

  const handleDeleteClient = (clientId: string) => {
    // Simulation de la suppression du client
    console.log('Client supprimé:', clientId)
    alert('Client supprimé avec succès!')

    // Ici, on pourrait faire un appel API avec React Query
    // deleteMutation.mutate(clientId)
  }

  const openEditModal = (client: Client, clientId: string) => {
    setSelectedClient(client)
    setSelectedClientId(clientId)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (client: Client, clientId: string) => {
    setSelectedClient(client)
    setSelectedClientId(clientId)
    setIsDeleteModalOpen(true)
  }

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters)
    console.log('Filtres appliqués:', filters)
  }

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = () => {
    return (
      activeFilters.status.active ||
      activeFilters.status.inactive ||
      activeFilters.status.pending ||
      activeFilters.company ||
      activeFilters.dateRange.start ||
      activeFilters.dateRange.end
    )
  }

  // Filtrer les clients selon les critères actifs
  const filteredClients = clients.filter(client => {
    // Filtre par statut
    if (activeFilters.status.active || activeFilters.status.inactive || activeFilters.status.pending) {
      const statusMatch =
        (activeFilters.status.active && client.status === 'Active') ||
        (activeFilters.status.inactive && client.status === 'Inactive') ||
        (activeFilters.status.pending && client.status === 'Pending')

      if (!statusMatch) return false
    }

    // Filtre par entreprise
    if (activeFilters.company && client.company !== activeFilters.company) {
      return false
    }

    // Filtre par date
    if (activeFilters.dateRange.start || activeFilters.dateRange.end) {
      const clientDate = new Date(client.joinDate)
      const startDate = activeFilters.dateRange.start ? new Date(activeFilters.dateRange.start) : null
      const endDate = activeFilters.dateRange.end ? new Date(activeFilters.dateRange.end) : null

      if (startDate && clientDate < startDate) return false
      if (endDate && clientDate > endDate) return false
    }

    return true
  })

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Liste des clients</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsAddClientModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>Ajouter un client</span>
          </button>
        
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${
              hasActiveFilters()
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="relative">
              <Filter className="w-4 h-4" />
              {hasActiveFilters() && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
            <span>Filtrer</span>
            {hasActiveFilters() && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {filteredClients.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Nom
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Entreprise
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Statut
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Date d'inscription
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4 text-sm text-[#1A1A1A]">
                {client.name}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {client.email}
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {client.company}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}
                >
                  {client.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">
                {client.joinDate}
              </td>
              <td className="py-4 px-4">
                <ClientActionsDropdown
                  onEdit={() => openEditModal(client, `client-${index}`)}
                  onDelete={() => openDeleteModal(client, `client-${index}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAddClient={handleAddClient}
      />

      {/* Filter Modal */}
      <ClientFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditClient={handleEditClient}
        client={selectedClient}
        clientId={selectedClientId}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteClient(selectedClientId)}
        clientName={selectedClient?.name || ''}
      />
    </div>
  )
}
