import React, { useEffect } from 'react';
import { CustomersActionsDropdown } from './CustomerActionsDropdown';
import { RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetCustomer } from '../../api/get/GetCustomers';
import { RecoveryCustomer } from '../../api/post/RecoveryCustomer';

export function Customers({ token, statusFilter, onEditcustomer, onDeletecustomer, onViewDetails }) {

  const { data, isPending, isError, error } = GetCustomer(token, statusFilter);
  const { mutate: recovercustomer, isPending: isRecovering, isSuccess: isSuccesRecoveryCustomer, data: dataRecoveryCustomer } = RecoveryCustomer(token);

  useEffect(() => {
    if (isError) toast.error(error.message || 'Erreur réseau !');
  }, [isError]);

  const getStatusBadge = (status) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm border ${status === 'client'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      }`}>
      {status}
    </span>
  );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR");
  };

  useEffect(() => {
    if (isSuccesRecoveryCustomer && dataRecoveryCustomer?.message) {
      toast.success(dataRecoveryCustomer.message);
    }
    if (isSuccesRecoveryCustomer && dataRecoveryCustomer?.detail) toast.error(dataRecoveryCustomer.detail);
  }, [isSuccesRecoveryCustomer]);


  return (
    <div className="futuristic-card rounded-2xl overflow-hidden">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Numéro</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ville</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pays</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Entreprise</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Créé le</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {data?.map((customer, index) => (
              <tr
                onClick={() => { onViewDetails(customer); }}
                key={customer.id}
                className="hover:bg-slate-800/30 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all duration-300">
                      <span className="text-sm font-medium text-white">
                        {customer.first_name?.[0]}{customer.name?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {customer.first_name} {customer.name}
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.country}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{customer.category ?? "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(customer.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{formatDate(customer.created_at)}</td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {statusFilter === "supprime" ? (
                    <button
                      onClick={() => recovercustomer(customer.id)}
                      className="p-2 rounded-2xl hover:bg-emerald-500/20 transition-all duration-300 group/btn"
                      title="Restaurer"
                    >
                      <RotateCcw className="w-5 h-5 text-emerald-400 group-hover/btn:text-emerald-300" />
                    </button>
                  ) : (
                    <CustomersActionsDropdown
                      onEdit={() => onEditcustomer(customer)}
                      onDelete={() => onDeletecustomer(customer)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
