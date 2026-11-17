import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CrmModal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer = null,
  isDark = false,
  hideHeader = false,
}) => {
  if (!isOpen) return null;

  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? '#1a1f2e' : '#fff';

  const sizes = {
    sm: '420px',
    md: '600px',
    lg: '820px',
    xl: '1100px',
    xxl: '95vw',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          background: bg,
          color: textColor,
          borderRadius: '16px',
          maxWidth: sizes[size] || sizes.md,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="d-flex justify-content-between align-items-center" style={{
            padding: '1rem 1.25rem',
            borderBottom: `1px solid ${borderColor}`,
          }}>
            <h5 className="mb-0" style={{ fontSize: '1.05rem', fontWeight: 600 }}>{title}</h5>
            <button className="btn btn-sm border-0" style={{ color: mutedColor }} onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrmModal;