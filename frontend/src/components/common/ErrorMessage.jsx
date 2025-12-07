import React from 'react';
import formStyles from '../../styles/Form.module.css';

const ErrorMessage = ({ message, style = {} }) => {
  if (!message) return null;

  return (
    <div className={formStyles.errorMessage} style={style}>
      {message}
    </div>
  );
};

export default React.memo(ErrorMessage);

