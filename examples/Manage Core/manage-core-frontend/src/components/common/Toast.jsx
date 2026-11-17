import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faCircleExclamation, faExclamationTriangle,
  faInfoCircle, faXmark
} from '@fortawesome/free-solid-svg-icons';

const typeConfig = {
  success: { icon: faCheckCircle, iconClass: 'toast-icon-success', progressClass: 'toast-progress-success', title: 'Success' },
  error: { icon: faCircleExclamation, iconClass: 'toast-icon-error', progressClass: 'toast-progress-error', title: 'Error' },
  warning: { icon: faExclamationTriangle, iconClass: 'toast-icon-warning', progressClass: 'toast-progress-warning', title: 'Warning' },
  info: { icon: faInfoCircle, iconClass: 'toast-icon-info', progressClass: 'toast-progress-info', title: 'Information' },
};

const Toast = React.memo(({
  show,
  message,
  type = 'info',
  onClose,
  duration = 4000,
  title,
}) => {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTime = useRef(null);
  const remainingRef = useRef(duration);

  const config = typeConfig[type] || typeConfig.info;
  const toastRef = useRef(null);

  const startTimer = useCallback(() => {
    if (duration <= 0) return;
    startTime.current = Date.now();
    remainingRef.current = duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, remainingRef.current - elapsed);
      const pct = (remaining / duration) * 100;
      setProgress(pct);
      if (pct <= 0) {
        handleClose();
      } else {
        timerRef.current = requestAnimationFrame(updateProgress);
      }
    };

    timerRef.current = requestAnimationFrame(updateProgress);
  }, [duration]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startTime.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  }, []);

  const resumeTimer = useCallback(() => {
    if (remainingRef.current > 0) {
      startTime.current = Date.now();
      const updateProgress = () => {
        const elapsed = Date.now() - startTime.current;
        const remaining = Math.max(0, remainingRef.current - elapsed);
        const pct = (remaining / duration) * 100;
        setProgress(pct);
        if (pct <= 0) {
          handleClose();
        } else {
          timerRef.current = requestAnimationFrame(updateProgress);
        }
      };
      timerRef.current = requestAnimationFrame(updateProgress);
    }
  }, [duration]);

  useEffect(() => {
    if (show && duration > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [show, duration, startTimer]);

  const handleClose = useCallback(() => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setProgress(100);
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  const handleMouseDown = (e) => {
    startX.current = e.clientX || e.touches?.[0]?.clientX;
    setIsDragging(true);
    pauseTimer();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const diff = currentX - startX.current;
    if (diff > 0) {
      setDragX(diff);
      if (toastRef.current) {
        toastRef.current.style.transform = `translateX(${diff}px)`;
        toastRef.current.style.opacity = `${1 - diff / 300}`;
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 120) {
      handleClose();
    } else {
      setDragX(0);
      if (toastRef.current) {
        toastRef.current.style.transform = '';
        toastRef.current.style.opacity = '';
      }
      resumeTimer();
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: true });
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragX]);

  if (!show && !exiting) return null;

  return (
    <div
      ref={toastRef}
      className={`enterprise-toast toast-${type} ${exiting ? 'exiting' : ''} ${isDragging ? 'swiping' : ''}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={handleMouseDown}
      onMouseDown={handleMouseDown}
      role="alert"
    >
      <div className={`toast-icon ${config.iconClass}`}>
        <FontAwesomeIcon icon={config.icon} />
      </div>
      <div className="toast-content">
        <div className="toast-title">{title || config.title}</div>
        <p className="toast-message">{message}</p>
      </div>
      <button className="toast-close-btn" onClick={handleClose} aria-label="Dismiss">
        <FontAwesomeIcon icon={faXmark} />
      </button>
      {duration > 0 && (
        <div
          className={`toast-progress-bar ${config.progressClass}`}
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
});

export default Toast;
