import React, { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 1;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = toastId++;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6">
        <div className="flex w-full max-w-xs flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={clsx(
                'pointer-events-auto rounded-xl border border-border bg-surface-alt px-3 py-2 text-sm shadow-card',
                toast.type === 'success' && 'border-success',
                toast.type === 'error' && 'border-danger',
                toast.type === 'info' && 'border-primary'
              )}
              role="status"
              aria-live="polite"
            >
              <div className="font-medium text-slate-900">{toast.title}</div>
              {toast.description && (
                <p className="mt-0.5 text-xs text-slate-600">{toast.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

