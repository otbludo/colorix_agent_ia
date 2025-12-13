import React from 'react'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const baseStyles =
    'px-8 py-3 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent'
  const variantStyles = {
    primary:
      'bg-[#2ec866] hover:bg-[#29b159] text-white shadow-lg shadow-[#29b159]/30 hover:shadow-xl active:scale-95',
    secondary:
      'bg-white/15 text-white border border-white/30 hover:bg-white/25 active:scale-95',
  }
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}


export function ButtonForm({ children, onClick, type = "button", variant = "primary", disabled = false, className = "" }) {
  let baseClasses = "flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-center";

  const variants = {
    primary: disabled
      ? "bg-blue-400 text-white cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700",
    secondary: disabled
      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

