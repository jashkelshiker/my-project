import React from 'react';

export default function Preloader({ isVisible = true, message = 'Processing...' }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="card p-8 rounded-2xl shadow-2xl text-center max-w-sm">
        {/* Animated spinner */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-brand-600 animate-spin"></div>
        </div>
        
        {/* Message */}
        <p className="text-slate-700 font-medium">{message}</p>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 animate-pulse" style={{ width: '30%' }}></div>
        </div>
      </div>
    </div>
  );
}
