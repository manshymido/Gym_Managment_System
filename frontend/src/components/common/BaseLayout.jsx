import React, { useState, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import { colors, borderRadius, shadows, transitions, zIndex } from '../../design-system/theme';

/**
 * BaseLayout component مشترك لجميع Layouts
 * @param {Object} props
 * @param {Array} props.menuItems - قائمة عناصر القائمة
 * @param {string} props.headerTitle - عنوان الـ header
 * @param {string} props.sidebarTitle - عنوان الـ sidebar
 * @param {string} props.sidebarSubtitle - عنوان فرعي للـ sidebar
 * @param {string} props.userRole - دور المستخدم للعرض
 * @param {string} props.logoutPath - مسار تسجيل الخروج
 * @param {ReactNode} props.children - المحتوى
 */
const BaseLayout = ({
  menuItems,
  headerTitle,
  sidebarTitle,
  sidebarSubtitle,
  userRole,
  logoutPath,
  children
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    navigate(logoutPath);
  }, [logout, navigate, logoutPath]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  const handleMenuClick = useCallback((path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  }, [navigate, location.pathname]);

  // Memoize sidebar styles
  const sidebarStyle = useMemo(() => ({
    backgroundColor: colors.background.paper,
    boxShadow: shadows.base,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    zIndex: zIndex.dropdown,
    transition: transitions.slow,
    width: sidebarOpen ? '250px' : '80px'
  }), [sidebarOpen]);

  const mainContentStyle = useMemo(() => ({
    flex: 1,
    marginRight: sidebarOpen ? '250px' : '80px',
    display: 'flex',
    flexDirection: 'column',
    transition: transitions.slow
  }), [sidebarOpen]);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background.default
    }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: sidebarSubtitle ? 'flex-start' : 'center',
          background: colors.primary.gradient,
          color: 'white'
        }}>
          {sidebarOpen && (
            sidebarSubtitle ? (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: '0 0 0.25rem 0'
                }}>
                  {sidebarTitle}
                </h2>
                <p style={{
                  fontSize: '0.75rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  {sidebarSubtitle}
                </p>
              </div>
            ) : (
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: 0
              }}>
                {sidebarTitle}
              </h2>
            )
          )}
          <button
            onClick={toggleSidebar}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: borderRadius.sm,
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
            aria-label={sidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav style={{
          padding: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flex: 1
        }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const menuItemStyle = useMemo(() => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              border: 'none',
              background: active ? colors.primary.gradient : 'transparent',
              color: active ? 'white' : colors.text.secondary,
              cursor: 'pointer',
              fontSize: '1rem',
              transition: transitions.base,
              textAlign: 'right',
              width: '100%',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRight: active ? `4px solid ${colors.primary.dark}` : 'none'
            }), [active, sidebarOpen]);
            
            return (
              <button
                key={item.path}
                onClick={() => handleMenuClick(item.path)}
                style={menuItemStyle}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                <span style={{ fontSize: '1.25rem', minWidth: '24px' }} aria-hidden="true">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Header */}
        <header style={{
          backgroundColor: colors.background.paper,
          padding: '1.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: shadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: zIndex.sticky
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              background: colors.primary.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {headerTitle}
            </h1>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                fontSize: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: colors.primary.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👤
              </span>
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{
                  fontWeight: 600,
                  color: colors.text.primary,
                  fontSize: '0.875rem'
                }}>
                  {user?.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: colors.text.secondary
                }}>
                  {userRole}
                </span>
              </div>
            </div>
            <Button
              variant="danger"
              icon="🚪"
              size="sm"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          padding: '2rem',
          flex: 1
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Memoize BaseLayout with custom comparison
export default memo(BaseLayout, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.menuItems === nextProps.menuItems &&
    prevProps.headerTitle === nextProps.headerTitle &&
    prevProps.sidebarTitle === nextProps.sidebarTitle &&
    prevProps.sidebarSubtitle === nextProps.sidebarSubtitle &&
    prevProps.userRole === nextProps.userRole &&
    prevProps.logoutPath === nextProps.logoutPath &&
    prevProps.children === nextProps.children
  );
});

