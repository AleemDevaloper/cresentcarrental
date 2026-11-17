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
  faFileWord, faFileAlt,
  faBell, faTriangleExclamation,
  faArrowUp, faArrowDown, faEdit, faFileSignature, faEnvelope, faBrain
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { DeleteConfirmDialog } from '../../../../components/common';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpBudgetAlerts = () => {
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
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });
  const [viewItem, setViewItem] = useState(null);

  // Mock Database for Alert Rules & Risk Scan events (SAP Financial Alert style)
  const [alertRules, setAlertRules] = useState([
    {
      id: 1,
      code: 'ALRT-RULE-091',
      name: 'Critical R&D Cloud Infrastructure GPU Spending Cap',
      description: 'Trigger Critical warning if R&D cloud instance utilization consumes over 90% of monthly budget.',
      category: 'Budget Utilization',
      severity: 'Critical',
      threshold: '90% Monthly Limit',
      status: 'Active',
      costCenter: 'CC-HQ-FIN-101',
      recipients: 'CFO, Finance Manager, Tech Director',
      channels: 'Slack, MS Teams, Email Webhooks',
      company: 'ManageCore Global Inc.',
      branch: 'Headquarters',
      businessUnit: 'Tech Operations'
    },
    {
      id: 2,
      code: 'ALRT-RULE-092',
      name: 'Midwest Stamping Plant Floor Operations Stamping Line Limit',
      description: 'Trigger Warning if plant floor Bay 4 electricity consumption exceeds quarterly allocation by 80%.',
      category: 'Manufacturing Budget',
      severity: 'Warning',
      threshold: '80% Quarterly Limit',
      status: 'Active',
      costCenter: 'CC-MFG-PLT-301',
      recipients: 'Plant Manager, Finance Manager',
      channels: 'MS Teams, Email',
      company: 'ManageCore Manufacturing Corp',
      branch: 'Midwest Manufacturing',
      businessUnit: 'Manufacturing Operations'
    }
  ]);

  const fetchData = () => {
    try { setLoading(true); setError(null); }
    catch (err) { setError(err.message || 'Failed to load alerts'); addNotification?.(err.message, 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'alert_rule' });
    setActiveTab('erp_create_alert_rule');
  };

  const handleViewClick = (row) => { setViewItem(row); };

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.code || '', row });
  const handleDeleteConfirm = () => {
    setAlertRules(prev => prev.filter(r => r.id !== deleteDialog.id));
    addNotification?.('Alert rule moved to trash', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const handleMoveToDraft = (row) => {
    setAlertRules(prev => prev.map(r => r.id === row.id ? { ...r, status: 'Draft' } : r));
    addNotification?.('Alert rule moved to Draft', 'success');
  };

  const filteredRules = alertRules.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase());
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
    const data = filteredRules;
    const cols = [
      { key: 'code', label: 'Rule Code' }, { key: 'name', label: 'Rule Name' },
      { key: 'category', label: 'Category Scope' }, { key: 'severity', label: 'Severity' },
      { key: 'threshold', label: 'Trigger Limit' }, { key: 'costCenter', label: 'Linked Cost Center' },
      { key: 'recipients', label: 'Recipients' }, { key: 'channels', label: 'Channels' },
      { key: 'status', label: 'Status' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'budget_alerts.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'budget_alerts.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { exportDocx(rows, headers, 'budget_alerts.docx'); }
    else if (type === 'word') { exportWord(rows, headers, 'budget_alerts.doc'); }
    else if (type === 'pdf') { exportPdf(rows, headers, 'budget_alerts.pdf'); }
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

  const alertColumns = [
    { key: 'code', label: 'Rule Code', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary" style={{ cursor: 'pointer' }} onClick={() => { const r = alertRules.find(x => x.code === val); if (r) { setViewItem(r); } }}>{val}</span> },
    { key: 'name', label: 'Rule Name', bold: true },
    { key: 'category', label: 'Category Scope' },
    { key: 'severity', label: 'Severity', render: (val) => (
      <span className="premium-badge" style={{
        background: val === 'Critical' ? (isDark ? '#7f1d1d' : '#fce7e7') : (isDark ? '#78350f' : '#fef3c7'),
        color: val === 'Critical' ? '#ef4444' : '#d97706'
      }}>{val}</span>
    )},
    { key: 'threshold', label: 'Trigger Limit', render: (val) => <span className="font-monospace fw-bold">{val}</span> },
    { key: 'costCenter', label: 'Linked Cost Center', render: (val) => <span className="font-monospace text-muted">{val}</span> },
    { key: 'recipients', label: 'Recipients' },
    { key: 'channels', label: 'Channels' },
    { key: 'status', label: 'Status', render: (val) => <span className="premium-badge bg-success text-white">{val}</span> },
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
    { label: 'Total Alert Rules', val: alertRules.length, sub: 'Configured trigger parameters', color: accentColor },
    { label: 'Active Alerts Queue', val: '1 Event', sub: 'Unresolved spending alerts', color: '#ef4444' },
    { label: 'Critical Alerts', val: '1 Event', sub: 'Immediate treasury intervention', color: '#ef4444' },
    { label: 'Warning Alerts', val: 0, sub: 'Approaching limit threshold', color: '#f59e0b' },
    { label: 'Information Alerts', val: 0, sub: 'FY budget rollover notices', color: '#3b82f6' },
    { label: 'Resolved Alerts', val: '4 Events', sub: 'Successfully allocated reserves', color: '#10b981' },
    { label: 'Ignored Alerts', val: 0, sub: 'Whitelisted deviations', color: '#64748b' },
    { label: 'Escalated Alerts', val: '1 Event', sub: 'CFO review queue escalations', color: '#8b5cf6' },
    { label: 'Departments at Risk', val: '1 Dept', sub: 'R&D Operations threshold risk', color: '#ef4444' },
    { label: 'Projects at Risk', val: '1 Project', sub: 'Valkyrie platform GPU cost', color: '#ef4444' },
    { label: 'Branches at Risk', val: '1 Branch', sub: 'Headquarters corporate costs', color: '#ef4444' },
    { label: 'Cost Centers at Risk', val: '1 Center', sub: 'CC-HQ-FIN-101 billing cap', color: '#ef4444' },
    { label: 'Profit Centers at Risk', val: 'None', sub: 'Sales yield margins stable', color: '#10b981' },
    { label: 'Payroll Budget Alerts', val: '0 Rules', sub: 'Salary allocations correct', color: '#64748b' },
    { label: 'Manufacturing Budget Alerts', val: '0 Alerts', sub: 'Detroit factory lines safe', color: '#10b981' },
    { label: 'Inventory Budget Alerts', val: '0 Alerts', sub: 'Steel sourcing reserves safe', color: '#10b981' },
    { label: 'Procurement Budget Alerts', val: '0 Alerts', sub: 'Vendor limits validated', color: '#10b981' },
    { label: 'Cash Flow Alerts', val: 'Optimal', sub: 'Cash flow balance correct', color: '#10b981' },
    { label: 'Revenue Alerts', val: 'On Track', sub: 'Client contract targets hit', color: '#10b981' },
    { label: 'Expense Alerts', val: '1 Alert', sub: 'Overhead expenses notice', color: '#ef4444' },
    { label: 'Compliance Alerts', val: 'Compliant', sub: 'Tax filings audits validated', color: '#10b981' },
    { label: 'AI Financial Risk Score', val: 'Low Risk', sub: 'Calculated by Valkyrie', color: '#10b981' },
    { label: 'Overall Budget Health', val: '96 / 100', sub: 'Standard target variance ratio', color: '#10b981' },
    { label: 'Financial Stability Index', val: 'Excellent', sub: 'GAAP consolidation rating', color: '#10b981' }
  ], [alertRules]);

  return (
    <ErpPageShell
      icon={faFolderOpen}
      title="Budget Risks & Alerts"
      description="Monitor enterprise budgets in real-time with intelligent alerts, predictive analytics, financial risk detection, and automated notifications."
      action={
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(99,102,241,0.35)' }} onClick={() => setActiveTab('erp_create_alert_rule')}>
            <FontAwesomeIcon icon={faPlus} /> Create Alert Rule
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Budget active monitoring daemon is scanning...', 'success')}>
            Budget Monitor
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('AI risk scan initiated on GL account ledger.', 'info')}>
            AI Risk Scan
          </button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, border: 'none', fontSize: '0.75rem' }} onClick={() => addNotification('Refreshed.', 'success')}>
            <FontAwesomeIcon icon={faRefresh} /> Refresh Dashboard
          </button>
        </div>
      }
    >
      {/* Switcher */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'directory', label: 'Alert Rules Configuration Register', icon: faFolderOpen },
          { id: 'dashboard', label: 'Risk Metrics Dashboard', icon: faChartPie },
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
                  <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Risk Detection Recommendation</div>
                  <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Risk scanning identifies 1 critical alert requiring immediate attention. Review R&D cloud GPU spending caps and escalate to CFO.</div>
                </div>
              </div>
            </div>
          </div>

          <ErpDataTable
            columns={alertColumns}
            data={filteredRules}
            loading={loading}
            error={error}
            searchable
            searchPlaceholder="Search alert rules by Code, Name, Category..."
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
                  <FontAwesomeIcon icon={faBell} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Alert Rule Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.severity === 'Critical' ? (isDark ? '#7f1d1d' : '#fce7e7') : (isDark ? '#78350f' : '#fef3c7'), color: viewItem.severity === 'Critical' ? (isDark ? '#ef4444' : '#dc2626') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.severity === 'Critical' ? (isDark ? '#ef4444' : '#dc2626') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.severity}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Rule: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.name}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>Category: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.category}</span></p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Threshold: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.threshold}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Status: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.status}</span></p>
                  </div>
                </div>

                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</small>
                      <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.description}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cost Center</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.9rem' }}>{viewItem.costCenter}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Unit</small>
                      <p className="mb-0 mt-1 fw-bold font-monospace" style={{ color: textColor, fontSize: '0.9rem' }}>{viewItem.businessUnit}</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '1rem' }}>
                  <div className="row g-2">
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Recipients</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.recipients}</span>
                    </div>
                    <div className="col-8">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>Notification Channels</span>
                    </div>
                    <div className="col-4 text-end">
                      <span style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>{viewItem.channels}</span>
                    </div>
                    <div className="col-12" style={{ borderTop: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, margin: '0.5rem 0' }}></div>
                    <div className="col-8">
                      <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>Company</span>
                    </div>
                    <div className="col-4 text-end">
                      <span className="fw-bold font-monospace" style={{ color: colors.primary, fontSize: '1rem' }}>{viewItem.company}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#fffbeb', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Branch</small>
                  <p className="mb-0 mt-1" style={{ color: textColor, fontSize: '0.75rem' }}>{viewItem.branch} &bull; {viewItem.company}</p>
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
        message="Are you sure you want to move this alert rule to trash?"
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Move to Trash"
      />

    </ErpPageShell>
  );
};

export default ErpBudgetAlerts;
