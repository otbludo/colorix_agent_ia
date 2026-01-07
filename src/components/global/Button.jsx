import React from 'react'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseStyles =
    'px-8 py-3 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur-sm border relative overflow-hidden group'
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-400/50 hover:scale-105 border-indigo-400/30',
    secondary:
      'bg-slate-800/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/50 hover:border-indigo-500/50 hover:text-white',
    secondaryred:
      'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-2xl shadow-red-500/30 hover:shadow-red-400/50 hover:scale-105 border-red-400/30',
    tertiary:
      'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-400/50 hover:scale-105 border-purple-400/30',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Effet de shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <span className="relative z-10">{children}</span>
    </button>
  )
}


export function ButtonForm({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  let baseClasses = "flex-1 px-4 py-2 rounded-2xl font-medium transition-all duration-300 text-center backdrop-blur-sm border relative overflow-hidden group";

  const variants = {
    primary: disabled
      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-600/30"
      : "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/30 border-indigo-400/30",
    secondary: disabled
      ? "bg-slate-800/50 text-slate-600 cursor-not-allowed border-slate-700/50"
      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border-slate-600/50 hover:border-indigo-500/50",
    secondaryred: disabled
      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-600/30"
      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/30 border-red-400/30",
    tertiary: disabled
      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed border-slate-600/30"
      : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/30 border-purple-400/30",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* Effet de shimmer pour les boutons actifs */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

