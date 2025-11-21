import { useState, useEffect } from 'react'

interface ProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function Profile({ isOpen, onClose }: ProfileProps) { 
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  useEffect(() => {
    setIsProfileOpen(isOpen)
  }, [isOpen])
  useEffect(() => {
    if (!isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      {/* Glassmorphism Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-lg bg-white bg-opacity-10"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">                            
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                  <div className="text-sm text-gray-900 font-medium">alex.meian@colorix.com</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom complet</label>
                  <div className="text-sm text-gray-900 font-medium">Alex Meian</div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">Connecté</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Fermer
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Modifier le profil
                </button>
              </div>
            </div>
         </div>
    )
}
