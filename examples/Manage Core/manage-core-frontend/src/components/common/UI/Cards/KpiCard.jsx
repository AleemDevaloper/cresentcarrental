import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KpiCard = ({ label, value, icon, color = '#3b82f6', subtitle, isDark = false, className = '', formatValue, background, borderColor }) => {
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div
      className={`h-100 position-relative overflow-hidden rounded-4 shadow-sm border-0 d-flex flex-column ${className}`}
      style={{
        background: background || (isDark ? '#1e293b' : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`),
        borderColor: borderColor || (isDark ? '#334155' : 'transparent'),
        color: isDark ? '#f1f5f9' : '#ffffff',
      }}
    >
      <div
        className="position-absolute"
        style={{
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
          {subtitle && <span className="small opacity-75 mt-1 d-block">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
