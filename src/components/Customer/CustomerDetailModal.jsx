import React from 'react';
import { X, User, Mail, Phone, Building, MapPin, Tag, Calendar, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { GetDevisFromCustomer } from '../../api/get/GetDevisFromCustomer';
import { GetStatDevisFromCustomer } from '../../api/get/GetStatDevisFromCustomer';

export function CustomerDetailsModal({ isOpen, onClose, token, customer }) {
    if (!isOpen || !customer) return null;

    // Appel du hook : on récupère data, isLoading et isError
    const { data: devisList, isLoading, isError } = GetDevisFromCustomer(token, customer.id);
    const { data: statsData } = GetStatDevisFromCustomer(token, customer.id);


    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const d = new Date(dateString);
        return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'valide': return 'bg-green-100 text-green-700 border-green-200';
            case 'attente': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'rejeter': return 'bg-red-100 text-red-700 border-red-200';
            case 'revoquer': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // Sécurité : Si devisList n'est pas encore chargé, on initialise à vide pour éviter le crash
    const safeDevisList = Array.isArray(devisList) ? devisList : [];

    // Calculs basés sur la liste sécurisée
    const totalDepenses = safeDevisList.reduce((acc, curr) => acc + (curr.montant_ttc || 0), 0);
    const totalValide = safeDevisList.filter(d => d.status === 'valide').length;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-2 bg-white rounded-md shadow-sm">
                <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-sm text-gray-900 font-medium truncate max-w-[150px]">{value || "—"}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                        <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-white">
                            <User className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="mb-2 text-white">
                            <h2 className="text-2xl font-bold">{customer.first_name} {customer.name}</h2>
                            <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-white/30 bg-white/20">
                                {customer.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto pt-16 p-8">
                    {/* Infos Client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <InfoItem icon={Mail} label="Email" value={customer.email} />
                        <InfoItem icon={Phone} label="Téléphone" value={customer.number} />
                        <InfoItem icon={Building} label="Entreprise" value={customer.company} />
                        <InfoItem icon={Tag} label="Catégorie" value={customer.category} />
                        <InfoItem icon={MapPin} label="Ville" value={customer.city} />
                        <InfoItem icon={Calendar} label="Créé le" value={formatDate(customer.created_at)} />
                    </div>

                    {/* Section Dynamique : Loading, Error ou Liste */}
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Historique des devis ({safeDevisList.length})
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-10 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p className="text-sm">Chargement des devis...</p>
                        </div>
                    ) : isError ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100">
                            Erreur lors de la récupération des devis.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {safeDevisList.length > 0 ? (
                                safeDevisList.map((devis) => (
                                    <div key={devis.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg border ${getStatusStyle(devis.status)}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{devis.name_product}</h4>
                                                <p className="text-[11px] text-gray-500">#{devis.id} • {formatDate(devis.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{devis.montant_ttc?.toLocaleString()} FCFA</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusStyle(devis.status)}`}>
                                                {devis.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-xl">Aucun devis trouvé.</p>
                            )}
                        </div>
                    )}

                    {/* Statistiques */}
                    {/* Statistiques calculées dynamiquement */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Aperçu de l'activité</h3>

                        {/* Grille principale */}
                        {/* Grille principale des statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {/* Carte Total Toujours Visible */}
                            <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100 shadow-sm">
                                <p className="text-2xl font-black text-blue-700">
                                    {statsData?.stats?.total_devis || 0}
                                </p>
                                <p className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Total Devis</p>
                            </div>

                            {/* Cartes Dynamiques par Statut */}
                            {statsData?.stats?.by_status && Object.entries(statsData.stats.by_status).map(([status, count]) => {
                                const statusClasses = getStatusStyle(status); // On récupère tes classes

                                return (
                                    <div
                                        key={status}
                                        className={`p-4 rounded-xl text-center border shadow-sm transition-all ${statusClasses}`}
                                    >
                                        <p className="text-2xl font-black italic">
                                            {count}
                                        </p>
                                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                                            {status}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Carte Prix Max */}
                            <div className="p-4 bg-purple-50 rounded-xl text-center border border-purple-100 shadow-sm col-span-2 md:col-span-1">
                                <p className="text-lg font-black text-purple-700 truncate">
                                    {statsData?.stats?.max_prices_by_product && Object.values(statsData.stats.max_prices_by_product).length > 0
                                        ? Math.max(...Object.values(statsData.stats.max_prices_by_product)).toLocaleString()
                                        : 0}
                                </p>
                                <p className="text-[10px] text-purple-600 uppercase font-bold tracking-wider">Max Facturé (FCFA)</p>
                            </div>
                        </div>



                        {/* Top produits (Prix Max) */}
                        <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-black font-bold mb-2 ">Prix max par produit</p>
                            <div className="space-y-2">
                                {statsData?.stats?.max_prices_by_product && Object.entries(statsData.stats.max_prices_by_product).map(([product, price]) => (
                                    <div key={product} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 text-xs">
                                        <span className="text-gray-600 truncate mr-2">{product}</span>
                                        <span className="font-bold text-gray-900 whitespace-nowrap">{price.toLocaleString()} FCFA</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}