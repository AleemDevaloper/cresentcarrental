export const coaTokens = (isDark) => ({
  bg: isDark ? '#0b1220' : '#f6f7fb',
  surface: isDark ? '#111a2e' : '#ffffff',
  surfaceAlt: isDark ? '#0f1729' : '#f8fafc',
  surfaceHover: isDark ? '#15203a' : '#f1f5f9',
  border: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
  borderStrong: isDark ? 'rgba(255,255,255,0.16)' : '#cbd5e1',
  text: isDark ? '#e2e8f0' : '#0f172a',
  textMuted: isDark ? '#94a3b8' : '#64748b',
  textSubtle: isDark ? '#64748b' : '#94a3b8',
  primary: '#6366f1',
  primarySoft: isDark ? 'rgba(99,102,241,0.18)' : '#eef2ff',
  primaryBorder: isDark ? 'rgba(99,102,241,0.45)' : '#c7d2fe',
  success: '#10b981',
  successSoft: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7',
  successBorder: isDark ? 'rgba(16,185,129,0.4)' : '#86efac',
  warning: '#f59e0b',
  warningSoft: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7',
  warningBorder: isDark ? 'rgba(245,158,11,0.4)' : '#fcd34d',
  danger: '#ef4444',
  dangerSoft: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2',
  dangerBorder: isDark ? 'rgba(239,68,68,0.4)' : '#fca5a5',
  info: '#06b6d4',
  infoSoft: isDark ? 'rgba(6,182,212,0.18)' : '#cffafe',
  infoBorder: isDark ? 'rgba(6,182,212,0.4)' : '#67e8f9',
  shadow: isDark
    ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)'
    : '0 1px 0 rgba(15,23,42,0.04) inset, 0 8px 24px rgba(15,23,42,0.06)',
  focus: isDark
    ? '0 0 0 3px rgba(99,102,241,0.45)'
    : '0 0 0 3px rgba(99,102,241,0.25)',
});

export const accountTypeColor = (typeCode, isDark) => {
  const code = String(typeCode || '').toLowerCase();
  if (code.includes('asset')) return { fg: isDark ? '#60a5fa' : '#2563eb', bg: isDark ? 'rgba(37,99,235,0.18)' : '#dbeafe' };
  if (code.includes('liab')) return { fg: isDark ? '#fbbf24' : '#b45309', bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7' };
  if (code.includes('equity')) return { fg: isDark ? '#a78bfa' : '#6d28d9', bg: isDark ? 'rgba(168,85,247,0.18)' : '#ede9fe' };
  if (code.includes('rev') || code.includes('income')) return { fg: isDark ? '#34d399' : '#047857', bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7' };
  if (code.includes('exp') || code.includes('cogs')) return { fg: isDark ? '#f87171' : '#b91c1c', bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2' };
  return { fg: isDark ? '#94a3b8' : '#475569', bg: isDark ? 'rgba(148,163,184,0.18)' : '#e2e8f0' };
};

export const statusColor = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  if (s === 'active') return { fg: isDark ? '#34d399' : '#047857', bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7' };
  if (s === 'inactive') return { fg: isDark ? '#94a3b8' : '#64748b', bg: isDark ? 'rgba(100,116,139,0.18)' : '#e2e8f0' };
  if (s === 'archived') return { fg: isDark ? '#fbbf24' : '#b45309', bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7' };
  if (s === 'draft') return { fg: isDark ? '#a5b4fc' : '#4f46e5', bg: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff' };
  return { fg: isDark ? '#94a3b8' : '#475569', bg: isDark ? 'rgba(148,163,184,0.18)' : '#e2e8f0' };
};
