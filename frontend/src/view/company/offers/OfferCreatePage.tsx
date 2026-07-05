import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { createOffer } from '../../../data/repositories/offerRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function OfferCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '', description: '', paymentType: 'paid' as const,
    employmentType: 'full_time' as const,
    requiredSkills: '', durationMonths: '', location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createOffer({
        title: form.title, description: form.description,
        paymentType: form.paymentType,
        employmentType: form.employmentType,
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        durationMonths: form.durationMonths ? (() => { const d = parseInt(form.durationMonths, 10); if (isNaN(d)) { showToast('مدة التدريب يجب أن تكون رقماً', 'error'); return undefined; } return d; })() : undefined,
        location: form.location || undefined,
      });
      showToast('تم إضافة العرض بنجاح', 'success');
      navigate('/company/offers');
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[OfferCreatePage] createOffer error:', err);
    }
    setLoading(false);
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: 'var(--radius-md)', fontSize: 'var(--font-body-md)',
    backgroundColor: 'var(--color-surface-container-low)',
    color: 'var(--color-on-surface)', marginBottom: 'var(--spacing-md)',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: 620 }}>
      <h1 style={{
        color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
        fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-md)',
      }}>
        {t('company.addOffer')}
      </h1>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <form onSubmit={handleSubmit}>
          <Input label={t('company.title')} name="title" value={form.title} onChange={handleChange} required />
          <Input label={t('auth.description')} name="description" value={form.description} onChange={handleChange} multiline rows={4} required />

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block', marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-label-md-weight)',
              fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface)',
              textAlign: 'right',
            }}>
              {t('company.paymentType')}
            </label>
            <select name="paymentType" value={form.paymentType} onChange={handleChange} style={selectStyle}>
              <option value="paid">{t('company.paid')}</option>
              <option value="unpaid">{t('company.unpaid')}</option>
            </select>
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block', marginBottom: 'var(--spacing-xs)',
              fontWeight: 'var(--font-label-md-weight)',
              fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface)',
              textAlign: 'right',
            }}>
              {t('company.employmentType')}
            </label>
            <select name="employmentType" value={form.employmentType} onChange={handleChange} style={selectStyle}>
              <option value="full_time">{t('company.fullTime')}</option>
              <option value="part_time">{t('company.partTime')}</option>
              <option value="remote">{t('company.remote')}</option>
              <option value="hybrid">{t('company.hybrid')}</option>
            </select>
          </div>

          <Input
            label={`${t('company.requiredSkills')} (مفصولة بفواصل)`}
            name="requiredSkills" value={form.requiredSkills}
            onChange={handleChange} placeholder="React, Node.js, TypeScript"
          />
          <Input label={t('company.duration')} name="durationMonths" value={form.durationMonths} onChange={handleChange} type="number" />
          <Input label={t('auth.location')} name="location" value={form.location} onChange={handleChange} />

          {error && (
            <p style={{
              color: 'var(--color-error)', fontSize: 'var(--font-label-md)',
              marginBottom: 'var(--spacing-sm)', textAlign: 'right',
            }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/company/offers')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={loading}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
