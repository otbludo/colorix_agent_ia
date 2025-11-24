import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, Menu } from 'lucide-react'
import colorixLogo from '../assets/Colo.svg'
import { ProfileDropdown } from './ProfileDropdown'
interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }


  return (
    <>
    <header className="bg-white px-4 sm:px-6 lg:px-8 py-4 shadow-md sticky top-0 z-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        {/* Brand + Menu */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"
            onClick={onToggleSidebar}
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
            <img
              src={colorixLogo}
              alt="Colorix logo"
              className="w-20 h-25"
            />
            <div>
              <span className="text-2xl font-bold text-gray-800 leading-none block">
                COLORIX
              </span>
              <span className="text-sm text-gray-500 lg:hidden">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <h1 className="hidden lg:block text-2xl font-bold text-gray-800 mr-2">
            Dashboard
          </h1>

          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 bg-gray-100 rounded-full pl-2 pr-4 py-2 hover:bg-gray-200 transition-colors"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Alex Meian"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-800">Alex Meian</div>
                <div className="text-xs text-gray-500">Product Manager</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
