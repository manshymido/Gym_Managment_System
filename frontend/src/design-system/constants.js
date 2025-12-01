// ثوابت التصميم الموحدة

export const STATUS_CONFIG = {
  active: {
    bg: '#ecfdf5',
    color: '#059669',
    text: 'نشط'
  },
  expired: {
    bg: '#fef3c7',
    color: '#d97706',
    text: 'منتهي'
  },
  suspended: {
    bg: '#fee2e2',
    color: '#dc2626',
    text: 'معلق'
  },
  cancelled: {
    bg: '#f3f4f6',
    color: '#6b7280',
    text: 'ملغي'
  },
  pending: {
    bg: '#fef3c7',
    color: '#d97706',
    text: 'قيد الانتظار'
  },
  completed: {
    bg: '#ecfdf5',
    color: '#059669',
    text: 'مكتمل'
  },
  failed: {
    bg: '#fee2e2',
    color: '#dc2626',
    text: 'فشل'
  }
};

export const PAYMENT_METHOD_CONFIG = {
  cash: {
    bg: '#f3f4f6',
    color: '#374151',
    text: 'نقدي'
  },
  card: {
    bg: '#dbeafe',
    color: '#1e40af',
    text: 'بطاقة'
  },
  online: {
    bg: '#e0e7ff',
    color: '#4338ca',
    text: 'أونلاين'
  }
};

export const BUTTON_VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    }
  },
  success: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
    }
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 5px rgba(245, 158, 11, 0.2)'
    }
  },
  danger: {
    background: '#ef4444',
    color: 'white',
    hover: {
      background: '#dc2626',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
    }
  },
  secondary: {
    background: '#ffffff',
    color: '#1f2937',
    border: '2px solid #e5e7eb',
    hover: {
      borderColor: '#667eea',
      backgroundColor: '#f8f9fa',
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }
  },
  cancel: {
    background: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb',
    hover: {
      backgroundColor: '#e5e7eb'
    }
  }
};

export const FORM_GRID_COLUMNS = {
  single: '1fr',
  double: 'repeat(2, 1fr)',
  triple: 'repeat(3, 1fr)',
  auto: 'repeat(auto-fit, minmax(250px, 1fr))'
};

