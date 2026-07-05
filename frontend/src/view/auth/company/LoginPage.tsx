import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { loginCompany } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function CompanyLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginCompany(form.email, form.password);
      if (res.company) {
        if (res.company.status === 'pending') {
          showToast('حسابك لم يتم الموافقة عليه بعد. يرجى الانتظار حتى مراجعة الإدارة.', 'info');
          navigate('/auth/company/pending');
          return;
        }
        setAuth(res.token, { id: res.company.id, name: res.company.name, email: res.company.email }, 'company');
        showToast(`مرحباً ${res.company.name}`, 'success');
        navigate('/company/offers');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[CompanyLoginPage] loginCompany error:', err);
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
        {t('auth.companyLogin')}
      </h2>
      <form onSubmit={handleSubmit}>
        <Input label={t('auth.email')} name="email" value={form.email} onChange={handleChange} required type="email" />
        <Input label={t('auth.password')} name="password" value={form.password} onChange={handleChange} required type="password" />
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
          {t('auth.login')}
        </Button>
      </form>
      <div style={{
        marginTop: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
      }}>
        <p style={{
          color: 'var(--color-on-surface-variant)',
          fontSize: 'var(--font-label-md)',
        }}>
          {t('auth.noAccount')}{' '}
          <Link to="/auth/company/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {t('auth.companySignup')}
          </Link>
        </p>
        <Link to="/auth/student/login" style={{
          color: 'var(--color-secondary)',
          fontSize: 'var(--font-label-md)',
          fontWeight: 500,
        }}>
          {t('auth.studentLogin')}
        </Link>
      </div>
    </div>
  );
}
