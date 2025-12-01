import React from 'react';
import { colors } from '../../design-system/theme';

const LoadingSpinner = ({
  message = 'جاري التحميل...',
  size = 40,
  style = {}
}) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem',
    ...style
  };

  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid ${colors.gray[200]}`,
    borderTop: `4px solid ${colors.primary.main}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const messageStyle = {
    color: colors.text.secondary,
    fontSize: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

