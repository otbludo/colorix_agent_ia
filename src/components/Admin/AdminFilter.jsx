import { useState, useEffect, useRef } from 'react';
import { Filter, X, Calendar } from 'lucide-react';

export function AdminFilter({ isOpen, onClose, onApplyFilters, currentFilters }) {
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    if (isOpen) setFilters(currentFilters);
  }, [isOpen, currentFilters]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) onClose();
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const toggleStatus = (key) => {
    setFilters(prev => ({ ...prev, status: { actif: false, inactif: false, supprime: false, [key]: !prev.status[key] } }));
  };

  const handleDateChange = (field, value) => {
    setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, [field]: value } }));
  };

  const resetFilters = () => {
    const reset = { status: { actif: false, inactif: false, supprime: false }, dateRange: { start: '', end: '' } };
    setFilters(reset);
    onApplyFilters(reset);
  };

  const applyFilters = () => { onApplyFilters(filters); onClose(); };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 futuristic-card rounded-2xl shadow-2xl py-4 z-50 max-h-[80vh] overflow-y-auto">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-4 pb-3 border-b border-slate-600/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Filtrer les administrateurs</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 group">
          <X className="w-4 h-4 text-slate-400 group-hover:text-slate-300" />
        </button>
      </div>

      <div className="relative z-10 px-4 py-3 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Statut</label>
          <div className="flex flex-wrap gap-2">
            {['actif', 'inactif', 'supprime'].map(s => (
              <button key={s} onClick={() => toggleStatus(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105 ${filters.status[s]
                  ? 'ring-2 ring-indigo-400/50'
                  : ''
                  } ${s === 'actif'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : s === 'inactif'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
              >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-2 px-4 pt-3 border-t border-slate-600/50">
        <button onClick={resetFilters} className="flex-1 px-3 py-2 bg-slate-800/50 text-slate-300 rounded-2xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 text-sm font-medium backdrop-blur-sm">Réinitialiser</button>
        <button onClick={applyFilters} className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 border border-indigo-400/30 text-sm font-medium">Appliquer</button>
      </div>
    </div>
  );
}
