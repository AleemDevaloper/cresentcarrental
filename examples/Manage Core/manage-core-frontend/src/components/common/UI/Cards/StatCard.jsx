import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const StatCard = ({
  label,
  value,
  icon,
  color = '#3b82f6',
  trend,
  variant = 'default',
  className = '',
  isDark = false,
  formatValue,
  background,
  borderColor
}) => {
  const displayValue = formatValue ? formatValue(value) : value;

  if (variant === 'kpi') {
    return (
      <div
        className={`kpi-card h-100 position-relative overflow-hidden rounded-4 shadow-sm border-0 d-flex flex-column ${className}`}
        style={{
          background: background || (isDark ? '#1e293b' : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`),
          borderColor: borderColor || (isDark ? '#334155' : 'transparent'),
          color: isDark ? '#f1f5f9' : '#ffffff',
        }}
      >
        <div
          className="kpi-card-bg-icon"
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            opacity: 0.1,
            fontSize: '6rem',
            transform: 'rotate(15deg)',
          }}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        <div className="card-body p-4 position-relative z-2 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className={`fw-semibold small text-uppercase ${isDark ? 'text-light-50' : 'text-white text-opacity-75'}`}>
              {label}
            </span>
            {icon && (
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '10px',
                }}
              >
                <FontAwesomeIcon icon={icon} style={{ fontSize: '0.85rem' }} />
              </div>
            )}
          </div>
          <div>
            <h3 className="fw-bold mb-0" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              {displayValue}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark' : ''} ${className}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div
            className="p-3 rounded-3"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon && <FontAwesomeIcon icon={icon} />}
          </div>
          {trend && (
            <span
              className={`badge rounded-pill fw-bold ${
                trend.up
                  ? 'bg-success bg-opacity-10 text-success'
                  : 'bg-danger bg-opacity-10 text-danger'
              }`}
              style={{ fontSize: '0.65rem' }}
            >
              <FontAwesomeIcon icon={trend.up ? faArrowUp : faArrowDown} className="me-1" />
              {trend.value}
            </span>
          )}
        </div>
        <h3 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b', fontSize: '1.6rem' }}>
          {displayValue}
        </h3>
        <span className="small text-muted">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;
