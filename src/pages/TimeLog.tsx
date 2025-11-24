import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { Clock, Play, Pause, Square, Calendar, User } from 'lucide-react'

interface TimeEntry {
  id: string
  task: string
  project: string
  user: string
  date: string
  duration: number // in minutes
  description: string
  status: 'running' | 'stopped'
}

export function TimeLog() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data
  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      task: 'Design homepage mockup',
      project: 'Website Redesign',
      user: 'Marie Dupont',
      date: '2024-11-24',
      duration: 120,
      description: 'Working on homepage wireframes',
      status: 'stopped'
    },
    {
      id: '2',
      task: 'API development',
      project: 'Mobile App',
      user: 'Jean Martin',
      date: '2024-11-24',
      duration: 180,
      description: 'Implementing user authentication endpoints',
      status: 'stopped'
    },
    {
      id: '3',
      task: 'Code review',
      project: 'Backend Development',
      user: 'Sophie Bernard',
      date: '2024-11-23',
      duration: 90,
      description: 'Reviewing pull request #42',
      status: 'running'
    }
  ]

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const totalTimeToday = timeEntries
    .filter(entry => entry.date === '2024-11-24')
    .reduce((total, entry) => total + entry.duration, 0)

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col lg:pl-[280px]">
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-10">
          <div className="space-y-8 bg-white rounded-3xl shadow-[0_15px_45px_rgba(15,23,42,0.06)] p-6 sm:p-8 lg:p-10 border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#102040]">Suivi du temps</h2>
                <p className="text-gray-600 mt-1">Gérer et suivre le temps passé sur les tâches</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Play className="w-4 h-4" />
                Démarrer un timer
              </button>
            </div>

            {/* Today's Summary */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Aujourd'hui</h3>
                  <p className="text-blue-700">Temps total travaillé</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">
                    {formatDuration(totalTimeToday)}
                  </div>
                  <p className="text-blue-700">7h 30m objectif</p>
                </div>
              </div>
            </div>

            {/* Time Entries */}
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{entry.task}</h3>
                        {entry.status === 'running' && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            En cours
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{entry.user}</span>
                        </div>
                        <div>
                          Projet: <span className="font-medium">{entry.project}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{entry.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatDuration(entry.duration)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {entry.status === 'running' ? (
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Square className="w-4 h-4" />
                          </button>
                        ) : (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Cette semaine</p>
                    <p className="text-2xl font-bold text-green-900">32h 15m</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Ce mois</p>
                    <p className="text-2xl font-bold text-blue-900">128h 45m</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Moyenne/jour</p>
                    <p className="text-2xl font-bold text-purple-900">7h 22m</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-orange-600">Productivité</p>
                    <p className="text-2xl font-bold text-orange-900">92%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
