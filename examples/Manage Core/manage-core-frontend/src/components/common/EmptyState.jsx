import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

const EmptyState = React.memo(({
  icon = faInbox,
  title = 'No records found',
  message = null,
  action = null,
  className = '',
  compact = false,
}) => {
  return (
    <div className={`empty-state ${compact ? 'empty-state-compact' : ''} text-center text-muted ${className}`}>
      <div className="empty-state-icon mx-auto mb-3">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h6 className="fw-bold mb-1">{title}</h6>
      {message && <p className="empty-state-message mb-0">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
});

export default EmptyState;
