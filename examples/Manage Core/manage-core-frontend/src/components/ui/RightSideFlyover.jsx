import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const RightSideFlyover = ({ isOpen, onClose, title, children, width = '420px' }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className="right-flyover-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1040,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />
      <div
        className="right-flyover-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: width,
          maxWidth: '100vw',
          zIndex: 1050,
          backgroundColor: 'var(--bs-body-bg, #fff)',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.12)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          className="right-flyover-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #e5e7eb)',
            flexShrink: 0,
          }}
        >
          <h5 className="fw-bold mb-0" style={{ fontSize: '16px' }}>{title}</h5>
          <button
            type="button"
            className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center"
            onClick={onClose}
            style={{ width: 32, height: 32 }}
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        </div>
        <div
          className="right-flyover-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default RightSideFlyover;
