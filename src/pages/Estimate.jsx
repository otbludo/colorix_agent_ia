import { useState } from 'react'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { AddEstimateModal } from '../components/Estimate/AddEstimateModal'
import { Plus} from 'lucide-react'
import {Estimates} from '../components/Estimate/Estimates'
import {StatEstimate} from '../components/Estimate/Stats'



export function EstimateScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false)

  


  const handleAddQuote = (quoteData) => {
    const newQuote = {
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


    // TODO: Implement quote creation API call
    console.log('Adding quote:', quoteData)
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
          
<Estimates/>
            {/* Summary Stats */}
           <StatEstimate/>
          </div>
        </main>
      </div>

      {/* Add Quote Modal */}
      <AddEstimateModal
        isOpen={isAddQuoteModalOpen}
        onClose={() => setIsAddQuoteModalOpen(false)}
        onAddQuote={handleAddQuote}
      />
    </div>
  )
}
