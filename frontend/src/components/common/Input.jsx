import React from 'react';
import { colors, borderRadius, shadows, transitions } from '../../design-system/theme';

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
  ...props
}) => {
  const inputStyle = {
    width: '100%',
    padding: '0.875rem',
    border: `2px solid ${error ? colors.danger.main : colors.gray[200]}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: transitions.base,
    backgroundColor: disabled ? colors.gray[100] : colors.background.paper,
    color: colors.text.primary,
    ...props.style
  };

  const handleFocus = (e) => {
    if (!disabled && !error) {
      e.target.style.borderColor = colors.primary.main;
      e.target.style.boxShadow = `0 0 0 3px ${colors.primary.light}40`;
    }
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? colors.danger.main : colors.gray[200];
    e.target.style.boxShadow = 'none';
  };

  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

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
            marginBottom: '0.5rem'
          }}
        >
          {label}
          {required && <span style={{ color: colors.danger.main, marginRight: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && typeof error === 'string' && (
        <span style={{
          display: 'block',
          fontSize: '0.75rem',
          color: colors.danger.main,
          marginTop: '0.25rem'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;

