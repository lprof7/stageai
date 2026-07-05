interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  error?: string;
  rows?: number;
  autoComplete?: string;
  minLength?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function Input({
  label, name, value, onChange, type = 'text', required, placeholder, multiline, error, rows, autoComplete, minLength, onKeyDown,
}: InputProps) {
  const id = `field-${name}`;
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-xs)',
          fontWeight: 'var(--font-label-md-weight)',
          fontSize: 'var(--font-label-md)',
          lineHeight: 'var(--font-label-md-line)',
          letterSpacing: 'var(--font-label-md-letter)',
          color: 'var(--color-on-surface)',
          textAlign: 'right',
        }}
      >
        {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      <Tag
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={error ? id + '-error' : undefined}
        aria-invalid={error ? 'true' : undefined}
        minLength={minLength}
        onKeyDown={onKeyDown}
        {...(multiline ? { rows: rows || 4 } : { type })}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: error ? '1px solid var(--color-error)' : '1px solid var(--color-outline-variant)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-body-md)',
          lineHeight: 'var(--font-body-md-line)',
          backgroundColor: 'var(--color-surface-container-low)',
          color: 'var(--color-on-surface)',
          resize: multiline ? 'vertical' : 'none',
          outline: 'none',
          transition: 'all 0.2s',
        }}
        onFocus={(e: any) => {
          e.target.style.backgroundColor = 'var(--color-surface-container-lowest)';
          e.target.style.boxShadow = '0 0 0 2px var(--color-outline-variant)';
        }}
        onBlur={(e: any) => {
          e.target.style.backgroundColor = 'var(--color-surface-container-low)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <p id={id + '-error'} style={{
          color: 'var(--color-error)',
          fontSize: 'var(--font-label-md)',
          marginTop: 'var(--spacing-xs)',
          textAlign: 'right',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
