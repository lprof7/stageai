export function Loader({ text = 'جار التحميل...' }: { text?: string }) {
  return (
    <div role="status" aria-live="polite" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 'var(--spacing-xl)',
      gap: 'var(--spacing-md)',
    }}>
      <div
        style={{
          width: 44, height: 44,
          border: '4px solid var(--color-surface-container-high)',
          borderTop: '4px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{
        color: 'var(--color-on-surface-variant)',
        fontSize: 'var(--font-body-md)',
      }}>
        {text}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
