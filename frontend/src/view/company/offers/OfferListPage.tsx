import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listCompanyOffers } from '../../../data/repositories/offerRepository';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { EmptyState } from '../../shared/components/EmptyState';
import { Loader } from '../../shared/components/Loader';
import type { Offer } from '../../../data/models';

export function CompanyOfferListPage() {
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
      console.error('[CompanyOfferListPage] listCompanyOffers error:', err);
      showToast('تعذر تحميل العروض', 'error');
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <div>
          <h1 style={{
            color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
            fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
          }}>
            {t('company.myOffers')}
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)' }}>
            {offers.length > 0 ? `${offers.length} عرض` : ''}
          </p>
        </div>
        <Button onClick={() => navigate('/company/offers/create')}>
          + {t('company.addOffer')}
        </Button>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          message={t('company.noOffers')}
          action={{ label: t('company.addOffer'), onClick: () => navigate('/company/offers/create') }}
          icon="📋"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {offers.map((offer) => (
            <div
              key={offer._id}
              onClick={() => navigate(`/company/offers/${offer._id}`)}
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
                  fontWeight: 600, marginBottom: 'var(--spacing-xs)',
                }}>
                  {offer.title}
                </h3>
                <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)' }}>
                  {offer.requiredSkills.length} مهارات مطلوبة
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                <Badge label={
                  offer.employmentType === 'full_time' ? t('company.fullTime') :
                  offer.employmentType === 'part_time' ? t('company.partTime') :
                  offer.employmentType === 'remote' ? t('company.remote') : t('company.hybrid')
                } />
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
