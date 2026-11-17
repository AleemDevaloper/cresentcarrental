import React, { useCallback, useState } from 'react';
import { useApp } from '../../context/AppContext';
import NotificationBox from '../common/NotificationBox';
import DialogBox from '../common/UI/Boxes/DialogBox';
import LoadingOverlay from '../common/LoadingOverlay';
import AICopilot from '../../pages/CommandCenter/AICopilot';
import AnnouncementSurface from '../common/AnnouncementSurface';
import ErrorBoundary from '../common/ErrorBoundary';

const AuthenticatedLayout = ({ children }) => {
  const context = (() => { try { return useApp(); } catch { return {}; } })();
  const {
    notifications, removeNotification, theme, aiCopilotEnabled,
    errorDialog, hideErrorDialog, dialogQueue, closeDialog,
    globalLoading, hideGlobalLoading, addNotification,
  } = context;
  const isDark = theme === 'dark';

  const handleDialogConfirm = useCallback((dialog) => {
    if (dialog._resolve) dialog._resolve(true);
    closeDialog(dialog.id);
  }, [closeDialog]);

  const handleDialogCancel = useCallback((dialog) => {
    if (dialog._resolve) dialog._resolve(false);
    closeDialog(dialog.id);
  }, [closeDialog]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NotificationBox notifications={notifications} onClose={removeNotification} />
      <ErrorBoundary><AnnouncementSurface /></ErrorBoundary>
      <div className="flex-grow-1"><ErrorBoundary>{children}</ErrorBoundary></div>
      {aiCopilotEnabled && <AICopilot isDark={isDark} />}

      <LoadingOverlay show={globalLoading.show} text={globalLoading.text} />

      {/* Error Dialog */}
      <DialogBox
        show={errorDialog.show}
        onHide={hideErrorDialog}
        type="alert"
        variant="error"
        title={errorDialog.title || 'Error'}
        message={errorDialog.message}
        details={errorDialog.details}
        confirmLabel="Close"
        onConfirm={hideErrorDialog}
        size="small"
      />

      {/* Dialog Queue */}
      {dialogQueue.map((dialog) => (
        <DialogBox
          key={dialog.id}
          show={dialog.show}
          onHide={() => handleDialogCancel(dialog)}
          type={dialog.type || 'alert'}
          variant={dialog.variant || 'info'}
          title={dialog.title}
          message={dialog.message}
          details={dialog.details}
          confirmLabel={dialog.confirmLabel || (dialog.type === 'confirm' ? 'Yes, Confirm' : 'OK')}
          cancelLabel={dialog.cancelLabel || 'Cancel'}
          onConfirm={() => handleDialogConfirm(dialog)}
          onCancel={() => handleDialogCancel(dialog)}
          size="small"
        />
      ))}
    </div>
  );
};

export default AuthenticatedLayout;
