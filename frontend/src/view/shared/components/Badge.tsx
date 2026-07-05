interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = 'var(--color-secondary)' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: `color-mix(in srgb, ${color}, transparent 88%)`,
        color: color,
        fontSize: 'var(--font-label-md)',
        fontWeight: 500,
        lineHeight: 'var(--font-label-md-line)',
      }}
    >
      {label}
    </span>
  );
}
