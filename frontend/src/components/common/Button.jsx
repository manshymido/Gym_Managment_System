import React, { useState } from 'react';
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
  style = {},
  'aria-label': ariaLabel,
  ...props
}) => {
  const variantStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const [isHovered, setIsHovered] = useState(false);
  
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

  const getBoxShadow = () => {
    if (isHovered && variantStyle.hover?.boxShadow) {
      return variantStyle.hover.boxShadow;
    }
    if (variant === 'primary' || variant === 'success') {
      return shadows.colored.primary;
    }
    return shadows.sm;
  };

  const getBackground = () => {
    // إذا كان هناك style.background مخصص، استخدمه أولاً
    if (style?.background || style?.backgroundColor) {
      if (isHovered && variantStyle.hover?.backgroundColor) {
        return variantStyle.hover.backgroundColor;
      }
      return style.background || style.backgroundColor || variantStyle.background;
    }
    
    if (isHovered && variantStyle.hover?.background) {
      return variantStyle.hover.background;
    }
    if (isHovered && variantStyle.hover?.backgroundColor) {
      return variantStyle.hover.backgroundColor;
    }
    return variantStyle.background;
  };
  
  const getColor = () => {
    // إذا كان هناك style.color مخصص، استخدمه
    if (style?.color) {
      return style.color;
    }
    return variantStyle.color;
  };

  const getBorderColor = () => {
    if (isHovered && variantStyle.hover?.borderColor) {
      return variantStyle.hover.borderColor;
    }
    if (variantStyle.border && variantStyle.border !== 'none') {
      const borderParts = variantStyle.border.split(' ');
      return borderParts[borderParts.length - 1] || undefined;
    }
    return undefined;
  };

  const getTransform = () => {
    if (disabled) return 'none';
    if (isHovered && variantStyle.hover?.transform) {
      return variantStyle.hover.transform;
    }
    return 'none';
  };

  const borderStyle = variantStyle.border || 'none';
  const borderColor = getBorderColor();

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: borderStyle,
    ...(borderColor && { borderColor }),
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 500,
    transition: `${transitions.base}, transform ${transitions.base}`,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
    ...sizeStyles[size],
    background: getBackground(),
    color: getColor(),
    boxShadow: getBoxShadow(),
    transform: getTransform()
  };
  
  // دمج الأنماط مع إعطاء الأولوية لـ style المخصص
  const finalStyle = {
    ...baseStyle,
    ...style,
    // التأكد من أن background و color من style المخصص لهما الأولوية
    ...(style?.background && { background: style.background }),
    ...(style?.backgroundColor && { background: style.backgroundColor }),
    ...(style?.color && { color: style.color })
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Generate aria-label if not provided but children is a string
  const buttonAriaLabel = ariaLabel || (typeof children === 'string' ? children : undefined);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={finalStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={buttonAriaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

export default React.memo(Button);

