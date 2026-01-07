import { Clock, Calendar, User } from 'lucide-react'

export function StatsTimelogs() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="futuristic-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-500">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Effet de lumière animé */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div className="relative z-10 flex items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-lg mb-4 mr-4 group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Cette semaine</p>
            <p className="text-3xl font-bold text-white">32h 15m</p>
          </div>
        </div>

        {/* Bordure lumineuse au hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/50 blur-sm"></div>
        </div>
      </div>

      <div className="futuristic-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-500">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Effet de lumière animé */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div className="relative z-10 flex items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg mb-4 mr-4 group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Ce mois</p>
            <p className="text-3xl font-bold text-white">128h 45m</p>
          </div>
        </div>

        {/* Bordure lumineuse au hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/50 blur-sm"></div>
        </div>
      </div>

      <div className="futuristic-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-500">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Effet de lumière animé */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div className="relative z-10 flex items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg mb-4 mr-4 group-hover:scale-110 transition-transform duration-300">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Moyenne/jour</p>
            <p className="text-3xl font-bold text-white">7h 22m</p>
          </div>
        </div>

        {/* Bordure lumineuse au hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/50 blur-sm"></div>
        </div>
      </div>

      <div className="futuristic-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-500">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        {/* Effet de lumière animé */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div className="relative z-10 flex items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 shadow-lg mb-4 mr-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Productivité</p>
            <p className="text-3xl font-bold text-white">92%</p>
          </div>
        </div>

        {/* Bordure lumineuse au hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/50 blur-sm"></div>
        </div>
      </div>
    </div>
  )
}