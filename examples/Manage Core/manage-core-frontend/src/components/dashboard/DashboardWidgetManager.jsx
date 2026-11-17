import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faGear, faRotateLeft, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';

const DashboardWidgetManager = forwardRef(function DashboardWidgetManager(
  { widgets, visibleWidgetIds, toggleWidget, resetWidgets, isSaving, allWidgets },
  ref,
) {
  const [open, setOpen] = useState(false);
  const accessible = new Set(widgets.map(w => w.id));
  const list = Array.isArray(allWidgets) && allWidgets.length > widgets.length ? allWidgets : widgets;

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(value => !value),
  }), []);

  return (
    <div className="dropdown position-relative" data-testid="dashboard-widget-manager">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm rounded-pill fw-semibold"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faGear} className="me-2" />
        Customize widgets
        <span className="badge bg-primary bg-opacity-10 text-primary ms-2 rounded-pill">
          {visibleWidgetIds.length}/{widgets.length}
        </span>
      </button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 1070 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="dropdown-menu show p-3 shadow-lg"
            style={{
              minWidth: 320,
              maxWidth: 'calc(100vw - 32px)',
              right: 0,
              left: 'auto',
              maxHeight: 'min(70vh, 460px)',
              overflowY: 'auto',
              zIndex: 1080,
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <strong>System dashboards</strong>
              <button type="button" className="btn btn-link btn-sm p-0" onClick={resetWidgets} disabled={isSaving}>
                <FontAwesomeIcon icon={faRotateLeft} className="me-1" />Reset
              </button>
            </div>
            <p className="text-muted small mb-3">
              Add or remove module dashboards. Only systems you can access are listed.
            </p>
            {widgets.length === 0 && (
              <div className="alert alert-warning small mb-2">No accessible systems for your role yet.</div>
            )}
            {widgets.map(widget => {
              const selected = visibleWidgetIds.includes(widget.id);
              return (
                <button
                  type="button"
                  key={widget.id}
                  className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2"
                  onClick={() => toggleWidget(widget.id)}
                  aria-pressed={selected}
                >
                  <FontAwesomeIcon icon={widget.icon} className={`text-${widget.color}`} fixedWidth />
                  <span className="flex-grow-1 text-start">
                    <div className="fw-semibold">{widget.label}</div>
                    <div className="text-muted x-small">{widget.description}</div>
                  </span>
                  {selected ? (
                    <FontAwesomeIcon icon={faCheck} className="text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} className="text-muted" />
                  )}
                </button>
              );
            })}
            {list.some(w => !accessible.has(w.id)) && (
              <div className="mt-3 pt-2 border-top">
                <div className="text-muted x-small fw-bold mb-2 d-flex align-items-center gap-1">
                  <FontAwesomeIcon icon={faLock} /> Locked systems
                </div>
                {list.filter(w => !accessible.has(w.id)).map(widget => (
                  <div key={widget.id} className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 disabled" aria-disabled="true" style={{ opacity: 0.55 }}>
                    <FontAwesomeIcon icon={widget.icon} className="text-muted" fixedWidth />
                    <span className="flex-grow-1 text-start">
                      <div className="fw-semibold">{widget.label}</div>
                      <div className="text-muted x-small">You don&apos;t have access to this system.</div>
                    </span>
                    <FontAwesomeIcon icon={faLock} className="text-muted" />
                  </div>
                ))}
              </div>
            )}
            {isSaving && <div className="text-muted x-small mt-2">Saving preferences…</div>}
          </div>
        </>
      )}
    </div>
  );
});

export default DashboardWidgetManager;
