// src/components/Header.tsx
import React from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

export function Header() {
  // Define Colorix brand colors (PLACEHOLDER - REPLACE WITH ACTUAL VALUES)
  const colorixBlue = '#1e3a8a'

  return (
    <header className="bg-white px-8 py-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-[${colorixBlue}] rounded-full flex items-center justify-center`}>
            <div className="w-6 h-6 border-4 border-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-800">COLORIX</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-[400px] pl-12 pr-4 py-3 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 bg-gray-100 rounded-full pl-2 pr-4 py-2 hover:bg-gray-200 transition-colors">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Alex meian"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-800">Alex meian</div>
            <div className="text-xs text-gray-500">Product manager</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </header>
  )
}
