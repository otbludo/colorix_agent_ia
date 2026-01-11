import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormAdmins } from '../components/Admin/FormAdmin';
import { Admins } from '../components/Admin/Admin';
import { StatsAdmins } from '../components/Admin/Stats';
import { UserPlus, Filter } from 'lucide-react';
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal';
import { AdminFilter } from '../components/Admin/AdminFilter';
import { useDeleteAdmin } from '../api/delete/DeleteAdmin';


export function AdminsScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = useDeleteAdmin(token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                  <button
                    onClick={() => setIsFilterOpen(prev => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-sm backdrop-blur-sm ${statusFilter
                      ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
                      : 'border-slate-600/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:border-indigo-500/50'
                      }`}
                  >
                    <div className="relative">
                      <Filter className="w-4 h-4" />
                      {statusFilter && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span>Filtrer</span>
                    {/* {statusFilter && (
                      <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {/* {filteredClients.length} *
                      </span>
                    )} */}
                  </button>
                  <AdminFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                  />
                </div>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 hover:scale-105 border border-indigo-400/30 z-20"
                >
                  <UserPlus className="w-4 h-4" />
                  Nouveau administrateur
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Admins
                token={token}
                statusFilter={statusFilter}
                dateRange={filters.dateRange}
                onEditAdmin={openEditModal}
                onDeleteAdmin={openDeleteModal}
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
