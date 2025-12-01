import { Play, Square, Calendar, User } from 'lucide-react'

export function Timelogs(){

    const timeEntries = [
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


    const totalTimeToday = timeEntries
    .filter(entry => entry.date === '2024-11-24')
    .reduce((total, entry) => total + entry.duration, 0)

    const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  
    return(
        <>
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
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Effectuer
                          </span>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
    )
}