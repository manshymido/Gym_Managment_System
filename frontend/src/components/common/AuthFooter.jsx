import React from 'react';
import { Link } from 'react-router-dom';
import footerStyles from '../../styles/Footer.module.css';

const AuthFooter = ({ links = [] }) => {
  if (links.length === 0) return null;

  return (
    <div className={footerStyles.sectionFooterSimple}>
      {links.map((link, index) => (
        <p key={index} className={footerStyles.footerTextSecondary}>
          {link.text && <span>{link.text}{' '}</span>}
          {link.to ? (
            <Link to={link.to} className={footerStyles.footerLink}>
              {link.label}
            </Link>
          ) : (
            <a 
              href={link.href} 
              onClick={link.onClick}
              className={footerStyles.footerLink}
            >
              {link.label}
            </a>
          )}
        </p>
      ))}
    </div>
  );
};

export default AuthFooter;

