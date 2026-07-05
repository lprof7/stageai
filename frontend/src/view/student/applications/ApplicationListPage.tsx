import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listApplications } from '../../../data/repositories/applicationRepository';
import { Badge } from '../../shared/components/Badge';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Application } from '../../../data/models';

const statusColors: Record<string, string> = {
  pending: 'var(--color-tertiary)',
  accepted: 'var(--color-secondary)',
  rejected: 'var(--color-error)',
};

export function ApplicationListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listApplications().then((data) => {
      setApps(data);
      setLoading(false);
    }).catch((err) => {
      console.error('[ApplicationListPage] listApplications error:', err);
      showToast('تعذر تحميل التقديمات', 'error');
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <h1 style={{
          color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
          fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
        }}>
          {t('student.myApplications')}
        </h1>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)' }}>
          {apps.length > 0 ? `${apps.length} تقديم` : ''}
        </p>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          message={t('student.noApplications')}
          action={{ label: t('student.browseOffers'), onClick: () => navigate('/student/offers') }}
          icon="📋"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {apps.map((app) => {
            const offer = typeof app.offerId === 'object' ? app.offerId as any : null;
            return (
              <div
                key={app._id}
                onClick={() => navigate(`/student/applications/${app._id}`)}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-resting)', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-resting)'; }}
              >
                <div>
                  <h3 style={{
                    color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)',
                    fontWeight: 600, marginBottom: 2,
                  }}>
                    {offer?.title || 'Offer'}
                  </h3>
                  <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)' }}>
                    {t('student.matchPercentage')}: {app.matchPercentageSnapshot ?? 0}%
                  </p>
                </div>
                <Badge label={t(`student.${app.status}`)} color={statusColors[app.status] || 'var(--color-outline)'} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
