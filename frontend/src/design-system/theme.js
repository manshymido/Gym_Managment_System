// نظام التصميم الموحد - الألوان، الخطوط، المسافات

export const colors = {
  // الألوان الأساسية
  primary: {
    main: '#667eea',
    dark: '#764ba2',
    light: '#e0e7ff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  secondary: {
    main: '#10b981',
    dark: '#059669',
    light: '#ecfdf5',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  success: {
    main: '#10b981',
    dark: '#059669',
    light: '#ecfdf5'
  },
  warning: {
    main: '#f59e0b',
    dark: '#d97706',
    light: '#fffbeb'
  },
  danger: {
    main: '#ef4444',
    dark: '#dc2626',
    light: '#fee2e2'
  },
  info: {
    main: '#3b82f6',
    dark: '#2563eb',
    light: '#eff6ff'
  },
  // الألوان المحايدة
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  // الألوان الأساسية للنصوص
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    disabled: '#9ca3af'
  },
  // الألوان الأساسية للخلفيات
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    hover: '#f9fafb'
  }
};

export const typography = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem'   // 40px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75
  }
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  base: '1rem',    // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '4rem'    // 64px
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px'
};

export const shadows = {
  sm: '0 2px 5px rgba(0,0,0,0.05)',
  base: '0 4px 20px rgba(0,0,0,0.08)',
  md: '0 4px 15px rgba(0,0,0,0.1)',
  lg: '0 8px 25px rgba(0,0,0,0.12)',
  colored: {
    primary: '0 4px 15px rgba(102, 126, 234, 0.3)',
    success: '0 4px 15px rgba(16, 185, 129, 0.3)',
    warning: '0 2px 5px rgba(245, 158, 11, 0.2)',
    danger: '0 2px 5px rgba(239, 68, 68, 0.2)'
  }
};

export const transitions = {
  fast: '0.15s ease',
  base: '0.2s ease',
  slow: '0.3s ease'
};

export const zIndex = {
  dropdown: 1000,
  sticky: 100,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
};

