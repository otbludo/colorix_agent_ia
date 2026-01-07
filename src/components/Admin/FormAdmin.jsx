import { useState, useEffect } from 'react';
import { AddAdmin } from '../../api/post/AddAdmin';
import { EditAdmin } from '../../api/put/EditAddmin';
import { X, User, Mail, Lock, Shield, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { InputField, SelectField } from '../../components/global/Input';
import { ButtonForm } from '../../components/global/Button';

export function FormAdmins({ isOpen, onClose, adminToEdit = null, isEditing = false }) {
  const token = localStorage.getItem('colorix_token');
  const { mutate: mutateAdd, isPending: isPendingAdd, isSuccess: isSuccessAdd, data: dataAdd, isError: isErrorAdd, error: errorAdd } = AddAdmin(token);
  const { mutate: mutateEdit, isPending: isPendingEdit, isSuccess: isSuccessEdit, data: dataEdit, isError: isErrorEdit, error: errorEdit } = EditAdmin(token);

  const emptyForm = {
    name: "",
    first_name: "",
    number: "",
    email: "",
    post: "",
    role: "admin",
    status: "actif",
    password: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setFormData(isEditing && adminToEdit ? { ...adminToEdit, password: "" } : emptyForm);
    }
  }, [isOpen, isEditing, adminToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      mutateEdit({ id: adminToEdit.id, status: formData.status });
    } else {
      mutateAdd(formData);
    }
  };

  useEffect(() => {
    if (isSuccessAdd && dataAdd?.message) toast.success(dataAdd.message);
    if (isSuccessAdd && dataAdd?.detail) toast.error(dataAdd.detail);
  }, [isSuccessAdd]);

  useEffect(() => {
    if (isSuccessEdit && dataEdit?.message) toast.success(dataEdit.message);
    if (isSuccessEdit && dataEdit?.detail) toast.error(dataEdit.detail);
  }, [isSuccessEdit]);

  useEffect(() => {
    if (isErrorAdd || isErrorEdit) toast.error((errorAdd || errorEdit) || 'Erreur réseau !');
  }, [isErrorAdd, isErrorEdit, errorAdd, errorEdit]);

  const handleClose = () => onClose();
  if (!isOpen) return null;

  const formTitle = isEditing ? "Modifier le statut de l'utilisateur" : "Ajouter un utilisateur";
  const submitButtonText = isEditing ? "Mettre à jour" : "Ajouter l'utilisateur";
  const isLoading = isPendingAdd || isPendingEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose} />
      <div className="relative futuristic-card rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
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
          <InputField label="Nom complet" name="name" value={formData.name} onChange={handleChange} disabled={isEditing} placeholder="Entrez le nom" icon={User} />
          <InputField label="Prénom" name="first_name" value={formData.first_name} onChange={handleChange} disabled={isEditing} placeholder="Entrez le prénom" icon={User} />
          <InputField label="Numéro" name="number" value={formData.number} onChange={handleChange} disabled={isEditing} placeholder="690200000" icon={Phone} type="number" />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} disabled={isEditing} placeholder="utilisateur@email.com" icon={Mail} type="email" />
          {!isEditing && <InputField label="Mot de passe" name="password" value={formData.password} onChange={handleChange} placeholder="Mot de passe" icon={Lock} type="password" />}
          <SelectField
            label="Post" name="post" value={formData.post} onChange={handleChange} disabled={isEditing} icon={Shield}
            options={[{ value: 'admin', label: 'Manager' }, { value: 'superadmin', label: 'Contable' }]}
          />
          <SelectField
            label="Rôle" name="role" value={formData.role} onChange={handleChange} disabled={isEditing} icon={Shield}
            options={[{ value: 'admin', label: 'Admin' }, { value: 'superadmin', label: 'Superadmin' }]}
          />
          <SelectField
            label="Statut" name="status" value={formData.status} onChange={handleChange}
            options={[{ value: 'actif', label: 'Actif' }, { value: 'inactif', label: 'Inactif' }]}
          />
          <div className="flex gap-3 mt-6">
            <ButtonForm onClick={handleClose} variant="secondary">Annuler</ButtonForm>
            <ButtonForm type="submit" disabled={isLoading} variant="primary">{isLoading ? 'Chargement...' : submitButtonText}</ButtonForm>
          </div>
        </form>
      </div>
    </div>
  );
}
