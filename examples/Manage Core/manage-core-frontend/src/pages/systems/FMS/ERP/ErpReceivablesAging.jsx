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
  faMobileAlt, faMessage, faPaperPlane, faTrash, faGears, faFileCsv, faFileWord, faFileAlt,
  faBrain, faTrashCan, faEdit, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import { DeleteConfirmDialog, EnableDisableButton } from '../../../../components/common';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpReceivablesAging = () => {
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
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [sortBy, setSortBy] = useState('Days Overdue');

  // Selected entities for drawers & modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  // Today reference date: 2026-07-09
  const referenceDateStr = '2026-07-09';
  const referenceDate = new Date(referenceDateStr);

  const [receivables, setReceivables] = useState(initialReceivables);

  const initialReceivables = [
    { id: 1, customer: 'Al-Rahim Enterprises', customerCode: 'CUS-115', docNo: 'INV-2026-00125', docType: 'Sales Invoice', docDate: '2026-06-15', dueDate: '2026-07-15', balance: 150000, status: 'Pending', collStatus: 'Reminder Sent', region: 'Punjab', email: 'info@alrahim.com', phone: '+92 300 1234567', creditLimit: 2000000, creditUsed: 850000 },
    { id: 2, customer: 'Apex Software Systems', customerCode: 'CUS-104', docNo: 'INV-2026-00104', docType: 'Sales Invoice', docDate: '2026-05-10', dueDate: '2026-06-10', balance: 320000, status: 'Overdue', collStatus: 'Follow-up Required', region: 'Sindh', email: 'billing@apexsys.com', phone: '+92 213 9998888', creditLimit: 1500000, creditUsed: 1200000 },
    { id: 3, customer: 'Bin-Naseer Distributors', customerCode: 'CUS-099', docNo: 'OB-2026', docType: 'Opening Balance', docDate: '2026-01-01', dueDate: '2026-01-01', balance: 45000, status: 'Overdue', collStatus: 'Payment Promise', region: 'KPK', email: 'accounts@bnaseer.pk', phone: '+92 333 7776665', creditLimit: 500000, creditUsed: 385000 },
    { id: 4, customer: 'Capital Logistics Corp', customerCode: 'CUS-084', docNo: 'INV-2026-00084', docType: 'Sales Invoice', docDate: '2026-04-12', dueDate: '2026-05-12', balance: 950000, status: 'Overdue', collStatus: 'Escalated', region: 'Federal', email: 'finance@caplogistics.pk', phone: '+92 312 9993333', creditLimit: 3000000, creditUsed: 1300000 },
    { id: 5, customer: 'Delta Traders Ltd', customerCode: 'CUS-073', docNo: 'DBN-00018', docType: 'Debit Note', docDate: '2026-07-01', dueDate: '2026-07-31', balance: 85000, status: 'Pending', collStatus: 'Pending', region: 'Balochistan', email: 'deltaptraders@gmail.com', phone: '+92 321 8887776', creditLimit: 800000, creditUsed: 85000 },
    { id: 6, customer: 'Echo Manufacturing', customerCode: 'CUS-062', docNo: 'INV-2026-00062', docType: 'Sales Invoice', docDate: '2026-07-05', dueDate: '2026-08-05', balance: 500000, status: 'Pending', collStatus: 'Pending', region: 'Punjab', email: 'accounts@echomfg.com', phone: '+92 301 9876543', creditLimit: 2500000, creditUsed: 500000 },
    { id: 7, customer: 'Falcon Logistics', customerCode: 'CUS-051', docNo: 'JV-000083', docType: 'Journal Entry', docDate: '2026-03-20', dueDate: '2026-04-20', balance: 180000, status: 'Overdue', collStatus: 'Customer Contacted', region: 'Sindh', email: 'logistics@falcon.com', phone: '+92 213 1112222', creditLimit: 1000000, creditUsed: 450000 }
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
    let list = receivables.map(item => {
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
      const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) || item.customerCode.includes(searchTerm) || item.docNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCustomer = selectedCustomerFilter === 'All' || item.customer === selectedCustomerFilter;
      const matchesRegion = regionFilter === 'All' || item.region === regionFilter;
      const matchesMin = minBalance === '' || item.balance >= parseFloat(minBalance);
      const matchesMax = maxBalance === '' || item.balance <= parseFloat(maxBalance);
      const matchesOverdue = !onlyOverdue || item.daysOverdue > 0;

      return matchesSearch && matchesCustomer && matchesRegion && matchesMin && matchesMax && matchesOverdue;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'Days Overdue') return b.daysOverdue - a.daysOverdue;
      if (sortBy === 'Balance') return b.balance - a.balance;
      if (sortBy === 'Customer') return a.customer.localeCompare(b.customer);
      if (sortBy === 'Document Date') return new Date(b.docDate) - new Date(a.docDate);
      return 0;
    });

    return list;
  }, [searchTerm, selectedCustomerFilter, regionFilter, minBalance, maxBalance, onlyOverdue, sortBy, receivables]);

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

  // Mock list of all unique customer names for dropdown
  const customerNames = useMemo(() => {
    return Array.from(new Set(receivables.map(item => item.customer)));
  }, [receivables]);

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
      { key: 'customer', label: 'Customer' }, { key: 'docNo', label: 'Document' },
      { key: 'docDate', label: 'Doc Date' }, { key: 'dueDate', label: 'Due Date' },
      { key: 'daysOverdue', label: 'Days Overdue' }, { key: 'bucket', label: 'Bucket' },
      { key: 'balance', label: 'Balance' },
    ];
    const headers = cols.map(c => c.label);
    const rows = data.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'receivables_aging.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'receivables_aging.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { await exportDocx({ title: 'Receivables Aging Report', headers, rows, filename: 'receivables_aging.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Receivables Aging Report', headers, rows, filename: 'receivables_aging.doc' }); }
    else if (type === 'pdf') { await exportPdf({ title: 'Receivables Aging Report', headers, rows, filename: 'receivables_aging.pdf' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const handleAction = (msg) => {
    addNotification?.(msg, 'info');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'receivable_aging' });
    setActiveTab?.('erp_create_sales_invoice');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.id, name: `${row.docNo} - ${row.customer}` });

  const handleDeleteConfirm = () => {
    setReceivables(prev => prev.filter(item => item.id !== deleteDialog.id));
    addNotification?.('Receivable entry moved to trash.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const handleMoveToDraft = (row) => {
    setReceivables(prev => prev.map(item => item.id === row.id ? { ...item, status: 'Draft' } : item));
    addNotification?.(`${row.docNo} moved to Draft.`, 'success');
  };

  const handleRecordPayment = (row) => {
    addNotification?.('Recorded Payment voucher for customer.', 'success');
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
        title="Receivables Aging"
        badge="Accounting / ERP"
        description="Open posted invoices plus customer opening balances grouped by overdue age buckets for AR collection follow-up."
        isDark={isDark}
        activeTabId="ar_aging"
        onTabClick={handleTabClick}
      />

      <div className="container-fluid px-4 px-lg-5">
        
        {/* FILTER SECTION */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
              AR Extraction & Filtering Parameters
            </h6>
            <div className="status-badge-container py-1 px-3 bg-light rounded-pill border">
              <span className="small text-muted font-monospace">Validation Status: Passed</span>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label x-small text-muted fw-semibold">Customer Filter</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={selectedCustomerFilter} onChange={e => setSelectedCustomerFilter(e.target.value)}>
                <option value="All">All Customers</option>
                {customerNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label x-small text-muted fw-semibold">Region</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                <option value="All">All Regions</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Federal">Federal</option>
                <option value="Balochistan">Balochistan</option>
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
                <option value="Customer">Customer A-Z</option>
                <option value="Document Date">Document Date</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 flex-wrap gap-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { setSelectedCustomerFilter('All'); setSearchTerm(''); setMinBalance(''); setMaxBalance(''); setRegionFilter('All'); setOnlyOverdue(false); }}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => handleAction('Report updated instantly.')}>Filter</button>
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
                  <li><button className="dropdown-item" onClick={() => handleExport('docx')}><FontAwesomeIcon icon={faFileWord} className="me-2" />DOCX</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExport('word')}><FontAwesomeIcon icon={faFileAlt} className="me-2" />WORD</button></li>
                  <li><button className="dropdown-item" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="me-2" />PDF</button></li>
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

        {/* AI COLLECTION INTELLIGENCE BANNER */}
        <div className="card border-0 shadow-sm p-3 rounded-4 mb-4" style={{ background: isDark ? 'rgba(139,92,246,0.12)' : '#f5f3ff', borderLeft: '4px solid #8b5cf6' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8b5cf620', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: textColor }}>AI Collection Intelligence</div>
              <div className="small" style={{ color: mutedColor }}>Capital Logistics Corp and 2 other accounts exceed their credit utilization threshold. Prioritize follow-ups on invoices past 60 days to improve Days Sales Outstanding.</div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="row g-4">
          
          {/* LEFT: TABLE OF RECEIVABLES */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg, minHeight: '500px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Outstanding Receivable Items</h6>
                <div className="d-flex align-items-center gap-2">
                  <input type="text" className="form-control form-control-sm" style={{ width: '220px', backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Quick search customer/doc..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAction('Re-fetched live accounting postings.')}><FontAwesomeIcon icon={faRefresh} /></button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle" style={{ color: textColor }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                      <th style={{ color: mutedColor }}>Customer</th>
                      <th style={{ color: mutedColor }}>Document</th>
                      <th style={{ color: mutedColor }}>Doc Date</th>
                      <th style={{ color: mutedColor }}>Due Date</th>
                      <th style={{ color: mutedColor }} className="text-center">Days Overdue</th>
                      <th style={{ color: mutedColor }} className="text-center">Bucket</th>
                      <th style={{ color: mutedColor }} className="text-end">Balance</th>
                      <th style={{ color: mutedColor }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-5 text-muted">
                          <div className="mb-2">No outstanding receivables found.</div>
                          <span className="small">All customer balances are fully settled for the selected filters.</span>
                        </td>
                      </tr>
                    ) : (
                      computedList.map((row, idx) => {
                        const days = row.daysOverdue;
                        let rowBg = '';
                        if (row.bucket === '1–30') rowBg = isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.02)';
                        else if (row.bucket === '31–60') rowBg = isDark ? 'rgba(234, 179, 8, 0.08)' : 'rgba(234, 179, 8, 0.02)';
                        else if (row.bucket === '61–90') rowBg = isDark ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.02)';
                        else if (row.bucket === '90+') rowBg = isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.02)';

                        const bucketStyle = getBucketBadgeStyle(row.bucket);

                        return (
                          <tr key={idx} style={{ backgroundColor: rowBg, borderBottom: `1px solid ${borderColor}` }}>
                            <td>
                              <button className="btn btn-link p-0 fw-bold text-start text-decoration-none text-primary" onClick={() => setSelectedCustomer(row)}>
                                {row.customer}
                              </button>
                            </td>
                            <td>
                              <button className="btn btn-link p-0 text-start text-decoration-none text-slate-700 fw-semibold" onClick={() => setSelectedDocument(row)}>
                                {row.docNo}
                              </button>
                              <div className="x-small text-muted">{row.docType}</div>
                            </td>
                            <td className="small">{new Date(row.docDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="small">{new Date(row.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="text-center font-monospace small fw-bold">{days}</td>
                            <td className="text-center">
                              <span className="badge rounded-pill" style={{ backgroundColor: bucketStyle.bg, color: bucketStyle.text, fontSize: '11px', padding: '5px 10px' }}>
                                {row.bucket}
                              </span>
                            </td>
                            <td className={`text-end fw-bold ${row.bucket === '90+' ? 'text-danger' : 'text-slate-800'}`}>
                              Rs {row.balance.toLocaleString()}
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-1">
                                <button className="btn btn-sm border-0" title="Edit" style={{ color: mutedColor }} onClick={() => handleEdit(row)}><FontAwesomeIcon icon={faEdit} /></button>
                                <button className="btn btn-sm border-0" title="Move to Draft" style={{ color: mutedColor }} onClick={() => handleMoveToDraft(row)}><FontAwesomeIcon icon={faFileSignature} /></button>
                                <button className="btn btn-sm border-0" title="Record Payment" style={{ color: '#10b981' }} onClick={() => handleRecordPayment(row)}><FontAwesomeIcon icon={faCoins} /></button>
                                <button className="btn btn-sm border-0" title="Move to Trash" style={{ color: '#f43f5e' }} onClick={() => handleDeleteClick(row)}><FontAwesomeIcon icon={faTrashCan} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}

                    {computedList.length > 0 && (
                      <tr className="fw-bold" style={{ borderTop: `2px solid ${borderColor}` }}>
                        <td colSpan={2}>Grand Total</td>
                        <td colSpan={5} className="text-end text-muted small">Total Outstanding Balance:</td>
                        <td className="text-end text-primary" style={{ fontSize: '1.05rem' }}>
                          Rs {totals.total.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT: COLLECTION SUMMARY PANEL */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} className="text-primary fs-5" />
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>AR Collection Console</h6>
              </div>
              <p className="text-muted small mb-4">Select a customer hyperlink from the table to load credit governance limits and trigger fast follow-up notifications.</p>

              {selectedCustomer ? (
                <div>
                  <div className="pb-3 border-bottom mb-3">
                    <h5 className="fw-bold mb-1" style={{ color: textColor }}>{selectedCustomer.customer}</h5>
                    <span className="font-monospace text-muted small">{selectedCustomer.customerCode} • {selectedCustomer.region}</span>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-2 border rounded text-center">
                        <span className="x-small text-muted d-block">Credit Limit</span>
                        <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.creditLimit.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 border rounded text-center">
                        <span className="x-small text-muted d-block">Credit Used</span>
                        <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.creditUsed.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pb-3 border-bottom mb-3 text-start">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Outstanding balance</span>
                      <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.balance.toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Collection Status</span>
                      <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded">{selectedCustomer.collStatus}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="small text-muted">Days Overdue</span>
                      <span className="small fw-bold text-danger">{selectedCustomer.daysOverdue} Days</span>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button className="btn btn-sm btn-primary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Recorded Payment voucher for customer.')}>
                      <FontAwesomeIcon icon={faCoins} />
                      Record Payment
                    </button>
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Follow-up reminder sent to ' + selectedCustomer.email)}>
                      <FontAwesomeIcon icon={faEnvelope} />
                      Send Email Reminder
                    </button>
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('WhatsApp follow-up statement pushed.')}>
                      <FontAwesomeIcon icon={faMessage} />
                      WhatsApp statement
                    </button>
                    <button className="btn btn-sm btn-light border text-danger d-flex align-items-center justify-content-center gap-2" onClick={() => handleAction('Customer set to Escalated status.')}>
                      <FontAwesomeIcon icon={faArrowTrendUp} />
                      Escalate Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <FontAwesomeIcon icon={faUser} className="fs-1 mb-3 text-light" />
                  <p className="small mb-0">Select a customer to load information.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DRILLDOWN DRAWERS & MODALS */}

      {/* 1. Customer Ledger Drilldown Drawer */}
      {selectedCustomer && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '55%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Customer Statement Profile</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedCustomer.customer} Statement</h5>
              <span className="small text-muted font-monospace">{selectedCustomer.customerCode} • Region: {selectedCustomer.region}</span>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedCustomer(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            {/* KPI Cards inside Drawer */}
            <div className="row g-2 mb-3">
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Outstanding</span>
                  <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.balance.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Credit Limit</span>
                  <strong className="small text-primary">Rs {selectedCustomer.creditLimit.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Days Overdue</span>
                  <strong className="small text-danger">{selectedCustomer.daysOverdue} Days</strong>
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
                    <td className="small">{selectedCustomer.docDate}</td>
                    <td><span className="small fw-semibold">{selectedCustomer.docType}</span></td>
                    <td className="font-monospace small text-primary">{selectedCustomer.docNo}</td>
                    <td className="text-end">Rs {selectedCustomer.balance.toLocaleString()}</td>
                    <td className="text-end">-</td>
                    <td className="text-end fw-bold">Rs {selectedCustomer.balance.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleAction('Email sent successfully.')}><FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email Statement</button>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleAction('Printed PDF Statement.')}><FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleAction('Exported Statement to Excel.')}><FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel</button>
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
                  <label className="fw-semibold text-muted small d-block">Customer</label>
                  <span>{selectedDocument.customer} ({selectedDocument.customerCode})</span>
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
                <button className="btn btn-sm btn-primary" onClick={() => { handleRecordPayment(selectedDocument); setSelectedDocument(null); }}>Record Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this receivable entry to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name || ''}
        confirmLabel="Move to Trash"
      />

    </div>
  );
};

export default ErpReceivablesAging;
