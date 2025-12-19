
import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { X, Calculator, Calendar, User, FileText, Printer, Check, X as XIcon } from 'lucide-react'
import { ButtonForm } from "../../components/global/Button";
import { ValidateEstimate } from "../../api/put/ValidateEstimate";

export function ShowInfosEstimate({ estimate, isOpen, onClose, token }) {
    const { mutate, isSuccess, isError, error, data } = ValidateEstimate(token);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('fr-FR') : '—'

    const getStatusColor = (status) => (
        status === 'attente'
            ? 'bg-yellow-100 text-yellow-800'
            : status === 'valide'
                ? 'bg-green-100 text-green-800'
                : status === 'rejeter'
                    ? 'bg-red-100 text-red-800'
                    : status === 'revoquer'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-800'
    );

    const handleValidate = (status) => {
        mutate({ id: estimate.id, status });
    }

    useEffect(() => {
        if (isSuccess && data?.message) {
            toast.success(data.message);
            onClose();
        }
        if (isSuccess && data?.detail) toast.error(data.detail);
    }, [isSuccess]);

    useEffect(() => {
        if (isError) {
            toast.error(error || 'Erreur réseau !');
        }
    }, [isError]);

    if (!isOpen || !estimate) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto p-20">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-[#102040]">Détails du devis</h2>
                        <p className="text-sm text-gray-500">Informations complètes du devis</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Produit
                                </label>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                    {estimate.name_product}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Client
                                </label>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                    {estimate.name_customer} {estimate.first_name_customer}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date de création
                                </label>
                                <p className="text-base text-gray-900 mt-1">
                                    {formatDate(estimate.created_at)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Statut</label>
                                <div className="mt-1">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(estimate.status)}`}>
                                        {estimate.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Printer className="w-4 h-4" />
                                    Impression
                                </label>
                                <p className="text-base text-gray-900 mt-1">
                                    {estimate.impression === 'recto' ? 'Recto' : 'Recto-Verso'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Quantité</label>
                                <p className="text-base text-gray-900 mt-1">
                                    {estimate.quantity}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Échéance d'impression</label>
                                <p className="text-base text-gray-900 mt-1">
                                    {formatDate(estimate.printing_time)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-900 whitespace-pre-wrap">
                                {estimate.description ?? estimate.description_devis}
                            </p>
                        </div>
                    </div>

                    {/* Prix détaillé */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Prix de Base</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {estimate.prix_base?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Taux appliqué (%)</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {estimate.taux_applique ?? "0"}%
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Montant TVA</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {estimate.montant_tva?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Prix après Taux</label>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {estimate.price_taux?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                    </div>

                    {/* Montant total */}
                    <div className="bg-blue-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 text-blue-900">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calculator className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-sm">
                                <p>
                                    TVA (19.25%): <span className="font-semibold">{estimate.montant_tva?.toFixed(2) ?? "0"} FCFA</span>
                                </p>
                                <p>
                                    Prix unitaire majoré: <span className="font-semibold">{estimate.price_taux?.toFixed(2) ?? "0"} FCFA</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-600 mb-1">Montant Total TTC</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {estimate.montant_ttc?.toFixed(2) ?? "0"} <span className="text-sm font-normal">FCFA</span>
                            </p>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    {estimate.status === 'attente' && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <ButtonForm
                                onClick={() => handleValidate('rejeter')}
                                variant="secondaryred">
                                Rejeter
                            </ButtonForm>
                            <ButtonForm
                                onClick={() => handleValidate('valide')}
                                type="submit" variant="primary">
                                Valider
                            </ButtonForm>
                        </div>
                    )}
                    {estimate.status === 'valide' && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <ButtonForm
                                onClick={() => handleValidate('revoquer')}
                                variant="tertiery">
                                Revoquer
                            </ButtonForm>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}