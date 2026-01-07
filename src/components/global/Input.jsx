import React from 'react'
import { X } from "lucide-react";

export function Input({ label, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-slate-400 mb-2 text-center">
          {label}
        </label>
      )}
      <input
        className={`w-full px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${className}`}
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
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-2xl border backdrop-blur-sm text-white bg-slate-800/50 border-slate-600/50 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 ${disabled ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed' : ''} ${className}`}
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
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-2xl border backdrop-blur-sm text-white bg-slate-800/50 border-slate-600/50 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 appearance-none ${disabled ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed' : ''} ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
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
      {label && <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />}
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-2xl border backdrop-blur-sm text-white bg-slate-800/50 border-slate-600/50 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 appearance-none ${disabled ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed' : ''} ${className}`}
        >
          <option value="" className="bg-slate-800 text-white">Sélectionner un client</option>
          {options?.map(opt => (
            <option key={opt.id} value={opt.id} className="bg-slate-800 text-white">{opt.name}</option>
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
