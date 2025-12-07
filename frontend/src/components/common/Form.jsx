import React from 'react';
import { FORM_GRID_COLUMNS } from '../../design-system/constants';
import formStyles from '../../styles/Form.module.css';

const Form = ({
  children,
  onSubmit,
  gridColumns = 'auto',
  handleSubmit, // react-hook-form handleSubmit
  ...props
}) => {
  // Support both react-hook-form and regular forms
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (handleSubmit) {
      // react-hook-form handleSubmit expects a callback
      handleSubmit((data) => {
        if (onSubmit) {
          onSubmit(e, data);
        }
      })(e);
    } else if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={formStyles.form} {...props}>
      {children}
    </form>
  );
};

const FormGroup = ({
  children,
  label,
  required = false,
  error,
  style = {},
  name // For react-hook-form error access
}) => {
  // Support react-hook-form errors from formState
  const displayError = error || (typeof error === 'object' && error?.message ? error.message : null);

  return (
    <div className={formStyles.formGroup} style={style}>
      {label && (
        <label className={formStyles.formLabel} htmlFor={name}>
          {label}
          {required && <span className={formStyles.formLabelRequired}>*</span>}
        </label>
      )}
      {children}
      {displayError && typeof displayError === 'string' && (
        <span className={formStyles.formError} role="alert">
          {displayError}
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
    <div 
      className={formStyles.formRow}
      style={{
        gridTemplateColumns: gridColumnsValue,
        gap,
        ...style
      }}
    >
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
    <div 
      className={formStyles.formActions}
      style={{ gap, ...style }}
    >
      {children}
    </div>
  );
};

Form.Group = FormGroup;
Form.Row = FormRow;
Form.Actions = FormActions;

export default Form;

