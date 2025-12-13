import React from 'react'
import { X } from "lucide-react";

export function Input({ label, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[#9fb5d6] mb-2 text-center">
          {label}
        </label>
      )}
      <input
        className={`w-full px-6 py-3 bg-white/5 border border-white/40 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#33c46f] focus:bg-white/10 transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}


export function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  placeholder = "",
  icon: Icon = null,
  className = "",
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 bg-white border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        />
      </div>
    </div>
  );
}


export function SelectField({
  label,
  name,
  value,
  onChange,
  disabled = false,
  options = [],
  icon: Icon = null,
  className = "",
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none bg-white ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}



export function SelectFieldUser({
  label,
  name,
  value,
  onChange,
  disabled = false,
  options,
  icon: Icon = null,
  className = "",
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors appearance-none bg-white ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        >
          <option value="">Sélectionner un client</option>
          {options?.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}


export function SelectMultiField({ label, name, list, selectData, setFormData }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className="mt-2 w-full border rounded-lg p-2"
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;

          setFormData((prev) => ({
            ...prev,
            [name]: prev[name].includes(value)
              ? prev[name]
              : [...prev[name], value],
          }));
        }}
      >
        <option value="">-- Choisir --</option>
        {list.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.isArray(selectData) &&
          selectData.map((p) => (
            <span
              key={p}
              className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded-full"
            >
              {p}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    [name]: prev[name].filter((v) => v !== p),
                  }))
                }
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
      </div>
    </div>
  );
}
