import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormCustomer } from '../components/Customer/FormCustomer';
import { Customers } from '../components/Customer/Customer';
import { StatsCustomers } from '../components/Customer/Stats';
import { UserPlus, Filter } from 'lucide-react';
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal';
import { CustomerFilter } from '../components/Customer/CustomerFilter';
import { CustomerDetailsModal } from '../components/Customer/CustomerDetailModal';
import { DeleteCustomer } from '../api/delete/DeleteCustomer';


export function CustomerScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = DeleteCustomer(token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [iscustomerModalOpen, setIscustomerModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [customerToEdit, setcustomerToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customerToDelete, setcustomerToDelete] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [filters, setFilters] = useState({
    status: { supprime: false },
  });

  const getSelectedStatus = () => {
    if (filters.status.supprime) return 'supprime';
    return null;
  };

  const statusFilter = getSelectedStatus();

  const openAddModal = () => { setcustomerToEdit(null); setIsEditing(false); setIscustomerModalOpen(true); };
  const openEditModal = (customer) => { setcustomerToEdit(customer); setIsEditing(true); setIscustomerModalOpen(true); };
  const openDetailsModal = (customer) => { setSelectedCustomer(customer); setIsDetailsOpen(true); }
  const openDeleteModal = (customer) => setcustomerToDelete(customer);

  return (
    <div className="min-h-screen futuristic-bg">
      {/* Particules animées en arrière-plan */}
      <div className="particles-container">
        <div className="particle w-3 h-3 top-20 left-20"></div>
        <div className="particle w-2 h-2 top-40 right-32"></div>
        <div className="particle w-4 h-4 bottom-40 left-40"></div>
        <div className="particle w-1.5 h-1.5 top-60 right-20"></div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col lg:pl-[280px]">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-10 slide-in-up">
          <div className="futuristic-card rounded-3xl p-6">
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-3xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold glow-text">Gestion des clients</h2>
                <p className="text-slate-400 mt-1">Gérer les clients</p>
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
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <span>Filtrer</span>
                  </button>
                  <CustomerFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                  />
                </div>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 hover:scale-105 border border-indigo-400/30"
                >
                  <UserPlus className="w-4 h-4" />
                  Nouveau client
                </button>
              </div>
            </div>
            <Customers
              token={token}
              statusFilter={statusFilter}
              onEditcustomer={openEditModal}
              onDeletecustomer={openDeleteModal}
              onViewDetails={openDetailsModal}
            />
            <StatsCustomers token={token} />
          </div>
        </main>
      </div>
      <FormCustomer
        isOpen={iscustomerModalOpen}
        onClose={() => setIscustomerModalOpen(false)}
        customerToEdit={customerToEdit}
        isEditing={isEditing}
      />
      <CustomerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        token={token}
        customer={selectedCustomer}
      />
      {customerToDelete && (
        <DeleteConfirmModal
          isOpen={!!customerToDelete}
          onClose={() => setcustomerToDelete(null)}
          entityName={customerToDelete.name}
          entityId={customerToDelete.id}
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
