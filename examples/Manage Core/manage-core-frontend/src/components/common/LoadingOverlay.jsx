import React, { useEffect, useState } from 'react';

const LoadingOverlay = React.memo(({
  show,
  text = 'Please wait...',
  showProgress = false,
  fullScreen = true,
  transparent = false,
}) => {
  // Debounce short flashes: wait a small delay before showing to avoid flicker/double-open
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let t;
    if (show) {
      // Show after a short delay so very fast ops don't flash overlay
      t = setTimeout(() => setVisible(true), 140);
    } else {
      // hide immediately when show becomes false
      setVisible(false);
    }
    return () => clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`loading-overlay ${visible ? 'loading-overlay-visible' : ''}`}
      style={{
        position: fullScreen ? 'fixed' : 'absolute',
        background: transparent
          ? 'rgba(15, 23, 42, 0.3)'
          : 'rgba(15, 23, 42, 0.6)',
      }}
      role="alert"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="loading-overlay-inner">
        <div className="loading-overlay-spinner" />
        <div className="loading-overlay-text">{text}</div>
        {showProgress && (
          <div className="loading-overlay-progress">
            <div className="loading-overlay-progress-bar" />
          </div>
        )}
      </div>
    </div>
  );
});

export default LoadingOverlay;
