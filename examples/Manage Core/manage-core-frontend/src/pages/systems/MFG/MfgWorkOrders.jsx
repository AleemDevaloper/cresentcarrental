import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools, faPlus, faCalendarAlt, faMicrochip,
  faEye, faEdit, faPlay, faPause, faCheckCircle, faTimesCircle,
  faSpinner, faRedo, faSearch, faFilter, faUserCog,
  faCog, faChartLine, faClock, faFlag, faClipboardCheck,
  faFlask, faExclamationTriangle, faTrash, faHistory,
  faWrench, faDownload, faUsers, faHourglassHalf,
  faCheck, faTimes, faBan, faStar, faChartBar,
  faLayerGroup, faArrowRight, faArrowLeft,
  faTable, faThLarge, faCalendarDay, faIdBadge
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import { useApp } from '../../../hooks/useApp';
import {
  listWorkOrders,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} from '../../../api/mfg';
import { clearCache } from '../../../api/client';

const MfgWorkOrders = ({ isDark }) => {
  const { addNotification } = useApp();
  const [view, setView] = useState('list');
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWo, setSelectedWo] = useState(null);
  const [scraptingWo, setScraptingWo] = useState(null);
  const [deletingWo, setDeletingWo] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const d = isDark ? 'dark-mode' : '';

  const loadWorkOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listWorkOrders();
      const data = res?.data;
      setWorkOrders(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      setWorkOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWorkOrders(); }, [loadWorkOrders]);

  const statusList = useMemo(() => [...new Set(workOrders.map(w => w.status))], [workOrders]);

  const filtered = workOrders.filter(w => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (search && !w.no?.toLowerCase().includes(search.toLowerCase()) && !w.operation?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!deletingWo) return;
    try {
      await deleteWorkOrder(deletingWo.id);
      clearCache('/mfg/work-orders');
      setWorkOrders(prev => prev.filter(w => w.id !== deletingWo.id));
      addNotification?.(`Work order "${deletingWo.no}" deleted.`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to delete work order.', 'error');
    } finally {
      setDeletingWo(null);
    }
  };

  const handleConfirmScrap = async () => {
    if (!scraptingWo) return;
    try {
      await updateWorkOrder(scraptingWo.id, { ...scraptingWo, status: 'Rejected' });
      clearCache('/mfg/work-orders');
      setWorkOrders(prev => prev.map(w => w.id === scraptingWo.id ? { ...w, status: 'Rejected' } : w));
      addNotification?.(`Work order "${scraptingWo.no}" scrapped.`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to scrap work order.', 'error');
    } finally {
      setScraptingWo(null);
      setSelectedWo(null);
      setView('list');
    }
  };

  const handleImportWorkOrders = (rows) => {
    rows.forEach(async (row, index) => {
      const no = row['WO No'] || row.no || `WO-IMP-${Date.now()}-${index}`;
      const record = {
        no: String(no),
        prodOrder: row['Prod Order'] || row.prodOrder || 'PO-0000',
        operation: row.Operation || row.operation || 'Imported Operation',
        machine: row.Machine || row.machine || 'N/A',
        operator: row.Operator || row.operator || 'Import',
        status: row.Status || row.status || 'Pending',
        shift: row.Shift || row.shift || 'Morning',
        start: row.Start || row.start || '',
        end: row.End || row.end || '',
        progress: Number(row.Progress || row.progress || 0),
        quality: row.Quality || row.quality || '-',
        priority: row.Priority || row.priority || 'Medium',
      };
      try {
        const res = await createWorkOrder(record);
        const saved = res?.data;
        if (saved) setWorkOrders(prev => [saved, ...prev]);
      } catch {
        // silently skip
      }
    });
  };

  const AnimatedCounter = ({ value, duration = 800 }) => {
    const [count, setCount] = React.useState(0);
    React.useEffect(() => {
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [value, duration]);
    return <span>{count}</span>;
  };

  const CircularProgress = ({ progress, size = 80, strokeWidth = 6, color = '#10b981', showLabel = true }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </svg>
    );
  };

const FormField = ({ label, children, width }) => (
  <div className={width || 'col-md-4'}>
    <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>{label}</label>
    {children}
  </div>
);

const sectionAccent = (
    <div style={{ height: 3, width: 36, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: 4, marginBottom: 10 }} />
  );

  const themeBg = (r) => isDark ? `rgba(${r},0.15)` : `rgba(${r},0.08)`;
  const themeDot = (h) => `#${h}`;
  const statusColors = {
    'Pending': { bg: themeBg('100,116,139'), dot: themeDot('64748b'), text: themeDot('64748b') },
    'In Progress': { bg: themeBg('245,158,11'), dot: themeDot('d97706'), text: themeDot('d97706') },
    'Completed': { bg: themeBg('16,185,129'), dot: themeDot('059669'), text: themeDot('059669') },
    'Paused': { bg: themeBg('59,130,246'), dot: themeDot('2563eb'), text: themeDot('2563eb') },
    'Rejected': { bg: themeBg('239,68,68'), dot: themeDot('dc2626'), text: themeDot('dc2626') },
  };
  const qualityColors = {
    'Pass': { bg: themeBg('16,185,129'), dot: themeDot('059669'), text: themeDot('059669') },
    'Fail': { bg: themeBg('239,68,68'), dot: themeDot('dc2626'), text: themeDot('dc2626') },
    'Rework': { bg: themeBg('245,158,11'), dot: themeDot('d97706'), text: themeDot('d97706') },
    '-': { bg: themeBg('100,116,139'), dot: themeDot('64748b'), text: themeDot('64748b') },
  };

  const premiumCss = `
    .glass-card {
      background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
      box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
    }
    .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18); }
    .premium-table-wrapper { border-radius: 16px; overflow: hidden; border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}; }
    .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .premium-table thead { position: sticky; top: 0; z-index: 10; }
    .premium-table thead tr { background: ${isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'}; }
    .premium-table thead th { padding: 14px 16px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${isDark ? '#94a3b8' : '#64748b'}; border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}; white-space: nowrap; }
    .premium-table tbody tr { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); border-left: 3px solid transparent; }
    .premium-table tbody tr:hover { border-left-color: #059669 !important; background: ${isDark ? 'rgba(5,150,105,0.08)' : 'rgba(5,150,105,0.03)'} !important; }
    .premium-table tbody tr:nth-child(even) { background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)'}; }
    .premium-table tbody tr:nth-child(even):hover { background: ${isDark ? 'rgba(5,150,105,0.12)' : 'rgba(5,150,105,0.05)'} !important; }
    .premium-table tbody td { padding: 12px 16px; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'}; vertical-align: middle; }
    .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
    .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
    .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
    .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
    .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
    .premium-progress { height: 6px; border-radius: 100px; background: ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}; overflow: hidden; }
    .premium-progress-bar { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #059669, #10b981, #34d399); background-size: 200% 100%; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .enter-anim { animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
    .enter-anim:nth-child(1) { animation-delay: 0.03s; }
    .enter-anim:nth-child(2) { animation-delay: 0.06s; }
    .enter-anim:nth-child(3) { animation-delay: 0.09s; }
    .enter-anim:nth-child(4) { animation-delay: 0.12s; }
    .enter-anim:nth-child(5) { animation-delay: 0.15s; }
    .enter-anim:nth-child(6) { animation-delay: 0.18s; }
    .enter-anim:nth-child(7) { animation-delay: 0.21s; }
    .enter-anim:nth-child(8) { animation-delay: 0.24s; }
    .wo-card { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 20px; overflow: hidden; position: relative; cursor: pointer; }
    .wo-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.25) !important; }
    .wo-card-header { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; }
    .wo-card-body { padding: 8px 20px 12px; display: flex; flex-direction: column; gap: 10px; }
    .wo-card-row { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; }
    .wo-card-row .wo-icon-box { width: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .wo-card-footer { padding: 12px 20px 16px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}; }
    .wo-card-progress-wrap { padding: 0 20px 4px; }
    .wo-card-progress { display: flex; align-items: center; gap: 16px; }
    .wo-card-progress .wo-gauge { flex-shrink: 0; }
    .wo-card-progress .wo-progress-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .wo-card-progress .wo-progress-label { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 600; }
    .view-toggle-btn { transition: all 0.3s ease; border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; cursor: pointer; }
    .view-toggle-btn.active { background: ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)'}; color: #3b82f6; border-color: #3b82f6; }
    .view-toggle-btn:not(.active) { background: transparent; color: ${isDark ? '#94a3b8' : '#64748b'}; border-color: transparent; }
    .view-toggle-btn:not(.active):hover { background: ${isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc'}; }
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
  `;

  if (view === 'create') {
    return (
      <>
        <style>{premiumCss}</style>
        <div className={`container-fluid py-4 px-4 ${d}`}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              {sectionAccent}
              <h4 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                <FontAwesomeIcon icon={faTools} className="me-2 text-primary" />
                Create Work Order
              </h4>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn" onClick={() => setView('list')}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />Cancel
              </button>
              <button className="btn btn-primary btn-sm rounded-pill premium-btn">
                <FontAwesomeIcon icon={faCheck} className="me-1" />Create Work Order
              </button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="card border-0 rounded-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faClipboardCheck} className="me-2 text-primary" />
                      Work Order Details
                    </h6>
                  </div>
                  <div className="row g-3">
                    <FormField label="Work Order Number"><input type="text" className="form-control form-control-sm rounded-3" placeholder="Auto-generated" /></FormField>
                    <FormField label="Production Order">
                      <select className="form-select form-select-sm rounded-3">
                        <option>Select Production Order</option>
                      </select>
                    </FormField>
                    <FormField label="Operation Name">
                      <select className="form-select form-select-sm rounded-3">
                        <option>CNC Machining</option>
                        <option>Milling & Drilling</option>
                        <option>Welding Assembly</option>
                        <option>Quality Inspection</option>
                      </select>
                    </FormField>
                    <FormField label="Machine">
                      <select className="form-select form-select-sm rounded-3">
                        <option>CNC-01</option>
                        <option>MBL-03</option>
                        <option>WLD-02</option>
                        <option>LTH-01</option>
                      </select>
                    </FormField>
                    <FormField label="Operator">
                      <select className="form-select form-select-sm rounded-3">
                        <option>Ahmed Hassan</option>
                        <option>Priya Sharma</option>
                        <option>Carlos Mendez</option>
                        <option>Wei Zhang</option>
                      </select>
                    </FormField>
                    <FormField label="Shift">
                      <select className="form-select form-select-sm rounded-3">
                        <option>Morning (6AM-2PM)</option>
                        <option>Evening (2PM-10PM)</option>
                        <option>Night (10PM-6AM)</option>
                      </select>
                    </FormField>
                    <FormField label="Expected Start"><input type="datetime-local" className="form-control form-control-sm rounded-3" /></FormField>
                    <FormField label="Expected End"><input type="datetime-local" className="form-control form-control-sm rounded-3" /></FormField>
                    <FormField label="Expected Time (hours)"><input type="number" className="form-control form-control-sm rounded-3" defaultValue={8} /></FormField>
                    <FormField label="Status">
                      <select className="form-select form-select-sm rounded-3">
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card border-0 rounded-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faCog} className="me-2 text-primary" />
                      Shop Floor Actions
                    </h6>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { icon: faPlay, label: 'Start Work', color: '#10b981' },
                      { icon: faPause, label: 'Pause Work', color: '#f59e0b' },
                      { icon: faCheckCircle, label: 'Complete', color: '#3b82f6' },
                      { icon: faExclamationTriangle, label: 'Record Downtime', color: '#ef4444' },
                      { icon: faTrash, label: 'Record Scrap', color: '#dc2626' },
                      { icon: faFlask, label: 'Quality Inspection', color: '#8b5cf6' },
                    ].map((f, idx) => (
                      <button key={idx} className="btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn"
                        style={{ background: `${f.color}12`, color: f.color }}>
                        <FontAwesomeIcon icon={f.icon} style={{ fontSize: '11px' }} />
                        <span style={{ fontSize: '11px' }}>{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (view === 'detail' && selectedWo) {
    const wo = selectedWo;
    return (
      <>
        <style>{premiumCss}</style>
        <div className={`container-fluid py-4 px-4 ${d}`}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              {sectionAccent}
              <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                <FontAwesomeIcon icon={faTools} className="me-2 text-primary" />
                {wo.no} - {wo.operation}
              </h4>
              <p className="text-muted small mb-0">
                <FontAwesomeIcon icon={faLayerGroup} className="me-1" style={{ fontSize: '10px' }} />
                Production Order: {wo.prodOrder} | Machine: {wo.machine} | Operator: {wo.operator}
              </p>
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn" onClick={() => { setView('list'); setSelectedWo(null); }}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />Back
            </button>
          </div>

          <div className="row g-4">
            <div className="col-xl-4">
              <div className="card border-0 rounded-4 premium-card glass-card mb-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faTools} className="me-2 text-primary" />
                      Operation Information
                    </h6>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Operation</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{wo.operation}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Machine</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{wo.machine}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Operator</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{wo.operator}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Shift</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>{wo.shift}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Expected Time</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>8 hrs</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Status</small>
                    <span className="premium-badge" style={{ background: statusColors[wo.status]?.bg, color: statusColors[wo.status]?.text }}>
                      <span className="badge-dot" style={{ background: statusColors[wo.status]?.dot }} />
                      {wo.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card border-0 rounded-4 premium-card glass-card mb-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                      Schedule
                    </h6>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', border: `1px solid ${isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)'}` }}>
                      <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', color: '#fff' }}>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <div className="fw-medium" style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '0.85rem' }}>Start</div>
                        <div className="text-muted small">{wo.start || 'Not scheduled'}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)', border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'}` }}>
                      <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', color: '#fff' }}>
                        <FontAwesomeIcon icon={faHourglassHalf} style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <div className="fw-medium" style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '0.85rem' }}>End</div>
                        <div className="text-muted small">{wo.end || 'Not scheduled'}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.05)', border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)'}` }}>
                      <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#fff' }}>
                        <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '14px' }} />
                      </div>
                      <div>
                        <div className="fw-medium" style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '0.85rem' }}>Expected Duration</div>
                        <div className="text-muted small">8 hrs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 rounded-4 premium-card glass-card mb-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #10b981, #34d399)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />
                      Progress & Quality
                    </h6>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6 text-center">
                      <CircularProgress progress={wo.progress || 0} size={100} strokeWidth={8} color="#10b981" />
                      <AnimatedCounter value={wo.progress || 0} duration={1000} />
                      <div className="text-muted small mt-1">Progress</div>
                    </div>
                    <div className="col-md-6 text-center">
                      <CircularProgress progress={wo.quality === 'Pass' ? 100 : wo.quality === 'Rework' ? 60 : 0} size={100} strokeWidth={8} color={wo.quality === 'Pass' ? '#10b981' : wo.quality === 'Rework' ? '#f59e0b' : '#ef4444'} />
                      <div className="fw-bold mt-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                        <span className="premium-badge" style={{ background: qualityColors[wo.quality]?.bg, color: qualityColors[wo.quality]?.text }}>
                          <span className="badge-dot" style={{ background: qualityColors[wo.quality]?.dot }} />
                          <FontAwesomeIcon icon={wo.quality === 'Pass' ? faCheckCircle : wo.quality === 'Fail' ? faTimesCircle : wo.quality === 'Rework' ? faRedo : faCheck} style={{ fontSize: '9px' }} />
                          {wo.quality}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-8">
              <div className="card border-0 rounded-4 premium-card glass-card mb-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
                      Shop Floor Tracking
                    </h6>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <button className="btn btn-success btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faPlay} className="me-1" />Start</button>
                    <button className="btn btn-warning btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faPause} className="me-1" />Pause</button>
                    <button className="btn btn-info btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faRedo} className="me-1" />Resume</button>
                    <button className="btn btn-primary btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faCheckCircle} className="me-1" />Complete</button>
                    <button className="btn btn-danger btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />Downtime</button>
                    <button className="btn btn-outline-danger btn-sm rounded-pill premium-btn" onClick={() => setScraptingWo(selectedWo)}><FontAwesomeIcon icon={faTrash} className="me-1" />Scrap</button>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faFlask} className="me-1" />Inspection</button>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Produced Quantity</label>
                      <input type="number" className="form-control form-control-sm rounded-3" placeholder="0" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Scrap Quantity</label>
                      <input type="number" className="form-control form-control-sm rounded-3" placeholder="0" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Material Consumed</label>
                      <input type="text" className="form-control form-control-sm rounded-3" placeholder="e.g., Steel Plate 10mm, 245 kg" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Downtime Reason</label>
                      <select className="form-select form-select-sm rounded-3">
                        <option>None</option>
                        <option>Machine Breakdown</option>
                        <option>Material Shortage</option>
                        <option>Power Outage</option>
                        <option>Tool Change</option>
                        <option>Quality Issue</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Notes</label>
                      <textarea className="form-control form-control-sm rounded-3" rows={2} placeholder="Operator notes..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 rounded-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #3b82f6, #8b5cf6)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faFlask} className="me-2 text-primary" />
                      Quality Control
                    </h6>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Inspection Result</label>
                      <select className="form-select form-select-sm rounded-3">
                        <option>Pass</option>
                        <option>Fail</option>
                        <option>Rework</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Inspector</label>
                      <input type="text" className="form-control form-control-sm rounded-3" placeholder="Inspector name" />
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="dimCheck" />
                        <label className="form-check-label small" htmlFor="dimCheck" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Dimensions Check</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="visualCheck" />
                        <label className="form-check-label small" htmlFor="visualCheck" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Visual Inspection</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="funcCheck" />
                        <label className="form-check-label small" htmlFor="funcCheck" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Functional Test</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="materialCheck" />
                        <label className="form-check-label small" htmlFor="materialCheck" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Material Cert Check</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-medium" style={{ color: isDark ? '#94a3b8' : '#475569' }}>Inspection Notes</label>
                      <textarea className="form-control form-control-sm rounded-3" rows={2} placeholder="Quality inspection notes..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{premiumCss}</style>
      <div className={`container-fluid py-4 px-4 ${d}`}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ position: 'relative', zIndex: 110 }}>
          <div>
            {sectionAccent}
            <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
              <FontAwesomeIcon icon={faTools} className="me-2 text-primary" />
              Work Orders
            </h4>
            <p className="text-muted small mb-0">
              <FontAwesomeIcon icon={faChartLine} className="me-1" style={{ fontSize: '10px' }} />
              Manage shop floor execution, machine assignments, and work order tracking.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm rounded-pill px-3 premium-btn" onClick={() => setView('create')}>
              <FontAwesomeIcon icon={faPlus} className="me-1" />New Work Order
            </button>
            <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Schedule</button>
            <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faMicrochip} className="me-1" />Assign Machine</button>
            <FxImportDropdown
              title="Work Orders"
              isDark={isDark}
              addNotification={addNotification}
              onImport={handleImportWorkOrders}
              buttonClassName="btn btn-sm rounded-pill premium-btn"
              buttonStyle={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }}
            />
            <FxExportDropdown
              data={filtered}
              getExportData={(data) => data.map((w) => ({
                'WO No': w.no,
                'Prod Order': w.prodOrder,
                Operation: w.operation,
                Machine: w.machine,
                Operator: w.operator,
                Status: w.status,
                Shift: w.shift,
                Start: w.start,
                End: w.end,
                Progress: w.progress,
                Quality: w.quality,
                Priority: w.priority,
              }))}
              title="Work Orders Report"
              filenamePrefix="mfg-work-orders"
              moduleLabel="MFG Module"
              isDark={isDark}
              addNotification={addNotification}
              buttonClassName="btn btn-sm rounded-pill premium-btn"
              buttonStyle={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none' }}
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: 'Pending', value: workOrders.filter(w => w.status === 'Pending').length, color: '#64748b', bg: 'linear-gradient(135deg,#64748b15,#64748b05)', icon: faHourglassHalf },
            { label: 'In Progress', value: workOrders.filter(w => w.status === 'In Progress').length, color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b15,#f59e0b05)', icon: faSpinner },
            { label: 'Completed', value: workOrders.filter(w => w.status === 'Completed').length, color: '#10b981', bg: 'linear-gradient(135deg,#10b98115,#10b98105)', icon: faCheckCircle },
            { label: 'Paused', value: workOrders.filter(w => w.status === 'Paused').length, color: '#3b82f6', bg: 'linear-gradient(135deg,#3b82f615,#3b82f605)', icon: faPause },
            { label: 'Rejected', value: workOrders.filter(w => w.status === 'Rejected').length, color: '#ef4444', bg: 'linear-gradient(135deg,#ef444415,#ef444405)', icon: faTimesCircle },
          ].map((card, idx) => (
            <div key={idx} className="col enter-anim">
              <div className="card border-0 rounded-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
                <div className="card-body py-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: card.bg, color: card.color }}>
                      <FontAwesomeIcon icon={card.icon} style={{ fontSize: '1rem' }} />
                    </div>
                    <span className="live-dot ms-2" style={{ verticalAlign: 'middle' }} title="Live" />
                  </div>
                  <AnimatedCounter value={card.value} duration={1000} />
                  <div className="text-muted small mt-1">{card.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 rounded-4 mb-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-transparent border-end-0 rounded-start-3">
                    <FontAwesomeIcon icon={faSearch} style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }} />
                  </span>
                  <input type="text" className="form-control form-control-sm border-start-0 rounded-end-3" placeholder="Search work orders..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3"><option>All Operations</option></select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3"><option>All Machines</option></select>
              </div>
              <div className="col-md-3 d-flex gap-1 justify-content-end">
                <button className={`view-toggle-btn btn btn-sm border ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                  <FontAwesomeIcon icon={faTable} className="me-1" />Table
                </button>
                <button className={`view-toggle-btn btn btn-sm border ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>
                  <FontAwesomeIcon icon={faThLarge} className="me-1" />Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="card border-0 rounded-4 premium-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-0">
              <div className="premium-table-wrapper">
                {loading ? (
                  <div className="text-center py-5">
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1.5rem', color: '#3b82f6' }} />
                    <div className="text-muted small mt-2">Loading work orders...</div>
                  </div>
                ) : (
                  <table className="table table-borderless align-middle mb-0 premium-table">
                    <thead>
                      <tr>
                        <th className="ps-4">WO No</th>
                        <th>Prod Order</th>
                        <th>Operation</th>
                        <th>Machine</th>
                        <th>Operator</th>
                        <th>Status</th>
                        <th>Shift</th>
                        <th>Progress</th>
                        <th>Quality</th>
                        <th className="pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((wo, idx) => (
                        <tr key={wo.id || idx}
                          className="enter-anim"
                          onClick={() => { setView('detail'); setSelectedWo(wo); }}
                          style={{ cursor: 'pointer', animationDelay: `${idx * 0.04}s` }}>
                          <td className="ps-4">
                            <span className="fw-bold" style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{wo.no}</span>
                          </td>
                          <td style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>{wo.prodOrder}</td>
                          <td style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#334155' }}>{wo.operation}</td>
                          <td>
                            <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#475569' }}>{wo.machine}</span>
                          </td>
                          <td style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>{wo.operator}</td>
                          <td>
                            <span className="premium-badge" style={{ background: statusColors[wo.status]?.bg, color: statusColors[wo.status]?.text }}>
                              <span className="badge-dot" style={{ background: statusColors[wo.status]?.dot }} />
                              {wo.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>{wo.shift}</td>
                          <td style={{ minWidth: 100 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="premium-progress flex-grow-1">
                                <div className="premium-progress-bar" style={{ width: (wo.progress || 0) + '%' }} />
                              </div>
                              <small className="fw-bold" style={{ fontSize: '9px', color: isDark ? '#94a3b8' : '#475569' }}>{wo.progress || 0}%</small>
                            </div>
                          </td>
                          <td>
                            <span className="premium-badge" style={{ background: qualityColors[wo.quality]?.bg, color: qualityColors[wo.quality]?.text }}>
                              <span className="badge-dot" style={{ background: qualityColors[wo.quality]?.dot }} />
                              {wo.quality}
                            </span>
                          </td>
                          <td className="pe-4">
                            <div className="d-flex gap-1">
                              <button className="premium-action-btn" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }} title="View" onClick={(e) => { e.stopPropagation(); setSelectedWo(wo); setView('detail'); }}><FontAwesomeIcon icon={faEye} style={{ fontSize: '11px' }} /></button>
                              <button className="premium-action-btn" style={{ background: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)', color: '#3b82f6' }} title="Edit"><FontAwesomeIcon icon={faEdit} style={{ fontSize: '11px' }} /></button>
                              {wo.status === 'Pending' && <button className="premium-action-btn" style={{ background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)', color: '#10b981' }} title="Start"><FontAwesomeIcon icon={faPlay} style={{ fontSize: '11px' }} /></button>}
                              <button className="premium-action-btn" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }} title="Delete" onClick={(e) => { e.stopPropagation(); setDeletingWo(wo); }}><FontAwesomeIcon icon={faTrash} style={{ fontSize: '11px' }} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={10} className="text-center py-5 text-muted">No work orders found</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((wo, idx) => {
              const accentColor = statusColors[wo.status]?.dot || '#64748b';
              const progressColor = (wo.progress || 0) === 100 ? '#10b981' : (wo.progress || 0) >= 50 ? '#3b82f6' : '#f59e0b';
              return (
                <div key={wo.id || idx} className="col-xl-4 col-lg-6 enter-anim" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="card border-0 h-100 wo-card glass-card" style={{ background: isDark ? '#1e293b' : '#fff', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.06)' }}
                    onClick={() => { setView('detail'); setSelectedWo(wo); }}>
                    <div className="wo-card-header" style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)` }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42, background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: '#fff', boxShadow: `0 4px 12px ${accentColor}44` }}>
                          <FontAwesomeIcon icon={faWrench} style={{ fontSize: '16px' }} />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ fontSize: '0.9rem', color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: '0.01em' }}>{wo.no}</div>
                          <div style={{ fontSize: '0.65rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                            <FontAwesomeIcon icon={faLayerGroup} className="me-1" style={{ fontSize: '8px' }} />
                            {wo.prodOrder}
                          </div>
                        </div>
                      </div>
                      <span className="premium-badge" style={{ background: statusColors[wo.status]?.bg, color: statusColors[wo.status]?.text, fontSize: '0.6rem', padding: '3px 10px' }}>
                        <span className="badge-dot" style={{ background: statusColors[wo.status]?.dot }} />
                        {wo.status}
                      </span>
                    </div>

                    <div className="wo-card-body">
                      <div className="wo-card-row">
                        <div className="wo-icon-box">
                          <FontAwesomeIcon icon={faCog} style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                        </div>
                        <span className="fw-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{wo.operation}</span>
                      </div>
                      <div className="wo-card-row">
                        <div className="wo-icon-box">
                          <FontAwesomeIcon icon={faMicrochip} style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                        </div>
                        <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#475569', fontSize: '0.65rem' }}>{wo.machine}</span>
                        <span style={{ color: isDark ? '#475569' : '#cbd5e1' }}>|</span>
                        <div className="wo-icon-box">
                          <FontAwesomeIcon icon={faUserCog} style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                        </div>
                        <span style={{ color: isDark ? '#cbd5e1' : '#334155', fontSize: '0.78rem' }}>{wo.operator}</span>
                      </div>
                      <div className="wo-card-row">
                        <div className="wo-icon-box">
                          <FontAwesomeIcon icon={faCalendarDay} style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                        </div>
                        <span style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '0.72rem' }}>{wo.start || 'N/A'}</span>
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '8px', color: isDark ? '#475569' : '#cbd5e1' }} />
                        <span style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '0.72rem' }}>{wo.end || 'N/A'}</span>
                      </div>
                      <div className="wo-card-row">
                        <div className="wo-icon-box">
                          <FontAwesomeIcon icon={faClock} style={{ fontSize: '12px', color: isDark ? '#64748b' : '#94a3b8' }} />
                        </div>
                        <span style={{ color: isDark ? '#94a3b8' : '#475569', fontSize: '0.72rem' }}>{wo.shift}</span>
                        <span className="ms-2 px-2 py-1 rounded-pill" style={{ fontSize: '0.6rem', fontWeight: 600, background: `${accentColor}15`, color: accentColor }}>8h expected</span>
                      </div>
                    </div>

                    <div className="wo-card-progress-wrap">
                      <div className="wo-card-progress">
                        <div className="wo-gauge">
                          <CircularProgress progress={wo.progress || 0} size={56} strokeWidth={5} color={progressColor} />
                        </div>
                        <div className="wo-progress-details">
                          <div className="wo-progress-label">
                            <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Progress</span>
                            <span className="fw-bold" style={{ color: progressColor }}>{wo.progress || 0}%</span>
                          </div>
                          <div className="premium-progress">
                            <div className="premium-progress-bar" style={{ width: (wo.progress || 0) + '%', background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)` }} />
                          </div>
                          <div className="d-flex justify-content-between" style={{ fontSize: '0.6rem', color: isDark ? '#64748b' : '#94a3b8' }}>
                            <span>Target: 100%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="wo-card-footer">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                          <span className="text-muted" style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quality</span>
                          <span className="premium-badge" style={{ background: qualityColors[wo.quality]?.bg, color: qualityColors[wo.quality]?.text, fontSize: '0.55rem', padding: '1px 7px' }}>
                            <FontAwesomeIcon icon={wo.quality === 'Pass' ? faCheckCircle : wo.quality === 'Fail' ? faTimesCircle : faRedo} style={{ fontSize: '7px' }} className="me-1" />
                            {wo.quality}
                          </span>
                        </div>
                        <FontAwesomeIcon icon={faStar} style={{ fontSize: '9px', color: wo.priority === 'High' ? '#f59e0b' : wo.priority === 'Critical' ? '#ef4444' : '#94a3b8' }} />
                      </div>
                      <div className="d-flex gap-1">
                        <span className="premium-action-btn" style={{ width: 28, height: 28, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }} title="View"><FontAwesomeIcon icon={faEye} style={{ fontSize: '9px' }} /></span>
                        <span className="premium-action-btn" style={{ width: 28, height: 28, background: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)', color: '#3b82f6' }} title="Edit"><FontAwesomeIcon icon={faEdit} style={{ fontSize: '9px' }} /></span>
                        {wo.status === 'Pending' && (
                          <span className="premium-action-btn" style={{ width: 28, height: 28, background: isDark ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)', color: '#10b981' }} title="Start"><FontAwesomeIcon icon={faPlay} style={{ fontSize: '9px' }} /></span>
                        )}
                        {wo.status === 'In Progress' && (
                          <span className="premium-action-btn" style={{ width: 28, height: 28, background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)', color: '#f59e0b' }} title="Pause"><FontAwesomeIcon icon={faPause} style={{ fontSize: '9px' }} /></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-12 text-center py-5">
                <div className="mb-3" style={{ opacity: 0.25 }}>
                  <FontAwesomeIcon icon={faTools} size="3x" style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
                </div>
                <h5 className="fw-bold" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>No Work Orders Found</h5>
                <p className="text-muted small">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Work Order Confirmation */}
      <DialogBox.Confirm
        show={!!deletingWo}
        onClose={() => setDeletingWo(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Work Order"
        message={`Are you sure you want to delete work order "${deletingWo?.no}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Scrap Work Order Confirmation */}
      <DialogBox.Confirm
        show={!!scraptingWo}
        onClose={() => setScraptingWo(null)}
        onConfirm={handleConfirmScrap}
        title="Scrap Work Order"
        message={`Scrap work order "${scraptingWo?.no}" and mark as rejected?`}
        confirmLabel="Scrap & Reject"
        variant="danger"
      />
    </>
  );
};

export default MfgWorkOrders;
