import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { createCv } from '../../../data/repositories/cvRepository';
import { Modal } from '../../shared/components/Modal';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';

interface CVAddModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CVAddModal({ open, onClose, onCreated }: CVAddModalProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !file) {
      setError(!name ? t('student.cvNameRequired') : t('student.uploadPdfRequired'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await createCv(name, file);
      if ((result as any).warnings?.length) {
        (result as any).warnings.forEach((w: string) => showToast(w, 'warning'));
      }
      showToast('تم إضافة السيرة الذاتية', 'success');
      onCreated();
      onClose();
      setName('');
      setFile(null);
    } catch (err: any) {
      console.error('[CVAddModal] createCv error:', err);
      const msg = err.response?.data?.message || t('common.error');
      setError(msg);
      showToast(msg, 'error');
    }
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} title={t('student.addCv')}>
      <form onSubmit={handleSubmit}>
        <Input label={t('student.cvName')} name="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} />
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
            aria-label={t('student.clickToUpload')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('modal-pdf-upload')?.click(); } }}
            style={{
              border: `2px dashed ${file ? 'var(--color-secondary)' : 'var(--color-outline-variant)'}`,
              borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
              textAlign: 'center',
              backgroundColor: file ? 'rgba(143,174,133,0.05)' : 'var(--color-surface-container-low)',
              cursor: 'pointer',
            }}
            onClick={() => document.getElementById('modal-pdf-upload')?.click()}
          >
            <p style={{
              color: file ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
              fontSize: 'var(--font-label-md)', fontWeight: file ? 600 : 400,
            }}>
              {file ? file.name : t('student.clickToUpload')}
            </p>
            <input
              id="modal-pdf-upload" type="file" accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }} required
            />
          </div>
        </div>
        {error && (
          <p style={{
            color: 'var(--color-error)', fontSize: 'var(--font-label-md)',
            marginBottom: 'var(--spacing-sm)', textAlign: 'right',
          }}>
            {error}
          </p>
        )}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!name || !file} loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
