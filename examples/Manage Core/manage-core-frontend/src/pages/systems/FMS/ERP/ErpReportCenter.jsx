import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint, faFileExport, faClock, faCogs, faFileAlt, faChartLine,
  faSliders, faShieldHalved, faFileInvoice, faBook, faScaleBalanced,
  faCoins, faFolderOpen, faUsers, faHistory, faRefresh, faFilePdf,
  faFileExcel, faFileCsv, faEnvelope, faBookmark, faStar, faExpand,
  faShareNodes, faSearch, faFilter, faCheckCircle, faCircleInfo,
  faChevronRight, faBuilding
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';

// ----------------------------------------------------------------------
// DATASETS & DICTIONARIES
// ----------------------------------------------------------------------
const REPORT_CARDS = [
  { id: 'pl', badge: 'Phase 10', title: 'Profit & Loss', desc: 'Income statement showing revenue, cost of sales, gross profit, operating expenses and net profit.', category: 'Statement' },
  { id: 'bs', badge: 'Phase 10', title: 'Balance Sheet', desc: 'Assets, liabilities, shareholders equity and retained earnings with comparison periods.', category: 'Statement' },
  { id: 'cashflow', badge: 'Cash', title: 'Cash Flow', desc: 'Operating, investing and financing cash movement with opening and closing balances.', category: 'Statement' },
  { id: 'tb', badge: 'Control', title: 'Trial Balance', desc: 'Trial balance showing every ledger with debit and credit balances for selected fiscal period.', category: 'Control' },
  { id: 'gl', badge: 'Ledger', title: 'General Ledger', desc: 'Account-wise ledger including opening balance, journal movements, running balance, debit, credit and closing balance.', category: 'Ledger' },
  { id: 'daybook', badge: 'Transactions', title: 'Day Book', desc: 'Chronological list of every posted accounting transaction with debit and credit entries.', category: 'Transactions' },
  { id: 'customer_ledger', badge: 'AR', title: 'Customer Ledger Summary', desc: 'Outstanding customer balances, invoices, receipts, adjustments, unapplied receipts and aging summary.', category: 'AR' },
  { id: 'vendor_ledger', badge: 'AP', title: 'Vendor Ledger Summary', desc: 'Vendor balances, supplier invoices, payments, purchase adjustments and payable reconciliation.', category: 'AP' },
  { id: 'ar_aging', badge: 'AR Aging', title: 'Receivables Aging', desc: 'Outstanding customer invoices grouped into aging buckets (Current, 30 Days, 60 Days, 90 Days, 120+ Days).', category: 'AR Aging' },
  { id: 'ap_aging', badge: 'AP Aging', title: 'Payables Aging', desc: 'Outstanding vendor bills grouped into aging buckets with due dates and overdue analysis.', category: 'AP Aging' }
];

const ErpReportCenter = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Navigation tab definitions
  const reportTabs = [
    { id: 'center', label: 'Report Center', icon: faFolderOpen },
    { id: 'exec', label: 'Executive Summary', icon: faChartLine },
    { id: 'ctrl', label: 'Control Center', icon: faSliders },
    { id: 'qa', label: 'Quality Assurance', icon: faShieldHalved },
    { id: 'daybook', label: 'Day Book', icon: faBook },
    { id: 'gl', label: 'General Ledger', icon: faFileAlt },
    { id: 'tb', label: 'Trial Balance', icon: faScaleBalanced },
    { id: 'pl', label: 'Profit & Loss', icon: faFileInvoice },
    { id: 'bs', label: 'Balance Sheet', icon: faFileInvoice },
    { id: 'cashflow', label: 'Cash Flow', icon: faCoins },
    { id: 'customer_ledger', label: 'Customer Ledger', icon: faUsers },
    { id: 'vendor_ledger', label: 'Vendor Ledger', icon: faUsers },
    { id: 'ar_aging', label: 'Receivables Aging', icon: faClock },
    { id: 'ap_aging', label: 'Payables Aging', icon: faClock }
  ];

  // activeSubView: 'center' | 'daybook' | 'gl' | etc.
  const [activeSubView, setActiveSubView] = useState('center');

  React.useEffect(() => {
    const subtab = localStorage.getItem('erp_active_report_subtab');
    if (subtab) {
      setActiveSubView(subtab);
      localStorage.removeItem('erp_active_report_subtab');
    }
  }, []);

  // Filter States
  const [filters, setFilters] = useState({
    company: 'Manage Core Ltd',
    branch: 'All Branches',
    fiscalYear: '2026',
    period: 'Q2',
    dateFrom: '2026-04-01',
    dateTo: '2026-06-30',
    currency: 'PKR',
    baseCurrency: 'PKR',
    dept: 'All Departments',
    costCenter: 'All Cost Centers',
    project: 'All Projects',
    status: 'Posted'
  });

  const handleTabClick = (tabId) => {
    if (tabId === 'exec') {
      setActiveTab('erp_executive_summary');
    } else if (tabId === 'ctrl') {
      setActiveTab('erp_control_center');
    } else if (tabId === 'qa') {
      setActiveTab('erp_quality_assurance');
    } else if (tabId === 'center') {
      setActiveSubView('center');
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
      setActiveSubView(tabId);
    }
  };

  const handleTriggerAction = (action) => {
    addNotification(`Executing action "${action}" on current report view...`, 'info');
    setTimeout(() => {
      addNotification(`Action "${action}" completed successfully.`, 'success');
    }, 700);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(val);
  };

  // CSS rules for clean reporting sheets
  const renderStyles = () => (
    <style>{`
      .custom-pill-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: ${isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.65)'};
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.08)'};
        border-radius: 16px;
        overflow-x: auto;
        white-space: nowrap;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        box-shadow: ${isDark ? '0 4px 20px rgba(0, 0, 0, 0.15)' : '0 4px 20px -2px rgba(0, 0, 0, 0.05)'};
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
        color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(71, 85, 105, 0.85)'};
        background: transparent;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
      .custom-pill-item:hover {
        color: ${isDark ? '#f8fafc' : '#6366f1'};
        background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(99, 102, 241, 0.04)'};
        transform: translateY(-1px);
      }
      .custom-pill-item.active {
        color: #ffffff !important;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }
      .custom-pill-item:active {
        transform: scale(0.97);
      }
      .report-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }
      .reporting-sheet {
        background: ${isDark ? 'rgba(15, 23, 42, 0.65)' : '#FFFFFF'};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
        border-radius: 14px;
        box-shadow: ${isDark ? '0 10px 30px rgba(0, 0, 0, 0.35)' : '0 4px 15px rgba(0,0,0,0.03)'};
        padding: 30px;
      }
      .filter-panel-box {
        background: ${isDark ? 'rgba(15, 23, 42, 0.55)' : '#FFFFFF'};
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
        border-radius: 14px;
        box-shadow: ${isDark ? '0 10px 30px rgba(0, 0, 0, 0.35)' : '0 4px 15px rgba(0,0,0,0.03)'};
        padding: 20px;
      }
      .sheet-header {
        border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9'};
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .sheet-row-bold {
        font-weight: 700;
        border-top: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'};
        border-bottom: 2px double ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'};
      }
    `}</style>
  );

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div className="skeleton skeleton-header mb-4" style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} />
          <div className="row g-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="col-xl-4 col-md-6">
                <div className="skeleton skeleton-card" style={{ height: 180, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {renderStyles()}

      <ErpReportHeader
        title="Accounting Report Center"
        badge="Accounting / ERP"
        description="Company-scoped financial reports with posted double-entry accounting data, executive summaries, print-ready statements, compliance reports and financial control monitoring."
        isDark={isDark}
        activeTabId={activeSubView}
        onTabClick={handleTabClick}
        actions={[
          { label: 'Print Center', icon: faPrint, onClick: () => handleTriggerAction('Print Center'), variant: 'outline' },
          { label: 'Export Reports', icon: faFileExport, onClick: () => handleTriggerAction('Export Reports'), variant: 'outline' },
          { label: 'Schedule Reports', icon: faClock, onClick: () => handleTriggerAction('Schedule Reports'), variant: 'outline' },
          { label: 'Settings', icon: faCogs, onClick: () => handleTriggerAction('Report Settings'), variant: 'outline' }
        ]}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* CONTENT SWITCHER                                                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'center' ? (
        
        // VIEW A: MAIN CARD GRID WORKSPACE
        <div className="container-fluid px-4 px-lg-5 animate-fade-in">
          
          {/* Workspace Banner */}
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4 d-flex flex-row justify-content-between align-items-center flex-wrap gap-3" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
            <div style={{ maxWidth: '600px' }}>
              <span className="badge bg-primary bg-opacity-10 text-primary mb-2">Final Reporting Workspace</span>
              <h5 className="fw-bold mb-1">Reports, Print Views and Control Monitoring</h5>
              <p className="text-muted small mb-0">Use Phase 10 reports for monthly closing, executive review, financial controls, audit preparation, management reporting and print-ready financial statements.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('erp_executive_summary')}>Executive Summary</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('erp_control_center')}>Control Center</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab('erp_quality_assurance')}>Quality Checks</button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="report-card-grid">
            {REPORT_CARDS.map(card => (
              <div key={card.id} className="card border-0 shadow-sm p-4 rounded-4 bg-white d-flex flex-column justify-content-between" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-light text-dark border font-monospace">{card.badge}</span>
                    <span className="x-small text-muted">{card.category}</span>
                  </div>
                  <h6 className="fw-bold mb-2 text-slate-800">{card.title}</h6>
                  <p className="text-muted small mb-4">{card.desc}</p>
                </div>
                <div className="d-flex gap-2 border-top pt-3">
                  <button className="btn btn-sm btn-primary flex-grow-1" onClick={() => handleTabClick(card.id)}>Open Report</button>
                  {['pl', 'bs', 'cashflow', 'tb'].includes(card.id) && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('Print') + ' ' + card.title}><FontAwesomeIcon icon={faPrint} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

      ) : (

        // VIEW B: DYNAMIC INDIVIDUAL REPORT VIEW (WITH FILTER/ACTION HEADER)
        <div className="container-fluid px-4 px-lg-5 animate-fade-in">
          
          {/* Global Filter Bar */}
          <div className="filter-panel-box mb-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h6 className="fw-bold mb-0 text-slate-700"><FontAwesomeIcon icon={faFilter} className="me-2 text-primary" /> Report Extraction Parameters</h6>
              <span className="badge bg-light text-dark font-monospace">Engine Status: Active</span>
            </div>
            
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label x-small text-muted fw-bold">Company Scope</label>
                <select className="form-select form-select-sm" value={filters.company} onChange={e => setFilters({...filters, company: e.target.value})}>
                  <option>Manage Core Ltd</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label x-small text-muted fw-bold">Fiscal Period</label>
                <select className="form-select form-select-sm" value={filters.period} onChange={e => setFilters({...filters, period: e.target.value})}>
                  <option value="Q1">Q1 (Jan - Mar)</option>
                  <option value="Q2">Q2 (Apr - Jun)</option>
                  <option value="Q3">Q3 (Jul - Sep)</option>
                  <option value="Q4">Q4 (Oct - Dec)</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label x-small text-muted fw-bold">Date From</label>
                <input type="date" className="form-control form-control-sm" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label x-small text-muted fw-bold">Date To</label>
                <input type="date" className="form-control form-control-sm" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('Refresh')}><FontAwesomeIcon icon={faRefresh} /> Refresh</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('Print')}><FontAwesomeIcon icon={faPrint} /> Print</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('PDF')}><FontAwesomeIcon icon={faFilePdf} className="text-danger" /> PDF</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('Excel')}><FontAwesomeIcon icon={faFileExcel} className="text-success" /> Excel</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('CSV')}><FontAwesomeIcon icon={faFileCsv} className="text-warning" /> CSV</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleTriggerAction('Email')}><FontAwesomeIcon icon={faEnvelope} /> Email</button>
            </div>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-light text-primary" title="Favorite" onClick={() => handleTriggerAction('Favorite')}><FontAwesomeIcon icon={faStar} /></button>
              <button className="btn btn-sm btn-light" title="Fullscreen" onClick={() => handleTriggerAction('Fullscreen')}><FontAwesomeIcon icon={faExpand} /></button>
              <button className="btn btn-sm btn-light" title="Share" onClick={() => handleTriggerAction('Share')}><FontAwesomeIcon icon={faShareNodes} /></button>
            </div>
          </div>

          {/* Dynamic Sheet Rendering */}
          <div className="reporting-sheet">
            <div className="sheet-header text-center mb-4">
              <h4 className="fw-bold mb-1">{reportTabs.find(t => t.id === activeSubView)?.label}</h4>
              <span className="small text-muted font-monospace">{filters.company} • Period: {filters.period} ({filters.dateFrom} to {filters.dateTo})</span>
            </div>

            {/* CASE 1: Day Book */}
            {activeSubView === 'daybook' && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Voucher Date</th>
                      <th>Voucher Code</th>
                      <th>General Ledger Account</th>
                      <th>Cost Center</th>
                      <th>Debit Amount</th>
                      <th>Credit Amount</th>
                      <th>User Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2026-07-06</td>
                      <td className="fw-bold text-primary font-monospace">JV-2026-0701</td>
                      <td>121000 - Accounts Receivable Asset</td>
                      <td>Corporate Sales</td>
                      <td>{formatCurrency(350000)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>Kashif Raza</td>
                    </tr>
                    <tr>
                      <td>2026-07-06</td>
                      <td className="fw-bold text-primary font-monospace">JV-2026-0701</td>
                      <td>411000 - Sales Revenue Accounts</td>
                      <td>Corporate Sales</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(350000)}</td>
                      <td>Kashif Raza</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 2: General Ledger */}
            {activeSubView === 'gl' && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Account Code</th>
                      <th>Account Title</th>
                      <th>Opening Balance</th>
                      <th>Debit total</th>
                      <th>Credit total</th>
                      <th>Net Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-monospace fw-bold">110010</td>
                      <td>HBL Central Vault Operations</td>
                      <td>{formatCurrency(1250000)}</td>
                      <td>{formatCurrency(350000)}</td>
                      <td>{formatCurrency(50000)}</td>
                      <td className="fw-bold">{formatCurrency(1550000)}</td>
                    </tr>
                    <tr>
                      <td className="font-monospace fw-bold">220020</td>
                      <td>Accounts Payable Liability</td>
                      <td>{formatCurrency(-450000)}</td>
                      <td>{formatCurrency(100000)}</td>
                      <td>{formatCurrency(250000)}</td>
                      <td className="fw-bold">{formatCurrency(-600000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 3: Trial Balance */}
            {activeSubView === 'tb' && (
              <div className="table-responsive">
                <table className="table table-bordered custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>GL Code</th>
                      <th>Account Label</th>
                      <th className="text-end">Debit Balance</th>
                      <th className="text-end">Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-monospace">100000 - Assets</td>
                      <td>Company Equipment</td>
                      <td className="text-end">{formatCurrency(2500000)}</td>
                      <td className="text-end">{formatCurrency(0)}</td>
                    </tr>
                    <tr>
                      <td className="font-monospace">300000 - Equities</td>
                      <td>Share Capital</td>
                      <td className="text-end">{formatCurrency(0)}</td>
                      <td className="text-end">{formatCurrency(2500000)}</td>
                    </tr>
                    <tr className="sheet-row-bold bg-light">
                      <td colSpan="2">Report Totals</td>
                      <td className="text-end text-success">{formatCurrency(2500000)}</td>
                      <td className="text-end text-success">{formatCurrency(2500000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 4: Profit & Loss */}
            {activeSubView === 'pl' && (
              <div className="px-4">
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Sales Revenues</span>
                  <strong className="text-success">{formatCurrency(5400000)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom text-danger">
                  <span>Less: Cost of Goods Sold (COGS)</span>
                  <strong>{formatCurrency(-1800000)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom sheet-row-bold bg-light my-2">
                  <span>Gross Profit Margin</span>
                  <strong>{formatCurrency(3600000)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Operating Salaries & Rent</span>
                  <strong className="text-danger">{formatCurrency(-800000)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>Admin Marketing Expense</span>
                  <strong className="text-danger">{formatCurrency(-250000)}</strong>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom sheet-row-bold bg-primary bg-opacity-10 my-3">
                  <span>Net Profit (Earnings before Tax)</span>
                  <strong className="text-success">{formatCurrency(2550000)}</strong>
                </div>
              </div>
            )}

            {/* CASE 5: Balance Sheet */}
            {activeSubView === 'bs' && (
              <div className="row g-4">
                <div className="col-md-6 border-end">
                  <h6 className="fw-bold text-slate-800 border-bottom pb-2 mb-3">Company Assets</h6>
                  <div className="d-flex justify-content-between py-1"><span>Current Cash & Banks</span><strong>{formatCurrency(1550000)}</strong></div>
                  <div className="d-flex justify-content-between py-1"><span>Receivables Debtors</span><strong>{formatCurrency(4500000)}</strong></div>
                  <div className="d-flex justify-content-between py-1"><span>Fixed Plant Assets</span><strong>{formatCurrency(2500000)}</strong></div>
                  <div className="d-flex justify-content-between py-2 border-top fw-bold bg-light mt-3"><span>Total Assets</span><strong>{formatCurrency(8550000)}</strong></div>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold text-slate-800 border-bottom pb-2 mb-3">Liabilities & Equity</h6>
                  <div className="d-flex justify-content-between py-1"><span>Accounts Payable Accounts</span><strong>{formatCurrency(600000)}</strong></div>
                  <div className="d-flex justify-content-between py-1"><span>Shareholders Capital</span><strong>{formatCurrency(5400000)}</strong></div>
                  <div className="d-flex justify-content-between py-1"><span>Retained Earnings Q2</span><strong>{formatCurrency(2550000)}</strong></div>
                  <div className="d-flex justify-content-between py-2 border-top fw-bold bg-light mt-3"><span>Total Liabilities + Equity</span><strong>{formatCurrency(8550000)}</strong></div>
                </div>
              </div>
            )}

            {/* CASE 6: Cash Flow */}
            {activeSubView === 'cashflow' && (
              <div className="px-4">
                <h6 className="fw-bold border-bottom pb-1 mb-2">1. Operating cash flows</h6>
                <div className="d-flex justify-content-between py-1"><span>Operating Profit before Working Cap</span><strong>{formatCurrency(2550000)}</strong></div>
                <div className="d-flex justify-content-between py-1 border-bottom"><span>Increase in Accounts Receivable</span><strong className="text-danger">{formatCurrency(-1200000)}</strong></div>
                
                <h6 className="fw-bold border-bottom pb-1 mb-2 mt-4">2. Investing cash flows</h6>
                <div className="d-flex justify-content-between py-1 border-bottom"><span>Acquisitions of Plant & Equipment</span><strong className="text-danger">{formatCurrency(-500000)}</strong></div>

                <div className="d-flex justify-content-between py-2 border-top sheet-row-bold bg-light my-3">
                  <span>Net Increase in Cash Reserves</span>
                  <strong>{formatCurrency(850000)}</strong>
                </div>
              </div>
            )}

            {/* CASE 7: Customer Ledger */}
            {activeSubView === 'customer_ledger' && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Customer Title</th>
                      <th>Beginning Balance</th>
                      <th>Total Invoices Issued</th>
                      <th>Payments Cleared</th>
                      <th>Net Balance Outstanding</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Kashif Raza Trading</strong></td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(4500000)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td className="fw-bold text-danger">{formatCurrency(4500000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 8: Vendor Ledger */}
            {activeSubView === 'vendor_ledger' && (
              <div className="table-responsive">
                <table className="table table-bordered table-striped custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Supplier Master Name</th>
                      <th>Opening Balance</th>
                      <th>Invoices Billed</th>
                      <th>Disbursements Paid</th>
                      <th>Net Outstanding balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Microsoft License Sourcing</strong></td>
                      <td>{formatCurrency(-250000)}</td>
                      <td>{formatCurrency(-350000)}</td>
                      <td>{formatCurrency(600000)}</td>
                      <td className="fw-bold text-success">{formatCurrency(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 9: AR Aging */}
            {activeSubView === 'ar_aging' && (
              <div className="table-responsive">
                <table className="table table-bordered custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Customer Name</th>
                      <th>Total Outstanding</th>
                      <th>Current</th>
                      <th>1-30 Days</th>
                      <th>31-60 Days</th>
                      <th>61-90 Days</th>
                      <th>90+ Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Kashif Raza Trading</strong></td>
                      <td className="fw-bold">{formatCurrency(4500000)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(4500000)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* CASE 10: AP Aging */}
            {activeSubView === 'ap_aging' && (
              <div className="table-responsive">
                <table className="table table-bordered custom-table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Vendor Supplier Name</th>
                      <th>Total Payables</th>
                      <th>Current</th>
                      <th>1-30 Days</th>
                      <th>31-60 Days</th>
                      <th>61-90 Days</th>
                      <th>90+ Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Local Steel Escrow Ltd</strong></td>
                      <td className="fw-bold">{formatCurrency(1200000)}</td>
                      <td>{formatCurrency(1200000)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(0)}</td>
                      <td>{formatCurrency(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

      )}

    </div>
  );
};

export default ErpReportCenter;
