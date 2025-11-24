import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { AddQuoteModal } from '../components/AddQuoteModal'
import { FileText, Plus, Eye, Edit, Download, DollarSign, Calendar, User, Phone } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import type { Quote } from '../types'

export function Quotes() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false)

  // Mock data
  const initialQuotes: Quote[] = [
    {
      id: '1',
      title: 'Refonte site web entreprise',
      client: 'TechCorp Inc.',
      clientEmail: 'contact@techcorp.com',
      clientPhone: '+33 1 23 45 67 89',
      amount: 8500,
      status: 'sent',
      createdAt: '2024-11-20',
      validUntil: '2024-12-20',
      description: 'Refonte complète du site web avec nouvelle charte graphique'
    },
    {
      id: '2',
      title: 'Application mobile e-commerce',
      client: 'ShopOnline',
      clientEmail: 'manager@shoponline.fr',
      clientPhone: '+33 1 98 76 54 32',
      amount: 12500,
      status: 'approved',
      createdAt: '2024-11-15',
      validUntil: '2024-12-15',
      description: 'Développement d\'une application mobile pour boutique en ligne'
    },
    {
      id: '3',
      title: 'Audit sécurité système',
      client: 'SecureData Corp',
      clientEmail: 'security@securedata.com',
      clientPhone: '+33 1 11 22 33 44',
      amount: 3200,
      status: 'draft',
      createdAt: '2024-11-25',
      validUntil: '2024-12-25',
      description: 'Audit complet de sécurité et recommandations'
    },
    {
      id: '4',
      title: 'Maintenance annuelle',
      client: 'GlobalTech Solutions',
      clientEmail: 'it@globaltech.com',
      clientPhone: '+33 1 55 66 77 88',
      amount: 4800,
      status: 'expired',
      createdAt: '2024-10-01',
      validUntil: '2024-11-01',
      description: 'Contrat de maintenance annuel des systèmes informatiques'
    }
  ]

  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)

  const handleAddQuote = (quoteData: {
    title: string
    description: string
    clientName: string
    clientEmail: string
    clientPhone: string
    clientCompany: string
    amount: number
    validUntil: string
  }) => {
    const newQuote: Quote = {
      id: Date.now().toString(),
      title: quoteData.title,
      client: quoteData.clientName,
      clientEmail: quoteData.clientEmail,
      clientPhone: quoteData.clientPhone,
      amount: quoteData.amount,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      validUntil: quoteData.validUntil,
      description: quoteData.description
    }

    setQuotes(prev => [newQuote, ...prev])

    // In real app, make API call here
    console.log('Adding quote:', quoteData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé'
      case 'sent':
        return 'Envoyé'
      case 'draft':
        return 'Brouillon'
      case 'rejected':
        return 'Rejeté'
      case 'expired':
        return 'Expiré'
      default:
        return status
    }
  }


  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col lg:pl-[280px]">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10 border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Devis</h2>
                <p className="text-gray-600 mt-1">Gérer vos devis et propositions commerciales</p>
              </div>
              <button
                onClick={() => setIsAddQuoteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Nouveau devis
              </button>
            </div>

            {/* Quotes List */}
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Quote Icon */}
                        <div className="flex-shrink-0 mt-1">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>

                        {/* Quote Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {quote.title}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quote.status)}`}>
                              {getStatusLabel(quote.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{quote.client}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{quote.clientPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>Échéance: {new Date(quote.validUntil).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">
                            {quote.description}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Créé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount and Actions */}
                    <div className="flex items-center gap-6 ml-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(quote.amount)}
                        </div>
                        <div className="text-sm text-gray-500">HT</div>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Devis</p>
                    <p className="text-2xl font-bold text-blue-900">{quotes.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Montant Total</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(quotes.reduce((sum, quote) => sum + quote.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">En attente</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {quotes.filter(q => q.status === 'sent').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Approuvés</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {quotes.filter(q => q.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Quote Modal */}
      <AddQuoteModal
        isOpen={isAddQuoteModalOpen}
        onClose={() => setIsAddQuoteModalOpen(false)}
        onAddQuote={handleAddQuote}
      />
    </div>
  )
}
