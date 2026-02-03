import React from 'react';

/**
 * Reusable Button Component
 */
const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700 focus:ring-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200/50',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100/70',
    danger: 'bg-red-600 text-white shadow-soft hover:bg-red-700 focus:ring-red-500/20',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
