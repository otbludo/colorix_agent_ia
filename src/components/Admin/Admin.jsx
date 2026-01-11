import React, { useEffect } from 'react';
import { AdminsActionsDropdown } from './AdminActionsDropdown';
import { Shield, Crown } from 'lucide-react';
import { toast } from 'react-toastify';
import { ButtonRecovery } from '../global/Button'
import { GetAdmin } from '../../api/get/GetAdmin';
import { useRecoveryAdmin } from '../../api/post/RecoveryAdmin';

export function Admins({ token, statusFilter, dateRange, onEditAdmin, onDeleteAdmin }) {

  const { data, isPending, isError, error } = GetAdmin(token, statusFilter, dateRange);
  const { mutate: recoverAdmin, isPending: isRecovering, isSuccess: isSuccesRecoveryAdmin, data: dataRecoveryAdmin } = useRecoveryAdmin(token);

  useEffect(() => {
    if (isError) toast.error(error?.message || error || 'Erreur réseau !');
  }, [isError, error]);

  // Debug: Afficher les données reçues
  useEffect(() => {
    if (data) {
      console.log('Admins data:', data)
    }
  }, [data])

  const getRoleIcon = (role) => {
    if (!role) {
      return <Shield className="w-4 h-4 text-slate-400" />;
    }

    return role === 'superadmin'
      ? <Crown className="w-4 h-4 text-purple-400" />
      : <Shield className="w-4 h-4 text-slate-400" />;
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm border bg-slate-500/20 text-slate-300 border-slate-500/30">
          Inconnu
        </span>
      )
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${status === 'actif'
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        : status === 'inactif'
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
        {status}
      </span>
    )
  };

  useEffect(() => {
    if (isSuccesRecoveryAdmin && dataRecoveryAdmin?.message) toast.success(dataRecoveryAdmin.message);
    if (isSuccesRecoveryAdmin && dataRecoveryAdmin?.detail) toast.error(dataRecoveryAdmin.detail);
  }, [isSuccesRecoveryAdmin]);

  return (
    <div className="futuristic-card rounded-2xl overflow-hidden">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10">
        <table className="w-full">
          <thead className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Utilisateur</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Number</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Created at</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {isPending ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                  Chargement des administrateurs...
                </td>
              </tr>
            ) : Array.isArray(data) && data.length > 0 ? data
              .filter(admin => admin && typeof admin === 'object')
              .map((admin, index) => (
                <tr
                  key={admin?.id || index}
                  className="hover:bg-slate-800/30 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all duration-300">
                          <span className="text-sm font-medium text-white">
                            {admin?.name ? admin.name.split(' ').map(n => n[0]).join('') : '?'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{admin?.name || 'Nom inconnu'}</div>
                        <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{admin?.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{admin?.number || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    {React.cloneElement(getRoleIcon(admin?.role), {
                      className: admin?.role === 'superadmin'
                        ? "w-4 h-4 text-purple-400 group-hover:text-purple-300"
                        : "w-4 h-4 text-slate-400 group-hover:text-slate-300"
                    })}
                    <span className="ml-2 text-sm text-white group-hover:text-indigo-300 transition-colors">{admin?.role || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(admin?.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{admin?.created_at || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {statusFilter == "supprime" ? (
                      <ButtonRecovery onClick={() => admin?.id && recoverAdmin(admin.id)} />
                    ) : (
                      <AdminsActionsDropdown
                        onEdit={() => {
                          if (onEditAdmin && typeof onEditAdmin === 'function' && admin) {
                            onEditAdmin(admin)
                          }
                        }}
                        onDelete={() => {
                          if (onDeleteAdmin && typeof onDeleteAdmin === 'function' && admin) {
                            onDeleteAdmin(admin)
                          }
                        }}
                      />
                    )}

                  </td>
                </tr>
              )) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <span className="text-slate-500">👑</span>
                    </div>
                    <span>Aucun administrateur trouvé</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
