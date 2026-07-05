import { ReactNode, useEffect, useId, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={id + '-title'}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 'var(--spacing-md)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-lg)',
          minWidth: '400px', maxWidth: '600px', width: '100%',
          maxHeight: '80vh', overflowY: 'auto',
          boxShadow: 'var(--shadow-hover)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}>
          <h2 id={id + '-title'} style={{
            fontSize: 'var(--font-headline-md)',
            fontWeight: 'var(--font-headline-md-weight)',
            lineHeight: 'var(--font-headline-md-line)',
            color: 'var(--color-primary)',
          }}>
            {title}
          </h2>
          <button
            ref={closeRef}
            autoFocus
            onClick={onClose}
            aria-label="إغلاق"
            style={{
              background: 'none', border: 'none', fontSize: '24px',
              cursor: 'pointer', color: 'var(--color-on-surface-variant)',
              padding: '4px', lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
