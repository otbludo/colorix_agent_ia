import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { AddEstimateModal } from '../components/Estimate/FormEstimate'
import { Plus } from 'lucide-react'
import { Estimates } from '../components/Estimate/Estimates'
import { StatEstimate } from '../components/Estimate/Stats'
import { ShowInfosEstimate } from '../components/Estimate/ShowInfosEstimate'
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal'
import { DevisFilter } from '../components/Dashboard/DevisFilter'
import { Filter } from 'lucide-react'
import { Button, ButtonFilter } from "../components/global/Button"
import { DeleteDevis } from '../api/delete/DeleteDevis'
import { GetInfoAdmin } from '../api/get/GetInfoAdmin'


export function EstimateScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = DeleteDevis(token);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddQuoteModalOpen, setIsAddQuoteModalOpen] = useState(false)
  const [isDevisInfoModalOpen, setIsDevisInfoModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);

  const [devisToEdit, setDevisToEdit] = useState(null);
  const [devisInfo, setDevisInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [devisToDelete, setDevisToDelete] = useState(null);

  const [filters, setFilters] = useState({
    status: {
      valide: false,
      attente: false,
      supprime: false
    },
    client: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const getSelectedStatus = () => {
    if (filters.status.valide) return 'valide';
    if (filters.status.attente) return 'attente';
    if (filters.status.supprime) return 'supprime';
    return null;
  };

  const statusFilter = getSelectedStatus();

  console.log('Estimate filters:', filters);
  console.log('Estimate statusFilter:', statusFilter);

  const openAddModal = () => { setDevisToEdit(null); setIsEditing(false); setIsAddQuoteModalOpen(true); };
  const openEditModal = (devis) => { setDevisToEdit(devis); setIsEditing(true); setIsAddQuoteModalOpen(true); };
  const openShowInfosDevis = (devis) => { setDevisInfo(devis); setIsDevisInfoModalOpen(true); };
  const openDeleteModal = (devis) => setDevisToDelete(devis);

  return (
    <div className="min-h-screen futuristic-bg">
      {/* Particules animées en arrière-plan */}
      <div className="particles-container">
        <div className="particle w-3 h-3 top-20 left-20"></div>
        <div className="particle w-2 h-2 top-40 right-32"></div>
        <div className="particle w-4 h-4 bottom-40 left-40"></div>
        <div className="particle w-1.5 h-1.5 top-60 right-20"></div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} token={token} />
      <div className="flex flex-col lg:pl-[280px]">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-10 slide-in-up">
          <div className="futuristic-card rounded-3xl p-6 sm:p-8 lg:p-10">
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-3xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold glow-text">Gestion des devis</h2>
                <p className="text-slate-400 mt-1">Gérer vos devis et propositions commerciales</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ButtonFilter
                    isActive={!!statusFilter}
                    count={filteredCount}
                    onClick={() => setIsFilterOpen(prev => !prev)}
                  />
                  <DevisFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                  />
                </div>
                <Button
                  onClick={openAddModal}
                  variant="quaternary">
                  <Plus className="w-4 h-4" />
                  Nouveau devis
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Estimates
                onEditDevis={openEditModal}
                onShowInfosDevis={openShowInfosDevis}
                onDeleteDevis={openDeleteModal}
                statusFilter={statusFilter}
                filters={filters}
                token={token}
                onCountChange={setFilteredCount}
              />
              <StatEstimate token={token} />
            </div>

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
      {devisToDelete && (
        <DeleteConfirmModal
          isOpen={!!devisToDelete}
          onClose={() => setDevisToDelete(null)}
          entityName={`Devis ${devisToDelete.name_product}`}
          entityId={devisToDelete.id}
          deleteApi={mutate}
          isPending={isPending}
          isSuccess={isSuccess}
          isError={isError}
          data={data}
          error={error}
        />
      )}
      <ToastContainer position="bottom-center" />
    </div>
  )
}
