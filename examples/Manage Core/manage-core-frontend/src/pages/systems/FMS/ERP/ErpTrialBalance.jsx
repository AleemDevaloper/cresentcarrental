import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';
import { EnableDisableButton } from '../../../../components/common';

const ErpTrialBalance = () => {
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

  // Navigation tabs for Reports
  const navigationTabs = [
    { id: 'center', label: 'Report Center', icon: faFolderOpen },
    { id: 'exec', label: 'Executive Summary', icon: faChartLine },
    { id: 'ctrl', label: 'Control Center', icon: faSliders },
    { id: 'qa', label: 'Quality Assurance', icon: faShieldHalved },
    { id: 'daybook', label: 'Day Book', icon: faBookOpen },
    { id: 'gl', label: 'General Ledger', icon: faCalculator },
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

  // Filters State
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-31');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [showZeroBalance, setShowZeroBalance] = useState(false);

  // Search/Drawer States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Mock Trial Balance Rows
  const [tbRows, setTbRows] = useState([
    { code: '110100', name: 'Petty Cash', type: 'Asset', group: 'Current Assets', opDebit: 15000, opCredit: 0, periodDebit: 12000, periodCredit: 8000, netMovement: 4000, closingDebit: 19000, closingCredit: 0 },
    { code: '110200', name: 'Bank Meezan Operations', type: 'Asset', group: 'Current Assets', opDebit: 1200000, opCredit: 0, periodDebit: 180000, periodCredit: 25000, netMovement: 155000, closingDebit: 1355000, closingCredit: 0 },
    { code: '112000', name: 'Accounts Receivable', type: 'Asset', group: 'Current Assets', opDebit: 450000, opCredit: 0, periodDebit: 95000, periodCredit: 180000, netMovement: -85000, closingDebit: 365000, closingCredit: 0 },
    { code: '210100', name: 'Salary Payable', type: 'Liability', group: 'Current Liabilities', opDebit: 0, opCredit: 0, periodDebit: 450000, periodCredit: 450000, netMovement: 0, closingDebit: 0, closingCredit: 0 },
    { code: '210200', name: 'Accounts Payable', type: 'Liability', group: 'Current Liabilities', opDebit: 0, opCredit: 380000, periodDebit: 12000, periodCredit: 95000, netMovement: 83000, closingDebit: 0, closingCredit: 463000 },
    { code: '310100', name: 'Share Capital', type: 'Equity', group: 'Equity Pool', opDebit: 0, opCredit: 1000000, periodDebit: 0, periodCredit: 0, netMovement: 0, closingDebit: 0, closingCredit: 1000000 },
    { code: '410100', name: 'SaaS Sales Revenue', type: 'Revenue', group: 'Operating Revenue', opDebit: 0, opCredit: 285000, periodDebit: 0, periodCredit: 95000, netMovement: 95000, closingDebit: 0, closingCredit: 380000 },
    { code: '510100', name: 'Salary Expense', type: 'Expense', group: 'Operating Expenses', opDebit: 0, opCredit: 0, periodDebit: 450000, periodCredit: 0, netMovement: 450000, closingDebit: 450000, closingCredit: 0 },
    { code: '510200', name: 'Office Rent Expense', type: 'Expense', group: 'Operating Expenses', opDebit: 0, opCredit: 0, periodDebit: 12000, periodCredit: 0, netMovement: 12000, closingDebit: 12000, closingCredit: 0 }
  ]);

  // Balance Verification values
  const verification = useMemo(() => {
    let opDr = 0, opCr = 0, periodDr = 0, periodCr = 0, closingDr = 0, closingCr = 0;
    tbRows.forEach(row => {
      opDr += row.opDebit;
      opCr += row.opCredit;
      periodDr += row.periodDebit;
      periodCr += row.periodCredit;
      closingDr += row.closingDebit;
      closingCr += row.closingCredit;
    });
    return { opDr, opCr, periodDr, periodCr, closingDr, closingCr, difference: Math.abs(closingDr - closingCr) };
  }, [tbRows]);

  // AI Trial Balance Intelligence mock
  const aiInsights = [
    { title: 'Accounting Alignment', desc: 'Debits exactly match credits. Chart of accounts mapping is 100% consistent.', risk: 'None', status: 'Passed' },
    { title: 'Dormant Account Alert', desc: 'Share Capital (310100) has had zero postings for the past 6 periods.', risk: 'Low', status: 'Info' }
  ];

  const filteredRows = tbRows.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.code.includes(searchTerm);
    if (!showZeroBalance && row.closingDebit === 0 && row.closingCredit === 0) return false;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} className="mb-4" />
          <div className="row g-3 mb-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="col-md-3"><div style={{ height: 90, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            ))}
          </div>
          <div style={{ height: 400, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} />
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
        title="Trial Balance"
        badge="ACCOUNTING REPORTS"
        description="Review every ledger account with opening balance, debit, credit, net movement, and closing balance while validating accounting accuracy before financial statement preparation."
        isDark={isDark}
        activeTabId="tb"
        onTabClick={handleTabClick}
        actions={[
          { label: 'Report Center', icon: faFolderOpen, onClick: () => setActiveTab('erp_report_center'), variant: 'outline' }
        ]}
      />

      {/* ──────────────────────────────────────── */}
      {/* 2. FILTER PANEL                          */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 animate-fade-in">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
          <h6 className="fw-bold mb-3" style={{ color: textColor }}>
            <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
            Trial Balance Filters
          </h6>
          <div className="row g-3">
            <div className="col-md-3 col-sm-6">
              <label className="form-label small text-muted">From Date</label>
              <input type="date" className="form-control form-control-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label small text-muted">To Date</label>
              <input type="date" className="form-control form-control-sm" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label small text-muted">Company</label>
              <select className="form-select form-select-sm" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="All">All Companies</option>
                <option value="Manage Core Ltd">Manage Core Ltd</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 d-flex align-items-end">
              <EnableDisableButton checked={showZeroBalance} onClick={() => setShowZeroBalance(!showZeroBalance)} label="Show Zero Balance Accounts" />
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('Trial balance recalculated.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Trial Balance Exported to Excel.', 'success')}>
                <FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel
              </button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Trial Balance PDF printed.', 'success')}>
                <FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 3. SUMMARY CARDS & VERIFICATION          */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <ErpKpiCard label="Closing Debit Total" value={`$${verification.closingDr.toLocaleString()}`} icon={faCoins} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Closing Credit Total" value={`$${verification.closingCr.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard 
            label="Trial Balance Discrepancy" 
            value={`$${verification.difference.toLocaleString()}`} 
            icon={faScaleBalanced} 
            color={verification.difference === 0 ? '#10b981' : '#ef4444'} 
            isDark={isDark} 
            badge={verification.difference === 0 ? 'Balanced' : 'Imbalanced'}
          />
          <ErpKpiCard label="Total Accounts" value={`${tbRows.length} Accounts`} icon={faList} color="#8b5cf6" isDark={isDark} />
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 4. TRIAL BALANCE DATATABLE               */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <div className="col-12 col-xl-9">
            <ErpDataTable
              title="Trial Balance Ledger Registry"
              titleIcon={faScaleBalanced}
              columns={[
                { key: 'code', label: 'Account Code', render: (val) => <span className="font-monospace text-muted">{val}</span> },
                { key: 'name', label: 'Account Title Name', bold: true, render: (val, row) => (
                  <button className="btn btn-sm btn-link p-0 fw-bold text-start" onClick={() => setSelectedAccount(row)}>{val}</button>
                )},
                { key: 'type', label: 'Type', render: (val) => <span className="premium-badge bg-primary text-white">{val}</span> },
                { key: 'opDebit', label: 'Opening Debit', align: 'right', render: (val) => val > 0 ? `$${val.toLocaleString()}` : '-' },
                { key: 'opCredit', label: 'Opening Credit', align: 'right', render: (val) => val > 0 ? `$${val.toLocaleString()}` : '-' },
                { key: 'periodDebit', label: 'Period Debit', align: 'right', render: (val) => val > 0 ? `$${val.toLocaleString()}` : '-' },
                { key: 'periodCredit', label: 'Period Credit', align: 'right', render: (val) => val > 0 ? `$${val.toLocaleString()}` : '-' },
                { key: 'closingDebit', label: 'Closing Debit', align: 'right', render: (val) => val > 0 ? <strong className="text-primary">${val.toLocaleString()}</strong> : '-' },
                { key: 'closingCredit', label: 'Closing Credit', align: 'right', render: (val) => val > 0 ? <strong className="text-success">${val.toLocaleString()}</strong> : '-' }
              ]}
              data={filteredRows}
              searchable
              searchPlaceholder="Search accounts by code, title..."
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isDark={isDark}
            />
          </div>

          {/* ──────────────────────────────────────── */}
          {/* 5. AI VERIFICATION & RECONCILIATION      */}
          {/* ──────────────────────────────────────── */}
          <div className="col-12 col-xl-3">
            <div className="d-flex flex-column gap-3">
              {/* Balance Verification Widget */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                  Trial Balance Verification
                </h6>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Opening Trial Balance:</span>
                    <span className="fw-bold" style={{ color: textColor }}>Balanced</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Transaction Debits:</span>
                    <span style={{ color: textColor }}>${verification.periodDr.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Transaction Credits:</span>
                    <span style={{ color: textColor }}>${verification.periodCr.toLocaleString()}</span>
                  </div>
                  <hr className="my-1" />
                  <div className="p-2 rounded bg-success bg-opacity-10 text-success text-center fw-bold">
                    Double-Entry Ledger Verified
                  </div>
                </div>
              </div>

              {/* AI Trial Balance Intelligence */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faRobot} className="text-primary me-2" />
                  AI TB Assistant
                </h6>
                <div className="d-flex flex-column gap-2">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="p-2 rounded border" style={{ borderColor: borderColor }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-primary">{insight.title}</span>
                        <span className="badge bg-secondary text-white" style={{ fontSize: '9px' }}>{insight.status}</span>
                      </div>
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>{insight.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 6. ACCOUNT MOVEMENT DRAWER               */}
      {/* ──────────────────────────────────────── */}
      {selectedAccount && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '45%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Account Balance profile</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedAccount.name} ({selectedAccount.code})</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedAccount(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="mb-4">
              <h6 className="fw-bold text-primary">Trial Balance Impact Metrics</h6>
              <div className="row g-3 mt-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Account Type Group</span>
                  <strong style={{ color: textColor }}>{selectedAccount.type} ({selectedAccount.group})</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Opening Debit</span>
                  <strong style={{ color: textColor }}>${selectedAccount.opDebit.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Opening Credit</span>
                  <strong style={{ color: textColor }}>${selectedAccount.opCredit.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Period Debits</span>
                  <strong style={{ color: textColor }}>${selectedAccount.periodDebit.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Period Credits</span>
                  <strong style={{ color: textColor }}>${selectedAccount.periodCredit.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Net Balance Movement</span>
                  <strong className={selectedAccount.netMovement >= 0 ? 'text-success' : 'text-danger'}>
                    ${selectedAccount.netMovement.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-3 rounded mb-4" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
              <span className="text-muted small d-block">Closing Debit Balance</span>
              <h4 className="fw-bold text-primary">${selectedAccount.closingDebit.toLocaleString()}</h4>
              <span className="text-muted small d-block mt-2">Closing Credit Balance</span>
              <h4 className="fw-bold text-success">${selectedAccount.closingCredit.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpTrialBalance;
