import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const CrmTimeline = ({ events = [], isDark = false }) => {
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';

  if (!events.length) {
    return <p className="small" style={{ color: mutedColor }}>No activity yet.</p>;
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
      <div style={{
        position: 'absolute',
        left: 8,
        top: 8,
        bottom: 8,
        width: 2,
        background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
      }} />
      {events.map((e, i) => (
        <div key={i} style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{
            position: 'absolute',
            left: -16,
            top: 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: e.color || '#6366f1',
            border: `2px solid ${isDark ? '#1a1f2e' : '#fff'}`,
          }} />
          <div className="d-flex align-items-center gap-2 mb-1">
            {e.icon && <FontAwesomeIcon icon={e.icon} style={{ color: e.color || '#6366f1', fontSize: '0.85rem' }} />}
            <strong style={{ color: textColor, fontSize: '0.85rem' }}>{e.title}</strong>
          </div>
          {e.description && (
            <div style={{ color: mutedColor, fontSize: '0.78rem', marginBottom: 4 }}>
              {e.description}
            </div>
          )}
          <div style={{ color: mutedColor, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FontAwesomeIcon icon={faClock} />{e.timestamp}
            {e.user && <span style={{ marginLeft: 8 }}>by {e.user}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CrmTimeline;