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

const ErpGeneralLedger = () => {
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
  const [selectedAccount, setSelectedAccount] = useState('110200 - Bank Meezan');
  const [selectedCompany, setSelectedCompany] = useState('All');

  // Search/Drawer States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Mock Ledger Entries for Account: 110200 - Bank Meezan (Assets)
  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 1, date: '2026-07-01', type: 'Opening Balance', journalNo: '-', voucherNo: '-', refNo: '-', desc: 'Balance brought forward', debit: 0, credit: 0, balance: 1200000, status: 'Posted' },
    { id: 2, date: '2026-07-05', type: 'Customer Invoice Payment', journalNo: 'JV-2026-939', voucherNo: 'VCH-10021', refNo: 'INV-2026-112', desc: 'Customer payment collection', debit: 180000, credit: 0, balance: 1380000, status: 'Posted' },
    { id: 3, date: '2026-07-07', type: 'Vendor Payment Payout', journalNo: 'JV-2026-941', voucherNo: 'VCH-10024', refNo: 'BILL-2026-441', desc: 'Vendor electricity bill settlement', debit: 0, credit: 15000, balance: 1365000, status: 'Posted' },
    { id: 4, date: '2026-07-08', type: 'Cash Withdrawal Transfer', journalNo: 'JV-2026-942', voucherNo: 'VCH-10025', refNo: 'JV-REF-99', desc: 'Office petty cash replenishment', debit: 0, credit: 10000, balance: 1355000, status: 'Posted' }
  ]);

  // Account Summary Details
  const accountSummary = {
    code: '110200',
    name: 'Bank Meezan Operations',
    type: 'Asset',
    group: 'Current Assets',
    openingBal: 1200000,
    closingBal: 1355000,
    currency: 'USD ($)',
    company: 'Manage Core Ltd',
    branch: 'Karachi Office',
    status: 'Active'
  };

  // AI Ledger Intelligence mock
  const aiInsights = [
    { title: 'Normal Balance Check', desc: 'Running balance has remained above the minimum threshold of $1M.', risk: 'Low', impact: 'None' },
    { title: 'Payment Gap Warning', desc: 'Petty cash replenishment frequency increased from monthly to weekly.', risk: 'Medium', impact: 'Liquidity checks' }
  ];

  // Calculating Totals
  const totalDebit = useMemo(() => ledgerEntries.reduce((acc, curr) => acc + curr.debit, 0), [ledgerEntries]);
  const totalCredit = useMemo(() => ledgerEntries.reduce((acc, curr) => acc + curr.credit, 0), [ledgerEntries]);

  const filteredEntries = ledgerEntries.filter(entry =>
    entry.journalNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="General Ledger"
        badge="ACCOUNTING REPORTS"
        description="View detailed account-wise ledger transactions with opening balance, journal history, running balance, and closing balance across all accounting periods."
        isDark={isDark}
        activeTabId="gl"
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
            General Ledger Filters
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
              <label className="form-label small text-muted">Ledger Account</label>
              <select className="form-select form-select-sm" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
                <option value="110200 - Bank Meezan">110200 - Bank Meezan Operations</option>
                <option value="112000 - Accounts Receivable">112000 - Accounts Receivable</option>
                <option value="210100 - Salary Payable">210100 - Salary Payable</option>
                <option value="510100 - Salary Expense">510100 - Salary Expense</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label small text-muted">Company</label>
              <select className="form-select form-select-sm" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="All">All Companies</option>
                <option value="Manage Core Ltd">Manage Core Ltd</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('General ledger fetched.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Ledger Exported to Excel.', 'success')}>
                <FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel
              </button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Ledger PDF generated.', 'success')}>
                <FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 3. SUMMARY PANEL                         */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <ErpKpiCard label="Opening Balance" value={`$${accountSummary.openingBal.toLocaleString()}`} icon={faCoins} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Period Debits" value={`$${totalDebit.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard label="Period Credits" value={`$${totalCredit.toLocaleString()}`} icon={faCoins} color="#ef4444" isDark={isDark} />
          <ErpKpiCard label="Closing Balance" value={`$${accountSummary.closingBal.toLocaleString()}`} icon={faCoins} color="#8b5cf6" isDark={isDark} />
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 4. ACCOUNT SUMMARY INFO PANEL            */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
          <h6 className="fw-bold mb-3" style={{ color: textColor }}>
            <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-primary" />
            Account Ledger Profile Info
          </h6>
          <div className="row g-2">
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block">Account Name</span>
              <strong style={{ color: textColor }}>{accountSummary.name} ({accountSummary.code})</strong>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block">Account Type</span>
              <strong style={{ color: textColor }}>{accountSummary.type} ({accountSummary.group})</strong>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block">Base Currency</span>
              <strong style={{ color: textColor }}>{accountSummary.currency}</strong>
            </div>
            <div className="col-md-3 col-6">
              <span className="text-muted small d-block">Branch Profile</span>
              <strong style={{ color: textColor }}>{accountSummary.branch}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 5. LEDGER TRANSACTIONS REGISTER          */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <div className="col-12 col-xl-9">
            <ErpDataTable
              title="General Ledger Transactions Ledger"
              titleIcon={faCalculator}
              columns={[
                { key: 'date', label: 'Posting Date' },
                { key: 'journalNo', label: 'Journal ID', bold: true, render: (val, row) => (
                  val !== '-' ? <button className="btn btn-sm btn-link p-0 fw-bold" onClick={() => setSelectedTxn(row)}>{val}</button> : <span>-</span>
                )},
                { key: 'voucherNo', label: 'Voucher', render: (val) => <span className="font-monospace text-muted">{val}</span> },
                { key: 'desc', label: 'Transaction Description' },
                { key: 'debit', label: 'Debit (+)', align: 'right', render: (val) => val > 0 ? <strong className="text-primary">${val.toLocaleString()}</strong> : '-' },
                { key: 'credit', label: 'Credit (-)', align: 'right', render: (val) => val > 0 ? <strong className="text-danger">${val.toLocaleString()}</strong> : '-' },
                { key: 'balance', label: 'Running Balance', align: 'right', render: (val) => <strong style={{ color: textColor }}>${val.toLocaleString()}</strong> }
              ]}
              data={filteredEntries}
              searchable
              searchPlaceholder="Search descriptions or journals..."
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isDark={isDark}
            />
          </div>

          {/* AI Ledger Intelligence Panel */}
          <div className="col-12 col-xl-3">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg, height: '100%' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faRobot} className="text-primary me-2" />
                AI Ledger Intelligence
              </h6>
              <div className="d-flex flex-column gap-3">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="p-3 rounded border" style={{ borderColor: borderColor }}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-primary">{insight.title}</span>
                      <span className="badge bg-secondary text-white" style={{ fontSize: '9px' }}>{insight.risk} Risk</span>
                    </div>
                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>{insight.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 6. TRANSACTION DETAIL SIDE DRAWER        */}
      {/* ──────────────────────────────────────── */}
      {selectedTxn && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '45%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">General Ledger Source Voucher</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedTxn.journalNo}</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedTxn(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: textColor }}>Source Vouchers</h6>
              <div className="row g-2 mt-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Voucher Number</span>
                  <strong style={{ color: textColor }}>{selectedTxn.voucherNo}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Transaction Date</span>
                  <strong style={{ color: textColor }}>{selectedTxn.date}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Reference Document</span>
                  <strong style={{ color: textColor }}>{selectedTxn.refNo}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Debit impact</span>
                  <strong className="text-primary">${selectedTxn.debit.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Credit impact</span>
                  <strong className="text-danger">${selectedTxn.credit.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: textColor }}>Voucher Narration Description</h6>
              <div className="p-3 rounded mt-2 font-monospace" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', fontSize: '0.8rem', color: textColor }}>
                {selectedTxn.desc}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpGeneralLedger;
