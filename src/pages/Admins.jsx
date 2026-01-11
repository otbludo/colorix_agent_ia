import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormAdmins } from '../components/Admin/FormAdmin';
import { Admins } from '../components/Admin/Admin';
import { StatsAdmins } from '../components/Admin/Stats';
import { UserPlus, Filter } from 'lucide-react';
import { Button, ButtonFilter } from "../components/global/Button";
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal';
import { AdminFilter } from '../components/Admin/AdminFilter';
import { useDeleteAdmin } from '../api/delete/DeleteAdmin';


export function AdminsScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = useDeleteAdmin(token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);

  const [adminToEdit, setAdminToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const [filters, setFilters] = useState({
    status: { actif: false, inactif: false, supprime: false },
    dateRange: { start: '', end: '' }
  });

  const getSelectedStatus = () => {
    if (filters.status.actif) return 'actif';
    if (filters.status.inactif) return 'inactif';
    if (filters.status.supprime) return 'supprime';
    return null;
  };

  const statusFilter = getSelectedStatus();

  const openAddModal = () => { setAdminToEdit(null); setIsEditing(false); setIsAdminModalOpen(true); };
  const openEditModal = (admin) => { setAdminToEdit(admin); setIsEditing(true); setIsAdminModalOpen(true); };
  const openDeleteModal = (admin) => setAdminToDelete(admin);

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
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-10 slide-in-up">
          <div className="futuristic-card rounded-3xl p-6">
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-3xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold glow-text">Gestion des Administrateurs</h2>
                <p className="text-gray-600 mt-1">Gérer les comptes utilisateurs et leurs permissions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ButtonFilter
                    isActive={!!statusFilter}
                    count={filteredCount}
                    onClick={() => setIsFilterOpen(prev => !prev)}
                  />
                  <AdminFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                  />
                </div>
                <Button
                  onClick={openAddModal}
                  variant="quaternary">
                  <UserPlus className="w-4 h-4" />
                  Nouveau administrateur
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Admins
                token={token}
                statusFilter={statusFilter}
                dateRange={filters.dateRange}
                onEditAdmin={openEditModal}
                onDeleteAdmin={openDeleteModal}
                onCountChange={setFilteredCount}
              />
              <StatsAdmins token={token} />
            </div>
          </div>
        </main>
      </div>
      <FormAdmins
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        adminToEdit={adminToEdit}
        isEditing={isEditing}
        token={token}
      />
      {adminToDelete && (
        <DeleteConfirmModal
          isOpen={!!adminToDelete}
          onClose={() => setAdminToDelete(null)}
          entityName={adminToDelete.name}
          entityId={adminToDelete.id}
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
  );
}
