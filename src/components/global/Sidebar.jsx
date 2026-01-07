import { useNavigate, useLocation } from 'react-router-dom'
import colorixLogo from '../../assets/colorixorigin.png'
import { LayoutDashboard, FileText, Clock, Users2, Building, Settings, Plus, X, ShoppingBag } from 'lucide-react'


export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: FileText,
      label: 'Devis',
      path: '/Estimates',
    },
    {
      icon: ShoppingBag,
      label: 'Produits',
      path: '/products',
    },
    {
      icon: Building,
      label: 'Clients',
      path: '/customer',
    },
    {
      icon: Users2,
      label: 'Administrateurs',
      path: '/Admins',
    },
    {
      icon: Clock,
      label: 'Time log',
      path: '/time-log',
    },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-72 text-white flex flex-col p-6 transition-all duration-500 overflow-hidden border-r border-slate-700/50 backdrop-blur-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:w-[280px] lg:translate-x-0`}
      >
        {/* Fond futuriste avec effets améliorés */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          {/* Effet de grille animé */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid-pattern w-full h-full animate-pulse"></div>
          </div>

          {/* Particules flottantes */}
          <div className="absolute inset-0">
            <div className="particle w-2 h-2 top-20 left-10"></div>
            <div className="particle w-1 h-1 top-40 right-16"></div>
            <div className="particle w-3 h-3 bottom-32 left-20"></div>
            <div className="particle w-1.5 h-1.5 top-60 right-8"></div>
          </div>

          <svg className="w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="sidebar-pattern"
                x="0"
                y="0"
                width="140"
                height="140"
                patternUnits="userSpaceOnUse"
              >
                <g stroke="#6366f1" strokeWidth="1.5" fill="none">
                  {/* Printer */}
                  <g transform="translate(15, 15)">
                    <rect x="0" y="0" width="30" height="12" rx="3" />
                    <rect x="-3" y="10" width="36" height="16" rx="3" />
                    <line x1="4" y1="5" x2="26" y2="5" />
                  </g>
                  {/* Flyer */}
                  <g transform="translate(80, 15)">
                    <rect x="0" y="0" width="26" height="32" rx="3" />
                    <line x1="4" y1="8" x2="22" y2="8" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="4" y1="22" x2="18" y2="22" />
                  </g>
                  {/* Chat bubble */}
                  <g transform="translate(15, 80)">
                    <rect x="0" y="0" width="32" height="20" rx="6" />
                    <path d="M14 20 L12 26 L18 20" />
                    <circle cx="7" cy="9" r="1.2" />
                    <circle cx="16" cy="9" r="1.2" />
                    <circle cx="25" cy="9" r="1.2" />
                  </g>
                  {/* Megaphone */}
                  <g transform="translate(85, 85)">
                    <path d="M0 8 L20 0 L20 24 L0 16 Z" />
                    <line x1="0" y1="16" x2="-4" y2="26" />
                    <line x1="24" y1="4" x2="30" y2="0" />
                    <line x1="24" y1="20" x2="30" y2="24" />
                  </g>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sidebar-pattern)" />
          </svg>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300 group" onClick={() => navigate('/dashboard')}>
              <div className="relative">
                <img
                  src={colorixLogo}
                  alt="Colorix logo"
                  className="w-40 h-36 drop-shadow-2xl logo-futuristic"
                  style={{ filter: 'drop-shadow(0 8px 16px rgba(99,102,241,0.4))' }}
                />
                {/* Cercle lumineux autour du logo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-700/70 hover:border-indigo-500/50 transition-all duration-300 group"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>
          </div>

          {/* Create New Quote Button */}
          <button
            onClick={() => navigate('/estimates')}
            className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl py-3 px-4 flex items-center gap-2 mb-8 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-400/50 hover:scale-105 border border-emerald-400/30 group overflow-hidden"
          >
            {/* Effet de shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Plus className="w-5 h-5 relative z-10" />
            <span className="font-medium relative z-10">Créer un devis</span>
          </button>
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        navigate(item.path)
                        if (onClose) onClose() // Close mobile menu after navigation
                      }}
                      className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden ${isActive
                          ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-2xl shadow-indigo-500/30 border border-indigo-400/50'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm border border-transparent hover:border-slate-600/50'
                        }`}
                    >
                      {/* Effet de fond animé */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`}></div>

                      {/* Icône avec effet lumineux */}
                      <div className={`relative z-10 p-1 rounded-lg transition-all duration-300 ${isActive
                          ? 'bg-white/20'
                          : 'group-hover:bg-indigo-500/20'
                        }`}>
                        <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-indigo-400'
                          }`} />
                      </div>

                      <span className={`font-medium relative z-10 transition-colors duration-300 ${isActive
                          ? 'text-white'
                          : 'text-slate-300 group-hover:text-white'
                        }`}>
                        {item.label}
                      </span>

                      {/* Indicateur actif */}
                      {isActive && (
                        <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}

                      {/* Bordure lumineuse au hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 blur-sm"></div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
