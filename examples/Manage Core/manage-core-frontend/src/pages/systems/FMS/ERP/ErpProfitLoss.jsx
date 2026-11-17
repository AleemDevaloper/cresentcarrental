import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExport, faEye, faRefresh, faHistory,
  faDatabase, faUser, faInfoCircle, faChevronRight, faXmark, faCheckCircle,
  faTimesCircle, faArrowRotateLeft, faPrint, faFileExcel, faFilePdf, faRobot,
  faSliders, faBuildingColumns, faScaleBalanced, faCalculator, faBookOpen,
  faPlus, faCalendarDays, faCoins, faList, faLink, faChartLine, faFolderOpen,
  faShieldHalved, faFileInvoice, faClock, faUsers, faArrowTrendUp, faArrowTrendDown,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';

const ErpProfitLoss = () => {
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
  const [comparisonPeriod, setComparisonPeriod] = useState('Previous Period');

  // Search/Drawer States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);

  // Profit & Loss Mock Data Section Mappings
  const pnlData = {
    revenue: [
      { code: '410100', name: 'SaaS Subscription Revenue', current: 380000, previous: 320000, variance: 60000, varPercent: 18.75 },
      { code: '410200', name: 'Professional Services Consulting', current: 75000, previous: 80000, variance: -5000, varPercent: -6.25 }
    ],
    cogs: [
      { code: '500100', name: 'Cloud Hosting Infrastructure', current: 95000, previous: 88000, variance: 7000, varPercent: 7.95 },
      { code: '500200', name: 'Direct Customer Support Overhead', current: 35000, previous: 32000, variance: 3000, varPercent: 9.38 }
    ],
    expenses: [
      { code: '510100', name: 'Office Rent & Utilities', current: 12000, previous: 12000, variance: 0, varPercent: 0 },
      { code: '510200', name: 'Employee Payroll Salary', current: 210000, previous: 200000, variance: 10000, varPercent: 5.00 },
      { code: '510300', name: 'Marketing & Ad Campaigns', current: 45000, previous: 50000, variance: -5000, varPercent: -10.00 }
    ],
    other: [
      { code: '600100', name: 'Foreign Exchange Gain / (Loss)', current: 8000, previous: -2000, variance: 10000, varPercent: 500.00 }
    ]
  };

  // Intermediate Totals Calculations
  const totalRevenueCurrent = pnlData.revenue.reduce((a, b) => a + b.current, 0);
  const totalRevenuePrevious = pnlData.revenue.reduce((a, b) => a + b.previous, 0);

  const totalCogsCurrent = pnlData.cogs.reduce((a, b) => a + b.current, 0);
  const totalCogsPrevious = pnlData.cogs.reduce((a, b) => a + b.previous, 0);

  const grossProfitCurrent = totalRevenueCurrent - totalCogsCurrent;
  const grossProfitPrevious = totalRevenuePrevious - totalCogsPrevious;

  const totalExpensesCurrent = pnlData.expenses.reduce((a, b) => a + b.current, 0);
  const totalExpensesPrevious = pnlData.expenses.reduce((a, b) => a + b.previous, 0);

  const netProfitCurrent = grossProfitCurrent - totalExpensesCurrent + pnlData.other[0].current;
  const netProfitPrevious = grossProfitPrevious - totalExpensesPrevious + pnlData.other[0].previous;

  // AI Profit & Loss recommendations
  const aiInsights = [
    { title: 'Healthy Gross Margin', desc: 'Gross margin improved to 71.4% due to strong SaaS subscription growth.', status: 'Optimal' },
    { title: 'Rent Ratio Constant', desc: 'Administrative rent expense remained fixed at 2.6% of overall revenue.', status: 'Consistent' }
  ];

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
        title="Profit & Loss Statement"
        badge="FINANCIAL REPORTS"
        description="Analyze business profitability by reviewing revenue, cost of goods sold, operating expenses, gross profit, operating profit, and net profit across the selected accounting period."
        isDark={isDark}
        activeTabId="pl"
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
            Statement Filters
          </h6>
          <div className="row g-3">
            <div className="col-md-4 col-sm-6">
              <label className="form-label small text-muted">From Date</label>
              <input type="date" className="form-control form-control-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="col-md-4 col-sm-6">
              <label className="form-label small text-muted">To Date</label>
              <input type="date" className="form-control form-control-sm" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="col-md-4 col-sm-6">
              <label className="form-label small text-muted">Comparison Period</label>
              <select className="form-select form-select-sm" value={comparisonPeriod} onChange={e => setComparisonPeriod(e.target.value)}>
                <option value="Previous Period">Previous Period</option>
                <option value="Previous Fiscal Year">Previous Fiscal Year</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => addNotification('Filters reset.', 'info')}>Reset</button>
              <button className="btn btn-sm btn-primary px-3" onClick={() => addNotification('Income statement calculated.', 'success')}>Run Report</button>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('P&L exported to Excel.', 'success')}>
                <FontAwesomeIcon icon={faFileExcel} className="text-success me-1" /> Excel
              </button>
              <button className="btn btn-sm btn-light border" onClick={() => addNotification('P&L PDF printed.', 'success')}>
                <FontAwesomeIcon icon={faFilePdf} className="text-danger me-1" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 3. EXECUTIVE KPI CARDS                   */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <ErpKpiCard label="Gross Revenue" value={`$${totalRevenueCurrent.toLocaleString()}`} icon={faArrowTrendUp} color="#6366f1" isDark={isDark} />
          <ErpKpiCard label="Gross Profit" value={`$${grossProfitCurrent.toLocaleString()}`} icon={faCoins} color="#10b981" isDark={isDark} />
          <ErpKpiCard label="Operating Expenses" value={`$${totalExpensesCurrent.toLocaleString()}`} icon={faArrowTrendDown} color="#ef4444" isDark={isDark} />
          <ErpKpiCard label="Net Profit Margin" value={`$${netProfitCurrent.toLocaleString()}`} icon={faChartLine} color="#8b5cf6" isDark={isDark} badge={`${((netProfitCurrent / totalRevenueCurrent) * 100).toFixed(1)}%`} />
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 4. PROFIT & LOSS STATEMENT TABLE         */}
      {/* ──────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-3">
          <div className="col-12 col-xl-9">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                Income Statement Summary Block
              </h6>
              <div className="table-responsive">
                <table className="table table-sm align-middle text-start" style={{ color: textColor }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${borderColor}` }}>
                      <th style={{ color: mutedColor }}>Account Code</th>
                      <th style={{ color: mutedColor }}>Account Name</th>
                      <th style={{ color: mutedColor }} className="text-end">Current Period</th>
                      <th style={{ color: mutedColor }} className="text-end">Previous Period</th>
                      <th style={{ color: mutedColor }} className="text-end">Variance</th>
                      <th style={{ color: mutedColor }} className="text-end">Variance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Revenue Section */}
                    <tr className="table-light fw-bold"><td colSpan={6}>1. OPERATING REVENUE</td></tr>
                    {pnlData.revenue.map(r => (
                      <tr key={r.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td className="font-monospace text-muted">{r.code}</td>
                        <td><button className="btn btn-sm btn-link p-0 fw-bold" onClick={() => setSelectedSection(r)}>{r.name}</button></td>
                        <td className="text-end">${r.current.toLocaleString()}</td>
                        <td className="text-end">${r.previous.toLocaleString()}</td>
                        <td className={`text-end ${r.variance >= 0 ? 'text-success' : 'text-danger'}`}>
                          ${r.variance.toLocaleString()}
                        </td>
                        <td className={`text-end ${r.varPercent >= 0 ? 'text-success' : 'text-danger'}`}>{r.varPercent}%</td>
                      </tr>
                    ))}
                    <tr className="fw-bold" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                      <td colSpan={2}>Total Operating Revenue</td>
                      <td className="text-end text-primary">${totalRevenueCurrent.toLocaleString()}</td>
                      <td className="text-end">${totalRevenuePrevious.toLocaleString()}</td>
                      <td className="text-end">${(totalRevenueCurrent - totalRevenuePrevious).toLocaleString()}</td>
                      <td className="text-end">{( ((totalRevenueCurrent - totalRevenuePrevious) / totalRevenuePrevious) * 100 ).toFixed(1)}%</td>
                    </tr>

                    {/* COGS Section */}
                    <tr className="table-light fw-bold"><td colSpan={6}>2. COST OF GOODS SOLD (COGS)</td></tr>
                    {pnlData.cogs.map(c => (
                      <tr key={c.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td className="font-monospace text-muted">{c.code}</td>
                        <td><button className="btn btn-sm btn-link p-0 fw-bold" onClick={() => setSelectedSection(c)}>{c.name}</button></td>
                        <td className="text-end">${c.current.toLocaleString()}</td>
                        <td className="text-end">${c.previous.toLocaleString()}</td>
                        <td className="text-end text-danger">${c.variance.toLocaleString()}</td>
                        <td className="text-end text-danger">{c.varPercent}%</td>
                      </tr>
                    ))}
                    <tr className="fw-bold" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                      <td colSpan={2}>Total Cost of Goods Sold</td>
                      <td className="text-end text-danger">${totalCogsCurrent.toLocaleString()}</td>
                      <td className="text-end">${totalCogsPrevious.toLocaleString()}</td>
                      <td className="text-end">${(totalCogsCurrent - totalCogsPrevious).toLocaleString()}</td>
                      <td className="text-end">{( ((totalCogsCurrent - totalCogsPrevious) / totalCogsPrevious) * 100 ).toFixed(1)}%</td>
                    </tr>

                    {/* Gross Profit Subtotal */}
                    <tr className="table-success fw-bold text-success" style={{ fontSize: '1.05rem' }}>
                      <td colSpan={2}>GROSS PROFIT</td>
                      <td className="text-end">${grossProfitCurrent.toLocaleString()}</td>
                      <td className="text-end">${grossProfitPrevious.toLocaleString()}</td>
                      <td className="text-end">${(grossProfitCurrent - grossProfitPrevious).toLocaleString()}</td>
                      <td className="text-end">{( ((grossProfitCurrent - grossProfitPrevious) / grossProfitPrevious) * 100 ).toFixed(1)}%</td>
                    </tr>

                    {/* Expenses Section */}
                    <tr className="table-light fw-bold"><td colSpan={6}>3. OPERATING EXPENSES</td></tr>
                    {pnlData.expenses.map(e => (
                      <tr key={e.code} style={{ borderBottom: `1px solid ${borderColor}` }}>
                        <td className="font-monospace text-muted">{e.code}</td>
                        <td><button className="btn btn-sm btn-link p-0 fw-bold" onClick={() => setSelectedSection(e)}>{e.name}</button></td>
                        <td className="text-end">${e.current.toLocaleString()}</td>
                        <td className="text-end">${e.previous.toLocaleString()}</td>
                        <td className="text-end text-danger">${e.variance.toLocaleString()}</td>
                        <td className="text-end text-danger">{e.varPercent}%</td>
                      </tr>
                    ))}
                    <tr className="fw-bold" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                      <td colSpan={2}>Total Operating Expenses</td>
                      <td className="text-end text-danger">${totalExpensesCurrent.toLocaleString()}</td>
                      <td className="text-end">${totalExpensesPrevious.toLocaleString()}</td>
                      <td className="text-end">${(totalExpensesCurrent - totalExpensesPrevious).toLocaleString()}</td>
                      <td className="text-end">{( ((totalExpensesCurrent - totalExpensesPrevious) / totalExpensesPrevious) * 100 ).toFixed(1)}%</td>
                    </tr>

                    {/* Net Profit Grand Total */}
                    <tr className="table-primary fw-bold text-primary" style={{ fontSize: '1.15rem', borderTop: '2px double #4f46e5' }}>
                      <td colSpan={2}>NET INCOME / PROFIT</td>
                      <td className="text-end">${netProfitCurrent.toLocaleString()}</td>
                      <td className="text-end">${netProfitPrevious.toLocaleString()}</td>
                      <td className="text-end">${(netProfitCurrent - netProfitPrevious).toLocaleString()}</td>
                      <td className="text-end">{( ((netProfitCurrent - netProfitPrevious) / netProfitPrevious) * 100 ).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────── */}
          {/* 5. VALIDATIONS & AI INSIGHTS             */}
          {/* ──────────────────────────────────────── */}
          <div className="col-12 col-xl-3">
            <div className="d-flex flex-column gap-3">
              {/* AI Financial insights */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faRobot} className="text-primary me-2" />
                  AI Profit Intelligence
                </h6>
                <div className="d-flex flex-column gap-2">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="p-2 rounded border" style={{ borderColor: borderColor }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold text-primary">{insight.title}</span>
                        <span className="badge bg-success text-white" style={{ fontSize: '9px' }}>{insight.status}</span>
                      </div>
                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>{insight.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Recommendations */}
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: cardBg }}>
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faLightbulb} className="text-warning me-2" />
                  Smart Cost Optimizer
                </h6>
                <div className="small text-muted">
                  <p className="mb-2"><strong>Target: Cloud hosting optimization</strong></p>
                  <span>Estimated savings: <strong>$15,000 / month</strong></span>
                  <button className="btn btn-sm btn-link p-0 d-block mt-2 text-decoration-none" onClick={() => addNotification('Savings checklist dispatched to IT team.', 'success')}>
                    Apply Recommendations →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────── */}
      {/* 6. ACCOUNT DETAIL DRAWER                 */}
      {/* ──────────────────────────────────────── */}
      {selectedSection && (
        <div className="glass-card shadow-lg" style={{
          position: 'fixed', top: 0, right: 0, width: '45%', height: '100vh',
          zIndex: 1050, padding: '24px', display: 'flex', flexDirection: 'column',
          borderRadius: '20px 0 0 20px', border: 'none', background: isDark ? 'rgba(30, 41, 59, 0.98)' : '#ffffff',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <span className="premium-badge bg-primary text-white mb-1">Income statement Category Drill-down</span>
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>{selectedSection.name} ({selectedSection.code})</h5>
            </div>
            <button className="btn btn-link p-0 text-muted" onClick={() => setSelectedSection(null)}><FontAwesomeIcon icon={faXmark} className="fs-5" /></button>
          </div>

          <div className="flex-grow-1 overflow-auto">
            <div className="mb-4">
              <h6 className="fw-bold text-primary">Profitability Variance Metrics</h6>
              <div className="row g-3 mt-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Current Period Posting</span>
                  <strong style={{ color: textColor }}>${selectedSection.current.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Previous Period Posting</span>
                  <strong style={{ color: textColor }}>${selectedSection.previous.toLocaleString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Variance Amount</span>
                  <strong className={selectedSection.variance >= 0 ? 'text-success' : 'text-danger'}>
                    ${selectedSection.variance.toLocaleString()}
                  </strong>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Variance %</span>
                  <strong className={selectedSection.varPercent >= 0 ? 'text-success' : 'text-danger'}>
                    {selectedSection.varPercent}%
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErpProfitLoss;
