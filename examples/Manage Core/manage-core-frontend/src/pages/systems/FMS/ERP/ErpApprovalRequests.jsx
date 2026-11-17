import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExcel, faFilePdf, faFileCode, faPrint,
  faEnvelope, faEye, faCheck, faXmark, faUndo, faRightLeft,
  faCircleUp, faClock, faInfoCircle, faChevronRight, faBuilding,
  faSitemap, faChartLine, faFileSignature, faHistory, faScaleBalanced,
  faBolt, faBell, faCheckDouble, faArrowTrendUp, faTriangleExclamation,
  faUserTie, faFolderOpen, faTrashCan, faFileWord, faFileAlt, faFilePen
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';

// ----------------------------------------------------------------------
// INITIAL MOCK REQUESTS DATA
// ----------------------------------------------------------------------
const INITIAL_REQUESTS = [
  { id: 101, docNo: 'PO-2026-9902', workflow: 'High-Value Procurement Router', module: 'Purchase', currentLevel: 'Level 2 of 3', requester: 'Kashif Raza', approver: 'Admin User', dept: 'Sourcing & Log', company: 'Manage Core Ltd', date: '2026-07-06', dueDate: '2026-07-08', amount: 4500000, currency: 'PKR', priority: 'Urgent', status: 'Pending Approval', progress: 66, notes: 'Bulk purchase of concrete rebar columns for Bay 3 expansion.' },
  { id: 102, docNo: 'JV-2026-0701', workflow: 'General Ledger Adjustment', module: 'Accounting', currentLevel: 'Level 1 of 2', requester: 'Sarah Connor', approver: 'Admin User', dept: 'Finance & Accounts', company: 'Manage Core Ltd', date: '2026-07-05', dueDate: '2026-07-07', amount: 350000, currency: 'PKR', priority: 'Medium', status: 'Pending Approval', progress: 50, notes: 'Annual depreciation entries for central production assets.' },
  { id: 103, docNo: 'EXP-26-99042', workflow: 'Opex Reimbursement Limit', module: 'Expenses', currentLevel: 'Approved', requester: 'Faisal Khan', approver: 'Jessica Pearson', dept: 'Sales & BD', company: 'Manage Core Ltd', date: '2026-07-05', dueDate: '2026-07-07', amount: 18450, currency: 'PKR', priority: 'Low', status: 'Approved', progress: 100, notes: 'Hotel room bookings for client delegation.' },
  { id: 104, docNo: 'PR-2026-004', workflow: 'Capex Capital Acquisition', module: 'Purchase', currentLevel: 'Level 1 of 4', requester: 'Aisha Malik', approver: 'Sarah Connor', dept: 'Marketing & PR', company: 'Manage Core Ltd', date: '2026-07-04', dueDate: '2026-07-07', amount: 1200000, currency: 'PKR', priority: 'High', status: 'Pending Approval', progress: 25, notes: 'Agency deposit retainer for H2 digital launch campaigns.' },
  { id: 105, docNo: 'EMP-ADV-26-88', workflow: 'Salary Advance Router', module: 'Loans', currentLevel: 'Approved', requester: 'Kashif Raza', approver: 'Jessica Pearson', dept: 'Customer Success', company: 'Manage Core Ltd', date: '2026-07-03', dueDate: '2026-07-05', amount: 30000, currency: 'PKR', priority: 'Medium', status: 'Approved', progress: 100, notes: 'Medical loan request.' },
  { id: 106, docNo: 'EXP-26-99043', workflow: 'Standard Reimbursement Limit', module: 'Expenses', currentLevel: 'Rejected', requester: 'Mariam Ali', approver: 'John Doe', dept: 'HR & Admin', company: 'Manage Core Ltd', date: '2026-07-02', dueDate: '2026-07-04', amount: 8400, currency: 'PKR', priority: 'Low', status: 'Rejected', progress: 0, notes: 'Calculators and markers purchase request.' },
  { id: 107, docNo: 'BUD-2026-022', workflow: 'Budget Threshold Router', module: 'Budgets', currentLevel: 'Level 2 of 2', requester: 'Bilal Siddiqui', approver: 'Admin User', dept: 'Software Engineering', company: 'Manage Core Ltd', date: '2026-07-01', dueDate: '2026-07-04', amount: 1500000, currency: 'PKR', priority: 'High', status: 'Pending Approval', progress: 75, notes: 'Additional server infrastructure provisioning budget.' }
];

const ErpApprovalRequests = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

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

  // Core requests state
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Advanced Filters Params
  const [advancedParams, setAdvancedParams] = useState({
    company: 'All',
    department: 'All',
    project: 'All',
    costCenter: 'All'
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
  };

  // HANDLERS FOR INDIVIDUAL ACTIONS
  const handleApproveRequest = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved', progress: 100, currentLevel: 'Approved' } : r));
    addNotification(`Request ${id} approved and signed.`, 'success');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Approved', progress: 100, currentLevel: 'Approved' }));
    }
  };

  const handleRejectRequest = (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', progress: 0, currentLevel: 'Rejected', rejectionReason: reason } : r));
    addNotification(`Request ${id} rejected. Requester notified.`, 'warning');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Rejected', progress: 0, currentLevel: 'Rejected', rejectionReason: reason }));
    }
  };

  const handleReturnRequest = (id) => {
    const comments = prompt("Enter comments for modification:");
    if (comments === null) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Returned', progress: 20, notes: `[Returned] ${comments}` } : r));
    addNotification(`Request ${id} returned to draft.`, 'info');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Returned', progress: 20, notes: `[Returned] ${comments}` }));
    }
  };

  const handleDelegateRequest = (id) => {
    const user = prompt("Enter delegate user name:");
    if (!user) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Delegated', approver: user } : r));
    addNotification(`Request delegated to ${user}.`, 'success');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Delegated', approver: user }));
    }
  };

  const handleEscalateRequest = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Escalated', approver: 'Super Admin (Escalated)', priority: 'Urgent' } : r));
    addNotification(`Request escalated to Super Admin level.`, 'error');
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(prev => ({ ...prev, status: 'Escalated', approver: 'Super Admin (Escalated)', priority: 'Urgent' }));
    }
  };

  // BULK ACTIONS
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Approved', progress: 100, currentLevel: 'Approved' } : r));
    addNotification(`Bulk approved ${selectedIds.length} requests successfully.`, 'success');
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    setRequests(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: 'Rejected', progress: 0, currentLevel: 'Rejected' } : r));
    addNotification(`Bulk rejected ${selectedIds.length} requests.`, 'warning');
    setSelectedIds([]);
  };

  // CHECKBOX SELECTION HANDLERS
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (filteredData) => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(r => r.id));
    }
  };

  // EXPORT METRICS
  const handleExport = async (format) => {
    addNotification(`Exporting table view to ${format.toUpperCase()}...`, 'info');
    try {
      const data = filteredRequests;
      const columns = [
        { header: 'Document No', key: 'docNo' },
        { header: 'Workflow', key: 'workflow' },
        { header: 'Stage', key: 'currentLevel' },
        { header: 'Requester', key: 'requester' },
        { header: 'Approver', key: 'approver' },
        { header: 'Department', key: 'dept' },
        { header: 'Amount', key: 'amount' },
        { header: 'Date', key: 'date' },
        { header: 'Priority', key: 'priority' },
        { header: 'Status', key: 'status' },
        { header: 'Progress', key: 'progress' },
      ];
      const title = 'Approval Requests';
      switch (format) {
        case 'pdf':
          await exportPdf({ data, columns, title });
          break;
        case 'docx':
          await exportDocx({ data, columns, title });
          break;
        case 'word':
          await exportWord({ data, columns, title });
          break;
        default:
          break;
      }
      addNotification(`Table successfully downloaded.`, 'success');
    } catch (err) {
      addNotification(`Export failed.`, 'error');
    }
  };

  // FILTERED DATA ENGINE
  const getFilteredRequests = () => {
    return requests.filter(r => {
      const matchSearch = searchQuery === '' || 
        r.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDocType = docTypeFilter === 'All' || r.module.toLowerCase() === docTypeFilter.toLowerCase();
      const matchStatus = statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority = priorityFilter === 'All' || r.priority.toLowerCase() === priorityFilter.toLowerCase();

      // Advanced filters
      const matchCompany = advancedParams.company === 'All' || r.company.includes(advancedParams.company);
      const matchDept = advancedParams.department === 'All' || r.dept.includes(advancedParams.department);

      return matchSearch && matchDocType && matchStatus && matchPriority && matchCompany && matchDept;
    });
  };

  const filteredRequests = getFilteredRequests();

  // Dynamic status CSS badges
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success bg-opacity-10 text-success';
      case 'rejected': return 'bg-danger bg-opacity-10 text-danger';
      case 'returned': return 'bg-info bg-opacity-10 text-info';
      case 'escalated': return 'bg-warning bg-opacity-10 text-warning border border-warning';
      case 'pending approval':
      case 'pending': return 'bg-warning bg-opacity-15 text-dark';
      default: return 'bg-light text-dark';
    }
  };

  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #60A5FA 100%)', color: '#fff' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '160px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '400px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-3">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="col-12">
              <div className="p-3 rounded-4" style={{ background: isDark ? '#1F2937' : '#fff', minHeight: '50px' }}>
                <div className="d-flex gap-3 align-items-center">
                  <div className="skeleton-box rounded" style={{ width: '120px', height: '14px', background: isDark ? '#374151' : '#f1f5f9' }} />
                  <div className="skeleton-box rounded" style={{ width: '200px', height: '14px', background: isDark ? '#374151' : '#f1f5f9' }} />
                  <div className="skeleton-box rounded" style={{ width: '100px', height: '14px', background: isDark ? '#374151' : '#f1f5f9' }} />
                  <div className="skeleton-box rounded" style={{ width: '80px', height: '14px', background: isDark ? '#374151' : '#f1f5f9' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-0 pb-5" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO BANNER                                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 pt-4 text-start">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #60A5FA 100%)',
          color: '#FFFFFF'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)' }}></div>
          
          <div className="row align-items-center position-relative z-3">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-25 text-white px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill">
                APPROVAL CENTER
              </span>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6">
                Approval Requests Inbox
              </h1>
              <p className="text-light text-opacity-90 fs-6 mb-4" style={{ maxWidth: '650px' }}>
                Track pending, approved, rejected, cancelled, delegated and escalated finance approval requests from every finance module.
              </p>
              <button 
                className="btn btn-outline-light fw-bold px-4 py-2" 
                style={{ borderRadius: '10px', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(5px)' }}
                onClick={() => setActiveTab('erp_approval_dashboard')}
              >
                Approval Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="pill-tab-nav shadow-sm bg-white p-2 rounded-pill d-inline-flex" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: isDark ? '1px solid #374151' : '1px solid #E2E8F0' }}>
          {navigationTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderRadius: '24px', padding: '8px 18px', fontWeight: '600', fontSize: '13px', border: 'none', transition: 'all 0.2s',
                color: activeTab === tab.id ? '#fff' : (isDark ? '#cbd5e1' : '#4b5563'),
                background: activeTab === tab.id ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SEARCH & FILTERS PANEL                                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small text-muted fw-bold">Search Keywords</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  placeholder="Search Document No, Reference, Notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-3">
              <label className="form-label small text-muted fw-bold">Document Type</label>
              <select className="form-select" value={docTypeFilter} onChange={e => setDocTypeFilter(e.target.value)}>
                <option value="All">All Documents</option>
                <option value="Purchase">Purchase Orders</option>
                <option value="Accounting">Journal Entries</option>
                <option value="Expenses">Expense Claims</option>
                <option value="Loans">Loans & Advances</option>
                <option value="Budgets">Budget Proposals</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3">
              <label className="form-label small text-muted fw-bold">Approval Status</label>
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Returned">Returned</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3">
              <label className="form-label small text-muted fw-bold">Priority</label>
              <select className="form-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3 d-flex gap-2 align-items-end">
              <button className="btn btn-outline-secondary w-100 py-2" onClick={() => setAdvancedOpen(!advancedOpen)}>
                <FontAwesomeIcon icon={faFilter} className="me-1" /> Advanced
              </button>
            </div>
          </div>

          {/* Advanced filter dropdown details */}
          {advancedOpen && (
            <div className="row g-3 mt-3 pt-3 border-top animate-fade-in">
              <div className="col-md-3">
                <label className="form-label small text-muted">Company</label>
                <select className="form-select form-select-sm" value={advancedParams.company} onChange={e => setAdvancedParams({...advancedParams, company: e.target.value})}>
                  <option value="All">All Companies</option>
                  <option>Manage Core Ltd</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Department</label>
                <select className="form-select form-select-sm" value={advancedParams.department} onChange={e => setAdvancedParams({...advancedParams, department: e.target.value})}>
                  <option value="All">All Departments</option>
                  <option>Sourcing & Log</option>
                  <option>Finance & Accounts</option>
                  <option>Sales & BD</option>
                  <option>Marketing & PR</option>
                  <option>Software Engineering</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Project</label>
                <select className="form-select form-select-sm">
                  <option>All Projects</option>
                  <option>Dubai Expo 2026</option>
                  <option>E-Commerce Upgrade</option>
                </select>
              </div>
              <div className="col-md-3 text-end d-flex align-items-end justify-content-end">
                <button className="btn btn-sm btn-light" onClick={() => setAdvancedParams({ company: 'All', department: 'All', project: 'All', costCenter: 'All' })}>Reset Advanced</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* EXPORT PANEL & BULK ACTIONS                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-3 text-start d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="bg-light p-2 rounded-3 border d-flex gap-2 align-items-center animate-fade-in" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <span className="small text-muted fw-bold">{selectedIds.length} selected:</span>
              <button className="btn btn-sm btn-success text-white px-3" onClick={handleBulkApprove}><FontAwesomeIcon icon={faCheckDouble} className="me-1" /> Bulk Approve</button>
              <button className="btn btn-sm btn-danger text-white px-3" onClick={handleBulkReject}><FontAwesomeIcon icon={faXmark} className="me-1" /> Bulk Reject</button>
            </div>
          )}
        </div>

        <div className="d-flex gap-2 align-items-center">
          <span className="small text-muted">Export View:</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('excel')}><FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="text-primary me-1" /> DOCX</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="text-info me-1" /> Word</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('csv')}><FontAwesomeIcon icon={faFileCode} className="text-warning me-1" /> CSV</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleExport('print')}><FontAwesomeIcon icon={faPrint} /> Print</button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* APPROVAL REQUEST TABLE                                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
        <div className="card border-0 shadow-sm p-0 rounded-4 overflow-hidden mb-4" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <div className="table-responsive" style={{ maxHeight: '600px' }}>
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      checked={filteredRequests.length > 0 && selectedIds.length === filteredRequests.length}
                      onChange={() => handleSelectAll(filteredRequests)}
                    />
                  </th>
                  <th>Document</th>
                  <th>Workflow Name</th>
                  <th>Current Stage</th>
                  <th>Requester</th>
                  <th>Assigned Approver</th>
                  <th>Department</th>
                  <th>Total Amount</th>
                  <th>Request Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={selectedIds.includes(r.id)}
                        onChange={() => handleToggleSelect(r.id)}
                      />
                    </td>
                    <td className="fw-bold text-primary font-monospace">{r.docNo}</td>
                    <td>{r.workflow}</td>
                    <td className="text-muted small">{r.currentLevel}</td>
                    <td>{r.requester}</td>
                    <td className="fw-semibold">{r.approver}</td>
                    <td>{r.dept}</td>
                    <td className="fw-bold">{formatCurrency(r.amount)}</td>
                    <td>{r.date}</td>
                    <td>
                      <span className={`priority-badge priority-${r.priority.toLowerCase()}`}>{r.priority}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${getStatusBadgeClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2" style={{ width: '100px' }}>
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${r.progress}%` }}></div>
                        </div>
                        <span className="x-small text-muted font-monospace">{r.progress}%</span>
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-xs btn-light" title="View Details" onClick={() => setSelectedRequest(r)}>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {r.status === 'Pending Approval' && r.approver === 'Admin User' && (
                          <>
                            <button className="btn btn-xs btn-success text-white" title="Approve" onClick={() => handleApproveRequest(r.id)}>
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button className="btn btn-xs btn-danger text-white" title="Reject" onClick={() => handleRejectRequest(r.id)}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center py-5 text-muted">
                      No approval requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* REQUEST DETAILS DRAWER PANEL WITH TIMELINE & DETAILS                   */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className={`drawer-overlay ${selectedRequest ? 'open' : ''}`} onClick={() => setSelectedRequest(null)}></div>
      <div className={`drawer-approvals text-start d-flex flex-column ${selectedRequest ? 'open' : ''}`}>
        {selectedRequest && (
          <>
            <div className="p-4 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-primary text-white font-monospace mb-1">{selectedRequest.docNo}</span>
                <h5 className="fw-bold mb-0 text-slate-800">{selectedRequest.workflow}</h5>
                <span className="small text-muted">{selectedRequest.dept} • Mapped from {selectedRequest.module}</span>
              </div>
              <button className="btn-close" onClick={() => setSelectedRequest(null)}></button>
            </div>

            <div className="p-4 flex-grow-1 overflow-y-auto">
              <div className="mb-4">
                <strong className="d-block mb-1">Filing Justification Reason:</strong>
                <p className="text-muted small">{selectedRequest.notes}</p>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <span className="small text-muted d-block">Requester</span>
                  <strong>{selectedRequest.requester}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Amount Limit</span>
                  <strong className="text-primary">{formatCurrency(selectedRequest.amount)}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Filing Date</span>
                  <strong>{selectedRequest.date}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Due Date Limit</span>
                  <strong>{selectedRequest.dueDate}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Current Assignee</span>
                  <strong>{selectedRequest.approver}</strong>
                </div>
                <div className="col-6">
                  <span className="small text-muted d-block">Priority Level</span>
                  <span className={`priority-badge priority-${selectedRequest.priority.toLowerCase()}`}>{selectedRequest.priority}</span>
                </div>
              </div>

              {/* TIMELINE RENDER */}
              <div className="mb-4">
                <strong className="d-block mb-3">System Approval Timeline:</strong>
                <div className="position-relative ps-4" style={{ borderLeft: '2px dashed #CBD5E1' }}>
                  <div className="mb-3 position-relative">
                    <div className="position-absolute bg-success rounded-circle" style={{ left: '-25px', top: '4px', width: '10px', height: '10px' }} />
                    <span className="small text-muted d-block">Step 1: Submitted (Draft Checked)</span>
                    <strong>Prepared by {selectedRequest.requester} ({selectedRequest.date})</strong>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="position-absolute bg-success rounded-circle" style={{ left: '-25px', top: '4px', width: '10px', height: '10px' }} />
                    <span className="small text-muted d-block">Step 2: Department Manager Audit</span>
                    <strong>Reviewed & Passed by Sarah Jenkins</strong>
                  </div>
                  <div className="mb-3 position-relative">
                    <div className="position-absolute rounded-circle" style={{ left: '-25px', top: '4px', width: '10px', height: '10px', backgroundColor: selectedRequest.status === 'Approved' ? '#10B981' : selectedRequest.status === 'Rejected' ? '#EF4444' : '#F59E0B' }} />
                    <span className="small text-muted d-block">Step 3: Executive CFO Verification</span>
                    <strong>
                      {selectedRequest.status === 'Approved' ? 'Approved & Signed by Admin' : selectedRequest.status === 'Rejected' ? `Rejected: ${selectedRequest.rejectionReason}` : 'Awaiting Review from Admin'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* AI INSIGHTS TRIGGER */}
              <div className="p-3 bg-light rounded-4 border mb-4">
                <h6 className="fw-bold mb-2 small"><FontAwesomeIcon icon={faBolt} className="text-primary me-1" /> AI Approval Insights</h6>
                <ul className="mb-0 pl-3 x-small text-muted">
                  <li>Bottleneck Risk: Low. Average processing SLA for this department is 1.4 Hours.</li>
                  <li>Reconciliation Recommendation: Safe to approve. Mapped budget has 65% remaining buffer.</li>
                </ul>
              </div>

              {selectedRequest.rejectionReason && (
                <div className="alert alert-danger p-2 small">
                  <strong>Rejection Note:</strong> {selectedRequest.rejectionReason}
                </div>
              )}
            </div>

            {selectedRequest.status === 'Pending Approval' && selectedRequest.approver === 'Admin User' && (
              <div className="p-4 border-top bg-light d-flex gap-2">
                <button className="btn btn-success flex-grow-1" onClick={() => handleApproveRequest(selectedRequest.id)}><FontAwesomeIcon icon={faCheck} /> Approve & Sign</button>
                <button className="btn btn-danger flex-grow-1" onClick={() => handleRejectRequest(selectedRequest.id)}><FontAwesomeIcon icon={faXmark} /> Reject</button>
                <button className="btn btn-outline-secondary" title="Return" onClick={() => handleReturnRequest(selectedRequest.id)}><FontAwesomeIcon icon={faUndo} /></button>
                <button className="btn btn-outline-secondary" title="Delegate" onClick={() => handleDelegateRequest(selectedRequest.id)}><FontAwesomeIcon icon={faRightLeft} /></button>
                <button className="btn btn-outline-danger" title="Escalate" onClick={() => handleEscalateRequest(selectedRequest.id)}><FontAwesomeIcon icon={faCircleUp} /></button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default ErpApprovalRequests;
