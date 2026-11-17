import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndustry, faPlus, faCalendarAlt,
  faEye, faEdit, faTrash, faSearch, faFilter, faPlay,
  faPause, faCheckCircle, faTimesCircle, faSpinner,
  faDollarSign, faBox, faWarehouse, faUsers, faCog,
  faChartLine, faClipboardCheck, faHistory, faPaperclip,
  faClock, faFlag, faArrowUp, faArrowDown, faRocket,
  faLayerGroup, faProjectDiagram, faUserCog, faBuilding,
  faCheck, faTimes, faPlay as faPlayCircle, faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import { useApp } from '../../../hooks/useApp';
import {
  listProductionOrders,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
} from '../../../api/mfg';
import { clearCache } from '../../../api/client';

const MfgProductionOrders = ({ isDark }) => {
  const { addNotification } = useApp();
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const d = isDark ? 'dark-mode' : '';

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listProductionOrders();
      const data = res?.data;
      setOrders(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const statusList = useMemo(() => [...new Set(orders.map(o => o.status))], [orders]);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search && !o.no?.toLowerCase().includes(search.toLowerCase()) && !o.product?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!deletingOrder) return;
    try {
      await deleteProductionOrder(deletingOrder.id);
      clearCache('/mfg/production-orders');
      setOrders(prev => prev.filter(o => o.id !== deletingOrder.id));
      addNotification?.(`Production order "${deletingOrder.no}" deleted.`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to delete production order.', 'error');
    } finally {
      setDeletingOrder(null);
    }
  };

  const handleImportOrders = (rows) => {
    const imported = rows.map((row, index) => ({
      no: row['Order No'] || row.no || `PO-IMP-${Date.now()}-${index}`,
      product: row.Product || row.product || 'Imported Product',
      bom: row.BOM || row.bom || 'BOM-001',
      planned: Number(row.Planned || row.planned || 0),
      produced: Number(row.Produced || row.produced || 0),
      warehouse: row.Warehouse || row.warehouse || 'Main WH',
      status: row.Status || row.status || 'Planned',
      priority: row.Priority || row.priority || 'Medium',
      manager: row.Manager || row.manager || 'Import',
      start: row.Start || row.start || new Date().toISOString().slice(0, 10),
      due: row['Due Date'] || row.due || new Date().toISOString().slice(0, 10),
      estCost: row['Est Cost'] || row.estCost || '$0',
      actCost: row['Act Cost'] || row.actCost || '-',
    }));

    imported.forEach(async (order) => {
      try {
        const res = await createProductionOrder(order);
        const saved = res?.data;
        if (saved) setOrders(prev => [saved, ...prev]);
      } catch {
        // silently skip failed imports
      }
    });
  };

  const getStatusBadge = (s) => {
    const map = {
      'Planned': { bg: 'bg-secondary', text: 'text-white' },
      'Released': { bg: 'bg-info', text: 'text-white' },
      'In Progress': { bg: 'bg-warning', text: 'text-dark' },
      'Quality Check': { bg: 'bg-purple', text: 'text-white' },
      'Completed': { bg: 'bg-success', text: 'text-white' },
      'Cancelled': { bg: 'bg-danger', text: 'text-white' },
    };
    const m = map[s] || { bg: 'bg-light', text: 'text-dark' };
    return `${m.bg} ${m.text}`;
  };

  const getPriorityBadge = (p) => {
    const map = { 'High': 'danger', 'Medium': 'warning', 'Low': 'success' };
    return map[p] || 'secondary';
  };

  const progress = (produced, planned) => planned > 0 ? Math.round((produced / planned) * 100) : 0;

  const getStatusColor = (s) => {
    const map = {
      'Planned': '#94a3b8',
      'Released': '#0ea5e9',
      'In Progress': '#f59e0b',
      'Quality Check': '#8b5cf6',
      'Completed': '#10b981',
      'Cancelled': '#ef4444',
    };
    return map[s] || '#94a3b8';
  };

  const getPriorityColor = (p) => {
    const map = { 'High': '#ef4444', 'Medium': '#f59e0b', 'Low': '#10b981' };
    return map[p] || '#64748b';
  };

  const styleTag = `
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
    .premium-table tbody tr:hover { border-left-color: #0891b2 !important; background: ${isDark ? 'rgba(8,145,178,0.08)' : 'rgba(8,145,178,0.03)'} !important; }
    .premium-table tbody tr:nth-child(even) { background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)'}; }
    .premium-table tbody tr:nth-child(even):hover { background: ${isDark ? 'rgba(8,145,178,0.12)' : 'rgba(8,145,178,0.05)'} !important; }
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
    .premium-progress-bar { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee); background-size: 200% 100%; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-progress-bar.complete { background: linear-gradient(90deg, #059669, #10b981, #34d399); }
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
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
    .po-input:focus { border-color: #0891b2 !important; box-shadow: 0 0 0 3px rgba(8,145,178,0.15) !important; }
    .dark-mode .po-input:focus { border-color: #22d3ee !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.25) !important; }
  `;

  const FormField = ({ label, children, width }) => (
    <div className={width || 'col-md-4'}>
      <div className="d-flex align-items-center gap-2 mb-1">
        <span style={{ width: 3, height: 14, borderRadius: 2, background: 'linear-gradient(180deg, #0891b2, #06b6d4)' }} />
        <label className="form-label small fw-semibold mb-0" style={{ fontSize: '10px', letterSpacing: '0.3px', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#475569' }}>
          {label}
        </label>
      </div>
      {children}
    </div>
  );

  if (view === 'create') {
    return (
      <>
        <style>{styleTag}</style>
        <div className={`container-fluid py-4 px-4 ${d}`}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <div style={{ width: 40, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)', marginBottom: 8 }} />
              <h4 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                <FontAwesomeIcon icon={faIndustry} className="me-2 text-primary" />
                Create Production Order
              </h4>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn" onClick={() => setView('list')}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />Cancel
              </button>
              <button className="btn btn-primary btn-sm rounded-pill premium-btn">
                <FontAwesomeIcon icon={faCheck} className="me-1" />Create Order
              </button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-xl-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 premium-card glass-card">
                <div style={{ height: 3, background: 'linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)' }} />
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #0891b2, #06b6d4)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faClipboardCheck} className="me-2 text-primary" />
                      General Information
                    </h6>
                  </div>
                  <div className="row g-3">
                    <FormField label="Order Number"><input type="text" className="form-control form-control-sm rounded-3 po-input" placeholder="Auto-generated" /></FormField>
                    <FormField label="Reference"><input type="text" className="form-control form-control-sm rounded-3 po-input" placeholder="Sales Order / Customer Ref" /></FormField>
                    <FormField label="BOM Selection">
                      <select className="form-select form-select-sm rounded-3 po-input">
                        <option>Select BOM</option>
                      </select>
                    </FormField>
                    <FormField label="Finished Product">
                      <input type="text" className="form-control form-control-sm rounded-3 po-input" placeholder="Enter finished product" />
                    </FormField>
                    <FormField label="Warehouse">
                      <select className="form-select form-select-sm rounded-3 po-input">
                        <option>Main Warehouse</option>
                        <option>Assembly WH</option>
                        <option>Electrical WH</option>
                      </select>
                    </FormField>
                    <FormField label="Quantity Planned"><input type="number" className="form-control form-control-sm rounded-3 po-input" defaultValue={0} /></FormField>
                    <FormField label="Unit"><input type="text" className="form-control form-control-sm rounded-3 po-input" defaultValue="pcs" /></FormField>
                    <FormField label="Production Start"><input type="date" className="form-control form-control-sm rounded-3 po-input" /></FormField>
                    <FormField label="Production Due Date"><input type="date" className="form-control form-control-sm rounded-3 po-input" /></FormField>
                    <FormField label="Priority">
                      <select className="form-select form-select-sm rounded-3 po-input">
                        <option>Medium</option>
                        <option>High</option>
                        <option>Low</option>
                      </select>
                    </FormField>
                    <FormField label="Supervisor">
                      <select className="form-select form-select-sm rounded-3 po-input">
                        <option>John Smith</option>
                        <option>Sarah Lee</option>
                        <option>Mike Chen</option>
                      </select>
                    </FormField>
                    <FormField label="Machine Assignment">
                      <select className="form-select form-select-sm rounded-3 po-input">
                        <option>CNC-01</option>
                        <option>MBL-03</option>
                        <option>WLD-02</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden premium-card glass-card">
                <div style={{ height: 3, background: 'linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)' }} />
                <div className="card-body p-4">
                  <div className="section-header">
                    <div className="accent-bar" style={{ background: 'linear-gradient(180deg, #0891b2, #06b6d4)' }} />
                    <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      <FontAwesomeIcon icon={faRocket} className="me-2 text-primary" />
                      Advanced Options
                    </h6>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { icon: faLayerGroup, label: 'Auto Generate Work Orders', color: '#4f46e5' },
                      { icon: faBox, label: 'Reserve Materials', color: '#0891b2' },
                      { icon: faPaperclip, label: 'Attach Documents', color: '#059669' },
                      { icon: faHistory, label: 'Production History', color: '#d97706' },
                    ].map((f, idx) => (
                      <button key={idx} className="btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn"
                        style={{ background: `${f.color}10`, color: f.color }}>
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

  return (
    <>
      <style>{styleTag}</style>
      <div className={`container-fluid py-4 px-4 ${d}`}>
        {/* Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ position: 'relative', zIndex: 110 }}>
          <div>
            <div style={{ width: 40, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)', marginBottom: 8 }} />
            <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
              <FontAwesomeIcon icon={faIndustry} className="me-2 text-primary" />
              Production Orders
            </h4>
            <p className="text-muted small mb-0">
              <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ fontSize: '10px', opacity: 0.6 }} />
              Plan, schedule, and manage manufacturing production orders.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm rounded-pill px-3 premium-btn" onClick={() => setView('create')}>
              <FontAwesomeIcon icon={faPlus} className="me-1" />New Production Order
            </button>
            <FxImportDropdown
              title="Production Orders"
              isDark={isDark}
              addNotification={addNotification}
              onImport={handleImportOrders}
              buttonClassName="btn btn-sm rounded-pill premium-btn"
              buttonStyle={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }}
            />
            <FxExportDropdown
              data={filtered}
              getExportData={(data) => data.map((o) => ({
                'Order No': o.no,
                Product: o.product,
                BOM: o.bom,
                Planned: o.planned,
                Produced: o.produced,
                Warehouse: o.warehouse,
                Status: o.status,
                Priority: o.priority,
                Manager: o.manager,
                Start: o.start,
                'Due Date': o.due,
                'Est Cost': o.estCost,
                'Act Cost': o.actCost,
              }))}
              title="Production Orders Report"
              filenamePrefix="mfg-production-orders"
              moduleLabel="MFG Module"
              isDark={isDark}
              addNotification={addNotification}
              buttonClassName="btn btn-sm rounded-pill premium-btn"
              buttonStyle={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none' }}
            />
            <button className="btn btn-outline-secondary btn-sm rounded-pill premium-btn"><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Calendar</button>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 premium-card glass-card">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-transparent border-end-0 rounded-start-3">
                    <FontAwesomeIcon icon={faSearch} style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b' }} />
                  </span>
                  <input type="text" className="form-control form-control-sm border-start-0 rounded-end-3 po-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3 po-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3 po-input"><option>All Products</option></select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3 po-input"><option>All Priorities</option></select>
              </div>
              <div className="col-md-2">
                <select className="form-select form-select-sm rounded-3 po-input"><option>All Managers</option></select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card border-0 shadow-sm rounded-4 premium-card glass-card">
          <div className="card-body p-0">
            <div className="premium-table-wrapper table-responsive">
              {loading ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1.5rem', color: '#0891b2' }} />
                  <div className="text-muted small mt-2">Loading production orders...</div>
                </div>
              ) : (
                <table className="table table-borderless align-middle mb-0 premium-table">
                  <thead>
                    <tr>
                      <th>Order No</th>
                      <th>Product</th>
                      <th>BOM</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Manager</th>
                      <th>Due Date</th>
                      <th>Est Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o, idx) => {
                      const pct = progress(o.produced, o.planned);
                      return (
                        <tr key={o.id || idx} className="enter-anim">
                          <td>
                            <span className="fw-bold" style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{o.no}</span>
                          </td>
                          <td style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#334155' }}>{o.product}</td>
                          <td><span className="badge" style={{ fontSize: '9px', background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500, padding: '3px 8px' }}>{o.bom}</span></td>
                          <td style={{ minWidth: 140 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="premium-progress flex-grow-1">
                                <div className={`premium-progress-bar${pct >= 100 ? ' complete' : ''}`} style={{ width: pct + '%' }} />
                              </div>
                              <div style={{ minWidth: 28, textAlign: 'right' }}>
                                <span style={{ fontSize: '10px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>{pct}%</span>
                                <span style={{ fontSize: '9px', color: isDark ? '#64748b' : '#94a3b8', display: 'block', lineHeight: 1 }}>{o.produced}/{o.planned}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="premium-badge" style={{
                              background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                              color: getStatusColor(o.status),
                            }}>
                              <span className="badge-dot" style={{ background: getStatusColor(o.status) }} />
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <span className="premium-badge" style={{
                              background: getPriorityColor(o.priority) + '14',
                              color: getPriorityColor(o.priority),
                            }}>
                              {o.priority}
                            </span>
                          </td>
                          <td style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>{o.manager}</td>
                          <td style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" style={{ fontSize: '9px', opacity: 0.5 }} />
                            {o.due}
                          </td>
                          <td className="fw-bold" style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{o.estCost}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="premium-action-btn" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }} title="View"><FontAwesomeIcon icon={faEye} style={{ fontSize: '10px' }} /></button>
                              <button className="premium-action-btn" style={{ background: '#0891b214', color: '#0891b2' }} title="Edit"><FontAwesomeIcon icon={faEdit} style={{ fontSize: '10px' }} /></button>
                              <button className="premium-action-btn" style={{ background: '#10b98114', color: '#10b981' }} title="Start"><FontAwesomeIcon icon={faPlayCircle} style={{ fontSize: '10px' }} /></button>
                              <button className="premium-action-btn" style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }} title="Delete" onClick={() => setDeletingOrder(o)}><FontAwesomeIcon icon={faTrash} style={{ fontSize: '10px' }} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr><td colSpan={10} className="text-center py-5 text-muted">No production orders found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Production Order Confirmation */}
      <DialogBox.Confirm
        show={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Production Order"
        message={`Are you sure you want to delete "${deletingOrder?.no || deletingOrder?.id}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
};

export default MfgProductionOrders;
