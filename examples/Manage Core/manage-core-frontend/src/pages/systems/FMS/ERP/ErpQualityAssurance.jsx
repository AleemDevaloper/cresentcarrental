import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved, faChartLine, faFolderOpen, faSliders, faBook, faFileAlt,
  faScaleBalanced, faFileInvoice, faCoins, faUsers, faClock, faRefresh,
  faTriangleExclamation, faCircleCheck, faPlay, faTrashCan, faHistory,
  faServer, faBrain, faBolt, faCalendarDays, faCheck, faDownload, faCircleInfo,
  faSlidersH, faBug, faLock
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import ErpReportHeader from '../../../../components/common/ErpReportHeader';

// ----------------------------------------------------------------------
// INITIAL DATASETS
// ----------------------------------------------------------------------
const INITIAL_MODULES = [
  { id: 'gl', name: 'General Ledger', pct: 100, status: 'Passed', issues: 0, desc: 'COA mapping, balances, and posting sequences are aligned.' },
  { id: 'ap', name: 'Accounts Payable', pct: 95, status: 'Warning', issues: 1, desc: '1 duplicate supplier record detected in vendor master.' },
  { id: 'ar', name: 'Accounts Receivable', pct: 90, status: 'Warning', issues: 1, desc: 'Credit limit rules configuration warning.' },
  { id: 'bank', name: 'Banking & Cash', pct: 100, status: 'Passed', issues: 0, desc: 'Bank statement feeds connected and reconciled.' },
  { id: 'budget', name: 'Budget Management', pct: 100, status: 'Passed', issues: 0, desc: 'Department variance alerts set up.' },
  { id: 'tax', name: 'Tax Management', pct: 85, status: 'Critical', issues: 1, desc: 'Withholding FBR category rule check failed.' }
];

const INITIAL_HISTORY = [
  { runId: 'RUN-9912', type: 'Full Verification', user: 'Admin User', time: '2026-07-07 11:20:00', duration: '4.8s', modules: 6, passed: 142, warnings: 6, failed: 2, status: 'Completed with Errors' },
  { runId: 'RUN-9908', type: 'Finance Scope', user: 'Sarah Connor', time: '2026-07-05 14:15:30', duration: '2.5s', modules: 3, passed: 98, warnings: 2, failed: 0, status: 'Passed' }
];

const ErpQualityAssurance = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const navigationTabs = [
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

  // Core component states
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [readinessScore, setReadinessScore] = useState(94);
  const [isValidating, setIsValidating] = useState(false);

  // Summary Metrics State
  const [stats, setStats] = useState({
    rulesExecuted: 150,
    passedChecks: 142,
    warningsCount: 6,
    criticalIssues: 2
  });

  const handleRunValidation = () => {
    setIsValidating(true);
    addNotification("Initializing ERP rules verification checks...", "info");
    
    // Simulate real-time background workers running checks
    setTimeout(() => {
      setReadinessScore(100);
      setStats({
        rulesExecuted: 150,
        passedChecks: 150,
        warningsCount: 0,
        criticalIssues: 0
      });
      setModules(prev => prev.map(m => ({ ...m, pct: 100, status: 'Passed', issues: 0 })));
      
      const newRun = {
        runId: `RUN-${Math.floor(9900 + Math.random() * 99)}`,
        type: 'Full Verification',
        user: 'Admin User',
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        duration: '3.4s',
        modules: 6,
        passed: 150,
        warnings: 0,
        failed: 0,
        status: 'Passed'
      };
      setHistory(prev => [newRun, ...prev]);
      
      setIsValidating(false);
      addNotification("Validation complete. ERP is 100% production ready.", "success");
    }, 1500);
  };

  const handleExportReport = () => {
    addNotification("Generating QA validation document PDF...", "info");
    setTimeout(() => {
      addNotification("QA report downloaded successfully.", "success");
    }, 800);
  };

  if (loading) {
    return (
      <div className="container-fluid px-0 pb-5 text-start" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="container-fluid px-4 px-lg-5 py-4">
          <div style={{ height: 80, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} className="mb-4" />
          <div className="row g-4 mb-4">
            <div className="col-lg-4"><div style={{ height: 200, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            <div className="col-lg-8"><div style={{ height: 200, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
          </div>
          <div className="row g-4">
            {[1,2,3].map(i => (
              <div key={i} className="col-xl-4 col-md-6"><div style={{ height: 160, borderRadius: 14, background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }} /></div>
            ))}
          </div>
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
        title="Finance Quality Assurance"
        badge="PHASE 10 – ERP VALIDATION"
        description="Validate configuration, accounting integrity, security, workflows, compliance, performance, and ERP readiness before production deployment."
        isDark={isDark}
        activeTabId="qa"
        onTabClick={handleTabClick}
        actions={[
          {
            label: isValidating ? 'Validating...' : 'Run Full Validation',
            icon: faPlay,
            onClick: handleRunValidation,
            variant: 'primary'
          },
          {
            label: 'Generate QA Report',
            icon: faDownload,
            onClick: handleExportReport,
            variant: 'outline'
          }
        ]}
      />

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* ERP READINESS SCORE & KPI WIDGETS                                      */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4">
        <div className="row g-4">
          
          {/* Circular Gauge Card */}
          <div className="col-lg-4 col-md-5">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white text-center h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h6 className="fw-bold text-slate-700 mb-3">ERP Readiness Score</h6>
              
              <div className="d-flex flex-column align-items-center justify-content-center py-3">
                <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                  {/* Visual SVG Progress ring */}
                  <svg className="position-absolute" style={{ transform: 'rotate(-90deg)', width: '130px', height: '130px' }}>
                    <circle cx="65" cy="65" r="55" stroke={isDark ? "#374151" : "#E2E8F0"} strokeWidth="12" fill="transparent" />
                    <circle 
                      cx="65" cy="65" r="55" 
                      stroke={readinessScore === 100 ? "#10B981" : "#F59E0B"} 
                      strokeWidth="12" fill="transparent" 
                      strokeDasharray="345.5" 
                      strokeDashoffset={345.5 - (345.5 * readinessScore) / 100}
                      style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                    />
                  </svg>
                  <h2 className="fw-extrabold mb-0">{readinessScore}%</h2>
                </div>
                
                <span className={`badge rounded-pill px-3 py-2 mt-3 bg-${readinessScore === 100 ? 'success' : 'warning'}`}>
                  {readinessScore === 100 ? 'Production Ready' : 'Warning: Action Required'}
                </span>
                <span className="small text-muted d-block mt-2">Overall ERP configuration health matrix.</span>
              </div>
            </div>
          </div>

          {/* Core Validation KPI Dashboard */}
          <div className="col-lg-8 col-md-7">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h6 className="fw-bold mb-3">Executive QA Rules Execution</h6>
              <div className="row g-3">
                {[
                  { title: 'Validation Rules', val: stats.rulesExecuted, desc: 'Executed rules engine.', color: 'primary' },
                  { title: 'Passed Checks', val: stats.passedChecks, desc: 'Validated configurations.', color: 'success' },
                  { title: 'Warnings Detected', val: stats.warningsCount, desc: 'Minor reviews needed.', color: 'warning' },
                  { title: 'Critical Issues', val: stats.criticalIssues, desc: 'Blocking parameters.', color: 'danger' },
                  { title: 'Validated Modules', val: 6, desc: 'Active ERP modules checked.', color: 'info' },
                  { title: 'System Latency Score', val: '120ms', desc: 'Average query response.', color: 'success' }
                ].map(kpi => (
                  <div key={kpi.title} className="col-md-4 col-6">
                    <div className="p-3 bg-light rounded-3 border">
                      <span className="x-small text-muted d-block">{kpi.title}</span>
                      <strong className={`fs-4 text-${kpi.color}`}>{kpi.val}</strong>
                      <span className="x-small text-muted d-block">{kpi.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* MODULE READINESS CARDS                                                 */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <h5 className="fw-bold mb-3">Finance Module Readiness</h5>
        <div className="row g-4">
          {modules.map(mod => (
            <div key={mod.id} className="col-xl-4 col-md-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-slate-800">{mod.name}</strong>
                    <span className={`badge rounded-pill ${
                      mod.status === 'Passed' ? 'bg-success bg-opacity-10 text-success' :
                      mod.status === 'Warning' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-danger bg-opacity-10 text-danger'
                    }`}>{mod.status}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="progress flex-grow-1" style={{ height: '6px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${mod.pct}%` }}></div>
                    </div>
                    <span className="small font-monospace text-muted">{mod.pct}%</span>
                  </div>
                  <p className="small text-muted mb-3">{mod.desc}</p>
                </div>
                <div className="border-top pt-2 d-flex justify-content-between align-items-center text-muted x-small">
                  <span>Issues: <strong className={mod.issues > 0 ? "text-danger" : "text-muted"}>{mod.issues}</strong></span>
                  <button className="btn btn-xs btn-link p-0 text-decoration-none" onClick={() => addNotification(`Re-running validation checks for ${mod.name}...`, 'info')}>Re-run</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SECURITY & DATA QUALITY CHECKLISTS                                    */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="row g-4">
          
          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faLock} className="text-primary me-2" /> Security Validation Checklist</h5>
              <div className="d-flex flex-column gap-3 small text-muted">
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span>User Authentication & RBAC Rules</span>
                  <span className="text-success"><FontAwesomeIcon icon={faCircleCheck} /> Passed</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span>SSL/TLS API Certificates Validation</span>
                  <span className="text-success"><FontAwesomeIcon icon={faCircleCheck} /> Secure</span>
                </div>
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span>SHA-256 Ledger Database Encryption</span>
                  <span className="text-success"><FontAwesomeIcon icon={faCircleCheck} /> Active</span>
                </div>
                <div className="d-flex justify-content-between pb-1">
                  <span>Multi-Factor Authentication Enforce Policy</span>
                  {stats.criticalIssues > 0 ? (
                    <span className="text-danger"><FontAwesomeIcon icon={faTriangleExclamation} /> Inactive</span>
                  ) : (
                    <span className="text-success"><FontAwesomeIcon icon={faCircleCheck} /> Enforced</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
              <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faBrain} className="text-primary me-2" /> AI Smart Diagnostic Recommendations</h5>
              <div className="d-flex flex-column gap-3">
                {stats.criticalIssues > 0 ? (
                  <>
                    <div className="p-3 bg-light rounded-3 border border-start border-5 border-start-danger">
                      <strong className="d-block small text-danger"><FontAwesomeIcon icon={faTriangleExclamation} /> Security: Enable MFA policy</strong>
                      <p className="x-small text-muted mb-0">Auditor rules require MFA to be enabled for all lead accountant roles before live double-entry journals are authorized.</p>
                    </div>
                    <div className="p-3 bg-light rounded-3 border border-start border-5 border-start-warning">
                      <strong className="d-block small text-warning"><FontAwesomeIcon icon={faTriangleExclamation} /> Configuration: Tax Category rule missing</strong>
                      <p className="x-small text-muted mb-0">FBR compliance check requires defining a withholding rate tier for new active supplier profiles.</p>
                    </div>
                  </>
                ) : (
                  <div className="p-5 text-center text-muted">
                    <FontAwesomeIcon icon={faCircleCheck} className="fs-1 text-success mb-3" />
                    <p className="small mb-0">All validation checks passed. System in 100% compliant state.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* VALIDATION EXECUTION HISTORY                                           */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
          <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faHistory} className="me-2 text-primary" /> System Validation Runs History</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Validation Scope</th>
                  <th>Authorized By</th>
                  <th>Execution Timestamp</th>
                  <th>Run Duration</th>
                  <th>Modules Checked</th>
                  <th>Passed Checks</th>
                  <th>Warnings Found</th>
                  <th>Critical Fails</th>
                  <th>Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(run => (
                  <tr key={run.runId}>
                    <td className="fw-bold font-monospace text-primary">{run.runId}</td>
                    <td>{run.type}</td>
                    <td>{run.user}</td>
                    <td><span className="small text-muted font-monospace">{run.time}</span></td>
                    <td><span className="badge bg-light text-dark font-monospace border">{run.duration}</span></td>
                    <td>{run.modules} Modules</td>
                    <td className="text-success fw-bold">{run.passed} checks</td>
                    <td className={run.warnings > 0 ? 'text-warning fw-bold' : 'text-muted'}>{run.warnings} warnings</td>
                    <td className={run.failed > 0 ? 'text-danger fw-bold' : 'text-muted'}>{run.failed} fails</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        run.status === 'Passed' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
                      }`}>{run.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ErpQualityAssurance;
