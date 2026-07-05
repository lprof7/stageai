import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getOffer } from '../../../data/repositories/offerRepository';
import { createApplication, getMotivationLetter } from '../../../data/repositories/applicationRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';

export function ApplyFlowPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const offerId = searchParams.get('offerId') || '';
  const cvId = searchParams.get('cvId') || '';
  const [letter, setLetter] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerLoading, setOfferLoading] = useState(true);
  const [letterLoading, setLetterLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (offerId) {
      getOffer(offerId).then((o) => {
        setOfferTitle(o.title);
        setOfferLoading(false);
      }).catch((err) => {
        console.error('[ApplyFlowPage] getOffer error:', err);
        showToast('تعذر تحميل معلومات العرض', 'error');
        setOfferLoading(false);
      });
    } else {
      setOfferLoading(false);
    }
  }, [offerId]);

  async function handleGenerate() {
    if (!cvId || !offerId) {
      showToast('تأكد من تحديد السيرة الذاتية والعرض', 'error');
      return;
    }
    console.log('[ApplyFlowPage] handleGenerate: cvId=%s, offerId=%s', cvId, offerId);
    setLetterLoading(true);
    try {
      const res = await getMotivationLetter(cvId, offerId);
      console.log('[ApplyFlowPage] getMotivationLetter response:', JSON.stringify(res));
      setLetter(res.letter);
      if (!res.letter) {
        console.warn('[ApplyFlowPage] letter is empty in response!');
        showToast('الرسالة فارغة، حاول مرة أخرى', 'warning');
      } else {
        showToast('تم توليد الرسالة بنجاح', 'success');
      }
    } catch (err) {
      console.error('[ApplyFlowPage] getMotivationLetter error:', err);
      showToast('تعذر توليد الرسالة', 'error');
    }
    setLetterLoading(false);
  }

  async function handleSubmit() {
    if (!cvId || !offerId || !letter) {
      showToast('تأكد من كتابة رسالة التحفيز', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await createApplication({ cvId, offerId, motivationLetter: letter });
      showToast('تم تقديم طلبك بنجاح!', 'success');
      navigate('/student/applications');
    } catch (err) {
      console.error('[ApplyFlowPage] createApplication error:', err);
      showToast('تعذر تقديم الطلب', 'error');
    }
    setSubmitting(false);
  }

  if (!offerId || !cvId) {
    return (
      <div style={{ maxWidth: 720 }}>
        <EmptyState message="تأكد من تحديد السيرة الذاتية والعرض" icon="⚠️" />
        <Button variant="ghost" onClick={() => navigate('/student/applications')} style={{ marginTop: 'var(--spacing-md)' }}>
          &larr; {t('common.back')}
        </Button>
      </div>
    );
  }

  if (offerLoading) return <Loader />;

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
        <h1 style={{
          color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
          fontWeight: 'var(--font-headline-md-weight)', marginBottom: 'var(--spacing-xs)',
        }}>
          {t('student.apply')}
        </h1>
        <p style={{
          color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {offerTitle}
        </p>

        <div style={{
          marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-md)' }}>
            {t('student.motivationLetter')}
          </span>
          <Button
            onClick={handleGenerate}
            disabled={letterLoading}
            variant="secondary"
            size="sm"
            loading={letterLoading}
          >
            {t('student.aiGenerate')}
          </Button>
        </div>

        <div style={{ position: 'relative' }}>
          <Input
            label=""
            name="letter"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            multiline
            rows={8}
            required
          />
          <span style={{
            position: 'absolute', bottom: 8, left: 8,
            fontSize: 'var(--font-label-sm)', color: 'var(--color-on-surface-variant)',
          }}>
            {letter.length} حرف
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
          <Button variant="secondary" onClick={() => navigate('/student/applications')}>
            {t('common.back')}
          </Button>
          <Button onClick={handleSubmit} disabled={!letter || submitting} loading={submitting}>
            {t('student.confirmSubmission')}
          </Button>
        </div>
      </div>
    </div>
  );
}
