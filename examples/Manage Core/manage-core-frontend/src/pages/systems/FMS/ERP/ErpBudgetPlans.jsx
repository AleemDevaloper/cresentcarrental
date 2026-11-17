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
  faFileWord, faFileAlt, faClone, faMagic,
  faArrowUp, faArrowDown, faEdit, faFileSignature, faEnvelope, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import { erpCss } from '../../../../components/ui/ux/ErpTheme';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const ErpBudgetPlans = () => {
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
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [scenario, setScenario] = useState('Expected');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const [budgets, setBudgets] = useState([
    {
      id: 1,
      code: 'BP-FY2026-HQ',
      name: 'FY 2026 Headquarters Consolidated Budget Plan',
      displayName: 'HQ Budget FY26',
      description: 'Annual corporate operating and capital budget allocation for New York Headquarters.',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Consolidated HQ',
      project: 'All HQ Projects',
      costCenter: 'CC-HQ-FIN-101',
      profitCenter: 'PC-GLOBAL-001',
      manager: 'David Sterling',
      owner: 'Elena Rostova',
      budgetType: 'Annual',
      category: 'Operating',
      fiscalYear: '2026',
      version: 'v1.4 (Approved)',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      cycle: 'Yearly',
      financials: {
        currency: 'USD',
        plannedRevenue: 15000000,
        plannedExpenses: 9500000,
        plannedProfit: 5500000,
        reserve: 500000,
        approvedAmount: 9500000,
        utilized: 5300000,
        remaining: 4200000,
        utilPct: 55.7,
        forecastAccuracy: 94.8,
        variancePct: 2.3
      },
      scenarios: {
        Worst: { revenue: 12000000, expenses: 9500000, profit: 2500000 },
        Expected: { revenue: 15000000, expenses: 9500000, profit: 5500000 },
        Best: { revenue: 18000000, expenses: 9000000, profit: 9000000 }
      }
    },
    {
      id: 2,
      code: 'BP-FY2026-DET',
      name: 'FY 2026 Detroit Plant Operations OPEX/CAPEX',
      displayName: 'Detroit Operations FY26',
      description: 'Production line material runs, robotic stamping assembly lines machinery procurement, and labor overheads.',
      company: 'ManageCore Manufacturing Corp',
      branch: 'Midwest Manufacturing',
      businessUnit: 'Manufacturing Operations',
      department: 'Production',
      project: 'Tesla Semi Fleet Parts',
      costCenter: 'CC-MFG-PLT-301',
      profitCenter: 'PC-MFG-MIDWEST',
      manager: 'Marcus Vance',
      owner: 'Elena Rostova',
      budgetType: 'Annual',
      category: 'Production',
      fiscalYear: '2026',
      version: 'v2.1 (Approved)',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      cycle: 'Yearly',
      financials: {
        currency: 'USD',
        plannedRevenue: 12000000,
        plannedExpenses: 8000000,
        plannedProfit: 4000000,
        reserve: 800000,
        approvedAmount: 8000000,
        utilized: 4100000,
        remaining: 3900000,
        utilPct: 51.2,
        forecastAccuracy: 91.2,
        variancePct: 4.1
      },
      scenarios: {
        Worst: { revenue: 9000000, expenses: 8000000, profit: 1000000 },
        Expected: { revenue: 12000000, expenses: 8000000, profit: 4000000 },
        Best: { revenue: 15000000, expenses: 7500000, profit: 7500000 }
      }
    }
  ]);

  const [newBudget, setNewBudget] = useState({
    code: '', name: '', displayName: '', description: '', company: 'ManageCore Global Inc.',
    branch: 'Headquarters', department: 'Finance', project: '', budgetType: 'Annual',
    category: 'Operating', fiscalYear: '2026', plannedRevenue: '', plannedExpenses: ''
  });

  const fetchData = () => {
    try { setLoading(true); setError(null); }
    catch (err) { setError(err.message || 'Failed to load budget plans'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'budget_plan' });
    setActiveTab('erp_budget_plans');
    setShowAddModal(true);
  };

  const handleViewClick = (row) => { setViewItem(row); };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.code || '', row });
  const handleDeleteConfirm = () => {
    setBudgets(prev => prev.filter(b => b.id !== deleteDialog.id));
    addNotification?.('Budget plan moved to trash', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const handleMoveToDraft = (row) => {
    setBudgets(prev => prev.map(b => b.id === row.id ? { ...b, version: 'v1.0 (Draft)', status: 'Draft' } : b));
    addNotification?.(`${row.name} moved to Draft`, 'success');
  };

  const handleCreateBudget = (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.code) {
      addNotification('Budget Code and Name are required.', 'danger');
      return;
    }
    const rev = parseFloat(newBudget.plannedRevenue || '0');
    const exp = parseFloat(newBudget.plannedExpenses || '0');
    const added = {
      id: Date.now(),
      code: newBudget.code,
      name: newBudget.name,
      displayName: newBudget.displayName || newBudget.name,
      description: newBudget.description,
      company: newBudget.company,
      branch: newBudget.branch,
      businessUnit: 'Corporate Services',
      department: newBudget.department,
      project: newBudget.project || 'None',
      costCenter: 'CC-HQ-FIN-101',
      profitCenter: 'PC-GLOBAL-001',
      manager: 'Finance Manager',
      owner: 'Elena Rostova',
      budgetType: newBudget.budgetType,
      category: newBudget.category,
      fiscalYear: newBudget.fiscalYear,
      version: 'v1.0 (Draft)',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      cycle: 'Yearly',
      financials: {
        currency: 'USD',
        plannedRevenue: rev,
        plannedExpenses: exp,
        plannedProfit: rev - exp,
        reserve: 0,
        approvedAmount: exp,
        utilized: 0,
        remaining: exp,
        utilPct: 0,
        forecastAccuracy: 100,
        variancePct: 0
      },
      scenarios: {
        Worst: { revenue: rev * 0.8, expenses: exp, profit: (rev * 0.8) - exp },
        Expected: { revenue: rev, expenses: exp, profit: rev - exp },
        Best: { revenue: rev * 1.2, expenses: exp * 0.9, profit: (rev * 1.2) - (exp * 0.9) }
      }
    };
    setBudgets([added, ...budgets]);
    setShowAddModal(false);
    addNotification('Budget Plan provisioned as Draft.', 'success');
  };

  const filteredBudgets = budgets.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.fiscalYear.toLowerCase().includes(searchTerm.toLowerCase());
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
    const data = filteredBudgets;
    const cols = budgetColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => {
      const val = item[c.key] ?? item.financials?.[c.key] ?? '';
      return String(val);
    }));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const title = 'Budget Plans Report';
    if (type === 'csv') { downloadBlob(csv, 'budget_plans.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'budget_plans.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { await exportDocx({ title, headers, rows, filename: 'budget_plans.docx' }); }
    else if (type === 'pdf') { await exportPdf({ title, headers, rows, filename: 'budget_plans.pdf' }); }
    else if (type === 'word') { await exportWord({ title, headers, rows, filename: 'budget_plans.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const exportButtons = (
    <div className="dropdown d-inline-block">
      <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
        <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
        <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
      </ul>
    </div>
  );

  const budgetColumns = [
    { key: 'code', label: 'Budget Code' },
    { key: 'name', label: 'Plan Name' },
    { key: 'branch', label: 'Branch Scope' },
    { key: 'budgetType', label: 'Type & Category', render: (v, row) => `${row.budgetType} \u2022 ${row.category}` },
    { key: 'fiscalYear', label: 'Fiscal Year' },
    { key: 'plannedRevenue', label: 'Planned Revenue', render: (v) => <span className="text-success fw-bold font-monospace">${(v ?? 0).toLocaleString()}</span> },
    { key: 'plannedExpenses', label: 'Planned Expenses', render: (v) => <span className="text-danger fw-bold font-monospace">${(v ?? 0).toLocaleString()}</span> },
    { key: 'utilized', label: 'Budget Utilized', render: (v, row) => <span className="text-danger font-monospace">${(row.financials?.utilized ?? 0).toLocaleString()}</span> },
    { key: 'remaining', label: 'Remaining', render: (v, row) => <span className="font-monospace">${(row.financials?.remaining ?? 0).toLocaleString()}</span> },
    { key: 'version', label: 'Revision', render: (v) => <span className="premium-badge bg-secondary text-white">{v}</span> },
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

  const headerAction = (
    <div className="d-flex gap-2 flex-wrap">
      <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setShowAddModal(true)}>
        <FontAwesomeIcon icon={faPlus} /> Create Budget
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Budget planning wizard launched.', 'info')}>
        Budget Wizard
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Budget plan cloned.', 'success')}>
        <FontAwesomeIcon icon={faClone} className="me-1" /> Clone Budget
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI forecasting model executed.', 'success')}>
        <FontAwesomeIcon icon={faMagic} className="me-1" /> Forecast Budget
      </button>
      <div className="dropdown d-inline-block">
        <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
        </button>
        <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileWord} className="me-2" />Word</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
        </ul>
      </div>
    </div>
  );

  const dashboardKpis = useMemo(() => [
    { label: 'Total Budget Plans', value: budgets.length, color: accentColor },
    { label: 'Draft Budgets', value: 0, color: '#64748b' },
    { label: 'Pending Approval', value: 0, color: '#f59e0b' },
    { label: 'Approved Budgets', value: budgets.length, color: '#10b981' },
    { label: 'Rejected Budgets', value: 0, color: '#ef4444' },
    { label: 'Closed Budgets', value: 0, color: '#64748b' },
    { label: 'Annual Budgets', value: budgets.length, color: '#3b82f6' },
    { label: 'Quarterly Budgets', value: 0, color: '#8b5cf6' },
    { label: 'Monthly Budgets', value: 0, color: '#06b6d4' },
    { label: 'Department Budgets', value: 2, color: '#ec4899' },
    { label: 'Branch Budgets', value: 2, color: '#3b82f6' },
    { label: 'Project Budgets', value: 2, color: '#8b5cf6' },
    { label: 'Manufacturing Budgets', value: 1, color: '#ef4444' },
    { label: 'Inventory Budgets', value: '2 Pools', color: '#10b981' },
    { label: 'Payroll Budgets', value: '$6,600,000', color: '#10b981' },
    { label: 'Marketing Budgets', value: '$800,000', color: '#3b82f6' },
    { label: 'Procurement Budgets', value: '$2,400,000', color: '#06b6d4' },
    { label: 'Capital Budgets (CAPEX)', value: '$3,500,000', color: '#8b5cf6' },
    { label: 'Operational Budgets (OPEX)', value: '$14,000,000', color: '#10b981' },
    { label: 'Revenue Budgets', value: '$27,000,000', color: '#10b981' },
    { label: 'Expense Budgets', value: '$17,500,000', color: '#ef4444' },
    { label: 'Cash Flow Budgets', value: 'Net Positive', color: '#10b981' },
    { label: 'Total Planned Budget', value: '$17,500,000', color: '#3b82f6' },
    { label: 'Budget Utilized', value: '$9,400,000', color: '#ef4444' },
    { label: 'Remaining Budget', value: '$8,100,000', color: '#10b981' },
    { label: 'Budget Utilization %', value: '53.7%', color: '#f59e0b' },
    { label: 'Forecast Accuracy', value: '93.0%', color: '#10b981' },
    { label: 'Budget Variance %', value: '3.2%', color: '#f59e0b' },
    { label: 'Financial Health Score', value: '98 / 100', color: '#10b981' },
    { label: 'AI Budget Score', value: '98 / 100', color: '#8b5cf6' }
  ], [budgets]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Budget Plans Hub"
      description="Create, monitor, forecast, and control enterprise budgets across departments, branches, projects, manufacturing, procurement, payroll, and business operations."
      action={headerAction}
    >
      <style>{erpCss(isDark)}</style>

      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Budget Plans Directory', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Dashboard & KPIs', icon: faChartPie },
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
          {/* Search */}
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <input type="text" className="form-control form-control-sm" placeholder="Search by Budget Plan Code, Name, Fiscal Year..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {/* AI Recommendation */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Budget Forecasting Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Budget utilization patterns suggest optimizing Q3 allocations. Consider rebalancing 5% of reserves to high-performing departments.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <ErpDataTable
            columns={budgetColumns}
            data={filteredBudgets}
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
              value={k.val !== undefined ? k.val : k.value}
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
                  <FontAwesomeIcon icon={faFolderOpen} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Budget Plan Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: isDark ? '#1e3a5f' : '#e0f2fe', color: isDark ? '#38bdf8' : '#0284c7', borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDark ? '#38bdf8' : '#0284c7' }} />
                    {viewItem.version}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Plan: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.name}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Manager: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.manager} &bull; {viewItem.owner}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Fiscal Year: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.fiscalYear}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Period: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.startDate} to {viewItem.endDate}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.description}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Planned Revenue</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.financials.plannedRevenue.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Planned Expenses</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1.1rem' }}>${viewItem.financials.plannedExpenses.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Utilized</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1.1rem' }}>${viewItem.financials.utilized.toLocaleString()}</p>
                    </div>
                    <div className="col-3">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '1.1rem' }}>${viewItem.financials.remaining.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Department</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.department}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Branch</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.branch}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Planned Profit</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>${viewItem.financials.plannedProfit.toLocaleString()}</span>
                    </div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Forecast Accuracy</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.success, fontSize: '1rem' }}>{viewItem.financials.forecastAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scenario Planning</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Expected: ${viewItem.financials.plannedRevenue.toLocaleString()} revenue / ${viewItem.financials.plannedExpenses.toLocaleString()} expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card p-4 w-100" style={{ borderRadius: '20px', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', color: textColor }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Create Corporate Budget Plan</h5>
              <button className="btn btn-link p-0 text-muted" onClick={() => setShowAddModal(false)}><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <form onSubmit={handleCreateBudget} className="row g-3" style={{ fontSize: '0.8rem' }}>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Budget Code</label>
                <input type="text" className="form-control" placeholder="BP-FY2026-HQ" value={newBudget.code} onChange={e => setNewBudget({ ...newBudget, code: e.target.value })} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-bold mb-1">Budget Plan Name</label>
                <input type="text" className="form-control" placeholder="FY 2026 Headquarters Operating Budget" value={newBudget.name} onChange={e => setNewBudget({ ...newBudget, name: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Budget Type</label>
                <select className="form-select" value={newBudget.budgetType} onChange={e => setNewBudget({ ...newBudget, budgetType: e.target.value })}>
                  <option value="Annual">Annual</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Planned Revenue ($)</label>
                <input type="number" className="form-control" value={newBudget.plannedRevenue} onChange={e => setNewBudget({ ...newBudget, plannedRevenue: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Planned Expenses ($)</label>
                <input type="number" className="form-control" value={newBudget.plannedExpenses} onChange={e => setNewBudget({ ...newBudget, plannedExpenses: e.target.value })} required />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Fiscal Year</label>
                <input type="text" className="form-control" value={newBudget.fiscalYear} onChange={e => setNewBudget({ ...newBudget, fiscalYear: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Department</label>
                <input type="text" className="form-control" value={newBudget.department} onChange={e => setNewBudget({ ...newBudget, department: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold mb-1">Branch</label>
                <input type="text" className="form-control" value={newBudget.branch} onChange={e => setNewBudget({ ...newBudget, branch: e.target.value })} />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold mb-1">Description</label>
                <textarea className="form-control" rows="2" value={newBudget.description} onChange={e => setNewBudget({ ...newBudget, description: e.target.value })}></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}` }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="premium-btn btn btn-sm text-white border-0 px-4" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.75rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }}>Save Budget Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this budget plan to trash?"
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBudgetPlans;
