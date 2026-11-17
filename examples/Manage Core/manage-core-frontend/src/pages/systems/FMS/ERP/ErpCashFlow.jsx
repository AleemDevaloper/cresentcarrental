import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faArrowTrendUp, faArrowTrendDown,
  faLightbulb, faSlidersH, faChevronDown, faBrain, faEdit, faTrashCan, faEnvelope, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import { DeleteConfirmDialog } from '../../../../components/common';

const ErpCashFlow = () => {
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

  const colors = {
    primary: '#6366f1', success: '#10b981', danger: '#f43f5e',
    warning: '#f59e0b', info: '#06b6d4', purple: '#8b5cf6',
  };

  // State Management
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-31');
  const [company, setCompany] = useState('Manage Core Ltd');
  const [branch, setBranch] = useState('All');
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [currency, setCurrency] = useState('PKR');
  const [costCenter, setCostCenter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    const onRefresh = () => addNotification('Cash flow data refreshed.', 'info');
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

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

  // Mock Cash Flow Activities
  const cashActivities = {
    operating: [
      { code: 'OP-01', name: 'Net Income / Earnings', amount: 620000, category: 'Net Income', status: 'Posted' },
      { code: 'OP-02', name: 'Depreciation & Amortization Addback', amount: 85000, category: 'Non-Cash Adjustments', status: 'Posted' },
      { code: 'OP-03', name: 'Accounts Receivable Net Change', amount: -120000, category: 'Working Capital Change', status: 'Posted' },
      { code: 'OP-04', name: 'Inventory Asset Net Change', amount: -65000, category: 'Working Capital Change', status: 'Draft' },
      { code: 'OP-05', name: 'Accounts Payable Net Change', amount: 85000, category: 'Working Capital Change', status: 'Posted' },
      { code: 'OP-06', name: 'Accrued Payroll Liabilities Net Change', amount: 22000, category: 'Working Capital Change', status: 'Approved' },
      { code: 'OP-07', name: 'Prepaid Expenses Net Change', amount: -15000, category: 'Working Capital Change', status: 'Posted' }
    ],
    investing: [
      { code: 'IN-01', name: 'Purchase of Computers & Laptops (CAPEX)', amount: -95000, category: 'CAPEX Outflow', status: 'Posted' },
      { code: 'IN-02', name: 'Purchase of Office Furniture (CAPEX)', amount: -35000, category: 'CAPEX Outflow', status: 'Draft' },
      { code: 'IN-03', name: 'Sale of Depreciated Machinery', amount: 150000, category: 'Asset Disposals', status: 'Approved' },
      { code: 'IN-04', name: 'Acquisitions of Software Licenses', amount: -50000, category: 'CAPEX Outflow', status: 'Posted' }
    ],
    financing: [
      { code: 'FI-01', name: 'Loans Received from Banks', amount: 800000, category: 'Loans Obtained', status: 'Posted' },
      { code: 'FI-02', name: 'Repayment of Short-Term Debt Principal', amount: -300000, category: 'Loans Settled', status: 'Posted' },
      { code: 'FI-03', name: 'Owner Drawings distribution', amount: -80000, category: 'Owner Transactions', status: 'Draft' }
    ]
  };

  const flatEntries = useMemo(() => {
    const all = [
      ...cashActivities.operating.map(i => ({ ...i, section: 'Operating' })),
      ...cashActivities.investing.map(i => ({ ...i, section: 'Investing' })),
      ...cashActivities.financing.map(i => ({ ...i, section: 'Financing' })),
    ];
    return all;
  }, []);

  const totals = useMemo(() => {
    const sum = (list) => list.reduce((acc, item) => acc + item.amount, 0);
    const operatingTotal = sum(cashActivities.operating);
    const investingTotal = sum(cashActivities.investing);
    const financingTotal = sum(cashActivities.financing);

    const netChange = operatingTotal + investingTotal + financingTotal;
    const beginningCash = 1250000;
    const endingCash = beginningCash + netChange;

    return {
      operating: operatingTotal,
      investing: investingTotal,
      financing: financingTotal,
      netChange,
      beginningCash,
      endingCash
    };
  }, [cashActivities]);

  const filterList = (list) => {
    return list.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.includes(searchTerm) || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredEntries = useMemo(() => {
    return flatEntries.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flatEntries, searchTerm]);

  const handleEdit = (row) => {
    setEditDocument({ ...row, documentType: 'cash_flow_entry' });
    addNotification('Edit mode activated for ' + row.code, 'info');
  };

  const handleViewClick = (row) => setViewItem(row);

  const handleDeleteClick = (id, row) => setDeleteDialog({ show: true, id, name: row?.name || '', row });
  const handleDeleteConfirm = () => {
    addNotification('Cash flow entry deleted.', 'success');
    setDeleteDialog({ show: false, id: null, name: '', row: null });
  };

  const kpiWidgets = useMemo(() => [
    { label: 'Operating Cash Flow', val: `Rs ${totals.operating.toLocaleString()}`, icon: faArrowTrendUp, color: colors.primary },
    { label: 'Investing Cash Flow', val: `Rs ${totals.investing.toLocaleString()}`, icon: faArrowTrendDown, color: colors.danger },
    { label: 'Financing Cash Flow', val: `Rs ${totals.financing.toLocaleString()}`, icon: faCoins, color: colors.success },
    { label: 'Net Cash Change', val: `Rs ${totals.netChange.toLocaleString()}`, icon: faScaleBalanced, color: totals.netChange >= 0 ? colors.success : colors.danger },
    { label: 'Ending Balance', val: `Rs ${totals.endingCash.toLocaleString()}`, icon: faCalculator, color: colors.info },
  ], [totals]);

  const columns = [
    { key: 'code', label: 'Code', render: (val) => <span className="font-monospace fw-bold" style={{ color: colors.primary }}>{val}</span> },
    { key: 'name', label: 'Activity', bold: true },
    { key: 'section', label: 'Section', render: (val) => <span className="premium-badge" style={{ background: isDark ? '#334155' : '#e2e8f0', color: textColor, fontSize: '0.65rem' }}>{val}</span> },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount', align: 'end', render: (val) => <span className={`font-monospace fw-bold ${val < 0 ? 'text-danger' : 'text-success'}`}>Rs {val.toLocaleString()}</span> },
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
        <button className="btn btn-sm border-0 premium-btn" title="PDF" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('PDF generated.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#6366f110'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Email" style={{ borderRadius: '8px', color: isDark ? '#94a3b8' : '#64748b', background: 'transparent', padding: '4px 8px' }} onClick={() => addNotification?.('Email dispatched.', 'success')}
          onMouseEnter={e => { e.currentTarget.style.background = '#10b98110'; e.currentTarget.style.color = '#10b981'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <button className="btn btn-sm border-0 premium-btn" title="Trash" style={{ borderRadius: '8px', color: colors.danger, background: 'transparent', padding: '4px 8px' }} onClick={() => handleDeleteClick(row.code, row)}
          onMouseEnter={e => { e.currentTarget.style.background = '#f43f5e10'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.danger; }}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    )},
  ];

  // Export helpers
  const downloadBlob = (blob, filename, mime) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    const rows = filteredEntries;
    if (format === 'csv') {
      const header = 'Code,Name,Section,Category,Amount,Status\n';
      const csv = rows.map(r => `${r.code},"${r.name}",${r.section},${r.category},${r.amount},${r.status}`).join('\n');
      const blob = new Blob([header + csv], { type: 'text/csv' });
      downloadBlob(blob, 'cash_flow.csv', 'text/csv');
    } else if (format === 'xlsx') {
      const header = 'Code\tName\tSection\tCategory\tAmount\tStatus\n';
      const xlsx = rows.map(r => `${r.code}\t${r.name}\t${r.section}\t${r.category}\t${r.amount}\t${r.status}`).join('\n');
      const blob = new Blob([header + xlsx], { type: 'application/vnd.ms-excel' });
      downloadBlob(blob, 'cash_flow.xlsx', 'application/vnd.ms-excel');
    } else if (format === 'pdf') {
      addNotification?.('PDF export generated.', 'success');
    } else if (format === 'docx') {
      addNotification?.('DOCX export generated.', 'success');
    }
  };

  const exportButtons = (
    <div className="btn-group">
      <button className="btn btn-sm btn-light border" title="More">⋯</button>
      <div className="btn-group">
        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><button className="dropdown-item" onClick={() => handleExport('pdf')}>PDF</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('xlsx')}>Excel</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('csv')}>CSV</button></li>
          <li><button className="dropdown-item" onClick={() => handleExport('docx')}>DOCX</button></li>
        </ul>
      </div>
    </div>
  );

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
        title="Cash Flow Statement"
        badge="Accounting / ERP"
        description="Operating, investing and financing cash movement with opening and closing balances across the selected date range."
        isDark={isDark}
        activeTabId="cashflow"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Profit & Loss', icon: faFileInvoice, onClick: () => setActiveTab('erp_profit_loss'), variant: 'outline' }
        ]}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="container-fluid px-4 px-lg-5">
        
        {/* FILTERS PANEL */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <h6 className="fw-bold mb-3" style={{ color: textColor }}>
            <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
            Cash Flow Filtering Parameters
          </h6>
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
              <label className="form-label x-small text-muted fw-semibold">Company Scope</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={company} onChange={e => setCompany(e.target.value)}>
                <option>Manage Core Ltd</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Branch Location</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="All">All Branches</option>
                <option value="HQ">HQ Lahore</option>
                <option value="KHI">Karachi Branch</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('Cash flow report recompiled.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              {exportButtons}
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Sent document to printer queue.', 'success')}><FontAwesomeIcon icon={faPrint} className="me-1" /> Print</button>
            </div>
          </div>
        </div>

        {/* SUMMARY KPI ROW */}
        <div className="row g-3 mb-4">
          {kpiWidgets.map((w, idx) => (
            <ErpKpiCard key={idx} label={w.label} value={w.val} icon={w.icon} color={w.color} isDark={isDark} />
          ))}
        </div>

        {/* AI RECOMMENDATION BANNER */}
        <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.purple}`, background: isDark ? 'linear-gradient(90deg, rgba(139,92,246,0.1), transparent)' : 'linear-gradient(90deg, #f5f3ff, transparent)' }}>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${colors.purple}20`, color: colors.purple }}>
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <div>
                <div className="fw-bold small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Cash Flow Insight</div>
                <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.75rem' }}>Operating cash flow is positive at Rs {totals.operating.toLocaleString()}. Consider reallocating surplus to settle short-term financing obligations of Rs 300,000 for improved leverage ratios.</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CASH FLOW SHEET */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faSliders} className="me-2 text-primary" />
              Cash Flow Statement Sheet
            </h6>
            <div className="d-flex align-items-center gap-2">
              <input type="text" className="form-control form-control-sm" style={{ width: '250px', backgroundColor: inputBg, color: textColor, borderColor: borderColor }} placeholder="Search activities..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-sm align-middle" style={{ color: textColor }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                  <th style={{ color: mutedColor }}>Code</th>
                  <th style={{ color: mutedColor }}>Activity Category Title</th>
                  <th style={{ color: mutedColor }} className="text-end">Balance Impact</th>
                  <th style={{ color: mutedColor }} className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Beginning Cash balance */}
                <tr className="fw-bold bg-light" style={{ borderBottom: `2px solid ${borderColor}` }}>
                  <td colSpan={2}>Cash and Cash Equivalents at Beginning of Period</td>
                  <td className="text-end text-primary">Rs {totals.beginningCash.toLocaleString()}</td>
                  <td className="text-center">-</td>
                </tr>

                {/* Operating Section */}
                <tr className="table-light fw-bold">
                  <td colSpan={4}>1. CASH FLOWS FROM OPERATING ACTIVITIES</td>
                </tr>
                {filterList(cashActivities.operating).map(row => (
                  <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td className="font-monospace text-muted small">{row.code}</td>
                    <td>
                      <button className="btn btn-link p-0 text-start text-decoration-none" style={{ color: textColor, fontWeight: '500' }} onClick={() => setSelectedItem(row)}>
                        {row.name}
                      </button>
                    </td>
                    <td className={`text-end fw-semibold ${row.amount < 0 ? 'text-danger' : 'text-success'}`}>
                      Rs {row.amount.toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedItem(row)}>Drill Down</button>
                    </td>
                  </tr>
                ))}
                <tr className="fw-bold" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                  <td colSpan={2} className="ps-3 text-muted">Net Cash from Operating Activities</td>
                  <td className={`text-end ${totals.operating >= 0 ? 'text-success' : 'text-danger'}`}>Rs {totals.operating.toLocaleString()}</td>
                  <td className="text-center">-</td>
                </tr>

                {/* Investing Section */}
                <tr className="table-light fw-bold">
                  <td colSpan={4}>2. CASH FLOWS FROM INVESTING ACTIVITIES</td>
                </tr>
                {filterList(cashActivities.investing).map(row => (
                  <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td className="font-monospace text-muted small">{row.code}</td>
                    <td>
                      <button className="btn btn-link p-0 text-start text-decoration-none" style={{ color: textColor, fontWeight: '500' }} onClick={() => setSelectedItem(row)}>
                        {row.name}
                      </button>
                    </td>
                    <td className={`text-end fw-semibold ${row.amount < 0 ? 'text-danger' : 'text-success'}`}>
                      Rs {row.amount.toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedItem(row)}>Drill Down</button>
                    </td>
                  </tr>
                ))}
                <tr className="fw-bold" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                  <td colSpan={2} className="ps-3 text-muted">Net Cash used in Investing Activities</td>
                  <td className={`text-end ${totals.investing >= 0 ? 'text-success' : 'text-danger'}`}>Rs {totals.investing.toLocaleString()}</td>
                  <td className="text-center">-</td>
                </tr>

                {/* Financing Section */}
                <tr className="table-light fw-bold">
                  <td colSpan={4}>3. CASH FLOWS FROM FINANCING ACTIVITIES</td>
                </tr>
                {filterList(cashActivities.financing).map(row => (
                  <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                    <td className="font-monospace text-muted small">{row.code}</td>
                    <td>
                      <button className="btn btn-link p-0 text-start text-decoration-none" style={{ color: textColor, fontWeight: '500' }} onClick={() => setSelectedItem(row)}>
                        {row.name}
                      </button>
                    </td>
                    <td className={`text-end fw-semibold ${row.amount < 0 ? 'text-danger' : 'text-success'}`}>
                      Rs {row.amount.toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedItem(row)}>Drill Down</button>
                    </td>
                  </tr>
                ))}
                <tr className="fw-bold" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                  <td colSpan={2} className="ps-3 text-muted">Net Cash from Financing Activities</td>
                  <td className={`text-end ${totals.financing >= 0 ? 'text-success' : 'text-danger'}`}>Rs {totals.financing.toLocaleString()}</td>
                  <td className="text-center">-</td>
                </tr>

                {/* Ending Net cash */}
                <tr className="fw-bold table-success" style={{ borderTop: '2px solid #10b981', borderBottom: '2px double #10b981' }}>
                  <td colSpan={2}>Net Increase / (Decrease) in Cash and Cash Equivalents</td>
                  <td className={`text-end ${totals.netChange >= 0 ? 'text-success' : 'text-danger'}`}>Rs {totals.netChange.toLocaleString()}</td>
                  <td className="text-center">{currency}</td>
                </tr>
                <tr className="fw-bold bg-primary text-white">
                  <td colSpan={2}>Cash and Cash Equivalents at End of Period</td>
                  <td className="text-end">Rs {totals.endingCash.toLocaleString()}</td>
                  <td className="text-center">{currency}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DATATABLE SECTION */}
        <ErpDataTable
          columns={columns}
          data={filteredEntries}
          searchable
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search cash flow entries..."
          emptyMessage="No cash flow entries found."
          emptyIcon={faFileInvoice}
          isDark={isDark}
          title="Cash Flow Entries Registry"
          titleIcon={faFileInvoice}
          exportButtons={exportButtons}
        />

      </div>

      {/* DETAIL DRAWER */}
      {selectedItem && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '45%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Cash Flow Action Log</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedItem.name}</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedItem(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="p-3 rounded mb-4" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
              <span className="text-muted small d-block">Sub-ledger Impact Value</span>
              <h3 className={`fw-bold ${selectedItem.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                Rs {selectedItem.amount.toLocaleString()}
              </h3>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <span className="text-muted small d-block">Transaction Code</span>
                <strong style={{ color: textColor }}>{selectedItem.code}</strong>
              </div>
              <div className="col-6">
                <span className="text-muted small d-block">Posting Category</span>
                <strong style={{ color: textColor }}>{selectedItem.category}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {viewItem && (
        <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setViewItem(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-content" style={{ borderRadius: '16px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, background: isDark ? '#1e293b' : '#ffffff', overflow: 'hidden' }}>
              <div className="modal-header border-0 d-flex justify-content-between align-items-center" style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                <div className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFileInvoice} style={{ color: colors.primary, fontSize: '1rem' }} />
                  <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>Cash Flow Entry Preview</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1" style={{ fontSize: '0.7rem', background: viewItem.status === 'Posted' ? (isDark ? '#064e3b' : '#dcfce7') : viewItem.status === 'Approved' ? (isDark ? '#1e3a5f' : '#e0f2fe') : (isDark ? '#713f12' : '#fef3c7'), color: viewItem.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Approved' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706'), borderRadius: '20px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: viewItem.status === 'Posted' ? (isDark ? '#4ade80' : '#16a34a') : viewItem.status === 'Approved' ? (isDark ? '#38bdf8' : '#0284c7') : (isDark ? '#fbbf24' : '#d97706') }} />
                    {viewItem.status}
                  </span>
                  <button onClick={() => setViewItem(null)} className="btn-close" aria-label="Close" style={{ filter: isDark ? 'invert(1)' : 'none', fontSize: '0.7rem' }}></button>
                </div>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: textColor, fontSize: '1.1rem' }}>{viewItem.code}</h4>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.8rem' }}>{viewItem.name}</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1" style={{ color: mutedColor, fontSize: '0.75rem' }}>Section: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.section}</span></p>
                    <p className="mb-0" style={{ color: mutedColor, fontSize: '0.75rem' }}>Category: <span className="fw-semibold" style={{ color: textColor }}>{viewItem.category}</span></p>
                  </div>
                </div>
                <div className="rounded-3 p-3 mb-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</small>
                      <p className={`mb-0 mt-1 fw-bold font-monospace ${viewItem.amount < 0 ? 'text-danger' : 'text-success'}`} style={{ fontSize: '1.1rem' }}>Rs {viewItem.amount.toLocaleString()}</p>
                    </div>
                    <div className="col-6">
                      <small style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</small>
                      <p className="mb-0 mt-1 fw-semibold" style={{ color: textColor, fontSize: '0.85rem' }}>{viewItem.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <DeleteConfirmDialog
        show={deleteDialog.show}
        onHide={() => setDeleteDialog({ show: false, id: null, name: '', row: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Cash Flow Entry"
        message="Are you sure you want to delete this cash flow entry? This action cannot be undone."
        itemName={deleteDialog.name ? `${deleteDialog.id} - ${deleteDialog.name}` : ''}
        confirmLabel="Delete Entry"
      />

    </div>
  );
};

export default ErpCashFlow;
