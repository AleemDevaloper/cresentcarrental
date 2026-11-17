import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const CrmConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isDark = false,
}) => {
  if (!isOpen) return null;

  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? '#1a1f2e' : '#fff';
  const colors = {
    primary: '#6366f1',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  };
  const c = colors[variant] || colors.primary;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.55)',
      zIndex: 1060,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div className="glass-card" style={{
        background: bg, color: textColor, borderRadius: '16px',
        maxWidth: '440px', width: '100%', padding: '1.5rem',
      }}>
        <div className="d-flex align-items-start gap-3 mb-3">
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `${c}22`, color: c,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
          </div>
          <div>
            <h5 className="mb-1" style={{ fontWeight: 600 }}>{title}</h5>
            <p className="mb-0" style={{ color: mutedColor, fontSize: '0.85rem' }}>{message}</p>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm" onClick={onCancel} style={{ background: bg, border: `1px solid ${borderColor}`, color: textColor }}>
            {cancelText}
          </button>
          <button
            className="btn btn-sm text-white"
            onClick={onConfirm}
            style={{ background: c, border: 'none' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrmConfirmDialog;