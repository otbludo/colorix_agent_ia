import { useState, useEffect, useRef } from 'react';
import { Filter, X, Calendar } from 'lucide-react';

export function CustomerFilter({ isOpen, onClose, onApplyFilters, currentFilters }) {
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
        <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2"><Filter className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold text-gray-900">Filtrer les Customer</h3></div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
            </div>

            <div className="px-4 py-3 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <div className="flex flex-wrap gap-2">
                        {['supprime'].map(s => (
                            <button key={s} onClick={() => toggleStatus(s)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filters.status[s] ? 'ring-2 ring-blue-500 ring-offset-1' : ''} bg-red-100 text-red-700 hover:bg-red-200`}
                            >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 px-4 pt-3 border-t border-gray-100">
                <button onClick={resetFilters} className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Réinitialiser</button>
                <button onClick={applyFilters} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Appliquer</button>
            </div>
        </div>
    );
}
