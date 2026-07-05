import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getPublicProfile } from '../../../data/repositories/companyRepository';
import { Badge } from '../../shared/components/Badge';
import { EmptyState } from '../../shared/components/EmptyState';
import { Loader } from '../../shared/components/Loader';
import { Button } from '../../shared/components/Button';

export function CompanyPublicProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getPublicProfile(id).then((res) => {
      setData(res);
      setLoading(false);
    }).catch((err) => {
      console.error('[CompanyPublicProfilePage] getPublicProfile error:', err);
      showToast('تعذر تحميل ملف الشركة', 'error');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader />;
  if (!data) return <p>{t('common.error')}</p>;

  const { company, offers } = data;

  return (
    <div style={{ maxWidth: 720 }}>
      <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)', marginBottom: 'var(--spacing-md)',
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          {company.logoUrl ? (
            <img src={company.logoUrl} alt=""
              style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>
              🏢
            </div>
          )}
          <div>
            <h1 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
              fontWeight: 'var(--font-headline-lg-weight)',
            }}>
              {company.name}
            </h1>
            {company.location && (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)' }}>
                {company.location}
              </p>
            )}
          </div>
        </div>
        {company.description && (
          <p style={{
            whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
            fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
          }}>
            {company.description}
          </p>
        )}
      </div>

      <h2 style={{
        color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
        fontWeight: 'var(--font-headline-md-weight)', marginBottom: 'var(--spacing-md)',
      }}>
        العروض المتاحة
      </h2>

      {offers.length === 0 ? (
        <EmptyState message="لا توجد عروض متاحة حالياً" icon="📭" />
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {offers.map((offer: any) => (
          <div
            key={offer._id}
            onClick={() => navigate(`/student/offers/${offer._id}`)}
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-md)',
              boxShadow: 'var(--shadow-resting)', cursor: 'pointer',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-resting)'; }}
          >
            <h3 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)',
              fontWeight: 600, marginBottom: 'var(--spacing-xs)',
            }}>
              {offer.title}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              <Badge label={offer.employmentType} />
              <Badge
                label={offer.paymentType === 'paid' ? t('company.paid') : t('company.unpaid')}
                color={offer.paymentType === 'paid' ? 'var(--color-secondary)' : 'var(--color-tertiary)'}
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
