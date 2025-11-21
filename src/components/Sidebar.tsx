// src/components/Sidebar.tsx
import React from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Clock,
  Users,
  FileText,
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

  // Define Colorix brand colors (PLACEHOLDER - REPLACE WITH ACTUAL VALUES)
  const colorixBlue = '#1e3a8a'
  const colorixGreen = '#15803d'
  const colorixGold = '#ca8a04'

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-[#0f172a] text-white flex flex-col p-6 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:w-[280px] lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colorixBlue }}
            >
              <div className="w-6 h-6 border-4 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold">COLORIX</span>
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
        <button className="bg-white text-black rounded-full py-3 px-4 flex items-center gap-2 mb-8 hover:bg-gray-100 transition-colors">
          <Plus
            className="w-5 h-5"
            style={{
              color: colorixGreen,
            }}
          />
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
                        ? 'bg-white text-[#0f172a]'
                        : 'text-white hover:bg-white/10'
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
      </aside>
    </>
  )
}
