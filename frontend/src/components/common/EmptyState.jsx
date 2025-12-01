import React from 'react';
import { colors, borderRadius, shadows } from '../../design-system/theme';

const EmptyState = ({
  icon = '📋',
  message = 'لا توجد بيانات',
  description,
  action,
  actionLabel,
  onActionClick,
  style = {}
}) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.base,
    color: colors.gray[400],
    ...style
  };

  const iconStyle = {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  };

  const messageStyle = {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: colors.text.secondary,
    margin: 0,
    marginBottom: description ? '0.5rem' : action ? '1rem' : 0
  };

  const descriptionStyle = {
    fontSize: '0.9375rem',
    color: colors.text.secondary,
    margin: 0,
    marginBottom: action ? '1rem' : 0,
    textAlign: 'center',
    maxWidth: '400px'
  };

  return (
    <div style={containerStyle}>
      <span style={iconStyle}>{icon}</span>
      <p style={messageStyle}>{message}</p>
      {description && <p style={descriptionStyle}>{description}</p>}
      {action && (
        <button
          onClick={onActionClick}
          style={{
            padding: '0.875rem 1.5rem',
            backgroundColor: colors.primary.main,
            color: 'white',
            border: 'none',
            borderRadius: borderRadius.md,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
        >
          {actionLabel || 'إضافة جديد'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

