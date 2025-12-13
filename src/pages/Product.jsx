import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormProduct } from '../components/Product/FormProduct';
import { Products } from '../components/Product/Product';
import { StatsProducts } from '../components/Product/Stats';
import { UserPlus, Filter } from 'lucide-react';
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal';
import { ProductFilter } from '../components/Product/ProductFilter';
import { DeleteProduct } from '../api/delete/DeleteProduct';

export function ProductScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = DeleteProduct(token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [productToEdit, setproductToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [productToDelete, setproductToDelete] = useState(null);

  // Gestion des filtres
  const [filters, setFilters] = useState({
    status: { supprime: false },
  });

  const getSelectedStatus = () => {
    if (filters.status.supprime) return 'supprime';
    return null;
  };

  const statusFilter = getSelectedStatus();

  const openAddModal = () => { setproductToEdit(null); setIsEditing(false); setIsProductModalOpen(true); };
  const openEditModal = (product) => { setproductToEdit(product); setIsEditing(true); setIsProductModalOpen(true); };
  const openDeleteModal = (product) => setproductToDelete(product);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col lg:pl-[280px]">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Gestion des product</h2>
                <p className="text-gray-600 mt-1">Gérer les cproducts</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => setIsFilterOpen(prev => !prev)} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow-md text-sm transition-shadow">
                    <Filter className="w-4 h-4 text-sky-600" />
                    <span className="text-sm text-slate-700">Filtrer</span>
                  </button>
                  <ProductFilter
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

            <Products
              token={token}
              statusFilter={statusFilter}
              onEditproduct={openEditModal}
              onDeleteproduct={openDeleteModal}
            />

            <StatsProducts />
          </div>
        </main>
      </div>

      <FormProduct
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}  // <-- correction
        isEditing={isEditing}
      />



      {productToDelete && (
        <DeleteConfirmModal
          isOpen={!!productToDelete}
          onClose={() => setproductToDelete(null)}
          entityName={productToDelete.name}
          entityId={productToDelete.id}
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
