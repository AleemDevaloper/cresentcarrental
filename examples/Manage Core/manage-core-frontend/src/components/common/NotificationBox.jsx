import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faCircleExclamation, faExclamationTriangle,
  faInfoCircle, faXmark, faClock
} from '@fortawesome/free-solid-svg-icons';

const typeConfig = {
  success: { icon: faCheckCircle, bgClass: 'toast-icon-success', border: '#10b981', title: 'Success' },
  error: { icon: faCircleExclamation, bgClass: 'toast-icon-error', border: '#ef4444', title: 'Error' },
  warning: { icon: faExclamationTriangle, bgClass: 'toast-icon-warning', border: '#f59e0b', title: 'Warning' },
  info: { icon: faInfoCircle, bgClass: 'toast-icon-info', border: '#3b82f6', title: 'Information' },
};

const ToastItem = ({ notif, onDismiss }) => {
  const config = typeConfig[notif.type] || typeConfig.info;
  const [exiting, setExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingRef = useRef(null);
  const rafRef = useRef(null);

  const duration = notif.duration || 0;

  const animate = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = remainingRef.current - elapsed;
    const pct = Math.max(0, (remaining / duration) * 100);
    setProgress(pct);
    if (pct > 0) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [duration]);

  useEffect(() => {
    if (!duration) return;
    remainingRef.current = duration;
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, animate]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(notif.id), 250);
  };

  const handleMouseEnter = () => {
    if (!duration) return;
    setPaused(true);
    if (startTimeRef.current) {
      remainingRef.current -= Date.now() - startTimeRef.current;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handleMouseLeave = () => {
    if (!duration) return;
    setPaused(false);
    startTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(animate);
  };

  const getTimeSince = (timestamp) => {
    if (!timestamp) return null;
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 min ago';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs === 1) return '1 hr ago';
    return `${hrs} hr ago`;
  };

  return (
    <div
      className={`enterprise-notif ${exiting ? 'exiting' : ''}`}
      role="alert"
      style={{ borderLeftColor: config.border }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`notif-icon ${config.bgClass}`}>
        <FontAwesomeIcon icon={config.icon} />
      </div>
      <div className="notif-body">
        {notif.title && <div className="notif-title">{notif.title}</div>}
        <p className="notif-message">{notif.message}</p>
        {(notif.timestamp || notif.time) && (
          <div className="notif-time">
            <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.25rem', fontSize: '0.6rem' }} />
            {getTimeSince(notif.timestamp) || notif.time}
          </div>
        )}
        {notif.actions?.length > 0 && (
          <div className="notif-actions">
            {notif.actions.map((action, i) => (
              <button
                key={i}
                className="notif-action-btn"
                onClick={() => {
                  action.onClick?.(notif);
                  if (action.closeOnClick !== false) handleDismiss();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className="notif-dismiss-btn"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      {duration > 0 && !paused && (
        <div className="notif-progress-bar" style={{ width: `${progress}%`, backgroundColor: config.border }} />
      )}
    </div>
  );
};

const NotificationBox = ({ notifications, onClose, onClearAll }) => {
  if (!notifications?.length) return null;

  const handleClearAll = () => {
    if (onClearAll) onClearAll();
    else notifications.forEach(n => onClose?.(n.id));
  };

  return (
    <div className="enterprise-notif-container">
      {notifications.length > 1 && (
        <button className="notif-clear-all" onClick={handleClearAll}>
          Clear all ({notifications.length})
        </button>
      )}
      {notifications.map((notif) => (
        <ToastItem key={notif.id} notif={notif} onDismiss={onClose} />
      ))}
    </div>
  );
};

export default NotificationBox;