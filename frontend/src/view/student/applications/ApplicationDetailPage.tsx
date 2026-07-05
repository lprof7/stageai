import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getApplication } from '../../../data/repositories/applicationRepository';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Application } from '../../../data/models';

const statusColors: Record<string, string> = {
  pending: 'var(--color-tertiary)',
  accepted: 'var(--color-secondary)',
  rejected: 'var(--color-error)',
};

export function ApplicationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getApplication(id).then((data) => {
      setApp(data);
      setLoading(false);
    }).catch((err) => {
      console.error('[ApplicationDetailPage] getApplication error:', err);
      showToast('تعذر تحميل تفاصيل التقديم', 'error');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader />;
  if (!app) return <EmptyState message={t('common.error')} icon="⚠️" />;

  const offer = typeof app.offerId === 'object' ? app.offerId as any : null;

  return (
    <div style={{ maxWidth: 720 }}>
      <Button variant="ghost" onClick={() => navigate('/student/applications')} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <div>
            <h1 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)', marginBottom: 'var(--spacing-xs)',
            }}>
              {offer?.title || t('common.error')}
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)' }}>
              {t('student.matchPercentage')}: {app.matchPercentageSnapshot}%
            </p>
          </div>
          <Badge label={t(`student.${app.status}`)} color={statusColors[app.status] || 'var(--color-outline)'} />
        </div>

        <div>
          <h3 style={{
            marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
            fontSize: 'var(--font-body-lg)', fontWeight: 600,
          }}>
            {t('student.motivationLetter')}
          </h3>
          <div style={{
            padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-lg)',
          }}>
            {app.motivationLetter ? (
              <p style={{
                whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
                fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
              }}>
                {app.motivationLetter}
              </p>
            ) : (
              <p style={{
                color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)',
                fontStyle: 'italic',
              }}>
                لم يتم تقديم رسالة تحفيز
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
