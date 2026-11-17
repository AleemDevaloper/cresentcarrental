import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

const CrmNotificationItem = ({ notification, onClick, isDark = false }) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';
  const unread = !notification.read_at;

  return (
    <div
      onClick={onClick}
      className="d-flex align-items-start gap-2"
      style={{
        padding: '0.75rem',
        background: unread ? (isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)') : bg,
        borderRadius: '10px',
        border: `1px solid ${borderColor}`,
        marginBottom: '0.5rem',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {unread && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: notification.color || '#6366f1',
        }} />
      )}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: `${notification.color || '#6366f1'}20`,
        color: notification.color || '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <FontAwesomeIcon icon={faLink} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: textColor, fontSize: '0.85rem', fontWeight: unread ? 600 : 400 }}>
          {notification.title}
        </div>
        {notification.body && (
          <div style={{ color: mutedColor, fontSize: '0.78rem', marginTop: 2 }}>
            {notification.body}
          </div>
        )}
        <div style={{ color: mutedColor, fontSize: '0.7rem', marginTop: 4 }}>
          {new Date(notification.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default CrmNotificationItem;