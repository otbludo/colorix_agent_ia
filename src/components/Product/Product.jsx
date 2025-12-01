import {ProductsActionsDropdown} from './ProductActionsDropdown'
import { Shield, Crown, User as UserIcon } from 'lucide-react'



export function Products(){

      const products = [
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
          name: 'Jean Martin',
          email: 'jean.martin@colorix.com',
          role: 'products',
          status: 'active',
          createdAt: 'Feb 1, 2024',
          lastLogin: 'Il y a 3 jours'
        },
        {
          id: '3',
          name: 'Sophie Bernard',
          email: 'sophie.bernard@colorix.com',
          role: 'products',
          status: 'inactive',
          createdAt: 'Feb 15, 2024'
        }
      ]
    
      const getRoleIcon = (role) => {
        switch (role) {
          case 'admin':
            return <Crown className="w-4 h-4 text-purple-600" />
          case 'manager':
            return <Shield className="w-4 h-4 text-blue-600" />
          default:
            return <UserIcon className="w-4 h-4 text-gray-600" />
        }
      }
    
      const getRoleLabel = (role) => {
        switch (role) {
          case 'admin':
            return 'Administrateur'
          case 'manager':
            return 'Manager'
          default:
            return 'Utilisateur'
        }
      }
    
      const getStatusBadge = (status) => {
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

    return(
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
                  {products.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {admin.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRoleIcon(admin.role)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getRoleLabel(admin.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(admin.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.lastLogin || 'Jamais'}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                           <ProductsActionsDropdown
                                                             onEdit={() => openEditModal(client, `client-${index}`)}
                                                             onDelete={() => openDeleteModal(client, `client-${index}`)}
                                                           />
                                                         </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    )
}