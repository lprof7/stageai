import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getMyProfile, updateMyProfile } from '../../../data/repositories/companyRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';

export function CompanyProfilePage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', description: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile().then((data) => {
      setForm({ name: data.name || '', description: data.description || '', location: data.location || '' });
      setLoading(false);
    }).catch((err) => {
      console.error('[CompanyProfilePage] getMyProfile error:', err);
      showToast('تعذر تحميل الملف الشخصي', 'error');
      setLoading(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateMyProfile(form);
      showToast('تم حفظ التغييرات', 'success');
    } catch (err) {
      console.error('[CompanyProfilePage] updateMyProfile error:', err);
      showToast('تعذر حفظ التغييرات', 'error');
    }
    setSaving(false);
  }

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 620 }}>
      <h1 style={{
        color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
        fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-md)',
      }}>
        {t('company.profile')}
      </h1>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-surface-container-high)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: 'var(--color-on-primary)',
            flexShrink: 0,
          }}>
            {form.name?.charAt(0) || '?'}
          </div>
          <div>
            <h2 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)',
            }}>
              {form.name || t('company.profile')}
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-md)' }}>
              {form.location || ''}
            </p>
          </div>
        </div>

        <Input label={t('auth.companyName')} name="name" value={form.name} onChange={handleChange} required />
        <Input label={t('auth.description')} name="description" value={form.description} onChange={handleChange} multiline rows={3} />
        <Input label={t('auth.location')} name="location" value={form.location} onChange={handleChange} />

        <Button onClick={handleSave} loading={saving} style={{ marginTop: 'var(--spacing-md)' }}>
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
