import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck, faXmark, faRefresh, faCheckCircle, faBan, faTimeline,
  faBuildingColumns, faUser, faTags, faCoins, faShieldHalved,
  faInfoCircle, faFolder, faEye, faClock, faCalendarDays,
  faScaleBalanced, faChartLine, faHistory, faFileInvoice,
  faBuilding, faUsers, faBell, faListCheck, faGaugeHigh,
  faArrowTrendUp, faArrowTrendDown, faPlus, faFileSignature,
  faSitemap, faBolt, faFileExcel, faFilePdf, faUndo, faShareNodes,
  faEllipsisV, faUserCheck, faRightLeft, faFilePen, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';

// ----------------------------------------------------------------------
// MOCK DATASETS (Initial States)
// ----------------------------------------------------------------------
const INITIAL_WORKFLOWS = [
  { id: 1, name: 'High-Value Procurement Router', module: 'Purchase', dept: 'Sourcing & Log', amountRange: '> PKR 1,000,000', levels: 3, type: 'Sequential', company: 'Manage Core Ltd', status: 'Active' },
  { id: 2, name: 'Payroll Voucher Signoff', module: 'Payroll', dept: 'HR & Admin', amountRange: 'All amounts', levels: 2, type: 'Sequential', company: 'Manage Core Ltd', status: 'Active' },
  { id: 3, name: 'Opex Reimbursement Limit', module: 'Expenses', dept: 'Engineering', amountRange: '> PKR 50,000', levels: 2, type: 'Parallel', company: 'Manage Core Ltd', status: 'Active' },
  { id: 4, name: 'Capex Capital Acquisition', module: 'Fixed Assets', dept: 'Operations', amountRange: '> PKR 5,000,000', levels: 4, type: 'Conditional', company: 'Manage Core Ltd', status: 'Active' },
  { id: 5, name: 'Tax Return Authorization', module: 'Tax', dept: 'Finance & Accounts', amountRange: 'All amounts', levels: 1, type: 'Single-Level', company: 'Manage Core Ltd', status: 'Active' }
];

const INITIAL_REQUESTS = [
  { id: 101, docNo: 'PO-2026-9902', ref: 'Steel Sourcing Escrow', module: 'Purchase', dept: 'Sourcing & Log', level: 'L2 of L3', amount: 4500000, reqBy: 'Kashif Raza', reqDate: '2026-07-06', priority: 'Urgent', status: 'Pending', assignedToMe: true, notes: 'Bulk purchase of concrete rebar columns for Bay 3 expansion.' },
  { id: 102, docNo: 'JV-2026-0701', ref: 'Depreciation Adjust Q2', module: 'Accounting', dept: 'Finance & Accounts', level: 'L1 of L2', amount: 350000, reqBy: 'Sarah Connor', reqDate: '2026-07-05', priority: 'Medium', status: 'Pending', assignedToMe: true, notes: 'Annual depreciation entries for central production assets.' },
  { id: 103, docNo: 'EXP-26-99042', ref: 'Dubai Expo 2026 Hotel', module: 'Expenses', dept: 'Sales & BD', level: 'L2 of L2', amount: 18450, reqBy: 'Faisal Khan', reqDate: '2026-07-05', priority: 'Low', status: 'Approved', assignedToMe: false, notes: 'Hotel room bookings for client delegation.' },
  { id: 104, docNo: 'PR-2026-004', ref: 'HQ Marketing Agency PO', module: 'Purchase', dept: 'Marketing & PR', level: 'L1 of L2', amount: 1200000, reqBy: 'Aisha Malik', reqDate: '2026-07-04', priority: 'High', status: 'Pending', assignedToMe: false, notes: 'Agency deposit retainer for H2 digital launch campaigns.' },
  { id: 105, docNo: 'EMP-ADV-26-88', ref: 'Salary Advance - Kashif', module: 'Loans', dept: 'Customer Success', level: 'L1 of L1', amount: 30000, reqBy: 'Kashif Raza', reqDate: '2026-07-03', priority: 'Medium', status: 'Approved', assignedToMe: false, notes: 'Medical loan request.' },
  { id: 106, docNo: 'EXP-26-99043', ref: 'Office Stationery Purge', module: 'Expenses', dept: 'HR & Admin', level: 'L1 of L2', amount: 8400, reqBy: 'Mariam Ali', reqDate: '2026-07-02', priority: 'Low', status: 'Rejected', assignedToMe: false, notes: 'Calculators and markers purchase request.' }
];

const ErpApprovalDashboard = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Navigation tab switcher state
  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faChartLine },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faFileSignature },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faSitemap },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faHistory },
    { id: 'erp_drafts', label: 'Drafts', icon: faFilePen },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faScaleBalanced },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faBolt }
  ];

  // Core component state variables
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [onlyMyPending, setOnlyMyPending] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filters State
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
  };

  // DYNAMIC COMPUTATIONS FOR WORKFLOW STATS
  const totalActiveWorkflows = workflows.filter(w => w.status === 'Active').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const pendingForMe = requests.filter(r => r.status === 'Pending' && r.assignedToMe);
  const approvedRequests = requests.filter(r => r.status === 'Approved');
  const rejectedRequests = requests.filter(r => r.status === 'Rejected');
  const cancelledRequests = requests.filter(r => r.status === 'Cancelled');

  const approvalSuccessRate = requests.length > 0 
    ? Math.round((approvedRequests.length / (approvedRequests.length + rejectedRequests.length || 1)) * 100) 
    : 100;

  // ACTIONS (Maker-Checker Decisions)
  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', assignedToMe: false } : r));
    addNotification('Document successfully approved and posted to general ledger queues.', 'success');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Approved', assignedToMe: false }));
    }
  };

  const handleReject = (id) => {
    const comment = prompt("Provide rejection reasons/comments:");
    if (comment === null) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', assignedToMe: false, rejectionComment: comment } : r));
    addNotification('Document rejected and returned to requester.', 'warning');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Rejected', assignedToMe: false, rejectionComment: comment }));
    }
  };

  const handleReturn = (id) => {
    const notes = prompt("Enter modifications requested:");
    if (notes === null) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Returned', assignedToMe: false, notes: `[Returned] ${notes}` } : r));
    addNotification('Document returned to author for edits.', 'info');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Returned', assignedToMe: false, notes: `[Returned] ${notes}` }));
    }
  };

  const handleDelegate = (id) => {
    const newApprover = prompt("Enter delegate user name:");
    if (!newApprover) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Delegated', assignedToMe: false, delegatedTo: newApprover } : r));
    addNotification(`Document delegated to ${newApprover}.`, 'success');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Delegated', assignedToMe: false, delegatedTo: newApprover }));
    }
  };

  const simulateExport = (type) => {
    addNotification(`Generating ${type.toUpperCase()} file...`, 'info');
    setTimeout(() => {
      addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
    }, 800);
  };

  // STATUS MIX CALCULATIONS
  const statusMixList = [
    { label: 'Pending', count: requests.filter(r => r.status === 'Pending').length, color: '#F59E0B' },
    { label: 'Approved', count: requests.filter(r => r.status === 'Approved').length, color: '#10B981' },
    { label: 'Rejected', count: requests.filter(r => r.status === 'Rejected').length, color: '#EF4444' },
    { label: 'Returned', count: requests.filter(r => r.status === 'Returned').length, color: '#3B82F6' },
    { label: 'Cancelled', count: requests.filter(r => r.status === 'Cancelled').length, color: '#6B7280' }
  ];
  const totalCounts = statusMixList.reduce((sum, item) => sum + item.count, 0) || 1;

  // CSS Injector for modern SAP SuccessFactors layout
  const renderStyles = () => {
    return (
      <style>{`
        .gradient-hero-approvals {
          background: linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%);
          color: #ffffff;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(30, 41, 59, 0.15);
        }

        .gradient-hero-approvals::before {
          content: '';
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
          top: -50px;
          right: -50px;
          pointer-events: none;
        }

        .summary-card-approval {
          background: ${isDark ? '#1F2937' : '#FFFFFF'};
          border-left: 5px solid #2563EB;
          border-radius: 14px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: transform 0.2s ease-in-out;
        }

        .summary-card-approval:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        }

        .pill-tab-nav {
          background: ${isDark ? '#1F2937' : '#FFFFFF'};
          border: 1px solid ${isDark ? '#374151' : '#E2E8F0'};
          border-radius: 30px;
          padding: 6px;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .pill-item {
          border-radius: 24px;
          padding: 8px 18px;
          font-weight: 600;
          font-size: 13px;
          border: none;
          transition: all 0.2s ease-in-out;
          color: ${isDark ? '#D1D5DB' : '#4B5563'};
          background: transparent;
        }

        .pill-item.active {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .pill-item:hover:not(.active) {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
        }

        .custom-table {
          font-size: 13px;
        }

        .custom-table th {
          background-color: ${isDark ? '#374151' : '#F8FAFC'} !important;
          border-bottom: 2px solid ${isDark ? '#4B5563' : '#E2E8F0'};
          font-weight: 600;
        }

        .priority-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .priority-urgent { background-color: rgba(239, 68, 68, 0.15); color: #EF4444; }
        .priority-high { background-color: rgba(245, 158, 11, 0.15); color: #D97706; }
        .priority-medium { background-color: rgba(59, 130, 246, 0.15); color: #2563EB; }
        .priority-low { background-color: rgba(107, 114, 128, 0.15); color: #4B5563; }

        .drawer-approvals {
          position: fixed;
          top: 0;
          right: 0;
          width: 580px;
          height: 100vh;
          background: ${isDark ? '#1F2937' : '#FFFFFF'};
          box-shadow: -8px 0 25px rgba(0,0,0,0.15);
          z-index: 1060;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
        }

        .drawer-approvals.open {
          transform: translateX(0);
        }

        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(1.5px);
          z-index: 1055;
          display: none;
        }

        .drawer-overlay.open {
          display: block;
        }
      `}</style>
    );
  };

  return (
    <div className="container-fluid px-0 pb-5" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '90vh' }}>
      {renderStyles()}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HEADER SECTION                                                         */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 pt-4 text-start animate-fade-in">
        <div className="gradient-hero-approvals p-4 p-lg-5 shadow text-start">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-25 text-info px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill" style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                Phase 8A - Approval Workflows
              </span>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6">
                Approval Control Center
              </h1>
              <p className="text-light text-opacity-80 fs-6 mb-4" style={{ maxWidth: '650px' }}>
                Configure reusable multi-level approvals for accounting documents, review pending requests, and keep finance controls consistent before posting.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-primary text-white fw-bold d-flex align-items-center gap-2 border-0 px-4 py-2"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.3)' }}
                  onClick={() => setActiveTab('erp_approval_workflows')}
                >
                  <FontAwesomeIcon icon={faPlus} /> New Workflow
                </button>
                <button 
                  className={`btn fw-bold px-4 py-2 d-flex align-items-center gap-2 ${onlyMyPending ? 'btn-light' : 'btn-outline-light'}`}
                  style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}
                  onClick={() => setOnlyMyPending(!onlyMyPending)}
                >
                  <FontAwesomeIcon icon={faUserCheck} /> {onlyMyPending ? 'Show All Queue' : 'My Pending'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 my-4 text-start">
        <div className="pill-tab-nav shadow-sm">
          {navigationTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SUMMARY KPI CARDS                                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
        <div className="row g-4 mb-4">
          
          <div className="col-lg-3 col-md-6">
            <div className="summary-card-approval p-4 h-100" style={{ borderLeftColor: '#3B82F6' }}>
              <span className="small text-muted fw-bold text-uppercase d-block mb-1">Active Workflows</span>
              <div className="d-flex justify-content-between align-items-baseline">
                <h2 className="fw-extrabold mb-0 text-primary">{totalActiveWorkflows}</h2>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">Enabled</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="summary-card-approval p-4 h-100" style={{ borderLeftColor: '#F59E0B' }}>
              <span className="small text-muted fw-bold text-uppercase d-block mb-1">Pending Requests</span>
              <div className="d-flex justify-content-between align-items-baseline">
                <h2 className="fw-extrabold mb-0 text-warning">{pendingRequests.length}</h2>
                <span className="small text-muted">waiting post</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="summary-card-approval p-4 h-100" style={{ borderLeftColor: '#EF4444' }}>
              <span className="small text-muted fw-bold text-uppercase d-block mb-1">Pending For Me</span>
              <div className="d-flex justify-content-between align-items-baseline">
                <h2 className="fw-extrabold mb-0 text-danger">{pendingForMe.length}</h2>
                <span className="small text-danger fw-bold animate-pulse">Required Sign</span>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="summary-card-approval p-4 h-100" style={{ borderLeftColor: '#10B981' }}>
              <span className="small text-muted fw-bold text-uppercase d-block mb-1">Approved Requests</span>
              <div className="d-flex justify-content-between align-items-baseline">
                <h2 className="fw-extrabold mb-0 text-success">{approvedRequests.length}</h2>
                <span className="small text-muted">Success Rate: {approvalSuccessRate}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* ────────────────────────────────────────────────────────────────────── */}
        {/* ROW 2: DATATABLE & STAT MIX                                           */}
        {/* ────────────────────────────────────────────────────────────────────── */}
        <div className="row g-4 mb-4">
          
          {/* Column Left: Datatable */}
          <div className="col-xl-9 col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-start h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-0">My Pending Approvals</h5>
                  <span className="small text-muted">Requests waiting at your approval level.</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-link text-decoration-none fw-bold" onClick={() => setActiveTab('erp_approval_requests')}>View All</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => simulateExport('excel')}><FontAwesomeIcon icon={faFileExcel} className="text-success" /> Excel</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => simulateExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="text-danger" /> PDF</button>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Reference</th>
                      <th>Module</th>
                      <th>Department</th>
                      <th>Level</th>
                      <th>Amount</th>
                      <th>Requested By</th>
                      <th>Requested Date</th>
                      <th>Priority</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests
                      .filter(r => (onlyMyPending ? r.assignedToMe && r.status === 'Pending' : r.status === 'Pending'))
                      .map(r => (
                        <tr key={r.id}>
                          <td className="fw-bold text-primary font-monospace">{r.docNo}</td>
                          <td className="fw-semibold">{r.ref}</td>
                          <td><span className="badge bg-light text-dark font-monospace border">{r.module}</span></td>
                          <td>{r.dept}</td>
                          <td className="text-muted small">{r.level}</td>
                          <td className="fw-bold">{formatCurrency(r.amount)}</td>
                          <td>{r.reqBy}</td>
                          <td>{r.reqDate}</td>
                          <td>
                            <span className={`priority-badge priority-${r.priority.toLowerCase()}`}>{r.priority}</span>
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-1">
                              <button className="btn btn-xs btn-light" title="View details" onClick={() => setSelectedRequest(r)}>
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button className="btn btn-xs btn-success text-white" title="Approve" onClick={() => handleApprove(r.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button className="btn btn-xs btn-danger text-white" title="Reject" onClick={() => handleReject(r.id)}>
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {requests.filter(r => (onlyMyPending ? r.assignedToMe && r.status === 'Pending' : r.status === 'Pending')).length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center py-5 text-muted">
                          No pending approval is assigned to you.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column Right: Status Mix */}
          <div className="col-xl-3 col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-start h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3">Status Mix</h5>
              <div className="d-flex flex-column gap-3">
                {statusMixList.map(item => {
                  const percent = Math.round((item.count / totalCounts) * 100);
  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '90vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="gradient-hero-approvals p-4 p-lg-5 shadow text-start rounded-4" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%)', color: '#fff' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '140px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '400px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-4 mt-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="p-4 rounded-4" style={{ background: isDark ? '#1F2937' : '#fff', minHeight: '90px', borderLeft: '5px solid #2563EB' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '70%', height: '12px', background: isDark ? '#374151' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '30%', height: '28px', background: isDark ? '#374151' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
                    <div key={item.label}>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="fw-semibold" style={{ color: item.color }}><FontAwesomeIcon icon={faCheckCircle} className="me-2" />{item.label}</span>
                        <span className="text-muted fw-bold">{item.count} ({percent}%)</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div className="progress-bar" style={{ width: `${percent}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ────────────────────────────────────────────────────────────────────── */}
        {/* ROW 3: ACTIVE WORKFLOWS & LATEST REQUESTS                             */}
        {/* ────────────────────────────────────────────────────────────────────── */}
        <div className="row g-4 mb-4">
          
          {/* Active Workflows Rule Sets */}
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-start h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-0">Active Workflows</h5>
                  <span className="small text-muted">Current approval rule sets.</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-link text-decoration-none fw-bold" onClick={() => setActiveTab('erp_approval_workflows')}>Manage</button>
                  <button className="btn btn-sm btn-outline-light text-dark border" onClick={() => simulateExport('excel')}><FontAwesomeIcon icon={faFileExcel} className="text-success" /></button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Workflow</th>
                      <th>Module</th>
                      <th>Department</th>
                      <th>Levels</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map(w => (
                      <tr key={w.id}>
                        <td>
                          <div>
                            <strong className="d-block">{w.name}</strong>
                            <span className="x-small text-muted">{w.company} • {w.amountRange}</span>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-dark font-monospace border">{w.module}</span></td>
                        <td>{w.dept}</td>
                        <td><span className="badge bg-primary text-white">{w.levels} Levels</span></td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">{w.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Latest Requests Activity */}
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-start h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-0">Latest Requests</h5>
                  <span className="small text-muted">Recent approval activity across finance documents.</span>
                </div>
                <button className="btn btn-sm btn-outline-light text-dark border" onClick={() => simulateExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="text-danger" /></button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Module</th>
                      <th>Requested By</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold text-primary font-monospace">{r.docNo}</td>
                        <td><span className="badge bg-light text-dark font-monospace border">{r.module}</span></td>
                        <td>
                          <div>
                            <strong className="d-block">{r.reqBy}</strong>
                            <span className="x-small text-muted">{r.reqDate}</span>
                          </div>
                        </td>
                        <td className="fw-bold">{formatCurrency(r.amount)}</td>
                        <td>
                          <span className={`badge rounded-pill ${
                            r.status === 'Approved' ? 'bg-success bg-opacity-10 text-success' :
                            r.status === 'Rejected' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'
                          }`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* DETAILS SLIDE DRAWER PANEL                                             */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className={`drawer-overlay ${selectedRequest ? 'open' : ''}`} onClick={() => setSelectedRequest(null)}></div>
      <div className={`drawer-approvals text-start d-flex flex-column ${selectedRequest ? 'open' : ''}`}>
        {selectedRequest && (
          <>
            <div className="p-4 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-primary text-white font-monospace mb-1">{selectedRequest.docNo}</span>
                <h5 className="fw-bold mb-0 text-slate-800">{selectedRequest.ref}</h5>
                <span className="small text-muted">{selectedRequest.module} • Requested by {selectedRequest.reqBy}</span>
              </div>
              <button className="btn-close" onClick={() => setSelectedRequest(null)}></button>
            </div>

            <div className="p-4 flex-grow-1 overflow-y-auto">
              <div className="mb-4">
                <strong className="d-block mb-1">Details & Justification:</strong>
                <p className="text-muted small">{selectedRequest.notes}</p>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <span className="small text-muted d-block">Department</span>
                  <strong>{selectedRequest.dept}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Required Amount</span>
                  <strong className="text-primary">{formatCurrency(selectedRequest.amount)}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Filing Date</span>
                  <strong>{selectedRequest.reqDate}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Priority Level</span>
                  <span className={`priority-badge priority-${selectedRequest.priority.toLowerCase()}`}>{selectedRequest.priority}</span>
                </div>
              </div>

              <div className="mb-4">
                <strong className="d-block mb-3">Approval Routing Chain:</strong>
                <div className="position-relative ps-4" style={{ borderLeft: '2px dashed #CBD5E1' }}>
                  <div className="mb-3 position-relative">
                    <div className="position-absolute bg-success rounded-circle" style={{ left: '-25px', top: '4px', width: '10px', height: '10px' }} />
                    <span className="small text-muted d-block">Level 1 - Department Head Review</span>
                    <strong>Approved by Sarah Jenkins (2026-07-06 10:15 AM)</strong>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="position-absolute rounded-circle" style={{ left: '-25px', top: '4px', width: '10px', height: '10px', backgroundColor: selectedRequest.status === 'Approved' ? '#10B981' : '#F59E0B' }} />
                    <span className="small text-muted d-block">Level 2 - CFO Signoff</span>
                    <strong>
                      {selectedRequest.status === 'Approved' ? 'Approved by Admin User (GL Written)' : 'Pending Review from Admin User'}
                    </strong>
                  </div>
                </div>
              </div>

              {selectedRequest.rejectionComment && (
                <div className="alert alert-danger p-3 mb-4">
                  <strong>Rejection Comment:</strong>
                  <span className="d-block small">{selectedRequest.rejectionComment}</span>
                </div>
              )}
            </div>

            {selectedRequest.status === 'Pending' && selectedRequest.assignedToMe && (
              <div className="p-4 border-top bg-light d-flex gap-2">
                <button className="btn btn-success flex-grow-1" onClick={() => handleApprove(selectedRequest.id)}><FontAwesomeIcon icon={faCheck} /> Approve & Post</button>
                <button className="btn btn-danger flex-grow-1" onClick={() => handleReject(selectedRequest.id)}><FontAwesomeIcon icon={faXmark} /> Reject</button>
                <button className="btn btn-outline-secondary" title="Return" onClick={() => handleReturn(selectedRequest.id)}><FontAwesomeIcon icon={faUndo} /></button>
                <button className="btn btn-outline-secondary" title="Delegate" onClick={() => handleDelegate(selectedRequest.id)}><FontAwesomeIcon icon={faRightLeft} /></button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ErpApprovalDashboard;
