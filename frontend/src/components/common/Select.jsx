import React, { useState, useCallback } from 'react';
import { colors, borderRadius, shadows, transitions } from '../../design-system/theme';

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'اختر...',
  required = false,
  disabled = false,
  error = false,
  label,
  id,
  name,
  register, // react-hook-form register
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = useCallback(() => {
    if (error) return colors.danger.main;
    if (isFocused && !disabled) return colors.primary.main;
    return colors.gray[200];
  }, [error, isFocused, disabled]);

  const getBoxShadow = useCallback(() => {
    if (isFocused && !disabled && !error) {
      return `0 0 0 3px ${colors.primary.light}40`;
    }
    return 'none';
  }, [isFocused, disabled, error]);

  const selectStyle = {
    width: '100%',
    padding: '0.875rem',
    border: `2px solid ${getBorderColor()}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: transitions.base,
    backgroundColor: disabled ? colors.gray[100] : colors.background.paper,
    color: colors.text.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: getBoxShadow(),
    ...props.style
  };

  const handleFocus = useCallback((e) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  }, [props]);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  }, [props]);

  const selectId = id || (label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined) || name;
  const selectName = name || selectId;

  // Register with react-hook-form if provided
  const registerProps = register && name ? register(name, { required }) : {};

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: colors.text.secondary,
            marginBottom: '0.5rem'
          }}
        >
          {label}
          {required && <span style={{ color: colors.danger.main, marginRight: '0.25rem' }}>*</span>}
        </label>
      )}
      <select
        ref={(e) => {
          // If using react-hook-form, register the ref
          if (registerProps.ref) {
            registerProps.ref(e);
          }
        }}
        id={selectId}
        name={selectName}
        value={value !== undefined ? value : undefined}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
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
        required={required}
        disabled={disabled}
        style={selectStyle}
        onFocus={handleFocus}
        aria-label={label || placeholder}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...(registerProps.name ? {} : { name: selectName })}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          }
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
      {error && typeof error === 'string' && (
        <span 
          id={`${selectId}-error`}
          role="alert"
          aria-live="polite"
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: colors.danger.main,
            marginTop: '0.25rem'
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;

