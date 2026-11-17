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
  faDumpster, faHandshakeAngle, faPercent, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssetDisposals, deleteAssetDisposal } from '../../../../api/fms';

const ErpAssetDisposals = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisposal, setSelectedDisposal] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [disposals, setDisposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDisposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssetDisposals();
      setDisposals(res.data?.data || res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load asset disposals');
      addNotification('Failed to load asset disposals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDisposals(); }, []);


  const kpiData = useMemo(() => [
    { label: 'Total Disposals', val: disposals.length, icon: faDumpster, color: accentColor, trend: 'up', trendVal: 'Retired Assets' },
    { label: 'Completed', val: disposals.filter(d => d.status === 'Approved').length, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Approved' },
    { label: 'Total Recovered Value', val: '$' + disposals.reduce((s, d) => s + d.recoveredValue, 0).toLocaleString(), icon: faCoins, color: '#8b5cf6', trend: 'up', trendVal: 'Cash Recovered' },
  ], [disposals]);

  const filteredDisposals = disposals.filter(d => {
    const matchesSearch =
      d.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.disposalNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditClick = (row) => {
    setEditDocument({ ...row, documentType: 'asset_disposal' });
    setActiveTab('erp_dispose_asset');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.assetName || row.disposalNumber || '' });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    try {
      await deleteAssetDisposal(id);
      addNotification('Asset disposal deleted successfully', 'success');
      await fetchDisposals();
    } catch (err) {
      addNotification(err.message || 'Failed to delete asset disposal', 'error');
    } finally {
      setDeleteDialog({ show: false, id: null, row: null, name: '' });
    }
  };

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Asset Retirement & Disposals"
      description="Manage asset retirement, disposal, sales, write-offs, transfers, scrapping, donations, and gain/loss accounting."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_dispose_asset')}>
            <FontAwesomeIcon icon={faTrashCan} /> Dispose Asset
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Assets retirement report ready.', 'success')}>
            Asset Retirement Report
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Excel exported.', 'success')}>
            Export Excel
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={fetchDisposals}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <p className="mt-2 text-muted">Loading asset disposals...</p>
        </div>
      )}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchDisposals}>Retry</button>
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
          { id: 'directory', label: 'Disposal Master Journal', icon: faFolderOpen },
          { id: 'dashboard', label: 'Disposals Metrics & Analysis', icon: faChartPie },
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
            { key: 'disposalNumber', label: 'Disposal Number', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const d = disposals.find(x => x.disposalNumber === val); if (d) { setSelectedDisposal(d); setActiveDetailTab('overview'); } }}>{val}</span> },
            { key: 'assetCode', label: 'Asset Code', render: (val) => <span className="font-monospace text-muted">{val}</span> },
            { key: 'assetName', label: 'Asset Name', bold: true },
            { key: 'disposalType', label: 'Disposal Type', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
            { key: 'bookValue', label: 'Book Value', render: (val) => <span className="font-monospace">${val.toLocaleString()}</span> },
            { key: 'recoveredValue', label: 'Recovered Amt', render: (val) => <span className="font-monospace fw-bold text-success">${val.toLocaleString()}</span> },
            { key: 'gainLoss', label: 'Gain / Loss', render: (val) => <span className="font-monospace fw-bold" style={{ color: val >= 0 ? '#10b981' : '#ef4444' }}>{val >= 0 ? `+$${val.toLocaleString()}` : `-$${Math.abs(val).toLocaleString()}`}</span> },
            { key: 'disposalDate', label: 'Disposal Date' },
            { key: 'status', label: 'Status', render: (val, row) => (
              <span className="premium-badge" style={{
                background: row.status === 'Approved' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'),
                color: row.status === 'Approved' ? '#10b981' : '#ef4444'
              }}>{row.status}</span>
            )},
            { key: 'actions', label: '', render: (_, row) => (
              <div className="d-flex justify-content-end gap-1">
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedDisposal(row); setActiveDetailTab('overview'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#3b3b1f' : '#fef9c3', color: isDark ? '#facc15' : '#ca8a04', border: 'none', padding: '2px 8px' }} onClick={() => handleEditClick(row)} title="Edit"><FontAwesomeIcon icon={faPen} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(row)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )},
          ]}
          data={filteredDisposals}
          searchable
          searchPlaceholder="Search by Disposal Code, Asset Code, Name..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {(() => {
            const totalRecovered = disposals.reduce((s, d) => s + (d.recoveredValue || 0), 0);
            const totalGain = disposals.filter(d => (d.gainLoss || 0) > 0).reduce((s, d) => s + d.gainLoss, 0);
            const totalLoss = disposals.filter(d => (d.gainLoss || 0) < 0).reduce((s, d) => s + Math.abs(d.gainLoss), 0);
            const totalBookValue = disposals.reduce((s, d) => s + (d.bookValue || 0), 0);
            const now = new Date();
            const thisMonth = disposals.filter(d => {
              const dd = new Date(d.disposalDate);
              return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear();
            }).length;
            const thisYear = disposals.filter(d => {
              const dd = new Date(d.disposalDate);
              return dd.getFullYear() === now.getFullYear();
            }).length;
            const sold = disposals.filter(d => d.disposalType === 'Sale').length;
            const scrapped = disposals.filter(d => d.disposalType === 'Scrap').length;
            const donated = disposals.filter(d => d.disposalType === 'Donation').length;
            const writeoffs = disposals.filter(d => d.disposalType === 'Write-off').length;
            const transfers = disposals.filter(d => d.disposalType === 'Transfer').length;
            const pending = disposals.filter(d => d.status === 'Pending Approval').length;
            return [
              { label: 'Total Disposals', val: disposals.length, sub: 'Retired Asset Records', color: accentColor },
              { label: 'Pending Disposal', val: pending, sub: 'Awaiting controller approval', color: '#f59e0b' },
              { label: 'Approved Disposal', val: disposals.filter(d => d.status === 'Approved').length, sub: 'Posted to GL ledger', color: '#10b981' },
              { label: 'Disposed This Month', val: `${thisMonth} Asset${thisMonth !== 1 ? 's' : ''}`, sub: 'Current month close out', color: '#8b5cf6' },
              { label: 'Disposed This Year', val: `${thisYear} Assets`, sub: `FY ${now.getFullYear()} run`, color: '#06b6d4' },
              { label: 'Assets Sold', val: sold, sub: 'Cash recovered asset', color: '#10b981' },
              { label: 'Assets Scrapped', val: scrapped, sub: 'Written off to zero scrap', color: '#ef4444' },
              { label: 'Assets Donated', val: donated, sub: 'Charity mappings', color: '#8b5cf6' },
              { label: 'Write-offs', val: writeoffs, sub: 'Total loss write-offs', color: '#ef4444' },
              { label: 'Transfer Out', val: transfers, sub: 'Inter-branch transfers', color: '#64748b' },
              { label: 'Gain on Disposal', val: `+$${totalGain.toLocaleString()}`, sub: 'Realized positive gain', color: '#10b981' },
              { label: 'Loss on Disposal', val: `-$${totalLoss.toLocaleString()}`, sub: 'Write-down loss realized', color: '#ef4444' },
              { label: 'Disposal Value pool', val: `$${totalBookValue.toLocaleString()}`, sub: 'Acquisition cost removed', color: '#3b82f6' },
              { label: 'Recovered Amount pool', val: `$${totalRecovered.toLocaleString()}`, sub: 'Total recovery cash pool', color: '#10b981' },
              { label: 'Pending Approvals', val: pending, sub: 'CFO queue status', color: '#64748b' }
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
        title="Delete Asset Disposal"
        message="Are you sure you want to delete this asset disposal? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

      {selectedDisposal && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedDisposal.disposalNumber}</span>
              <h5 className="fw-bold mb-0">{selectedDisposal.assetName} ({selectedDisposal.assetCode})</h5>
              <span className="text-muted small">{selectedDisposal.category} â€¢ {selectedDisposal.department}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedDisposal(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'financial', label: 'Disposal Financials' },
              { id: 'accounting', label: 'Accounting configuration' },
              { id: 'journal', label: 'GL Journal Entries' },
              { id: 'documents', label: 'Documents' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'approvals', label: 'Approvals Log' },
              { id: 'notes', label: 'Notes' },
              { id: 'attachments', label: 'Attachments' },
              { id: 'audit', label: 'Audit Logs' },
              { id: 'analytics', label: 'Analytics' }
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
                <div className="col-md-12"><strong>Reason for Disposal:</strong><p className="text-muted mt-1">{selectedDisposal.reason}</p></div>
                <div className="col-md-6"><strong>Disposal Type:</strong><span className="d-block text-muted">{selectedDisposal.disposalType}</span></div>
                <div className="col-md-6"><strong>Buyer/Recipient:</strong><span className="d-block text-muted">{selectedDisposal.buyer}</span></div>
                <div className="col-md-6"><strong>Execution Date:</strong><span className="d-block text-muted font-monospace">{selectedDisposal.disposalDate}</span></div>
                <div className="col-md-6"><strong>Status:</strong><span className="d-block text-muted">{selectedDisposal.status}</span></div>
              </div>
            )}

            {activeDetailTab === 'financial' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Residual Net Book Value:</strong><span className="d-block font-monospace">${selectedDisposal.bookValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Accum Depreciation Released:</strong><span className="d-block font-monospace">${selectedDisposal.accumDepreciation.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Sale / Recovery Price:</strong><span className="d-block text-success font-monospace fw-bold">${selectedDisposal.salePrice.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Scrap Recovery Value:</strong><span className="d-block text-success font-monospace fw-bold">${selectedDisposal.scrapValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Net Gain / Loss Realized:</strong><span className="d-block font-monospace fw-bold" style={{ color: selectedDisposal.gainLoss >= 0 ? '#10b981' : '#ef4444' }}>${selectedDisposal.gainLoss.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'journal' && (
              <div>
                <h6>General Ledger Disposal Journal Entries</h6>
                <div className="premium-table-wrapper mt-2">
                  <div className="table-responsive">
                    <table className="premium-table" style={{ fontSize: '0.72rem' }}>
                      <thead>
                        <tr>
                          <th>Account Name & Code</th>
                          <th>Debit ($)</th>
                          <th>Credit ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDisposal.journalEntries.map((je, i) => (
                          <tr key={i}>
                            <td className="font-monospace">{je.account}</td>
                            <td className="text-success font-monospace fw-bold">{je.debit > 0 ? `$${je.debit.toLocaleString()}` : '-'}</td>
                            <td className="text-danger font-monospace fw-bold">{je.credit > 0 ? `$${je.credit.toLocaleString()}` : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {['accounting', 'documents', 'timeline', 'approvals', 'notes', 'attachments', 'audit', 'analytics'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedDisposal(null)}>Close</button>
          </div>
        </div>
      )}
      </>
      )}
    </ErpPageShell>
  );
};

export default ErpAssetDisposals;
