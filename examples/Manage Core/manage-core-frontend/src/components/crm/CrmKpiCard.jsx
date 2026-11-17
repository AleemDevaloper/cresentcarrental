import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';

const CrmKpiCard = ({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  color = '#6366f1',
  trend = null,
  trendLabel = null,
  subtitle,
  isDark = false,
  onClick = null,
}) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: '14px',
        padding: '1.25rem',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: `radial-gradient(circle at top right, ${color}22, transparent 70%)`,
      }} />
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '10px',
          background: `${color}20`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
        }}>
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        {trend !== null && trend !== undefined && (
          <span style={{
            color: trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : mutedColor,
            fontSize: '0.7rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <FontAwesomeIcon icon={trend > 0 ? faArrowUp : trend < 0 ? faArrowDown : faMinus} />
            {Math.abs(trend)}%{trendLabel}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.7rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: textColor }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.7rem', color: mutedColor, marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default CrmKpiCard;