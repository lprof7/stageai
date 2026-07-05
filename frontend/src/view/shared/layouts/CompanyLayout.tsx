import { useState, useId } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';

const iconMap: Record<string, string> = {
  '/company/offers': '📋',
  '/company/applications': '👥',
  '/company/profile': '🏢',
};

export function CompanyLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { to: '/company/offers', label: t('company.myOffers') },
    { to: '/company/applications', label: t('company.applications') },
    { to: '/company/profile', label: t('company.profile') },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      <nav aria-label="القائمة الرئيسية" style={{
        width: sidebarOpen ? 260 : 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-primary-container)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
      }}>
        <div style={{
          padding: 'var(--spacing-md) var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 'var(--spacing-sm)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'var(--color-on-primary)',
            flexShrink: 0,
          }}>
            S
          </div>
          <span style={{
            color: 'var(--color-on-primary-container)',
            fontSize: 'var(--font-headline-md)',
            fontWeight: 'var(--font-headline-md-weight)',
            whiteSpace: 'nowrap',
          }}>
            {t('app.shortName')}
          </span>
        </div>

        <div style={{ padding: '0 var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-primary-container)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 'var(--font-body-md)',
                textDecoration: 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              })}
            >
              <span style={{ fontSize: 18 }}>{iconMap[link.to]}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-sm)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-on-secondary)',
              fontWeight: 700, fontSize: 14,
            }}>
              {user?.name?.charAt(0) || '?'}
            </div>
            <span style={{
              color: 'var(--color-on-primary-container)',
              fontSize: 'var(--font-label-md)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.name}
            </span>
          </div>
          <button
            onClick={() => { logout(); navigate('/auth/company/login'); }}
            aria-label="تسجيل الخروج"
            style={{
              width: '100%', padding: '8px 16px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--color-on-primary-container)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer', fontWeight: 500,
              fontSize: 'var(--font-label-md)',
              textAlign: 'right',
            }}
          >
            {t('auth.logout')}
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderBottom: '1px solid var(--color-surface-container-high)',
          minHeight: 64,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="فتح القائمة"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: 'var(--color-on-surface-variant)',
              padding: '4px 8px',
            }}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span style={{
            fontSize: 'var(--font-label-md)', color: 'var(--color-on-surface-variant)',
          }}>
            {t('app.shortName')}
          </span>
        </header>
        <main style={{
          flex: 1, padding: 'var(--spacing-md)',
          overflowY: 'auto',
          maxWidth: 'var(--spacing-container-max)',
          width: '100%', margin: '0 auto',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
