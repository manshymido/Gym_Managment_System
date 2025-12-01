import React from 'react';
import { STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from '../../design-system/constants';
import { borderRadius } from '../../design-system/theme';

const Badge = ({
  status,
  paymentMethod,
  customConfig,
  children,
  ...props
}) => {
  let config = customConfig;

  if (!config) {
    if (status) {
      config = STATUS_CONFIG[status] || STATUS_CONFIG.active;
    } else if (paymentMethod) {
      config = PAYMENT_METHOD_CONFIG[paymentMethod] || PAYMENT_METHOD_CONFIG.cash;
    } else {
      config = {
        bg: '#f3f4f6',
        color: '#374151',
        text: children || 'حالة'
      };
    }
  }

  const badgeStyle = {
    display: 'inline-block',
    padding: '0.375rem 0.875rem',
    borderRadius: borderRadius.md,
    fontSize: '0.8125rem',
    fontWeight: 500,
    textAlign: 'center',
    backgroundColor: config.bg,
    color: config.color,
    ...props.style
  };

  return (
    <span style={badgeStyle} {...props}>
      {config.text || children}
    </span>
  );
};

export default Badge;

