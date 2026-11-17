import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faFileExport, faList, faEye, faTrash, faTrashCan,
  faRefresh, faCheckCircle, faBan, faTimeline, faBuildingColumns,
  faUser, faTags, faCoins, faShieldHalved, faInfoCircle, faFolder,
  faStar, faChevronRight, faChevronDown, faXmark, faPrint, faScaleBalanced, faSitemap,
  faChartLine, faClock, faBriefcase, faGlobe, faHistory, faFileInvoice,
  faFolderOpen, faLink, faFileInvoiceDollar, faCogs, faChartPie, faCheck,
  faListCheck, faBuilding, faDiagramProject, faUsers, faWarehouse, faIndustry,
  faHandHoldingDollar, faCheckSquare, faExclamationTriangle, faFileExcel, faFileCsv, faFilePdf,
  faPercent, faBrain, faCalculator,
  faArrowUp, faArrowDown, faEdit, faFileSignature, faEnvelope, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpAnalyticAccounts = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const accentColor = '#6366f1';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  // Core States
  const [activeSubTab, setActiveSubTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('financial');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const [analyticAccounts, setAnalyticAccounts] = useState([
    {
      id: 1,
      code: 'ANA-PRJ-AI-01',
      name: 'AI Forecasting Optimization Module',
      displayName: 'AI Project Cost Analysis',
      shortName: 'AI Forecast Project',
      description: 'Independent dimension tracking for machine learning infrastructure, model runs, and cloud GPU costs.',
      parentAccount: 'ANA-GROUP-RD',
      hierarchyLevel: 2,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      department: 'Research & Development',
      businessUnit: 'Tech Operations',
      division: 'R&D Lab',
      project: 'Valkyrie AI Platform',
      contract: 'CON-90182-AI',
      customer: 'Silicon Valley Sourcing Inc',
      vendor: 'Nvidia Corp Sourcing',
      manager: 'Cyrus Vance',
      accountType: 'Project Costing',
      status: 'Active',
      financials: {
        budget: 500000,
        utilized: 320000,
        remaining: 180000,
        revenue: 650000,
        expenses: 320000,
        grossProfit: 330000,
        netProfit: 310000,
        marginPct: 50.7,
        avgProfitability: 54.2,
        healthScore: 95
      },
      accounts: {
        revenue: '40100 - Software Product Revenue',
        expense: '60100 - Cloud GPU Instance Cost',
        payroll: '60200 - R&D Staff Salary',
        inventory: '13100 - Tech Dev Hardware'
      },
      allocation: {
        revenueAlloc: '100% Direct to Project',
        expenseAlloc: 'Activity-Based Costing (ABC) GPU hours',
        payrollAlloc: 'Direct staff hours tracking'
      }
    },
    {
      id: 2,
      code: 'ANA-MFG-AUTOMOTIVE',
      name: 'Tesla Fleet Component Stamping Operations',
      displayName: 'Automotive Component Cost Analysis',
      shortName: 'Tesla Stamping',
      description: 'Analytics tracking for stamping line raw metal, energy loads, and robotics runtime.',
      parentAccount: 'ANA-GROUP-MFG',
      hierarchyLevel: 2,
      company: 'ManageCore Manufacturing Corp',
      branch: 'Midwest Manufacturing',
      department: 'Production',
      businessUnit: 'Manufacturing Operations',
      division: 'Heavy Stamping',
      project: 'Tesla Semi Fleet Parts',
      contract: 'CON-88219-MFG',
      customer: 'Tesla Motors Inc',
      vendor: 'Midwest Steel Sourcing',
      manager: 'Marcus Vance',
      accountType: 'Manufacturing Costing',
      status: 'Active',
      financials: {
        budget: 2500000,
        utilized: 1980000,
        remaining: 520000,
        revenue: 3200000,
        expenses: 1980000,
        grossProfit: 1220000,
        netProfit: 1100000,
        marginPct: 38.1,
        avgProfitability: 40.5,
        healthScore: 92
      },
      accounts: {
        revenue: '40200 - Manufacturing Parts Sale',
        expense: '60800 - Factory Overhead Energy',
        payroll: '60250 - Stamping Operator Wages',
        inventory: '13300 - Raw Sheet Metal'
      },
      allocation: {
        revenueAlloc: '100% Direct contract sales',
        expenseAlloc: 'Machine hour calculations',
        payrollAlloc: 'Floor operator direct logs'
      }
    }
  ]);

  const fetchData = () => {
    try { setLoading(true); setError(null); }
    catch (err) { setError(err.message || 'Failed to load analytic accounts'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'analytic_account' });
    setActiveTab('erp_create_analytic_account');
  };

  const handleViewClick = (row) => { setViewItem(row); };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.code || '', row });
  const handleDeleteConfirm = () => {
    addNotification?.('Analytic account moved to trash', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const handleMoveToDraft = (row) => {
    addNotification?.('Analytic account moved to Draft', 'success');
  };

  const filteredAccounts = analyticAccounts.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredAccounts;
    const cols = analyticColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => {
      const val = item[c.key] ?? item.financials?.[c.key] ?? '';
      return String(val);
    }));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const title = 'Analytic Accounts Report';
    if (type === 'csv') { downloadBlob(csv, 'analytic_accounts.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'analytic_accounts.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title, headers, rows, filename: 'analytic_accounts.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title, headers, rows, filename: 'analytic_accounts.docx' }); }
    else if (type === 'word') { await exportWord({ title, headers, rows, filename: 'analytic_accounts.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
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

  const analyticColumns = [
    { key: 'code', label: 'Account Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const a = analyticAccounts.find(x => x.code === val); if (a) { setViewItem(a); } }}>{val}</span> },
    { key: 'name', label: 'Account Name', bold: true },
    { key: 'department', label: 'Department & Project', render: (val, row) => <>{val} <span className="text-muted">&bull; {row.project}</span></> },
    { key: 'manager', label: 'Manager' },
    { key: 'accountType', label: 'Account Type Scope', render: (val) => <span className="premium-badge bg-secondary text-white">{val}</span> },
    { key: 'budget', label: 'Budget Pool', render: (_, row) => <span className="font-monospace fw-bold text-success">${row.financials.budget.toLocaleString()}</span> },
    { key: 'revenue', label: 'Revenue YTD', render: (_, row) => <span className="font-monospace text-success fw-bold">${row.financials.revenue.toLocaleString()}</span> },
    { key: 'expenses', label: 'Expenses YTD', render: (_, row) => <span className="font-monospace text-danger">${row.financials.expenses.toLocaleString()}</span> },
    { key: 'netProfit', label: 'Net Profit', render: (_, row) => <span className="font-monospace fw-bold" style={{ color: row.financials.netProfit >= 0 ? '#10b981' : '#ef4444' }}>${row.financials.netProfit.toLocaleString()}</span> },
    { key: 'marginPct', label: 'Margin %', render: (_, row) => <span className="font-monospace fw-bold text-primary">{row.financials.marginPct}%</span> },
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
        <button className="btn btn-sm border-0 premium-btn" title="Move to Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.code, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  const dashboardKpis = useMemo(() => [
    { label: 'Total Analytic Accounts', val: analyticAccounts.length, sub: 'Registered analytic dimensions', color: accentColor },
    { label: 'Active Accounts', val: analyticAccounts.filter(a => a.status === 'Active').length, sub: 'Actively receiving postings', color: '#10b981' },
    { label: 'Inactive Accounts', val: 0, sub: 'Closed ledger nodes', color: '#64748b' },
    { label: 'Projects Linked', val: '2 Projects', sub: 'Linked cross-dimensions', color: '#3b82f6' },
    { label: 'Departments Linked', val: '2 Departments', sub: 'Assigned corporate groups', color: '#8b5cf6' },
    { label: 'Cost Centers Linked', val: '2 Cost Centers', sub: 'SAP-CCA mapping linked', color: '#06b6d4' },
    { label: 'Employees Assigned', val: '43 FTE', sub: 'Assigned staff track', color: '#ec4899' },
    { label: 'Manufacturing Units', val: '1 Line', sub: 'Detroit Bay Stamping Line', color: '#ef4444' },
    { label: 'Warehouses Linked', val: '2 Whse', sub: 'Detroit and London bins', color: '#10b981' },
    { label: 'Current Revenue Pool', val: '$3,850,000', sub: 'YTD customer billing pool', color: '#10b981' },
    { label: 'Current Expenses Pool', val: '$2,300,000', sub: 'YTD operational cost pool', color: '#ef4444' },
    { label: 'Gross Profit Pool', val: '$1,550,000', sub: 'Profit contribution margin', color: '#10b981' },
    { label: 'Net Profit Pool', val: '$1,410,000', sub: 'Net corporate profit pool', color: '#10b981' },
    { label: 'Budget Assigned Pool', val: '$3,000,000', sub: 'Authorizations limits pool', color: '#3b82f6' },
    { label: 'Budget Utilized Pool', val: '$2,300,000', sub: 'Spent budget total pool', color: '#ef4444' },
    { label: 'Budget Remaining Pool', val: '$700,000', sub: 'Remaining limits pool', color: '#10b981' },
    { label: 'Profit Margin % average', val: '44.4%', sub: 'Total margin ratio', color: '#10b981' },
    { label: 'Average Profitability', val: '$775,000', sub: 'Mean account yield', color: '#3b82f6' },
    { label: 'Financial Health Score', val: '95 / 100', sub: 'Consolidation audit health', color: '#10b981' },
    { label: 'AI Profitability Score', val: '95 / 100', sub: 'AI forecasting scoring index', color: '#8b5cf6' }
  ], [analyticAccounts]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Analytic Accounts (Cost & Profitability)"
      description="Track revenues, expenses, project costs, operational costs, manufacturing costs, and profitability using enterprise analytic accounting."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_analytic_account')}>
            <FontAwesomeIcon icon={faPlus} /> Create Analytic Account
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Import wizard launched.', 'info')}>
            Import Accounts
          </button>
          <div className="dropdown d-inline-block">
            <button className="btn btn-sm premium-btn dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
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
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Analytic tree structure rendered.', 'info')}>
            Hierarchy View
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Analytic Accounts Register', icon: faFolderOpen },
          { id: 'dashboard', label: 'Analytic Financial Dashboard', icon: faChartPie },
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
        <div>
          {/* AI Recommendation */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Profitability Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Profitability analysis suggests optimizing project cost allocations. Consider rebalancing R&D GPU resources to maximize margin performance.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={analyticColumns}
            data={filteredAccounts}
            loading={loading}
            error={error}
            searchable
            searchPlaceholder="Search by Account Code, Name, Project, Department..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            exportButtons={exportButtons}
            isDark={isDark}
          />
        </div>
      )}

      {activeSubTab === 'dashboard' && (
        <div className="row g-2 mb-4">
          {dashboardKpis.map((k, idx) => (
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

      {/* Preview Modal */}
      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faCalculator} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Analytic Account Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Active' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Active' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Name: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.name}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Project: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.project}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Account Type: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.accountType}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Manager: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.manager}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.description}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.financials.revenue.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expenses</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1.1rem' }}>${viewItem.financials.expenses.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Net Profit</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.financials.netProfit.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Margin %</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.primary, fontSize: '1.1rem' }}>{viewItem.financials.marginPct}%</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Budget</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${viewItem.financials.budget.toLocaleString()}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Budget Utilized</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>${viewItem.financials.utilized.toLocaleString()}</span>
                    </div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Health Score</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>{viewItem.financials.healthScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allocation</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Revenue: {viewItem.allocation.revenueAlloc} &bull; Expense: {viewItem.allocation.expenseAlloc}</p>
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
        message="Are you sure you want to move this analytic account to trash?"
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpAnalyticAccounts;
