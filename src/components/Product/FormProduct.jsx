import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { AddProduct } from "../../api/post/AddProduct";
import { EditProduct } from "../../api/put/EditProduct";
import { InputField, SelectField } from "../../components/global/Input";
import { ButtonForm } from "../../components/global/Button";

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

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add / Edit submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) mutateEdit(formData);
    else mutateAdd(formData);
  };

  // Add success
  useEffect(() => {
    if (isSuccessAdd && dataAdd?.message) {
      toast.success(dataAdd.message);
      onClose();
    }
    if (isSuccessAdd && dataAdd?.detail) toast.error(dataAdd.detail);
  }, [isSuccessAdd]);

  // Edit success
  useEffect(() => {
    if (isSuccessEdit && dataEdit?.message) {
      toast.success(dataEdit.message);
      onClose();
    }
    if (isSuccessEdit && dataEdit?.detail) toast.error(dataEdit.detail);
  }, [isSuccessEdit]);

  // Errors
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
      <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{formTitle}</h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
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

          {/* Peliculage */}
          <div>
            <label className="text-sm font-medium text-gray-700">Peliculage</label>
            <select
              className="mt-2 w-full border rounded-lg p-2"
              onChange={(e) => {
                const value = e.target.value;
                if (value && !formData.peliculage.includes(value)) {
                  setFormData((prev) => ({ ...prev, peliculage: [...prev.peliculage, value] }));
                }
              }}
            >
              <option value="">-- Choisir --</option>
              {["sans", "Mat recto", "Mat verso"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {(Array.isArray(formData.peliculage) ? formData.peliculage : []).map((p) => (
                <span key={p} className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full">
                  {p}
                  <button type="button" onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      peliculage: prev.peliculage.filter((v) => v !== p),
                    }))
                  }>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Papier & Grammage */}
          <div>
            <label className="text-sm font-medium text-gray-700">Papier & Grammage</label>
            <select
              className="mt-2 w-full border rounded-lg p-2"
              onChange={(e) => {
                const value = e.target.value;
                if (value && !formData.papier_grammage.includes(value)) {
                  setFormData((prev) => ({ ...prev, papier_grammage: [...prev.papier_grammage, value] }));
                }
              }}
            >
              <option value="">-- Choisir --</option>
              {[
                "Couche brillant 170",
                "Couche Mat 170g",
                "Couche Brillant 200g",
                "Couche Brillant 250g",
                "Couche Mat 250g",
                "Couche Brillant 300g",
              ].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {(Array.isArray(formData.papier_grammage) ? formData.papier_grammage : []).map((g) => (
                <span key={g} className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full">
                  {g}
                  <button type="button" onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      papier_grammage: prev.papier_grammage.filter((v) => v !== g),
                    }))
                  }>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Finition */}
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

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <ButtonForm onClick={handleClose} variant="secondary">Annuler</ButtonForm>
            <ButtonForm type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Chargement..." : submitButtonText}
            </ButtonForm>
          </div>
        </form>
      </div>
    </div>
  );
}
