import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSync, faTrash, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';

const Table = ({
  title = '',
  columns = [],
  data = [],
  isDark = false,
  radius = 14,
  sectionStyle = {},
}) => {
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';

  const defaultSection = {
    padding: 24,
    borderRadius: radius,
    background: cardBg,
    border: `1px solid ${borderColor}`,
  };

  const mergeSection = { ...defaultSection, ...sectionStyle };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
  };

  const statusStyle = (status) => {
    const base = {
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block',
    };
    if (status === 'Completed') return { ...base, background: 'rgba(16,185,129,0.15)', color: '#10b981' };
    if (status === 'Failed') return { ...base, background: 'rgba(239,68,68,0.15)', color: '#ef4444' };
    if (status === 'Processing') return { ...base, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' };
    if (status === 'Pending') return { ...base, background: 'rgba(99,102,241,0.15)', color: '#6366f1' };
    return { ...base, background: 'rgba(148,163,184,0.15)', color: mutedColor };
  };

  const actionButtons = (row, actions) => {
    if (!actions) return null;
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {actions.map((action, idx) => {
          const iconMap = { download: faDownload, sync: faSync, trash: faTrash, eye: faEye, edit: faEdit };
          return (
            <button
              key={idx}
              onClick={() => action.onClick && action.onClick(row)}
              style={{
                width: 34, height: 34, borderRadius: 8, border: `1px solid ${borderColor}`,
                background: 'transparent', color: mutedColor, cursor: 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(79,70,229,0.1)'; e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}
            >
              <FontAwesomeIcon icon={iconMap[action.icon] || faDownload} />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div variants={item} style={{ ...mergeSection, marginBottom: 32, overflowX: 'auto' }}>
      {title && (
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: textColor }}>
          {title}
        </h2>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || 'left', padding: '12px 10px', color: mutedColor,
                  fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px',
                  ...(col.width ? { width: col.width } : {}),
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px 10px', textAlign: 'center', color: mutedColor, fontSize: 14 }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx} style={{ borderBottom: `1px solid ${borderColor}`, transition: 'background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(79,70,229,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {columns.map((col) => {
                  if (col.key === 'actions') {
                    return (
                      <td key={col.key} style={{ padding: '14px 10px' }}>
                        {actionButtons(row, col.actions)}
                      </td>
                    );
                  }
                  if (col.key === 'status') {
                    return (
                      <td key={col.key} style={{ padding: '14px 10px' }}>
                        <span style={statusStyle(row[col.key])}>{row[col.key]}</span>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={col.key}
                      style={{
                        padding: '14px 10px',
                        fontWeight: col.bold ? 600 : 400,
                        color: col.key === 'id' ? textColor : mutedColor,
                        ...(col.align ? { textAlign: col.align } : {}),
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Table;
