import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const DialogPrompt = ({
  show,
  onHide,
  onConfirm,
  title = 'Enter Value',
  message,
  label,
  placeholder = 'Type here...',
  initialValue = '',
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  type = 'text',
  multiline = false,
  validation,
  validationMessage = 'Invalid input',
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [exiting, setExiting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show) {
      setValue(initialValue);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [show, initialValue]);

  if (!show && !exiting) return null;

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (onHide) onHide();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      handleConfirm();
    }
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleConfirm = () => {
    if (validation) {
      const err = validation(value);
      if (err) {
        setError(err);
        return;
      }
    }
    setError('');
    onConfirm(value, handleClose);
  };

  return (
    <div
      className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-dialog-title"
    >
      <div className={`enterprise-dialog dialog-sm ${exiting ? 'exiting' : ''}`}>
        <div className="dialog-header">
          <div className="dialog-header-content">
            <div className="dialog-icon-wrapper dialog-icon-info">
              <FontAwesomeIcon icon={faCircleQuestion} />
            </div>
            <h5 id="prompt-dialog-title" className="dialog-title">{title}</h5>
          </div>
          <button className="dialog-close-btn" onClick={handleClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="dialog-body">
          {message && <p style={{ marginBottom: '0.5rem' }}>{message}</p>}
          {label && <label className="dialog-input-label">{label}</label>}
          {multiline ? (
            <textarea
              ref={inputRef}
              className="dialog-input dialog-textarea"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
          ) : (
            <input
              ref={inputRef}
              className="dialog-input"
              type={type}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
            />
          )}
          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              {error}
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="dialog-btn dialog-btn-ghost" onClick={handleClose}>
            {cancelLabel}
          </button>
          <button
            className="dialog-btn dialog-btn-primary"
            onClick={handleConfirm}
            disabled={!value.trim() && type !== 'number'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogPrompt;
