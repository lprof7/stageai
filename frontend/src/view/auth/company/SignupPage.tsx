import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { registerCompany } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function CompanySignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '', email: '', password: '', description: '', location: '',
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
      await registerCompany(form);
      showToast(t('auth.pendingTitle') + '! ' + 'سيتم مراجعة حسابك', 'success');
      navigate('/auth/company/pending');
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[CompanySignupPage] registerCompany error:', err);
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
        {t('auth.companySignup')}
      </h2>
      <form onSubmit={handleSubmit}>
        <Input label={t('auth.companyName')} name="name" value={form.name} onChange={handleChange} required />
        <Input label={t('auth.email')} name="email" value={form.email} onChange={handleChange} required type="email" />
        <Input label={t('auth.password')} name="password" value={form.password} onChange={handleChange} required type="password" />
        <Input label="تأكيد كلمة المرور" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required type="password" />
        <Input label={t('auth.description')} name="description" value={form.description} onChange={handleChange} multiline rows={3} />
        <Input label={t('auth.location')} name="location" value={form.location} onChange={handleChange} />
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
        <Link to="/auth/company/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          {t('auth.login')}
        </Link>
      </p>
    </div>
  );
}
