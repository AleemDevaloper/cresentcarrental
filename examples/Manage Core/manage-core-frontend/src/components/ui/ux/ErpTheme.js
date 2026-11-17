export const erpColors = {
  primary: '#6366f1',
  success: '#10b981',
  danger: '#f43f5e',
  warning: '#f59e0b',
  info: '#06b6d4',
  purple: '#8b5cf6',
};

export const primaryGradient = 'linear-gradient(135deg, #6366f1, #4f46e5)';
export const accentGradient = 'linear-gradient(to bottom, #6366f1, #8b5cf6, #ec4899)';

export const erpTheme = (isDark) => ({
  containerBg: isDark ? '#080c1400' : '#f8fafc3f',
  cardBg: isDark ? '#0f172a' : '#ffffff',
  textColor: isDark ? '#f8fafc' : '#1e293b',
  mutedColor: isDark ? '#94a3b8' : '#64748b',
  borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
  inputBg: isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff',
  glassCard: {
    background: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(24px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'}`,
    boxShadow: isDark
      ? '0 8px 32px rgba(0,0,0,0.45)'
      : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)',
  },
});

export const erpStyles = (isDark) => ({
  container: {
    background: isDark ? '#080c14' : '#F8FAFC',
    minHeight: '100vh',
    padding: '1.5rem',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: isDark ? '#0f172a' : '#ffffff',
    borderRadius: 16,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
  },
  tableWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}`,
  },
  thead: {
    background: isDark
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  th: {
    padding: '14px 16px',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: isDark ? '#94a3b8' : '#64748b',
    borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  },
  badge: (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 12px',
    borderRadius: 100,
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    background: bg,
    color,
  }),
  badgeDot: (color) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'inline-block',
    background: color,
  }),
  statusBadge: (status, isDark) => {
    const map = {
      Active: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Inactive: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Open: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Closed: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Completed: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Failed: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Processing: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      Draft: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
      Pending: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      'Credit Hold': { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    };
    const s = map[status] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
    return { ...s, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em' };
  },
  input: {
    borderRadius: 10,
    border: `1px solid ${isDark ? '#2d3248' : '#e2e8f0'}`,
    background: isDark ? '#1a1d29' : '#ffffff',
    color: isDark ? '#e2e8f0' : '#1e293b',
    fontSize: '0.8rem',
  },
  gradientBtn: {
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    border: 'none',
    borderRadius: 10,
    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
    color: '#fff',
  },
});

export const erpCss = (isDark) => `
  .glass-card {
    background: ${isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255,255,255,0.85)'};
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'};
    box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
  }
  .premium-card {
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: default;
  }
  .premium-card:hover {
    transform: translateY(-8px) scale(1.012);
    box-shadow: ${isDark ? '0 32px 64px -12px rgba(0,0,0,0.5)' : '0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(99,102,241,0.08)'};
  }
  .premium-card .kpi-icon {
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .premium-card:hover .kpi-icon {
    transform: scale(1.18) rotate(-6deg);
  }
  .premium-table-wrapper {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'};
  }
  .premium-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }
  .premium-table thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .premium-table thead tr {
    background: ${isDark ? 'rgba(15, 23, 42, 0.55)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'};
  }
  .premium-table thead th {
    padding: 14px 16px;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${isDark ? '#94a3b8' : '#64748b'};
    border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'};
    white-space: nowrap;
    user-select: none;
    background: transparent !important;
  }
  .premium-table tbody tr {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 3px solid transparent;
  }
  .premium-table tbody tr:hover {
    border-left-color: #6366f1;
    background: ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)'} !important;
    transform: scale(1.001);
  }
  .premium-table tbody tr:nth-child(even) {
    background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)'};
  }
  .premium-table tbody tr:nth-child(even):hover {
    background: ${isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.05)'} !important;
  }
  .premium-table tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'};
    vertical-align: middle;
  }
  .premium-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 12px;
    border-radius: 100px;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .premium-badge .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }
  .premium-btn {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  .premium-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  .premium-btn:active {
    transform: translateY(0) scale(0.97);
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
  }
  .section-header .accent-bar {
    width: 3px;
    height: 20px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .section-header h6 {
    margin: 0;
    font-weight: 700;
    font-size: 0.9rem;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .enter-anim {
    animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    opacity: 0;
  }
  .enter-anim:nth-child(1) { animation-delay: 0.03s; }
  .enter-anim:nth-child(2) { animation-delay: 0.06s; }
  .enter-anim:nth-child(3) { animation-delay: 0.09s; }
  .enter-anim:nth-child(4) { animation-delay: 0.12s; }
  .enter-anim:nth-child(5) { animation-delay: 0.15s; }
  .enter-anim:nth-child(6) { animation-delay: 0.18s; }
  .enter-anim:nth-child(7) { animation-delay: 0.21s; }
  .enter-anim:nth-child(8) { animation-delay: 0.24s; }
  .enter-anim:nth-child(9) { animation-delay: 0.27s; }
  .enter-anim:nth-child(10) { animation-delay: 0.30s; }
  .enter-anim:nth-child(11) { animation-delay: 0.33s; }
  .enter-anim:nth-child(12) { animation-delay: 0.36s; }
  .live-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16,185,129,0.6);
    animation: livePulse 1.5s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
  ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#475569' : '#94a3b8'}; }
  .form-control, .form-select {
    border-radius: 10px;
    border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'};
    background: ${isDark ? 'rgba(15, 23, 42, 0.45)' : '#ffffff'};
    color: ${isDark ? '#f8fafc' : '#1e293b'};
    font-size: 0.8rem;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .form-select option {
    background-color: ${isDark ? '#0f172a' : '#ffffff'};
    color: ${isDark ? '#f8fafc' : '#1e293b'};
  }
  .form-control::placeholder {
    color: ${isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)'};
  }
  .form-control:focus, .form-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  .premium-gradient-btn {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: all 0.3s;
    color: #fff;
  }
  .premium-gradient-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.45);
  }
  .erp-tab-container {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 6px;
    background: ${isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.65)'};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)'};
    border-radius: 16px;
    box-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(99, 102, 241, 0.02)'};
  }
  .erp-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(71, 85, 105, 0.85)'};
    background: transparent;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .erp-tab-btn:hover {
    color: ${isDark ? '#ffffff' : '#6366f1'};
    background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.04)'};
  }
  .erp-tab-btn.active {
    color: #ffffff !important;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
  }
`;
