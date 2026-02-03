import React from 'react';

/**
 * Reusable Alert Component
 */
const Alert = ({ children, variant = 'info', className = '', ...props }) => {
  const baseClasses = 'rounded-xl p-4 text-sm';
  
  const variantClasses = {
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Alert;
