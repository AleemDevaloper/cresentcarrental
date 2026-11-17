import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const CrmFollowUpCard = ({ followUp, onClick, isDark = false, compact = false }) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  const statusColor = {
    pending: '#f59e0b',
    due: '#f59e0b',
    completed: '#10b981',
    snoozed: '#8b5cf6',
    cancelled: '#94a3b8',
    failed: '#ef4444',
    overdue: '#ef4444',
  }[followUp.status] || '#6366f1';

  const overdue = followUp.due_at && new Date(followUp.due_at) < new Date() && !['completed', 'cancelled'].includes(followUp.status);

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderLeft: `4px solid ${overdue ? '#ef4444' : statusColor}`,
        borderRadius: '12px',
        padding: compact ? '0.75rem' : '1rem',
        marginBottom: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s',
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-1">
        <h6 className="mb-0" style={{ color: textColor, fontSize: '0.9rem', fontWeight: 600 }}>
          {followUp.subject}
        </h6>
        <span style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: 100,
          background: `${statusColor}22`,
          color: statusColor,
          fontWeight: 600,
        }}>
          {followUp.status}
        </span>
      </div>
      {followUp.description && !compact && (
        <p style={{ color: mutedColor, fontSize: '0.78rem', margin: '4px 0' }}>
          {followUp.description.length > 120 ? followUp.description.substring(0, 120) + '...' : followUp.description}
        </p>
      )}
      <div className="d-flex align-items-center gap-3" style={{ color: mutedColor, fontSize: '0.72rem' }}>
        <span><FontAwesomeIcon icon={faCalendar} className="me-1" />{new Date(followUp.due_at).toLocaleString()}</span>
        <span style={{ textTransform: 'capitalize' }}>{followUp.type}</span>
        {followUp.assigned_user?.name && <span>• {followUp.assigned_user.name}</span>}
      </div>
    </div>
  );
};

export default CrmFollowUpCard;