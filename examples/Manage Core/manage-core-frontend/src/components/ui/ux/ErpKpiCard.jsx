import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AnimatedCounter, MiniSparkline } from '../../common';

const ErpKpiCard = ({
  label,
  value,
  icon,
  color = '#6366f1',
  trend = 'up',
  trendVal = '',
  sparkline = null,
  sub = null,
  isDark = false,
  colClass = 'col-xl-3 col-lg-4 col-md-6 col-12',
}) => {
  const [hovered, setHovered] = useState(false);

  const bgColor = isDark ? '#1a1d29' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const shadowColor = isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)';

  const isCurrencyCard = typeof value === 'number' && (label.toLowerCase().includes('amount') || label.toLowerCase().includes('total') || label.toLowerCase().includes('receipt') || label.toLowerCase().includes('outstanding'));

  return (
    <div className={colClass}>
      <div className="enter-anim"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease', transform: hovered ? 'translateY(-3px)' : 'none' }}
      >
        <div className="premium-card" style={{
          borderRadius: '16px', padding: '1rem 0.6rem', textAlign: 'center',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: hovered
            ? `0 12px 40px ${shadowColor}, 0 0 0 1px ${color}25`
            : `0 4px 16px ${shadowColor}`,
          transition: 'all 0.25s ease',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${color}, ${color}88, ${color})`,
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.25s ease',
          }} />

          <div
            className="kpi-icon"
            style={{
              width: 36, height: 36, borderRadius: '12px',
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              boxShadow: hovered ? `0 4px 12px ${color}30` : `0 2px 8px ${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
              transition: 'box-shadow 0.25s ease',
            }}
          >
            <FontAwesomeIcon icon={icon} style={{ color, fontSize: '0.85rem' }} />
          </div>
          <div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontSize: '0.95rem', lineHeight: 1.2 }}>
            <AnimatedCounter value={value} duration={600} prefix={isCurrencyCard ? '$' : ''} />
          </div>
          <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.62rem', lineHeight: 1.2, marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {label}
          </div>
          {(trendVal || sparkline) && (
            <div className="d-flex justify-content-center align-items-center gap-1" style={{ fontSize: '0.55rem', marginTop: 2 }}>
              <span
                className="premium-badge"
                style={{
                  padding: '2px 8px', borderRadius: '100px',
                  background: trend === 'up'
                    ? (isDark ? '#064e3b' : '#dcfce7')
                    : (isDark ? '#7f1d1d' : '#fce7e7'),
                  color: trend === 'up'
                    ? (isDark ? '#4ade80' : '#16a34a')
                    : (isDark ? '#f87171' : '#dc2626'),
                  fontWeight: 600,
                }}
              >
                <FontAwesomeIcon
                  icon={trend === 'up' ? faArrowUp : faArrowDown}
                  className="me-1"
                  style={{ fontSize: '0.5rem' }}
                />
                {trendVal}
              </span>
              {sparkline && <MiniSparkline data={sparkline} color={color} />}
            </div>
          )}
          {sub && (
            <div style={{ fontSize: '0.72rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: 6, fontWeight: 500 }}>
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErpKpiCard;
