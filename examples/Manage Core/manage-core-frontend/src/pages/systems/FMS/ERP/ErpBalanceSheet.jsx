import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faArrowTrendUp, faArrowTrendDown,
  faLightbulb, faSlidersH, faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';

const ErpBalanceSheet = () => {
  const { theme, addNotification, setActiveTab } = useApp();
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

  // State Management
  const [asOfDate, setAsOfDate] = useState('2026-07-08');
  const [company, setCompany] = useState('Manage Core Ltd');
  const [branch, setBranch] = useState('All');
  const [businessUnit, setBusinessUnit] = useState('All');
  const [fiscalYear, setFiscalYear] = useState('2026');
  const [period, setPeriod] = useState('Jul-2026');
  const [currency, setCurrency] = useState('PKR');
  const [ledger, setLedger] = useState('General Ledger');
  const [costCenter, setCostCenter] = useState('All');
  const [department, setDepartment] = useState('All');
  const [project, setProject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabSubView, setActiveTabSubView] = useState('balance_sheet'); // balance_sheet | assets_analysis | liabilities_analysis | equity_analysis | validation_engine
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Grouping Options
  const [groupBy, setGroupBy] = useState('Type'); // Type | Branch | Department
  const [expandedGroups, setExpandedGroups] = useState({
    currentAssets: true,
    nonCurrentAssets: true,
    currentLiabilities: true,
    longTermLiabilities: true,
    equity: true
  });

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

  // Mock Financial Balance Sheet Tree
  const initialAssets = {
    currentAssets: [
      { code: '100100', name: 'Cash in Hand', balance: 45000, status: 'Active', category: 'Cash & Cash Equivalents' },
      { code: '100200', name: 'Cash at Bank (HBL)', balance: 1850000, status: 'Active', category: 'Bank Accounts' },
      { code: '100300', name: 'Petty Cash Operations', balance: 12000, status: 'Active', category: 'Petty Cash' },
      { code: '110100', name: 'Accounts Receivable (Trade Debtors)', balance: 650000, status: 'Active', category: 'Trade Receivables' },
      { code: '110200', name: 'Customer Advances', balance: 75000, status: 'Active', category: 'Customer Advances' },
      { code: '120100', name: 'Inventory - Raw Materials', balance: 350000, status: 'Active', category: 'Inventory' },
      { code: '120200', name: 'Inventory - Finished Goods', balance: 520000, status: 'Active', category: 'Inventory' },
      { code: '120300', name: 'Inventory - Work in Progress', balance: 180000, status: 'Active', category: 'Inventory' },
      { code: '130100', name: 'Short-Term Investments', balance: 250000, status: 'Active', category: 'Short-Term Investments' },
      { code: '140100', name: 'Prepaid Expenses', balance: 60000, status: 'Active', category: 'Prepaid Expenses' },
      { code: '150100', name: 'Withholding Tax Receivable', balance: 34000, status: 'Active', category: 'Withholding Tax Receivable' },
      { code: '150200', name: 'Income Tax Receivable', balance: 48000, status: 'Active', category: 'Income Tax Receivable' }
    ],
    nonCurrentAssets: [
      { code: '170100', name: 'Land - HQ Plot', balance: 2500000, status: 'Active', category: 'Land' },
      { code: '170200', name: 'Building - HQ Office', balance: 4200000, status: 'Active', category: 'Buildings' },
      { code: '170300', name: 'Office Equipment', balance: 320000, status: 'Active', category: 'Office Equipment' },
      { code: '170400', name: 'Furniture & Fixtures', balance: 180000, status: 'Active', category: 'Furniture' },
      { code: '170500', name: 'Vehicles', balance: 950000, status: 'Active', category: 'Motor Vehicles' },
      { code: '170600', name: 'Computers & Laptops', balance: 280000, status: 'Active', category: 'Computers' },
      { code: '170700', name: 'Servers & Network Equipment', balance: 450000, status: 'Active', category: 'Servers' },
      { code: '170800', name: 'Machinery & Tools', balance: 1200000, status: 'Active', category: 'Machinery' },
      { code: '180100', name: 'Goodwill Asset', balance: 800000, status: 'Active', category: 'Goodwill' },
      { code: '180200', name: 'Software Licenses', balance: 150000, status: 'Active', category: 'Software' },
      { code: '180300', name: 'Patents & Trademarks', balance: 500000, status: 'Active', category: 'Patents' },
      { code: '199999', name: 'Accumulated Depreciation', balance: -850000, status: 'Active', category: 'Accumulated Depreciation' }
    ]
  };

  const initialLiabilities = {
    currentLiabilities: [
      { code: '200100', name: 'Accounts Payable (Trade Creditors)', balance: 420000, status: 'Active', category: 'Trade Creditors' },
      { code: '200200', name: 'Accrued Salaries', balance: 180000, status: 'Active', category: 'Accrued Salaries' },
      { code: '200300', name: 'Payroll Taxes Liabilities', balance: 45000, status: 'Active', category: 'Payroll Liabilities' },
      { code: '210100', name: 'Sales Tax Payable', balance: 120000, status: 'Active', category: 'Sales Tax Payable' },
      { code: '210200', name: 'Income Tax Payable', balance: 185005, status: 'Active', category: 'Income Tax Payable' },
      { code: '220100', name: 'Short-Term Bank Loans', balance: 600000, status: 'Active', category: 'Short-Term Loans' },
      { code: '220200', name: 'Bank Overdraft', balance: 95000, status: 'Active', category: 'Bank Overdraft' },
      { code: '230100', name: 'Unearned SaaS Revenue', balance: 350000, status: 'Active', category: 'Unearned Revenue' },
      { code: '230200', name: 'Customer Deposits Holding', balance: 50000, status: 'Active', category: 'Customer Deposits' }
    ],
    longTermLiabilities: [
      { code: '250100', name: 'Long-Term Bank Loan (Meezan)', balance: 3500000, status: 'Active', category: 'Long-Term Bank Loans' },
      { code: '250200', name: 'Mortgage Payables', balance: 1800000, status: 'Active', category: 'Mortgage' },
      { code: '260100', name: 'Deferred Tax Liabilities', balance: 280000, status: 'Active', category: 'Deferred Tax' },
      { code: '270100', name: 'Pension Obligations', balance: 420000, status: 'Active', category: 'Pension Liabilities' }
    ],
    equity: [
      { code: '300100', name: 'Share Capital (Paid-up)', balance: 4000000, status: 'Active', category: 'Share Capital' },
      { code: '300200', name: 'Owner Investment capital', balance: 1500000, status: 'Active', category: 'Owner Investment' },
      { code: '310100', name: 'Retained Earnings (Prior Years)', balance: 1678995, status: 'Active', category: 'Retained Earnings' },
      { code: '320100', name: 'Current Year Net Profit', balance: 620000, status: 'Active', category: 'Current Year Profit' },
      { code: '330100', name: 'General Reserve Pool', balance: 300000, status: 'Active', category: 'General Reserve' },
      { code: '330200', name: 'Capital Reserves Account', balance: 200000, status: 'Active', category: 'Capital Reserve' },
      { code: '399100', name: 'Owner Drawings', balance: -150000, status: 'Active', category: 'Owner Drawings' }
    ]
  };

  // Live Recalculations
  const totals = useMemo(() => {
    const sum = (list) => list.reduce((acc, item) => acc + item.balance, 0);

    const currentAssets = sum(initialAssets.currentAssets);
    const nonCurrentAssets = sum(initialAssets.nonCurrentAssets);
    const totalAssets = currentAssets + nonCurrentAssets;

    const currentLiabilities = sum(initialLiabilities.currentLiabilities);
    const longTermLiabilities = sum(initialLiabilities.longTermLiabilities);
    const totalLiabilities = currentLiabilities + longTermLiabilities;

    const totalEquity = sum(initialLiabilities.equity);

    const equationDifference = totalAssets - (totalLiabilities + totalEquity);

    return {
      currentAssets,
      nonCurrentAssets,
      totalAssets,
      currentLiabilities,
      longTermLiabilities,
      totalLiabilities,
      totalEquity,
      totalLiabilitiesEquity: totalLiabilities + totalEquity,
      difference: equationDifference,
      isBalanced: equationDifference === 0,
      workingCapital: currentAssets - currentLiabilities,
      currentRatio: currentLiabilities > 0 ? (currentAssets / currentLiabilities).toFixed(2) : 'N/A',
      debtRatio: totalAssets > 0 ? (totalLiabilities / totalAssets).toFixed(2) : 'N/A',
      debtToEquityRatio: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 'N/A',
      quickRatio: currentLiabilities > 0 ? ((currentAssets - 1050000) / currentLiabilities).toFixed(2) : 'N/A', // subtracting inventories
      netAssets: totalAssets - totalLiabilities
    };
  }, [initialAssets, initialLiabilities]);

  // Validation Audits
  const validationAudits = [
    { title: 'Accounting Equation Status', status: totals.isBalanced ? 'Passed' : 'Failed', desc: `Assets equals Liabilities + Equity. Discrepancy is $${totals.difference.toLocaleString()}`, time: '0.02ms' },
    { title: 'Debit Equals Credit Validation', status: 'Passed', desc: 'Double-entry general ledger journal transactions are fully aligned.', time: '0.01ms' },
    { title: 'Opening Balances Integration', status: 'Passed', desc: 'Prior year closing balances successfully carried forward to retained earnings.', time: '0.05ms' },
    { title: 'Negative Asset Audit', status: 'Warning', desc: 'Accumulated Depreciation has a negative balance as expected, but review code 199999 for validation.', time: '0.04ms' },
    { title: 'Dormant Account Check', status: 'Passed', desc: 'No transaction activity issues or orphan accounts detected.', time: '0.02ms' }
  ];

  // Helper filters
  const filterList = (list) => {
    return list.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleQuickFilter = (type) => {
    addNotification(`Quick filter applied: ${type}`, 'success');
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} className="mb-4" />
          <div className="row g-4">
            <div className="col-lg-6"><div style={{ height: 400, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            <div className="col-lg-6"><div style={{ height: 400, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* 1. PAGE HEADER */}
      <ErpReportHeader
        title="Balance Sheet"
        badge="Accounting / ERP"
        description="Display company financial position by presenting Assets, Liabilities, Equity, and Current Year Profit/Loss as of the selected reporting date."
        isDark={isDark}
        activeTabId="bs"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Profit & Loss', icon: faFileInvoice, onClick: () => setActiveTab('erp_profit_loss'), variant: 'outline' }
        ]}
      />

      {/* 2. REPORT NAVIGATION IN-COMPONENT */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        
        {/* 3. FILTER PANEL */}
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: cardBg }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
              Statement Configuration Panel
            </h6>
            <div className="d-flex gap-1">
              <button className="btn btn-xs btn-light border px-2 py-1" style={{ fontSize: '11px' }} onClick={() => handleQuickFilter('Today')}>Today</button>
              <button className="btn btn-xs btn-light border px-2 py-1" style={{ fontSize: '11px' }} onClick={() => handleQuickFilter('End of Month')}>EOM</button>
              <button className="btn btn-xs btn-light border px-2 py-1" style={{ fontSize: '11px' }} onClick={() => handleQuickFilter('End of Quarter')}>EOQ</button>
              <button className="btn btn-xs btn-light border px-2 py-1" style={{ fontSize: '11px' }} onClick={() => handleQuickFilter('End of Fiscal Year')}>EOY</button>
            </div>
          </div>
          
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">As Of Date</label>
              <input type="date" className="form-control form-control-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={asOfDate} onChange={e => setAsOfDate(e.target.value)} />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Company</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={company} onChange={e => setCompany(e.target.value)}>
                <option>Manage Core Ltd</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Branch</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={branch} onChange={e => setBranch(e.target.value)}>
                <option value="All">All Branches</option>
                <option value="HQ">HQ Lahore</option>
                <option value="KHI">Karachi Branch</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Business Unit</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={businessUnit} onChange={e => setBusinessUnit(e.target.value)}>
                <option value="All">All Units</option>
                <option value="SaaS">SaaS division</option>
                <option value="Services">Consulting division</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Fiscal Year</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={fiscalYear} onChange={e => setFiscalYear(e.target.value)}>
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Accounting Period</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={period} onChange={e => setPeriod(e.target.value)}>
                <option>Jul-2026</option>
                <option>Jun-2026</option>
                <option>Q2-2026</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Currency</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={currency} onChange={e => setCurrency(e.target.value)}>
                <option>PKR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label x-small text-muted fw-semibold">Ledger</label>
              <select className="form-select form-select-sm" style={{ backgroundColor: inputBg, color: textColor, borderColor: borderColor }} value={ledger} onChange={e => setLedger(e.target.value)}>
                <option>General Ledger</option>
                <option>Consolidated Ledger</option>
              </select>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('View Settings Saved.', 'success')}>Save View</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('Balance sheet statement generated.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Exporting to Excel...', 'info')}><FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel</button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Generating PDF...', 'info')}><FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF</button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Sent print request.', 'success')}><FontAwesomeIcon icon={faPrint} className="me-1" /> Print</button>
            </div>
          </div>
        </div>

        {/* 4. BALANCE SHEET KPI CARDS */}
        <div className="row g-3 mb-4">
          <ErpKpiCard label="Assets" value={`Rs ${totals.totalAssets.toLocaleString()}`} icon={faArrowTrendUp} color="#3B82F6" isDark={isDark} />
          <ErpKpiCard label="Liabilities" value={`Rs ${totals.totalLiabilities.toLocaleString()}`} icon={faArrowTrendDown} color="#F59E0B" isDark={isDark} />
          <ErpKpiCard label="Equity" value={`Rs ${totals.totalEquity.toLocaleString()}`} icon={faScaleBalanced} color="#10B981" isDark={isDark} />
          <ErpKpiCard 
            label="Accounting Equation" 
            value={totals.isBalanced ? 'Balanced' : `Imbalance: Rs ${totals.difference.toLocaleString()}`} 
            icon={faCalculator} 
            color={totals.isBalanced ? '#10B981' : '#EF4444'} 
            isDark={isDark} 
            badge={totals.isBalanced ? 'Pass' : 'Mismatch'}
          />
        </div>

        {/* SECTION NAVTABS */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <button className={`btn btn-sm ${activeTabSubView === 'balance_sheet' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTabSubView('balance_sheet')}>Balance Sheet Statement</button>
          <button className={`btn btn-sm ${activeTabSubView === 'assets_analysis' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTabSubView('assets_analysis')}>Assets Analysis</button>
          <button className={`btn btn-sm ${activeTabSubView === 'liabilities_analysis' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTabSubView('liabilities_analysis')}>Liabilities Analysis</button>
          <button className={`btn btn-sm ${activeTabSubView === 'equity_analysis' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTabSubView('equity_analysis')}>Equity Analysis</button>
          <button className={`btn btn-sm ${activeTabSubView === 'validation_engine' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTabSubView('validation_engine')}>Validation Engine</button>
        </div>

        {/* VIEW A: DYNAMIC LAYOUT ACCORDING TO SUBTABS */}
        {activeTabSubView === 'balance_sheet' && (
          <div className="row g-4">
            
            {/* LEFT PANEL: ASSETS TABLE */}
            <div className="col-lg-6 col-md-12">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold mb-0 text-primary">Assets Statement Ledger</h6>
                  <div className="d-flex gap-1">
                    <button className="btn btn-xs btn-outline-success py-1" style={{ fontSize: '10px' }} onClick={() => addNotification('Assets Excel Exported.', 'success')}>Excel</button>
                    <button className="btn btn-xs btn-outline-danger py-1" style={{ fontSize: '10px' }} onClick={() => addNotification('Assets PDF Exported.', 'success')}>PDF</button>
                  </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table className="table table-sm align-middle" style={{ color: textColor }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                        <th style={{ color: mutedColor }}>Code</th>
                        <th style={{ color: mutedColor }}>Account Title</th>
                        <th style={{ color: mutedColor }} className="text-end">Balance</th>
                        <th style={{ color: mutedColor }} className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Current Assets */}
                      <tr className="table-light fw-bold" onClick={() => setExpandedGroups({...expandedGroups, currentAssets: !expandedGroups.currentAssets})} style={{ cursor: 'pointer' }}>
                        <td colSpan={3}>
                          <FontAwesomeIcon icon={faChevronDown} className={`me-2 small transition-all ${expandedGroups.currentAssets ? '' : 'rotate-270'}`} />
                          100000 - Current Assets
                        </td>
                        <td className="text-end text-primary">Rs {totals.currentAssets.toLocaleString()}</td>
                      </tr>
                      {expandedGroups.currentAssets && filterList(initialAssets.currentAssets).map(row => (
                        <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td className="font-monospace text-muted">{row.code}</td>
                          <td>
                            <button className="btn btn-link p-0 fw-bold text-start text-decoration-none" style={{ color: textColor }} onClick={() => setSelectedAccount({...row, type: 'Asset', group: 'Current Assets'})}>
                              {row.name}
                            </button>
                          </td>
                          <td className={`text-end ${row.balance < 0 ? 'text-danger' : 'text-slate-800'}`}>
                            Rs {row.balance.toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedAccount({...row, type: 'Asset', group: 'Current Assets'})}>Drill Down</button>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Non Current Assets */}
                      <tr className="table-light fw-bold" onClick={() => setExpandedGroups({...expandedGroups, nonCurrentAssets: !expandedGroups.nonCurrentAssets})} style={{ cursor: 'pointer' }}>
                        <td colSpan={3}>
                          <FontAwesomeIcon icon={faChevronDown} className={`me-2 small transition-all ${expandedGroups.nonCurrentAssets ? '' : 'rotate-270'}`} />
                          170000 - Non Current Assets
                        </td>
                        <td className="text-end text-primary">Rs {totals.nonCurrentAssets.toLocaleString()}</td>
                      </tr>
                      {expandedGroups.nonCurrentAssets && filterList(initialAssets.nonCurrentAssets).map(row => (
                        <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td className="font-monospace text-muted">{row.code}</td>
                          <td>
                            <button className="btn btn-link p-0 fw-bold text-start text-decoration-none" style={{ color: textColor }} onClick={() => setSelectedAccount({...row, type: 'Asset', group: 'Non-Current Assets'})}>
                              {row.name}
                            </button>
                          </td>
                          <td className={`text-end ${row.balance < 0 ? 'text-danger' : 'text-slate-800'}`}>
                            Rs {row.balance.toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedAccount({...row, type: 'Asset', group: 'Non-Current Assets'})}>Drill Down</button>
                          </td>
                        </tr>
                      ))}

                      {/* Grand Total Row */}
                      <tr className="fw-bold text-white bg-primary" style={{ fontSize: '1.05rem' }}>
                        <td colSpan={2}>Grand Total Assets</td>
                        <td className="text-end">Rs {totals.totalAssets.toLocaleString()}</td>
                        <td className="text-center">{currency}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: LIABILITIES & EQUITY */}
            <div className="col-lg-6 col-md-12">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold mb-0 text-warning">Liabilities & Equity Ledger</h6>
                  <div className="d-flex gap-1">
                    <button className="btn btn-xs btn-outline-success py-1" style={{ fontSize: '10px' }} onClick={() => addNotification('Liabilities Excel Exported.', 'success')}>Excel</button>
                    <button className="btn btn-xs btn-outline-danger py-1" style={{ fontSize: '10px' }} onClick={() => addNotification('Liabilities PDF Exported.', 'success')}>PDF</button>
                  </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table className="table table-sm align-middle" style={{ color: textColor }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                        <th style={{ color: mutedColor }}>Code</th>
                        <th style={{ color: mutedColor }}>Account Title</th>
                        <th style={{ color: mutedColor }} className="text-end">Balance</th>
                        <th style={{ color: mutedColor }} className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Current Liabilities */}
                      <tr className="table-light fw-bold" onClick={() => setExpandedGroups({...expandedGroups, currentLiabilities: !expandedGroups.currentLiabilities})} style={{ cursor: 'pointer' }}>
                        <td colSpan={3}>
                          <FontAwesomeIcon icon={faChevronDown} className={`me-2 small transition-all ${expandedGroups.currentLiabilities ? '' : 'rotate-270'}`} />
                          200000 - Current Liabilities
                        </td>
                        <td className="text-end text-warning">Rs {totals.currentLiabilities.toLocaleString()}</td>
                      </tr>
                      {expandedGroups.currentLiabilities && filterList(initialLiabilities.currentLiabilities).map(row => (
                        <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td className="font-monospace text-muted">{row.code}</td>
                          <td>
                            <button className="btn btn-link p-0 fw-bold text-start text-decoration-none" style={{ color: textColor }} onClick={() => setSelectedAccount({...row, type: 'Liability', group: 'Current Liabilities'})}>
                              {row.name}
                            </button>
                          </td>
                          <td className={`text-end ${row.balance < 0 ? 'text-danger' : 'text-slate-800'}`}>
                            Rs {row.balance.toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedAccount({...row, type: 'Liability', group: 'Current Liabilities'})}>Drill Down</button>
                          </td>
                        </tr>
                      ))}

                      {/* Long Term Liabilities */}
                      <tr className="table-light fw-bold" onClick={() => setExpandedGroups({...expandedGroups, longTermLiabilities: !expandedGroups.longTermLiabilities})} style={{ cursor: 'pointer' }}>
                        <td colSpan={3}>
                          <FontAwesomeIcon icon={faChevronDown} className={`me-2 small transition-all ${expandedGroups.longTermLiabilities ? '' : 'rotate-270'}`} />
                          250000 - Long Term Liabilities
                        </td>
                        <td className="text-end text-warning">Rs {totals.longTermLiabilities.toLocaleString()}</td>
                      </tr>
                      {expandedGroups.longTermLiabilities && filterList(initialLiabilities.longTermLiabilities).map(row => (
                        <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td className="font-monospace text-muted">{row.code}</td>
                          <td>
                            <button className="btn btn-link p-0 fw-bold text-start text-decoration-none" style={{ color: textColor }} onClick={() => setSelectedAccount({...row, type: 'Liability', group: 'Long-Term Liabilities'})}>
                              {row.name}
                            </button>
                          </td>
                          <td className={`text-end ${row.balance < 0 ? 'text-danger' : 'text-slate-800'}`}>
                            Rs {row.balance.toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedAccount({...row, type: 'Liability', group: 'Long-Term Liabilities'})}>Drill Down</button>
                          </td>
                        </tr>
                      ))}

                      {/* Equity */}
                      <tr className="table-light fw-bold" onClick={() => setExpandedGroups({...expandedGroups, equity: !expandedGroups.equity})} style={{ cursor: 'pointer' }}>
                        <td colSpan={3}>
                          <FontAwesomeIcon icon={faChevronDown} className={`me-2 small transition-all ${expandedGroups.equity ? '' : 'rotate-270'}`} />
                          300000 - Equity Accounts
                        </td>
                        <td className="text-end text-success">Rs {totals.totalEquity.toLocaleString()}</td>
                      </tr>
                      {expandedGroups.equity && filterList(initialLiabilities.equity).map(row => (
                        <tr key={row.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                          <td className="font-monospace text-muted">{row.code}</td>
                          <td>
                            <button className="btn btn-link p-0 fw-bold text-start text-decoration-none" style={{ color: textColor }} onClick={() => setSelectedAccount({...row, type: 'Equity', group: 'Equity Pool'})}>
                              {row.name}
                            </button>
                          </td>
                          <td className={`text-end ${row.balance < 0 ? 'text-danger' : 'text-slate-800'}`}>
                            Rs {row.balance.toLocaleString()}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-xs btn-link p-0" style={{ fontSize: '11px' }} onClick={() => setSelectedAccount({...row, type: 'Equity', group: 'Equity Pool'})}>Drill Down</button>
                          </td>
                        </tr>
                      ))}

                      {/* Grand Totals */}
                      <tr className="fw-bold text-white bg-warning" style={{ fontSize: '1.05rem' }}>
                        <td colSpan={2}>Total Liabilities & Equity</td>
                        <td className="text-end">Rs {totals.totalLiabilitiesEquity.toLocaleString()}</td>
                        <td className="text-center">{currency}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* FINANCIAL RATIOS AND POSITION SUMMARY */}
            <div className="col-12 mt-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
                  Financial Position Summary & Ratios
                </h6>
                <div className="row g-3">
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 rounded border" style={{ borderColor: borderColor }}>
                      <span className="text-muted x-small d-block font-monospace">Working Capital</span>
                      <strong className="fs-5" style={{ color: textColor }}>Rs {totals.workingCapital.toLocaleString()}</strong>
                      <span className="small text-success d-block">Liquidity: High</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 rounded border" style={{ borderColor: borderColor }}>
                      <span className="text-muted x-small d-block font-monospace">Current Ratio</span>
                      <strong className="fs-5" style={{ color: textColor }}>{totals.currentRatio}</strong>
                      <span className="small text-success d-block">Optimal (Target &gt; 1.5)</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 rounded border" style={{ borderColor: borderColor }}>
                      <span className="text-muted x-small d-block font-monospace">Debt-to-Equity Ratio</span>
                      <strong className="fs-5" style={{ color: textColor }}>{totals.debtToEquityRatio}</strong>
                      <span className="small text-warning d-block">Moderate Leverage</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6">
                    <div className="p-3 rounded border" style={{ borderColor: borderColor }}>
                      <span className="text-muted x-small d-block font-monospace">Quick Ratio</span>
                      <strong className="fs-5" style={{ color: textColor }}>{totals.quickRatio}</strong>
                      <span className="small text-success d-block">Healthy Cash Buffer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW B: ASSETS ANALYSIS */}
        {activeTabSubView === 'assets_analysis' && (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: textColor }}>Assets Analysis Dashboard</h5>
                <p className="text-muted small mb-0">Deep dive analysis of current/non-current assets, deprecations, and budgets.</p>
              </div>
              <button className="btn btn-sm btn-outline-primary" onClick={() => addNotification('Insights refreshed.', 'success')}><FontAwesomeIcon icon={faRefresh} /></button>
            </div>
            
            <div className="table-responsive">
              <table className="table table-bordered table-striped" style={{ color: textColor, borderColor: borderColor }}>
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Account Name</th>
                    <th>Opening Balance</th>
                    <th>Debit (Inflow)</th>
                    <th>Credit (Outflow)</th>
                    <th>Closing Balance</th>
                    <th>Budget Limit</th>
                    <th>Variance %</th>
                    <th>Responsible Dept</th>
                  </tr>
                </thead>
                <tbody>
                  {initialAssets.currentAssets.map(asset => (
                    <tr key={asset.code}>
                      <td className="font-monospace small">{asset.code}</td>
                      <td>{asset.name}</td>
                      <td>Rs {(asset.balance * 0.95).toFixed(0)}</td>
                      <td>Rs {(asset.balance * 0.15).toFixed(0)}</td>
                      <td>Rs {(asset.balance * 0.1).toFixed(0)}</td>
                      <td className="fw-bold">Rs {asset.balance.toLocaleString()}</td>
                      <td>Rs {(asset.balance * 1.1).toFixed(0)}</td>
                      <td className="text-success">+10%</td>
                      <td>Finance Operations</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW C: LIABILITIES ANALYSIS */}
        {activeTabSubView === 'liabilities_analysis' && (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
            <h5 className="fw-bold mb-3" style={{ color: textColor }}>Liabilities Analysis Dashboard</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped" style={{ color: textColor, borderColor: borderColor }}>
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Account Name</th>
                    <th>Current Balance</th>
                    <th>Previous Balance</th>
                    <th>Budget Allocation</th>
                    <th>Variance Amount</th>
                    <th>Growth Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {initialLiabilities.currentLiabilities.map(liab => (
                    <tr key={liab.code}>
                      <td className="font-monospace small">{liab.code}</td>
                      <td>{liab.name}</td>
                      <td className="fw-bold">Rs {liab.balance.toLocaleString()}</td>
                      <td>Rs {(liab.balance * 0.92).toFixed(0)}</td>
                      <td>Rs {(liab.balance * 1.05).toFixed(0)}</td>
                      <td className="text-success">Rs {(liab.balance * 0.05).toFixed(0)}</td>
                      <td className="text-danger">+8.2%</td>
                      <td><span className="badge bg-success">Normal</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW D: EQUITY ANALYSIS */}
        {activeTabSubView === 'equity_analysis' && (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
            <h5 className="fw-bold mb-3" style={{ color: textColor }}>Equity Analysis Dashboard</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped" style={{ color: textColor, borderColor: borderColor }}>
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Shareholder Pool Account</th>
                    <th>Opening Capital</th>
                    <th>Movement Inflow</th>
                    <th>Movement Outflow</th>
                    <th>Closing Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {initialLiabilities.equity.map(eq => (
                    <tr key={eq.code}>
                      <td className="font-monospace small">{eq.code}</td>
                      <td>{eq.name}</td>
                      <td>Rs {(eq.balance * 0.98).toFixed(0)}</td>
                      <td>Rs {(eq.balance * 0.02).toFixed(0)}</td>
                      <td>Rs 0</td>
                      <td className="fw-bold text-success">Rs {eq.balance.toLocaleString()}</td>
                      <td><span className="badge bg-success">Secured</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW E: VALIDATION ENGINE */}
        {activeTabSubView === 'validation_engine' && (
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Accounting Double-Entry Validation Audits</h5>
              <button className="btn btn-sm btn-primary" onClick={() => addNotification('Re-ran validation checks.', 'success')}><FontAwesomeIcon icon={faRefresh} className="me-1" /> Re-audit</button>
            </div>
            
            <div className="row g-3">
              {validationAudits.map((audit, i) => (
                <div key={i} className="col-md-6 col-sm-12">
                  <div className="p-3 rounded border d-flex justify-content-between align-items-start" style={{ borderColor: borderColor }}>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: textColor }}>{audit.title}</h6>
                      <p className="text-muted small mb-0">{audit.desc}</p>
                      <span className="x-small text-muted font-monospace mt-1 d-block">Latency: {audit.time}</span>
                    </div>
                    <span className={`badge ${audit.status === 'Passed' ? 'bg-success' : audit.status === 'Warning' ? 'bg-warning' : 'bg-danger'}`}>
                      {audit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. ACCOUNT DETAILS DRAWER */}
      {selectedAccount && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '45%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Account Profile Drawer</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedAccount.name} ({selectedAccount.code})</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedAccount(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="mb-4">
              <h6 className="fw-bold text-primary">General Ledger Placement</h6>
              <div className="row g-3 mt-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Account Type</span>
                  <strong style={{ color: textColor }}>{selectedAccount.type}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Account Group</span>
                  <strong style={{ color: textColor }}>{selectedAccount.group}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Currency Unit</span>
                  <strong style={{ color: textColor }}>{currency}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Responsible Dept</span>
                  <strong style={{ color: textColor }}>Finance Operations</strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded mb-4" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
              <span className="text-muted small d-block">Current Statement Balance</span>
              <h3 className="fw-bold text-primary">Rs {selectedAccount.balance.toLocaleString()}</h3>
            </div>
            
            <div className="mb-4">
              <h6 className="fw-bold text-primary">Internal Notes & Descriptions</h6>
              <p className="small text-muted">This ledger account represents the dynamic posted double-entry records mapped across all corporate bank balances, cashier systems, and accounting workflows.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ErpBalanceSheet;
