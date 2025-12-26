import React from 'react';
import { X, User, Mail, Phone, Building, Globe, MapPin, Tag, Calendar, ShieldCheck } from 'lucide-react';

export function CustomerDetailsModal({ isOpen, onClose, customer }) {
  if (!isOpen || !customer) return null;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR") + " " + d.toLocaleTimeString("fr-FR");
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="p-2 bg-white rounded-md shadow-sm">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{label}</p>
        <p className="text-sm text-gray-900 font-medium">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-8 flex items-end gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-white">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">{customer.first_name} {customer.name}</h2>
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border-2 ${
                customer.status === 'client' ? 'bg-green-500/20 text-green-100 border-green-400' : 'bg-yellow-500/20 text-yellow-100 border-yellow-400'
              }`}>
                {customer.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Mail} label="Email" value={customer.email} />
            <InfoItem icon={Phone} label="Téléphone" value={customer.number} />
            <InfoItem icon={Building} label="Entreprise" value={customer.company} />
            <InfoItem icon={Tag} label="Catégorie" value={customer.category} />
            <InfoItem icon={MapPin} label="Ville" value={customer.city} />
            <InfoItem icon={Globe} label="Pays" value={customer.country} />
            <InfoItem icon={Calendar} label="Créé le" value={formatDate(customer.created_at)} />
            <InfoItem icon={ShieldCheck} label="ID Client" value={`#${customer.id}`} />
          </div>

          {/* Statistiques en fin de widget */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              Aperçu de l'activité
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">0</p>
                <p className="text-[10px] text-blue-600 uppercase font-bold">Devis</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-700">0</p>
                <p className="text-[10px] text-green-600 uppercase font-bold">Commandes</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-700">0 FCFA</p>
                <p className="text-[10px] text-purple-600 uppercase font-bold">Dépenses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}