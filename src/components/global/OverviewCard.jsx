import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'



export const OverviewCard = (({
  icon,
  title,
  value,
  subtitle,
  // trend,
  // trendValue,
  iconBgColor,
}) => {
  // Define Colorix brand colors (PLACEHOLDER - REPLACE WITH ACTUAL VALUES)
  const colorixGreen = '#15803d'
  const colorixRed = '#b91c1c'

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center mb-4 shadow-lg`}
      >
        {icon}
      </div>
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {value}
        <span className="text-lg text-gray-400 ml-1">{subtitle}</span>
      </div>
      {/* <div
        className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4" style={{ color: colorixGreen }} />
        ) : (
          <TrendingDown className="w-4 h-4" style={{ color: colorixRed }} />
        )}
        <span>{trendValue}</span>
      </div> */}
    </div>
  )
})
