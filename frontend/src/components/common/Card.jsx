import React from 'react';
import { colors, borderRadius, shadows, transitions } from '../../design-system/theme';

const Card = ({
  children,
  title,
  subtitle,
  padding = '2rem',
  hover = false,
  className = '',
  style = {},
  ...props
}) => {
  const cardStyle = {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding,
    boxShadow: shadows.base,
    transition: hover ? transitions.slow : 'none',
    ...style
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = shadows.lg;
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = shadows.base;
    }
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={hover ? handleMouseEnter : undefined}
      onMouseLeave={hover ? handleMouseLeave : undefined}
      {...props}
    >
      {title && (
        <div style={{ marginBottom: subtitle ? '0.5rem' : '1.5rem' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: colors.text.primary,
            margin: 0
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              fontSize: '1rem',
              color: colors.text.secondary,
              margin: '0.5rem 0 0 0'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;

