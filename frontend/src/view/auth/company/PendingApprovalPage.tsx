import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../shared/components/Button';

export function PendingApprovalPage() {
  const { t } = useTranslation();

  return (
    <div style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      padding: 'var(--spacing-xl) var(--spacing-lg)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-resting)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: 'var(--color-surface-container-high)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--spacing-md)',
        fontSize: 36,
      }}>
        ⏳
      </div>
      <h2 style={{
        marginBottom: 'var(--spacing-sm)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-headline-md)',
        fontWeight: 'var(--font-headline-md-weight)',
      }}>
        {t('auth.pendingTitle')}
      </h2>
      <p style={{
        color: 'var(--color-on-surface-variant)',
        fontSize: 'var(--font-body-md)',
        lineHeight: 'var(--font-body-md-line)',
        marginBottom: 'var(--spacing-lg)',
      }}>
        {t('auth.pendingApproval')}
      </p>
      <Link to="/auth/company/login">
        <Button variant="secondary">
          {t('common.back')}
        </Button>
      </Link>
    </div>
  );
}
