import React, { useEffect } from 'react';
import { CustomersActionsDropdown } from './CustomerActionsDropdown';
import { RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetCustomer } from '../../api/get/GetCustomers';
import { RecoveryCustomer } from '../../api/post/RecoveryCustomer';

export function Customers({ token, statusFilter, onEditcustomer, onDeletecustomer }) {

  const { data, isPending, isError, error } = GetCustomer(token, statusFilter);
  const { mutate: recovercustomer, isPending: isRecovering, isSuccess: isSuccesRecoveryCustomer, data: dataRecoveryCustomer } = RecoveryCustomer(token);

  useEffect(() => {
    if (isError) toast.error(error.message || 'Erreur réseau !');
  }, [isError]);

  const getStatusBadge = (status) => (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'client'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800'
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
    <div className="overflow-hidden border border-gray-200 rounded-xl">

      {/* Conteneur scrollable */}
      <div className="overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {customer.first_name?.[0]}{customer.name?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.first_name} {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.city}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.country}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.category ?? "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(customer.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {statusFilter === "supprime" ? (
                    <button
                      onClick={() => recovercustomer(customer.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Restaurer"
                    >
                      <RotateCcw className="w-5 h-5 text-green-600" />
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
