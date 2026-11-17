import React, { useState, useEffect } from 'react';
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

const ErpDayBook = () => {
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
  const [selectedJournal, setSelectedJournal] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');

  // Search/Drawer States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);

  // Mock Day Book Journals
  const [journals, setJournals] = useState([
    { id: 1, date: '2026-07-07', journalNo: 'JV-2026-940', voucherNo: 'VCH-10023', refNo: 'PO-2026-904', accountCode: '510100', accountName: 'Salary Expense', partner: 'Acme Corp', costCenter: 'CC-HQ', project: 'N/A', dept: 'HR', desc: 'July employee payroll posting', debit: 450000, credit: 0, currency: 'USD', exRate: 1.00, author: 'Finance Clerk', approvedBy: 'Chief Accountant', status: 'Posted', company: 'Manage Core Ltd', branch: 'Karachi Office', period: 'Period 7' },
    { id: 2, date: '2026-07-07', journalNo: 'JV-2026-940', voucherNo: 'VCH-10023', refNo: 'PO-2026-904', accountCode: '210100', accountName: 'Salary Payable', partner: 'Acme Corp', costCenter: 'CC-HQ', project: 'N/A', dept: 'HR', desc: 'July employee payroll posting', debit: 0, credit: 450000, currency: 'USD', exRate: 1.00, author: 'Finance Clerk', approvedBy: 'Chief Accountant', status: 'Posted', company: 'Manage Core Ltd', branch: 'Karachi Office', period: 'Period 7' },
    { id: 3, date: '2026-07-06', journalNo: 'JV-2026-939', voucherNo: 'VCH-10021', refNo: 'INV-2026-112', accountCode: '110200', accountName: 'Bank Meezan', partner: 'Stark Industries', costCenter: 'CC-SALES', project: 'SaaS Expansion', dept: 'Sales', desc: 'Customer invoice payment receipt', debit: 180000, credit: 0, currency: 'USD', exRate: 1.00, author: 'Admin User', approvedBy: 'CFO Office', status: 'Posted', company: 'Manage Core Ltd', branch: 'Lahore Office', period: 'Period 7' },
    { id: 4, date: '2026-07-06', journalNo: 'JV-2026-939', voucherNo: 'VCH-10021', refNo: 'INV-2026-112', accountCode: '112000', accountName: 'Accounts Receivable', partner: 'Stark Industries', costCenter: 'CC-SALES', project: 'SaaS Expansion', dept: 'Sales', desc: 'Customer invoice payment receipt', debit: 0, credit: 180000, currency: 'USD', exRate: 1.00, author: 'Admin User', approvedBy: 'CFO Office', status: 'Posted', company: 'Manage Core Ltd', branch: 'Lahore Office', period: 'Period 7' }
  ]);

  // Validation Rules mockup
  const validations = [
    { rule: 'Debit Total = Credit Total', status: 'Passed', details: 'All journal entries match debit-credit pairs' },
    { rule: 'Sequential Journal Numbers', status: 'Passed', details: 'No missing/skipped journal voucher IDs' },
    { rule: 'Voucher Number Uniqueness', status: 'Passed', details: 'All physical vouchers contain unique numbers' },
    { rule: 'Period Lock Validation', status: 'Passed', details: 'Active postings occurred only within open fiscal year period' }
  ];

  // AI Insights mock
  const aiInsights = [
    { title: 'Normal Activity Profile', desc: 'Debit-credit flows match historic payroll and invoice trends.', risk: 'Low', impact: 'None' },
    { title: 'High Concentration detected', desc: '82% of journal line postings this month originated from Karachi Branch.', risk: 'Medium', impact: 'Regulatory reporting' }
  ];

  const totalDebit = journals.reduce((a, b) => a + b.debit, 0);
  const totalCredit = journals.reduce((a, b) => a + b.credit, 0);
  const difference = Math.abs(totalDebit - totalCredit);

  const filteredJournals = journals.filter(j =>
    j.journalNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.partner.toLowerCase().includes(searchTerm.toLowerCase())
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
        title="Day Book Report"
        badge="Accounting / ERP"
        description="Display all posted accounting journal entries in chronological order. Draft, cancelled, deleted, and unposted transactions should never appear in this report."
        isDark={isDark}
        activeTabId="daybook"
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
            Day Book Filters
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
              <label className="form-label small text-muted">Journal</label>
              <select className="form-select form-select-sm" value={selectedJournal} onChange={e => setSelectedJournal(e.target.value)}>
                <option value="All">All Journals</option>
                <option value="General">General Journal</option>
                <option value="Sales">Sales Journal</option>
                <option value="Purchase">Purchase Journal</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label small text-muted">Company</label>
              <select className="form-select form-select-sm" value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="All">All Companies</option>
                <option value="Manage Core Ltd">Manage Core Ltd</option>
                <option value="Stark Corp">Stark Corp</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('Report generated.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Day Book Exported to Excel.', 'success')}>
                <FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel
              </button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('Day Book PDF downloaded.', 'success')}>
                <FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 3. SUMMARY CARDS                         */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <ErpKpiCard label="Total Debits" value={`$${totalDebit.toLocaleString()}`} icon={faCoins} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Total Credits" value={`$${totalCredit.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard 
            label="Verification Difference" 
            value={`$${difference.toLocaleString()}`} 
            icon={faScaleBalanced} 
            color={difference === 0 ? '#10b981' : '#ef4444'} 
            isDark={isDark} 
            badge={difference === 0 ? 'Balanced' : 'Imbalance'}
          />
          <ErpKpiCard label="Journal Counter" value={`${journals.length} Lines`} icon={faList} color="#fbbf24" isDark={isDark} />
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 4. DAY BOOK DATATABLE                    */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <div className="col-12 col-xl-9">
            <ErpDataTable
              title="Chronological Journal Lines Registry"
              titleIcon={faBookOpen}
              columns={[
                { key: 'date', label: 'Posting Date' },
                { key: 'journalNo', label: 'Journal ID', bold: true, render: (val, row) => (
                  <button className="btn btn-sm btn-link p-0 fw-bold" onClick={() => setSelectedTxn(row)}>{val}</button>
                )},
                { key: 'voucherNo', label: 'Voucher', render: (val) => <span className="font-monospace text-muted">{val}</span> },
                { key: 'accountName', label: 'Account Name', bold: true },
                { key: 'partner', label: 'Partner' },
                { key: 'dept', label: 'Dept' },
                { key: 'debit', label: 'Debit', align: 'right', render: (val) => val > 0 ? <strong className="text-primary">${val.toLocaleString()}</strong> : '-' },
                { key: 'credit', label: 'Credit', align: 'right', render: (val) => val > 0 ? <strong className="text-success">${val.toLocaleString()}</strong> : '-' },
                { key: 'status', label: 'Status', render: (val) => <span className="premium-badge bg-success text-white">{val}</span> }
              ]}
              data={filteredJournals}
              searchable
              searchPlaceholder="Search journal entry lists..."
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isDark={isDark}
            />
          </div>

          {/* ──────────────────────────────────────── */}
          {/* 5. VALIDATIONS & AI INSIGHTS             */}
          {/* ──────────────────────────────────────── */}
          <div className="col-12 col-xl-3">
            <div className="d-flex flex-column gap-3">
              {/* Validation Panel */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />
                  Ledger Validations
                </h6>
                <div className="d-flex flex-column gap-2">
                  {validations.map((v, i) => (
                    <div key={i} className="p-2 rounded" style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc', borderLeft: '4px solid #10b981' }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold" style={{ color: textColor }}>{v.rule}</span>
                        <span className="badge bg-success text-white" style={{ fontSize: '9px' }}>{v.status}</span>
                      </div>
                      <span className="text-muted d-block" style={{ fontSize: '10px' }}>{v.details}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights Panel */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faRobot} className="text-primary me-2" />
                  AI Ledger Insights
                </h6>
                <div className="d-flex flex-column gap-2">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="p-2 rounded border" style={{ borderColor: borderColor }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-primary">{insight.title}</span>
                        <span className="badge bg-warning text-dark" style={{ fontSize: '9px' }}>{insight.risk} Risk</span>
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
              <span className="premium-badge bg-primary text-white mb-1">Journal Entry Details</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedTxn.journalNo}</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedTxn(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: textColor }}>Voucher Header Metadata</h6>
              <div className="row g-2 mt-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Physical Voucher ID</span>
                  <strong style={{ color: textColor }}>{selectedTxn.voucherNo}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Accounting Date</span>
                  <strong style={{ color: textColor }}>{selectedTxn.date}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Reference Document</span>
                  <strong style={{ color: textColor }}>{selectedTxn.refNo}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Cost Center</span>
                  <strong style={{ color: textColor }}>{selectedTxn.costCenter}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Company</span>
                  <strong style={{ color: textColor }}>{selectedTxn.company}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Branch Office</span>
                  <strong style={{ color: textColor }}>{selectedTxn.branch}</strong>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold" style={{ color: textColor }}>Narration Description</h6>
              <div className="p-3 rounded mt-2 font-monospace" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', fontSize: '0.8rem', color: textColor }}>
                {selectedTxn.desc}
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-2" style={{ color: textColor }}>Approval Log</h6>
              <div className="p-3 rounded" style={{ background: isDark ? 'rgba(0,0,0,0.1)' : '#f8fafc' }}>
                <span className="text-muted small d-block">Created By: <strong>{selectedTxn.author}</strong></span>
                <span className="text-muted small d-block mt-1">Approved By: <strong>{selectedTxn.approvedBy}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpDayBook;
