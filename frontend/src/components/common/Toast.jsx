import React, { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { colors, borderRadius, shadows } from '../../design-system/theme';

const Toast = ({ notification }) => {
  const { removeNotification } = useNotification();

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification, removeNotification]);

  const getTypeStyles = (type) => {
    const styles = {
      success: {
        backgroundColor: '#ecfdf5',
        borderColor: '#10b981',
        icon: '✅',
        color: '#059669'
      },
      error: {
        backgroundColor: '#fee2e2',
        borderColor: '#ef4444',
        icon: '❌',
        color: '#dc2626'
      },
      warning: {
        backgroundColor: '#fef3c7',
        borderColor: '#f59e0b',
        icon: '⚠️',
        color: '#d97706'
      },
      info: {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
        icon: 'ℹ️',
        color: '#2563eb'
      }
    };
    return styles[type] || styles.info;
  };

  const typeStyles = getTypeStyles(notification.type);

  const toastStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    backgroundColor: typeStyles.backgroundColor,
    border: `2px solid ${typeStyles.borderColor}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.lg,
    minWidth: '300px',
    maxWidth: '500px',
    animation: 'slideIn 0.3s ease-out',
    position: 'relative'
  };

  const messageStyle = {
    flex: 1,
    color: typeStyles.color,
    fontSize: '0.9375rem',
    fontWeight: 500,
    margin: 0
  };

  const iconStyle = {
    fontSize: '1.25rem',
    flexShrink: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: typeStyles.color,
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.25rem',
    lineHeight: 1,
    opacity: 0.7,
    transition: 'opacity 0.2s ease'
  };

  return (
    <div style={toastStyle}>
      <span style={iconStyle}>{typeStyles.icon}</span>
      <p style={messageStyle}>{notification.message}</p>
      <button
        style={closeButtonStyle}
        onClick={() => removeNotification(notification.id)}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        aria-label="إغلاق"
      >
        ✕
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { notifications } = useNotification();

  const containerStyle = {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      {notifications.map(notification => (
        <div key={notification.id} style={{ pointerEvents: 'auto' }}>
          <Toast notification={notification} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

