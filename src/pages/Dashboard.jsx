import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { Stats } from "../components/Dashboard/stats"
import { DevistTable } from '../components/Dashboard/DevistTable'
import { ProgressGauge } from '../components/Dashboard/ProgressGauge'
import { LogsList } from '../components/Dashboard/LogsList'
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal'
import { CustomerCategoryLoad } from '../components/Dashboard/CustomerCategory'
import { FormCustomerCategory } from '../components/Dashboard/FormCustomerCategory'
import { DeleteCustomerCategory } from '../api/delete/DeleteCustomerCategory'


export function Dashboard() {
  const token = localStorage.getItem('colorix_token');
  const { mutate, isPending, data, isSuccess, isError, error } = DeleteCustomerCategory(token);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleCategoryDelete = (category) => {
    setCategoryToDelete(category)
  }


  const openAddCategoryModal = () => {
    setCategoryToEdit(null)
    setIsEditing(false)
    setIsCategoryModalOpen(true)
  }

  const openEditCategoryModal = (category) => {
    setCategoryToEdit(category)
    setIsEditing(true)
    setIsCategoryModalOpen(true)
  }


  return (
    <div className="min-h-screen futuristic-bg">
      {/* Particules animées en arrière-plan */}
      <div className="particles-container">
        <div className="particle w-3 h-3 top-20 left-20"></div>
        <div className="particle w-2 h-2 top-40 right-32"></div>
        <div className="particle w-4 h-4 bottom-40 left-40"></div>
        <div className="particle w-1.5 h-1.5 top-60 right-20"></div>
        <div className="particle w-2.5 h-2.5 bottom-20 right-40"></div>
        <div className="particle w-1 h-1 top-80 left-60"></div>
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
            <div className="relative z-10 mb-8">
              <h1 className="text-4xl font-bold mb-2 glow-text">
                Dashboard Analytics
              </h1>
              <p className="text-slate-400">Statistiques en temps réel de votre plateforme</p>
            </div>
            <div className="mb-6">
              <Stats />
            </div>
            <div className="grid gap-6 xl:grid-cols-3 mb-6">
              <div className="xl:col-span-2 fade-in" style={{ animationDelay: '0.2s' }}>
                <DevistTable
                  token={token}
                />
              </div>
              <div className="fade-in" style={{ animationDelay: '0.4s' }}>
                <ProgressGauge token={token} />
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 fade-in" style={{ animationDelay: '0.6s' }}>
                <LogsList token={token} />
              </div>
              <div className="fade-in" style={{ animationDelay: '0.8s' }}>
                <CustomerCategoryLoad
                  token={token}
                  onDeleteCategory={handleCategoryDelete}
                  onEditCategory={openEditCategoryModal}
                  onAddCategory={openAddCategoryModal}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <FormCustomerCategory
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryToEdit={categoryToEdit}
        isEditing={isEditing}
        token={token}
      />
      {categoryToDelete && (
        <DeleteConfirmModal
          isOpen={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          entityName={categoryToDelete.name}
          entityId={categoryToDelete.id}
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
