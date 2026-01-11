import React from 'react'
import { RotateCcw, Filter } from 'lucide-react'



export function Button({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
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
    quaternary:
      "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50 hover:scale-105 border border-indigo-400/30"
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
      <span className="flex gap-2 items-center relative z-10">{children}</span>
    </button>
  );
}


export function ButtonRecovery({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-full border border-green-400/50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Restaurer"
    >
      <RotateCcw className="w-5 h-5 text-emerald-400 group-hover/btn:text-emerald-300" />
    </button>
  )
}


export function ButtonFilter({
  isActive = false,
  count = 0,
  onClick,
  label = 'Filtrer',
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300 text-sm backdrop-blur-sm
        ${isActive
          ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20'
          : 'border-slate-600/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:border-indigo-500/50'
        }
        ${className}
      `}
    >
      <div className="relative">
        <Filter className="w-4 h-4" />
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </div>

      <span>{label}</span>

      {isActive && count > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {count}
        </span>
      )}
    </button>
  );
}

