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
            case 'valide': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'attente': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'rejeter': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'revoquer': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    // Sécurité : Si devisList n'est pas encore chargé, on initialise à vide pour éviter le crash
    const safeDevisList = Array.isArray(devisList) ? devisList : [];

    // Calculs basés sur la liste sécurisée
    const totalDepenses = safeDevisList.reduce((acc, curr) => acc + (curr.montant_ttc || 0), 0);
    const totalValide = safeDevisList.filter(d => d.status === 'valide').length;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
            <div className="p-2 bg-indigo-500/20 rounded-xl shadow-lg group-hover:bg-indigo-500/30 transition-colors duration-300">
                <Icon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-sm text-white font-medium truncate max-w-[150px]">{value || "—"}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="futuristic-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Effet de grille en arrière-plan */}
                <div className="absolute inset-0 opacity-5 rounded-2xl">
                    <div className="grid-pattern w-full h-full"></div>
                </div>

                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/70 rounded-2xl text-slate-300 hover:text-white transition-all duration-300">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                        <div className="p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-slate-600/50">
                            <User className="w-12 h-12 text-indigo-400" />
                        </div>
                        <div className="mb-2 text-white">
                            <h2 className="text-2xl font-bold glow-text">{customer.first_name} {customer.name}</h2>
                            <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full border border-slate-400/50 bg-slate-700/50 backdrop-blur-sm">
                                {customer.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 overflow-y-auto pt-16 p-8">
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
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        Historique des devis ({safeDevisList.length})
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-10 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-400" />
                            <p className="text-sm">Chargement des devis...</p>
                        </div>
                    ) : isError ? (
                        <div className="p-4 bg-red-500/20 text-red-300 rounded-2xl text-center text-sm border border-red-500/30 backdrop-blur-sm">
                            Erreur lors de la récupération des devis.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {safeDevisList.length > 0 ? (
                                safeDevisList.map((devis) => (
                                    <div key={devis.id} className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all duration-300 shadow-lg group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg border backdrop-blur-sm ${getStatusStyle(devis.status)}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 truncate max-w-[200px] transition-colors">{devis.name_product}</h4>
                                                <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors">#{devis.id} • {formatDate(devis.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{devis.montant_ttc?.toLocaleString()} FCFA</p>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border backdrop-blur-sm ${getStatusStyle(devis.status)}`}>
                                                {devis.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-600/50 rounded-2xl bg-slate-800/30">Aucun devis trouvé.</p>
                            )}
                        </div>
                    )}

                    {/* Statistiques */}
                    {/* Statistiques calculées dynamiquement */}
                    <div className="mt-8 border-t border-slate-600/50 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            Aperçu de l'activité
                        </h3>

                        {/* Grille principale */}
                        {/* Grille principale des statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {/* Carte Total Toujours Visible */}
                            <div className="futuristic-card p-4 rounded-2xl text-center group hover:scale-[1.02] transition-all duration-500">
                                <p className="text-3xl font-black text-white group-hover:text-indigo-300 transition-colors">
                                    {statsData?.stats?.total_devis || 0}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover:text-slate-300 transition-colors">Total Devis</p>
                            </div>

                            {/* Cartes Dynamiques par Statut */}
                            {statsData?.stats?.by_status && Object.entries(statsData.stats.by_status).map(([status, count]) => {
                                const statusClasses = getStatusStyle(status); // On récupère tes classes

                                return (
                                    <div
                                        key={status}
                                        className={`futuristic-card p-4 rounded-2xl text-center group hover:scale-[1.02] transition-all duration-500 ${statusClasses}`}
                                    >
                                        <p className="text-3xl font-black italic text-white group-hover:text-indigo-300 transition-colors">
                                            {count}
                                        </p>
                                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 text-white">
                                            {status}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Carte Prix Max */}
                            <div className="futuristic-card p-4 rounded-2xl text-center col-span-2 md:col-span-1 group hover:scale-[1.02] transition-all duration-500">
                                <p className="text-2xl font-black text-white group-hover:text-purple-300 truncate transition-colors">
                                    {statsData?.stats?.max_prices_by_product && Object.values(statsData.stats.max_prices_by_product).length > 0
                                        ? Math.max(...Object.values(statsData.stats.max_prices_by_product)).toLocaleString()
                                        : 0}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider group-hover:text-slate-300 transition-colors">Max Facturé (FCFA)</p>
                            </div>
                        </div>



                        {/* Top produits (Prix Max) */}
                        <div className="mt-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-600/50">
                            <p className="text-sm text-white font-bold mb-2 flex items-center gap-2">
                                <div className="p-1 bg-purple-500/20 rounded">
                                    <Tag className="w-4 h-4 text-purple-400" />
                                </div>
                                Prix max par produit
                            </p>
                            <div className="space-y-2">
                                {statsData?.stats?.max_prices_by_product && Object.entries(statsData.stats.max_prices_by_product).map(([product, price]) => (
                                    <div key={product} className="flex justify-between items-center bg-slate-700/50 backdrop-blur-sm p-3 rounded-xl border border-slate-600/30 text-xs hover:bg-slate-600/50 transition-all duration-300">
                                        <span className="text-slate-300 truncate mr-2">{product}</span>
                                        <span className="font-bold text-white whitespace-nowrap">{price.toLocaleString()} FCFA</span>
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