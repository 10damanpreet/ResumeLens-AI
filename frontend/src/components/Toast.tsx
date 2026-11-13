import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl glass-strong border shadow-2xl transition-all duration-300 animate-slide-up ${
                isSuccess
                  ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200 shadow-emerald-500/10'
                  : isError
                  ? 'border-red-500/40 bg-red-950/80 text-red-200 shadow-red-500/10'
                  : 'border-violet-500/40 bg-violet-950/80 text-violet-200 shadow-violet-500/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-violet-400 flex-shrink-0" />}
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
