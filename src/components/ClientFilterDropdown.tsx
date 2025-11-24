import { useState, useRef, useEffect } from 'react'
import { Filter, Calendar, Building, X } from 'lucide-react'

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

interface ClientFilterDropdownProps {
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

export function ClientFilterDropdown({ isOpen, onClose, onApplyFilters, currentFilters }: ClientFilterDropdownProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Reset filters when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

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
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 z-50 max-h-[80vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtrer les clients</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Filters Content */}
      <div className="px-4 py-3 space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'active', label: 'Actif', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
              { key: 'inactive', label: 'Inactif', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
              { key: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' }
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key as keyof FilterOptions['status'])}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filters.status[key as keyof FilterOptions['status']]
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : ''
                } ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filters.company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors bg-white text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'inscription
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full pl-6 pr-2 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-xs"
                placeholder="Du"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full pl-6 pr-2 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors text-xs"
                placeholder="Au"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Appliquer
        </button>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mx-4 mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-1">Filtres actifs :</p>
          <div className="flex flex-wrap gap-1">
            {filters.status.active && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">Actif</span>
            )}
            {filters.status.inactive && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">Inactif</span>
            )}
            {filters.status.pending && (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">En attente</span>
            )}
            {filters.company && (
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs max-w-20 truncate" title={filters.company}>
                {filters.company}
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                {filters.dateRange.start && `Du ${filters.dateRange.start}`}
                {filters.dateRange.start && filters.dateRange.end && ' '}
                {filters.dateRange.end && `Au ${filters.dateRange.end}`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



