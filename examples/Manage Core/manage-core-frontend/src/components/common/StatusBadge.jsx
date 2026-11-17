import React from 'react';
import { getStatusConfig } from './StatusMap';

const StatusBadge = React.memo(({ status = "In Progress", pulse = false, size = 'default' }) => {
  const config = getStatusConfig(status);
  const sizeClass = size === 'sm' ? 'px-2 py-1' : size === 'lg' ? 'px-4 py-2' : 'px-3 py-2';

  return (
    <span className={`badge rounded-pill text-bg-${config.color} ${sizeClass} fw-semibold d-inline-flex align-items-center gap-2`}>
      <span className={`status-dot ${pulse ? 'animate-pulse-glow' : ''}`} />
      {config.label}
    </span>
  );
});

export default StatusBadge;
