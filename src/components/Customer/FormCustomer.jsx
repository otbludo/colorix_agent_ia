import { useState, useEffect } from "react";
import { AddCustomer } from "../../api/post/AddCustomers";
import { EditCustomer } from "../../api/put/EditCustomer";
import { X, User, Mail, Building, Globe, Phone, Tag } from "lucide-react";
import { toast } from "react-toastify";
import { InputField, SelectField } from "../../components/global/Input";
import { ButtonForm } from "../../components/global/Button";

export function FormCustomer({
  isOpen,
  onClose,
  customerToEdit = null,
  isEditing = false,
}) {
  const token = localStorage.getItem("colorix_token");

  const {
    mutate: mutateAdd,
    isPending: isPendingAdd,
    isSuccess: isSuccessAdd,
    data: dataAdd,
    isError: isErrorAdd,
    error: errorAdd,
  } = AddCustomer(token);

  const {
    mutate: mutateEdit,
    isPending: isPendingEdit,
    isSuccess: isSuccessEdit,
    data: dataEdit,
    isError: isErrorEdit,
    error: errorEdit,
  } = EditCustomer(token);

  const emptyForm = {
    id: "",
    name: "",
    first_name: "",
    email: "",
    number: "",
    company: "",
    city: "",
    country: "",
    category: "",
    status: "potentiel",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setFormData(isEditing && customerToEdit ? { ...customerToEdit } : emptyForm);
    }
  }, [isOpen, isEditing, customerToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      mutateEdit(formData);
    } else {
      mutateAdd(formData);
    }
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

  const formTitle = isEditing ? "Modifier le client" : "Ajouter un client";
  const submitButtonText = isEditing ? "Mettre à jour" : "Ajouter le client";
  const isLoading = isPendingAdd || isPendingEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-opacity-10 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{formTitle}</h3>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nom"
            icon={User}
          />
          <InputField
            label="Prénom"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Prénom"
            icon={User}
          />
          <InputField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="client@email.com"
            icon={Mail}
            type="email"
          />
          <InputField
            label="Numéro"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="690200000"
            icon={Phone}
          />
          <InputField
            label="Entreprise"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nom de l'entreprise"
            icon={Building}
          />
          <InputField
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ville"
            icon={Globe}
          />
          <InputField
            label="Pays"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Pays"
            icon={Globe}
          />

          <SelectField
            label="Catégorie"
            name="category"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "particulier", label: "Prticulier" },
              { value: "entreprise", label: "Entreprise" },
              { value: "ONG", label: "ONG" },
              { value: "etat", label: "Etat" },
            ]}
          />

          <SelectField
            label="Statut"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "potentiel", label: "Potentiel" },
              { value: "client", label: "Client" },
            ]}
          />

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <ButtonForm onClick={handleClose} variant="secondary">
              Annuler
            </ButtonForm>

            <ButtonForm type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Chargement..." : submitButtonText}
            </ButtonForm>
          </div>
        </form>
      </div>
    </div>
  );
}
