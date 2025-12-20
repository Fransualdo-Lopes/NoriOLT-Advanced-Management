
import React from 'react';
import { X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'info' | 'success';
  children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'info',
  children
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 shadow-red-600/20';
      case 'success': return 'bg-green-600 hover:bg-green-700 shadow-green-600/20';
      default: return 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'danger': return 'bg-red-50 text-red-600';
      case 'success': return 'bg-green-50 text-green-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-2xl ${getIconStyles()}`}>
              {variant === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            {!isLoading && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <X size={20} />
              </button>
            )}
          </div>

          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
            {title}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
            {description}
          </p>

          {children && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
              {children}
            </div>
          )}

          <div className="flex gap-3">
            {!isLoading && (
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-3 text-[10px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all uppercase tracking-[0.2em]"
              >
                {cancelText}
              </button>
            )}
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 text-[10px] font-black text-white rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] shadow-lg disabled:opacity-70 ${getVariantStyles()}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
