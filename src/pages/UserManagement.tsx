import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Header } from '../components/Header'
import { AddUserModal } from '../components/AddUserModal'
import { UserPlus, MoreVertical, Edit, Trash2, Shield, Crown, User as UserIcon } from 'lucide-react'
import type { User } from '../types'

export function UserManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)

  // Mock data - in real app this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'admin@colorix.com',
      role: 'admin',
      status: 'active',
      createdAt: 'Jan 1, 2024',
      lastLogin: 'Aujourd\'hui'
    },
    {
      id: '2',
      name: 'Marie Dupont',
      email: 'marie.dupont@colorix.com',
      role: 'manager',
      status: 'active',
      createdAt: 'Jan 15, 2024',
      lastLogin: 'Hier'
    },
    {
      id: '3',
      name: 'Jean Martin',
      email: 'jean.martin@colorix.com',
      role: 'user',
      status: 'active',
      createdAt: 'Feb 1, 2024',
      lastLogin: 'Il y a 3 jours'
    },
    {
      id: '4',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@colorix.com',
      role: 'user',
      status: 'inactive',
      createdAt: 'Feb 15, 2024'
    }
  ])

  const handleAddUser = (userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | 'manager';
    status: 'active' | 'inactive'
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    setUsers(prev => [...prev, newUser])

    // TODO: Implement user creation API call
    console.log('Adding user:', userData)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-purple-600" />
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <UserIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur'
      case 'manager':
        return 'Manager'
      default:
        return 'Utilisateur'
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        status === 'active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Actif' : 'Inactif'}
      </span>
    )
  }

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
                <h2 className="text-2xl font-bold text-[#102040]">Gestion des Utilisateurs</h2>
                <p className="text-gray-600 mt-1">Gérer les comptes utilisateurs et leurs permissions</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Ajouter un utilisateur
              </button>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRoleIcon(user.role)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin || 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <UserIcon className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-blue-900">{users.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Utilisateurs Actifs</p>
                    <p className="text-2xl font-bold text-green-900">
                      {users.filter(u => u.status === 'active').length}
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
                      {users.filter(u => u.role === 'admin').length}
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
                      {users.filter(u => u.role === 'manager').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  )
}
