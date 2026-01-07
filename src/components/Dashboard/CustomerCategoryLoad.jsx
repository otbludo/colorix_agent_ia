import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { GetCustomerCategory } from '../../api/get/GetCustomerCategory'
import { AddCategoryWidget } from './AddCategoryWidget'
import { CustomerCategoryActionsDropdown } from './CustomerCategoryActionsDropdown'

export function CustomerCategoryLoad({ token, onDeleteCategory }) {
  const { data } = GetCustomerCategory(token, null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const handleAddCategory = (newCategory) => {
    // Simulation d'ajout - en production, cela ferait un appel API
    console.log('Nouvelle catégorie:', newCategory)
    alert(`${editingCategory ? 'Catégorie modifiée' : 'Nouvelle catégorie ajoutée'}: ${newCategory.name} (${newCategory.rate}%)`)

    // Ici on pourrait mettre à jour les données ou faire un refresh
    // Pour l'instant, c'est juste une simulation
    setEditingCategory(null)
  }

  const handleDeleteCategory = (category) => {
    if (onDeleteCategory) {
      onDeleteCategory(category)
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }


  // Couleurs futuristes pour les catégories
  const colors = [
    'bg-gradient-to-br from-red-500 to-rose-500',
    'bg-gradient-to-br from-emerald-500 to-green-500',
    'bg-gradient-to-br from-amber-500 to-yellow-500',
    'bg-gradient-to-br from-blue-500 to-indigo-500'
  ]

  return (
    <div className="futuristic-card rounded-2xl p-4 sm:p-6 slide-in-up">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-3 items-center justify-between mb-6">
        <h2 className="text-xl font-bold glow-text">Pourcentage Catégorie</h2>
        <div className="relative">
          <button
            onClick={() => {
              setEditingCategory(null)
              setIsFormOpen(!isFormOpen)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-600/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group"
          >
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-transform duration-300 ${isFormOpen ? 'rotate-180' : ''}`} />
          </button>

          <AddCategoryWidget
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false)
              setEditingCategory(null)
            }}
            onAddCategory={handleAddCategory}
            editingCategory={editingCategory}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 py-4 sm:py-8">
        {data?.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center group relative">
            {/* Menu d'actions */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <CustomerCategoryActionsDropdown
                category={item}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
              />
            </div>

            {/* Cercle avec effet futuriste */}
            <div className="relative mb-4">
              <div
                className={`w-20 h-20 ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 shadow-2xl group-hover:scale-110 transition-all duration-500 ring-4 ring-slate-600/30`}
              >
                {item.rate}%
              </div>
              {/* Cercle lumineux autour */}
              <div className={`absolute inset-0 rounded-full ${colors[index % colors.length]} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
            </div>

            <div className="text-sm text-slate-300 mb-3 group-hover:text-white transition-colors font-medium">{item.name}</div>

            {/* Barre verticale futuriste */}
            <div className="relative">
              <div className="w-1 h-16 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full shadow-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-lg animate-pulse"></div>
            </div>

            {/* Indicateur en bas futuriste */}
            <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full mt-3 ring-2 ring-slate-500/50 shadow-lg group-hover:ring-indigo-400/50 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
