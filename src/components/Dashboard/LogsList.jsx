import { useState } from 'react'
import { Scroll } from 'lucide-react'
import { auditLogs } from '../../api/get/GetAuditLogs'

const statusColors = {
  Approved: 'bg-green-100 text-green-700',
  'In review': 'bg-red-100 text-red-700',
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Audit Logs</h2>
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.label ? 'text-green-600 ' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.label ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#34c759]  hover:bg-[#2ab34f] transition-colors shadow-lg shadow-[#34c759]/30"></div>
            )}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {recentLogs.map((log, index) => (
          <div
            key={log.id}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Scroll className="w-5 h-5 text-green-600 " />
              <span className="text-sm text-[#1A1A1A]">{log.action}</span>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleString('fr-FR')}
            </span>
          </div>
        ))}
        {recentLogs.length === 0 && (
          <div className="text-sm text-gray-400 italic">Aucun log disponible.</div>
        )}
      </div>
    </div>
  )
}
