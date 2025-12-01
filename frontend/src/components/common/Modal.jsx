import React, { useEffect } from 'react';
import { colors, borderRadius, shadows, zIndex } from '../../design-system/theme';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  showCancel = true,
  confirmVariant = 'primary',
  size = 'md',
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1000px' }
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: zIndex.modal,
    padding: '1rem'
  };

  const modalStyle = {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.lg,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    ...sizeStyles[size]
  };

  const headerStyle = {
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: colors.text.primary,
    margin: 0
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: colors.text.secondary,
    padding: '0.25rem',
    lineHeight: 1
  };

  const bodyStyle = {
    padding: '1.5rem'
  };

  const footerStyle = {
    padding: '1.5rem',
    borderTop: `1px solid ${colors.gray[200]}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem'
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick} {...props}>
      <div style={modalStyle}>
        {title && (
          <div style={headerStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <button style={closeButtonStyle} onClick={onClose}>
              ✕
            </button>
          </div>
        )}
        <div style={bodyStyle}>
          {children}
        </div>
        {(onConfirm || showCancel) && (
          <div style={footerStyle}>
            {showCancel && (
              <Button variant="cancel" onClick={onClose}>
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button variant={confirmVariant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

