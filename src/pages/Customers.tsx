import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { Building, Plus, Mail, Phone, MapPin } from 'lucide-react'
import type { Customer } from '../types'

export function Customers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'TechCorp Inc.',
      email: 'contact@techcorp.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de la Innovation',
      city: 'Paris',
      country: 'France',
      status: 'active'
    },
    {
      id: '2',
      name: 'ShopOnline',
      email: 'manager@shoponline.fr',
      phone: '+33 1 98 76 54 32',
      address: '456 Avenue du Commerce',
      city: 'Lyon',
      country: 'France',
      status: 'active'
    },
    {
      id: '3',
      name: 'SecureData Corp',
      email: 'security@securedata.com',
      phone: '+33 1 11 22 33 44',
      address: '789 Boulevard de la Sécurité',
      city: 'Marseille',
      country: 'France',
      status: 'prospect'
    },
    {
      id: '4',
      name: 'GlobalTech Solutions',
      email: 'it@globaltech.com',
      phone: '+33 1 55 66 77 88',
      address: '321 Place de la Technologie',
      city: 'Toulouse',
      country: 'France',
      status: 'active'
    },
    {
      id: '5',
      name: 'StartupInnov',
      email: 'hello@startupinnov.fr',
      phone: '+33 1 44 55 66 77',
      address: '654 Rue des Entrepreneurs',
      city: 'Nantes',
      country: 'France',
      status: 'inactive'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'prospect':
        return 'bg-blue-100 text-blue-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'prospect':
        return 'Prospect'
      case 'inactive':
        return 'Inactif'
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
                <h2 className="text-2xl font-bold text-[#102040]">Clients</h2>
                <p className="text-gray-600 mt-1">Gérer tous vos clients Colorix</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Nouveau client
              </button>
            </div>

            {/* Customers Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                          {getStatusLabel(customer.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{customer.city}, {customer.country}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Building className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Clients</p>
                    <p className="text-2xl font-bold text-blue-900">{customers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Clients Actifs</p>
                    <p className="text-2xl font-bold text-green-900">
                      {customers.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">👁</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Prospects</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {customers.filter(c => c.status === 'prospect').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
