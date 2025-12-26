import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />,
      gradient: 'from-emerald-500/90 to-green-600/90',
      iconBg: 'bg-emerald-400/20',
      iconColor: 'text-emerald-100',
      borderColor: 'border-emerald-400/30',
    },
    error: {
      icon: <XCircle className="w-6 h-6" strokeWidth={2.5} />,
      gradient: 'from-rose-500/90 to-red-600/90',
      iconBg: 'bg-rose-400/20',
      iconColor: 'text-rose-100',
      borderColor: 'border-rose-400/30',
    },
    info: {
      icon: <Info className="w-6 h-6" strokeWidth={2.5} />,
      gradient: 'from-blue-500/90 to-indigo-600/90',
      iconBg: 'bg-blue-400/20',
      iconColor: 'text-blue-100',
      borderColor: 'border-blue-400/30',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />,
      gradient: 'from-amber-500/90 to-orange-600/90',
      iconBg: 'bg-amber-400/20',
      iconColor: 'text-amber-100',
      borderColor: 'border-amber-400/30',
    },
  };

  const currentConfig = config[type];

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -20, 
            scale: 0.95,
            transition: {
              duration: 0.2
            }
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          {/* Toast Container */}
          <div className={`
            flex items-center gap-4 
            px-5 py-4 
            rounded-2xl 
            backdrop-blur-xl
            bg-gradient-to-br ${currentConfig.gradient}
            border ${currentConfig.borderColor}
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            min-w-[320px] max-w-[480px]
          `}>
            {/* Icon Container */}
            <div className={`
              flex items-center justify-center
              w-10 h-10
              rounded-xl
              ${currentConfig.iconBg}
              ${currentConfig.iconColor}
              flex-shrink-0
            `}>
              {currentConfig.icon}
            </div>

            {/* Message */}
            <p className="text-white font-medium text-[15px] leading-tight flex-1 pr-2">
              {message}
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-lg
                hover:bg-white/20
                active:bg-white/30
                transition-all duration-200
                text-white/80 hover:text-white
                flex-shrink-0
              "
              aria-label="Cerrar notificación"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-2xl origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

