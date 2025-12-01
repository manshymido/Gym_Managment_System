import React from 'react';
import { colors } from '../../design-system/theme';
import Button from './Button';

const PageHeader = ({
  title,
  subtitle,
  action,
  actionLabel,
  actionIcon,
  onActionClick,
  search,
  searchPlaceholder,
  onSearchChange,
  searchValue,
  children,
  style = {}
}) => {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    ...style
  };

  const titleSectionStyle = {
    flex: 1,
    minWidth: '200px'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    color: colors.text.primary,
    margin: '0 0 0.5rem 0'
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: colors.text.secondary,
    margin: 0
  };

  const searchContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const searchIconStyle = {
    position: 'absolute',
    right: '1rem',
    fontSize: '1.25rem',
    color: colors.gray[400],
    zIndex: 1
  };

  const searchInputStyle = {
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: `2px solid ${colors.gray[200]}`,
    borderRadius: '12px',
    width: '300px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: colors.background.paper,
    fontFamily: 'inherit'
  };

  return (
    <div style={headerStyle}>
      <div style={titleSectionStyle}>
        {title && <h2 style={titleStyle}>{title}</h2>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {search && (
          <div style={searchContainerStyle}>
            <span style={searchIconStyle}>🔍</span>
            <input
              type="text"
              placeholder={searchPlaceholder || 'ابحث...'}
              value={searchValue || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        )}
        
        {action && (
          <Button
            variant={action === 'add' ? 'success' : 'primary'}
            onClick={onActionClick}
            icon={actionIcon}
          >
            {actionLabel}
          </Button>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default PageHeader;

