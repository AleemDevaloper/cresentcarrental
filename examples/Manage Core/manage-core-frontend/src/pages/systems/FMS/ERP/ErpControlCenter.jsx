import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSliders, faChartLine, faFolderOpen, faShieldHalved, faBook, faFileAlt,
  faScaleBalanced, faFileInvoice, faCoins, faUsers, faClock, faRefresh,
  faBuilding, faCogs, faToggleOn, faToggleOff, faPlay, faTrashCan, faEye,
  faCheck, faXmark, faUndo, faArrowRight, faTriangleExclamation, faCircleCheck,
  faServer, faBrain, faBolt, faCalendarDays, faUserShield, faKey, faHistory
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';

// ----------------------------------------------------------------------
// INITIAL OPERATIONAL DATASETS
// ----------------------------------------------------------------------
const INITIAL_ACTIVITIES = [
  { id: 1, title: 'Journal Posted Successfully', ref: 'JV-2026-0701', desc: 'Posted depreciation adjustments Q2 to assets registry.', by: 'Kashif Raza', time: '10:14 AM', company: 'Manage Core Ltd', status: 'Success' },
  { id: 2, title: 'Customer Payment Received', ref: 'REC-2026-0042', desc: 'Cleared invoice INV-2026-8902 via HBL escrow.', by: 'Sarah Connor', time: '09:45 AM', company: 'Manage Core Ltd', status: 'Success' },
  { id: 3, title: 'Supplier Bill Matches Passed', ref: 'VIL-2026-1102', desc: '3-Way matching verified for PO-2026-9902.', by: 'System Automation', time: '02:05 AM', company: 'Manage Core Ltd', status: 'Success' },
  { id: 4, title: 'Fiscal Period Closing Triggered', ref: 'PRD-Q1-CLOSE', desc: 'Q1 periods closed. Balances carried to Q2 ledger.', by: 'Admin User', time: 'Yesterday', company: 'Manage Core Ltd', status: 'Warning' }
];

const INITIAL_PENDING_APPROVALS = [
  { id: 101, docNo: 'PO-2026-9902', module: 'Purchase', workflow: 'High-Value Procurement Router', reqBy: 'Kashif Raza', assignTo: 'Admin User', priority: 'Urgent', amount: 4500000, date: '2026-07-06', status: 'Pending' },
  { id: 102, docNo: 'JV-2026-0701', module: 'Accounting', workflow: 'GL Adjustments Router', reqBy: 'Sarah Connor', assignTo: 'Admin User', priority: 'Medium', amount: 350000, date: '2026-07-05', status: 'Pending' },
  { id: 107, docNo: 'BUD-2026-022', module: 'Budgets', workflow: 'Budget Threshold Router', reqBy: 'Bilal Siddiqui', assignTo: 'Admin User', priority: 'High', amount: 1500000, date: '2026-07-01', status: 'Pending' }
];

const INITIAL_ALERTS = [
  { id: 201, title: 'Bank Reconciliation Pending', priority: 'High', desc: 'Statement from HBL has 14 unmatched rows requiring verification.', module: 'Banking', date: '2026-07-07' },
  { id: 202, title: 'Balance Sheet Mismatch Warning', priority: 'Critical', desc: 'Asset ledgers are offset by PKR 1,200,000 against liabilities + equity.', module: 'Accounting', date: '2026-07-06' },
  { id: 203, title: 'Budget Limit Exceeded', priority: 'Medium', desc: 'Marketing Cost Center has consumed 105% of allocated Q2 budget.', module: 'Budgets', date: '2026-07-05' }
];

const ErpControlCenter = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const navigationTabs = [
    { id: 'center', label: 'Report Center', icon: faFolderOpen },
    { id: 'exec', label: 'Executive Summary', icon: faChartLine },
    { id: 'ctrl', label: 'Control Center', icon: faSliders },
    { id: 'qa', label: 'Quality Assurance', icon: faShieldHalved },
    { id: 'daybook', label: 'Day Book', icon: faBook },
    { id: 'gl', label: 'General Ledger', icon: faFileAlt },
    { id: 'tb', label: 'Trial Balance', icon: faScaleBalanced },
    { id: 'pl', label: 'Profit & Loss', icon: faFileInvoice },
    { id: 'bs', label: 'Balance Sheet', icon: faFileInvoice },
    { id: 'cashflow', label: 'Cash Flow', icon: faCoins },
    { id: 'customer_ledger', label: 'Customer Ledger', icon: faUsers },
    { id: 'vendor_ledger', label: 'Vendor Ledger', icon: faUsers },
    { id: 'ar_aging', label: 'Receivables Aging', icon: faClock },
    { id: 'ap_aging', label: 'Payables Aging', icon: faClock }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'exec') {
      setActiveTab('erp_executive_summary');
    } else if (tabId === 'ctrl') {
      setActiveTab('erp_control_center');
    } else if (tabId === 'qa') {
      setActiveTab('erp_quality_assurance');
    } else if (tabId === 'center') {
      setActiveTab('erp_report_center');
    } else if (tabId === 'daybook') {
      setActiveTab('erp_day_book');
    } else if (tabId === 'gl') {
      setActiveTab('erp_general_ledger');
    } else if (tabId === 'tb') {
      setActiveTab('erp_trial_balance');
    } else if (tabId === 'pl') {
      setActiveTab('erp_profit_loss');
    } else if (tabId === 'bs') {
      setActiveTab('erp_balance_sheet');
    } else if (tabId === 'cashflow') {
      setActiveTab('erp_cash_flow');
    } else if (tabId === 'customer_ledger') {
      setActiveTab('erp_customer_ledger_summary');
    } else if (tabId === 'vendor_ledger') {
      setActiveTab('erp_vendor_ledger_summary');
    } else if (tabId === 'ar_aging') {
      setActiveTab('erp_receivables_aging');
    } else if (tabId === 'ap_aging') {
      setActiveTab('erp_payables_aging');
    } else {
      localStorage.setItem('erp_active_report_subtab', tabId);
      setActiveTab('erp_report_center');
    }
  };

  // Core component state variables
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [approvals, setApprovals] = useState(INITIAL_PENDING_APPROVALS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Summary Metrics State
  const [metrics, setMetrics] = useState({
    postedJournals: 142,
    pendingApprovals: 3,
    bankAccounts: 5,
    openPeriods: 1,
    reconciliationPending: 14,
    alertsCount: 3
  });

  const handleRefreshDashboard = () => {
    addNotification("Scanning ERP services and queue processing engines...", "info");
    setTimeout(() => {
      addNotification("Dashboard metrics successfully refreshed.", "success");
    }, 800);
  };

  const handleApprove = (id, docNo) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    setMetrics(prev => ({
      ...prev,
      postedJournals: prev.postedJournals + 1,
      pendingApprovals: prev.pendingApprovals - 1
    }));
    
    // Add to activity logs
    const act = {
      id: Date.now(),
      title: 'Document Approved & Posted',
      ref: docNo,
      desc: 'Maker-checker signoff completed via Finance Control Center.',
      by: 'Admin User',
      time: 'Just now',
      company: 'Manage Core Ltd',
      status: 'Success'
    };
    setActivities(prev => [act, ...prev]);
    addNotification(`Document ${docNo} posted successfully.`, 'success');
  };

  const handleResolveAlert = (id, title) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setMetrics(prev => ({ ...prev, alertsCount: Math.max(0, prev.alertsCount - 1) }));
    addNotification(`Alert "${title}" marked as resolved.`, 'success');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} className="mb-4" />
          <div className="row g-4 mb-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="col-xl-2 col-md-4 col-6">
                <div style={{ height: 100, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} />
              </div>
            ))}
          </div>
          <div className="row g-4">
            <div className="col-lg-6"><div style={{ height: 250, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            <div className="col-lg-6"><div style={{ height: 250, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <style>{`
        .custom-pill-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: ${isDark ? 'rgba(30, 41, 59, 0.45)' : '#ffffff'};
          backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 16px;
          overflow-x: auto;
          white-space: nowrap;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
        }
        .custom-pill-nav::-webkit-scrollbar {
          display: none;
        }
        .custom-pill-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          color: ${isDark ? '#cbd5e1' : '#475569'};
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .custom-pill-item:hover {
          color: ${isDark ? '#f8fafc' : '#0f172a'};
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(2, 132, 199, 0.05)'};
          transform: translateY(-1px);
        }
        .custom-pill-item.active {
          color: #ffffff !important;
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
          box-shadow: 0 4px 12px rgba(3, 105, 161, 0.25);
        }
        .custom-pill-item:active {
          transform: scale(0.97);
        }
      `}</style>
      
      <ErpReportHeader
        title="Finance Control Center"
        badge="FINANCE COMMAND CENTER"
        description="Monitor accounting operations, financial performance, approvals, journals, banking activities, compliance status, and ERP system health from one centralized dashboard."
        isDark={isDark}
        activeTabId="ctrl"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Report Center', icon: faFolderOpen, onClick: () => setActiveTab('erp_report_center'), variant: 'outline' }
        ]}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* KPI DASHBOARD ROW                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-4">
          {[
            { title: 'Posted Journals', val: metrics.postedJournals, desc: 'Journals successfully committed.', border: '#3B82F6' },
            { title: 'Pending Approvals', val: metrics.pendingApprovals, desc: 'Transactions waiting signoff.', border: '#F59E0B' },
            { title: 'Bank Accounts', val: metrics.bankAccounts, desc: 'Active company accounts.', border: '#10B981' },
            { title: 'Open Fiscal Periods', val: metrics.openPeriods, desc: 'Currently active periods.', border: '#8B5CF6' },
            { title: 'Pending Reconciliation', val: metrics.reconciliationPending, desc: 'Reconciliations in matching.', border: '#EF4444' },
            { title: 'Accounting Alerts', val: metrics.alertsCount, desc: 'System anomaly warnings.', border: '#6B7280' }
          ].map(kpi => (
            <div key={kpi.title} className="col-xl-2 col-md-4 col-6">
              <div className="card p-3 border-0 shadow-sm rounded-4 bg-white border-start border-5" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderLeftColor: kpi.border }}>
                <span className="small text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '11px' }}>{kpi.title}</span>
                <h3 className="fw-extrabold mb-1">{kpi.val}</h3>
                <span className="x-small text-muted d-block">{kpi.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* OPERATIONS SUMMARY & ACCOUNTING HEALTH                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-4">
          
          {/* Operations Summary */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3">Financial Operations Summary</h5>
              <div className="d-flex flex-column gap-3">
                {[
                  { name: 'General Ledger Postings', val: '142 Posted', pct: 98, color: '#3B82F6' },
                  { name: 'Supplier Bill Verification', val: '45 Checked', pct: 100, color: '#10B981' },
                  { name: 'Customer Invoices Dispatched', val: '120 Sent', pct: 99, color: '#F59E0B' },
                  { name: 'Bank Reconciliations Matched', val: '182 lines matched', pct: 92, color: '#8B5CF6' }
                ].map(op => (
                  <div key={op.name}>
                    <div className="d-flex justify-content-between mb-1 small">
                      <span>{op.name}</span>
                      <strong className="text-muted">{op.val} ({op.pct}%)</strong>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className="progress-bar" style={{ width: `${op.pct}%`, backgroundColor: op.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accounting Health status */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3">Accounting Health Status</h5>
              <div className="row g-3">
                {[
                  { label: 'Trial Balance', status: 'Healthy', val: '100%', color: 'success' },
                  { label: 'Balance Sheet', status: 'Warning', val: '99%', color: 'warning' },
                  { label: 'General Ledger', status: 'Healthy', val: '100%', color: 'success' },
                  { label: 'Cash Flow', status: 'Healthy', val: '100%', color: 'success' },
                  { label: 'Receivables aging', status: 'Warning', val: '95%', color: 'warning' },
                  { label: 'Payables ledger', status: 'Healthy', val: '100%', color: 'success' }
                ].map(hlth => (
                  <div key={hlth.label} className="col-6">
                    <div className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                      <div>
                        <span className="small text-muted d-block">{hlth.label}</span>
                        <span className={`badge bg-${hlth.color}`}>{hlth.status}</span>
                      </div>
                      <strong className="fs-5">{hlth.val}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* PENDING APPROVALS TABLE                                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0">Pending Approvals Queue</h5>
              <span className="small text-muted">Transactions awaiting operational verification.</span>
            </div>
            <button className="btn btn-xs btn-outline-primary" onClick={() => setActiveTab('erp_approval_dashboard')}>Approval Dashboard</button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Document No</th>
                  <th>Module</th>
                  <th>Workflow Rule</th>
                  <th>Requested By</th>
                  <th>Assigned Approver</th>
                  <th>Date Filed</th>
                  <th>Priority</th>
                  <th>Total Amount</th>
                  <th className="text-end">Maker-Checker Decisions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map(appr => (
                  <tr key={appr.id}>
                    <td className="fw-bold text-primary font-monospace">{appr.docNo}</td>
                    <td><span className="badge bg-light text-dark font-monospace border">{appr.module}</span></td>
                    <td>{appr.workflow}</td>
                    <td>{appr.reqBy}</td>
                    <td>{appr.assignTo}</td>
                    <td>{appr.date}</td>
                    <td>
                      <span className={`priority-badge priority-${appr.priority.toLowerCase()}`}>{appr.priority}</span>
                    </td>
                    <td className="fw-bold">{formatCurrency(appr.amount)}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-xs btn-success text-white" onClick={() => handleApprove(appr.id, appr.docNo)}><FontAwesomeIcon icon={faCheck} /></button>
                        <button className="btn btn-xs btn-danger text-white" onClick={() => addNotification('Reject clicked.', 'warning')}><FontAwesomeIcon icon={faXmark} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {approvals.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">No pending approvals found. All documents verified.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* RECENT ACTIVITIES & ALERT CENTER                                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="row g-4">
          
          {/* Column Left: Recent Activities */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3">Recent Accounting Activities</h5>
              <div className="timeline-activity position-relative ps-4" style={{ borderLeft: '2px solid #E2E8F0' }}>
                {activities.map(act => (
                  <div key={act.id} className="mb-3 position-relative text-start">
                    <div className="position-absolute bg-primary rounded-circle" style={{ left: '-25px', top: '4px', width: '8px', height: '8px' }}></div>
                    <span className="x-small text-muted d-block">{act.time} • {act.by} • {act.company}</span>
                    <strong className="d-block text-slate-800 small">{act.title} ({act.ref})</strong>
                    <p className="x-small text-muted mb-0">{act.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column Right: Alert Center */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3">Critical Operational Alerts</h5>
              <div className="d-flex flex-column gap-3">
                {alerts.map(alrt => (
                  <div key={alrt.id} className="p-3 rounded-3 border" style={{ borderLeft: '5px solid #EF4444', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <strong className="small text-danger">{alrt.title}</strong>
                      <span className="badge bg-danger">{alrt.priority}</span>
                    </div>
                    <p className="x-small text-muted mb-2">{alrt.desc}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="x-small font-monospace text-muted">{alrt.module} • {alrt.date}</span>
                      <button className="btn btn-xs btn-outline-success" onClick={() => handleResolveAlert(alrt.id, alrt.title)}>Resolve</button>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-5 text-muted">No active critical alerts. FMS operational state healthy.</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SYSTEM PERFORMANCE MONITOR                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 text-start">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faServer} className="text-primary me-2" /> Live ERP System Monitoring</h5>
          <div className="row g-3 small text-muted">
            <div className="col-md-3 col-6">Database Server Status: <strong className="text-success">Online</strong></div>
            <div className="col-md-3 col-6">API Gateways Response: <strong className="text-success">Healthy (120ms)</strong></div>
            <div className="col-md-3 col-6">Scheduler cron status: <strong className="text-success">Active</strong></div>
            <div className="col-md-3 col-6">Background workers: <strong className="text-success">Running</strong></div>
            <div className="col-md-3 col-6">Memory Usage: <strong>42% consumed</strong></div>
            <div className="col-md-3 col-6">CPU Load metrics: <strong>12% load</strong></div>
            <div className="col-md-3 col-6">Storage Volumes: <strong className="text-success">Healthy</strong></div>
            <div className="col-md-3 col-6">Daily logs backup: <strong className="text-success">Completed</strong></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ErpControlCenter;
