import React from 'react';
import formStyles from '../../styles/Form.module.css';

const AuthForm = ({ children, onSubmit, style = {} }) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className={formStyles.form}
      style={style}
    >
      {children}
    </form>
  );
};

export default AuthForm;

