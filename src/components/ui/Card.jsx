import React from 'react';

/**
 * Reusable Card Component
 */
const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'rounded-2xl border bg-white shadow-soft';
  
  const variantClasses = {
    default: 'border-slate-200/80',
    glass: 'border-white/25 bg-white/70 backdrop-blur',
    brand: 'border-brand-200 bg-brand-50',
    slate: 'border-slate-200 bg-slate-50',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
