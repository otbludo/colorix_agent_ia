import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'

export function CustomerCategoryActionsDropdown({ category, onEdit, onDelete }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleAction = (action) => {
        setIsOpen(false)
        action()
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
                aria-label="Actions"
            >
                <MoreVertical className="w-3 h-3 text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-1 w-40 futuristic-card rounded-2xl shadow-2xl py-2 animate-in fade-in-0 zoom-in-95 duration-300">
                    {/* Effet de grille en arrière-plan */}
                    <div className="absolute inset-0 opacity-10 rounded-2xl">
                        <div className="grid-pattern w-full h-full"></div>
                    </div>

                    <button
                        onClick={() => handleAction(() => onEdit(category))}
                        className="relative z-10 w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-300 group rounded-xl mx-1"
                    >
                        <div className="p-1 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                            <Edit className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                        </div>
                        <span>Modifier</span>
                    </button>

                    <div className="h-px bg-slate-600/50 my-1 mx-2"></div>

                    <button
                        onClick={() => handleAction(() => onDelete(category))}
                        className="relative z-10 w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group rounded-xl mx-1"
                    >
                        <div className="p-1 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                            <Trash2 className="w-3 h-3 text-red-400 group-hover:text-red-300 transition-colors" />
                        </div>
                        <span>Supprimer</span>
                    </button>
                </div>
            )}
        </div>
    )
}
