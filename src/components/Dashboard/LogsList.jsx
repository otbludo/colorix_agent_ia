import { useState } from 'react'
import { Scroll } from 'lucide-react'
import { auditLogs } from '../../api/get/GetAuditLogs'

const statusColors = {
  Approved: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  'In review': 'bg-red-500/20 text-red-300 border border-red-500/30',
}

export function LogsList({ token }) {
  const { data, isPending, isError, error } = auditLogs(token)
  const [activeTab, setActiveTab] = useState('All')

  const tabs = [
    { label: 'All', key: 'all', count: data?.all?.length || 0 },
    { label: 'Aujourd\'hui', key: 'today', count: data?.today?.length || 0 },
    { label: 'Semaine dernière', key: 'last_7_days', count: data?.last_7_days?.length || 0 },
    { label: 'Mois dernier', key: 'last_month', count: data?.last_month?.length || 0 },
  ]

  const logsToDisplay = data?.[tabs.find(tab => tab.label === activeTab)?.key] || []

  const recentLogs = logsToDisplay
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)

  return (
    <div className="futuristic-card rounded-2xl p-4 sm:p-6 slide-in-up">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold glow-text mb-6">Audit Logs</h2>
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-600/50">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${activeTab === tab.label
                ? 'text-indigo-300 bg-indigo-500/20 border border-indigo-400/30'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs backdrop-blur-sm ${activeTab === tab.label
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                    : 'bg-slate-600/30 text-slate-300 border border-slate-500/30'
                    }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.label && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
              )}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {recentLogs.map((log, index) => (
            <div
              key={log.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors duration-300">
                  <Scroll className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm text-white group-hover:text-indigo-300 transition-colors font-medium">{log.action}</span>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                {new Date(log.timestamp).toLocaleString('fr-FR')}
              </span>
            </div>
          ))}
          {recentLogs.length === 0 && (
            <div className="text-sm text-slate-500 italic text-center py-8 border-2 border-dashed border-slate-600/50 rounded-2xl">
              Aucun log disponible.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
