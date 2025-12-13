import React from 'react'

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
