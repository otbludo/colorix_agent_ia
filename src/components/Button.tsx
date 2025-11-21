import React from 'react'
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}
export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
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
