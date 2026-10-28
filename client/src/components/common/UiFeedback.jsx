import React from 'react';
import { Sprout } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading agricultural data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-agri-mist border-t-agri animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sprout className="w-5 h-5 text-agri animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-700 animate-pulse">{message}</p>
    </div>
  );
}

export function AlertBanner({ type = 'info', title, message, onClose }) {
  const styles = {
    info: 'bg-sky-50 border-sky-300 text-sky-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    danger: 'bg-red-50 border-red-300 text-red-900',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-900'
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type] || styles.info} relative mb-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 ml-3 text-lg font-bold leading-none"
            aria-label="Close notification"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} border border-soil-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-soil-100 bg-[#faf8f5]">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-xl font-semibold leading-none">&times;</span>
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
