import { Shield, Crown, User as UserIcon } from 'lucide-react'

export function StatsAdmins() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <UserIcon className="w-8 h-8 text-blue-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-600">Total Utilisateurs</p>
            <p className="text-2xl font-bold text-blue-900">8</p>
          </div>
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-green-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-green-600">Utilisateurs Actifs</p>
            <p className="text-2xl font-bold text-green-900">
              3
            </p>
          </div>
        </div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Crown className="w-8 h-8 text-purple-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-purple-600">Administrateurs</p>
            <p className="text-2xl font-bold text-purple-900">
              4
            </p>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center">
          <UserIcon className="w-8 h-8 text-orange-600" />
          <div className="ml-3">
            <p className="text-sm font-medium text-orange-600">Managers</p>
            <p className="text-2xl font-bold text-orange-900">
              2
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}