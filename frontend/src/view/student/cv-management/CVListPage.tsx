import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { listCvs, deleteCv } from '../../../data/repositories/cvRepository';
import { Button } from '../../shared/components/Button';
import { EmptyState } from '../../shared/components/EmptyState';
import { Loader } from '../../shared/components/Loader';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { CVAddModal } from './CVAddModal';
import type { Cv } from '../../../data/models';

export function CVListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Cv | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await listCvs();
      setCvs(data);
    } catch (err) {
      console.error('[CVListPage] listCvs error:', err);
      showToast(t('common.error'), 'error');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCv(deleteTarget._id);
      showToast('تم حذف السيرة الذاتية', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error('[CVListPage] deleteCv error:', err);
      showToast(t('common.error'), 'error');
    }
    setDeleting(false);
  }

  if (loading) return <Loader />;

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 'var(--spacing-md)',
      }}>
        <div>
          <h1 style={{
            color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
            fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
          }}>
            {t('student.myCvs')}
          </h1>
          <p style={{
            color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)',
          }}>
            {cvs.length > 0 ? `${cvs.length} سيرة ذاتية` : ''}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} size="md">
          + {t('student.addCv')}
        </Button>
      </div>

      {cvs.length === 0 ? (
        <EmptyState
          message={t('student.noCvs')}
          action={{ label: t('student.addCv'), onClick: () => setShowAdd(true) }}
          icon="📄"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {cvs.map((cv) => (
            <div
              key={cv._id}
              onClick={() => navigate(`/student/cvs/${cv._id}`)}
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-resting)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-resting)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-surface-container-high)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                }}>
                  📄
                </div>
                <div>
                  <h3 style={{
                    color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)',
                    fontWeight: 600, marginBottom: 2,
                  }}>
                    {cv.name}
                  </h3>
                  <p style={{
                    color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-label-md)',
                  }}>
                    {cv.extractedSkills.length} مهارات | {new Date(cv.createdAt).toLocaleDateString('ar-DZ')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost" size="sm"
                onClick={(e) => { e?.stopPropagation(); setDeleteTarget(cv); }}
              >
                {t('common.delete')}
              </Button>
            </div>
          ))}
        </div>
      )}

      <CVAddModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={load} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف السيرة الذاتية"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
