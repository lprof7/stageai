import { useEffect, useId } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'تأكيد', cancelLabel = 'إلغاء',
  variant = 'danger', loading, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const id = useId();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={id + '-title'}
      aria-describedby={id + '-message'}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 'var(--spacing-md)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-lg)',
          maxWidth: 400, width: '100%',
          boxShadow: 'var(--shadow-hover)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            backgroundColor: variant === 'danger' ? 'rgba(186, 26, 26, 0.1)' : 'rgba(30, 35, 71, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--spacing-sm)',
            fontSize: 24,
          }}>
            {variant === 'danger' ? '⚠️' : 'ℹ️'}
          </div>
          <h3 id={id + '-title'} style={{
            color: 'var(--color-primary)',
            fontSize: 'var(--font-headline-md)',
            fontWeight: 'var(--font-headline-md-weight)',
            marginBottom: 'var(--spacing-xs)',
          }}>
            {title}
          </h3>
          <p id={id + '-message'} style={{
            color: 'var(--color-on-surface-variant)',
            fontSize: 'var(--font-body-md)',
            lineHeight: 'var(--font-body-md-line)',
          }}>
            {message}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label={cancelLabel}
            style={{
              flex: 1, padding: '12px 24px',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              color: 'var(--color-on-surface)',
              fontWeight: 600, fontSize: 'var(--font-body-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            autoFocus
            aria-label={confirmLabel}
            style={{
              flex: 1, padding: '12px 24px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              backgroundColor: variant === 'danger' ? 'var(--color-error)' : 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 600, fontSize: 'var(--font-body-md)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading && <LoadingSpinner />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 16, height: 16,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }} />
  );
}
