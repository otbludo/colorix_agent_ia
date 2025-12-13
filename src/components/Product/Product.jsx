import React, { useEffect } from 'react';
import { ProductsActionsDropdown } from './ProductActionsDropdown';
import { RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetProduct } from '../../api/get/GetProduct';
import { RecoveryProduct } from '../../api/post/RecoveryProduct';

export function Products({ token, statusFilter, onEditproduct, onDeleteproduct }) {

  const { data, isPending, isError, error } = GetProduct(token, statusFilter);
  const { mutate: recoverproduct, isPending: isRecovering, isSuccess: isSuccesRecoveryProduct, data: dataRecoveryProduct } = RecoveryProduct(token);

  useEffect(() => {
    if (isError) toast.error(error.message || 'Erreur réseau !');
  }, [isError]);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR");
  };

  useEffect(() => {
    if (isSuccesRecoveryProduct && dataRecoveryProduct?.message) toast.success(dataRecoveryProduct.message);
    if (isSuccesRecoveryProduct && dataRecoveryProduct?.detail) toast.error(dataRecoveryProduct.detail);
  }, [isSuccesRecoveryProduct]);

  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <div className="overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelliculage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grammage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {product.first_name?.[0]}{product.name?.[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.first_name} {product.name}
                      </div>
                      <div className="text-sm text-gray-500">{product.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.format}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {Array.isArray(product.peliculage)
                    ? product.peliculage.join(', ')
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {Array.isArray(product.papier_grammage)
                    ? product.papier_grammage.join(', ')
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.front_price} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(product.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {statusFilter === "supprime" ? (
                    <button
                      onClick={() => recoverproduct(product.id)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      title="Restaurer"
                    >
                      <RotateCcw className="w-5 h-5 text-green-600" />
                    </button>
                  ) : (
                    <ProductsActionsDropdown
                      onEdit={() => onEditproduct(product)}
                      onDelete={() => onDeleteproduct(product)}
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
