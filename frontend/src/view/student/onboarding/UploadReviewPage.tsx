import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { extractOnboardingProfile } from '../../../data/repositories/studentRepository';
import { registerStudent } from '../../../data/repositories/authRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';

export function UploadReviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', phone: '', location: '', education: '', bio: '' });
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleExtract() {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data = await extractOnboardingProfile(file);
      setForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        location: data.location || '',
        education: data.education || '',
        bio: data.bio || '',
      });
      showToast('تم استخراج المعلومات بنجاح', 'success');
      setStep('review');
    } catch (err) {
      setError(t('common.error'));
      console.error('[UploadReviewPage] extractOnboardingProfile error:', err);
    }
    setLoading(false);
  }

  async function handleConfirm() {
    setLoading(true);
    setError('');
    try {
      await registerStudent({ ...form, email, password, onboardingMethod: 'upload' });
      showToast('تم إنشاء الحساب بنجاح! ', 'success');
      navigate('/auth/student/login');
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      console.error('[UploadReviewPage] registerStudent error:', err);
    }
    setLoading(false);
  }

  if (loading && step === 'review') return <Loader text="جاري إنشاء الحساب..." />;

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
          {step === 'upload' ? t('onboarding.upload') : t('onboarding.review')}
        </h1>

        {step === 'upload' ? (
          <div>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label style={{
                display: 'block', marginBottom: 'var(--spacing-xs)',
                fontWeight: 'var(--font-label-md-weight)',
                fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface)',
                textAlign: 'right',
              }}>
                {t('student.uploadPdf')} *
              </label>
              <div
                role="button"
                tabIndex={0}
                aria-label="رفع ملف PDF"
                style={{
                  border: `2px dashed ${file ? 'var(--color-secondary)' : 'var(--color-outline-variant)'}`,
                  borderRadius: 'var(--radius-md)', padding: 'var(--spacing-lg)',
                  textAlign: 'center',
                  backgroundColor: file ? 'rgba(143, 174, 133, 0.05)' : 'var(--color-surface-container-low)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => document.getElementById('pdf-upload')?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('pdf-upload')?.click(); } }}
              >
                <div style={{ fontSize: 36, marginBottom: 'var(--spacing-xs)' }}>📄</div>
                <p style={{
                  color: file ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                  fontSize: 'var(--font-label-md)', fontWeight: file ? 600 : 400,
                }}>
                  {file ? file.name : t('student.clickToUpload')}
                </p>
                <input
                  id="pdf-upload" type="file" accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <Input label={t('auth.email')} name="email" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
            <Input label={t('auth.password')} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
            {error && (
              <p style={{
                color: 'var(--color-error)', fontSize: 'var(--font-label-md)',
                marginBottom: 'var(--spacing-sm)', textAlign: 'right',
              }}>
                {error}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Button onClick={handleExtract} disabled={!file || !email || !password} loading={loading} fullWidth>
                {t('onboarding.upload')}
              </Button>
              {!file && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-label-sm)' }}>يرجى اختيار ملف PDF</span>}
            </div>
          </div>
        ) : (
          <div>
            <p style={{
              color: 'var(--color-on-surface-variant)',
              marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-body-md)',
            }}>
              {t('onboarding.editing')}
            </p>
            <Input label={t('auth.fullName')} name="fullName" value={form.fullName} onChange={handleChange} />
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
            <Button onClick={handleConfirm} loading={loading} fullWidth>
              {t('onboarding.confirm')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
