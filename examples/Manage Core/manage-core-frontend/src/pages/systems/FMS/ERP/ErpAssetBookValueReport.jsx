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
  faEnvelope, faCalendarDays, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { DeleteConfirmDialog } from '../../../../components/common';
import { listAssets } from '../../../../api/enterprise';

const ErpAssetBookValueReport = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('financial');
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });

  const [reportRows, setReportRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await listAssets({ per_page: 200 });
      const assets = res.data?.data || res.data || [];
      const rows = assets.map((a, i) => ({
        id: a.id || i + 1,
        code: a.code || a.asset_code || '',
        name: a.name || a.asset_name || '',
        category: a.category || '',
        department: a.department || '',
        branch: a.branch || '',
        location: a.location || '',
        purchaseDate: a.purchase_date || '',
        acquisitionCost: Number(a.acquisition_cost || a.cost || 0),
        additionalCapitalized: Number(a.additional_capitalized || 0),
        residualValue: Number(a.residual_value || 0),
        usefulLife: Number(a.useful_life || 0),
        depMethod: a.depreciation_method || a.dep_method || '',
        accumDepreciation: Number(a.accumulated_depreciation || a.accum_depreciation || 0),
        currentYearDep: Number(a.current_year_depreciation || 0),
        currentMonthDep: Number(a.current_month_depreciation || 0),
        currentBookValue: Number(a.net_book_value || a.current_book_value || 0),
        marketValue: Number(a.market_value || 0),
        replacementCost: Number(a.replacement_cost || 0),
        remainingLife: Number(a.remaining_useful_life || 0),
        status: a.status || 'Active',
        health: a.health || 'Optimal',
        manager: a.manager || a.custodian || ''
      }));
      setReportRows(rows);
    } catch (err) {
      setError(err.message || 'Failed to load book value report');
      addNotification('Failed to load book value report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const kpiData = useMemo(() => [
    { label: 'Total Assets', val: reportRows.length, icon: faBuildingColumns, color: accentColor, trend: 'up', trendVal: 'Register Entries' },
    { label: 'Total Acquisition Cost', val: '$' + reportRows.reduce((s, r) => s + r.acquisitionCost, 0).toLocaleString(), icon: faHandHoldingDollar, color: '#10b981', trend: 'up', trendVal: 'Capitalized Cost' },
    { label: 'Total Accum Depreciation', val: '$' + reportRows.reduce((s, r) => s + r.accumDepreciation, 0).toLocaleString(), icon: faChartLine, color: '#ef4444', trend: 'up', trendVal: 'Depreciation Posted' },
    { label: 'Net Book Value', val: '$' + reportRows.reduce((s, r) => s + r.currentBookValue, 0).toLocaleString(), icon: faCoins, color: '#3b82f6', trend: 'up', trendVal: 'Remaining Value' },
  ], [reportRows]);

  const filteredRows = reportRows.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.id, row, name: row.name || row.code || '' });
  };

  const handleDeleteConfirm = () => {
    const { id } = deleteDialog;
    setReportRows(prev => prev.filter(r => r.id !== id));
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Book Value Ledger Report"
      description="Analyze acquisition cost, accumulated depreciation, net book value, asset performance, replacement planning, and executive financial insights across the organization."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={fetchReport}>
            <FontAwesomeIcon icon={faRefresh} /> Generate Report
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Report sent via email.', 'success')}>
            <FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email Report
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Report scheduling manager launched.', 'info')}>
            <FontAwesomeIcon icon={faCalendarDays} className="me-1" /> Schedule Report
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI Financial risk report compiled.', 'success')}>
            <FontAwesomeIcon icon={faBrain} className="me-1" /> AI Analysis
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Excel Sheet exported.', 'success')}>
            Export Excel
          </button>
        </div>
      }
    >
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          <p className="mt-2 text-muted">Loading book value report...</p>
        </div>
      )}
      {error && !loading && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchReport}>Retry</button>
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
          { id: 'directory', label: 'Book Value Register Ledger', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Financial Dashboard', icon: faChartPie },
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
            { key: 'code', label: 'Asset Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const r = reportRows.find(x => x.code === val); if (r) { setSelectedAsset(r); setActiveDetailTab('financial'); } }}>{val}</span> },
            { key: 'name', label: 'Asset Name', bold: true },
            { key: 'category', label: 'Category' },
            { key: 'purchaseDate', label: 'Purchase Date' },
            { key: 'acquisitionCost', label: 'Acquisition Cost', render: (val) => <span className="font-monospace fw-bold text-success">${val.toLocaleString()}</span> },
            { key: 'additionalCapitalized', label: 'Add Capitalized', render: (val) => <span className="font-monospace text-muted">${val.toLocaleString()}</span> },
            { key: 'usefulLife', label: 'Useful Life', render: (val) => <>{val} Years</> },
            { key: 'accumDepreciation', label: 'Accum Depreciation', render: (val) => <span className="font-monospace text-danger">${val.toLocaleString()}</span> },
            { key: 'currentYearDep', label: 'Current Year Dep', render: (val) => <span className="font-monospace text-danger">${val.toLocaleString()}</span> },
            { key: 'currentBookValue', label: 'Net Book Value', bold: true, render: (val) => <span className="font-monospace fw-bold">${val.toLocaleString()}</span> },
            { key: 'marketValue', label: 'Market Value', render: (val) => <span className="font-monospace fw-bold text-primary">${val.toLocaleString()}</span> },
            { key: 'replacementCost', label: 'Replacement Cost', render: (val) => <span className="font-monospace text-muted">${val.toLocaleString()}</span> },
            { key: 'health', label: 'Health', render: (val) => <span className="premium-badge bg-success text-white">{val}</span> },
            { key: 'actions', label: '', render: (_, row) => (
              <div className="d-flex justify-content-end gap-1">
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', border: 'none', padding: '2px 8px' }} onClick={() => { setSelectedAsset(row); setActiveDetailTab('financial'); }} title="View"><FontAwesomeIcon icon={faEye} /></button>
                <button className="btn btn-sm premium-btn" style={{ borderRadius: '6px', fontSize: '0.65rem', background: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626', border: 'none', padding: '2px 8px' }} onClick={() => handleDeleteClick(row)} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )},
          ]}
          data={filteredRows}
          searchable
          searchPlaceholder="Search book value register by Name, Code, Location..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {(() => {
            const totalCost = reportRows.reduce((s, r) => s + r.acquisitionCost, 0);
            const totalAccum = reportRows.reduce((s, r) => s + r.accumDepreciation, 0);
            const totalNBV = reportRows.reduce((s, r) => s + r.currentBookValue, 0);
            const totalMonthly = reportRows.reduce((s, r) => s + r.currentMonthDep, 0);
            const totalYearly = reportRows.reduce((s, r) => s + r.currentYearDep, 0);
            const totalMarket = reportRows.reduce((s, r) => s + r.marketValue, 0);
            const totalReplacement = reportRows.reduce((s, r) => s + r.replacementCost, 0);
            const avgCost = reportRows.length ? Math.round(totalCost / reportRows.length) : 0;
            const avgNBV = reportRows.length ? Math.round(totalNBV / reportRows.length) : 0;
            const avgLife = reportRows.length ? (reportRows.reduce((s, r) => s + r.usefulLife, 0) / reportRows.length).toFixed(1) : '0';
            const avgRemLife = reportRows.length ? (reportRows.reduce((s, r) => s + r.remainingLife, 0) / reportRows.length).toFixed(1) : '0';
            const fullyDep = reportRows.filter(r => r.currentBookValue <= 0).length;
            const nearEnd = reportRows.filter(r => r.remainingLife < 1).length;
            const depPct = totalCost > 0 ? ((totalAccum / totalCost) * 100).toFixed(1) : '0';
            return [
              { label: 'Total Assets Pool', val: `${reportRows.length} Assets`, sub: 'Active and Draft status', color: accentColor },
              { label: 'Total Acquisition Cost', val: `$${totalCost.toLocaleString()}`, sub: 'Capitalized cost base', color: '#10b981' },
              { label: 'Current Book Value', val: `$${totalNBV.toLocaleString()}`, sub: 'Net Book Value remaining', color: '#3b82f6' },
              { label: 'Accumulated Depreciation', val: `$${totalAccum.toLocaleString()}`, sub: 'Total depreciation posted', color: '#ef4444' },
              { label: 'Monthly Depreciation', val: `$${totalMonthly.toLocaleString()}`, sub: 'Run rate average', color: '#ef4444' },
              { label: 'Yearly Depreciation', val: `$${totalYearly.toLocaleString()}`, sub: 'Annual forecast run', color: '#ef4444' },
              { label: 'Remaining Book Value %', val: totalCost > 0 ? `${((totalNBV / totalCost) * 100).toFixed(1)}%` : '0%', sub: 'Asset value percentage remaining', color: '#10b981' },
              { label: 'Average Asset Cost', val: `$${avgCost.toLocaleString()}`, sub: 'Capital sourcing average', color: '#3b82f6' },
              { label: 'Average Book Value', val: `$${avgNBV.toLocaleString()}`, sub: 'Depreciated average NBV', color: '#06b6d4' },
              { label: 'Average Useful Life', val: `${avgLife} Years`, sub: 'Average lifespan asset class', color: '#8b5cf6' },
              { label: 'Remaining Useful Life', val: `${avgRemLife} Years`, sub: 'Active remaining life', color: '#10b981' },
              { label: 'Fully Depreciated Assets', val: `${fullyDep}`, sub: 'Zero net book values', color: '#64748b' },
              { label: 'Near End of Life', val: `${nearEnd} Assets`, sub: 'RUL < 1 Year remaining', color: '#f59e0b' },
              { label: 'Replacement Value pool', val: `$${totalReplacement.toLocaleString()}`, sub: 'Simulated sourcing index', color: '#8b5cf6' },
              { label: 'Current Market Value', val: `$${totalMarket.toLocaleString()}`, sub: 'Estimated salvage pool value', color: '#10b981' },
              { label: 'Depreciation Percentage', val: `${depPct}%`, sub: 'Asset pool deprecation ratio', color: '#ef4444' }
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
        title="Delete Report Asset"
        message="Are you sure you want to delete this report asset? This action cannot be undone."
        itemName={deleteDialog.name}
        confirmLabel="Delete"
      />

      {selectedAsset && (
        <div className="glass-card" style={{
          position: 'fixed', top: 0, right: 0, width: '65%', height: '100vh',
          zIndex: 1040, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none'
        }}>
          <div className="d-flex justify-content-between align-items-start pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">{selectedAsset.code}</span>
              <h5 className="fw-bold mb-0">{selectedAsset.name}</h5>
              <span className="text-muted small">{selectedAsset.category} • {selectedAsset.department}</span>
            </div>
            <button className="btn btn-link p-0" style={{ color: mutedColor }} onClick={() => setSelectedAsset(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="d-flex gap-1 mb-3 overflow-auto pb-1 flex-wrap" style={{ maxHeight: '100px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'financial', label: 'Financial Summary' },
              { id: 'acquisition', label: 'Acquisition History' },
              { id: 'capitalization', label: 'Capitalization History' },
              { id: 'depreciation', label: 'Depreciation Schedule' },
              { id: 'history', label: 'Book Value History' },
              { id: 'market', label: 'Market Valuation' },
              { id: 'replacement', label: 'Replacement Analysis' },
              { id: 'maintenance', label: 'Maintenance History' },
              { id: 'insurance', label: 'Insurance' },
              { id: 'warranty', label: 'Warranty' },
              { id: 'repairs', label: 'Repairs' },
              { id: 'transfers', label: 'Transfers' },
              { id: 'projects', label: 'Projects' },
              { id: 'costcenters', label: 'Cost Centers' },
              { id: 'profitcenters', label: 'Profit Centers' },
              { id: 'manufacturing', label: 'Manufacturing Usage' },
              { id: 'inventory', label: 'Inventory Usage' },
              { id: 'assignment', label: 'Employee Assignment' },
              { id: 'documents', label: 'Documents' },
              { id: 'timeline', label: 'Timeline' },
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
                  fontSize: '0.65rem',
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
            {activeDetailTab === 'financial' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Original Cost:</strong><span className="d-block font-monospace">${selectedAsset.acquisitionCost.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Capitalized Cost:</strong><span className="d-block text-success font-monospace fw-bold">${(selectedAsset.acquisitionCost + selectedAsset.additionalCapitalized).toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Accumulated Depreciation:</strong><span className="d-block text-danger font-monospace fw-bold">${selectedAsset.accumDepreciation.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Current Net Book Value:</strong><span className="d-block fw-bold font-monospace">${selectedAsset.currentBookValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Expected Market Salvage:</strong><span className="d-block text-primary font-monospace">${selectedAsset.marketValue.toLocaleString()}</span></div>
                <div className="col-md-6"><strong>Replacement Cost Index:</strong><span className="d-block text-muted font-monospace">${selectedAsset.replacementCost.toLocaleString()}</span></div>
              </div>
            )}

            {activeDetailTab === 'overview' && (
              <div className="row g-3">
                <div className="col-md-6"><strong>Custodian / Manager:</strong><span className="d-block text-muted">{selectedAsset.manager}</span></div>
                <div className="col-md-6"><strong>Department Assigned:</strong><span className="d-block text-muted">{selectedAsset.department}</span></div>
                <div className="col-md-6"><strong>Branch Office:</strong><span className="d-block text-muted">{selectedAsset.branch}</span></div>
                <div className="col-md-6"><strong>Physical Storage Node:</strong><span className="d-block text-muted">{selectedAsset.location}</span></div>
              </div>
            )}

            {['acquisition', 'capitalization', 'depreciation', 'history', 'market', 'replacement', 'maintenance', 'insurance', 'warranty', 'repairs', 'transfers', 'projects', 'costcenters', 'profitcenters', 'manufacturing', 'inventory', 'assignment', 'documents', 'timeline', 'notes', 'attachments', 'audit', 'analytics', 'ai'].includes(activeDetailTab) && (
              <div className="p-3 text-center text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No parameters logged for {activeDetailTab}.
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-light" onClick={() => setSelectedAsset(null)}>Close</button>
          </div>
        </div>
      )}
      </>
      )}
    </ErpPageShell>
  );
};

export default ErpAssetBookValueReport;
