import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFileExport, faEye, faEdit, faTrashCan,
  faUsers, faWallet, faClock, faChartLine, faShieldAlt,
  faCheckCircle, faTriangleExclamation, faGlobe, faRotate,
  faBrain, faInfoCircle, faDownload, faFileCsv, faFilePdf,
  faFileExcel, faIdBadge, faMoneyBillWave
} from "@fortawesome/free-solid-svg-icons";
import { DeleteConfirmDialog } from '../../../components/common';
import { listContractors, deleteContractor } from '../../../api/fms';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';

const statusColors = {
  'Active': { bg: 'rgba(16,185,129,0.12)', color: '#10b981', dot: '#10b981' },
  'In Review': { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', dot: '#6366f1' },
  'On Hold': { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', dot: '#f59e0b' },
  'Inactive': { bg: 'rgba(100,116,139,0.12)', color: '#64748b', dot: '#64748b' },
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

const ContractorPayments = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  const fetchContractors = async () => {
    setLoading(true); setError(null);
    try {
      const res = await listContractors();
      const items = (res.data?.data || []).map(v => ({ ...v, id: v.id, status: v.status || 'Active' }));
      setContractors(items);
    } catch (err) {
      setError(err.message || 'Failed to load contractors');
      addNotification?.(err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchContractors(); }, []);
  useEffect(() => {
    const onRefresh = () => fetchContractors();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.name || '' });
  const handleDeleteConfirm = async () => {
    try {
      await deleteContractor(deleteDialog.id);
      addNotification?.('Contractor deleted.', 'success');
      setDeleteDialog({ show: false, id: null, name: '' });
      fetchContractors();
    } catch (err) { addNotification?.(err.message || 'Failed to delete contractor', 'error'); }
  };

  const handleEdit = (row) => {
    addNotification?.('Edit mode: update fields and re-save.', 'info');
  };

  const kpiData = useMemo(() => [
    { label: 'Active Contractors', val: contractors.filter(c => c.status === 'Active').length, icon: faUsers, color: '#6366f1', trend: 'up', trendVal: `${contractors.filter(c => c.status === 'Active').length} Active` },
    { label: 'Pending Payments', val: formatCurrency(contractors.filter(c => c.status === 'In Review').reduce((s, c) => s + parseFloat(c.totalPaid || 0), 0)), icon: faClock, color: '#f59e0b', trend: 'down', trendVal: 'In Review' },
    { label: 'Total Paid (MTD)', val: formatCurrency(contractors.reduce((s, c) => s + parseFloat(c.totalPaid || 0), 0)), icon: faWallet, color: '#10b981', trend: 'up', trendVal: 'Cumulative' },
    { label: 'Compliance Rate', val: '99.2%', icon: faShieldAlt, color: '#8b5cf6', trend: 'up', trendVal: '+0.5%' },
  ], [contractors]);

  const filtered = useMemo(() => contractors.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const haystack = `${c.name || ''} ${c.skill || ''} ${c.country || ''}`.toLowerCase();
    return matchesStatus && haystack.includes(searchTerm.toLowerCase());
  }), [contractors, statusFilter, searchTerm]);

  const statusTabs = ['All', 'Active', 'In Review', 'On Hold', 'Inactive'];

  const columns = [
    { key: 'name', label: 'Contractor', bold: true, render: (val, row) => (
      <span className="fw-bold" style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => setViewItem(row)}>{val}</span>
    )},
    { key: 'type', label: 'Type', render: (val) => <span style={{ color: mutedColor }}>{val}</span> },
    { key: 'skill', label: 'Skill', render: (val) => <span style={{ color: mutedColor }}>{val}</span> },
    { key: 'rate', label: 'Rate', render: (val) => <span className="fw-medium">{val > 0 ? `$${val}/hr` : 'Fixed'}</span> },
    { key: 'country', label: 'Country', render: (val) => <span><FontAwesomeIcon icon={faGlobe} className="me-1 text-muted" style={{ fontSize: '0.75rem' }} />{val}</span> },
    { key: 'status', label: 'Status' },
    { key: 'totalPaid', label: 'Total Paid', render: (val) => <span className="fw-bold font-monospace" style={{ color: textColor }}>{formatCurrency(val)}</span> },
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
      const headers = ['Name', 'Type', 'Skill', 'Rate', 'Country', 'Status', 'Total Paid', 'Last Payment'];
      const data = rows.map(c => [c.name, c.type, c.skill, c.rate > 0 ? `$${c.rate}/hr` : 'Fixed', c.country, c.status, c.totalPaid, c.lastPayment]);
      if (format === 'csv') {
        const BOM = '\uFEFF';
        const csv = [headers.join(','), ...data.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
        blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        filename = 'contractors.csv';
      } else {
        blob = new Blob([JSON.stringify({ headers, data }, null, 2)], { type: 'application/json' });
        filename = 'contractors.json';
      }
      downloadBlob(blob, filename);
      addNotification?.('Contractor data exported.', 'success');
    } catch (err) { addNotification?.(err.message, 'error'); }
  };

  return (
    <ErpPageShell
      title="Contractor Payments Center"
      subtitle="Manage contractor compensation, billing schedules, and settlements."
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
          <span className="text-muted ms-2 small">3 contractors are due for performance review. Optimize your payment schedule by prioritizing high-impact roles.</span>
        </div>
        <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => addNotification?.('AI insights generated.', 'info')}><FontAwesomeIcon icon={faRotate} className="me-1" />Refresh</button>
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
                <h5 className="fw-bold">Contractor Preview</h5>
                <button className="btn-close" onClick={() => setViewItem(null)} />
              </div>
              <div className="modal-body px-4 py-3">
                <div className="row g-4">
                  <div className="col-md-6"><small className="text-muted">Name</small><p className="fw-bold mb-0">{viewItem.name}</p></div>
                  <div className="col-md-6"><small className="text-muted">Type</small><p className="fw-bold mb-0">{viewItem.type}</p></div>
                  <div className="col-md-6"><small className="text-muted">Skill</small><p className="fw-bold mb-0">{viewItem.skill}</p></div>
                  <div className="col-md-6"><small className="text-muted">Rate</small><p className="fw-bold mb-0">{viewItem.rate > 0 ? `$${viewItem.rate}/hr` : 'Fixed'}</p></div>
                  <div className="col-md-6"><small className="text-muted">Country</small><p className="fw-bold mb-0">{viewItem.country}</p></div>
                  <div className="col-md-6"><small className="text-muted">Currency</small><p className="fw-bold mb-0">{viewItem.currency || 'USD'}</p></div>
                  <div className="col-md-6"><small className="text-muted">Total Paid</small><p className="fw-bold mb-0">{formatCurrency(viewItem.totalPaid)}</p></div>
                  <div className="col-md-6"><small className="text-muted">Last Payment</small><p className="fw-bold mb-0">{viewItem.lastPayment}</p></div>
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
              <input type="text" className="form-control border-start-0 bg-transparent" placeholder="Search contractors..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} style={{ color: textColor }} />
            </div>
          </div>

          <ErpDataTable
            columns={columns}
            data={filtered}
            loading={loading}
            error={error}
            emptyMessage="No contractors found."
            onRetry={fetchContractors}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        title="Delete Contractor"
        message={`Are you sure you want to delete "${deleteDialog.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ show: false, id: null, name: '' })}
      />
    </ErpPageShell>
  );
};

export default ContractorPayments;
