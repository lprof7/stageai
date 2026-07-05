import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getProfile, updateProfile } from '../../../data/repositories/studentRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';

export function StudentProfilePage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: '', phone: '', location: '', education: '', bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then((data) => {
      setForm({
        fullName: data.fullName || '', phone: data.phone || '',
        location: data.location || '', education: data.education || '',
        bio: data.bio || '',
      });
      setLoading(false);
    }).catch((err) => {
      console.error('[StudentProfilePage] getProfile error:', err);
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
      await updateProfile(form);
      showToast('تم حفظ التغييرات', 'success');
    } catch (err) {
      console.error('[StudentProfilePage] updateProfile error:', err);
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
        {t('student.profile')}
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
            width: 64, height: 64, borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: 'var(--color-on-primary)',
            flexShrink: 0,
          }}>
            {form.fullName?.charAt(0) || '?'}
          </div>
          <div>
            <h2 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-md)',
              fontWeight: 'var(--font-headline-md-weight)',
            }}>
              {form.fullName || t('student.profile')}
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-md)' }}>
              {form.education || 'طالب'}
            </p>
          </div>
        </div>

        <Input label={t('auth.fullName')} name="fullName" value={form.fullName} onChange={handleChange} required />
        <Input label={t('auth.location')} name="location" value={form.location} onChange={handleChange} />
        <Input label="الهاتف" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="المؤهل التعليمي" name="education" value={form.education} onChange={handleChange} />
        <Input label="نبذة" name="bio" value={form.bio} onChange={handleChange} multiline rows={3} />

        <Button onClick={handleSave} disabled={saving} loading={saving} style={{ marginTop: 'var(--spacing-md)' }}>
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
