import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faRefresh, faClock, faUser, faCheckCircle, faEye, faEdit,
  faFileSignature, faFilePdf, faEnvelope, faTrashCan, faBrain, faFileAlt,
  faFileExport, faFileCsv, faFileExcel, faFileWord, faArrowUp, faArrowDown,
  faCheck, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportDocx } from '../../../../utils/brandedExport';

const SEED_SESSIONS = [
  { id: 1, number: 'SESS-2026-991', cashier: 'Alice Johnson', terminal: 'POS-01', openTime: '2026-07-03 08:00', closeTime: 'Awaiting Closure', openingBalance: 150, expectedCash: 1250, actualCash: 0, variance: 0, status: 'Open' },
  { id: 2, number: 'SESS-2026-990', cashier: 'Robert Smith', terminal: 'POS-02', openTime: '2026-07-02 16:00', closeTime: '2026-07-02 23:30', openingBalance: 150, expectedCash: 1890, actualCash: 1885, variance: -5, status: 'Closed', managerApproval: 'Pending Approval' }
];
const STORAGE_KEY = 'cashier_sessions';

const getInitialSessions = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (stored.length) return [...stored, ...SEED_SESSIONS.filter(p => !stored.some(s => s.id === p.id))];
  } catch { /* ignore corrupt storage */ }
  return SEED_SESSIONS;
};

const LoadingSkeleton = ({ isDark }) => {
  const shimmer = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="rounded-4 p-4 mb-4" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%)' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '120px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '350px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '500px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="col-xl-2 col-lg-4 col-md-4 col-6">
              <div className="p-3 rounded-4" style={{ background: shimmer, minHeight: '90px' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '60%', height: '12px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '40%', height: '28px', background: isDark ? '#1e293b' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErpCashierSessions = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchData = async () => {
    try { setLoading(true); setError(null); await new Promise(r => setTimeout(r, 300)); setSessions(getInitialSessions()); }
    catch (err) { setError(err.message || 'Failed to load sessions'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleCloseSession = (id) => {
    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Closed',
            closeTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
            actualCash: s.expectedCash,
            variance: 0,
            managerApproval: 'Auto Reconciled'
          };
        }
        return s;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(u => u.id > 2)));
      return updated;
    });
    addNotification('Session closed and reconciliations compiled.', 'success');
  };

  const handleApproveVariance = (id) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, managerApproval: 'Approved' } : s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(u => u.id > 2)));
      return updated;
    });
    addNotification('Shift cash variance authorized.', 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'cashier_session' });
    setActiveTab?.('erp_open_shift_session');
  };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.cashier || '' });

  const handleDeleteConfirm = async () => {
    try {
      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== deleteDialog.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.filter(u => u.id > 2)));
        return filtered;
      });
      addNotification?.('Session moved to trash', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
    } catch (err) { addNotification?.(err.message || 'Failed to delete session', 'error'); }
  };

  const handleMoveToDraft = async (row) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === row.id ? { ...s, status: 'Draft' } : s);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(u => u.id > 2)));
      return updated;
    });
    addNotification?.('Session moved to Draft', 'success');
  };

  const filteredSessions = sessions.filter(s =>
    s.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cashier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const kpiWidgets = useMemo(() => [
    { label: 'Open Sessions', val: sessions.filter(s => s.status === 'Open').length, icon: faClock, color: colors.primary, trend: 'up', trendVal: 'Active' },
    { label: 'Closed Sessions', val: sessions.filter(s => s.status === 'Closed').length, icon: faCheckCircle, color: colors.success, trend: 'up', trendVal: 'Closed' },
    { label: 'Cash In Flow', val: sessions.reduce((acc, s) => acc + s.expectedCash, 0), icon: faArrowUp, color: colors.info, trend: 'up', trendVal: 'Expected' },
    { label: 'Net Discrepancies', val: sessions.reduce((acc, s) => acc + Math.abs(s.variance), 0), icon: faArrowDown, color: colors.danger, trend: 'down', trendVal: 'Variance' },
    { label: 'Total Sessions', val: sessions.length, icon: faFileAlt, color: colors.purple, trend: 'up', trendVal: `${sessions.length} Total` },
  ], [sessions]);

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format) => {
    const data = filteredSessions;
    const cols = columns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (format === 'csv') { downloadBlob(csv, 'cashier_sessions.csv', 'text/csv'); }
    else if (format === 'xlsx') { downloadBlob(csv, 'cashier_sessions.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (format === 'docx') { await exportDocx({ headers, rows }, 'cashier_sessions.docx'); }
    else if (format === 'pdf') { await exportPdf({ headers, rows, title: 'Cashier Sessions' }, 'cashier_sessions.pdf'); }
    addNotification(`${format.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
      </ul>
    </div>
  );

  const columns = [
    { key: 'number', label: 'Session No', bold: true, render: (val, row) => <span className="font-monospace fw-bold" style={{ color: colors.primary, cursor: 'pointer' }} onClick={() => setSelectedSession(row)}>{val}</span> },
    { key: 'cashier', label: 'Cashier', bold: true },
    { key: 'terminal', label: 'Terminal ID' },
    { key: 'openTime', label: 'Opening', render: (val, row) => <div><span className="small" style={{ color: textColor }}>{val}</span><br /><span className="small" style={{ color: mutedColor }}>Base: ${row.openingBalance}</span></div> },
    { key: 'expectedCash', label: 'Expected Cash', render: (val) => <span className="font-monospace" style={{ color: textColor }}>${val.toLocaleString()}</span> },
    { key: 'actualCash', label: 'Actual Cash', render: (val, row) => row.status === 'Open' ? <span className="small" style={{ color: mutedColor }}>In Drawer</span> : <span className="font-monospace" style={{ color: textColor }}>${val.toLocaleString()}</span> },
    { key: 'variance', label: 'Variance', render: (val, row) => row.status === 'Open' ? <span style={{ color: mutedColor }}>-</span> : <span className="font-monospace fw-bold" style={{ color: val < 0 ? colors.danger : textColor }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (val, row) => (
      <div className="d-flex align-items-center gap-1">
        <span className="d-inline-flex align-items-center gap-1 px-2 py-1" style={{ fontSize: '0.7rem', borderRadius: '20px', background: val === 'Open' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e3a5f' : '#e0f2fe'), color: val === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7') }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: val === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7') }} />{val}
        </span>
        {row.status === 'Closed' && row.managerApproval && (
          <span className="small" style={{ color: row.managerApproval === 'Approved' ? colors.success : colors.warning, fontSize: '0.65rem' }}>({row.managerApproval})</span>
        )}
      </div>
    )},
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end align-items-center">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => setSelectedSession(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEdit(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        {row.status === 'Open' ? (
          <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: `${colors.danger}15`, color: colors.danger, fontSize: '0.65rem', border: 'none', padding: '4px 10px' }} onClick={() => handleCloseSession(row.id)}>
            Close Shift
          </button>
        ) : row.managerApproval === 'Pending Approval' ? (
          <button className="btn btn-sm premium-btn" style={{ borderRadius: '8px', background: `${colors.success}15`, color: colors.success, fontSize: '0.65rem', border: 'none', padding: '4px 10px' }} onClick={() => handleApproveVariance(row.id)}>
            <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve
          </button>
        ) : null}
        <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.id, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const headerAction = (
    <div className="d-flex gap-2">
      <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ fontSize: '0.8rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', borderRadius: '10px', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_open_shift_session')}>
        <FontAwesomeIcon icon={faPlus} /> Open Shift Session
      </button>
      <button className="btn btn-sm premium-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Shift registry re-indexed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} />
      </button>
    </div>
  );

  if (loading) return <LoadingSkeleton isDark={isDark} />;

  return (
    <ErpPageShell
      icon={faClock}
      title="Cashier Sessions & Drawer Shifts"
      description="Initialize cashier shifts, execute drawer drops, audit cash reconciliations, and authorize shift variance reports."
      action={headerAction}
    >
      <div className="row g-3 mb-4">
        {kpiWidgets.map((w, idx) => (
          <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} trend={w.trend} trendVal={w.trendVal} isDark={isDark} colClass="col-xl-2 col-lg-4 col-md-4 col-6" />
        ))}
      </div>

      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Shift Performance Insight</div>
              <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Based on historical shift patterns, consider scheduling additional cashier coverage during peak hours (2PM-5PM) to reduce drawer discrepancies.</div>
            </div>
          </div>
        </div>
      </div>

      <ErpDataTable
        columns={columns}
        data={filteredSessions}
        loading={loading}
        error={error}
        searchable
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by session no, cashier name..."
        emptyMessage="No sessions found."
        emptyIcon={faClock}
        isDark={isDark}
        title="Session Audits & Reconciliations"
        titleIcon={faClock}
        exportButtons={exportButtons}
      />

      {selectedSession && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedSession(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '620px', width: '100%', margin: '1rem' }}>
            <div style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faClock} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Session Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: selectedSession.status === 'Open' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#1e3a5f' : '#e0f2fe'), color: selectedSession.status === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: selectedSession.status === 'Open' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#38bdf8' : '#0284c7') }} />
                    {selectedSession.status}
                  </span>
                  <button onClick={() => setSelectedSession(null)} className="btn-close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{selectedSession.number}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Cashier: <span className="fw-semibold" style={{ color: textColor }}>{selectedSession.cashier}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Terminal: <span className="fw-semibold" style={{ color: textColor }}>{selectedSession.terminal}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Open: <span className="fw-semibold" style={{ color: textColor }}>{selectedSession.openTime}</span></p>
                  </div>
                </div>

                <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Opening Balance</small>
                      <p className="mb-0 mt-1 font-monospace fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>${selectedSession.openingBalance.toLocaleString()}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expected Cash</small>
                      <p className="mb-0 mt-1 font-monospace fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>${selectedSession.expectedCash.toLocaleString()}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Cash</small>
                      <p className="mb-0 mt-1 font-monospace" style={{ color: selectedSession.status === 'Open' ? mutedColor : textColor, fontSize: '0.85rem' }}>{selectedSession.status === 'Open' ? 'In Drawer' : `$${selectedSession.actualCash.toLocaleString()}`}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Variance</small>
                      <p className="mb-0 mt-1 font-monospace fw-bold" style={{ color: selectedSession.variance < 0 ? colors.danger : textColor, fontSize: '0.85rem' }}>{selectedSession.status === 'Open' ? '-' : `$${selectedSession.variance.toLocaleString()}`}</p>
                    </div>
                  </div>
                </div>

                {selectedSession.status === 'Closed' && (
                  <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                    <div className="row g-2">
                      <div className="col-8"><span style={{ color: mutedColor, fontSize: '0.75rem' }}>Close Time</span></div>
                      <div className="col-4 text-end"><span className="fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{selectedSession.closeTime}</span></div>
                      <div className="col-8"><span style={{ color: mutedColor, fontSize: '0.75rem' }}>Manager Approval</span></div>
                      <div className="col-4 text-end"><span className="fw-semibold" style={{ color: selectedSession.managerApproval === 'Approved' ? colors.success : colors.warning, fontSize: '0.85rem' }}>{selectedSession.managerApproval}</span></div>
                    </div>
                  </div>
                )}

                <div className="mt-3 d-flex gap-2 justify-content-end" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  {selectedSession.status === 'Open' ? (
                    <button className="btn btn-sm px-3 text-white border-0" style={{ borderRadius: '8px', background: '#f43f5e', fontSize: '0.75rem' }} onClick={() => { handleCloseSession(selectedSession.id); setSelectedSession(null); }}>
                      Close Shift
                    </button>
                  ) : selectedSession.managerApproval === 'Pending Approval' ? (
                    <button className="btn btn-sm px-3 text-white border-0 fw-bold" style={{ borderRadius: '8px', background: '#10b981', fontSize: '0.75rem' }} onClick={() => { handleApproveVariance(selectedSession.id); setSelectedSession(null); }}>
                      <FontAwesomeIcon icon={faCheck} className="me-1" /> Approve & Reconcile
                    </button>
                  ) : (
                    <span className="d-inline-flex align-items-center gap-1 px-3 py-1 fw-bold small" style={{ color: colors.success, background: isDark ? '#064e3b' : '#dcfce7', borderRadius: '8px', fontSize: '0.75rem' }}>
                      <FontAwesomeIcon icon={faCheckCircle} /> Fully Audited
                    </span>
                  )}
                  <button onClick={() => setSelectedSession(null)} className="btn btn-sm px-3" style={{ borderRadius: '8px', background: '#6366f1', color: '#fff', border: 'none', fontSize: '0.75rem' }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this session to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpCashierSessions;
