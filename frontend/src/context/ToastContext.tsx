import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    const duration = type === 'error' ? 6000 : 4000;
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div role="status" aria-live="polite" aria-relevant="additions" style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const bgColors: Record<string, string> = {
    success: '#4f6c48',
    error: '#ba1a1a',
    info: '#1e2347',
    warning: '#8d6e00',
  };

  return (
    <div
      onClick={onDismiss}
      role="alert"
      aria-live="polite"
      style={{
        padding: '12px 24px',
        borderRadius: 12,
        backgroundColor: bgColors[toast.type],
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        pointerEvents: 'auto',
        cursor: 'pointer',
        direction: 'rtl',
        animation: 'toastIn 0.3s ease',
        maxWidth: 420,
        textAlign: 'center',
      }}
    >
      {toast.message}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
