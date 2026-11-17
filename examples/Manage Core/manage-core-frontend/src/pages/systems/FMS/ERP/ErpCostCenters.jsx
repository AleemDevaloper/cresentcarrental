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
  faUsersGear, faFileContract, faPercent, faFileWord, faFileAlt,
  faArrowUp, faArrowDown, faEdit, faFileSignature, faEnvelope, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpCostCenters = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#6366f1';

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  const [activeViewTab, setActiveViewTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  const [costCenters, setCostCenters] = useState([
    {
      id: 1,
      code: 'CC-HQ-FIN-101',
      name: 'Corporate Finance & Treasury',
      displayName: 'Corporate Finance responsibility center',
      shortName: 'Corp Finance',
      description: 'Central treasury operations, general ledger accounting, tax compliance, and auditing.',
      parentCenter: 'Corporate Services HQ',
      hierarchyLevel: 2,
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Corporate Services',
      department: 'Finance',
      division: 'Administrative',
      project: 'Global ERP roll-out',
      warehouse: 'HQ Central Repository',
      mfgPlant: 'N/A',
      costType: 'Finance',
      status: 'Active',
      financials: {
        budget: 1500000,
        utilized: 1200000,
        remaining: 300000,
        monthlyExpense: 120000,
        quarterlyExpense: 360000,
        yearlyExpense: 1200000,
        avgCost: 100000,
        efficiencyScore: 94,
        healthScore: 96,
        currency: 'USD'
      },
      accounts: {
        expense: '60100 - General Admin Expense',
        revenue: 'N/A (Cost Center)',
        payroll: '60200 - Employee Salary',
        depreciation: '60300 - Equipment Depreciation'
      },
      allocation: {
        method: 'Direct Allocation',
        frequency: 'Monthly',
        rules: 'Fixed 40% allocation to Midwest Manufacturing branch.'
      }
    },
    {
      id: 2,
      code: 'CC-MFG-PLT-301',
      name: 'Detroit Automotive Stamping Plant',
      displayName: 'Detroit Bay 4 Production Center',
      shortName: 'Detroit Assembly',
      description: 'Heavy machinery stamping, automated welding, assembly, and quality inspection floor.',
      parentCenter: 'Midwest Manufacturing Division',
      hierarchyLevel: 3,
      company: 'ManageCore Manufacturing Corp',
      branch: 'Midwest Manufacturing',
      businessUnit: 'Manufacturing Operations',
      department: 'Production',
      division: 'Plant Operations',
      project: 'Tesla Semi logistics run',
      warehouse: 'Detroit Parts Warehouse',
      mfgPlant: 'Detroit Assembly Plant (Bay 4)',
      costType: 'Production',
      status: 'Active',
      financials: {
        budget: 4500000,
        utilized: 4100000,
        remaining: 400000,
        monthlyExpense: 380000,
        quarterlyExpense: 1140000,
        yearlyExpense: 4100000,
        avgCost: 341666,
        efficiencyScore: 89,
        healthScore: 91,
        currency: 'USD'
      },
      accounts: {
        expense: '60800 - Factory Overhead',
        revenue: 'N/A (Cost Center)',
        payroll: '60250 - Factory Labor Pay',
        depreciation: '60350 - Press Machine Dep'
      },
      allocation: {
        method: 'Revenue Based',
        frequency: 'Monthly',
        rules: 'Activity-Based Costing (ABC) machine hour weight calculations.'
      }
    }
  ]);

  const fetchData = () => {
    try { setLoading(true); setError(null); }
    catch (err) { setError(err.message || 'Failed to load cost centers'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'cost_center' });
    setActiveTab('erp_create_cost_center');
  };

  const handleViewClick = (row) => { setViewItem(row); };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.code || '', row });
  const handleDeleteConfirm = () => {
    setCostCenters(prev => prev.filter(c => c.id !== deleteDialog.id));
    addNotification?.('Cost center moved to trash', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const handleMoveToDraft = (row) => {
    setCostCenters(prev => prev.map(c => c.id === row.id ? { ...c, status: 'Draft' } : c));
    addNotification?.(`${row.name} moved to Draft`, 'success');
  };

  const filteredCenters = costCenters.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = filteredCenters;
    const cols = centerColumns.filter(c => c.key !== 'actions');
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'cost_centers.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'cost_centers.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ title: 'Cost Centers', headers, rows, filename: 'cost_centers.pdf' }); }
    else if (type === 'docx') { await exportDocx({ title: 'Cost Centers', headers, rows, filename: 'cost_centers.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Cost Centers', headers, rows, filename: 'cost_centers.doc' }); }
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
        <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
        <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />Word</button></li>
      </ul>
    </div>
  );

  const centerColumns = [
    { key: 'code', label: 'Cost Center Code' },
    { key: 'name', label: 'Name' },
    { key: 'branch', label: 'Branch & Company', render: (v, row) => `${row.branch} \u2022 ${row.company}` },
    { key: 'costType', label: 'Cost Type Scope', render: (v) => <span className="premium-badge bg-secondary text-white">{v}</span> },
    { key: 'method', label: 'Alloc Method', render: (v, row) => row.allocation.method },
    { key: 'budget', label: 'Budget Pool', render: (v, row) => <span className="text-success fw-bold font-monospace">${row.financials.budget.toLocaleString()}</span> },
    { key: 'utilized', label: 'Utilized', render: (v, row) => <span className="text-danger font-monospace">${row.financials.utilized.toLocaleString()}</span> },
    { key: 'remaining', label: 'Remaining', render: (v, row) => <span className="font-monospace">${row.financials.remaining.toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
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
          <button className="premium-btn btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_cost_center')}>
            <FontAwesomeIcon icon={faPlus} /> Create Cost Center
          </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Import wizard launched.', 'info')}>
        Import Cost Centers
      </button>
      <div className="dropdown d-inline-block">
        <button className="premium-btn btn btn-sm dropdown-toggle" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} data-bs-toggle="dropdown">
          <FontAwesomeIcon icon={faFileExport} className="me-1" /> Export
        </button>
        <ul className="dropdown-menu dropdown-menu-end" style={{ fontSize: '0.75rem' }}>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCsv} className="me-2" />CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="me-2" />XLSX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />DOCX</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
        </ul>
      </div>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Cost center hierarchy structure rendered.', 'info')}>
        Hierarchy View
      </button>
      <button className="premium-btn btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
        <FontAwesomeIcon icon={faRefresh} /> Refresh
      </button>
    </div>
  );

  const dashboardKpis = useMemo(() => [
    { label: 'Total Cost Centers', val: costCenters.length, color: accentColor },
    { label: 'Active Cost Centers', val: costCenters.filter(c => c.status === 'Active').length, color: '#10b981' },
    { label: 'Inactive Cost Centers', val: 0, color: '#64748b' },
    { label: 'Parent Cost Centers', val: '2 Nodes', color: '#3b82f6' },
    { label: 'Child Cost Centers', val: '0 Nodes', color: '#8b5cf6' },
    { label: 'Departments Linked', val: '4 Linked', color: '#06b6d4' },
    { label: 'Projects Linked', val: '3 Linked', color: '#ec4899' },
    { label: 'Employees Assigned', val: '124 FTE', color: '#10b981' },
    { label: 'Branches Assigned', val: '2 Branches', color: '#8b5cf6' },
    { label: 'Current Budget pool', val: '$6,000,000', color: '#10b981' },
    { label: 'Budget Utilized', val: '$5,300,000', color: '#ef4444' },
    { label: 'Budget Remaining', val: '$700,000', color: '#3b82f6' },
    { label: 'Monthly Expenses', val: '$500,000', color: '#ef4444' },
    { label: 'Quarterly Expenses', val: '$1,500,000', color: '#ef4444' },
    { label: 'Yearly Expenses', val: '$5,300,000', color: '#ef4444' },
    { label: 'Average Cost per Center', val: '$2,650,000', color: '#8b5cf6' },
    { label: 'Highest Spending Center', val: 'CC-MFG-PLT-301', color: '#ef4444' },
    { label: 'Lowest Spending Center', val: 'CC-HQ-FIN-101', color: '#10b981' },
    { label: 'Cost Efficiency Score', val: '92.5%', color: '#10b981' },
    { label: 'AI Financial Health Score', val: '94 / 100', color: '#8b5cf6' }
  ], [costCenters]);

  return (
    <ErpPageShell
      icon={faSitemap}
      title="Cost Centers Controlling"
      description="Manage organizational cost centers for budgeting, accounting allocations, expense tracking, profitability analysis, and financial reporting."
      action={headerAction}
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Registered Cost Centers Directory', icon: faFolderOpen },
          { id: 'dashboard', label: 'Executive Dashboard & KPIs', icon: faChartPie },
        ].map(tb => (
          <button
            key={tb.id}
            className={`premium-tab-btn btn btn-sm py-2 px-3 fw-bold`}
            style={{
              color: activeViewTab === tb.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
              background: activeViewTab === tb.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : (isDark ? '#1e293b' : '#f1f5f9'),
              border: 'none',
              borderRadius: '10px'
            }}
            onClick={() => setActiveViewTab(tb.id)}
          >
            <FontAwesomeIcon icon={tb.icon} className="me-2" />
            {tb.label}
          </button>
        ))}
      </div>

      {/* DIRECTORY */}
      {activeViewTab === 'directory' && (
        <div>
          {/* Filters */}
          <div className="glass-card p-3 mb-4" style={{ borderRadius: '16px' }}>
            <div className="row g-2">
              <div className="col-md-9">
                <input type="text" className="form-control form-control-sm" placeholder="Search by Cost Center Code, Name, Manager, Department..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                  <FontAwesomeIcon icon={faBrain} />
                </div>
                <div>
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Cost Optimization Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Analysis suggests potential 8% reduction in operational expenses through vendor consolidation and automated resource allocation across cost centers.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <ErpDataTable
            columns={centerColumns}
            data={filteredCenters}
            loading={loading}
            error={error}
            isDark={isDark}
            onRowClick={(row) => { setViewItem(row); }}
            exportButtons={exportButtons}
          />
        </div>
      )}

      {/* DASHBOARD */}
      {activeViewTab === 'dashboard' && (
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
                  <FontAwesomeIcon icon={faSitemap} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Cost Center Preview</span>
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
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Branch: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.branch} &bull; {viewItem.company}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Cost Type: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.costType}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Department: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.department}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.description}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.success, fontSize: '1.1rem' }}>${viewItem.financials.budget.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Utilized</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: colors.danger, fontSize: '1.1rem' }}>${viewItem.financials.utilized.toLocaleString()}</p>
                    </div>
                    <div className="col-4">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remaining</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '1.1rem' }}>${viewItem.financials.remaining.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Allocation Method</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.allocation.method}</span>
                    </div>
                    <div className="col-12">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>{viewItem.allocation.rules}</span>
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
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GL Accounts</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>Expense: {viewItem.accounts.expense} &bull; Payroll: {viewItem.accounts.payroll}</p>
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
        message="Are you sure you want to move this cost center to trash?"
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpCostCenters;
