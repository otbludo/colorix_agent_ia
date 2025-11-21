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
    'px-8 py-3 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900'
  const variantStyles = {
    primary:
      'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
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
