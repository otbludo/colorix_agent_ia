import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, Menu } from 'lucide-react'
import colorixLogo from '../../assets/Colo.svg'
import { ProfileDropdown } from './ProfileDropdown'
import { GetInfoAdmin } from '../../api/get/GetInfoAdmin'


export function Header({ onToggleSidebar }) {
  const token = localStorage.getItem('colorix_token');
  const { isPending, isError, error, isSuccess, data } = GetInfoAdmin(token)

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }


  // useEffect(() => {
  //   if (isError) toast.error(error?.message || 'Erreur réseau !')
  // }, [isError])

  return (
    <>
      <header className="futuristic-bg px-4 sm:px-6 lg:px-8 py-4 shadow-2xl sticky top-0 z-20 border-b border-slate-700/50 backdrop-blur-xl">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Effet de lumière animé */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
          {/* Brand + Menu */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="lg:hidden w-11 h-11 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center hover:bg-slate-700/70 hover:border-indigo-500/50 transition-all duration-300 group"
              onClick={onToggleSidebar}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-all duration-300" onClick={handleLogoClick}>
              <img
                src={colorixLogo}
                alt="Colorix logo"
                className="w-20 h-25 logo-futuristic"
              />
              <div>
                <span className="text-2xl font-bold glow-text leading-none block">
                  OLORIX
                </span>
                <span className="text-sm text-slate-400 lg:hidden">Dashboard</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-slate-700/50"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <h1 className="hidden lg:block text-2xl font-bold glow-text mr-2">
              Dashboard
            </h1>

            <button className="w-10 h-10 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center hover:bg-slate-700/70 hover:border-indigo-500/50 transition-all duration-300 group">
              <Bell className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>

            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl pl-2 pr-4 py-2 hover:bg-slate-700/70 hover:border-indigo-500/50 transition-all duration-300"
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                  alt="Alex Meian"
                  className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">{data?.name}</div>
                  <div className="text-xs text-slate-400">{data?.first_name}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              <ProfileDropdown
                token={token}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                data={data}
              />
            </div>
          </div>
        </div>

        {/* Bordure lumineuse au hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 blur-sm"></div>
        </div>
      </header>
    </>
  )
}
