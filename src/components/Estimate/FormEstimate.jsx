import { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import { ButtonForm } from "../../components/global/Button";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#102040]">{formTitle}</h2>
            <p className="text-sm text-gray-500">{formSubTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description_devis"
              rows="2"
              value={formData.description_devis}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Détails techniques..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
            <InputField label="Quantité" name="quantity" value={formData.quantity} onChange={handleChange} placeholder=" " type="number" />
            <SelectField
              label="Impression" name="impression" value={formData.impression} onChange={handleChange} icon={Printer}
              options={[{ value: 'recto', label: 'recto' }, { value: 'recto_verso', label: 'recto_verso' }]}
            />
            <InputField label="Date Impression" name="printing_time" value={formData.printing_time} onChange={handleChange} placeholder="Entrez le nom" icon={Calendar} type="date" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <InputField
              label="Prix de Base"
              value={pricing?.prix_base ?? 0}
              disabled
              type="number"
            />
            <InputField
              label="Taux appliqué (%)"
              value={pricing?.taux_applique ?? 0}
              disabled
              type="number"
            />
            <InputField
              label="Montant TVA"
              value={pricing?.montant_tva ?? 0}
              disabled
              type="number"
            />
            <InputField
              label="Prix après Taux"
              value={pricing?.price_taux ?? 0}
              disabled
              type="number"
            />
          </div>
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-blue-900">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <p>
                  TVA (19.25%): <span className="font-semibold">{pricing?.montant_tva?.toFixed(2) ?? "0"} FCFA</span>
                </p>
                <p>
                  Prix unitaire majoré: <span className="font-semibold">{pricing?.price_taux?.toFixed(2) ?? "0"} FCFA</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600 mb-1">Montant Total TTC</p>
              <p className="text-2xl font-bold text-blue-900">
                {pricing?.montant_ttc?.toFixed(2) ?? "0"} <span className="text-sm font-normal">FCFA</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <ButtonForm onClick={onClose} variant="secondary">
              Annuler
            </ButtonForm>
            <ButtonForm type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Chargement..." : submitButtonText}
            </ButtonForm>
          </div>
        </form>
      </div>
    </div>
  )
}