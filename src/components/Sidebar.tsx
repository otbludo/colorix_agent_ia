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
} from 'lucide-react'

export function Sidebar() {
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
    <aside className="w-[280px] bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`w-10 h-10 bg-[${colorixBlue}] rounded-full flex items-center justify-center`}>
          <div className="w-6 h-6 border-4 border-white rounded-full"></div>
        </div>
        <span className="text-xl font-bold">COLORIX</span>
      </div>

      {/* Create New Project Button */}
      <button className={`bg-white text-black rounded-full py-3 px-4 flex items-center gap-2 mb-8 hover:bg-gray-100 transition-colors`}>
        <Plus className={`w-5 h-5 text-[${colorixGreen}]`} />
        <span className="font-medium">Create new project</span>
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={index}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-colors ${
                    item.active
                      ? `bg-white text-[${colorixBlue}]`
                      : 'text-white hover:bg-gray-800'
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
  )
}
