import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/components/Button';

export function OnboardingChoicePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: 600,
      margin: '0 auto',
      padding: 'var(--spacing-xl) var(--spacing-md)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-md)',
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--color-on-primary)',
        }}>
          S
        </div>
        <h1 style={{
          color: 'var(--color-primary)',
          fontSize: 'var(--font-headline-lg)',
          fontWeight: 'var(--font-headline-lg-weight)',
          marginBottom: 'var(--spacing-xs)',
        }}>
          {t('onboarding.title')}
        </h1>
        <p style={{
          color: 'var(--color-on-surface-variant)',
          fontSize: 'var(--font-body-lg)',
          lineHeight: 'var(--font-body-lg-line)',
        }}>
          {t('onboarding.subtitle')}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div
          onClick={() => navigate('/student/onboarding/upload')}
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-resting)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-resting)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            📄
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)',
            }}>
              {t('onboarding.upload')}
            </h3>
            <p style={{
              color: 'var(--color-on-surface-variant)',
              fontSize: 'var(--font-body-md)',
              lineHeight: 'var(--font-body-md-line)',
            }}>
              {t('onboarding.uploadDesc')}
            </p>
          </div>
          <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 20 }}>←</span>
        </div>
        <div
          onClick={() => navigate('/student/onboarding/manual')}
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--spacing-lg)',
            boxShadow: 'var(--shadow-resting)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-resting)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-container-high)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            ✏️
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)',
            }}>
              {t('onboarding.manual')}
            </h3>
            <p style={{
              color: 'var(--color-on-surface-variant)',
              fontSize: 'var(--font-body-md)',
              lineHeight: 'var(--font-body-md-line)',
            }}>
              {t('onboarding.manualDesc')}
            </p>
          </div>
          <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 20 }}>←</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
        <Button variant="ghost" onClick={() => navigate('/auth/student/login')}>
          {t('common.back')}
        </Button>
      </div>
    </div>
  );
}
