import { useState } from 'react'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { FormCustomer } from '../components/Customer/FormCustomer'
import {Customers} from '../components/Customer/Customer'
import {StatsCustomers} from '../components/Customer/Stats'
import { UserPlus, User as UserIcon } from 'lucide-react'

export function CustomerScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)




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
                <h2 className="text-2xl font-bold text-[#102040]">Gestion des Clients</h2>
                <p className="text-gray-600 mt-1">Gérer les comptes utilisateurs et leurs permissions</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Ajouter un utilisateur
              </button>
            </div>

            {/* Users Table */}
            <Customers/>

            {/* Summary Stats */}
            <StatsCustomers/>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      <FormCustomer
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  )
}
