import React from 'react'
import { ChevronDown } from 'lucide-react'
import { GetCustomerCategory } from '../../api/get/GetCustomerCategory'

export function CustomerCategoryLoad({ token }) {
  const { data } = GetCustomerCategory(token, null)


  // Couleurs à associer aux catégories (tu peux les ajuster)
  const colors = ['bg-[#FF6B6B]', 'bg-[#4ade80]', 'bg-[#facc15]', 'bg-[#3b82f6]']

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Pourcentage Categorie</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 py-4 sm:py-8">
        {data?.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold text-lg mb-2`}
            >
              {item.rate}%
            </div>
            <div className="text-sm text-gray-700 mb-1">{item.name}</div>
            <div className="w-1 h-12 bg-gray-300"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
