import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getOffer } from '../../../data/repositories/offerRepository';
import { getMatchAdvice } from '../../../data/repositories/applicationRepository';
import { Button } from '../../shared/components/Button';
import { MatchGauge } from '../../shared/components/MatchGauge';
import { Badge } from '../../shared/components/Badge';
import { SkillChip } from '../../shared/components/SkillChip';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import type { Offer } from '../../../data/models';

export function OfferDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const cvId = searchParams.get('cvId') || '';
  const [offer, setOffer] = useState<Offer | null>(null);
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOffer(id, cvId).then((data) => {
      setOffer(data);
      setLoading(false);
      if (cvId) {
        setAdviceLoading(true);
        getMatchAdvice(cvId, id)
          .then((res) => setAdvice(res.advice))
          .catch((err) => {
            console.error('[OfferDetailPage] getMatchAdvice error:', err);
            showToast('تعذر تحميل نصيحة الذكاء الاصطناعي', 'error');
          })
          .finally(() => setAdviceLoading(false));
      }
    }).catch((err) => {
      console.error('[OfferDetailPage] getOffer error:', err);
      showToast(t('common.error'), 'error');
      setLoading(false);
    });
  }, [id, cvId]);

  if (loading) return <Loader />;
  if (!offer) return <EmptyState message={t('common.error')} icon="⚠️" />;

  const company = typeof offer.companyId === 'object' ? offer.companyId : null;

  return (
    <div style={{ maxWidth: 820 }}>
      <Button variant="ghost" onClick={() => navigate('/student/offers')} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <div style={{
          display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start',
          marginBottom: 'var(--spacing-lg)',
        }}>
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name || ''}
              style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : company ? (
            <div style={{
              width: 72, height: 72, borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>
              🏢
            </div>
          ) : null}
          <div style={{ flex: 1 }}>
            <h1 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
              fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
            }}>
              {offer.title}
            </h1>
            {company && (
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)', marginBottom: 'var(--spacing-sm)' }}>
                {company.name}{company.location ? ` - ${company.location}` : ''}
              </p>
            )}
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
              <Badge
                label={
                  offer.employmentType === 'full_time' ? t('company.fullTime') :
                  offer.employmentType === 'part_time' ? t('company.partTime') :
                  offer.employmentType === 'remote' ? t('company.remote') : t('company.hybrid')
                }
                aria-label={t('company.fullTime')}
              />
              <Badge
                label={offer.paymentType === 'paid' ? t('company.paid') : t('company.unpaid')}
                color={offer.paymentType === 'paid' ? 'var(--color-secondary)' : 'var(--color-tertiary)'}
                aria-label={offer.paymentType}
              />
            </div>
          </div>
          {offer.matchPercentage !== undefined && (
            <MatchGauge percentage={offer.matchPercentage} size={100} />
          )}
        </div>

        {offer.matchedSkills && offer.missingSkills && (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{
              marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              {t('student.matchedSkills')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
              {offer.matchedSkills.map((s) => <SkillChip key={s} label={s} matched />)}
            </div>
            <h3 style={{
              marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              {t('student.missingSkills')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
              {offer.missingSkills.map((s) => <SkillChip key={s} label={s} matched={false} />)}
            </div>
          </div>
        )}

        <div style={{
          marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h3 style={{
            marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
            fontSize: 'var(--font-body-lg)', fontWeight: 600,
          }}>
            {t('auth.description')}
          </h3>
          <p style={{
            whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
            fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
          }}>
            {offer.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
          {offer.durationMonths && (
            <div style={{
              padding: '8px 16px', backgroundColor: 'var(--color-surface-container-high)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--font-label-md)',
              color: 'var(--color-on-surface-variant)',
            }}>
              {t('company.duration')}: {offer.durationMonths} أشهر
            </div>
          )}
          {offer.location && (
            <div style={{
              padding: '8px 16px', backgroundColor: 'var(--color-surface-container-high)',
              borderRadius: 'var(--radius-md)', fontSize: 'var(--font-label-md)',
              color: 'var(--color-on-surface-variant)',
            }}>
              {offer.location}
            </div>
          )}
        </div>

        {adviceLoading ? (
          <Loader text={t('common.loading')} />
        ) : advice ? (
          <div style={{
            marginBottom: 'var(--spacing-lg)', padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-lg)',
            borderRight: '4px solid var(--color-secondary)',
          }}>
            <h3 style={{
              marginBottom: 'var(--spacing-xs)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              {t('student.aiAdvice')}
            </h3>
            <p style={{
              whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
              fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
            }}>
              {advice}
            </p>
          </div>
        ) : null}

        {cvId && (
          <Button
            size="lg"
            onClick={() => navigate(`/student/applications/apply?offerId=${offer._id}&cvId=${cvId}`)}
          >
            {t('student.apply')}
          </Button>
        )}
      </div>
    </div>
  );
}
