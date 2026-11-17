import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faCircleExclamation, faExclamationTriangle,
  faInfoCircle, faXmark, faCopy, faTriangleExclamation,
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';

const variantIcons = {
  success: faCheckCircle,
  error: faCircleExclamation,
  warning: faExclamationTriangle,
  info: faInfoCircle,
  danger: faTriangleExclamation,
  confirm: faCircleQuestion,
};

const variantBtn = {
  success: 'dialog-btn-success',
  error: 'dialog-btn-danger',
  warning: 'dialog-btn-warning',
  info: 'dialog-btn-primary',
  danger: 'dialog-btn-danger',
  none: 'dialog-btn-primary',
};

const legacySizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extraLarge: 'xl',
};

const sizeClasses = {
  sm: 'dialog-sm',
  md: 'dialog-md',
  lg: 'dialog-lg',
  xl: 'dialog-xl',
  full: 'dialog-full',
};

const DialogBox = ({
  show,
  onClose,
  onHide,
  title,
  message,
  children,
  footer,
  type = 'custom',
  variant = 'info',
  icon,
  size = 'md',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  details,
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  isLoading = false,
  preventClose = false,
  confirmBtnVariant,
  confirmVariant,
  inputLabel,
  inputPlaceholder = 'Type here...',
  inputType = 'text',
  initialValue = '',
  multiline = false,
  validation,
  validationMessage = 'Invalid input',
}) => {
  const [exiting, setExiting] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  const [inputError, setInputError] = useState('');
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  const resolvedSize = legacySizeMap[size] || size;
  const resolvedVariant = confirmBtnVariant || confirmVariant;

  const handleClose = useCallback(() => {
    if (preventClose || isLoading) return;
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (onClose) onClose();
      if (onHide) onHide();
      if (onCancel) onCancel();
    }, 200);
  }, [onClose, onHide, onCancel, preventClose, isLoading]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      setInputValue(initialValue);
      setInputError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setExiting(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [show, initialValue]);

  useEffect(() => {
    if (!show || !closeOnEscape) return;
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [show, closeOnEscape, handleClose]);

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && !preventClose) handleClose();
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

  const resolvedIcon = icon || variantIcons[type === 'prompt' ? 'confirm' : variant] || faInfoCircle;
  const iconClass = variant !== 'none' ? `dialog-icon-${variant}` : 'dialog-icon-info';
  const sizeClass = sizeClasses[resolvedSize] || 'dialog-md';

  const renderHeader = () => (
    <div className="dialog-header">
      <div className="dialog-header-content">
        {(type === 'alert' || type === 'confirm' || type === 'prompt') && (
          <div className={`dialog-icon-wrapper ${iconClass}`}>
            <FontAwesomeIcon icon={resolvedIcon} />
          </div>
        )}
        <h5 className="dialog-title">{title || 'Notification'}</h5>
      </div>
      {showClose && !preventClose && (
        <button className="dialog-close-btn" onClick={handleClose} aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );

  const renderBody = () => (
    <div className="dialog-body">
      {message && <p className="dialog-message">{message}</p>}
      {type === 'prompt' && (
        <>
          {inputLabel && <label className="dialog-input-label">{inputLabel}</label>}
          {multiline ? (
            <textarea
              ref={inputRef}
              className="dialog-input dialog-textarea"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
              placeholder={inputPlaceholder}
              rows={3}
            />
          ) : (
            <input
              ref={inputRef}
              className="dialog-input"
              type={inputType}
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
              placeholder={inputPlaceholder}
              onKeyDown={(e) => { if (e.key === 'Enter' && !multiline) handleConfirm(); }}
            />
          )}
          {inputError && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>{inputError}</div>}
        </>
      )}
      {details && (
        <div className="dialog-details-box">
          <div className="dialog-details-header">
            <span className="dialog-details-label">Details</span>
            <button className="dialog-details-copy" onClick={() => navigator.clipboard.writeText(details)} title="Copy details">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          <pre className="dialog-details-content">{details}</pre>
        </div>
      )}
      {children}
    </div>
  );

  const handleConfirm = () => {
    if (type === 'prompt') {
      if (validation) {
        const err = validation(inputValue);
        if (err) { setInputError(err); return; }
      }
    }
    if (onConfirm) onConfirm(type === 'prompt' ? inputValue : undefined);
    else if (type === 'alert') handleClose();
  };

  const renderFooter = () => {
    if (footer) {
      return <div className="dialog-footer">{footer}</div>;
    }

    if (type === 'custom' && !children && !title && showClose) {
      return (
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-ghost" onClick={handleClose}>Close</button>
        </div>
      );
    }
    if (type === 'alert') {
      return (
        <div className="dialog-footer">
          <button
            className={`dialog-btn ${variantBtn[resolvedVariant || variant] || 'dialog-btn-primary'}`}
            onClick={(e) => { createRipple(e); handleConfirm(); }}
            disabled={isLoading}
          >
            {isLoading && <span className="dialog-btn-spinner" />}
            {confirmLabel}
          </button>
        </div>
      );
    }
    if (type === 'confirm' || type === 'prompt') {
      return (
        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-ghost" onClick={handleClose} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button
            className={`dialog-btn ${variantBtn[resolvedVariant || variant] || 'dialog-btn-primary'}`}
            onClick={(e) => { createRipple(e); handleConfirm(); }}
            disabled={isLoading || (type === 'prompt' && !inputValue.trim() && inputType !== 'number')}
          >
            {isLoading && <span className="dialog-btn-spinner" />}
            {confirmLabel}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div ref={dialogRef} className={`enterprise-dialog ${sizeClass} ${exiting ? 'exiting' : ''}`}>
        {renderHeader()}
        {renderBody()}
        {type !== 'custom' || children || footer ? renderFooter() : null}
      </div>
    </div>
  );
};

DialogBox.Alert = (props) => <DialogBox {...props} type="alert" />;
DialogBox.Confirm = (props) => <DialogBox {...props} type="confirm" confirmLabel={props.confirmLabel || 'Yes, Confirm'} />;
DialogBox.Prompt = (props) => <DialogBox {...props} type="prompt" confirmLabel={props.confirmLabel || 'Submit'} />;
DialogBox.Success = (props) => <DialogBox.Alert {...props} variant="success" title={props.title || 'Success'} icon={faCheckCircle} />;
DialogBox.Error = (props) => <DialogBox.Alert {...props} variant="error" title={props.title || 'Error'} icon={faCircleExclamation} />;
DialogBox.Warning = (props) => <DialogBox.Alert {...props} variant="warning" title={props.title || 'Warning'} icon={faExclamationTriangle} />;
DialogBox.Info = (props) => <DialogBox.Alert {...props} variant="info" title={props.title || 'Information'} icon={faInfoCircle} />;

export default DialogBox;
