import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listCompanyOffers } from '../../../data/repositories/offerRepository';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Offer } from '../../../data/models';

export function CompanyApplicationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCompanyOffers().then((data) => {
      setOffers(data);
      setLoading(false);
    }).catch((err) => {
      console.error('[CompanyApplicationsPage] listCompanyOffers error:', err);
      showToast('تعذر تحميل العروض', 'error');
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 style={{
        color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
        fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
      }}>
        {t('company.applications')}
      </h1>
      <p style={{
        color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)',
        marginBottom: 'var(--spacing-md)',
      }}>
        اختر عرضاً لرؤية التقديمات
      </p>

      {offers.length === 0 ? (
        <EmptyState message={t('company.noOffers')} icon="👥" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {offers.map((offer) => (
            <div
              key={offer._id}
              onClick={() => navigate(`/company/offers/${offer._id}/applications`)}
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
                color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)', fontWeight: 600,
              }}>
                {offer.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
