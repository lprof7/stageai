import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
  fullWidth?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

const base: React.CSSProperties = {
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};

const variants: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' },
  secondary: { backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)' },
  danger: { backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--color-primary)' },
};

const sizes: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 16px', fontSize: 'var(--font-label-md)', lineHeight: 'var(--font-label-md-line)' },
  md: { padding: '10px 24px', fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)' },
  lg: { padding: '14px 32px', fontSize: 'var(--font-body-lg)', lineHeight: 'var(--font-body-lg-line)' },
};

export function Button({
  children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', style, fullWidth, loading, 'aria-label': ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={loading}
        aria-label={ariaLabel}
        style={{
          ...base,
          ...variants[variant],
          ...sizes[size],
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: variant === 'primary' ? 'var(--shadow-resting)' : 'var(--shadow-none)',
          ...style,
        }}
      >
        {loading && <LoadingSpinner variant={variant} />}
        {children}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function LoadingSpinner({ variant }: { variant?: string }) {
  const borderColor = variant === 'primary' || variant === 'danger'
    ? 'rgba(255,255,255,0.3)'
    : 'rgba(30,35,71,0.2)';
  const borderTop = variant === 'primary' || variant === 'danger'
    ? '#ffffff'
    : '#1e2347';

  return (
    <span style={{
      display: 'inline-block',
      width: 16, height: 16,
      border: `2px solid ${borderColor}`,
      borderTop: `2px solid ${borderTop}`,
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
      flexShrink: 0,
    }} />
  );
}
