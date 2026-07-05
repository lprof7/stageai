import { Button } from './Button';

interface EmptyStateProps {
  message: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}

export function EmptyState({ message, action, icon = '📋' }: EmptyStateProps) {
  return (
    <div role="status" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 'var(--spacing-xl)',
      gap: 'var(--spacing-md)',
      backgroundColor: 'var(--color-surface-container-low)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <span style={{ fontSize: 48 }}>{icon}</span>
      <p style={{
        color: 'var(--color-on-surface-variant)',
        fontSize: 'var(--font-body-lg)',
        lineHeight: 'var(--font-body-lg-line)',
        textAlign: 'center',
      }}>
        {message}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
