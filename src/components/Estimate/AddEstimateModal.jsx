import { useState, useCallback } from 'react'
import { X, FileText, User, Mail, Phone, DollarSign, Calendar, Building } from 'lucide-react'


export function AddEstimateModal({ isOpen, onClose, onAddQuote }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    amount: '',
    validUntil: ''
  })


  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-2xl mx-4 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Nouveau devis</h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quote Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du devis
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                  errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                placeholder="Ex: Refonte site web entreprise"
              />
            </div>
           
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 bg-white ${
                errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none`}
              placeholder="Décrivez les services proposés..."
            />
          </div>

          {/* Client Information Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Informations client</h4>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.clientName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              {/* Client Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="clientCompany"
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.clientCompany ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                    placeholder="TechCorp Inc."
                  />
                </div>
              </div>

              {/* Client Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.clientEmail ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                    placeholder="client@email.com"
                  />
                </div>
              </div>

              {/* Client Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.clientPhone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                    placeholder="+33 6 XX XX XX XX"
                  />
                  </div>
              </div>
            </div>
          </div>

          {/* Quote Details Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Détails du devis</h4>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant HT (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                    placeholder="5000.00"
                  />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valable jusqu'au
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white ${
                      errors.validUntil ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Créer le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
