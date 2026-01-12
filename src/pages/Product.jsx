import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Sidebar } from '../components/global/Sidebar';
import { Header } from '../components/global/Header';
import { FormProduct } from '../components/Product/FormProduct';
import { Products } from '../components/Product/Product';
import { StatsProducts } from '../components/Product/Stats';
import { Button, ButtonFilter } from "../components/global/Button";
import { Plus, Filter } from 'lucide-react';
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal';
import { ProductFilter } from '../components/Product/ProductFilter';
import { DeleteProduct } from '../api/delete/DeleteProduct';


export function ProductScreen() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = DeleteProduct(token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);

  const [productToEdit, setproductToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [productToDelete, setproductToDelete] = useState(null);

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
            <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold glow-text">Gestion des produits</h2>
                <p className="text-slate-400 mt-1">Gérer les produits</p>
              </div>
              <div className="flex items-center gap-3 ">
                <div className="relative">
                  <ButtonFilter
                    isActive={!!statusFilter}
                    count={filteredCount}
                    onClick={() => setIsFilterOpen(prev => !prev)}
                  />
                  <ProductFilter
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
                  Nouveau produit
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Products
                token={token}
                statusFilter={statusFilter}
                onEditproduct={openEditModal}
                onDeleteproduct={openDeleteModal}
                onCountChange={setFilteredCount}
              />
              <StatsProducts token={token} />
            </div>
          </div>
        </main>
      </div>
      <FormProduct
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
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
