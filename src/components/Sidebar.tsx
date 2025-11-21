// src/components/Sidebar.tsx
import colorixLogo from '../assets/colorixorigin.png'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Clock,
  Users,
  Layers,
  Settings,
  Plus,
  X,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      active: true,
    },
    {
      icon: FolderKanban,
      label: 'Projects',
      active: false,
    },
    {
      icon: ListTodo,
      label: 'Tasks',
      active: false,
    },
    {
      icon: Clock,
      label: 'Time log',
      active: false,
    },
    {
      icon: Users,
      label: 'Resource mgmt',
      active: false,
    },
    {
      icon: Users,
      label: 'Users',
      active: false,
    },
    {
      icon: Layers,
      label: 'Project template',
      active: false,
    },
    {
      icon: Settings,
      label: 'Menu settings',
      active: false,
    },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-72 text-white flex flex-col p-6 transition-transform duration-300 overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:w-[280px] lg:translate-x-0`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#021837] via-[#031f45] to-[#042a5a]">
          <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="sidebar-pattern"
                x="0"
                y="0"
                width="140"
                height="140"
                patternUnits="userSpaceOnUse"
              >
                <g stroke="#0c3c73" strokeWidth="1.5" fill="none">
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
            <div className="flex items-center gap-3">
              <img
                src={colorixLogo}
                alt="Colorix logo"
                className="w-40 h-36 drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 6px 12px rgba(5,25,62,0.45))' }}
              />
            </div>

            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Create New Project Button */}
          <button className="bg-[#34c759] text-[#031828] rounded-full py-3 px-4 flex items-center gap-2 mb-8 hover:bg-[#2ab34f] transition-colors shadow-lg shadow-[#34c759]/30">
            <Plus className="w-5 h-5 text-[#031828]" />
            <span className="font-medium">Create new project</span>
          </button>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={index}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
                        item.active
                          ? 'bg-white text-[#032041]'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
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
