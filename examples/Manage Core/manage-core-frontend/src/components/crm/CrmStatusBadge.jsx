import React from 'react';

const CrmStatusBadge = ({ status = '', isDark = false }) => {
  const map = {
    new: { bg: '#e0e7ff', fg: '#4338ca', darkBg: '#312e81', darkFg: '#a5b4fc' },
    contacted: { bg: '#fef3c7', fg: '#b45309', darkBg: '#713f12', darkFg: '#fbbf24' },
    qualified: { bg: '#dcfce7', fg: '#16a34a', darkBg: '#064e3b', darkFg: '#4ade80' },
    unqualified: { bg: '#f1f5f9', fg: '#64748b', darkBg: '#334155', darkFg: '#cbd5e1' },
    nurturing: { bg: '#fce7f3', fg: '#be185d', darkBg: '#831843', darkFg: '#f9a8d4' },
    converted: { bg: '#d1fae5', fg: '#047857', darkBg: '#064e3b', darkFg: '#10b981' },
    lost: { bg: '#fee2e2', fg: '#dc2626', darkBg: '#7f1d1d', darkFg: '#f87171' },
    disqualified: { bg: '#f1f5f9', fg: '#475569', darkBg: '#1e293b', darkFg: '#94a3b8' },
    open: { bg: '#dbeafe', fg: '#2563eb', darkBg: '#1e3a5f', darkFg: '#60a5fa' },
    won: { bg: '#d1fae5', fg: '#059669', darkBg: '#064e3b', darkFg: '#10b981' },
    pending: { bg: '#fef3c7', fg: '#b45309', darkBg: '#713f12', darkFg: '#fbbf24' },
    due: { bg: '#fef3c7', fg: '#b45309', darkBg: '#713f12', darkFg: '#fbbf24' },
    completed: { bg: '#d1fae5', fg: '#059669', darkBg: '#064e3b', darkFg: '#10b981' },
    cancelled: { bg: '#f1f5f9', fg: '#64748b', darkBg: '#334155', darkFg: '#cbd5e1' },
    failed: { bg: '#fee2e2', fg: '#dc2626', darkBg: '#7f1d1d', darkFg: '#f87171' },
    snoozed: { bg: '#ede9fe', fg: '#6d28d9', darkBg: '#4c1d95', darkFg: '#c4b5fd' },
    active: { bg: '#dcfce7', fg: '#16a34a', darkBg: '#064e3b', darkFg: '#4ade80' },
    inactive: { bg: '#f1f5f9', fg: '#64748b', darkBg: '#334155', darkFg: '#cbd5e1' },
    draft: { bg: '#f1f5f9', fg: '#64748b', darkBg: '#334155', darkFg: '#cbd5e1' },
    running: { bg: '#dbeafe', fg: '#2563eb', darkBg: '#1e3a5f', darkFg: '#60a5fa' },
    paused: { bg: '#fef3c7', fg: '#b45309', darkBg: '#713f12', darkFg: '#fbbf24' },
    scheduled: { bg: '#dbeafe', fg: '#2563eb', darkBg: '#1e3a5f', darkFg: '#60a5fa' },
    archived: { bg: '#f1f5f9', fg: '#475569', darkBg: '#334155', darkFg: '#cbd5e1' },
    hot: { bg: '#fee2e2', fg: '#dc2626', darkBg: '#7f1d1d', darkFg: '#f87171' },
    warm: { bg: '#fef3c7', fg: '#d97706', darkBg: '#713f12', darkFg: '#fbbf24' },
    cold: { bg: '#dbeafe', fg: '#2563eb', darkBg: '#1e3a5f', darkFg: '#60a5fa' },
    very_hot: { bg: '#7f1d1d', fg: '#fff', darkBg: '#dc2626', darkFg: '#fff' },
  };

  const m = map[String(status).toLowerCase()] || { bg: '#f1f5f9', fg: '#64748b', darkBg: '#334155', darkFg: '#cbd5e1' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 12px',
      borderRadius: 100,
      fontSize: '0.7rem',
      fontWeight: 600,
      background: isDark ? m.darkBg : m.bg,
      color: isDark ? m.darkFg : m.fg,
      textTransform: 'capitalize',
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: isDark ? m.darkFg : m.fg,
      }} />
      {String(status).replace(/_/g, ' ')}
    </span>
  );
};

export default CrmStatusBadge;