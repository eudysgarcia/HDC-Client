import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'warning',
}) => {
  const variants = {
    danger: {
      gradient: 'from-rose-500 to-red-600',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-500',
      confirmBtn: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700',
    },
    warning: {
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      confirmBtn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    },
    info: {
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      confirmBtn: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    },
  };

  const config = variants[variant];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 20,
                transition: {
                  duration: 0.2
                }
              }}
              className="bg-dark-lighter rounded-2xl shadow-2xl border border-white/10 w-full max-w-md overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${config.gradient} p-6 relative`}>
                <button
                  onClick={onCancel}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className={`${config.iconBg} ${config.iconColor} p-3 rounded-xl backdrop-blur-sm`}>
                    <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 text-[15px] leading-relaxed mb-6">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 rounded-xl bg-dark-light hover:bg-dark border border-white/10 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                      onConfirm();
                      onCancel();
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl ${config.confirmBtn} text-white font-medium shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;

