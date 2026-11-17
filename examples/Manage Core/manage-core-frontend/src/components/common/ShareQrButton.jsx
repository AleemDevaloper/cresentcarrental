import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import PublicShareDialog from './PublicShareDialog';

const ShareQrButton = ({ entityType, entityId, label, isDark, onNotify, className, style, title }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className || 'btn btn-sm premium-btn'}
        title={title || 'Public QR / Share Link'}
        style={{
          borderRadius: '8px',
          fontSize: '0.85rem',
          background: isDark ? '#334155' : '#f1f5f9',
          color: isDark ? '#e2e8f0' : '#1e293b',
          border: 'none',
          padding: '5px 9px',
          ...(style || {}),
        }}
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
      >
        <FontAwesomeIcon icon={faQrcode} style={{ fontSize: '0.85rem' }} />
      </button>
      {open && createPortal(
        <PublicShareDialog
          show={open}
          onHide={() => setOpen(false)}
          entityType={entityType}
          entityId={entityId}
          label={label}
          isDark={isDark}
          onNotify={onNotify}
        />,
        document.body
      )}
    </>
  );
};

export default ShareQrButton;
