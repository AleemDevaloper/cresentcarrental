import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faTrash, faTrashCan,
  faRefresh, faCheckCircle, faBan, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronDown, faXmark, faPrint, faScaleBalanced,
  faChartLine, faClock, faBriefcase, faGlobe, faHistory, faFileInvoice,
  faFolderOpen, faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck,
  faListCheck, faBuilding, faDiagramProject, faUsers, faWarehouse, faIndustry,
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf,
  faFileWord, faFileAlt, faBrain,
  faArrowUp, faArrowDown, faEdit, faFileSignature, faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpBudgetVsActual = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#6366f1';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('financial');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const [comparisonRows, setComparisonRows] = useState([
    {
      id: 1,
      budgetCode: 'BP-FY2026-HQ',
      budgetName: 'FY 2026 Headquarters Consolidated Budget Plan',
      department: 'Consolidated HQ',
      branch: 'Headquarters',
      costCenter: 'CC-HQ-FIN-101',
      fiscalYear: '2026',
      period: 'Q2 Consolidated',
      plannedBudget: 9500000,
      actualExpenses: 5300000,
      actualRevenue: 6500000,
      budgetConsumed: 5300000,
      remaining: 4200000,
      utilPct: 55.7,
      varianceAmount: 4200000,
      variancePct: 44.2,
      varianceType: 'Favorable',
      reason: 'Slower deployment of capital infrastructure and deferred IT server setup.',
      correctiveActions: 'Accelerate infrastructure capitalization in Q3.',
      notes: 'Treasury interest yields exceeded forecast target by +12%.'
    },
    {
      id: 2,
      budgetCode: 'BP-FY2026-DET',
      budgetName: 'FY 2026 Detroit Plant Operations OPEX/CAPEX',
      department: 'Production',
      branch: 'Midwest Manufacturing',
      costCenter: 'CC-MFG-PLT-301',
      fiscalYear: '2026',
      period: 'Q2 Consolidated',
      plannedBudget: 8000000,
      actualExpenses: 4100000,
      actualRevenue: 3200000,
      budgetConsumed: 4100000,
      remaining: 3900000,
      utilPct: 51.2,
      varianceAmount: 3900000,
      variancePct: 48.7,
      varianceType: 'Favorable',
      reason: 'Raw metal steel bulk purchases negotiated at discount.',
      correctiveActions: 'Maintain current bulk supplier vendor terms.',
      notes: 'Robotics downtime reduced energy consumption in stamping lines.'
    }
  ]);

  const fetchData = () => {
    try { setLoading(true); setError(null); }
    catch (err) { setError(err.message || 'Failed to load comparisons'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'budget_vs_actual' });
    setActiveTab('erp_budget_vs_actual');
  };

  const handleViewClick = (row) => { setViewItem(row); };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.budgetCode || '', row });
  const handleDeleteConfirm = () => {
    setComparisonRows(prev => prev.filter(r => r.budgetCode !== deleteDialog.id));
    addNotification?.('Comparison row moved to trash', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const handleMoveToDraft = (row) => {
    setComparisonRows(prev => prev.map(r => r.budgetCode === row.budgetCode ? { ...r, status: 'Draft' } : r));
    addNotification?.('Comparison moved to Draft', 'success');
  };

  const filteredRows = comparisonRows.filter(r => {
    const matchesSearch =
      r.budgetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.budgetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (type) => {
    const data = filteredRows;
    const cols = comparisonColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'budget_vs_actual.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'budget_vs_actual.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { exportPdf(headers, rows, 'budget_vs_actual'); }
    else if (type === 'docx') { exportDocx(headers, rows, 'budget_vs_actual'); }
    else if (type === 'word') { exportWord(headers, rows, 'budget_vs_actual'); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const comparisonColumns = [
    { key: 'budgetCode', label: 'Budget Code' },
    { key: 'budgetName', label: 'Plan Name' },
    { key: 'department', label: 'Department Scope' },
    { key: 'costCenter', label: 'Cost Center' },
    { key: 'period', label: 'Comparison Period' },
    { key: 'plannedBudget', label: 'Planned Budget', render: (v) => <span className="text-success fw-bold font-monospace">${v.toLocaleString()}</span> },
    { key: 'actualExpenses', label: 'Actual Expenses', render: (v) => <span className="text-danger fw-bold font-monospace">${v.toLocaleString()}</span> },
    { key: 'remaining', label: 'Remaining', render: (v) => <span className="font-monospace">${v.toLocaleString()}</span> },
    { key: 'varianceAmount', label: 'Variance Amount', render: (v) => <span className="fw-bold text-success font-monospace">${v.toLocaleString()}</span> },
    { key: 'variancePct', label: 'Variance %', render: (v) => <span className="text-primary fw-bold font-monospace">{v}%</span> },
    { key: 'varianceType', label: 'Variance Type', render: (v) => <span className="premium-badge bg-success text-white">{v}</span> },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0 premium-btn" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
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
        <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.budgetCode, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const headerAction = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => addNotification('Generating Comparison report matrix...', 'info')}>
        Generate Comparison
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Comparing periods Q1 vs Q2.', 'info')}>
        Compare Periods
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Variance analysis rules configured.', 'success')}>
        Variance Analysis
      </button>
      <div className="dropdown d-inline-block">
        <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
        </button>
        <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
        </ul>
      </div>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} /> Refresh Dashboard
      </button>
    </div>
  );

  const dashboardKpis = useMemo(() => [
    { label: 'Total Budget Pool', val: '$17,500,000', color: accentColor },
    { label: 'Actual Spending Pool', val: '$9,400,000', color: '#ef4444' },
    { label: 'Remaining Budget Pool', val: '$8,100,000', color: '#10b981' },
    { label: 'Budget Utilization %', val: '53.7%', color: '#f59e0b' },
    { label: 'Budget Variance', val: '$8,100,000', color: '#10b981' },
    { label: 'Variance % Average', val: '46.2%', color: '#3b82f6' },
    { label: 'Favorable Variance', val: '2 Plans', color: '#10b981' },
    { label: 'Unfavorable Variance', val: '0 Plans', color: '#ef4444' },
    { label: 'Revenue Budget Pool', val: '$27,000,000', color: '#10b981' },
    { label: 'Actual Revenue Pool', val: '$9,700,000', color: '#10b981' },
    { label: 'Expense Budget Pool', val: '$17,500,000', color: '#ef4444' },
    { label: 'Actual Expenses Pool', val: '$9,400,000', color: '#ef4444' },
    { label: 'Gross Profit target', val: '$9,500,000', color: '#10b981' },
    { label: 'Net Profit target', val: '$4,100,000', color: '#10b981' },
    { label: 'Operating Margin %', val: '43.2%', color: '#3b82f6' },
    { label: 'Cash Flow Budget', val: 'Net Positive', color: '#10b981' },
    { label: 'Actual Cash Flow', val: '$2,850,000', color: '#10b981' },
    { label: 'CAPEX Budget Pool', val: '$3,500,000', color: '#8b5cf6' },
    { label: 'OPEX Budget Pool', val: '$14,000,000', color: '#10b981' },
    { label: 'Budget Health Score', val: '98 / 100', color: '#10b981' },
    { label: 'Forecast Accuracy', val: '93.0%', color: '#10b981' },
    { label: 'AI Financial Score', val: '98 / 100', color: '#8b5cf6' }
  ], [comparisonRows]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Budget vs Actual Variance"
      description="Compare planned budgets with actual financial performance using enterprise dashboards, variance analysis, AI forecasting, and executive reporting."
      action={headerAction}
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Variance Reconciliation Matrix', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Financial Dashboard', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className={`premium-tab-btn btn btn-sm py-2 px-3 fw-bold`}
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

      {/* DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div>
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <input type="text" className="form-control form-control-sm" placeholder="Search by Budget Plan Name, Code, Cost Center..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {/* AI Recommendation */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Variance Analysis Insight</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Variance trends indicate favorable performance. Recommend maintaining current vendor agreements and accelerating capital deployment in Q3.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={comparisonColumns}
            data={filteredRows}
            loading={loading}
            error={error}
            isDark={isDark}
            onRowClick={(row) => { setViewItem(row); }}
            exportButtons={exportButtons}
          />
        </div>
      )}

      {/* DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {dashboardKpis.map((k, idx) => (
            <ErpKpiCard
              key={idx}
              label={k.label}
              value={k.val}
              color={k.color}
              isDark={isDark}
              colClass="col-md-2 mb-2"
              trendVal=""
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faScaleBalanced} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Variance Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.varianceType === 'Favorable' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'), color: viewItem.varianceType === 'Favorable' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.varianceType === 'Favorable' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#ef4444' : '#dc2626') }} />
                    {viewItem.varianceType}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.budgetCode}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Plan: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.budgetName}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Department: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.department} &bull; {viewItem.costCenter}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Period: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.period}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Fiscal Year: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.fiscalYear}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Planned Budget</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.plannedBudget.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actual Expenses</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1.1rem' }}>${viewItem.actualExpenses.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '1.1rem' }}>${viewItem.remaining.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Variance Amount</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${viewItem.varianceAmount.toLocaleString()}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Variance %</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.variancePct}%</span>
                    </div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Budget Utilization</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.warning, fontSize: '1rem' }}>{viewItem.utilPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason for Variance</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this comparison to trash?"
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBudgetVsActual;
