import React from 'react';
import { FORM_GRID_COLUMNS } from '../../design-system/constants';
import { spacing } from '../../design-system/theme';

const Form = ({
  children,
  onSubmit,
  gridColumns = 'auto',
  ...props
}) => {
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    ...props.style
  };

  return (
    <form onSubmit={onSubmit} style={formStyle} {...props}>
      {children}
    </form>
  );
};

const FormGroup = ({
  children,
  label,
  required = false,
  error,
  style = {}
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
      marginBottom: spacing.lg,
      ...style
    }}>
      {label && (
        <label style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#374151'
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginRight: '0.25rem' }}>*</span>}
        </label>
      )}
      {children}
      {error && typeof error === 'string' && (
        <span style={{
          fontSize: '0.75rem',
          color: '#ef4444',
          marginTop: '-0.75rem'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

const FormRow = ({
  children,
  columns = 'auto',
  gap = '1.5rem',
  style = {}
}) => {
  const gridColumnsValue = typeof columns === 'string' 
    ? FORM_GRID_COLUMNS[columns] || columns 
    : `repeat(${columns}, 1fr)`;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: gridColumnsValue,
      gap,
      marginBottom: spacing.base,
      ...style
    }}>
      {children}
    </div>
  );
};

const FormActions = ({
  children,
  gap = '1rem',
  style = {}
}) => {
  return (
    <div style={{
      display: 'flex',
      gap,
      marginTop: spacing.base,
      ...style
    }}>
      {children}
    </div>
  );
};

Form.Group = FormGroup;
Form.Row = FormRow;
Form.Actions = FormActions;

export default Form;

