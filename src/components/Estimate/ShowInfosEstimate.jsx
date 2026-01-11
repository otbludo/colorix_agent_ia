
import React, { useEffect } from "react";
import { toast } from 'react-toastify';
import { X, Calculator, Calendar, User, FileText, Printer, Check, X as XIcon } from 'lucide-react'
import { Button } from "../../components/global/Button";
import { ValidateEstimate } from "../../api/put/ValidateEstimate";

export function ShowInfosEstimate({ estimate, isOpen, onClose, token }) {
    const { mutate, isSuccess, isError, error, data } = ValidateEstimate(token);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('fr-FR') : '—'

    const getStatusColor = (status) => (
        status === 'attente'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            : status === 'valide'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : status === 'rejeter'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : status === 'revoquer'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto p-20">
            <div className="futuristic-card rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Effet de grille en arrière-plan */}
                <div className="absolute inset-0 opacity-5 rounded-2xl">
                    <div className="grid-pattern w-full h-full"></div>
                </div>
                <div className="relative z-10 flex items-center justify-between p-6 border-b border-slate-600/50">
                    <div>
                        <h2 className="text-xl font-bold glow-text">Détails du devis</h2>
                        <p className="text-sm text-slate-400">Informations complètes du devis</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-2xl transition-all duration-300 group">
                        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                    </button>
                </div>

                <div className="relative z-10 p-6 space-y-6">
                    {/* Informations principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <div className="p-1 bg-indigo-500/20 rounded">
                                        <FileText className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    Produit
                                </label>
                                <p className="text-lg font-semibold text-white mt-1">
                                    {estimate.name_product}
                                </p>
                            </div>

                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <div className="p-1 bg-blue-500/20 rounded">
                                        <User className="w-4 h-4 text-blue-400" />
                                    </div>
                                    Client
                                </label>
                                <p className="text-lg font-semibold text-white mt-1">
                                    {estimate.name_customer} {estimate.first_name_customer}
                                </p>
                            </div>

                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <div className="p-1 bg-green-500/20 rounded">
                                        <Calendar className="w-4 h-4 text-green-400" />
                                    </div>
                                    Date de création
                                </label>
                                <p className="text-base text-slate-300 mt-1">
                                    {formatDate(estimate.created_at)}
                                </p>
                            </div>

                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300">Statut</label>
                                <div className="mt-1">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full backdrop-blur-sm ${getStatusColor(estimate.status)}`}>
                                        {estimate.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <div className="p-1 bg-purple-500/20 rounded">
                                        <Printer className="w-4 h-4 text-purple-400" />
                                    </div>
                                    Impression
                                </label>
                                <p className="text-base text-white mt-1">
                                    {estimate.impression === 'recto' ? 'Recto' : 'Recto-Verso'}
                                </p>
                            </div>

                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300">Quantité</label>
                                <p className="text-base text-white mt-1">
                                    {estimate.quantity}
                                </p>
                            </div>

                            <div className="futuristic-card p-4 rounded-2xl">
                                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                    <div className="p-1 bg-amber-500/20 rounded">
                                        <Calendar className="w-4 h-4 text-amber-400" />
                                    </div>
                                    Échéance d'impression
                                </label>
                                <p className="text-base text-slate-300 mt-1">
                                    {formatDate(estimate.printing_time)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description</label>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-600/50">
                            <p className="text-slate-300 whitespace-pre-wrap">
                                {estimate.description ?? estimate.description_devis}
                            </p>
                        </div>
                    </div>

                    {/* Prix détaillé */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-600/50">
                        <div className="futuristic-card p-4 rounded-2xl">
                            <label className="text-sm font-medium text-slate-300">Prix de Base</label>
                            <p className="text-lg font-semibold text-emerald-400 mt-1">
                                {estimate.prix_base?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                        <div className="futuristic-card p-4 rounded-2xl">
                            <label className="text-sm font-medium text-slate-300">Taux appliqué (%)</label>
                            <p className="text-lg font-semibold text-blue-400 mt-1">
                                {estimate.taux_applique ?? "0"}%
                            </p>
                        </div>
                        <div className="futuristic-card p-4 rounded-2xl">
                            <label className="text-sm font-medium text-slate-300">Montant TVA</label>
                            <p className="text-lg font-semibold text-purple-400 mt-1">
                                {estimate.montant_tva?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                        <div className="futuristic-card p-4 rounded-2xl">
                            <label className="text-sm font-medium text-slate-300">Prix après Taux</label>
                            <p className="text-lg font-semibold text-amber-400 mt-1">
                                {estimate.price_taux?.toFixed(2) ?? "0"} FCFA
                            </p>
                        </div>
                    </div>

                    {/* Montant total */}
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm p-4 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 text-white">
                            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                                <Calculator className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="text-sm text-slate-300">
                                <p>
                                    TVA (19.25%): <span className="font-semibold text-emerald-400">{estimate.montant_tva?.toFixed(2) ?? "0"} FCFA</span>
                                </p>
                                <p>
                                    Prix unitaire majoré: <span className="font-semibold text-blue-400">{estimate.price_taux?.toFixed(2) ?? "0"} FCFA</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 mb-1">Montant Total TTC</p>
                            <p className="text-3xl font-bold glow-text">
                                {estimate.montant_ttc?.toFixed(2) ?? "0"} <span className="text-sm font-normal text-slate-400">FCFA</span>
                            </p>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    {estimate.status === 'attente' && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-600/50">
                            <Button
                                onClick={() => handleValidate('rejeter')}
                                variant="secondaryred">
                                Rejeter
                            </Button>
                            <Button
                                onClick={() => handleValidate('valide')}
                                type="submit" variant="primary">
                                Valider
                            </Button>
                        </div>
                    )}
                    {estimate.status === 'valide' && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-600/50">
                            <Button
                                onClick={() => handleValidate('revoquer')}
                                variant="tertiary">
                                Revoquer
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}