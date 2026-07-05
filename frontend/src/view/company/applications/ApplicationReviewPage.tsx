import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getApplicationDetail, updateApplicationStatus } from '../../../data/repositories/applicationRepository';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { SkillChip } from '../../shared/components/SkillChip';
import { Loader } from '../../shared/components/Loader';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';

const statusColors: Record<string, string> = {
  pending: 'var(--color-tertiary)',
  accepted: 'var(--color-secondary)',
  rejected: 'var(--color-error)',
};

export function ApplicationReviewPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    if (!id) return;
    getApplicationDetail(id).then((data) => {
      setApp(data);
      setLoading(false);
    }).catch((err) => {
      console.error('[ApplicationReviewPage] getApplicationDetail error:', err);
      showToast('تعذر تحميل تفاصيل التقديم', 'error');
      setLoading(false);
    });
  }, [id]);

  async function handleStatus(status: 'accepted' | 'rejected') {
    if (!id) return;
    setActionLoading(true);
    try {
      await updateApplicationStatus(id, status);
      const data = await getApplicationDetail(id);
      setApp(data);
      showToast(status === 'accepted' ? 'تم قبول الطلب' : 'تم رفض الطلب', 'success');
    } catch (err) {
      console.error('[ApplicationReviewPage] updateApplicationStatus error:', err);
      showToast('تعذر تحديث حالة الطلب', 'error');
    }
    setActionLoading(false);
    setConfirmAction(null);
  }

  if (loading) return <Loader />;
  if (!app) return <p>{t('common.error')}</p>;

  const student = app.studentId;
  const offer = app.offerId;

  return (
    <div style={{ maxWidth: 720 }}>
      <Button variant="ghost" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-xl)', padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-resting)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <div>
            <h1 style={{
              color: 'var(--color-primary)', fontSize: 'var(--font-headline-lg)',
              fontWeight: 'var(--font-headline-lg-weight)', marginBottom: 'var(--spacing-xs)',
            }}>
              {student?.fullName}
            </h1>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-body-md)' }}>
              {t('student.matchPercentage')}:{' '}
              <span style={{
                fontWeight: 700,
                color: app.matchPercentageSnapshot >= 80 ? 'var(--color-secondary)' :
                  app.matchPercentageSnapshot >= 50 ? '#d4a843' : 'var(--color-tertiary)',
              }}>
                {app.matchPercentageSnapshot}%
              </span>
            </p>
          </div>
          <Badge label={t(`student.${app.status}`)} color={statusColors[app.status] || 'var(--color-outline)'} />
        </div>

        <div style={{
          marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-lg)',
        }}>
          {student?.education && (
            <p style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-body-md)' }}>
              <strong>التعليم:</strong> {student.education}
            </p>
          )}
          {student?.bio && (
            <p style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-body-md)' }}>
              <strong>نبذة:</strong> {student.bio}
            </p>
          )}
          {student?.location && (
            <p style={{ fontSize: 'var(--font-body-md)' }}>
              <strong>{t('auth.location')}:</strong> {student.location}
            </p>
          )}
        </div>

        {app.motivationLetter && (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{
              marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              {t('student.motivationLetter')}
            </h3>
            <div style={{
              padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-container-low)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <p style={{
                whiteSpace: 'pre-line', color: 'var(--color-on-surface)',
                fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
              }}>
                {app.motivationLetter}
              </p>
            </div>
          </div>
        )}

        {app.cvId?.extractedSkills?.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{
              marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              المهارات
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
              {app.cvId.extractedSkills.map((s: string) => (
                <SkillChip key={s} label={s} />
              ))}
            </div>
          </div>
        )}

        {app.status === 'pending' && (
          <div style={{
            display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end',
            marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-surface-container-high)',
          }}>
            <Button variant="danger" onClick={() => setConfirmAction('rejected')} loading={actionLoading && confirmAction === 'rejected'}>
              {t('company.reject')}
            </Button>
            <Button onClick={() => setConfirmAction('accepted')} loading={actionLoading && confirmAction === 'accepted'}>
              {t('company.accept')}
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmAction === 'rejected'}
        title="رفض الطلب"
        message="هل أنت متأكد من رفض هذا الطلب؟"
        confirmLabel="رفض"
        variant="danger"
        loading={actionLoading}
        onConfirm={() => handleStatus('rejected')}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === 'accepted'}
        title="قبول الطلب"
        message="هل أنت متأكد من قبول هذا الطلب؟"
        confirmLabel="قبول"
        variant="primary"
        loading={actionLoading}
        onConfirm={() => handleStatus('accepted')}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
