import { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import { Button } from "../../components/global/Button";
import { InputField, SelectField } from '../../components/global/Input';
import { X, Calculator, Calendar, User, FileText, Printer } from 'lucide-react'
import { GetProduct } from '../../api/get/GetProduct';
import { GetCustomer } from '../../api/get/GetCustomers';
import { useDevisWebSocket } from '../../api/post/useSimulateDevis'
import { AddDevis } from '../../api/post/AddDevis';
import { EditDevis } from '../../api/put/EditDevis';


export function AddEstimateModal({ token, isOpen, onClose, isEditing, devisToEdit }) {
  const { data: dataCustomer } = GetCustomer(token, null);
  const { data: dataProduct } = GetProduct(token, null);
  const { mutate: mutateAddDevis, isPending: isPendingAddDevis, isSuccess: isSuccessAddDevis, data: dataAddDevis, isError: isErrorAddDevis, error: errorAddDevis } = AddDevis(token);
  const { mutate: mutateEditDevis, isPending: isPendingEditDevis, isSuccess: isSuccessEditDevis, data: dataEditDevis, isError: isErrorEditDevis, error: errorEditDevis } = EditDevis(token);

  const emptyForm = {
    id_customer: "",
    id_product: "",
    description_devis: "",
    impression: "recto",
    quantity: 1,
    printing_time: new Date().toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState(emptyForm);
  const pricing = useDevisWebSocket(formData, devisToEdit?.id);

  useEffect(() => {
    if (isOpen) {
      setFormData(isEditing && devisToEdit ? { ...devisToEdit } : emptyForm);
    }
  }, [isOpen, isEditing, devisToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const playLoad = {
        id: devisToEdit.id,
        description_devis: formData.description_devis,
        quantity: formData.quantity,
        impression: formData.impression,
        printing_time: formData.printing_time
      };
      mutateEditDevis({ playLoad });
    } else {
      mutateAddDevis(formData);
    }
  };


  useEffect(() => {
    if (isSuccessAddDevis && dataAddDevis?.message) {
      toast.success(dataAddDevis.message);
      onClose();
    }
    if (isSuccessAddDevis && dataAddDevis?.detail) toast.error(dataAddDevis.detail);
  }, [isSuccessAddDevis]);

  useEffect(() => {
    if (isSuccessEditDevis && dataEditDevis?.message) {
      toast.success(dataEditDevis.message);
      onClose();
    }
    if (isSuccessEditDevis && dataEditDevis?.detail) toast.error(dataEditDevis.detail);
  }, [isSuccessEditDevis]);

  useEffect(() => {
    if (isErrorAddDevis || isErrorEditDevis) {
      toast.error((errorAddDevis || errorEditDevis) || 'Erreur réseau !');
    }
  }, [isErrorAddDevis, isErrorEditDevis, errorAddDevis, errorEditDevis]);

  if (!isOpen) return null;

  const formTitle = isEditing ? "Modifier le devis" : "Nouveau devis";
  const formSubTitle = isEditing ? "Remplissez les informations pour mettre à jour un devis" : "Remplissez les informations pour créer un devis";
  const submitButtonText = isEditing ? "Mettre à jour" : "Ajouter le devis";
  const isLoading = isPendingAddDevis || isPendingEditDevis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="futuristic-card rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-5 rounded-2xl">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between p-6 border-b border-slate-600/50">
          <div>
            <h2 className="text-xl font-bold glow-text">{formTitle}</h2>
            <p className="text-sm text-slate-400">{formSubTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-2xl transition-all duration-300 group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="relative z-10 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Nom du Produit"
              name="id_product"
              value={formData.id_product}
              onChange={handleChange}
              icon={FileText}
              options={[
                { value: "", label: "Sélectionner un produit" },
                ...(dataProduct ?? []).map(p => ({
                  value: p.id,
                  label: p.name
                }))
              ]}
            />
            <SelectField
              label="Client"
              name="id_customer"
              value={formData.id_customer}
              onChange={handleChange}
              icon={User}
              options={[
                { value: "", label: "Sélectionner un client" },
                ...(dataCustomer ?? []).map(c => ({
                  value: c.id,
                  label: `${c.name} ${c.first_name}`
                }))
              ]}
            />

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description_devis"
              rows="2"
              value={formData.description_devis}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-white placeholder-slate-400 resize-none"
              placeholder="Détails techniques..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-600/50">
            <InputField label="Quantité" name="quantity" value={formData.quantity} onChange={handleChange} placeholder=" " type="number" />
            <SelectField
              label="Impression" name="impression" value={formData.impression} onChange={handleChange} icon={Printer}
              options={[{ value: 'recto', label: 'recto' }, { value: 'recto_verso', label: 'recto_verso' }]}
            />
            <InputField label="Date Impression" name="printing_time" value={formData.printing_time} onChange={handleChange} placeholder="Entrez le nom" icon={Calendar} type="date" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="futuristic-card p-4 rounded-2xl">
              <InputField
                label="Prix de Base"
                value={pricing?.prix_base ?? 0}
                disabled
                type="number"
              />
            </div>
            <div className="futuristic-card p-4 rounded-2xl">
              <InputField
                label="Taux appliqué (%)"
                value={pricing?.taux_applique ?? 0}
                disabled
                type="number"
              />
            </div>
            <div className="futuristic-card p-4 rounded-2xl">
              <InputField
                label="Montant TVA"
                value={pricing?.montant_tva ?? 0}
                disabled
                type="number"
              />
            </div>
            <div className="futuristic-card p-4 rounded-2xl">
              <InputField
                label="Prix après Taux"
                value={pricing?.price_taux ?? 0}
                disabled
                type="number"
              />
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm p-4 rounded-2xl border border-indigo-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
                <Calculator className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-sm text-slate-300">
                <p>
                  TVA (19.25%): <span className="font-semibold text-emerald-400">{pricing?.montant_tva?.toFixed(2) ?? "0"} FCFA</span>
                </p>
                <p>
                  Prix unitaire majoré: <span className="font-semibold text-blue-400">{pricing?.price_taux?.toFixed(2) ?? "0"} FCFA</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Montant Total TTC</p>
              <p className="text-3xl font-bold glow-text">
                {pricing?.montant_ttc?.toFixed(2) ?? "0"} <span className="text-sm font-normal text-slate-400">FCFA</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-600/50">
            <Button onClick={onClose} variant="secondary">
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Chargement..." : submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}