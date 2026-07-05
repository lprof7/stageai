interface FilterBarProps {
  options: { label: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
}

export function FilterBar({ options, selected, onChange, label }: FilterBarProps) {
  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-label-md)',
    lineHeight: 'var(--font-label-md-line)',
    backgroundColor: 'var(--color-surface-container-low)',
    color: 'var(--color-on-surface)',
    minWidth: 140,
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
      {label && (
        <label htmlFor={'filter-' + label} style={{
          fontWeight: 'var(--font-label-md-weight)',
          fontSize: 'var(--font-label-md)',
          color: 'var(--color-on-surface-variant)',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </label>
      )}
      <select id={label ? 'filter-' + label : undefined} aria-label={label || 'filter'} value={selected} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
