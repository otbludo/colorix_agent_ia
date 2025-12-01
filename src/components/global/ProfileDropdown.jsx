import { useRef, useEffect } from 'react'
import { Settings, LogOut, User, Mail, Shield } from 'lucide-react'


export function ProfileDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null)

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

  // Fermer le dropdown après une action
  const handleAction = (action) => {
    onClose()
    action()
  }

  const handleLogout = () => {
    // Simulation de déconnexion
    console.log('Déconnexion de l\'utilisateur...')
    alert('Déconnexion simulée - Au revoir !')
    // Ici on pourrait rediriger vers la page de login
  }

  const handleEditProfile = () => {
    // Simulation d'édition du profil
    console.log('Ouverture de l\'édition du profil...')
    alert('Ouverture simulée de la page d\'édition du profil')
  }

  const handleSettings = () => {
    // Simulation des paramètres
    console.log('Ouverture des paramètres...')
    alert('Ouverture simulée de la page des paramètres')
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 z-50"
    >
      {/* Header avec informations principales */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Alex Meian"
            className="w-12 h-12 rounded-full border-2 border-blue-100"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-base">Alex Meian</div>
            <div className="text-sm text-gray-500">Product Manager</div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">alex.meian@colorix.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Administrateur</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Connecté</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 pt-2">
        <button
          onClick={() => handleAction(handleEditProfile)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg group"
        >
          <User className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span>Modifier le profil</span>
        </button>

        <button
          onClick={() => handleAction(handleSettings)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 rounded-lg group"
        >
          <Settings className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          <span>Paramètres</span>
        </button>

        {/* Séparateur */}
        <div className="h-px bg-gray-200 my-2 mx-2"></div>

        <button
          onClick={() => handleAction(handleLogout)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-lg group"
        >
          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  )
}
