import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faXmark, faCircleInfo, faLaptop, faMobileScreenButton, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const PWAInstallButton = ({ className = '' }) => {
  const { isInstallable, installPWA } = usePWAInstall();
  const [showDialog, setShowDialog] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showManualWarning, setShowManualWarning] = useState(false);

  const handleInstallClick = () => {
    setShowManualWarning(false);
    setShowDialog(true);
  };

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setShowDialog(false);
      setShowManualWarning(false);
    }, 200);
  };

  const handleConfirmInstall = () => {
    if (isInstallable) {
      installPWA();
      handleClose();
    } else {
      // Toggle manual warning display inside the custom modal instead of showing browser default alert()
      setShowManualWarning(true);
    }
  };

  return (
    <>
      <button
        className={`btn btn-primary rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-2 transition-all pwa-glow-button ${className}`}
        onClick={handleInstallClick}
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          border: 'none',
          boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
          fontSize: '0.8rem',
          letterSpacing: '0.5px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <FontAwesomeIcon icon={faDownload} className="ams-pulse-effect" />
        <span>Install App</span>
      </button>

      {showDialog && ReactDOM.createPortal(
        <div
          className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <div
            className={`enterprise-dialog dialog-sm bg-white text-dark rounded-4 shadow-lg p-4 ${exiting ? 'exiting' : ''}`}
            style={{
              width: '100%',
              maxWidth: '420px',
              animation: exiting ? 'scaleDown 0.2s ease-in' : 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-primary" 
                  style={{ width: '36px', height: '36px', backgroundColor: 'rgba(79, 70, 229, 0.1)' }}
                >
                  <FontAwesomeIcon icon={faCircleInfo} size="lg" />
                </div>
                <h6 className="mb-0 fw-bold" style={{ fontSize: '1.05rem', color: '#1e293b' }}>Install ManageCore App</h6>
              </div>
              <button 
                className="btn btn-link p-0 text-muted" 
                onClick={handleClose}
                style={{ textDecoration: 'none' }}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            {/* Body */}
            <div className="mb-4">
              <p className="small text-muted mb-3" style={{ lineHeight: '1.5' }}>
                Would you like to install ManageCore as a standalone application on your device for faster access and system integrations?
              </p>

              {/* Custom Error Warning Box instead of alert() */}
              {showManualWarning && (
                <div className="alert alert-warning d-flex align-items-start gap-2 p-2.5 rounded-3 mb-3 border-0" style={{ backgroundColor: '#fffbeb', color: '#b45309', fontSize: '11px' }}>
                  <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5" />
                  <div>
                    <strong>Automated install unavailable:</strong> Your current browser mode or local setup blocks automated triggers. Please follow the instructions below.
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-light rounded-3 mb-3">
                <div className="d-flex align-items-start gap-2.5 mb-2">
                  <FontAwesomeIcon icon={faLaptop} className="text-primary mt-1" style={{ fontSize: '0.85rem' }} />
                  <div className="small text-dark">
                    <strong>Auto Install:</strong> Click the <strong>Install Now</strong> button below to launch automated setup.
                  </div>
                </div>
                <div className="d-flex align-items-start gap-2.5">
                  <FontAwesomeIcon icon={faMobileScreenButton} className="text-success mt-1" style={{ fontSize: '0.85rem' }} />
                  <div className="small text-dark">
                    <strong>Manual Fallback:</strong> Open browser menu options and select <strong>\"Add to Home screen\"</strong>.
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-sm btn-light border px-3 py-1.5 fw-bold text-dark rounded-3" 
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className="btn btn-sm btn-primary px-3 py-1.5 fw-bold text-white rounded-3" 
                onClick={handleConfirmInstall}
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none' }}
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      <style dangerouslySetInnerHTML={{ __html: `
        .pwa-glow-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(79, 70, 229, 0.6) !important;
        }
        .pwa-glow-button:active {
          transform: translateY(0);
        }
        
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleDown {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
      `}} />
    </>
  );
};

export default PWAInstallButton;
