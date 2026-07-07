import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../context/ToastContext';
import { getCv, updateCv, deleteCv, reprocessCv } from '../../../data/repositories/cvRepository';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { Loader } from '../../shared/components/Loader';
import { EmptyState } from '../../shared/components/EmptyState';
import { SkillChip } from '../../shared/components/SkillChip';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import type { Cv } from '../../../data/models';

export function CVDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cv, setCv] = useState<Cv | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reprocessing, setReprocessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCv(id).then((data) => {
      setCv(data);
      setName(data.name);
      setSkills(data.extractedSkills);
      setLoading(false);
    }).catch((err) => {
      console.error('[CVDetailPage] getCv error:', err);
      showToast(t('common.error'), 'error');
      setLoading(false);
    });
  }, [id]);

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    try {
      await updateCv(id, { name, extractedSkills: skills });
      showToast('تم حفظ التغييرات', 'success');
      navigate('/student/cvs');
    } catch (err) {
      console.error('[CVDetailPage] updateCv error:', err);
      showToast(t('common.error'), 'error');
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteCv(id);
      showToast('تم حذف السيرة الذاتية', 'success');
      navigate('/student/cvs');
    } catch (err) {
      console.error('[CVDetailPage] deleteCv error:', err);
      showToast(t('common.error'), 'error');
    }
    setDeleting(false);
  }

  async function handleReprocess() {
    if (!id) return;
    setReprocessing(true);
    try {
      const updated = await reprocessCv(id);
      setSkills(updated.extractedSkills);
      setCv(updated);
      showToast('تم استخراج المهارات بنجاح', 'success');
    } catch (err) {
      console.error('[CVDetailPage] reprocessCv error:', err);
      showToast('فشلت إعادة الاستخراج، حاول مرة أخرى', 'error');
    }
    setReprocessing(false);
  }

  function addSkill() {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  if (loading) return <Loader />;
  if (!cv) return <EmptyState message={t('common.error')} icon="⚠️" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Button variant="ghost" onClick={() => navigate('/student/cvs')} style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; {t('common.back')}
      </Button>

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
          {cv.name}
        </h1>

        <Input label={t('student.cvName')} name="name" value={name} onChange={(e) => setName(e.target.value)} />

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{
            display: 'block', marginBottom: 'var(--spacing-xs)',
            fontWeight: 'var(--font-label-md-weight)',
            fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface)',
            textAlign: 'right',
          }}>
            {t('student.extractedSkills')}
          </label>
          {skills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
              <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--spacing-md)' }}>
                لم يتم استخراج المهارات تلقائياً
              </p>
              <Button size="sm" onClick={handleReprocess} loading={reprocessing}>
                إعادة استخراج المهارات
              </Button>
            </div>
          ) : (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-sm)',
            }}>
              {skills.map((skill) => (
                <SkillChip key={skill} label={skill} onRemove={() => removeSkill(skill)} />
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            <Input
              label=""
              name="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="إضافة مهارة..."
            />
            <Button size="sm" onClick={addSkill}>+</Button>
          </div>
        </div>

        {cv.improvementTips && (
          <div style={{
            marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-lg)',
          }}>
            <h3 style={{
              marginBottom: 'var(--spacing-xs)', color: 'var(--color-primary)',
              fontSize: 'var(--font-body-lg)', fontWeight: 600,
            }}>
              {t('student.improvementTips')}
            </h3>
            <p style={{
              color: 'var(--color-on-surface)', whiteSpace: 'pre-line',
              fontSize: 'var(--font-body-md)', lineHeight: 'var(--font-body-md-line)',
            }}>
              {cv.improvementTips}
            </p>
          </div>
        )}

        <div style={{
          display: 'flex', gap: 'var(--spacing-sm)',
          justifyContent: 'flex-end', marginTop: 'var(--spacing-md)',
        }}>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            {t('common.delete')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/student/cvs')}>
            {t('common.back')}
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {t('common.save')}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="حذف السيرة الذاتية"
        message={`هل أنت متأكد من حذف "${cv.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
