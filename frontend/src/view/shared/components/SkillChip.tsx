interface SkillChipProps {
  label: string;
  matched?: boolean;
  onRemove?: () => void;
}

export function SkillChip({ label, matched, onRemove }: SkillChipProps) {
  const isMatch = matched === true;
  const isMiss = matched === false;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: isMatch
          ? 'rgba(143, 174, 133, 0.12)'
          : isMiss
            ? 'rgba(199, 123, 77, 0.12)'
            : 'var(--color-surface-container-high)',
        color: isMatch
          ? '#4f6c48'
          : isMiss
            ? '#71360d'
            : 'var(--color-on-surface)',
        fontSize: 'var(--font-label-md)',
        fontWeight: 500,
        lineHeight: 'var(--font-label-md-line)',
      }}
    >
      {isMatch && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#8fae85" opacity="0.3"/>
          <path d="M8 12l3 3 5-5" stroke="#4f6c48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {isMiss && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#c77b4d" opacity="0.3"/>
          <path d="M9 9l6 6M15 9l-6 6" stroke="#71360d" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
      {label}
      {onRemove && (
        <button
          aria-label={'حذف ' + label}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '14px', padding: 0, lineHeight: 1,
            color: 'var(--color-on-surface-variant)',
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
}
