import React, { useEffect } from 'react';
import { AdminsActionsDropdown } from './AdminActionsDropdown';
import { Shield, Crown, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetAdmin } from '../../api/get/GetAdmin';
import { useRecoveryAdmin } from '../../api/post/RecoveryAdmin';

export function Admins({ token, statusFilter, dateRange, onEditAdmin, onDeleteAdmin }) {

  const { data, isPending, isError, error } = GetAdmin(token, statusFilter, dateRange);
  const { mutate: recoverAdmin, isPending: isRecovering, isSuccess: isSuccesRecoveryAdmin, data: dataRecoveryAdmin } = useRecoveryAdmin(token);

  useEffect(() => {
    if (isError) toast.error(error.message || 'Erreur réseau !');
  }, [isError]);

  const getRoleIcon = (role) => {
    return role === 'superadmin'
      ? <Crown className="w-4 h-4 text-purple-600" />
      : <Shield className="w-4 h-4 text-gray-600" />;
  };

  const getStatusBadge = (status) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'actif'
      ? 'bg-green-100 text-green-800'
      : status === 'inactif'
        ? 'bg-red-100 text-red-800'
        : 'bg-red-100 text-red-800'
      }`}>
      {status}
    </span>
  );

  useEffect(() => {
    if (isSuccesRecoveryAdmin && dataRecoveryAdmin?.message) toast.success(dataRecoveryAdmin.message);
    if (isSuccesRecoveryAdmin && dataRecoveryAdmin?.detail) toast.error(dataRecoveryAdmin.detail);
  }, [isSuccesRecoveryAdmin]);

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((admin) => (
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
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                    <div className="text-sm text-gray-500">{admin.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.number}</td>
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                {getRoleIcon(admin.role)}
                <span className="ml-2 text-sm text-gray-900">{admin.role}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(admin.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.created_at}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {statusFilter == "supprime" ? (
                  <button
                    onClick={() => recoverAdmin(admin.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    title="Restaurer"
                  >
                    <RotateCcw className="w-5 h-5 text-green-600" />
                  </button>
                ) : (
                  <AdminsActionsDropdown
                    onEdit={() => onEditAdmin(admin)}
                    onDelete={() => onDeleteAdmin(admin)}
                  />
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
