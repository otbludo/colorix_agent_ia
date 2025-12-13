import { Clock, Calendar, User } from 'lucide-react'

export function StatsTimelogs(){
    return(
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
    )
}