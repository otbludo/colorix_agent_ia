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

  // Gestion des filtres
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
  const openDeleteModal = (customer) => setcustomerToDelete(customer);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col lg:pl-[280px]">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Gestion des customer</h2>
                <p className="text-gray-600 mt-1">Gérer les ccustomers</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => setIsFilterOpen(prev => !prev)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow-md text-sm transition-shadow">
                    <Filter className="w-4 h-4 text-sky-600" />
                    <span className="text-sm text-slate-700">Filtrer</span>
                  </button>
                  <CustomerFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApplyFilters={setFilters}
                    currentFilters={filters}
                  />
                </div>

                <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Ajouter un utilisateur
                </button>
              </div>
            </div>

            <Customers
              token={token}
              statusFilter={statusFilter}
              onEditcustomer={openEditModal}
              onDeletecustomer={openDeleteModal}
            />



            <StatsCustomers />
          </div>
        </main>
      </div>

      <FormCustomer
        isOpen={iscustomerModalOpen}
        onClose={() => setIscustomerModalOpen(false)}
        customerToEdit={customerToEdit}
        isEditing={isEditing}
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
