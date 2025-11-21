import React from 'react'
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}
export function Input({ label, className = '', ...props }: InputProps) {
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
