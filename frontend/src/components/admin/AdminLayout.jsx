import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import { colors, borderRadius, shadows, transitions, zIndex } from '../../design-system/theme';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'الرئيسية', icon: '📊' },
    { path: '/admin/gym-managers', label: 'مديرو الجيمات', icon: '👥' },
    { path: '/admin/subscriptions', label: 'الاشتراكات', icon: '📋' },
    { path: '/admin/plans', label: 'الباقات', icon: '💳' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background.default
    }}>
      {/* Sidebar */}
      <aside style={{
        backgroundColor: colors.background.paper,
        boxShadow: shadows.base,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: zIndex.dropdown,
        transition: transitions.slow,
        width: sidebarOpen ? '250px' : '80px'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${colors.gray[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: colors.primary.gradient,
          color: 'white'
        }}>
          {sidebarOpen && (
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              margin: 0
            }}>
              نظام الإدارة
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: borderRadius.sm,
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
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
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1.5rem',
                border: 'none',
                background: isActive(item.path) ? colors.primary.gradient : 'transparent',
                color: isActive(item.path) ? 'white' : colors.text.secondary,
                cursor: 'pointer',
                fontSize: '1rem',
                transition: transitions.base,
                textAlign: 'right',
                width: '100%',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                borderRight: isActive(item.path) ? `4px solid ${colors.primary.dark}` : 'none'
              }}
            >
              <span style={{ fontSize: '1.25rem', minWidth: '24px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginRight: sidebarOpen ? '250px' : '80px',
        display: 'flex',
        flexDirection: 'column',
        transition: transitions.slow
      }}>
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
              لوحة تحكم المدير
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
                  مدير النظام
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

export default AdminLayout;
