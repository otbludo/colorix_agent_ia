import { useState } from 'react'
import { Sidebar } from '../components/global/Sidebar'
import { Header } from '../components/global/Header'
import { StatsTimelogs } from '../components/Timelogs/Stats'
import { Timelogs } from '../components/Timelogs/Timelogs'


export function TimeLog() {
  const token = localStorage.getItem('colorix_token');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen futuristic-bg">
      {/* Particules animées en arrière-plan */}
      <div className="particles-container">
        <div className="particle w-3 h-3 top-20 left-20"></div>
        <div className="particle w-2 h-2 top-40 right-32"></div>
        <div className="particle w-4 h-4 bottom-40 left-40"></div>
        <div className="particle w-1.5 h-1.5 top-60 right-20"></div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} token={token}/>
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

            <div className="relative z-10 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold glow-text">Suivi du temps</h2>
                <p className="text-slate-400 mt-1">Gérer et suivre le temps passé sur les tâches</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Timelogs />
              <StatsTimelogs />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
