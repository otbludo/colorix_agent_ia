import React, { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { ButtonForm } from '../global/Button'
import { InputField } from '../global/Input'

export function AddCategoryWidget({ isOpen, onClose, onAddCategory, editingCategory = null }) {
    const [formData, setFormData] = useState({ name: '', rate: '' })
    const formRef = useRef(null)

    // Fermer le formulaire quand on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    // Reset form when opening or when editing category changes
    useEffect(() => {
        if (isOpen) {
            if (editingCategory) {
                setFormData({ name: editingCategory.name, rate: editingCategory.rate.toString() })
            } else {
                setFormData({ name: '', rate: '' })
            }
        }
    }, [isOpen, editingCategory])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.name.trim() && formData.rate) {
            onAddCategory({
                name: formData.name.trim(),
                rate: parseInt(formData.rate)
            })
            setFormData({ name: '', rate: '' })
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={formRef}
            className="absolute right-0 top-full mt-2 w-80 futuristic-card rounded-2xl shadow-2xl p-4 animate-in fade-in-0 zoom-in-95 duration-300 z-50"
        >
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-10 rounded-2xl">
                <div className="grid-pattern w-full h-full"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold glow-text">
                        {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-700/50 transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="futuristic-card p-4 rounded-2xl">
                        <InputField
                            label="Nom de la catégorie"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: Entreprise, ONG, Particulier..."
                            required
                        />
                    </div>

                    <div className="futuristic-card p-4 rounded-2xl">
                        <InputField
                            label="Pourcentage (%)"
                            type="number"
                            value={formData.rate}
                            onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                            placeholder="Ex: 25"
                            min="0"
                            max="100"
                            required
                        />
                    </div>

                    <ButtonForm type="submit" variant="primary" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        {editingCategory ? 'Modifier la catégorie' : 'Ajouter la catégorie'}
                    </ButtonForm>
                </form>
            </div>
        </div>
    )
}
