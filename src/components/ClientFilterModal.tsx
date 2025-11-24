import { useState, useEffect } from 'react'
import { X, Filter, Calendar, Building } from 'lucide-react'

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

interface ClientFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

const companies = [
  'TechCorp Inc.',
  'Innovate Solutions',
  'Startup Inc.',
  'Enterprise Corp',
  'Wilson Consulting'
]

export function ClientFilterModal({ isOpen, onClose, onApplyFilters, currentFilters }: ClientFilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  // Reset filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  const handleStatusChange = (status: keyof FilterOptions['status']) => {
    setFilters(prev => ({
      ...prev,
      status: {
        ...prev.status,
        [status]: !prev.status[status]
      }
    }))
  }

  const handleCompanyChange = (company: string) => {
    setFilters(prev => ({
      ...prev,
      company: company === prev.company ? '' : company
    }))
  }

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
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
    }
    setFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  const hasActiveFilters = () => {
    return (
      filters.status.active ||
      filters.status.inactive ||
      filters.status.pending ||
      filters.company ||
      filters.dateRange.start ||
      filters.dateRange.end
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Filtrer les clients</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Statut
            </label>
            <div className="space-y-2">
              {[
                { key: 'active', label: 'Actif', color: 'bg-green-100 text-green-700' },
                { key: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-700' },
                { key: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700' }
              ].map(({ key, label, color }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status[key as keyof FilterOptions['status']]}
                    onChange={() => handleStatusChange(key as keyof FilterOptions['status'])}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Company Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Entreprise
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filters.company}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors bg-white"
              >
                <option value="">Toutes les entreprises</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date d'inscription
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-sm"
                  placeholder="Du"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-sm"
                  placeholder="Au"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleResetFilters}
            disabled={!hasActiveFilters()}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Réinitialiser
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Appliquer
          </button>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Filtres actifs :</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.status.active && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Actif</span>
              )}
              {filters.status.inactive && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Inactif</span>
              )}
              {filters.status.pending && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">En attente</span>
              )}
              {filters.company && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{filters.company}</span>
              )}
              {(filters.dateRange.start || filters.dateRange.end) && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {filters.dateRange.start && `Du ${filters.dateRange.start}`}
                  {filters.dateRange.start && filters.dateRange.end && ' '}
                  {filters.dateRange.end && `Au ${filters.dateRange.end}`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



