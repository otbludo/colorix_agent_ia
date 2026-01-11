import React, { useEffect } from 'react';
import { ProductsActionsDropdown } from './ProductActionsDropdown';
import { toast } from 'react-toastify';
import { ButtonRecovery } from '../global/Button'
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
    <div className="futuristic-card rounded-2xl overflow-hidden">
      {/* Effet de grille en arrière-plan */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <div className="grid-pattern w-full h-full"></div>
      </div>

      <div className="relative z-10 overflow-y-auto max-h-[600px]">
        <table className="w-full">
          <thead className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-600/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Format</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pelliculage</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Grammage</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Quantité</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Créé le</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {data && data.length > 0 ? data.map((product, index) => (
              <tr
                key={product.id}
                className="hover:bg-slate-800/30 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 flex items-center justify-center ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all duration-300">
                      <span className="text-sm font-medium text-white">
                        {product?.name ? product.name[0] + (product.name[1] || '') : '?'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                        {product?.name || 'Nom inconnu'}
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Produit</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {product?.format || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {Array.isArray(product?.peliculage)
                    ? product.peliculage.join(', ')
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {Array.isArray(product?.papier_grammage)
                    ? product.papier_grammage.join(', ')
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {product?.quantity || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white group-hover:text-emerald-300 transition-colors">
                  {product?.front_price ? `${product.front_price} FCFA` : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {product?.created_at ? formatDate(product.created_at) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {statusFilter === "supprime" ? (
                    <ButtonRecovery onClick={() => product?.id && recoverproduct(product.id)} />
                  ) : (
                    <ProductsActionsDropdown
                      onEdit={() => product && onEditproduct && onEditproduct(product)}
                      onDelete={() => product && onDeleteproduct && onDeleteproduct(product)}
                    />
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                      <span className="text-slate-500">📦</span>
                    </div>
                    <span>Aucun produit trouvé</span>
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
