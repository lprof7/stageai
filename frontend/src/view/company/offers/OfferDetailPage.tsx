import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getCompanyOffer, updateCompanyOffer } from '../../../data/repositories/offerRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';
import type { Offer } from '../../../data/models';

export function CompanyOfferDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', requiredSkills: '' });

  useEffect(() => {
    if (!id) return;
    getCompanyOffer(id).then((data) => {
      setOffer(data);
      setForm({ title: data.title, description: data.description, requiredSkills: data.requiredSkills.join(', ') });
      setLoading(false);
    }).catch((err) => {
      console.error('[CompanyOfferDetailPage] getCompanyOffer error:', err);
      showToast('تعذر تحميل العرض', 'error');
      setLoading(false);
    });
  }, [id]);

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    try {
      await updateCompanyOffer(id, {
        title: form.title, description: form.description,
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      });
      showToast('تم حفظ التغييرات', 'success');
      setEditing(false);
      const updated = await getCompanyOffer(id);
      setOffer(updated);
    } catch (err) {
      console.error('[CompanyOfferDetailPage] updateCompanyOffer error:', err);
      showToast('تعذر حفظ التغييرات', 'error');
    }
    setSaving(false);
  }

  if (loading) return <Loader />;
  if (!offer) return <p>{t('common.error')}</p>;

  return (
    <div style={{ maxWidth: 720 }}>
      <Button variant="ghost" onClick={() => navigate('/company/offers')} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        {editing ? (
          <>
            <h2 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)', marginBottom: 'var(--spacing-md)',
            }}>
              {t('company.editOffer')}
            </h2>
            <Input label={t('company.title')} name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Input label={t('auth.description')} name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={4} />
            <Input label={t('company.requiredSkills')} name="requiredSkills" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
              <Button variant="secondary" onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
              <Button onClick={handleSave} loading={saving}>{t('common.save')}</Button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
              fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-md)',
            }}>
              {offer.title}
            </h1>

            <div style={{
              padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-md)',
            }}>
              <p style={{
                whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
                fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
              }}>
                {offer.description}
              </p>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
              padding: '10px 16px', backgroundColor: 'var(--color-surface-container-high)',
              borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)',
            }}>
              <strong>{t('company.requiredSkills')}:</strong> {offer.requiredSkills.join('، ')}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                {t('common.edit')}
              </Button>
              <Button onClick={() => navigate(`/company/offers/${id}/applications`)}>
                {t('company.applications')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
