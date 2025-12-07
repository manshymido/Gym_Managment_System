import React from 'react';
import headerStyles from '../../styles/Header.module.css';

const AuthHeader = ({ title, subtitle, style = {} }) => {
  return (
    <div 
      className={headerStyles.sectionHeaderCentered}
      style={style}
    >
      <h2 className={headerStyles.titleCentered}>
        {title}
      </h2>
      {subtitle && (
        <p className={headerStyles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;

