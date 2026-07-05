import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { registerStudent } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function ManualFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', location: '', education: '', bio: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('البريد الإلكتروني غير صالح', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }
    if (form.password !== confirmPassword) {
      showToast('كلمة المرور غير متطابقة', 'error');
      return;
    }
    setLoading(true);
    try {
      await registerStudent({ ...form, onboardingMethod: 'manual' });
      showToast('تم إنشاء الحساب بنجاح!', 'success');
      navigate('/auth/student/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[ManualFormPage] registerStudent error:', err);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 'var(--spacing-lg)' }}>
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <h1 style={{
          color: 'var(--color-primary)',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-headline-md)',
          fontWeight: 'var(--font-headline-md-weight)',
        }}>
          {t('onboarding.manual')}
        </h1>
        <form onSubmit={handleSubmit}>
          <Input label={t('auth.fullName')} name="fullName" value={form.fullName} onChange={handleChange} required />
          <Input label={t('auth.email')} name="email" value={form.email} onChange={handleChange} required type="email" />
          <Input label={t('auth.password')} name="password" value={form.password} onChange={handleChange} required type="password" />
          <Input label="تأكيد كلمة المرور" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required type="password" />
          <Input label="الهاتف" name="phone" value={form.phone} onChange={handleChange} />
          <Input label={t('auth.location')} name="location" value={form.location} onChange={handleChange} />
          <Input label="المؤهل التعليمي" name="education" value={form.education} onChange={handleChange} />
          <Input label="نبذة" name="bio" value={form.bio} onChange={handleChange} multiline />
          {error && (
            <p style={{
              color: 'var(--color-error)', fontSize: 'var(--font-label-md)',
              marginBottom: 'var(--spacing-sm)', textAlign: 'right',
            }}>
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="lg" loading={loading} fullWidth>
            {t('onboarding.confirm')}
          </Button>
        </form>
      </div>
    </div>
  );
}
