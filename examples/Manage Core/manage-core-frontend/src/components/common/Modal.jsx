import React, { useEffect, useRef, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faCircleExclamation, faExclamationTriangle,
  faInfoCircle, faXmark, faCopy, faTrashCan, faSpinner,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const variantIcons = {
  success: faCheckCircle,
  error: faCircleExclamation,
  warning: faExclamationTriangle,
  info: faInfoCircle,
  danger: faTriangleExclamation,
};

const variantBtn = {
  success: 'dialog-btn-success',
  error: 'dialog-btn-danger',
  warning: 'dialog-btn-warning',
  info: 'dialog-btn-primary',
  danger: 'dialog-btn-danger',
  none: 'dialog-btn-primary',
};

const Modal = ({
  show,
  onHide,
  title,
  children,
  size = 'medium',
  footer,
  type = 'custom',
  variant = 'none',
  icon,
  message,
  details,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  isLoading = false,
  preventClose = false,
  confirmVariant = 'primary',
}) => {
  const [exiting, setExiting] = useState(false);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleClose = useCallback(() => {
    if (preventClose || isLoading) return;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (onHide) onHide();
      if (onCancel) onCancel();
    }, 200);
  }, [onHide, onCancel, preventClose, isLoading]);

  useEffect(() => {
    if (show) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setExiting(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  useEffect(() => {
    if (!show || !closeOnEscape) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [show, closeOnEscape, handleClose]);

  useEffect(() => {
    if (!show || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [show]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && !preventClose) {
      handleClose();
    }
  };

  const createRipple = (e) => {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  if (!show && !exiting) return null;

  const sizeClasses = {
    small: 'dialog-sm',
    medium: 'dialog-md',
    large: 'dialog-lg',
    extraLarge: 'dialog-xl',
    full: 'dialog-full',
  };

  const isAlertType = type === 'alert' || type === 'confirm';

  if (isAlertType) {
    const resolvedIcon = icon || variantIcons[variant] || faInfoCircle;
    const iconClass = variant !== 'none' ? `dialog-icon-${variant}` : 'dialog-icon-info';

    return (
      <div
        className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div
          ref={dialogRef}
          className={`enterprise-dialog ${sizeClasses[size] || 'dialog-md'} ${exiting ? 'exiting' : ''}`}
        >
          <div className="dialog-header">
            <div className="dialog-header-content">
              <div className={`dialog-icon-wrapper ${iconClass}`}>
                <FontAwesomeIcon icon={resolvedIcon} />
              </div>
              <h5 id="dialog-title" className="dialog-title">
                {title || (variant === 'error' ? 'Error' : 'Notification')}
              </h5>
            </div>
            {showClose && !preventClose && (
              <button className="dialog-close-btn" onClick={handleClose} aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>

          <div className="dialog-body">
            {message && <p className="dialog-message">{message}</p>}
            {details && (
              <div className="dialog-details-box">
                <div className="dialog-details-header">
                  <span className="dialog-details-label">Details</span>
                  <button
                    className="dialog-details-copy"
                    onClick={() => navigator.clipboard.writeText(details)}
                    title="Copy details"
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>
                <pre className="dialog-details-content">{details}</pre>
              </div>
            )}
            {children}
          </div>

          <div className="dialog-footer">
            {type === 'confirm' && (
              <button
                className="dialog-btn dialog-btn-ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </button>
            )}
            <button
              className={`dialog-btn ${variant !== 'none' ? variantBtn[variant] : variantBtn[confirmVariant] || 'dialog-btn-primary'}`}
              onClick={(e) => {
                createRipple(e);
                if (onConfirm) onConfirm();
                else if (type === 'alert') handleClose();
              }}
              disabled={isLoading}
            >
              {isLoading && <span className="dialog-btn-spinner" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className={`enterprise-dialog ${sizeClasses[size] || 'dialog-md'} ${exiting ? 'exiting' : ''}`}
      >
        {title && (
          <div className="dialog-header">
            <h5 id="dialog-title" className="dialog-title">{title}</h5>
            {showClose && !preventClose && (
              <button className="dialog-close-btn" onClick={handleClose} aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
        )}

        <div className="dialog-body">
          {children}
        </div>

        {footer && (
          <div className="dialog-footer">
            {footer}
          </div>
        )}

        {!footer && showClose && !title && (
          <div className="dialog-footer">
            <button className="dialog-btn dialog-btn-ghost" onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Modal.Alert = function AlertDialog(props) {
  return <Modal {...props} type="alert" />;
};

Modal.Confirm = function ConfirmDialog(props) {
  return <Modal {...props} type="confirm" confirmLabel={props.confirmLabel || 'Yes, Confirm'} />;
};

Modal.Success = function SuccessDialog(props) {
  return <Modal.Alert {...props} variant="success" title={props.title || 'Success'} icon={faCheckCircle} />;
};

Modal.Error = function ErrorDialog(props) {
  return <Modal.Alert {...props} variant="error" title={props.title || 'Error'} icon={faCircleExclamation} />;
};

Modal.Warning = function WarningDialog(props) {
  return <Modal.Alert {...props} variant="warning" title={props.title || 'Warning'} icon={faExclamationTriangle} />;
};

Modal.Info = function InfoDialog(props) {
  return <Modal.Alert {...props} variant="info" title={props.title || 'Information'} icon={faInfoCircle} />;
};

export default Modal;
