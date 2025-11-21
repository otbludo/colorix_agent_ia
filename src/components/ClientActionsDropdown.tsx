import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'

interface ClientActionsDropdownProps {
  onEdit: () => void
  onDelete: () => void
}

export function ClientActionsDropdown({ onEdit, onDelete }: ClientActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  // Fermer le dropdown après une action
  const handleAction = (action: () => void) => {
    setIsOpen(false)
    action()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Option Modifier */}
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 group"
          >
            <Edit className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <span>Modifier</span>
          </button>

          {/* Séparateur */}
          <div className="h-px bg-gray-200 my-1"></div>

          {/* Option Supprimer */}
          <button
            onClick={() => handleAction(onDelete)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 group"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  )
}
