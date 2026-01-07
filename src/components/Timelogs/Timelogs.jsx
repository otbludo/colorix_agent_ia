import { Play, Square, Calendar, User } from 'lucide-react'
import { auditLogs } from '../../api/get/GetAuditLogs'

export function Timelogs() {
  const token = localStorage.getItem('colorix_token');
  const { data, isPending, isError, error } = auditLogs(token);


  //   const totalTimeToday = data
  //   .filter(log => log.timestamp === '2024-11-24')
  //   .reduce((total, log) => total + log.duration, 0)

  //   const formatDuration = (minutes) => {
  //   const hours = Math.floor(minutes / 60)
  //   const mins = minutes % 60
  //   return `${hours}h ${mins}m`
  // }


  return (
    <>
      {/* Today's Summary */}
      {/* <div className="bg-blue-50 p-6 rounded-xl">
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
            </div> */}

      {/* Time Entries */}
      <div className="flex flex-col-reverse gap-4">
        {data?.all?.map((log, index) => (
          <div
            key={log.id}
            className="futuristic-card rounded-2xl p-6 hover:scale-[1.01] transition-all duration-500 slide-in-up group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-2xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{log.action}</h3>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-pulse"></div>
                    Effectué
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{log.performed_by_email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    {log.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}