import { useState } from 'react'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { Stats } from "../components/Dashboard/stats"
import { DevistTable } from '../components/Dashboard/DevistTable'
import { ProgressGauge } from '../components/Dashboard/ProgressGauge'
import { LogsList } from '../components/Dashboard/LogsList'
import { DeleteConfirmModal } from '../components/global/DeleteConfirmModal'
import { CustomerCategoryLoad } from '../components/Dashboard/CustomerCategoryLoad'


export function Dashboard() {
  const token = localStorage.getItem('colorix_token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)


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
              <h2 className="text-2xl font-bold text-[#102040]">Overview</h2>
            </div>
            <Stats />
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <DevistTable token={token} />
              </div>
              <div>
                <ProgressGauge token={token} />
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <LogsList token={token}/>
              </div>
              <div>
                <CustomerCategoryLoad token={token} />
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* <DeleteConfirmModal
        isOpen={!!devisToDelete}
        onClose={() => setDevisToDelete(null)}
        entityName={devisToDelete.name}
        entityId={devisToDelete.id}
        deleteApi={mutate}
        isPending={isPending}
        isSuccess={isSuccess}
        isError={isError}
        data={data}
        error={error}
      /> */}
    </div>
  )
}
