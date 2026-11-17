import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faEnvelope, faPhone,
  faMapMarkerAlt, faUserCheck, faArrowTrendUp, faArrowTrendDown, faBrain, faTrashCan,
  faEdit, faFileSignature, faFileCsv, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import { DeleteConfirmDialog, EnableDisableButton } from '../../../../components/common';
import { exportPdf, exportWord, exportDocx } from '../../../../utils/brandedExport';

const ErpVendorLedgerSummary = () => {
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
  const [vendorGroup, setVendorGroup] = useState('All');
  const [country, setCountry] = useState('All');
  const [taxRegistered, setTaxRegistered] = useState('All');
  const [sortBy, setSortBy] = useState('Highest Due');

  // Drilldown Vendor Ledger Drawer State
  const [selectedVendor, setSelectedVendor] = useState(null);

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

  // Mock Vendor Summary Records
  const initialVendors = [
    { code: 'VEN-001', name: 'Microsoft Licenses Ltd', opening: 250000, bills: 750000, payments: 600000, unapplied: 100000, debitNotes: 30000, group: 'IT & Software', country: 'USA', taxRegistered: 'Yes', ntn: '192830-1', strn: '281920-5', phone: '+1 800 642 7676', email: 'licensing@microsoft.com', status: 'Active' },
    { code: 'VEN-045', name: 'Local Steel Escrow Ltd', opening: 0, invoices: 0, bills: 1200000, payments: 1200000, unapplied: 0, debitNotes: 0, group: 'Raw Materials', country: 'Pakistan', taxRegistered: 'Yes', ntn: '839201-4', strn: '748291-8', phone: '+92 423 5556667', email: 'steel@localcorp.pk', status: 'Active' },
    { code: 'VEN-220', name: 'Al-Khair Office Supplies', opening: -15000, bills: 180000, payments: 200000, unapplied: 35000, debitNotes: 5000, group: 'Stationery', country: 'Pakistan', taxRegistered: 'No', ntn: 'N/A', strn: 'N/A', phone: '+92 300 9876543', email: 'alkhairoffice@outlook.com', status: 'Active' },
    { code: 'VEN-118', name: 'Shenzhen Tech Hardware', opening: 450000, bills: 980000, payments: 800000, unapplied: 0, debitNotes: 40000, group: 'IT & Software', country: 'China', taxRegistered: 'Yes', ntn: '982710-9', strn: '839201-1', phone: '+86 755 12345678', email: 'supply@sztech.cn', status: 'Active' },
    { code: 'VEN-092', name: 'Prime Utilities Co', opening: 35000, bills: 0, payments: 35000, unapplied: 0, debitNotes: 0, group: 'Utilities', country: 'Pakistan', taxRegistered: 'Yes', ntn: '637281-0', strn: '528391-4', phone: '+92 213 4443332', email: 'billing@primeutilities.com', status: 'Inactive' }
  ];

  const [vendors, setVendors] = useState(initialVendors);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  // Computations
  const computedList = useMemo(() => {
    const list = vendors.map(vendor => {
      // Balance Due = Opening + Bills - Payments - DebitNotes
      const balanceDue = vendor.opening + vendor.bills - vendor.payments - vendor.debitNotes;
      return {
        ...vendor,
        balanceDue
      };
    });

    // Filtering
    let filtered = list.filter(ven => {
      const matchesSearch = ven.name.toLowerCase().includes(searchTerm.toLowerCase()) || ven.code.includes(searchTerm) || ven.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = vendorGroup === 'All' || ven.group === vendorGroup;
      const matchesCountry = country === 'All' || ven.country === country;
      const matchesTax = taxRegistered === 'All' || ven.taxRegistered === taxRegistered;
      
      const matchesOutstanding = !outstandingOnly || ven.balanceDue > 0;
      const matchesZero = zeroBalance || ven.balanceDue !== 0;

      return matchesSearch && matchesGroup && matchesCountry && matchesTax && matchesOutstanding && matchesZero;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'Highest Due') return b.balanceDue - a.balanceDue;
      if (sortBy === 'Lowest Due') return a.balanceDue - b.balanceDue;
      if (sortBy === 'Vendor Name') return a.name.localeCompare(b.name);
      return b.bills - a.bills; // Default Activity
    });

    return filtered;
  }, [searchTerm, outstandingOnly, zeroBalance, vendorGroup, country, taxRegistered, sortBy, vendors]);

  const summary = useMemo(() => {
    let opening = 0, bills = 0, payments = 0, unapplied = 0, balanceDue = 0;
    computedList.forEach(ven => {
      opening += ven.opening;
      bills += ven.bills;
      payments += ven.payments;
      unapplied += ven.unapplied;
      balanceDue += ven.balanceDue;
    });
    return { opening, bills, payments, unapplied, balanceDue };
  }, [computedList]);

  // Vendor Statement Ledger details
  const getVendorLedgerActivity = (code) => {
    return [
      { date: '2026-07-01', type: 'Opening', reference: 'OB-2026', debit: 0, credit: 0, balance: 250000 },
      { date: '2026-07-04', type: 'Purchase Bill', reference: 'BIL-09827', debit: 0, credit: 450000, balance: 700000 },
      { date: '2026-07-10', type: 'Vendor Payment', reference: 'PAY-00812', debit: 350000, credit: 0, balance: 350000 },
      { date: '2026-07-18', type: 'Purchase Bill', reference: 'BIL-09941', debit: 0, credit: 300000, balance: 650000 },
      { date: '2026-07-25', type: 'Vendor Payment', reference: 'PAY-00902', debit: 250000, credit: 0, balance: 400000 },
      { date: '2026-07-28', type: 'Debit Note Adjust', reference: 'DN-00104', debit: 30000, credit: 0, balance: 370000 }
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
      { key: 'name', label: 'Vendor' }, { key: 'code', label: 'Code' },
      { key: 'opening', label: 'Opening' }, { key: 'bills', label: 'Bills' },
      { key: 'payments', label: 'Payments' }, { key: 'unapplied', label: 'Unapplied' },
      { key: 'balanceDue', label: 'Balance Due' },
    ];
    const headers = cols.map(c => c.label);
    const rows = computedList.map(item => cols.map(c => String(item[c.key] ?? '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    if (type === 'csv') { downloadBlob(csv, 'vendor_ledger_summary.csv', 'text/csv'); }
    else if (type === 'xlsx') { downloadBlob(csv, 'vendor_ledger_summary.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }
    else if (type === 'docx') { await exportDocx({ title: 'Vendor Ledger Summary', headers, rows, filename: 'vendor_ledger_summary.docx' }); }
    else if (type === 'word') { await exportWord({ title: 'Vendor Ledger Summary', headers, rows, filename: 'vendor_ledger_summary.doc' }); }
    else if (type === 'pdf') { await exportPdf({ title: 'Vendor Ledger Summary', headers, rows, filename: 'vendor_ledger_summary.pdf' }); }
    addNotification(`${type.toUpperCase()} exported successfully.`, 'success');
  };

  const handleEdit = (row) => {
    setEditDocument?.({ ...row, documentType: 'vendor_ledger' });
    setActiveTab?.('erp_add_vendor');
  };

  const handleDeleteClick = (row) => setDeleteDialog({ show: true, id: row.code, name: `${row.code} - ${row.name}` });

  const handleDeleteConfirm = () => {
    setVendors(prev => prev.filter(item => item.code !== deleteDialog.id));
    addNotification?.('Vendor ledger summary entry moved to trash.', 'success');
    setDeleteDialog({ show: false, id: null, name: '' });
  };

  const handleMoveToDraft = (row) => {
    setVendors(prev => prev.map(item => item.code === row.code ? { ...item, status: 'Draft' } : item));
    addNotification?.(`${row.name} moved to Draft.`, 'success');
  };

  const handleResetFilters = () => {
    setSearchTerm(''); setOutstandingOnly(false); setZeroBalance(true);
    setVendorGroup('All'); setCountry('All'); setTaxRegistered('All'); setSortBy('Highest Due');
    addNotification('Filters reset.', 'info');
  };

  const handleRunReport = () => addNotification('Vendor ledger summaries reloaded.', 'success');

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
        title="Vendor Ledger Summary"
        badge="Accounting / ERP"
        description="Vendor-wise posted bills, payments, unapplied payments and outstanding payable balances."
        isDark={isDark}
        activeTabId="vendor_ledger"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Payables Aging', icon: faClock, onClick: () => setActiveTab('erp_report_center'), variant: 'outline' }
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
              <label className="form-label x-small text-muted fw-semibold">Vendor Group</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={vendorGroup} onChange={e => setVendorGroup(e.target.value)}>
                <option value="All">All Groups</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Country</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={country} onChange={e => setCountry(e.target.value)}>
                <option value="All">All Countries</option>
                <option value="Pakistan">Pakistan</option>
                <option value="USA">USA</option>
                <option value="China">China</option>
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
                <option value="Vendor Name">Vendor Alphabetical</option>
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
              <div className="small" style={{ color: mutedColor }}>Shenzhen Tech Hardware carries the highest outstanding payable (Rs {summary.balanceDue.toLocaleString()} total due). Consider prioritizing settlements with the top 3 vendors by balance due.</div>
            </div>
          </div>
        </div>

        {/* 4. SUMMARY CARDS */}
        <div className="row g-3 mb-4">
          <ErpKpiCard label="Opening Balance" value={`Rs ${summary.opening.toLocaleString()}`} icon={faCoins} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Bills Posted" value={`Rs ${summary.bills.toLocaleString()}`} icon={faFileInvoice} color="#3B82F6" isDark={isDark} />
          <ErpKpiCard label="Payments Cleared" value={`Rs ${summary.payments.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard label="Unapplied Payments" value={`Rs ${summary.unapplied.toLocaleString()}`} icon={faCalculator} color="#8b5cf6" isDark={isDark} />
          <ErpKpiCard 
            label="Total Balance Due" 
            value={`Rs ${summary.balanceDue.toLocaleString()}`} 
            icon={faArrowTrendUp} 
            color={summary.balanceDue > 0 ? '#ef4444' : summary.balanceDue === 0 ? '#6b7280' : '#10b981'} 
            isDark={isDark} 
          />
        </div>

        {/* 5. VENDOR SUMMARY TABLE */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              Vendor Registry Summaries
            </h6>
            <div className="d-flex align-items-center gap-2">
              <input type="text" className="form-control form-control-sm" style={{ width: '250px', backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Search code, vendor name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle" style={{ color: textColor }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                  <th style={{ color: mutedColor }}>Vendor</th>
                  <th style={{ color: mutedColor }}>Vendor Code</th>
                  <th style={{ color: mutedColor }} className="text-end">Bills</th>
                  <th style={{ color: mutedColor }} className="text-end">Payments</th>
                  <th style={{ color: mutedColor }} className="text-end">Unapplied</th>
                  <th style={{ color: mutedColor }} className="text-end">Balance Due</th>
                  <th style={{ color: mutedColor }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {computedList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      <div className="mb-2">No vendor ledger movement found.</div>
                      <span className="small">Run report after posting purchase bills or vendor payments.</span>
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
                          <button className="btn btn-link p-0 fw-bold text-start text-decoration-none text-primary" onClick={() => setSelectedVendor(row)}>
                            {row.name}
                          </button>
                        </td>
                        <td className="font-monospace text-muted small">{row.code}</td>
                        <td className="text-end">Rs {row.bills.toLocaleString()}</td>
                        <td className="text-end text-success">Rs {row.payments.toLocaleString()}</td>
                        <td className="text-end text-warning">Rs {row.unapplied.toLocaleString()}</td>
                        <td className={`text-end fw-bold ${row.balanceDue > 0 ? 'text-danger' : row.balanceDue === 0 ? 'text-secondary' : 'text-success'}`}>
                          Rs {row.balanceDue.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <div className="d-inline-flex gap-1">
                            <button className="btn btn-xs btn-outline-primary" style={{ fontSize: '11px' }} onClick={() => setSelectedVendor(row)}>
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
                    <td className="text-end">Rs {summary.bills.toLocaleString()}</td>
                    <td className="text-end text-success">Rs {summary.payments.toLocaleString()}</td>
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

      {/* 6. DRILLDOWN VENDOR LEDGER STATEMENT */}
      {selectedVendor && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '55%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Vendor statement Profile</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedVendor.name} Statement</h5>
              <span className="small text-muted font-monospace">{selectedVendor.code} • NTN: {selectedVendor.ntn}</span>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedVendor(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            
            {/* KPI cards in drawer */}
            <div className="row g-2 mb-3">
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Closing Due</span>
                  <strong className="small animate-fade-in" style={{ color: textColor }}>Rs {selectedVendor.balanceDue.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Total Billed</span>
                  <strong className="small" style={{ color: textColor }}>Rs {selectedVendor.bills.toLocaleString()}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 rounded border text-center">
                  <span className="x-small text-muted d-block">Payments cleared</span>
                  <strong className="small text-success">Rs {selectedVendor.payments.toLocaleString()}</strong>
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
                  {getVendorLedgerActivity(selectedVendor.code).map((act, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${borderColor}` }}>
                      <td className="small">{act.date}</td>
                      <td><span className="small fw-semibold">{act.type}</span></td>
                      <td className="font-monospace small text-primary">{act.reference}</td>
                      <td className="text-end text-success">{act.debit > 0 ? `Rs ${act.debit.toLocaleString()}` : '-'}</td>
                      <td className="text-end">{act.credit > 0 ? `Rs ${act.credit.toLocaleString()}` : '-'}</td>
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
        message="Are you sure you want to move this vendor ledger entry to trash? You can restore it later from Accounting Trash."
        itemName={deleteDialog.name || ''}
        confirmLabel="Move to Trash"
      />

    </div>
  );
};

export default ErpVendorLedgerSummary;
