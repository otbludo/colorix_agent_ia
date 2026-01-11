import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { AddProduct } from "../../api/post/AddProduct";
import { EditProduct } from "../../api/put/EditProduct";
import { InputField, SelectField, SelectMultiField } from "../../components/global/Input";
import { Button } from "../../components/global/Button";

export function FormProduct({ isOpen, onClose, productToEdit = null, isEditing = false }) {
  const token = localStorage.getItem("colorix_token");
  const { mutate: mutateAdd, isPending: isPendingAdd, isSuccess: isSuccessAdd, data: dataAdd, isError: isErrorAdd, error: errorAdd } = AddProduct(token);
  const { mutate: mutateEdit, isPending: isPendingEdit, isSuccess: isSuccessEdit, data: dataEdit, isError: isErrorEdit, error: errorEdit } = EditProduct(token);

  const emptyForm = {
    id: "",
    name: "",
    description: "",
    format: "",
    color: "",
    category: "",
    quantity: 1,
    front_price: "",
    front_back_price: "",
    peliculage: [],
    papier_grammage: [],
    finition: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // Populate form on open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...emptyForm,
        ...(isEditing && productToEdit
          ? {
            ...productToEdit,
            peliculage: Array.isArray(productToEdit.peliculage) ? productToEdit.peliculage : [],
            papier_grammage: Array.isArray(productToEdit.papier_grammage) ? productToEdit.papier_grammage : [],
            finition: productToEdit.finition || "",
          }
          : {}),
      });
    }
  }, [isOpen, isEditing, productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) mutateEdit(formData);
    else mutateAdd(formData);
  };

  useEffect(() => {
    if (isSuccessAdd && dataAdd?.message) {
      toast.success(dataAdd.message);
      onClose();
    }
    if (isSuccessAdd && dataAdd?.detail) toast.error(dataAdd.detail);
  }, [isSuccessAdd]);

  useEffect(() => {
    if (isSuccessEdit && dataEdit?.message) {
      toast.success(dataEdit.message);
      onClose();
    }
    if (isSuccessEdit && dataEdit?.detail) toast.error(dataEdit.detail);
  }, [isSuccessEdit]);

  useEffect(() => {
    if (isErrorAdd || isErrorEdit)
      toast.error((errorAdd || errorEdit) || "Erreur réseau !");
  }, [isErrorAdd, isErrorEdit, errorAdd, errorEdit]);

  const handleClose = () => onClose();

  if (!isOpen) return null;

  const formTitle = isEditing ? "Modifier le produit" : "Ajouter un produit";
  const submitButtonText = isEditing ? "Mettre à jour" : "Ajouter";
  const isLoading = isPendingAdd || isPendingEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose} />
      <div className="relative futuristic-card rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Effet de grille en arrière-plan */}
        <div className="absolute inset-0 opacity-5 rounded-2xl">
          <div className="grid-pattern w-full h-full"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold glow-text">{formTitle}</h3>
          <button onClick={handleClose} className="p-2 rounded-2xl hover:bg-slate-700/50 transition-all duration-300 group">
            <X className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Nom du produit" name="name" value={formData.name} onChange={handleChange} placeholder="Nom" />
          <InputField label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <InputField label="Format" name="format" value={formData.format} onChange={handleChange} placeholder="Ex : A4, A3..." />
          <InputField label="Couleur" name="color" value={formData.color} onChange={handleChange} placeholder="Ex : Quadri" />
          <SelectField
            label="Catégorie"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={[
              { value: "", label: "Non défini" },
              { value: "impression", label: "Impression" },
              { value: "flyers", label: "Flyers" },
              { value: "affiches", label: "Affiches" },
              { value: "brochures", label: "Brochures" },
              { value: "cartes_visite", label: "Cartes de visite" },
            ]}
          />
          <InputField label="Quantité" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />
          <InputField label="Prix Recto" name="front_price" type="number" value={formData.front_price} onChange={handleChange} />
          <InputField label="Prix Recto/Verso" name="front_back_price" type="number" value={formData.front_back_price} onChange={handleChange} />
          <SelectMultiField
            label="Pellicule"
            name="peliculage"
            list={["sans", "Mat recto", "Mat verso"]}
            selectData={formData.peliculage}
            setFormData={setFormData}
          />
          <SelectMultiField
            label="Papier & Grammage"
            name="papier_grammage"
            list={[
              "Couche brillant 170",
              "Couche Mat 170g",
              "Couche Brillant 200g",
              "Couche Brillant 250g",
              "Couche Mat 250g",
              "Couche Brillant 300g",
            ]}
            selectData={formData.papier_grammage}
            setFormData={setFormData}
          />
          <SelectField
            label="Finition (optionnel)"
            name="finition"
            value={formData.finition || ""}
            onChange={handleChange}
            options={[
              { value: "", label: "Aucune" },
              { value: "Vernis sélectif", label: "Vernis sélectif" },
              { value: "Relief", label: "Relief" },
              { value: "Dorure", label: "Dorure" },
              { value: "Plastification", label: "Plastification" },
            ]}
          />
          <div className="flex gap-3 mt-6">
            <Button onClick={handleClose} variant="secondary">Annuler</Button>
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Chargement..." : submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
