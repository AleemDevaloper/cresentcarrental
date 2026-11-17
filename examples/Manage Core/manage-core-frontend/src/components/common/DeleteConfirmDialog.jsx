import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faXmark, faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const DeleteConfirmDialog = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
}) => {
  const [exiting, setExiting] = useState(false);

  if (!show && !exiting) return null;

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (onHide) onHide();
    }, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const handleConfirm = (e) => {
    if (onConfirm) onConfirm(e);
  };

  return (
    <div
      className={`enterprise-dialog-overlay ${exiting ? 'exiting' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className={`enterprise-dialog dialog-sm ${exiting ? 'exiting' : ''}`}>
        <button
          className="dialog-close-btn"
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Close"
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1 }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="dialog-body" style={{ paddingTop: '2rem' }}>
          <div className="delete-dialog-warning-icon">
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </div>
          <h5 id="delete-dialog-title" className="delete-dialog-title">{title}</h5>
          <p className="delete-dialog-message">{message}</p>
          {itemName && (
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <span className="delete-dialog-item-name">
                <FontAwesomeIcon icon={faTrashCan} style={{ marginRight: '0.35rem', opacity: 0.5, fontSize: '0.75rem' }} />
                {itemName}
              </span>
            </div>
          )}
        </div>

        <div className="dialog-footer" style={{ paddingTop: '0.5rem' }}>
          <button
            className="delete-btn delete-btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className="delete-btn delete-btn-danger"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Deleting...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTrashCan} />
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
