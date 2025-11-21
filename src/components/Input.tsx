import React from 'react'
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}
export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-2 text-center">
          {label}
        </label>
      )}
      <input
        className={`w-full px-6 py-3 bg-transparent border-2 border-white rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
