import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faEnvelope, faPhone,
  faMapMarkerAlt, faUserCheck, faArrowTrendUp, faBrain, faTrashCan, faEdit,
  faFileSignature, faFileCsv, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import { DeleteConfirmDialog, EnableDisableButton } from '../../../../components/common';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpCustomerLedgerSummary = () => {
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
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-31');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced Filters
  const [outstandingOnly, setOutstandingOnly] = useState(false);
  const [zeroBalance, setZeroBalance] = useState(true);
  const [customerGroup, setCustomerGroup] = useState('All');
  const [region, setRegion] = useState('All');
  const [salesperson, setSalesperson] = useState('All');
  const [sortBy, setSortBy] = useState('Highest Due');

  // Drilldown Customer Ledger Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  // Mock Customer Summary Records
  const initialCustomers = [
    { code: 'CUS-115', name: 'Al-Rahim Enterprises', opening: 150000, invoices: 850000, receipts: 700000, unapplied: 50000, creditNotes: 20000, group: 'Wholesale', region: 'Punjab', salesperson: 'Ali Khan', ntn: '381920-1', strn: '982710-3', phone: '+92 300 1234567', email: 'info@alrahim.com', status: 'Active' },
    { code: 'CUS-104', name: 'Apex Software Systems', opening: 0, invoices: 1200000, receipts: 1200000, unapplied: 0, creditNotes: 0, group: 'Corporate', region: 'Sindh', salesperson: 'Sarah Shah', ntn: '928312-4', strn: '839201-9', phone: '+92 213 9998888', email: 'billing@apexsys.com', status: 'Active' },
    { code: 'CUS-099', name: 'Bin-Naseer Distributors', opening: -45000, invoices: 340000, receipts: 450000, unapplied: 65000, creditNotes: 15000, group: 'Retail', region: 'KPK', salesperson: 'Usman Malik', ntn: '748291-5', strn: '638291-2', phone: '+92 333 7776665', email: 'accounts@bnaseer.pk', status: 'Active' },
    { code: 'CUS-084', name: 'Capital Logistics Corp', opening: 350000, invoices: 950000, receipts: 600000, unapplied: 0, creditNotes: 50000, group: 'Corporate', region: 'Federal', salesperson: 'Ali Khan', ntn: '839201-9', strn: '748291-0', phone: '+92 312 9993333', email: 'finance@caplogistics.pk', status: 'Active' },
    { code: 'CUS-073', name: 'Delta Traders Ltd', opening: 85000, invoices: 0, receipts: 85000, unapplied: 0, creditNotes: 0, group: 'Retail', region: 'Balochistan', salesperson: 'Sarah Shah', ntn: '637291-8', strn: '528391-7', phone: '+92 321 8887776', email: 'deltaptraders@gmail.com', status: 'Inactive' }
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  // Computations
  const computedList = useMemo(() => {
    const list = customers.map(customer => {
      // Balance Due = Opening + Invoice - Receipt - CreditNotes
      const balanceDue = customer.opening + customer.invoices - customer.receipts - customer.creditNotes;
      return {
        ...customer,
        balanceDue
      };
    });

    // Filtering
    let filtered = list.filter(cus => {
      const matchesSearch = cus.name.toLowerCase().includes(searchTerm.toLowerCase()) || cus.code.includes(searchTerm) || cus.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = customerGroup === 'All' || cus.group === customerGroup;
      const matchesRegion = region === 'All' || cus.region === region;
      const matchesSalesperson = salesperson === 'All' || cus.salesperson === salesperson;
      
      const matchesOutstanding = !outstandingOnly || cus.balanceDue > 0;
      const matchesZero = zeroBalance || cus.balanceDue !== 0;

      return matchesSearch && matchesGroup && matchesRegion && matchesSalesperson && matchesOutstanding && matchesZero;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'Highest Due') return b.balanceDue - a.balanceDue;
      if (sortBy === 'Lowest Due') return a.balanceDue - b.balanceDue;
      if (sortBy === 'Customer') return a.name.localeCompare(b.name);
      return b.invoices - a.invoices; // Default Activity
    });

    return filtered;
  }, [searchTerm, outstandingOnly, zeroBalance, customerGroup, region, salesperson, sortBy, customers]);

  const summary = useMemo(() => {
    let opening = 0, invoices = 0, receipts = 0, unapplied = 0, balanceDue = 0;
    computedList.forEach(cus => {
      opening += cus.opening;
      invoices += cus.invoices;
      receipts += cus.receipts;
      unapplied += cus.unapplied;
      balanceDue += cus.balanceDue;
    });
    return { opening, invoices, receipts, unapplied, balanceDue };
  }, [computedList]);

  // Customer Statement Ledger details
  const getCustomerLedgerActivity = (code) => {
    return [
      { date: '2026-07-02', type: 'Opening', reference: 'OB-2026', debit: 0, credit: 0, balance: 150000 },
      { date: '2026-07-06', type: 'Sales Invoice', reference: 'INV-02941', debit: 450000, credit: 0, balance: 600000 },
      { date: '2026-07-12', type: 'Customer Payment', reference: 'REC-00912', debit: 0, credit: 350000, balance: 250000 },
      { date: '2026-07-18', type: 'Sales Invoice', reference: 'INV-02995', debit: 400000, credit: 0, balance: 650000 },
      { date: '2026-07-25', type: 'Customer Receipt', reference: 'REC-01004', debit: 0, credit: 350000, balance: 300000 },
      { date: '2026-07-28', type: 'Credit Note Adjust', reference: 'CN-00212', debit: 0, credit: 20000, balance: 280000 }
    ];
  };

  const downloadBlob = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    const cols = [
      { key: 'name', label: 'Customer' }, { key: 'code', label: 'Code' },
      { key: 'opening', label: 'Opening' }, { key: 'invoices', label: 'Invoices' },
      { key: 'receipts', label: 'Receipts' }, { key: 'unapplied', label: 'Unapplied' },
      { key: 'balanceDue', label: 'Balance Due' },
    ];
    const headers = cols.map(c => c.label);
    const rows = computedList.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'customer_ledger_summary.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'customer_ledger_summary.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { await exportDocx({ title: 'Customer Ledger Summary', headers, rows, filename: 'customer_ledger_summary.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Customer Ledger Summary', headers, rows, filename: 'customer_ledger_summary.doc' }); }
    else if (type === 'pdf') { await exportPdf({ title: 'Customer Ledger Summary', headers, rows, filename: 'customer_ledger_summary.pdf' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'customer_ledger' });
    setActiveTab?.('erp_create_customer');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.code, name: `${row.code} - ${row.name}` });

  const handleDeleteConfirm = () => {
    setCustomers(prev => prev.filter(item => item.code !== deleteDialog.id));
    addNotification?.('Customer ledger summary entry moved to trash.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const handleMoveToDraft = (row) => {
    setCustomers(prev => prev.map(item => item.code === row.code ? { ...item, status: 'Draft' } : item));
    addNotification?.(`${row.name} moved to Draft.`, 'success');
  };

  const handleResetFilters = () => {
    setSearchTerm(''); setOutstandingOnly(false); setZeroBalance(true);
    setCustomerGroup('All'); setRegion('All'); setSalesperson('All'); setSortBy('Highest Due');
    addNotification('Filters reset.', 'info');
  };

  const handleRunReport = () => addNotification('Customer ledger summaries reloaded.', 'success');

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
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
    <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* 1. PAGE HEADER */}
      <ErpReportHeader
        title="Customer Ledger Summary"
        badge="Accounting / ERP"
        description="Customer-wise opening balances, posted invoices, receipts, unapplied receipts and outstanding balances."
        isDark={isDark}
        activeTabId="customer_ledger"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Receivables Aging', icon: faClock, onClick: () => setActiveTab('erp_report_center'), variant: 'outline' }
        ]}
      />

      {/* 2. MAIN CONTAINER */}
      <div className="container-fluid px-4 px-lg-5">
        
        {/* 3. FILTER BAR */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
              Report Parameters Filter Toolbar
            </h6>
          </div>
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">From Date</label>
              <input type="date" className="form-control form-control-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">To Date</label>
              <input type="date" className="form-control form-control-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Customer Group</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={customerGroup} onChange={e => setCustomerGroup(e.target.value)}>
                <option value="All">All Groups</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Retail">Retail</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Region</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={region} onChange={e => setRegion(e.target.value)}>
                <option value="All">All Regions</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 d-flex align-items-end">
              <EnableDisableButton checked={outstandingOnly} onClick={() => setOutstandingOnly(!outstandingOnly)} label="Outstanding Balance Only" />
            </div>
            <div className="col-md-3 col-sm-6 d-flex align-items-end">
              <EnableDisableButton checked={zeroBalance} onClick={() => setZeroBalance(!zeroBalance)} label="Show Zero Balances" />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Sort By</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="Highest Due">Highest Balance Due</option>
                <option value="Lowest Due">Lowest Balance Due</option>
                <option value="Customer">Customer Alphabetical</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-3 pt-3 flex-wrap gap-2" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={handleResetFilters}>Reset</button>
              <button className="btn btn-sm btn-primary px-4" onClick={handleRunReport}>Run Report</button>
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

        {/* 3b. AI LEDGER INTELLIGENCE BANNER */}
        <div className="card border-0 shadow-sm p-3 rounded-4 mb-4" style={{ background: isDark ? 'rgba(139,92,246,0.12)' : '#f5f3ff', borderLeft: '4px solid #8b5cf6' }}>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#8b5cf620', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <div>
              <div className="fw-bold small" style={{ color: textColor }}>AI Ledger Intelligence</div>
              <div className="small" style={{ color: mutedColor }}>Capital Logistics Corp carries the highest outstanding balance (Rs {summary.balanceDue.toLocaleString()} total due). Consider prioritizing follow-up on the top 3 accounts by balance due.</div>
            </div>
          </div>
        </div>

        {/* 4. SUMMARY CARDS */}
        <div className="row g-3 mb-4">
          <ErpKpiCard label="Opening Balance" value={`Rs ${summary.opening.toLocaleString()}`} icon={faCoins} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Invoices Issued" value={`Rs ${summary.invoices.toLocaleString()}`} icon={faFileInvoice} color="#3B82F6" isDark={isDark} />
          <ErpKpiCard label="Receipts Received" value={`Rs ${summary.receipts.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard label="Unapplied Receipts" value={`Rs ${summary.unapplied.toLocaleString()}`} icon={faCalculator} color="#8b5cf6" isDark={isDark} />
          <ErpKpiCard 
            label="Total Balance Due" 
            value={`Rs ${summary.balanceDue.toLocaleString()}`} 
            icon={faArrowTrendUp} 
            color={summary.balanceDue > 0 ? '#ef4444' : summary.balanceDue === 0 ? '#6b7280' : '#10b981'} 
            isDark={isDark} 
          />
        </div>

        {/* 5. CUSTOMER SUMMARY TABLE */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              Customer Registry Summaries
            </h6>
            <div className="d-flex align-items-center gap-2">
              <input type="text" className="form-control form-control-sm" style={{ width: '250px', backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Search code, customer name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle" style={{ color: textColor }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                  <th style={{ color: mutedColor }}>Customer Name</th>
                  <th style={{ color: mutedColor }}>Code</th>
                  <th style={{ color: mutedColor }} className="text-end">Opening</th>
                  <th style={{ color: mutedColor }} className="text-end">Invoices</th>
                  <th style={{ color: mutedColor }} className="text-end">Receipts</th>
                  <th style={{ color: mutedColor }} className="text-end">Unapplied</th>
                  <th style={{ color: mutedColor }} className="text-end">Balance Due</th>
                  <th style={{ color: mutedColor }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {computedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <div className="mb-2">No customer ledger movement found.</div>
                      <span className="small">Run report after posting invoices or receipts.</span>
                    </td>
                  </tr>
                ) : (
                  computedList.map(row => {
                    let rowColorClass = '';
                    if (row.balanceDue > 0) rowColorClass = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.03)'; // Outstanding (Light Red)
                    else if (row.balanceDue === 0) rowColorClass = isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.03)'; // Paid (Light Green)
                    else rowColorClass = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.03)'; // Credit Balance (Light Blue)

                    return (
                      <tr key={row.code} style={{ backgroundColor: rowColorClass, borderBottom: `1px solid ${borderColor}` }}>
                        <td>
                          <button className="btn btn-link p-0 fw-bold text-start text-decoration-none text-primary" onClick={() => setSelectedCustomer(row)}>
                            {row.name}
                          </button>
                        </td>
                        <td className="font-monospace text-muted small">{row.code}</td>
                        <td className="text-end">Rs {row.opening.toLocaleString()}</td>
                        <td className="text-end">Rs {row.invoices.toLocaleString()}</td>
                        <td className="text-end text-success">Rs {row.receipts.toLocaleString()}</td>
                        <td className="text-end text-warning">Rs {row.unapplied.toLocaleString()}</td>
                        <td className={`text-end fw-bold ${row.balanceDue > 0 ? 'text-danger' : row.balanceDue === 0 ? 'text-secondary' : 'text-success'}`}>
                          Rs {row.balanceDue.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <div className="d-inline-flex gap-1">
                            <button className="btn btn-xs btn-outline-primary" style={{ fontSize: '11px' }} onClick={() => setSelectedCustomer(row)}>
                              <FontAwesomeIcon icon={faEye} className="me-1" /> Ledger
                            </button>
                            <button className="btn btn-xs border-0" title="Edit" style={{ color: mutedColor }} onClick={() => handleEdit(row)}><FontAwesomeIcon icon={faEdit} /></button>
                            <button className="btn btn-xs border-0" title="Move to Draft" style={{ color: '#f59e0b' }} onClick={() => handleMoveToDraft(row)}><FontAwesomeIcon icon={faFileSignature} /></button>
                            <button className="btn btn-xs border-0" title="Move to Trash" style={{ color: '#f43f5e' }} onClick={() => handleDeleteClick(row)}><FontAwesomeIcon icon={faTrashCan} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Total Row */}
                {computedList.length > 0 && (
                  <tr className="fw-bold bg-light" style={{ borderTop: `2px solid ${borderColor}` }}>
                    <td colSpan={2}>Total Sum</td>
                    <td className="text-end">Rs {summary.opening.toLocaleString()}</td>
                    <td className="text-end">Rs {summary.invoices.toLocaleString()}</td>
                    <td className="text-end text-success">Rs {summary.receipts.toLocaleString()}</td>
                    <td className="text-end text-warning">Rs {summary.unapplied.toLocaleString()}</td>
                    <td className={`text-end text-primary`} style={{ fontSize: '1.05rem' }}>
                      Rs {summary.balanceDue.toLocaleString()}
                    </td>
                    <td className="text-center">-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 6. DRILLDOWN CUSTOMER LEDGER STATEMENT */}
      {selectedCustomer && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '55%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Customer statement Profile</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedCustomer.name} Statement</h5>
              <span className="small text-muted font-monospace">{selectedCustomer.code} • NTN: {selectedCustomer.ntn}</span>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedCustomer(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            
            {/* KPI cards in drawer */}
            <div className="row g-2 mb-3">
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Closing Due</span>
                  <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.balanceDue.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Total Invoiced</span>
                  <strong className="small" style={{ color: textColor }}>Rs {selectedCustomer.invoices.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Payments cleared</span>
                  <strong className="small text-success">Rs {selectedCustomer.receipts.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Detailed Ledger list */}
            <div className="table-responsive">
              <table className="table table-sm align-middle" style={{ color: textColor }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <th style={{ color: mutedColor }}>Date</th>
                    <th style={{ color: mutedColor }}>Voucher Type</th>
                    <th style={{ color: mutedColor }}>Reference</th>
                    <th style={{ color: mutedColor }} className="text-end">Debit</th>
                    <th style={{ color: mutedColor }} className="text-end">Credit</th>
                    <th style={{ color: mutedColor }} className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {getCustomerLedgerActivity(selectedCustomer.code).map((act, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td className="small">{act.date}</td>
                      <td><span className="small fw-semibold">{act.type}</span></td>
                      <td className="font-monospace small text-primary">{act.reference}</td>
                      <td className="text-end">{act.debit > 0 ? `Rs ${act.debit.toLocaleString()}` : '-'}</td>
                      <td className="text-end text-success">{act.credit > 0 ? `Rs ${act.credit.toLocaleString()}` : '-'}</td>
                      <td className="text-end fw-bold">Rs {act.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          <div className="d-flex justify-content-between pt-3 mt-3 border-top">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Sending ledger statement email...', 'info')}><FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email Statement</button>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleExport('pdf')}><FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleExport('xlsx')}><FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel</button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '' })}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash"
        message="Are you sure you want to move this customer ledger entry to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name || ''}
        confirmLabel="Move to Trash"
      />

    </div>
  );
};

export default ErpCustomerLedgerSummary;
