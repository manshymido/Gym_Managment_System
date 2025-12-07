import React, { useState, useRef, useCallback } from 'react';
import { colors, borderRadius, shadows, transitions, spacing } from '../../design-system/theme';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error = false,
  label,
  id,
  register, // react-hook-form register
  name, // react-hook-form name
  ...props
}) => {
  const [validationError, setValidationError] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Calculate border color based on state
  const getBorderColor = useCallback(() => {
    if (isInvalid || error) return colors.danger.main;
    if (isFocused && !disabled) return colors.primary.main;
    return colors.gray[200];
  }, [isInvalid, error, isFocused, disabled]);

  // Calculate box shadow based on state
  const getBoxShadow = useCallback(() => {
    if (isFocused && !disabled && !error && !isInvalid) {
      return `0 0 0 3px ${colors.primary.light}40`;
    }
    return 'none';
  }, [isFocused, disabled, error, isInvalid]);

  const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    border: `2px solid ${getBorderColor()}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: transitions.base,
    backgroundColor: disabled ? colors.gray[100] : colors.background.paper,
    color: colors.text.primary,
    boxShadow: getBoxShadow(),
    ...props.style
  };

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    // إزالة رسالة الخطأ عند التركيز
    setValidationError('');
    setIsInvalid(false);
    if (props.onFocus) {
      props.onFocus(e);
    }
  }, [props]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    
    // التحقق من الحقل المطلوب
    if (required && !e.target.value.trim()) {
      setIsInvalid(true);
      setValidationError('هذا الحقل مطلوب');
    }
    if (props.onBlur) {
      props.onBlur(e);
    }
  }, [required, props]);

  const handleInvalid = (e) => {
    e.preventDefault();
    setIsInvalid(true);
    
    const input = e.target;
    let errorMessage = '';
    
    // رسائل تحقق مخصصة بالعربية حسب نوع الخطأ
    if (input.validity.valueMissing) {
      errorMessage = label ? `يرجى إدخال ${label}` : 'هذا الحقل مطلوب';
    } else if (input.validity.typeMismatch) {
      if (type === 'email') {
        errorMessage = 'يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)';
      } else if (type === 'url') {
        errorMessage = 'يرجى إدخال رابط صحيح (مثال: https://example.com)';
      } else if (type === 'tel') {
        errorMessage = 'يرجى إدخال رقم هاتف صحيح';
      } else {
        errorMessage = 'صيغة القيمة المدخلة غير صحيحة';
      }
    } else if (input.validity.tooShort) {
      const minLength = input.minLength || input.getAttribute('minlength');
      errorMessage = `يجب أن يكون ${label || 'الحقل'} ${minLength} أحرف على الأقل`;
    } else if (input.validity.tooLong) {
      const maxLength = input.maxLength || input.getAttribute('maxlength');
      errorMessage = `يجب أن يكون ${label || 'الحقل'} ${maxLength} أحرف على الأكثر`;
    } else if (input.validity.rangeUnderflow) {
      const min = input.min || input.getAttribute('min');
      errorMessage = `القيمة يجب أن تكون ${min} أو أكثر`;
    } else if (input.validity.rangeOverflow) {
      const max = input.max || input.getAttribute('max');
      errorMessage = `القيمة يجب أن تكون ${max} أو أقل`;
    } else if (input.validity.stepMismatch) {
      errorMessage = 'القيمة المدخلة غير صحيحة حسب الخطوة المحددة';
    } else if (input.validity.patternMismatch) {
      if (type === 'password') {
        errorMessage = 'كلمة المرور يجب أن تحتوي على أحرف وأرقام';
      } else {
        errorMessage = `صيغة ${label || 'الحقل'} المدخلة غير صحيحة`;
      }
    } else if (input.validity.badInput) {
      errorMessage = 'القيمة المدخلة غير صالحة';
    } else {
      errorMessage = 'القيمة المدخلة غير صحيحة';
    }
    
    setValidationError(errorMessage);
    
    // إزالة رسالة HTML الافتراضية
    input.setCustomValidity('');
  };

  const handleChange = (e) => {
    // إزالة رسالة الخطأ عند البدء بالكتابة
    if (isInvalid) {
      setIsInvalid(false);
      setValidationError('');
    }
    if (onChange) {
      onChange(e);
    }
  };

  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined) || name;
  const displayError = validationError || (error && typeof error === 'string' ? error : '');
  const inputName = name || inputId;

  // Get register props from react-hook-form if provided
  const registerProps = register && name ? register(name, { required }) : {};

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: colors.text.secondary,
            marginBottom: spacing.sm
          }}
        >
          {label}
          {required && <span style={{ color: colors.danger.main, marginRight: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        ref={(e) => {
          inputRef.current = e;
          // If using react-hook-form, register the ref
          if (registerProps.ref) {
            registerProps.ref(e);
          }
        }}
        id={inputId}
        name={inputName}
        type={type}
        value={value !== undefined ? value : undefined}
        onChange={(e) => {
          handleChange(e);
          // Call react-hook-form onChange if provided
          if (registerProps.onChange) {
            registerProps.onChange(e);
          }
        }}
        onBlur={(e) => {
          handleBlur(e);
          // Call react-hook-form onBlur if provided
          if (registerProps.onBlur) {
            registerProps.onBlur(e);
          }
        }}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        onFocus={handleFocus}
        onInvalid={handleInvalid}
        aria-label={label || placeholder}
        aria-required={required}
        aria-invalid={isInvalid || !!error}
        aria-describedby={displayError ? `${inputId}-error` : undefined}
        {...(registerProps.name ? {} : { name: inputName })}
        {...props}
      />
      {displayError && (
        <div 
          id={`${inputId}-error`}
          role="alert"
          aria-live="polite"
          style={{
            marginTop: spacing.xs,
            color: colors.danger.main,
            fontSize: '0.75rem',
            fontWeight: 500,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {displayError}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Input;

