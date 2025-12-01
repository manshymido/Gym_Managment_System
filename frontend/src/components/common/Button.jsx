import React from 'react';
import { BUTTON_VARIANTS } from '../../design-system/constants';
import { borderRadius, shadows, transitions } from '../../design-system/theme';

const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  icon,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const variantStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  
  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    md: {
      padding: '0.875rem 1.5rem',
      fontSize: '1rem'
    },
    lg: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: variantStyle.border || 'none',
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500,
    transition: transitions.base,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
    ...sizeStyles[size],
    background: variantStyle.background,
    color: variantStyle.color,
    boxShadow: variant === 'primary' || variant === 'success' 
      ? shadows.colored.primary 
      : shadows.sm
  };

  const handleMouseEnter = (e) => {
    if (!disabled && variantStyle.hover) {
      Object.assign(e.target.style, variantStyle.hover);
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && variantStyle.hover) {
      e.target.style.transform = '';
      e.target.style.boxShadow = baseStyle.boxShadow;
      if (variantStyle.hover.background) {
        e.target.style.background = variantStyle.background;
      }
      if (variantStyle.hover.borderColor) {
        e.target.style.borderColor = variantStyle.border;
      }
      if (variantStyle.hover.backgroundColor) {
        e.target.style.backgroundColor = variantStyle.background || 'transparent';
      }
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

