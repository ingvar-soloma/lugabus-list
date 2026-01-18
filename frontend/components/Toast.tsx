import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-zinc-100" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Info className="text-zinc-400" size={20} />,
  };

  const bgColors = {
    success: 'bg-zinc-800 border-zinc-700',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-zinc-900 border-zinc-800',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-4 py-3 rounded-none border backdrop-blur-xl shadow-2xl ${bgColors[type]} min-w-[300px] max-w-md pointer-events-auto`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-zinc-200">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white/5 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{
  toasts: { id: string; message: string; type: ToastType }[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
