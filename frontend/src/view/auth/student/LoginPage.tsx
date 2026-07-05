import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { loginStudent } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export function StudentLoginPage() {
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
      const res = await loginStudent(form.email, form.password);
      if (res.student) {
        const role = res.student.role === 'admin' ? 'admin' : 'student';
        setAuth(res.token, { id: res.student.id, name: res.student.fullName, email: res.student.email }, role);
        showToast(`مرحباً ${res.student.fullName}`, 'success');
        navigate(role === 'admin' ? '/admin' : '/student/cvs');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[LoginPage] loginStudent error:', err);
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
        {t('auth.studentLogin')}
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
          <Link to="/auth/student/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {t('auth.studentSignup')}
          </Link>
        </p>
        <Link to="/auth/company/login" style={{
          color: 'var(--color-secondary)',
          fontSize: 'var(--font-label-md)',
          fontWeight: 500,
        }}>
          {t('auth.companyLogin')}
        </Link>
      </div>
    </div>
  );
}
