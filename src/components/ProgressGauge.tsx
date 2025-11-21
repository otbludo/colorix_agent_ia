// src/components/ProgressGauge.tsx
import React from 'react'
import { ChevronDown } from 'lucide-react'

export function ProgressGauge() {
  const percentage = 72
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Define Colorix brand colors (PLACEHOLDER - REPLACE WITH ACTUAL VALUES)
  const colorixBlue = '#1e3a8a'
  const colorixGreen = '#15803d'
  const colorixGold = '#ca8a04'

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Overall Progress</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <span className="text-sm text-gray-700">All</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Circular Gauge */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            {/* Progress arc - gradient from green to yellow to red */}
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={colorixGreen} />
                <stop offset="50%" stopColor={colorixGold} />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-gray-800">
              {percentage}%
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>

          {/* Scale markers */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">
            0
          </div>
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">
            100
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 w-full">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">95</div>
            <div className="text-xs text-gray-500 mt-1">Total projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">26</div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">35</div>
            <div className="text-xs text-gray-500 mt-1">Delayed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">35</div>
            <div className="text-xs text-gray-500 mt-1">On going</div>
          </div>
        </div>
      </div>
    </div>
  )
}
