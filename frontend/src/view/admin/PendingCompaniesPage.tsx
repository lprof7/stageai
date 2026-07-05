import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import httpClient from '../../data/api/httpClient';
import { Button } from '../shared/components/Button';
import { Loader } from '../shared/components/Loader';
import { EmptyState } from '../shared/components/EmptyState';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';

export function PendingCompaniesPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState<{ id: string; name: string; action: 'approved' | 'rejected' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await httpClient.get('/admin/companies/pending');
      setCompanies(res.data);
    } catch (err) {
      console.error('[PendingCompaniesPage] load error:', err);
      showToast('تعذر تحميل الشركات المعلقة', 'error');
    }
    setLoading(false);
  }

  async function handleAction() {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      await httpClient.put(`/admin/companies/${actionTarget.id}/status`, { status: actionTarget.action });
      showToast(actionTarget.action === 'approved' ? 'تم قبول الشركة' : 'تم رفض الشركة', 'success');
      setActionTarget(null);
      load();
    } catch (err) {
      console.error('[PendingCompaniesPage] handleAction error:', err);
      showToast('تعذر تحديث حالة الشركة', 'error');
    }
    setActionLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--spacing-lg)' }}>
      <h1 style={{
        color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
        fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-md)',
      }}>
        الشركات المعلقة
      </h1>

      {companies.length === 0 ? (
        <EmptyState message="لا توجد شركات معلقة" icon="✅" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {companies.map((c) => (
            <div key={c._id} style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-md)',
              boxShadow: 'var(--shadow-resting)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{
                    color: 'var(--color-primary)', fontSize: 'var(--font-body-lg)',
                    fontWeight: 600, marginBottom: 'var(--spacing-xs)',
                  }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)', marginBottom: 2 }}>
                    {c.email} {c.location ? `| ${c.location}` : ''}
                  </p>
                  {c.description && (
                    <p style={{ fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)' }}>
                      {c.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Button variant="danger" size="sm" onClick={() => setActionTarget({ id: c._id, name: c.name, action: 'rejected' })}>
                    رفض
                  </Button>
                  <Button size="sm" onClick={() => setActionTarget({ id: c._id, name: c.name, action: 'approved' })}>
                    قبول
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={actionTarget?.action === 'rejected'}
        title="رفض الشركة"
        message={`هل أنت متأكد من رفض "${actionTarget?.name}"؟`}
        confirmLabel="رفض"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setActionTarget(null)}
      />

      <ConfirmDialog
        open={actionTarget?.action === 'approved'}
        title="قبول الشركة"
        message={`هل أنت متأكد من قبول "${actionTarget?.name}"؟`}
        confirmLabel="قبول"
        variant="primary"
        loading={actionLoading}
        onConfirm={handleAction}
        onCancel={() => setActionTarget(null)}
      />
    </div>
  );
}
