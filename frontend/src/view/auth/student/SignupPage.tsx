import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { registerStudent } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function StudentSignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      showToast(t('onboarding.confirm') + '! ' + t('auth.login') + ' من فضلك', 'success');
      navigate('/auth/student/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[SignupPage] registerStudent error:', err);
    }
    setLoading(false);
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-resting)',
    }}>
      <h2 style={{
        marginBottom: 'var(--spacing-md)',
        color: 'var(--color-primary)',
        fontSize: 'var(--font-headline-md)',
        fontWeight: 'var(--font-headline-md-weight)',
      }}>
        {t('auth.studentSignup')}
      </h2>
      <form onSubmit={handleSubmit}>
        <Input label={t('auth.fullName')} name="fullName" value={form.fullName} onChange={handleChange} required />
        <Input label={t('auth.email')} name="email" value={form.email} onChange={handleChange} required type="email" />
        <Input label={t('auth.password')} name="password" value={form.password} onChange={handleChange} required type="password" />
        <Input label="تأكيد كلمة المرور" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required type="password" />
        {error && (
          <p style={{
            color: 'var(--color-error)',
            fontSize: 'var(--font-label-md)',
            marginBottom: 'var(--spacing-sm)',
            textAlign: 'right',
          }}>
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          {t('auth.signup')}
        </Button>
      </form>
      <p style={{
        marginTop: 'var(--spacing-md)',
        textAlign: 'center',
        color: 'var(--color-on-surface-variant)',
        fontSize: 'var(--font-label-md)',
      }}>
        {t('auth.hasAccount')}{' '}
        <Link to="/auth/student/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {t('auth.login')}
        </Link>
      </p>
      <p style={{ marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
        <Link to="/student/onboarding/choice" style={{
          color: 'var(--color-secondary)',
          fontSize: 'var(--font-label-md)',
          fontWeight: 500,
        }}>
          {t('onboarding.upload')}
        </Link>
      </p>
    </div>
  );
}
