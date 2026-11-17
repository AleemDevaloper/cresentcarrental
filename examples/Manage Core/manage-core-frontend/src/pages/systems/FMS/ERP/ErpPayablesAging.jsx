import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faEnvelope, faPhone,
  faMapMarkerAlt, faUserCheck, faArrowTrendUp, faShareNodes, faStar, faExpand,
  faMobileAlt, faMessage, faPaperPlane, faTrash, faGears, faLock, faBuilding,
  faFileCsv, faFileWord, faFileAlt, faBrain, faPen, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import DeleteConfirmDialog from '../../../../components/common/DeleteConfirmDialog';
import { EnableDisableButton } from '../../../../components/common';

const ErpPayablesAging = () => {
  const { theme, addNotification, setActiveTab, setEditDocument } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const cardBg = isDark ? '#1F2937' : '#ffffff';
  const inputBg = isDark ? '#111827' : '#ffffff';

  // Filters State
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [sortBy, setSortBy] = useState('Days Overdue');

  // Selected entities for drawers & modals
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, row: null, name: '' });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Today reference date: 2026-07-09
  const referenceDateStr = '2026-07-09';
  const referenceDate = new Date(referenceDateStr);

  // Refresh listener
  useEffect(() => {
    const onRefresh = () => { setCurrentPage(1); };
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const initialPayables = [
    { vendor: 'Microsoft License Sourcing', vendorCode: 'VEN-001', docNo: 'PB-2026-000125', docType: 'Purchase Bill', docDate: '2026-06-20', dueDate: '2026-07-20', balance: 350000, status: 'Pending', collStatus: 'On Hold', category: 'Software', email: 'licensing@microsoft.local', phone: '+1 800 6427676', creditLimit: 5000000, creditUsed: 1200000, bankAccount: 'HBL - 10029302-3', currency: 'PKR' },
    { vendor: 'Dell Global Infrastructure', vendorCode: 'VEN-108', docNo: 'PINV-00458', docType: 'Purchase Bill', docDate: '2026-05-15', dueDate: '2026-06-15', balance: 480000, status: 'Overdue', collStatus: 'Urgent', category: 'Hardware', email: 'enterprise@dell.local', phone: '+1 800 4339005', creditLimit: 8000000, creditUsed: 4800000, bankAccount: 'SCB - 99201920-1', currency: 'PKR' },
    { vendor: 'Oracle Cloud Services', vendorCode: 'VEN-245', docNo: 'OB-2026', docType: 'Opening Balance', docDate: '2026-01-01', dueDate: '2026-01-01', balance: 280000, status: 'Overdue', collStatus: 'Critical', category: 'Cloud', email: 'cloud-billing@oracle.local', phone: '+1 800 2231920', creditLimit: 3000000, creditUsed: 280000, bankAccount: 'Citi - 3829102-4', currency: 'PKR' },
    { vendor: 'Local Stationary Vendors', vendorCode: 'VEN-045', docNo: 'JV-000083', docType: 'Journal Entry', docDate: '2026-07-02', dueDate: '2026-08-02', balance: 12000, status: 'Pending', collStatus: 'Normal', category: 'Admin', email: 'stationary@localsuppliers.pk', phone: '+92 300 8887776', creditLimit: 200000, creditUsed: 12000, bankAccount: 'Meezan - 882912-3', currency: 'PKR' },
    { vendor: 'Synergy Consultancies', vendorCode: 'VEN-220', docNo: 'PB-2026-000245', docType: 'Purchase Bill', docDate: '2026-04-10', dueDate: '2026-05-10', balance: 650000, status: 'Overdue', collStatus: 'High Priority', category: 'Consulting', email: 'finance@synergy.pk', phone: '+92 423 5556667', creditLimit: 2000000, creditUsed: 650000, bankAccount: 'UBL - 772910-1', currency: 'PKR' }
  ];

  const [payables, setPayables] = useState(initialPayables);

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

  // Helper date conversions
  const getDaysOverdue = (dueDateStr) => {
    const due = new Date(dueDateStr);
    const diffTime = referenceDate - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getAgingBucket = (days) => {
    if (days === 0) return 'Current';
    if (days >= 1 && days <= 30) return '1–30';
    if (days >= 31 && days <= 60) return '31–60';
    if (days >= 61 && days <= 90) return '61–90';
    return '90+';
  };

  const getBucketBadgeStyle = (bucket) => {
    switch (bucket) {
      case 'Current': return { bg: isDark ? 'rgba(107, 114, 128, 0.2)' : '#e5e7eb', text: '#4b5563' };
      case '1–30': return { bg: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', text: '#2563eb' };
      case '31–60': return { bg: isDark ? 'rgba(234, 179, 8, 0.2)' : '#fef9c3', text: '#ca8a04' };
      case '61–90': return { bg: isDark ? 'rgba(249, 115, 22, 0.2)' : '#ffedd5', text: '#ea580c' };
      default: return { bg: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', text: '#dc2626' };
    }
  };

  // Computed and filtered list
  const computedList = useMemo(() => {
    let list = payables.map(item => {
      const daysOverdue = getDaysOverdue(item.dueDate);
      const bucket = getAgingBucket(daysOverdue);
      return {
        ...item,
        daysOverdue,
        bucket
      };
    });

    // Filtering
    list = list.filter(item => {
      const matchesSearch = item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || item.vendorCode.includes(searchTerm) || item.docNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVendor = selectedVendorFilter === 'All' || item.vendor === selectedVendorFilter;
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesMin = minBalance === '' || item.balance >= parseFloat(minBalance);
      const matchesMax = maxBalance === '' || item.balance <= parseFloat(maxBalance);
      const matchesOverdue = !onlyOverdue || item.daysOverdue > 0;

      return matchesSearch && matchesVendor && matchesCategory && matchesMin && matchesMax && matchesOverdue;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'Days Overdue') return b.daysOverdue - a.daysOverdue;
      if (sortBy === 'Balance') return b.balance - a.balance;
      if (sortBy === 'Vendor') return a.vendor.localeCompare(b.vendor);
      if (sortBy === 'Document Date') return new Date(b.docDate) - new Date(a.docDate);
      return 0;
    });

    return list;
  }, [searchTerm, selectedVendorFilter, categoryFilter, minBalance, maxBalance, onlyOverdue, sortBy, payables]);

  // Buckets Summary
  const totals = useMemo(() => {
    let current = 0, b1_30 = 0, b31_60 = 0, b61_90 = 0, b90Plus = 0, total = 0;
    computedList.forEach(item => {
      total += item.balance;
      if (item.bucket === 'Current') current += item.balance;
      else if (item.bucket === '1–30') b1_30 += item.balance;
      else if (item.bucket === '31–60') b31_60 += item.balance;
      else if (item.bucket === '61–90') b61_90 += item.balance;
      else b90Plus += item.balance;
    });

    return { current, b1_30, b31_60, b61_90, b90Plus, total };
  }, [computedList]);

  // Unique vendor names for dropdown
  const vendorNames = useMemo(() => {
    return Array.from(new Set(payables.map(item => item.vendor)));
  }, [payables]);

  const handleViewClick = (row) => setViewItem(row);

  const handleEditClick = (row) => {
    setEditDocument?.({ ...row, documentType: 'payable_aging' });
    setActiveTab?.('erp_create_purchase_order');
  };

  const handleDeleteClick = (row) => {
    setDeleteDialog({ show: true, id: row.docNo, row, name: `${row.vendor} (${row.docNo})` });
  };

  const handleDeleteConfirm = () => {
    setPayables(prev => prev.filter(item => item.docNo !== deleteDialog.id));
    addNotification('Payable entry moved to trash.', 'success');
    setDeleteDialog({ show: false, id: null, row: null, name: '' });
  };

  const handleMoveToDraft = (row) => {
    setPayables(prev => prev.map(item => item.docNo === row.docNo ? { ...item, status: 'Draft' } : item));
    addNotification(`${row.vendor} (${row.docNo}) moved to Draft.`, 'success');
  };

  const handleAction = (msg) => addNotification(msg, 'info');

  const getStatusBadgeStyle = (status) => {
    const map = {
      Pending: { bg: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      Overdue: { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Paid: { bg: isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
    };
    return map[status] || { bg: isDark ? 'rgba(148, 163, 184, 0.15)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' };
  };

  const columns = [
    { key: 'vendor', label: 'Vendor', render: (val, row) => (
      <div>
        <button className="btn btn-link p-0 fw-bold text-start text-decoration-none text-primary" onClick={() => setSelectedVendor(row)}>{val}</button>
        <div className="x-small text-muted font-monospace">{row.vendorCode}</div>
      </div>
    )},
    { key: 'docNo', label: 'Document', render: (val, row) => (
      <div>
        <span className="fw-semibold" style={{ color: textColor }}>{val}</span>
        <div className="x-small text-muted">{row.docType}</div>
      </div>
    )},
    { key: 'docDate', label: 'Doc Date', render: (val) => <span className="small">{new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
    { key: 'dueDate', label: 'Due Date', render: (val) => <span className="small">{new Date(val).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
    { key: 'daysOverdue', label: 'Days Overdue', align: 'center', render: (val) => <span className="font-monospace small fw-bold">{val}</span> },
    { key: 'bucket', label: 'Bucket', align: 'center', render: (val) => {
      const bucketStyle = getBucketBadgeStyle(val);
      return <span className="badge rounded-pill" style={{ backgroundColor: bucketStyle.bg, color: bucketStyle.text, fontSize: '11px', padding: '5px 10px' }}>{val}</span>;
    }},
    { key: 'status', label: 'Status', render: (val) => {
      const badge = getStatusBadgeStyle(val);
      return <span className="badge rounded-pill" style={{ backgroundColor: badge.bg, color: badge.color, fontSize: '11px', padding: '5px 10px' }}>{val}</span>;
    }},
    { key: 'balance', label: 'Balance', align: 'end', render: (val, row) => <span className={`fw-bold ${row.bucket === '90+' ? 'text-danger' : ''}`}>Rs {val.toLocaleString()}</span> },
    { key: 'actions', label: '', align: 'end', render: (val, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm border-0" title="View" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleViewClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#06b6d410'; e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button className="btn btn-sm border-0" title="Edit" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleEditClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faPen} />
        </button>
        <button className="btn btn-sm border-0" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => handleExport('pdf')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0" title="Move to Draft" style={{ borderRadius: '8px', color: isDark ? '#f59e0b' : '#d97706', background: 'transparent', padding: '4px 8px' }} onClick={() => handleMoveToDraft(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b10'; e.currentTarget.style.color = '#f59e0b'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#f59e0b' : '#d97706'; }}>
          <FontAwesomeIcon icon={faFileSignature} />
        </button>
        <button className="btn btn-sm border-0" title="Delete" style={{ borderRadius: '8px', color: isDark ? '#f87171' : '#dc2626', background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#f87171' : '#dc2626'; }}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    )},
  ];

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const data = computedList;
    const cols = [
      { key: 'vendor', label: 'Vendor' }, { key: 'docNo', label: 'Document' },
      { key: 'docDate', label: 'Doc Date' }, { key: 'dueDate', label: 'Due Date' },
      { key: 'daysOverdue', label: 'Days Overdue' }, { key: 'bucket', label: 'Bucket' },
      { key: 'balance', label: 'Balance' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'payables_aging.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'payables_aging.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'pdf') { await exportPdf({ data, cols, title: 'Payables Aging', filename: 'payables_aging.pdf' }); }
    else if (type === 'docx') { await exportDocx({ data, cols, title: 'Payables Aging', filename: 'payables_aging.docx' }); }
    else if (type === 'word') { await exportWord({ data, cols, title: 'Payables Aging', filename: 'payables_aging.doc' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start animate-fade-in" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} className="mb-4" />
          <div className="row g-3 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="col"><div style={{ height: 90, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            ))}
          </div>
          <div style={{ height: 400, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 pb-5 text-start animate-fade-in" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* PAGE HEADER */}
      <ErpReportHeader
        title="Payables Aging"
        badge="Accounting / ERP"
        description="Open posted purchase bills and vendor opening balances grouped by overdue age buckets for Accounts Payable management and payment planning."
        isDark={isDark}
        activeTabId="ap_aging"
        onTabClick={handleTabClick}
      />

      <div className="container-fluid px-4 px-lg-5">
        
        {/* FILTER SECTION */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
              AP Extraction & Filtering Parameters
            </h6>
            <div className="status-badge-container py-1 px-3 bg-light rounded-pill border">
              <span className="small text-muted font-monospace">Validation Status: Passed</span>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label x-small text-muted fw-semibold">Vendor Filter</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={selectedVendorFilter} onChange={e => setSelectedVendorFilter(e.target.value)}>
                <option value="All">All Vendors</option>
                {vendorNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label x-small text-muted fw-semibold">Vendor Category</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Cloud">Cloud</option>
                <option value="Admin">Admin</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label x-small text-muted fw-semibold">Min Balance</label>
              <input type="number" className="form-control form-control-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Min Amount" value={minBalance} onChange={e => setMinBalance(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label x-small text-muted fw-semibold">Max Balance</label>
              <input type="number" className="form-control form-control-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Max Amount" value={maxBalance} onChange={e => setMaxBalance(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label x-small text-muted fw-semibold">Sort Criteria</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="Days Overdue">Days Overdue</option>
                <option value="Balance">Highest Balance</option>
                <option value="Vendor">Vendor A-Z</option>
                <option value="Document Date">Document Date</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 flex-wrap gap-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setSelectedVendorFilter('All'); setSearchTerm(''); setMinBalance(''); setMaxBalance(''); setCategoryFilter('All'); setOnlyOverdue(false); }}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => handleAction('Report reloaded successfully.')}>Run Report</button>
              <div className="ms-3">
                <EnableDisableButton checked={onlyOverdue} onClick={() => setOnlyOverdue(!onlyOverdue)} label="Overdue Only" />
              </div>
            </div>
            <div className="d-flex gap-2">
              <div className="dropdown d-inline-block">
                <button className="btn btn-sm btn-light border dropdown-toggle" style={{ color: textColor }} data-bs-toggle="dropdown">
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
            </div>
          </div>
        </div>

        {/* AGING SUMMARY CARDS */}
        <div className="row g-3 mb-4">
          <ErpKpiCard label="Current" value={`Rs ${totals.current.toLocaleString()}`} icon={faCoins} color="#64748b" isDark={isDark} />
          <ErpKpiCard label="1–30 Days" value={`Rs ${totals.b1_30.toLocaleString()}`} icon={faClock} color="#3B82F6" isDark={isDark} />
          <ErpKpiCard label="31–60 Days" value={`Rs ${totals.b31_60.toLocaleString()}`} icon={faClock} color="#EAB308" isDark={isDark} />
          <ErpKpiCard label="61–90 Days" value={`Rs ${totals.b61_90.toLocaleString()}`} icon={faClock} color="#F97316" isDark={isDark} />
          <ErpKpiCard label="90+ Days" value={`Rs ${totals.b90Plus.toLocaleString()}`} icon={faClock} color="#EF4444" isDark={isDark} badge="Critical Risk" />
        </div>

        {/* AI RECOMMENDATION BANNER */}
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderLeft: '4px solid #8b5cf6', background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <div>
                <div className="fw-bold small" style={{ color: textColor }}>AI Payables Intelligence</div>
                <div style={{ color: mutedColor, fontSize: '0.75rem' }}>2 vendors with overdue balances exceeding 60 days. Prioritize Oracle Cloud Services (Rs 280,000) and Synergy Consultancies (Rs 650,000) for settlement to avoid credit deterioration.</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="row g-4">
          
          {/* LEFT: TABLE OF PAYABLES */}
          <div className="col-lg-8">
            <ErpDataTable
              columns={columns}
              data={computedList.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)}
              loading={false}
              searchable
              searchTerm={searchTerm}
              onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
              searchPlaceholder="Quick search vendor/doc..."
              isDark={isDark}
              title="Outstanding Payable Bills"
              titleIcon={faFileInvoice}
              emptyMessage="No outstanding payables found."
              emptyIcon={faFileInvoice}
              currentPage={currentPage}
              entriesPerPage={entriesPerPage}
              totalEntries={computedList.length}
              onEntriesPerPageChange={(val) => { setEntriesPerPage(val); setCurrentPage(1); }}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* RIGHT: PAYMENT SUMMARY PANEL */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} className="text-primary fs-5" />
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>AP Payment Console</h6>
              </div>
              <p className="text-muted small mb-4">Select a vendor name from the table to load accounts payable details, credit metrics and schedule transfers.</p>

              {selectedVendor ? (
                <div>
                  <div className="pb-3 border-bottom mb-3">
                    <h5 className="fw-bold mb-1" style={{ color: textColor }}>{selectedVendor.vendor}</h5>
                    <span className="font-monospace text-muted small">{selectedVendor.vendorCode} • {selectedVendor.category}</span>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-2 border rounded text-center">
                        <span className="x-small text-muted d-block">Credit Limit</span>
                        <strong className="small" style={{ color: textColor }}>Rs {selectedVendor.creditLimit.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 border rounded text-center">
                        <span className="x-small text-muted d-block">Credit Used</span>
                        <strong className="small" style={{ color: textColor }}>Rs {selectedVendor.creditUsed.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pb-3 border-bottom mb-3 text-start">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Outstanding balance</span>
                      <strong className="small" style={{ color: textColor }}>Rs {selectedVendor.balance.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Account Status</span>
                      <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded">{selectedVendor.collStatus}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Bank Account</span>
                      <span className="small font-monospace" style={{ color: textColor }}>{selectedVendor.bankAccount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="small text-muted">Days Overdue</span>
                      <span className="small fw-bold text-danger">{selectedVendor.daysOverdue} Days</span>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button className="btn btn-sm btn-primary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Scheduled payment transfer details generated.')}>
                      <FontAwesomeIcon icon={faCoins} />
                      Record / Schedule Payment
                    </button>
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Emailed vendor transaction details.')}>
                      <FontAwesomeIcon icon={faEnvelope} />
                      Email Supplier
                    </button>
                    <button className="btn btn-sm btn-light border text-danger d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Payment approved and released.')}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Approve Payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <FontAwesomeIcon icon={faUser} className="fs-1 mb-3 text-light" />
                  <p className="small mb-0">Select a vendor to load information.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DRILLDOWN DRAWERS & MODALS */}

      {/* 1. Vendor Ledger Drilldown Drawer */}
      {selectedVendor && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '55%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Vendor Statement Profile</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedVendor.vendor} Statement</h5>
              <span className="small text-muted font-monospace">{selectedVendor.vendorCode} • Category: {selectedVendor.category}</span>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedVendor(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {/* KPI Cards inside Drawer */}
            <div className="row g-2 mb-3">
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Outstanding</span>
                  <strong className="small" style={{ color: textColor }}>Rs {selectedVendor.balance.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Credit Limit</span>
                  <strong className="small text-primary">Rs {selectedVendor.creditLimit.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Days Overdue</span>
                  <strong className="small text-danger">{selectedVendor.daysOverdue} Days</strong>
                </div>
              </div>
            </div>

            {/* List Activity */}
            <div className="table-responsive">
              <table className="table table-sm align-middle" style={{ color: textColor }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <th style={{ color: mutedColor }}>Date</th>
                    <th style={{ color: mutedColor }}>Doc Type</th>
                    <th style={{ color: mutedColor }}>Reference</th>
                    <th style={{ color: mutedColor }} className="text-end">Debit</th>
                    <th style={{ color: mutedColor }} className="text-end">Credit</th>
                    <th style={{ color: mutedColor }} className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td className="small">{selectedVendor.docDate}</td>
                    <td><span className="small fw-semibold">{selectedVendor.docType}</span></td>
                    <td className="font-monospace small text-primary">{selectedVendor.docNo}</td>
                    <td className="text-end">-</td>
                    <td className="text-end">Rs {selectedVendor.balance.toLocaleString()}</td>
                    <td className="text-end fw-bold">Rs {selectedVendor.balance.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAction('Supplier statement emailed successfully.')}><FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email Supplier</button>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleAction('Printed supplier statement PDF.')}><FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleAction('Exported statement to Excel.')}><FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Document Preview Modal */}
      {selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ backgroundColor: cardBg, color: textColor }}>
              <div className="modal-header border-bottom" style={{ borderColor: borderColor }}>
                <h5 className="modal-title fw-bold">Document Preview: {selectedDocument.docNo}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedDocument(null)} style={{ filter: isDark ? 'invert(1)' : 'none' }}></button>
              </div>
              <div className="modal-body text-start">
                <div className="mb-3">
                  <label className="fw-semibold text-muted small d-block">Vendor</label>
                  <span>{selectedDocument.vendor} ({selectedDocument.vendorCode})</span>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="fw-semibold text-muted small d-block">Document Type</label>
                    <span>{selectedDocument.docType}</span>
                  </div>
                  <div className="col-6">
                    <label className="fw-semibold text-muted small d-block">Document Date</label>
                    <span>{selectedDocument.docDate}</span>
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="fw-semibold text-muted small d-block">Due Date</label>
                    <span>{selectedDocument.dueDate}</span>
                  </div>
                  <div className="col-6">
                    <label className="fw-semibold text-muted small d-block">Days Overdue</label>
                    <span className="text-danger fw-bold">{selectedDocument.daysOverdue} Days</span>
                  </div>
                </div>
                <div className="mb-3 p-3 rounded bg-light" style={{ border: `1px solid ${borderColor}` }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="text-slate-800">Outstanding Balance</strong>
                    <h4 className="fw-bold text-primary mb-0">Rs {selectedDocument.balance.toLocaleString()}</h4>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top" style={{ borderColor: borderColor }}>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDocument(null)}>Close</button>
                <button className="btn btn-sm btn-primary" onClick={() => handleAction('Opening record payment workspace.') + setSelectedDocument(null)}>Schedule Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. View Item Preview Modal */}
      {viewItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4" style={{ backgroundColor: cardBg, color: textColor }}>
              <div className="modal-header border-bottom" style={{ borderColor: borderColor }}>
                <div>
                  <h5 className="modal-title fw-bold">Payable Entry Details</h5>
                  <span className="small text-muted font-monospace">{viewItem.docNo}</span>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewItem(null)} style={{ filter: isDark ? 'invert(1)' : 'none' }}></button>
              </div>
              <div className="modal-body text-start">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="fw-semibold text-muted small d-block mb-1">Vendor</label>
                    <span className="fw-bold">{viewItem.vendor}</span>
                    <div className="x-small text-muted font-monospace">{viewItem.vendorCode}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="fw-semibold text-muted small d-block mb-1">Status</label>
                    {(() => { const badge = getStatusBadgeStyle(viewItem.status); return <span className="badge rounded-pill" style={{ backgroundColor: badge.bg, color: badge.color }}>{viewItem.status}</span>; })()}
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Document Type</label>
                    <span>{viewItem.docType}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Document Date</label>
                    <span>{viewItem.docDate}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Due Date</label>
                    <span>{viewItem.dueDate}</span>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Days Overdue</label>
                    <span className="text-danger fw-bold">{viewItem.daysOverdue} Days</span>
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Bucket</label>
                    {(() => { const bs = getBucketBadgeStyle(viewItem.bucket); return <span className="badge rounded-pill" style={{ backgroundColor: bs.bg, color: bs.color }}>{viewItem.bucket}</span>; })()}
                  </div>
                  <div className="col-md-4">
                    <label className="fw-semibold text-muted small d-block mb-1">Category</label>
                    <span>{viewItem.category}</span>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff', border: `1px solid ${borderColor}` }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Outstanding Balance</strong>
                        <h4 className="fw-bold text-primary mb-0">Rs {viewItem.balance.toLocaleString()}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top d-flex justify-content-between" style={{ borderColor: borderColor }}>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { handleEditClick(viewItem); setViewItem(null); }}><FontAwesomeIcon icon={faPen} className="me-1" /> Edit</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { handleExport('pdf'); }}><FontAwesomeIcon icon={faFilePdf} className="me-1" /> PDF</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { addNotification('Email dispatched.', 'success'); }}><FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email</button>
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setViewItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, row: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this payable entry to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name}
        confirmLabel="Move to Trash"
      />

    </div>
  );
};

export default ErpPayablesAging;
