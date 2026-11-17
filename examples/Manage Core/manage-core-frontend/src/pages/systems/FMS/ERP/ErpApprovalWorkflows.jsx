import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus, faSearch, faFilter, faEye, faTrash, faEdit, faRefresh,
  faCheckCircle, faBan, faSitemap, faCogs, faScaleBalanced, faChartLine,
  faHistory, faLink, faPlusCircle, faCodeBranch, faClock, faUser,
  faInfoCircle, faChevronRight, faXmark, faCheck, faTrashCan, faSave,
  faSliders, faCopy, faDiagramProject, faFileSignature, faBolt
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';

// ----------------------------------------------------------------------
// INITIAL DATASETS
// ----------------------------------------------------------------------
const INITIAL_WORKFLOWS = [
  {
    id: 1,
    code: 'WF-AP-01',
    name: 'High-Value Procurement Router',
    module: 'Purchase',
    dept: 'Sourcing & Log',
    amountRange: '> PKR 1,000,000',
    levels: 3,
    type: 'Sequential',
    company: 'Manage Core Ltd',
    status: 'Active',
    sla: '24 Hours',
    steps: [
      { level: 1, role: 'Department Head', assignee: 'Sarah Connor', action: 'Review Receipt Rules', slaHours: 24 },
      { level: 2, role: 'Finance VP', assignee: 'Mike Ross', action: 'Verify GL Allocations', slaHours: 12 },
      { level: 3, role: 'CFO Signoff', assignee: 'Harvey Specter', action: 'Digital Ledger Signing', slaHours: 8 }
    ],
    escalations: { hours: 48, action: 'Escalate to Super Admin' }
  },
  {
    id: 2,
    code: 'WF-GL-02',
    name: 'Payroll Voucher Signoff',
    module: 'Payroll',
    dept: 'HR & Admin',
    amountRange: 'All amounts',
    levels: 2,
    type: 'Sequential',
    company: 'Manage Core Ltd',
    status: 'Active',
    sla: '12 Hours',
    steps: [
      { level: 1, role: 'Lead Accountant', assignee: 'Rachel Zane', action: 'T-Account Balance Validation', slaHours: 12 },
      { level: 2, role: 'Financial Controller', assignee: 'Admin User', action: 'Post to Double-Entry Engine', slaHours: 4 }
    ],
    escalations: { hours: 24, action: 'Notify Operations VP' }
  },
  {
    id: 3,
    code: 'WF-EXP-03',
    name: 'Opex Reimbursement Limit',
    module: 'Expenses',
    dept: 'Engineering',
    amountRange: '> PKR 50,000',
    levels: 2,
    type: 'Parallel',
    company: 'Manage Core Ltd',
    status: 'Active',
    sla: '48 Hours',
    steps: [
      { level: 1, role: 'Direct Line Manager', assignee: 'John Doe', action: 'Receipt Deductible Verification', slaHours: 48 },
      { level: 2, role: 'HR Payroll Lead', assignee: 'Jessica Pearson', action: 'Reimbursement Release Approval', slaHours: 24 }
    ],
    escalations: { hours: 72, action: 'Auto-Reject Claim' }
  }
];

const ErpApprovalWorkflows = () => {
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

  // Component views: 'list' | 'builder'
  const [currentView, setCurrentView] = useState('list');
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  // New Workflow Form State
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    module: 'Purchase',
    dept: 'Finance & Accounts',
    amountRange: 'All amounts',
    type: 'Sequential',
    company: 'Manage Core Ltd',
    description: '',
    sla: '24 Hours'
  });

  // Level steps state in builder
  const [builderSteps, setBuilderSteps] = useState([
    { level: 1, role: 'Department Manager', assignee: 'Sarah Connor', action: 'Verify Details', slaHours: 24 }
  ]);

  // Escalation rule state in builder
  const [builderEscalation, setBuilderEscalation] = useState({
    hours: 24,
    action: 'Escalate to Super Admin'
  });

  const handleToggleStatus = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w));
    addNotification('Workflow state updated.', 'info');
  };

  const handleCloneWorkflow = (w) => {
    const cloned = {
      ...w,
      id: Date.now(),
      code: `WF-CL-${Math.floor(10 + Math.random() * 90)}`,
      name: `${w.name} (Copy)`
    };
    setWorkflows(prev => [...prev, cloned]);
    addNotification(`Cloned workflow template successfully.`, 'success');
  };

  const handleDeleteWorkflow = (id) => {
    if (!window.confirm("Are you sure you want to delete this approval workflow rule?")) return;
    setWorkflows(prev => prev.filter(w => w.id !== id));
    addNotification("Workflow removed.", "warning");
  };

  // BUILDER STEP HANDLERS
  const handleAddBuilderStep = () => {
    const nextLevel = builderSteps.length + 1;
    setBuilderSteps([...builderSteps, { level: nextLevel, role: 'Finance Officer', assignee: 'Mike Ross', action: 'Approve', slaHours: 24 }]);
  };

  const handleRemoveBuilderStep = (index) => {
    if (builderSteps.length === 1) return;
    const filtered = builderSteps.filter((_, idx) => idx !== index).map((step, idx) => ({ ...step, level: idx + 1 }));
    setBuilderSteps(filtered);
  };

  const handleUpdateStepField = (index, field, value) => {
    setBuilderSteps(prev => prev.map((step, idx) => idx === index ? { ...step, [field]: value } : step));
  };

  const handleSaveWorkflow = (e) => {
    e.preventDefault();
    if (!newWorkflow.name) {
      addNotification("Please enter a Workflow Chain Name.", "danger");
      return;
    }

    const created = {
      id: Date.now(),
      code: `WF-${newWorkflow.module.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      name: newWorkflow.name,
      module: newWorkflow.module,
      dept: newWorkflow.dept,
      amountRange: newWorkflow.amountRange,
      levels: builderSteps.length,
      type: newWorkflow.type,
      company: newWorkflow.company,
      status: 'Active',
      sla: newWorkflow.sla,
      steps: [...builderSteps],
      escalations: { ...builderEscalation }
    };

    setWorkflows([...workflows, created]);
    addNotification("New approval workflow rule successfully created and enabled.", "success");
    
    // Reset state & go back
    setNewWorkflow({
      name: '',
      module: 'Purchase',
      dept: 'Finance & Accounts',
      amountRange: 'All amounts',
      type: 'Sequential',
      company: 'Manage Core Ltd',
      description: '',
      sla: '24 Hours'
    });
    setBuilderSteps([{ level: 1, role: 'Department Manager', assignee: 'Sarah Connor', action: 'Verify Details', slaHours: 24 }]);
    setCurrentView('list');
  };

  if (loading) return (
    <div className="w-100 px-0 pb-4" style={{ minHeight: '100vh', backgroundColor: isDark ? '#111827' : '#F5F7FB' }}>
      <div className="container-fluid px-4 px-lg-5 pt-4">
        <div className="p-4 p-lg-5 shadow text-start position-relative overflow-hidden mb-4 rounded-4" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3E62 50%, #2563EB 100%)', color: '#fff' }}>
          <div className="skeleton-box rounded-pill mb-3" style={{ width: '180px', height: '28px', background: 'rgba(255,255,255,0.15)' }} />
          <div className="skeleton-box rounded mb-2" style={{ width: '400px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="skeleton-box rounded" style={{ width: '550px', height: '18px', background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="row g-2 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="p-3 border-0 shadow-sm rounded" style={{ background: isDark ? '#1F2937' : '#fff' }}>
                <div className="skeleton-box rounded mb-2" style={{ width: '60%', height: '12px', background: isDark ? '#374151' : '#f1f5f9' }} />
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
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3E62 50%, #2563EB 100%)',
          color: '#FFFFFF'
        }}>
          <div className="row align-items-center position-relative z-3">
            <div className="col-lg-8">
              <span className="badge bg-white bg-opacity-25 text-info px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill">
                WORKFLOW MANAGEMENT
              </span>
              <h1 className="fw-extrabold tracking-tight mb-2 display-6">
                Approval Workflows Routing
              </h1>
              <p className="text-light text-opacity-80 fs-6 mb-4" style={{ maxWidth: '650px' }}>
                Design budget spend thresholds, multi-level signature routing steps, and configure maker-checker hierarchies.
              </p>
              {currentView === 'list' ? (
                <button 
                  className="btn btn-primary text-white fw-bold px-4 py-2 border-0"
                  style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '10px' }}
                  onClick={() => setCurrentView('builder')}
                >
                  <FontAwesomeIcon icon={faPlus} /> Design New Workflow
                </button>
              ) : (
                <button 
                  className="btn btn-outline-light fw-bold px-4 py-2"
                  onClick={() => setCurrentView('list')}
                >
                  Back to Configured Rules
                </button>
              )}
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
      {/* DYNAMIC CONTENT SWITCH: LIST VS BUILDER                                */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {currentView === 'list' ? (
        
        // VIEW A: WORKFLOW REGISTRY LIST
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          
          <div className="row g-2 mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="card p-3 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                <span className="small text-muted mb-1">Configured Workflows</span>
                <h4 className="fw-bold text-primary mb-0">{workflows.length} Templates</h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card p-3 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                <span className="small text-muted mb-1">Active Rules Enabled</span>
                <h4 className="fw-bold text-success mb-0">{workflows.filter(w => w.status === 'Active').length} Routers</h4>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card p-3 border-0 shadow-sm" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                <span className="small text-muted mb-1">Average Turnaround SLA</span>
                <h4 className="fw-bold text-warning mb-0">28 Hours</h4>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm p-4 rounded-4" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
            <h5 className="fw-bold mb-3">Configured Routing Trees</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle custom-table mb-0" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th>Workflow ID</th>
                    <th>Workflow Chain Name</th>
                    <th>Target Module</th>
                    <th>Department Context</th>
                    <th>Threshold Range</th>
                    <th>Approval Levels</th>
                    <th>SLA Target</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map(w => (
                    <tr key={w.id}>
                      <td className="fw-bold font-monospace text-primary">{w.code}</td>
                      <td>
                        <strong className="d-block">{w.name}</strong>
                        <span className="x-small text-muted">{w.company}</span>
                      </td>
                      <td><span className="badge bg-light text-dark font-monospace border">{w.module}</span></td>
                      <td>{w.dept}</td>
                      <td className="fw-semibold text-success">{w.amountRange}</td>
                      <td><span className="badge bg-primary text-white">{w.levels} Levels</span></td>
                      <td><span className="small text-muted"><FontAwesomeIcon icon={faClock} className="me-1" />{w.sla}</span></td>
                      <td>
                        <span 
                          className={`badge rounded-pill cursor-pointer ${w.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`}
                          onClick={() => handleToggleStatus(w.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button className="btn btn-xs btn-light" title="View flowchart" onClick={() => setSelectedWorkflow(w)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="btn btn-xs btn-light" title="Clone template" onClick={() => handleCloneWorkflow(w)}>
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <button className="btn btn-xs btn-danger text-white" title="Delete Workflow" onClick={() => handleDeleteWorkflow(w.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      ) : (

        // VIEW B: INTERACTIVE WORKFLOW BUILDER WIZARD
        <div className="container-fluid px-4 px-lg-5 text-start animate-fade-in">
          <form onSubmit={handleSaveWorkflow}>
            <div className="row g-4">
              
              {/* Left Column: Core Fields */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                  <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faSliders} className="me-2 text-primary" /> Rule Configuration</h5>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Workflow Chain Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="e.g. Sales Credit Memo Limit Approval"
                      value={newWorkflow.name}
                      onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Target ERP Module</label>
                      <select className="form-select" value={newWorkflow.module} onChange={e => setNewWorkflow({...newWorkflow, module: e.target.value})}>
                        <option value="Purchase">Purchase Orders</option>
                        <option value="Accounting">Journal Adjustment Vouchers</option>
                        <option value="Expenses">Expense Reimbursements</option>
                        <option value="Payroll">Payroll Journals</option>
                        <option value="Fixed Assets">Asset Acquisitions</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Department Cost Center</label>
                      <select className="form-select" value={newWorkflow.dept} onChange={e => setNewWorkflow({...newWorkflow, dept: e.target.value})}>
                        <option>Finance & Accounts</option>
                        <option>HR & Admin</option>
                        <option>Sourcing & Log</option>
                        <option>Engineering</option>
                        <option>Sales & BD</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Spending Range Limit</label>
                      <select className="form-select" value={newWorkflow.amountRange} onChange={e => setNewWorkflow({...newWorkflow, amountRange: e.target.value})}>
                        <option value="All amounts">All transaction amounts</option>
                        <option value="> PKR 50,000">Greater than PKR 50,000</option>
                        <option value="> PKR 1,000,000">Greater than PKR 1,000,000</option>
                        <option value="> PKR 5,000,000">Greater than PKR 5,000,000</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Step Evaluation Logic</label>
                      <select className="form-select" value={newWorkflow.type} onChange={e => setNewWorkflow({...newWorkflow, type: e.target.value})}>
                        <option value="Sequential">Sequential (L1 &rarr; L2 &rarr; L3)</option>
                        <option value="Parallel">Parallel (Any Approver matches)</option>
                        <option value="Conditional">Conditional (Dynamic route)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">SLA Turnaround Deadline</label>
                    <select className="form-select" value={newWorkflow.sla} onChange={e => setNewWorkflow({...newWorkflow, sla: e.target.value})}>
                      <option>12 Hours</option>
                      <option>24 Hours</option>
                      <option>48 Hours</option>
                      <option>72 Hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Stage Level Configurator */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 h-100" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faDiagramProject} className="me-2 text-success" /> Stage Approval Config</h5>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddBuilderStep}><FontAwesomeIcon icon={faPlus} /> Add Stage</button>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {builderSteps.map((step, idx) => (
                      <div key={idx} className="p-3 bg-light rounded-3 border d-flex flex-column gap-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-primary">Level {step.level} Stage</span>
                          {builderSteps.length > 1 && (
                            <button type="button" className="btn btn-sm text-danger p-0" onClick={() => handleRemoveBuilderStep(idx)}><FontAwesomeIcon icon={faTrashCan} /></button>
                          )}
                        </div>

                        <div className="row g-2">
                          <div className="col-6">
                            <label className="x-small text-muted fw-bold">Approver Role/Title</label>
                            <input 
                              type="text" 
                              className="form-control form-control-sm" 
                              required 
                              value={step.role} 
                              onChange={e => handleUpdateStepField(idx, 'role', e.target.value)}
                            />
                          </div>
                          <div className="col-6">
                            <label className="x-small text-muted fw-bold">Assignee Default</label>
                            <select className="form-select form-select-sm" value={step.assignee} onChange={e => handleUpdateStepField(idx, 'assignee', e.target.value)}>
                              <option>Sarah Connor</option>
                              <option>Mike Ross</option>
                              <option>Harvey Specter</option>
                              <option>Jessica Pearson</option>
                              <option>Admin User</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Escalation Rules */}
                  <div className="p-3 border-top">
                    <h6 className="fw-bold small mb-2"><FontAwesomeIcon icon={faClock} className="text-warning me-1" /> Escalation Rules</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="x-small text-muted">SLA Trigger (Hours)</label>
                        <input 
                          type="number" 
                          className="form-control form-control-sm" 
                          value={builderEscalation.hours} 
                          onChange={e => setBuilderEscalation({...builderEscalation, hours: parseInt(e.target.value) || 24})}
                        />
                      </div>
                      <div className="col-6">
                        <label className="x-small text-muted">Escalation Direct Action</label>
                        <select className="form-select form-select-sm" value={builderEscalation.action} onChange={e => setBuilderEscalation({...builderEscalation, action: e.target.value})}>
                          <option>Escalate to Super Admin</option>
                          <option>Notify Operations VP</option>
                          <option>Auto-Reject Claim</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-light" onClick={() => setCurrentView('list')}>Cancel</button>
                    <button type="submit" className="btn btn-success px-4 text-white"><FontAwesomeIcon icon={faSave} className="me-1" /> Create Workflow</button>
                  </div>

                </div>
              </div>

            </div>
          </form>
        </div>

      )}

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* FLOW DIAGRAM MODAL DRAWER OVERLAY                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className={`drawer-overlay ${selectedWorkflow ? 'open' : ''}`} onClick={() => setSelectedWorkflow(null)}></div>
      <div className={`drawer-approvals text-start d-flex flex-column ${selectedWorkflow ? 'open' : ''}`}>
        {selectedWorkflow && (
          <>
            <div className="p-4 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-primary text-white font-monospace mb-1">{selectedWorkflow.code}</span>
                <h5 className="fw-bold mb-0 text-slate-800">{selectedWorkflow.name}</h5>
                <span className="small text-muted">{selectedWorkflow.module} • {selectedWorkflow.company}</span>
              </div>
              <button className="btn-close" onClick={() => setSelectedWorkflow(null)}></button>
            </div>

            <div className="p-4 flex-grow-1 overflow-y-auto">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faDiagramProject} className="text-primary me-1" /> Visual Flow Steps</h6>
              
              <div className="d-flex flex-column align-items-center gap-3 py-3">
                {selectedWorkflow.steps.map((st, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="text-muted py-1">
                        <FontAwesomeIcon icon={faChevronRight} className="fa-rotate-90 fs-5" />
                      </div>
                    )}
                    <div className="card p-3 border text-center shadow-xs" style={{ width: '320px', borderRadius: '12px' }}>
                      <span className="badge bg-success bg-opacity-10 text-success mb-2 align-self-center">Stage Level {st.level}</span>
                      <strong className="d-block">{st.role}</strong>
                      <span className="small text-muted mb-1">{st.assignee}</span>
                      <div className="x-small text-muted border-top pt-1 mt-1">
                        Action required: {st.action} <br />
                        SLA Target: {st.slaHours} Hours
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="p-3 bg-light rounded-4 border mt-4">
                <h6 className="fw-bold mb-2 small"><FontAwesomeIcon icon={faClock} className="text-warning me-1" /> Timeout Escalation Policy</h6>
                <p className="small text-muted mb-0">
                  If any stage is held up longer than <strong>{selectedWorkflow.escalations?.hours || 48} Hours</strong>, the system will trigger 
                  <strong> {selectedWorkflow.escalations?.action || 'Escalate to Super Admin'}</strong> automatically.
                </p>
              </div>
            </div>

            <div className="p-4 border-top bg-light text-end">
              <button className="btn btn-secondary w-100" onClick={() => setSelectedWorkflow(null)}>Close Diagram View</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default ErpApprovalWorkflows;
