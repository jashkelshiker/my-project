import React from 'react';

/**
 * Reusable Card Component
 */
const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'rounded-2xl border bg-white shadow-xl';

  const variantClasses = {
    default: 'border-gray-200',
    glass: 'border-gray-200 bg-white/70 backdrop-blur',
    brand: 'border-brand-200 bg-brand-50',
    slate: 'border-gray-200 bg-gray-50',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
