import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'



export const OverviewCard = (({ icon, title, value, subtitle, iconBgColor }) => {
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
    </div>
  )
})


export function OverviewCardBlue({ Icon, title, value }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center">
        <Icon className="w-8 h-8 text-blue-600" />
        <div className="ml-3">
          <p className="text-sm font-medium text-blue-600">{title}</p>
          <p className="text-2xl font-bold text-blue-900">{value}</p>
        </div>
      </div>
    </div>
  )
}


export function OverviewCardGreen({ Icon, title, value }) {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex items-center">
        <Icon className="w-8 h-8 text-green-600" />
        <div className="ml-3">
          <p className="text-sm font-medium text-green-600">{title}</p>
          <p className="text-2xl font-bold text-green-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}


export function OverviewCardYellow({ Icon, title, value }) {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <div className="flex items-center">
        <Icon className="w-8 h-8 text-yellow-600" />
        <div className="ml-3">
          <p className="text-sm font-medium text-yellow-600">{title}</p>
          <p className="text-2xl font-bold text-yellow-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}


export function OverviewCardRed({ Icon, title, value }) {
  return (
    <div className="bg-red-50 p-4 rounded-lg">
      <div className="flex items-center">
        <Icon className="w-8 h-8 text-red-600" />
        <div className="ml-3">
          <p className="text-sm font-medium text-red-600">{title}</p>
          <p className="text-2xl font-bold text-red-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
} 