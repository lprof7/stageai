import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const colors = {
  success: 'var(--color-on-surface)',
  error: 'var(--color-error)',
  info: 'var(--color-primary)',
};

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed', bottom: 'var(--spacing-lg)', left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        backgroundColor: colors[type],
        color: '#ffffff',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        fontSize: 'var(--font-body-md)',
        boxShadow: 'var(--shadow-hover)',
        zIndex: 2000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      {message}
    </div>
  );
}
