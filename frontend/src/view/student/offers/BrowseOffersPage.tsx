import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listOffers } from '../../../data/repositories/offerRepository';
import { listCvs } from '../../../data/repositories/cvRepository';
import { MatchGauge } from '../../shared/components/MatchGauge';
import { Badge } from '../../shared/components/Badge';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import { FilterBar } from '../../shared/components/FilterBar';
import type { Offer, Cv } from '../../../data/models';

export function BrowseOffersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [selectedCvId, setSelectedCvId] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [empFilter, setEmpFilter] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function load() {
    setLoading(true);
    try {
      const cvData = await listCvs();
      setCvs(cvData);
      if (!selectedCvId && cvData.length > 0) {
        setSelectedCvId(cvData[0]._id);
      }
      const params: any = {};
      if (paymentFilter) params.paymentType = paymentFilter;
      if (empFilter) params.employmentType = empFilter;
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCvId) params.cvId = selectedCvId;
      const offerData = await listOffers(params);
      setOffers(offerData);
    } catch (err) {
      console.error('[BrowseOffersPage] load error:', err);
      showToast('تعذر تحميل العروض', 'error');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [selectedCvId, paymentFilter, empFilter, debouncedSearch]);

  const paymentOptions = [
    { label: t('common.all'), value: '' },
    { label: t('company.paid'), value: 'paid' },
    { label: t('company.unpaid'), value: 'unpaid' },
  ];

  const empOptions = [
    { label: t('common.all'), value: '' },
    { label: t('company.fullTime'), value: 'full_time' },
    { label: t('company.partTime'), value: 'part_time' },
    { label: t('company.remote'), value: 'remote' },
    { label: t('company.hybrid'), value: 'hybrid' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <h1 style={{
          color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
          fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
        }}>
          {t('student.browseOffers')}
        </h1>
        <p style={{
          color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)',
        }}>
          {offers.length > 0 ? `${offers.length} عرض متاح` : ''}
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap',
        marginBottom: 'var(--spacing-md)', alignItems: 'center',
        backgroundColor: 'var(--color-surface-container-lowest)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', right: 12, top: 10, color: 'var(--color-on-surface-variant)' }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('student.search')}
            autoComplete="off"
            aria-label={t('student.search')}
            style={{
              width: '100%', padding: '10px 16px 10px 40px',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--font-body-md)',
              backgroundColor: 'var(--color-surface-container-low)',
              color: 'var(--color-on-surface)', outline: 'none',
            }}
          />
        </div>
        <FilterBar
          label={t('student.filterByCv')}
          options={cvs.map(c => ({ label: c.name, value: c._id }))}
          selected={selectedCvId}
          onChange={setSelectedCvId}
        />
        <FilterBar
          label={t('student.paymentType')}
          options={paymentOptions}
          selected={paymentFilter}
          onChange={setPaymentFilter}
        />
        <FilterBar
          label={t('student.employmentType')}
          options={empOptions}
          selected={empFilter}
          onChange={setEmpFilter}
        />
      </div>

      {loading ? <Loader /> : cvs.length === 0 ? (
        <EmptyState message="قم بإضافة سيرة ذاتية أولاً لتصفح العروض" icon="📄" />
      ) : offers.length === 0 ? (
        <EmptyState message={t('common.noData')} icon="🔍" />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--spacing-sm)',
        }}>
          {offers.map((offer) => {
            const company = typeof offer.companyId === 'object' ? offer.companyId : null;
            return (
              <div
                key={offer._id}
                onClick={() => navigate(`/student/offers/${offer._id}${selectedCvId ? `?cvId=${selectedCvId}` : ''}`)}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-resting)', cursor: 'pointer',
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
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  {company?.logoUrl ? (
                    <img src={company.logoUrl} alt=""
                      style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--color-surface-container-high)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>
                      🏢
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {company && (
                      <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)', marginBottom: 2 }}>
                        {company.name}
                      </p>
                    )}
                    <h3 style={{
                      color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)',
                      fontWeight: 600, marginBottom: 'var(--spacing-xs)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {offer.title}
                    </h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
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
                  {offer.matchPercentage !== undefined && (
                    <MatchGauge percentage={offer.matchPercentage} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
