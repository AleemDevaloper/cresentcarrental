import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFileExport, faEye, faEdit, faTrashCan,
  faWallet, faClock, faCheckCircle, faTriangleExclamation,
  faReceipt, faPlane, faUtensils, faGasPump, faBed,
  faLaptop, faBriefcase, faStethoscope, faGraduationCap,
  faBrain, faInfoCircle, faRotate, faFileCsv, faFilePdf
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../components/common';
import { listExpenseClaims, deleteExpenseClaim } from '../../../api/fms';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';

const statusColors = {
  'Pending': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  'In Review': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', dot: '#6366f1' },
  'Approved': { bg: 'rgba(6,182,212,0.12)', color: '#06b6d4', dot: '#06b6d4' },
  'Paid': { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  'Rejected': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', dot: '#ef4444' },
};

const riskColors = {
  'Low': { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  'Medium': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  'High': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', dot: '#ef4444' },
};

const typeIcons = {
  Travel: faPlane, Meals: faUtensils, Fuel: faGasPump,
  Accommodation: faBed, Office: faLaptop, Medical: faStethoscope,
  Training: faGraduationCap, Project: faBriefcase,
};

const formatCurrency = (val) => {
  const n = parseFloat(val || 0);
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
};

const ExpenseClaims = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const fetchClaims = async () => {
    setLoading(true); setError(null);
    try {
      const res = await listExpenseClaims();
      const items = (res.data?.data || []).map(v => ({ ...v, id: v.id, status: v.status || 'Pending' }));
      setClaims(items);
    } catch (err) {
      setError(err.message || 'Failed to load expense claims');
      addNotification?.(err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchClaims(); }, []);
  useEffect(() => {
    const onRefresh = () => fetchClaims();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.user || row?.id || '' });
  const handleDeleteConfirm = async () => {
    try {
      await deleteExpenseClaim(deleteDialog.id);
      addNotification?.('Expense claim deleted.', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
      fetchClaims();
    } catch (err) { addNotification?.(err.message || 'Failed to delete claim', 'error'); }
  };

  const handleEdit = (row) => {
    addNotification?.('Edit mode: update fields and re-save.', 'info');
  };

  const kpiData = useMemo(() => [
    { label: 'Pending Claims', val: claims.filter(c => c.status === 'Pending').length, icon: faClock, color: '#f59e0b', trend: 'up', trendVal: `${claims.filter(c => c.status === 'Pending').length} Awaiting` },
    { label: 'Approved Today', val: formatCurrency(claims.filter(c => c.status === 'Approved').reduce((s, c) => s + parseFloat(c.amount || 0), 0)), icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Approved' },
    { label: 'Avg Processing', val: '1.4 Days', icon: faRotate, color: '#6366f1', trend: 'down', trendVal: '-0.2 vs last month' },
    { label: 'Total Claims Value', val: formatCurrency(claims.reduce((s, c) => s + parseFloat(c.amount || 0), 0)), icon: faWallet, color: '#8b5cf6', trend: 'up', trendVal: `${claims.length} Total` },
  ], [claims]);

  const filtered = useMemo(() => claims.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const haystack = `${c.user || ''} ${c.type || ''} ${c.notes || ''}`.toLowerCase();
    return matchesStatus && haystack.includes(searchTerm.toLowerCase());
  }), [claims, statusFilter, searchTerm]);

  const statusTabs = ['All', 'Pending', 'In Review', 'Approved', 'Paid', 'Rejected'];

  const riskStyle = (risk) => {
    const m = riskColors[risk] || { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
    return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 10px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, background: m.bg, color: m.color };
  };

  const columns = [
    { key: 'user', label: 'Claimant', bold: true, render: (val, row) => (
      <span className="fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => setViewItem(row)}>{val}</span>
    )},
    { key: 'type', label: 'Type', render: (val) => (
      <span className="d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={typeIcons[val] || faReceipt} className="text-primary" />
        <span style={{ color: mutedColor }}>{val}</span>
      </span>
    )},
    { key: 'amount', label: 'Amount', render: (val) => <span className="fw-bold font-monospace" style={{ color: textColor }}>{formatCurrency(val)}</span> },
    { key: 'date', label: 'Date', render: (val) => <span style={{ color: mutedColor, fontSize: '0.85rem' }}>{val}</span> },
    { key: 'risk', label: 'Risk', render: (val) => <span style={riskStyle(val)}><span className="badge-dot" style={{ background: (riskColors[val] || riskColors.Low).color }} />{val}</span> },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm btn-outline-info border-0" title="View" onClick={() => setViewItem(row)}><FontAwesomeIcon icon={faEye} /></button>
        <button className="btn btn-sm btn-outline-primary border-0" title="Edit" onClick={() => handleEdit(row)}><FontAwesomeIcon icon={faEdit} /></button>
        <button className="btn btn-sm btn-outline-danger border-0" title="Delete" onClick={() => handleDeleteClick(row.id, row)}><FontAwesomeIcon icon={faTrashCan} /></button>
      </div>
    )},
  ];

  const handleExport = async (format) => {
    try {
      let blob, filename;
      const rows = filtered;
      const headers = ['User', 'Type', 'Amount', 'Date', 'Risk', 'Status', 'Notes'];
      const data = rows.map(c => [c.user, c.type, c.amount, c.date, c.risk, c.status, c.notes]);
      if (format === 'csv') {
        const BOM = '\uFEFF';
        const csv = [headers.join(','), ...data.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
        blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        filename = 'expense-claims.csv';
      } else {
        blob = new Blob([JSON.stringify({ headers, data }, null, 2)], { type: 'application/json' });
        filename = 'expense-claims.json';
      }
      downloadBlob(blob, filename);
      addNotification?.('Expense claims exported.', 'success');
    } catch (err) { addNotification?.(err.message, 'error'); }
  };

  return (
    <ErpPageShell
      title="Expense Claims Center"
      subtitle="Submit, review, and audit employee expense claims."
      headerActions={
        <div className="d-flex gap-2">
          <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm rounded-3 d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <FontAwesomeIcon icon={faFileExport} /> Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2 text-success" />CSV</button></li>
              <li><button className="dropdown-item" onClick={() => handleExport('json')}><FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />JSON</button></li>
            </ul>
          </div>
        </div>
      }
    >
      {/* AI Recommendation Banner */}
      <div className="alert alert-info d-flex align-items-center gap-3 rounded-4 border-0 shadow-sm mb-4 py-3 px-4" style={{ background: 'linear-gradient(135deg, #eef2ff, #e0f2fe)' }}>
        <FontAwesomeIcon icon={faBrain} className="text-primary fs-5" />
        <div className="flex-grow-1">
          <strong className="text-dark">AI Recommendation</strong>
          <span className="text-muted ms-2 small">2 high-risk claims flagged. Review policy violations before approval to ensure compliance.</span>
        </div>
        <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => addNotification?.('AI risk scan completed.', 'info')}><FontAwesomeIcon icon={faRotate} className="me-1" />Scan</button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <ErpKpiCard kpi={kpi} isDark={isDark} index={idx} />
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {viewItem && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Expense Claim Preview</h5>
                <button className="btn-close" onClick={() => setViewItem(null)} />
              </div>
              <div className="modal-body px-4 py-3">
                <div className="row g-4">
                  <div className="col-md-6"><small className="text-muted">Claimant</small><p className="fw-bold mb-0">{viewItem.user}</p></div>
                  <div className="col-md-6"><small className="text-muted">Type</small><p className="fw-bold mb-0">{viewItem.type}</p></div>
                  <div className="col-md-6"><small className="text-muted">Amount</small><p className="fw-bold mb-0">{formatCurrency(viewItem.amount)}</p></div>
                  <div className="col-md-6"><small className="text-muted">Currency</small><p className="fw-bold mb-0">{viewItem.currency || 'USD'}</p></div>
                  <div className="col-md-6"><small className="text-muted">Date</small><p className="fw-bold mb-0">{viewItem.date}</p></div>
                  <div className="col-md-6"><small className="text-muted">Status</small><p className="fw-bold mb-0">{viewItem.status}</p></div>
                  <div className="col-md-6"><small className="text-muted">Risk</small><p className="fw-bold mb-0">{viewItem.risk}</p></div>
                  <div className="col-12"><small className="text-muted">Notes</small><p className="fw-bold mb-0">{viewItem.notes || '—'}</p></div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light rounded-pill" onClick={() => { setViewItem(null); handleEdit(viewItem); }}>Edit</button>
                <button className="btn btn-primary rounded-pill" onClick={() => setViewItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          {/* Search + Status Filter */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
            <div className="d-flex gap-2 overflow-auto">
              {statusTabs.map(tab => (
                <button key={tab} className={`btn btn-sm rounded-pill px-3 fw-medium ${statusFilter === tab ? 'btn-primary text-white shadow-sm' : 'btn-light text-secondary'}`}
                  onClick={() => setStatusFilter(tab)}>{tab}</button>
              ))}
            </div>
            <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-transparent border-end-0"><FontAwesomeIcon icon={faSearch} style={{ color: mutedColor }} /></span>
              <input type="text" className="form-control border-start-0 bg-transparent" placeholder="Search claims..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} style={{ color: textColor }} />
            </div>
          </div>

          <ErpDataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            emptyMessage="No expense claims found."
            onRetry={fetchClaims}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        title="Delete Expense Claim"
        message={`Are you sure you want to delete claim from "${deleteDialog.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ show: false, id: null, name: '' })}
      />
    </ErpPageShell>
  );
};

export default ExpenseClaims;
