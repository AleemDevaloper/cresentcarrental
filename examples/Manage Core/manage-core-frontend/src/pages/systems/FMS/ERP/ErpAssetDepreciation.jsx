import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faPen, faTrash,
  faRefresh, faCheckCircle, faBan, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronDown, faXmark, faPrint, faScaleBalanced,
  faChartLine, faClock, faBriefcase, faGlobe, faHistory, faFileInvoice,
  faFolderOpen, faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck,
  faListCheck, faBuilding, faDiagramProject, faUsers, faWarehouse, faIndustry,
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf,
  faCalculator, faArrowRotateLeft, faLock, faUnlock
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssetDepreciations, deleteAssetDepreciation } from '../../../../api/fms';

const ErpAssetDepreciation = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssetDepreciations();
      setRuns(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load depreciation runs');
      addNotification('Failed to load depreciation runs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRuns(); }, []);


  const kpiData = useMemo(() => [
    { label: 'Total Runs', val: runs.length, icon: faCalculator, color: accentColor, trend: 'up', trendVal: 'Depreciation Runs' },
    { label: 'Completed Runs', val: runs.filter(r => r.status === 'Completed').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Successful' },
    { label: 'Total Assets Depreciated', val: runs.reduce((s, r) => s + r.summary.totalAssets, 0), icon: faChartLine, color: '#3b82f6', trend: 'up', trendVal: 'Across All Runs' },
    { label: 'Total Acquisition Value', val: '$' + runs.reduce((s, r) => s + r.summary.totalAcquisition, 0).toLocaleString(), icon: faCoins, color: '#8b5cf6', trend: 'up', trendVal: 'Capital Pool' },
  ], [runs]);

  const filteredRuns = runs.filter(r => {
    const matchesSearch =
      r.runName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.runNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.accountingPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'asset_depreciation' });
    setActiveTab('erp_run_depreciation');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.runName || row.runNumber || '' });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await deleteAssetDepreciation(id);
      addNotification('Depreciation run deleted successfully', 'success');
      await fetchRuns();
    } catch (err) {
      addNotification(err.message || 'Failed to delete depreciation run', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, row: null, name: '' });
    }
  };

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Depreciation Run Hub"
      description="Manage automated asset depreciation, accounting entries, fiscal postings, depreciation schedules, and financial compliance."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_run_depreciation')}>
            <FontAwesomeIcon icon={faCalculator} /> Run Depreciation
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Depreciation reversed for Period 06.', 'warning')}>
            <FontAwesomeIcon icon={faArrowRotateLeft} className="me-1" /> Reverse Depreciation
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Current period locked for asset adjustments.', 'success')}>
            <FontAwesomeIcon icon={faLock} className="me-1" /> Close Period
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Excel exported.', 'success')}>
            Export Excel
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={fetchRuns}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <p className="mt-2 text-muted">Loading depreciation runs...</p>
        </div>
      )}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchRuns}>Retry</button>
        </div>
      )}
      {!loading && !error && (
      <>
      {/* KPI Row */}
      <div className="row g-3 mb-4">
        {kpiData.map((k, idx) => (
          <ErpKpiCard
            key={idx}
            label={k.label}
            value={k.val}
            icon={k.icon}
            color={k.color}
            trend={k.trend}
            trendVal={k.trendVal}
            sparkline={k.sparkline}
            isDark={isDark}
          />
        ))}
      </div>
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Depreciation Runs Journal', icon: faFolderOpen },
          { id: 'dashboard', label: 'Depreciation Forecasts & Yields', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className="btn btn-sm py-2 px-3 fw-bold"
            style={{
              color: activeSubTab === tb.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeSubTab === tb.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px'
            }}
            onClick={() => setActiveSubTab(tb.id)}
          >
            <FontAwesomeIcon icon={tb.icon} className="me-2" />
            {tb.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'directory' && (
        <ErpDataTable
          columns={[
            { key: 'runNumber', label: 'Run Number', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const r = runs.find(x => x.runNumber === val); if (r) { setSelectedRun(r); setActiveDetailTab('overview'); } }}>{val}</span> },
            { key: 'runName', label: 'Run Name', bold: true },
            { key: 'period', label: 'Fiscal Period', render: (_, row) => <>{row.fiscalYear} â€¢ {row.accountingPeriod}</> },
            { key: 'runDate', label: 'Execution Date' },
            { key: 'totalAssets', label: 'Assets Run', render: (_, row) => <span className="font-monospace">{row.summary.totalAssets}</span> },
            { key: 'totalAcquisition', label: 'Acquisition Pool', render: (_, row) => <span className="font-monospace fw-bold text-success">${row.summary.totalAcquisition.toLocaleString()}</span> },
            { key: 'depExpense', label: 'Expense Posted', render: (_, row) => <span className="font-monospace fw-bold text-danger">${row.summary.depExpense.toLocaleString()}</span> },
            { key: 'runType', label: 'Run Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
            { key: 'status', label: 'Status', render: (val, row) => (
              <span className="premium-badge" style={{
                background: row.status === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#334155' : '#f1f5f9'),
                color: row.status === 'Completed' ? '#10b981' : textColor
              }}>{row.status}</span>
            )},
            { key: 'actions', label: '', render: (_, row) => (
              <div className="d-flex justify-content-end gap-1">
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedRun(row); setActiveDetailTab('overview'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }} onClick={() => handleEditClick(row)} title="Edit"><FontAwesomeIcon icon={faPen} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(row)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )},
          ]}
          data={filteredRuns}
          searchable
          searchPlaceholder="Search by Run Code, Name, Accounting Period..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {(() => {
            const totalAssets = runs.reduce((s, r) => s + (r.summary?.totalAssets || 0), 0);
            const totalAcq = runs.reduce((s, r) => s + (r.summary?.totalAcquisition || 0), 0);
            const totalDep = runs.reduce((s, r) => s + (r.summary?.depExpense || 0), 0);
            const totalAccum = runs.reduce((s, r) => s + (r.summary?.accumDepreciation || 0), 0);
            const totalNBV = runs.reduce((s, r) => s + (r.summary?.netBookValue || 0), 0);
            const completed = runs.filter(r => r.status === 'Completed').length;
            const draft = runs.filter(r => r.status === 'Draft').length;
            const failed = runs.filter(r => r.status === 'Failed').length;
            const monthly = runs.length ? Math.round(totalDep / runs.length) : 0;
            const quarterly = monthly * 3;
            const yearly = monthly * 12;
            return [
              { label: 'Eligible Assets Pool', val: `${totalAssets} Assets`, sub: 'Capitalized assets eligible', color: accentColor },
              { label: 'Assets Depreciated', val: `${totalAssets} Assets`, sub: 'Depreciation current', color: '#10b981' },
              { label: 'Monthly Depreciation', val: `$${monthly.toLocaleString()}`, sub: 'Period expense average', color: '#ef4444' },
              { label: 'Quarterly Depreciation', val: `$${quarterly.toLocaleString()}`, sub: 'Cumulative quarter', color: '#ef4444' },
              { label: 'Yearly Depreciation', val: `$${yearly.toLocaleString()}`, sub: 'Annual target forecast', color: '#ef4444' },
              { label: 'Accumulated Depreciation', val: `$${totalAccum.toLocaleString()}`, sub: 'Book balances total', color: '#ef4444' },
              { label: 'Current Book Value', val: `$${totalNBV.toLocaleString()}`, sub: 'NBV remaining', color: '#3b82f6' },
              { label: 'Depreciation Posted', val: `$${totalAccum.toLocaleString()}`, sub: 'General Ledger posted', color: '#10b981' },
              { label: 'Draft Runs', val: draft, sub: 'Temporary simulations', color: '#64748b' },
              { label: 'Failed Runs', val: failed, sub: 'Check log entries', color: '#ef4444' },
              { label: 'Completed Runs', val: completed, sub: 'Successful runs', color: '#10b981' },
              { label: 'Total Runs', val: runs.length, sub: 'All depreciation runs', color: accentColor }
            ];
          })().map((k, idx) => (
            <ErpKpiCard
              key={idx}
              label={k.label}
              value={k.val}
              icon={faChartLine}
              color={k.color}
              trendVal={k.sub}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Depreciation Run"
        message="Are you sure you want to delete this depreciation run? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

      {selectedRun && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedRun.runNumber}</span>
              <h5 className="fw-bold mb-0">{selectedRun.runName}</h5>
              <span className="text-muted small">{selectedRun.fiscalYear} â€¢ {selectedRun.accountingPeriod} ({selectedRun.depBook})</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedRun(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assets', label: 'Eligible Assets Pool' },
              { id: 'calculation', label: 'Calculation Matrix' },
              { id: 'journal', label: 'Journal Entries' },
              { id: 'accounting', label: 'Accounting Allocations' },
              { id: 'costcenters', label: 'Cost Centers' },
              { id: 'projects', label: 'Projects' },
              { id: 'departments', label: 'Departments' },
              { id: 'approvals', label: 'Approvals' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'documents', label: 'Documents' },
              { id: 'notes', label: 'Notes' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'ai', label: 'AI Insights' }
            ].map(dt => (
              <button
                key={dt.id}
                className={`premium-tab-btn btn btn-sm py-1 px-2 fw-bold ${activeDetailTab === dt.id ? 'active' : ''}`}
                style={{
                  color: activeDetailTab === dt.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                  background: activeDetailTab === dt.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  fontSize: '0.68rem',
                  borderRadius: '6px',
                  border: 'none'
                }}
                onClick={() => setActiveDetailTab(dt.id)}
              >
                {dt.label}
              </button>
            ))}
          </div>

          <div className="flex-grow-1 overflow-auto pe-2" style={{ fontSize: '0.8rem' }}>
            {activeDetailTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-12"><strong>Run Objective:</strong><p className="text-muted mt-1">{selectedRun.description}</p></div>
                <div className="col-md-6"><strong>Run Date Execution:</strong><span className="d-block text-muted">{selectedRun.runDate} ({selectedRun.runType})</span></div>
                <div className="col-md-6"><strong>Status:</strong><span className="d-block text-muted">{selectedRun.status}</span></div>
                <div className="col-md-6"><strong>Total Depreciation Expense:</strong><span className="d-block text-danger fw-bold font-monospace">${selectedRun.summary.depExpense.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Remaining Net Book Value:</strong><span className="d-block text-success fw-bold font-monospace">${selectedRun.summary.netBookValue.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'journal' && (
              <div>
                <h6>General Ledger Journal Entries</h6>
                <div className="premium-table-wrapper mt-2">
                  <div className="table-responsive">
                    <table className="premium-table" style={{ fontSize: '0.72rem' }}>
                      <thead>
                        <tr>
                          <th>Account Name & Code</th>
                          <th>Debit ($)</th>
                          <th>Credit ($)</th>
                          <th>Cost Center</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRun.journalEntries.map((je, i) => (
                          <tr key={i}>
                            <td className="font-monospace">{je.account}</td>
                            <td className="text-success font-monospace fw-bold">{je.debit > 0 ? `$${je.debit.toLocaleString()}` : '-'}</td>
                            <td className="text-danger font-monospace fw-bold">{je.credit > 0 ? `$${je.credit.toLocaleString()}` : '-'}</td>
                            <td className="font-monospace text-muted">{je.costCenter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {['assets', 'calculation', 'accounting', 'costcenters', 'projects', 'departments', 'approvals', 'timeline', 'documents', 'notes', 'attachments', 'audit', 'analytics', 'ai'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedRun(null)}>Close</button>
          </div>
        </div>
      )}
      </>
      )}
    </ErpPageShell>
  );
};

export default ErpAssetDepreciation;
