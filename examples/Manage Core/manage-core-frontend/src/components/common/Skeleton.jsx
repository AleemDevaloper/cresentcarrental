import React from 'react';

/**
 * Skeleton loader component supporting multiple preset layout styles
 * with a high-fidelity CSS shimmer effect.
 */
export const Skeleton = React.memo(({
  variant = 'text', // 'text' | 'title' | 'circle' | 'rect' | 'card' | 'table' | 'stats'
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getStyles = () => {
    const styles = {};
    if (width) styles.width = width;
    if (height) styles.height = height;
    return styles;
  };

  const renderSkeletonNode = (index) => {
    // Return specific layouts for composite skeleton templates
    if (variant === 'card') {
      return (
        <div key={index} className="skeleton-card-container">
          <div className="skeleton-element skeleton-rect" style={{ height: '160px' }} />
          <div className="skeleton-card-body">
            <div className="skeleton-element skeleton-title" style={{ width: '60%' }} />
            <div className="skeleton-element skeleton-text" style={{ width: '90%' }} />
            <div className="skeleton-element skeleton-text" style={{ width: '40%' }} />
            <div className="skeleton-card-footer">
              <div className="skeleton-element skeleton-circle" style={{ width: '32px', height: '32px' }} />
              <div className="skeleton-element skeleton-text" style={{ width: '30%', height: '12px' }} />
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'table') {
      return (
        <div key={index} className="skeleton-table-container">
          <div className="skeleton-table-header">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-element skeleton-text" style={{ width: '20%', height: '16px' }} />
            ))}
          </div>
          {[...Array(3)].map((_, r) => (
            <div key={r} className="skeleton-table-row">
              <div className="skeleton-element skeleton-circle" style={{ width: '24px', height: '24px' }} />
              <div className="skeleton-element skeleton-text" style={{ width: '25%' }} />
              <div className="skeleton-element skeleton-text" style={{ width: '30%' }} />
              <div className="skeleton-element skeleton-text" style={{ width: '15%' }} />
            </div>
          ))}
        </div>
      );
    }

    if (variant === 'stats') {
      return (
        <div key={index} className="skeleton-stats-container">
          <div className="skeleton-stats-header">
            <div className="skeleton-element skeleton-text" style={{ width: '40%', height: '12px' }} />
            <div className="skeleton-element skeleton-circle" style={{ width: '36px', height: '36px' }} />
          </div>
          <div className="skeleton-element skeleton-title" style={{ width: '65%', height: '32px', marginTop: '8px' }} />
          <div className="skeleton-element skeleton-text" style={{ width: '50%', height: '12px', marginTop: '12px' }} />
        </div>
      );
    }

    // Default basic shapes
    const baseClass = `skeleton-element skeleton-${variant} ${className}`;
    return (
      <div
        key={index}
        className={baseClass}
        style={getStyles()}
      />
    );
  };

  if (count > 1 && variant !== 'card' && variant !== 'table' && variant !== 'stats') {
    return (
      <div className="skeleton-group">
        {[...Array(count)].map((_, idx) => renderSkeletonNode(idx))}
      </div>
    );
  }

  if (count > 1) {
    return (
      <div className="skeleton-grid">
        {[...Array(count)].map((_, idx) => renderSkeletonNode(idx))}
      </div>
    );
  }

  return renderSkeletonNode(0);
});

export default Skeleton;
