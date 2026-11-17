import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MetricCard = ({
  label,
  value,
  icon,
  color = '#3b82f6',
  suffix,
  isDark = false,
  className = '',
  onClick,
  formatValue,
}) => {
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div
      className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''} ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="card-body p-4 d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: `${color}15`,
            color,
            fontSize: '1.2rem',
          }}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        <div>
          <h4 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
            {displayValue}{suffix || ''}
          </h4>
          <span className="small text-muted">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
