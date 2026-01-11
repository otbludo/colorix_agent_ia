import { useState, useRef, useEffect } from 'react'
import { Filter, Calendar, Building, X } from 'lucide-react'





const companies = [
  'TechCorp Inc.',
  'Innovate Solutions',
  'Startup Inc.',
  'Enterprise Corp',
  'Wilson Consulting'
]

export function DevisFilter({ isOpen, onClose, onApplyFilters, currentFilters }) {
  const [filters, setFilters] = useState(currentFilters)
  const dropdownRef = useRef(null)

  // Reset filters when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters)
    }
  }, [isOpen, currentFilters])

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status: {
        valide: false,
        attente: false,
        supprime: false,
        [status]: !prev.status[status]
      }
    }))
  }

  const handleCompanyChange = (value) => {
    setFilters(prev => ({
      ...prev,
      // set multiple keys to support different parent shapes (client / customer / name)
      client: value,
      customer: value,
      name: value
    }))
  }


  const handleDateChange = (field, value) => {
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
    const resetFilters = {
      status: {
        valide: false,
        attente: false
      },
      client: '',
      customer: '',
      name: '',
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
      filters.status.valide ||
      filters.status.attente ||
      filters.status.supprime ||
      filters.client ||
      filters.name ||
      filters.customer ||
      filters.dateRange.start ||
      filters.dateRange.end
    )
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 futuristic-card rounded-2xl shadow-2xl py-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-300 z-50 max-h-[80vh] overflow-y-auto"
    >
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pb-3 border-b border-slate-600/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Filtrer les devis</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 group"
        >
          <X className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
        </button>
      </div>

      {/* Filters Content */}
      <div className="relative z-10 px-4 py-3 space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Statut
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'valide', label: 'Valide', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', activeColor: 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50' },
              { key: 'attente', label: 'Attente', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30', activeColor: 'bg-amber-500/30 text-amber-200 border-amber-400/50' },
              { key: 'supprime', label: 'Supprimé', color: 'bg-red-500/20 text-red-300 border border-red-500/30', activeColor: 'bg-red-500/30 text-red-200 border-red-400/50' }
            ].map(({ key, label, color, activeColor }) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105 ${filters.status[key]
                  ? `ring-2 ring-indigo-400/50 ${activeColor}`
                  : `${color}`
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Filter */}
        {/* Client Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nom
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <input
              type="text"
              value={filters.client || filters.name || filters.customer || ''}
              onChange={(e) => handleCompanyChange(e.target.value)}
              placeholder="Saisir le nom du devis / client"
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-white placeholder-slate-400 text-sm"
            />
          </div>
        </div>


        {/* Date Range Filter */}
        <div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date d'Impression
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-white text-sm"
                  placeholder="Au"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date de création
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-white text-sm"
                  placeholder="Du"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex gap-2 px-4 pt-3 border-t border-slate-600/50">
        <button
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()}
          className="flex-1 px-3 py-2 bg-slate-800/50 text-slate-300 rounded-2xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium backdrop-blur-sm"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 border border-indigo-400/30 text-sm font-medium"
        >
          Appliquer
        </button>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="relative z-10 mx-4 mt-3 p-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/50">
          <p className="text-xs text-slate-300 font-medium mb-2">Filtres actifs :</p>
          <div className="flex flex-wrap gap-2">
            {filters.status.valide && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs backdrop-blur-sm">Valide</span>
            )}
            {filters.status.attente && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs backdrop-blur-sm">Attente</span>
            )}
            {filters.status.supprime && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-xs backdrop-blur-sm">Supprimé</span>
            )}
            {filters.name && (
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs max-w-20 truncate backdrop-blur-sm" title={filters.name}>
                {filters.name}
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs backdrop-blur-sm">
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



