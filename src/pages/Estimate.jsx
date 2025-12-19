import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { AddEstimateModal } from '../components/Estimate/FormEstimate'
import { Plus } from 'lucide-react'
import { Estimates } from '../components/Estimate/Estimates'
import { StatEstimate } from '../components/Estimate/Stats'
import { ShowInfosEstimate } from '../components/Estimate/ShowInfosEstimate'


export function EstimateScreen() {
  const token = localStorage.getItem('colorix_token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false)
  const [isDevisInfoModalOpen, setIsDevisInfoModalOpen] = useState(false);

  const [devisToEdit, setDevisToEdit] = useState(null);
  const [devisInfo, setDevisInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [devisToDelete, setDevisToDelete] = useState(null);

  const openAddModal = () => { setDevisToEdit(null); setIsEditing(false); setIsAddQuoteModalOpen(true); };
  const openEditModal = (devis) => { setDevisToEdit(devis); setIsEditing(true); setIsAddQuoteModalOpen(true); };
  const openShowInfosDevis = (devis) => { setDevisInfo(devis); setIsDevisInfoModalOpen(true); };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col lg:pl-[280px]">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Gestion des devis</h2>
                <p className="text-gray-600 mt-1">Gérer vos devis et propositions commerciales</p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Nouveau devis
              </button>
            </div>
            <Estimates
              onEditDevis={openEditModal}
              onShowInfosDevis={openShowInfosDevis}
              token={token} />
            <StatEstimate token={token} />
          </div>
        </main>
      </div>
      <AddEstimateModal
        isOpen={isAddQuoteModalOpen}
        onClose={() => setIsAddQuoteModalOpen(false)}
        devisToEdit={devisToEdit}
        isEditing={isEditing}
        token={token}
      />
      <ShowInfosEstimate token={token}
        isOpen={isDevisInfoModalOpen}
        estimate={devisInfo}
        onClose={() => setIsDevisInfoModalOpen(false)}
      />
      <ToastContainer position="bottom-center" />
    </div>
  )
}
