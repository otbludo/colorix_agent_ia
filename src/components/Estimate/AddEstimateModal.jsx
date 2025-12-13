import { useState, useEffect } from 'react'
import { X, Calculator, Calendar, User, FileText, Printer } from 'lucide-react'

export function AddEstimateModal({ isOpen, onClose, onAddQuote }) {
  // Données factices pour les clients (à remplacer par ton appel API)
  const mockClients = [
    { id: 4, name: "Jean Dupont", email: "jean@example.com" },
    { id: 5, name: "Entreprise ABC", email: "contact@abc.com" },
  ];

  // État initial du formulaire basé sur ton JSON
  const initialState = {
    name: '',
    id_customer: '',
    description: '',
    format: 'a4',
    impression: 'recto_verso',
    quantity: 1,
    prix_base: 0,
    taux_applique: 20, // Par défaut selon ton exemple
    tva: 19.25, // Taux Camerounais standard
    printing_time: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialState);
  const [calculations, setCalculations] = useState({
    price_taux: 0,
    montant_tva: 0,
    montant_ttc: 0
  });

  // Calcul automatique des totaux à chaque changement
  useEffect(() => {
    const base = parseFloat(formData.prix_base) || 0;
    const qty = parseInt(formData.quantity) || 1;
    const taux = parseFloat(formData.taux_applique) || 0;
    
    // 1. Calcul du prix avec le taux appliqué (Marge ou Majoration)
    // Exemple: 4000 + 20% = 4800
    const priceWithRate = base * (1 + (taux / 100));
    
    // Total de base pour la quantité
    const totalWithRate = priceWithRate * qty;

    // 2. Calcul TVA
    // Exemple: 4800 * 19.25% = 924
    const tvaAmount = totalWithRate * (formData.tva / 100);

    // 3. Montant TTC
    const ttc = totalWithRate + tvaAmount;

    setCalculations({
      price_taux: priceWithRate.toFixed(2), // Prix unitaire majoré
      montant_tva: tvaAmount.toFixed(2),
      montant_ttc: ttc.toFixed(2)
    });
  }, [formData.prix_base, formData.quantity, formData.taux_applique, formData.tva]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construction de l'objet final selon ton format JSON
    const payload = {
      ...formData,
      id_customer: parseInt(formData.id_customer),
      price_taux: parseFloat(calculations.price_taux),
      montant_ttc: parseFloat(calculations.montant_ttc),
      montant_tva: parseFloat(calculations.montant_tva),
      // id_admin: 1 // À ajouter si tu le récupères du contexte auth
    };

    onAddQuote(payload);
    onClose();
    setFormData(initialState); // Reset form
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#102040]">Nouveau Devis</h2>
            <p className="text-sm text-gray-500">Remplissez les informations pour créer un devis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Section 1: Infos Générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Nom du Produit
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Impression Flyers A4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Client
              </label>
              <select
                name="id_customer"
                required
                value={formData.id_customer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Sélectionner un client</option>
                {mockClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Détails techniques..."
            />
          </div>

          {/* Section 2: Détails Techniques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Printer className="w-4 h-4" /> Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="a5">A5</option>
                <option value="a4">A4</option>
                <option value="a3">A3</option>
                <option value="grand_format">Grand Format</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Impression</label>
              <select
                name="impression"
                value={formData.impression}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="recto">Recto</option>
                <option value="recto_verso">Recto / Verso</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date Impression
              </label>
              <input
                type="date"
                name="printing_time"
                value={formData.printing_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
              />
            </div>
          </div>

          {/* Section 3: Prix & Calculs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prix de Base</label>
              <div className="relative">
                <input
                  type="number"
                  name="prix_base"
                  min="0"
                  value={formData.prix_base}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-gray-400 text-sm">FCFA</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Taux Appliqué (%)</label>
              <input
                type="number"
                name="taux_applique"
                value={formData.taux_applique}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantité</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">TVA (%)</label>
              <input
                type="number"
                name="tva"
                readOnly
                value={formData.tva}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Résumé des calculs */}
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-blue-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <p>TVA (19.25%): <span className="font-semibold">{calculations.montant_tva} FCFA</span></p>
                <p>Prix unitaire majoré: {calculations.price_taux} FCFA</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 mb-1">Montant Total TTC</p>
              <p className="text-2xl font-bold text-blue-900">{calculations.montant_ttc} <span className="text-sm font-normal">FCFA</span></p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-600/20 transition-all transform active:scale-95"
            >
              Créer le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}