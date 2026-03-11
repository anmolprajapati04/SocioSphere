import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 w-full max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`p-5 rounded-2xl shadow-2xl border flex items-center justify-between gap-4 glass-panel
                ${toast.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' : ''}
                ${toast.type === 'error' ? 'border-red-500/20 bg-red-500/5' : ''}
                ${toast.type === 'info' ? 'border-gold-500/20 bg-gold-500/5' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                  ${toast.type === 'error' ? 'bg-red-500/10 text-red-500' : ''}
                  ${toast.type === 'info' ? 'bg-gold-500/10 text-elegant-gold' : ''}
                `}>
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {toast.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-black text-primary-900 tracking-tight">{toast.message}</p>
                </div>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-slate-300 hover:text-primary-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
