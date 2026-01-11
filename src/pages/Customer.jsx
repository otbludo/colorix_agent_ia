import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormCustomer } from '../components/Customer/FormCustomer';
import { Customers } from '../components/Customer/Customer';
import { StatsCustomers } from '../components/Customer/Stats';
import { UserPlus, Filter } from 'lucide-react';
import { Button, ButtonFilter } from "../components/global/Button";
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
  const [filteredCount, setFilteredCount] = useState(0);

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
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} token={token} />
        <main className="p-4 sm:p-6 lg:p-10 slide-in-up">
          <div className="futuristic-card rounded-3xl p-6">
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-3xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold glow-text">Gestion des clients</h2>
                <p className="text-slate-400 mt-1">Gérer les clients</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ButtonFilter
                    isActive={!!statusFilter}
                    count={filteredCount}
                    onClick={() => setIsFilterOpen(prev => !prev)}
                  />
                  <CustomerFilter
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
                  Nouveau client
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Customers
                token={token}
                statusFilter={statusFilter}
                onEditcustomer={openEditModal}
                onDeletecustomer={openDeleteModal}
                onViewDetails={openDetailsModal}
                onCountChange={setFilteredCount}
              />
              <StatsCustomers token={token} />
            </div>
          </div>
        </main>
      </div>
      <FormCustomer
        isOpen={iscustomerModalOpen}
        onClose={() => setIscustomerModalOpen(false)}
        customerToEdit={customerToEdit}
        isEditing={isEditing}
        token={token}
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
