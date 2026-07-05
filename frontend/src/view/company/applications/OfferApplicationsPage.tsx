import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listOfferApplications } from '../../../data/repositories/applicationRepository';
import { Badge } from '../../shared/components/Badge';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import { FilterBar } from '../../shared/components/FilterBar';
import { Button } from '../../shared/components/Button';

const statusColors: Record<string, string> = {
  pending: 'var(--color-tertiary)',
  accepted: 'var(--color-secondary)',
  rejected: 'var(--color-error)',
};

export function OfferApplicationsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await listOfferApplications(id, statusFilter || undefined);
      setApps(data);
    } catch (err) {
      console.error('[OfferApplicationsPage] listOfferApplications error:', err);
      showToast('تعذر تحميل التقديمات', 'error');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id, statusFilter]);

  if (loading) return <Loader />;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate('/company/applications')} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <h1 style={{
          color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
          fontWeight: 'var(--font-headline-lg-weight)',
        }}>
          {t('company.applications')}
        </h1>
        <FilterBar
          label=""
          options={[
            { label: t('common.all'), value: '' },
            { label: t('student.pending'), value: 'pending' },
            { label: t('student.accepted'), value: 'accepted' },
            { label: t('student.rejected'), value: 'rejected' },
          ]}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      {apps.length === 0 ? (
        <EmptyState message={t('common.noData')} icon="👥" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {apps.map((app: any) => (
            <div
              key={app._id}
              onClick={() => navigate(`/company/applications/${app._id}`)}
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
                  color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)', fontWeight: 600,
                }}>
                  {app.studentId?.fullName || 'Unknown'}
                </h3>
                <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)' }}>
                  {app.studentId?.education || ''}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <span style={{
                  fontSize: 'var(--font-body-lg)', fontWeight: 700,
                  color: app.matchPercentageSnapshot >= 80 ? 'var(--color-secondary)' :
                    app.matchPercentageSnapshot >= 50 ? '#d4a843' : 'var(--color-tertiary)',
                }}>
                  {app.matchPercentageSnapshot}%
                </span>
                <Badge
                  label={t(`student.${app.status}`)}
                  color={statusColors[app.status] || 'var(--color-outline)'}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
