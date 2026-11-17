import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faEye, faRefresh, faHistory, faDatabase,
  faUser, faInfoCircle, faChevronRight, faXmark, faBolt, faCalendarCheck,
  faGaugeHigh, faLink, faCogs, faToggleOn, faToggleOff, faTrashCan,
  faPlay, faClock, faCircleCheck, faTriangleExclamation, faSliders,
  faFloppyDisk, faCode, faChartLine, faFileSignature, faSitemap,
  faScaleBalanced, faBell, faFilePen
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';

// ----------------------------------------------------------------------
// INITIAL DATASETS
// ----------------------------------------------------------------------
const INITIAL_RULES = [
  { id: 1, code: 'AUT-001', name: 'Vendor Bill 3-Way Match Verification', module: 'Banking', trigger: 'Daily 02:00 AM', action: 'Auto-Compare PO, Goods Receipt, and Bill', status: 'Active', lastRun: '2026-07-07 02:05:12', successRate: '98.5%' },
  { id: 2, code: 'AUT-002', name: 'Quarterly Asset Depreciation Posting Run', module: 'Accounting', trigger: 'End of Quarter 11:59 PM', action: 'Generate Journal Entry Postings', status: 'Active', lastRun: '2026-06-30 23:59:01', successRate: '100%' },
  { id: 3, code: 'AUT-003', name: 'Recurring Sales Invoices Run', module: 'Receivables', trigger: '1st of Month 08:00 AM', action: 'Dispatch Invoices via Email', status: 'Active', lastRun: '2026-07-01 08:00:15', successRate: '99.2%' },
  { id: 4, code: 'AUT-004', name: 'Slack Budget Threshold Warning Ping', module: 'Budgets', trigger: 'On GL Debit posting', action: 'Post warning webhook to #finance-alarms', status: 'Inactive', lastRun: '2026-07-06 14:15:33', successRate: '100%' }
];

const INITIAL_LOGS = [
  { id: 1001, timestamp: '2026-07-07 02:05:12', ruleName: 'Vendor Bill 3-Way Match Verification', status: 'Success', details: 'Matched 42 purchase invoices against receiving slips successfully.', duration: '12.4s' },
  { id: 1002, timestamp: '2026-07-06 14:15:33', ruleName: 'Slack Budget Threshold Warning Ping', status: 'Success', details: 'Budget alert triggered for Sourcing Dept. Slack payload dispatched.', duration: '1.8s' },
  { id: 1003, timestamp: '2026-07-01 08:00:15', ruleName: 'Recurring Sales Invoices Run', status: 'Warning', details: 'Dispatched 15 invoices. 1 invoice failed due to invalid recipient email.', duration: '45.1s' }
];

const ErpAutomationCenter = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faChartLine },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faFileSignature },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faSitemap },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faHistory },
    { id: 'erp_drafts', label: 'Drafts', icon: faFilePen },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faScaleBalanced },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faBolt }
  ];

  // Sub-view router: 'list' | 'create_rule'
  const [currentSubView, setCurrentSubView] = useState('list');

  // Core state variables
  const [rules, setRules] = useState(INITIAL_RULES);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // KPI Metrics States
  const [activeCount, setActiveCount] = useState(3);
  const [dueRulesCount, setDueRulesCount] = useState(1);
  const [failedRunsCount, setFailedRunsCount] = useState(0);
  const [unreadAlerts, setUnreadAlerts] = useState(1);

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    triggerType: 'Schedule-Based',
    module: 'Accounting',
    cronPreset: 'Daily at 12:00 AM',
    customCron: '0 0 * * *',
    eventTrigger: 'On GL Debit posting',
    condField: 'Total Value Limit',
    condOperator: 'is greater than',
    condValue: '100000',
    actTarget: 'Post General Ledger Journal',
    actNotify: 'Send Email Alert'
  });

  const handleToggleRule = (id, name) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Active' ? 'Inactive' : 'Active';
        addNotification(`Automation "${name}" status toggled to ${nextStatus}.`, 'info');
        return { ...r, status: nextStatus };
      }
      return r;
    }));
    setActiveCount(prev => (rules.find(r => r.id === id).status === 'Active') ? prev - 1 : prev + 1);
  };

  const handleRunNow = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    addNotification(`Executing robotic task "${rule.name}" instantly...`, 'info');

    setTimeout(() => {
      const runLog = {
        id: Date.now(),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ruleName: rule.name,
        status: 'Success',
        details: `Manual trigger complete. ${rule.action} executed.`,
        duration: '2.5s'
      };
      setLogs(prev => [runLog, ...prev]);
      
      setRules(prev => prev.map(r => {
        if (r.id === ruleId) {
          return { ...r, lastRun: runLog.timestamp };
        }
        return r;
      }));

      addNotification(`Execution succeeded. Logs updated.`, 'success');
    }, 1200);
  };

  const handleDeleteRule = (id) => {
    if (!window.confirm("Are you sure you want to delete this automation rule?")) return;
    setRules(prev => prev.filter(r => r.id !== id));
    addNotification("Automation rule deleted.", "warning");
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRule.name) {
      addNotification("Please enter a Rule Name.", "danger");
      return;
    }

    const created = {
      id: Date.now(),
      code: `AUT-0${rules.length + 1}`,
      name: newRule.name,
      module: newRule.module,
      trigger: newRule.triggerType === 'Schedule-Based' ? newRule.cronPreset : newRule.eventTrigger,
      action: `${newRule.actTarget} & ${newRule.actNotify}`,
      status: 'Active',
      lastRun: 'Never executed',
      successRate: '100.0%'
    };

    setRules(prev => [...prev, created]);
    setActiveCount(prev => prev + 1);
    addNotification(`Automation Rule "${newRule.name}" created and background worker provisioned.`, 'success');
    
    // Reset Form
    setNewRule({
      name: '',
      description: '',
      triggerType: 'Schedule-Based',
      module: 'Accounting',
      cronPreset: 'Daily at 12:00 AM',
      customCron: '0 0 * * *',
      eventTrigger: 'On GL Debit posting',
      condField: 'Total Value Limit',
      condOperator: 'is greater than',
      condValue: '100000',
      actTarget: 'Post General Ledger Journal',
      actNotify: 'Send Email Alert'
    });
    
    setCurrentSubView('list');
  };

  const handleScanNow = () => {
    addNotification("Scanning schedules and queue tasks...", "info");
    setTimeout(() => {
      addNotification("Reminder scan completed. No overdue tasks found.", "success");
    }, 1000);
  };

  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)', color: '#fff' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '120px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '400px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-4 mb-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="p-3 border-0 shadow-sm rounded" style={{ background: isDark ? '#1F2937' : '#fff', borderLeft: '5px solid #4F46E5' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '70%', height: '12px', background: isDark ? '#374151' : '#f1f5f9' }} />
                <div className="skeleton-box rounded" style={{ width: '40%', height: '24px', background: isDark ? '#374151' : '#f1f5f9' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-0 pb-5" style={{ backgroundColor: isDark ? '#111827' : '#F5F7FB', minHeight: '100vh', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO BANNER                                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 pt-4 text-start">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)',
          color: '#FFFFFF'
        }}>
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)' }}></div>
          
          <div className="row align-items-center position-relative z-3">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-20 text-info px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill">
                Phase 9A - Automation
              </span>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6">
                Robotic Automation Center
              </h1>
              <p className="text-light text-opacity-80 fs-6 mb-4" style={{ maxWidth: '650px' }}>
                Configure robotic general ledger vouchers, automatic invoice matching, and schedule recurring tasks.
              </p>
              
              <div className="d-flex flex-wrap gap-2">
                {currentSubView === 'list' ? (
                  <>
                    <button 
                      className="btn btn-primary text-white fw-bold px-4 py-2 border-0"
                      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)', borderRadius: '10px' }}
                      onClick={() => setCurrentSubView('create_rule')}
                    >
                      <FontAwesomeIcon icon={faPlus} /> New Automation Rule
                    </button>
                    <button 
                      className="btn btn-outline-light fw-bold px-4 py-2"
                      onClick={handleScanNow}
                    >
                      <FontAwesomeIcon icon={faRefresh} /> Run Reminder Scan
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-outline-light fw-bold px-4 py-2"
                    onClick={() => setCurrentSubView('list')}
                  >
                    Back to Automations List
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="container-fluid px-4 px-lg-5 mb-4 text-start">
        <div className="pill-tab-nav shadow-sm bg-white p-2 rounded-pill d-inline-flex" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: isDark ? '1px solid #374151' : '1px solid #E2E8F0' }}>
          {navigationTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderRadius: '24px', padding: '8px 18px', fontWeight: '600', fontSize: '13px', border: 'none', transition: 'all 0.2s',
                color: activeTab === tab.id ? '#fff' : (isDark ? '#cbd5e1' : '#4b5563'),
                background: activeTab === tab.id ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* DYNAMIC SUBVIEWS SWITCH                                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {currentSubView === 'list' ? (
        
        // VIEW A: AUTOMATION DASHBOARD LIST
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          
          {/* Summary KPI Cards */}
          <div className="row g-4 mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card p-3 border-0 shadow-sm border-start border-5" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderLeftColor: '#4F46E5' }}>
                <span className="small text-muted mb-1 text-uppercase fw-bold">Active Rules Running</span>
                <h4 className="fw-extrabold text-indigo mb-0">{activeCount} Rules</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card p-3 border-0 shadow-sm border-start border-5" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderLeftColor: '#F59E0B' }}>
                <span className="small text-muted mb-1 text-uppercase fw-bold">Scheduled Runs Today</span>
                <h4 className="fw-extrabold text-warning mb-0">{dueRulesCount} Jobs</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card p-3 border-0 shadow-sm border-start border-5" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderLeftColor: '#EF4444' }}>
                <span className="small text-muted mb-1 text-uppercase fw-bold">Failed Execution Runs</span>
                <h4 className="fw-extrabold text-danger mb-0">{failedRunsCount} Failed</h4>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card p-3 border-0 shadow-sm border-start border-5" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderLeftColor: '#10B981' }}>
                <span className="small text-muted mb-1 text-uppercase fw-bold">Unread Activity Alerts</span>
                <h4 className="fw-extrabold text-success mb-0">{unreadAlerts} Alerts</h4>
              </div>
            </div>
          </div>

          {/* Active Rules register */}
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faCogs} className="text-primary me-2" /> Active Robotic Automation Rules</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Rule Code</th>
                    <th>Automation Rule Name</th>
                    <th>Target Module</th>
                    <th>Trigger Schedule / Event</th>
                    <th>Action Logic Target</th>
                    <th>Last Run Run</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(r => (
                    <tr key={r.id}>
                      <td className="fw-bold font-monospace text-primary">{r.code}</td>
                      <td>
                        <strong className="d-block">{r.name}</strong>
                      </td>
                      <td><span className="badge bg-light text-dark font-monospace border">{r.module}</span></td>
                      <td><span className="font-monospace text-indigo fw-semibold">{r.trigger}</span></td>
                      <td className="small text-muted">{r.action}</td>
                      <td><span className="small text-muted font-monospace">{r.lastRun}</span></td>
                      <td>
                        <button className="btn btn-link p-0 text-decoration-none" style={{ color: r.status === 'Active' ? '#10b981' : '#6B7280' }} onClick={() => handleToggleRule(r.id, r.name)}>
                          <FontAwesomeIcon icon={r.status === 'Active' ? faToggleOn : faToggleOff} className="fs-5 me-1" />
                          <span className="small fw-semibold">{r.status}</span>
                        </button>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-xs btn-outline-primary" title="Execute Rule Now" onClick={() => handleRunNow(r.id)}>
                            <FontAwesomeIcon icon={faPlay} /> Run
                          </button>
                          <button className="btn btn-xs btn-danger text-white" title="Delete Rule" onClick={() => handleDeleteRule(r.id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Execution logs / Worker runs history */}
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-white" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faHistory} className="text-success me-2" /> Recent Background Workers Logs</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Automation Rule Triggered</th>
                    <th>Run Duration</th>
                    <th>Execution Logs & Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td><span className="small text-muted font-monospace">{log.timestamp}</span></td>
                      <td className="fw-semibold">{log.ruleName}</td>
                      <td><span className="badge bg-light text-dark font-monospace border"><FontAwesomeIcon icon={faClock} className="me-1" />{log.duration}</span></td>
                      <td className="small text-muted">{log.details}</td>
                      <td>
                        <span className={`badge rounded-pill ${
                          log.status === 'Success' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'
                        }`}><FontAwesomeIcon icon={log.status === 'Success' ? faCircleCheck : faTriangleExclamation} className="me-1" />{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      ) : (

        // VIEW B: CREATE AUTOMATION RULE WIZARD (SELF-CONTAINED PAGE)
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          <form onSubmit={handleCreateRule}>
            <div className="row g-4">
              
              {/* Column Left: Parameters */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faSliders} className="me-2 text-primary" /> Rule Definition</h5>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-light" onClick={() => setCurrentSubView('list')}>Cancel</button>
                      <button type="submit" className="btn btn-sm btn-success text-white"><FontAwesomeIcon icon={faFloppyDisk} /> Create Rule</button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Automation Rule Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="e.g. Bulk Month-End General Ledger Postings"
                      value={newRule.name}
                      onChange={e => setNewRule({...newRule, name: e.target.value})}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Rule Description & Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="2" 
                      placeholder="Background explanation on what matching logics or triggers are used..."
                      value={newRule.description}
                      onChange={e => setNewRule({...newRule, description: e.target.value})}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Trigger Logic Type</label>
                      <select className="form-select" value={newRule.triggerType} onChange={e => setNewRule({...newRule, triggerType: e.target.value})}>
                        <option value="Schedule-Based">Schedule-Based (Cron Timer)</option>
                        <option value="Event-Based">Event-Based (System Hooks)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Target Accounting Module</label>
                      <select className="form-select" value={newRule.module} onChange={e => setNewRule({...newRule, module: e.target.value})}>
                        <option value="Accounting">Accounting GL</option>
                        <option value="Receivables">Accounts Receivable (Sales)</option>
                        <option value="Inventory">Inventory Service</option>
                        <option value="Banking">Banking & Cash</option>
                        <option value="Budgets">Budgets & Spend</option>
                      </select>
                    </div>
                  </div>

                  {newRule.triggerType === 'Schedule-Based' ? (
                    <div className="p-3 bg-light rounded-3 border mb-3" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                      <h6 className="fw-bold small mb-2"><FontAwesomeIcon icon={faClock} className="text-primary me-1" /> Cron Scheduler</h6>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="x-small text-muted fw-bold">Preset Timings</label>
                          <select className="form-select form-select-sm" value={newRule.cronPreset} onChange={e => setNewRule({...newRule, cronPreset: e.target.value})}>
                            <option>Every Hour</option>
                            <option>Daily at 12:00 AM</option>
                            <option>Weekly (Sundays 11:00 PM)</option>
                            <option>Monthly (1st at 08:00 AM)</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label className="x-small text-muted fw-bold">Custom Cron Syntax</label>
                          <input 
                            type="text" 
                            className="form-control form-control-sm font-monospace" 
                            value={newRule.customCron}
                            onChange={e => setNewRule({...newRule, customCron: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-light rounded-3 border mb-3" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                      <h6 className="fw-bold small mb-2"><FontAwesomeIcon icon={faBolt} className="text-warning me-1" /> Event Hooks</h6>
                      <label className="x-small text-muted fw-bold">Select System Event Trigger</label>
                      <select className="form-select form-select-sm" value={newRule.eventTrigger} onChange={e => setNewRule({...newRule, eventTrigger: e.target.value})}>
                        <option>On GL Debit posting</option>
                        <option>On Vendor Invoice Match</option>
                        <option>On Receipt Uploaded</option>
                        <option>On Employee Advance Approved</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Column Right: Rules Builder Logic */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                  <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faSliders} className="me-2 text-success" /> Condition & Action Nodes</h5>
                  
                  {/* Condition Builder */}
                  <div className="p-3 bg-light rounded-3 border mb-4 text-start" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
                    <h6 className="fw-bold small mb-3 text-primary">IF (Trigger Conditions)</h6>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="x-small text-muted fw-bold">Evaluation Field</label>
                        <select className="form-select form-select-sm" value={newRule.condField} onChange={e => setNewRule({...newRule, condField: e.target.value})}>
                          <option>Total Value Limit</option>
                          <option>Cost Center Dept</option>
                          <option>Invoice Payment Status</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="x-small text-muted fw-bold">Operator</label>
                        <select className="form-select form-select-sm" value={newRule.condOperator} onChange={e => setNewRule({...newRule, condOperator: e.target.value})}>
                          <option>is greater than</option>
                          <option>is equal to</option>
                          <option>contains keyword</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="x-small text-muted fw-bold">Target Parameter</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm" 
                          value={newRule.condValue}
                          onChange={e => setNewRule({...newRule, condValue: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Configurator */}
                  <div className="p-3 bg-light rounded-3 border text-start" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC' }}>
                    <h6 className="fw-bold small mb-3 text-success">THEN (Automated Actions)</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="x-small text-muted fw-bold">Primary Executable Action</label>
                        <select className="form-select form-select-sm" value={newRule.actTarget} onChange={e => setNewRule({...newRule, actTarget: e.target.value})}>
                          <option>Post General Ledger Journal</option>
                          <option>Flag Invoice for Verification</option>
                          <option>Update Inventory Levels</option>
                          <option>Export Bank Statement Rows</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="x-small text-muted fw-bold">Secondary Notification Action</label>
                        <select className="form-select form-select-sm" value={newRule.actNotify} onChange={e => setNewRule({...newRule, actNotify: e.target.value})}>
                          <option>Send Email Alert</option>
                          <option>Dispatch Slack webhook payload</option>
                          <option>Log as Standard warning</option>
                          <option>None (Quiet post)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top text-end">
                    <button type="submit" className="btn btn-success px-4 text-white"><FontAwesomeIcon icon={faPlus} className="me-1" /> Initialize Worker Rule</button>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>

      )}

    </div>
  );
};

export default ErpAutomationCenter;
