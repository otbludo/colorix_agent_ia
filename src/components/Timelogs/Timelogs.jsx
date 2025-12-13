import { Play, Square, Calendar, User } from 'lucide-react'
import {auditLogs} from '../../api/get/GetAuditLogs'

export function Timelogs(){
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

  
    return(
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
                    <div className="space-y-4">
              {data?.map((log) => (
                <div key={log.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{log.action}</h3>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Effectuer
                          </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{log.performed_by_email}</span>
                        </div>
                        {/* <div>
                          Projet: <span className="font-medium">{log.project}</span>
                        </div> */}
                        {/* <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(log.date).toLocaleDateString('fr-FR')}</span>
                        </div> */}
                      </div>
                      {/* <p className="text-gray-600 text-sm mt-2">{log.description}</p> */}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
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