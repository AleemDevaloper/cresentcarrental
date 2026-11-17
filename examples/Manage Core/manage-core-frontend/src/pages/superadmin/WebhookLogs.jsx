import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faList,
  faCheckCircle,
  faExclamationTriangle,
  faClock,
  faSearch,
  faDownload,
  faRedo,
  faEye,
  faCalendarAlt,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';

const WebhookLogs = ({ isDark }) => {
  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const containerStyle = {
    minHeight: '100vh',
    background: bg,
    padding: '28px 32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: textColor,
    transition: 'all 0.25s ease',
  };

  const stats = [
    { label: 'Total Events', value: '142,830', color: '#4f46e5', icon: faList },
    { label: 'Success Rate', value: '97.8%', color: '#10b981', icon: faCheckCircle },
    { label: 'Failed Deliveries', value: '3,142', color: '#ef4444', icon: faExclamationTriangle },
    { label: 'Avg Response', value: '124ms', color: '#f59e0b', icon: faClock },
  ];

  const events = [
    { id: 'evt_001', endpoint: 'https://api.partner.com/webhooks/callback', type: 'employee.created', status: 'Success', code: 200, attempts: '1/3', timestamp: '2026-06-18 08:55 AM' },
    { id: 'evt_002', endpoint: 'https://slack.com/webhooks/incoming', type: 'attendance.imported', status: 'Success', code: 200, attempts: '1/3', timestamp: '2026-06-18 08:56 AM' },
    { id: 'evt_003', endpoint: 'https://payroll.systems/api/hooks/payroll', type: 'payroll.finalized', status: 'Failed', code: 500, attempts: '3/3', timestamp: '2026-06-18 08:50 AM' },
    { id: 'evt_004', endpoint: 'https://legacy.system.com/webhook/leave', type: 'leave.approved', status: 'Retrying', code: 408, attempts: '2/3', timestamp: '2026-06-18 08:45 AM' },
    { id: 'evt_005', endpoint: 'https://api.partner.com/webhooks/callback', type: 'employee.updated', status: 'Success', code: 200, attempts: '1/3', timestamp: '2026-06-18 08:40 AM' },
    { id: 'evt_006', endpoint: 'https://erp.example.com/webhook/expense', type: 'expense.approved', status: 'Failed', code: 404, attempts: '3/3', timestamp: '2026-06-18 08:30 AM' },
  ];

  const badgeColor = (status) => {
    switch (status) {
      case 'Success': return '#10b981';
      case 'Failed': return '#ef4444';
      case 'Retrying': return '#f59e0b';
      default: return mutedColor;
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: radius,
              background: primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#fff',
              boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
            }}
          >
            <FontAwesomeIcon icon={faList} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em' }}>Webhook Delivery Logs</h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: mutedColor }}>Monitor, inspect and troubleshoot webhook event deliveries</p>
          </div>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: radius,
            border: `1px solid ${borderColor}`,
            background: cardBg,
            color: textColor,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          Download Logs
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: cardBg,
              borderRadius: radius,
              border: `1px solid ${borderColor}`,
              padding: '18px 20px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: mutedColor, fontWeight: 500 }}>{stat.label}</span>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: `${stat.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                  fontSize: 15,
                }}
              >
                <FontAwesomeIcon icon={stat.icon} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 180,
            padding: '10px 14px',
            borderRadius: radius,
            background: inputBg,
            border: `1px solid ${borderColor}`,
            color: mutedColor,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesomeIcon icon={faFilter} style={{ fontSize: 12, opacity: 0.6 }} />
          All Webhooks
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 150,
            padding: '10px 14px',
            borderRadius: radius,
            background: inputBg,
            border: `1px solid ${borderColor}`,
            color: mutedColor,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesomeIcon icon={faSearch} style={{ fontSize: 12, opacity: 0.6 }} />
          Event Type
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 150,
            padding: '10px 14px',
            borderRadius: radius,
            background: inputBg,
            border: `1px solid ${borderColor}`,
            color: mutedColor,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 12, opacity: 0.6 }} />
          Date Range
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 120,
            padding: '10px 14px',
            borderRadius: radius,
            background: inputBg,
            border: `1px solid ${borderColor}`,
            color: mutedColor,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FontAwesomeIcon icon={faFilter} style={{ fontSize: 12, opacity: 0.6 }} />
          Status
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        style={{
          background: cardBg,
          borderRadius: radius,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                {['Event ID', 'Webhook Endpoint', 'Event Type', 'Status', 'Response Code', 'Attempts', 'Timestamp', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      fontWeight: 600,
                      color: mutedColor,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#fafbfc',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((evt, i) => (
                <motion.tr
                  key={evt.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 + i * 0.04 }}
                  style={{
                    borderBottom: `1px solid ${borderColor}`,
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 12 }}>{evt.id}</td>
                  <td style={{ padding: '14px 16px', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={evt.endpoint}>
                    {evt.endpoint.length > 30 ? evt.endpoint.slice(0, 30) + '...' : evt.endpoint}
                  </td>
                  <td style={{ padding: '14px 16px', color: mutedColor }}>{evt.type}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: `${badgeColor(evt.status)}18`,
                        color: badgeColor(evt.status),
                      }}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 600 }}>{evt.code}</td>
                  <td style={{ padding: '14px 16px', color: mutedColor }}>{evt.attempts}</td>
                  <td style={{ padding: '14px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>{evt.timestamp}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: mutedColor,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          transition: 'all 0.2s',
                        }}
                        title="View Payload"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: mutedColor,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          transition: 'all 0.2s',
                        }}
                        title="Resend"
                      >
                        <FontAwesomeIcon icon={faRedo} />
                      </button>
                      <button
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: mutedColor,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          transition: 'all 0.2s',
                        }}
                        title="Download"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 16, fontSize: 13, color: mutedColor }}>
        <span>Rows per page: 10</span>
        <span>1-6 of 142,830</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor, cursor: 'pointer', fontSize: 13 }}>Prev</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${borderColor}`, background: primaryGradient, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>1</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor, cursor: 'pointer', fontSize: 13 }}>2</button>
          <button style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor, cursor: 'pointer', fontSize: 13 }}>3</button>
          <span style={{ padding: '6px 4px' }}>...</span>
          <button style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: mutedColor, cursor: 'pointer', fontSize: 13 }}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default WebhookLogs;
