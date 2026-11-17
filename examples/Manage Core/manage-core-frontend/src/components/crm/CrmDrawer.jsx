import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CrmDrawer = ({
  isOpen,
  onClose,
  title,
  side = 'right',
  width = '480px',
  children,
  footer = null,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? '#1a1f2e' : '#fff';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1040,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          [side]: 0,
          width,
          height: '100vh',
          background: bg,
          color: textColor,
          boxShadow: '-4px 0 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          animation: `crmDrawerSlide 0.25s ease-out`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes crmDrawerSlide { from { transform: translateX(${side === 'right' ? '100%' : '-100%'}); } to { transform: translateX(0); } }`}</style>
        <div className="d-flex justify-content-between align-items-center" style={{
          padding: '1rem 1.25rem',
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <h5 className="mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>{title}</h5>
          <button className="btn btn-sm border-0" style={{ color: mutedColor }} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
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

export default CrmDrawer;