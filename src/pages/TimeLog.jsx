import { useState } from 'react'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { StatsTimelogs } from '../components/Timelogs/Stats'
import { Timelogs } from '../components/Timelogs/Timelogs'


export function TimeLog() {
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
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Suivi du temps</h2>
                <p className="text-gray-600 mt-1">Gérer et suivre le temps passé sur les tâches</p>
              </div>
            </div>
            <Timelogs />
            <StatsTimelogs />
          </div>
        </main>
      </div>
    </div>
  )
}
