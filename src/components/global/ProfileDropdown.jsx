import { useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Settings, LogOut, User, Mail, Shield } from 'lucide-react'
import { InitResetInfosAdmin } from '../../api/post/InitResetInfosAdmin'

export function ProfileDropdown({ token, isOpen, onClose, data }) {
  const dropdownRef = useRef(null)
  const { mutate: mutateInitResetInfo, isPending: isPendingInitResetInfo, isError: isErrorInitResetInfo, error: errorInitResetInfo, isSuccess: isSuccessInitResetInfo, data: dataInitResetInfo } = InitResetInfosAdmin(token)


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
    const email = data?.email
    mutateInitResetInfo({ email })
  }

  useEffect(() => {
    if (isSuccessInitResetInfo && dataInitResetInfo?.message) toast.success(dataInitResetInfo.message);
    if (isSuccessInitResetInfo && dataInitResetInfo?.detail) toast.error(dataInitResetInfo.detail);
  }, [isSuccessInitResetInfo]);

  useEffect(() => {
    if (isErrorInitResetInfo) toast.error((errorInitResetInfo) || 'Erreur réseau !');
  }, [isErrorInitResetInfo, errorInitResetInfo]);


  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 futuristic-card rounded-2xl shadow-2xl py-4 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-300 z-50"
    >
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-10 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      {/* Header avec informations principales */}
      <div className="relative z-10 px-4 pb-4 border-b border-slate-600/50">
        <div className="flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Alex Meian"
            className="w-12 h-12 rounded-full border-2 border-indigo-400/50 ring-2 ring-indigo-500/30"
          />
          <div className="flex-1">
            <div className="font-semibold text-white text-base">{data?.name}</div>
            <div className="text-sm text-slate-400">{data?.post}</div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="relative z-10 px-4 py-3 border-b border-slate-600/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{data?.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{data?.role}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ring-2 ring-emerald-500/30"></div>
            <span className="text-emerald-400 font-medium">{data?.status}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 px-2 pt-2">
        <button
          onClick={() => handleAction(handleEditProfile)}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all duration-300 rounded-xl group"
        >
          <div className="p-1 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
            <User className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <span>Modifier le profil</span>
        </button>

        {/* Séparateur */}
        <div className="h-px bg-slate-600/50 my-2 mx-2"></div>

        <button
          onClick={() => handleAction(handleLogout)}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 rounded-xl group"
        >
          <div className="p-1 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
          </div>
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  )
}
