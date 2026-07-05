import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-surface)',
    }}>
      <Link to="/" style={{
        marginBottom: 'var(--spacing-lg)',
        textAlign: 'center',
        textDecoration: 'none',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-sm)',
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-on-primary)',
        }}>
          S
        </div>
        <h1 style={{
          color: 'var(--color-primary)',
          fontSize: 'var(--font-headline-lg)',
          fontWeight: 'var(--font-headline-lg-weight)',
          lineHeight: 'var(--font-headline-lg-line)',
        }}>
          {t('app.name')}
        </h1>
        <p style={{
          color: 'var(--color-on-surface-variant)',
          fontSize: 'var(--font-body-md)',
          marginTop: 'var(--spacing-xs)',
        }}>
          {t('app.tagline')}
        </p>
      </Link>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Outlet />
      </div>
    </div>
  );
}
