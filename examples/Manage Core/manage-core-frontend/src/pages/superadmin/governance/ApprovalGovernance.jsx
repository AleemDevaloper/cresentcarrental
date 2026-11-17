import React, { useState } from 'react';
import { FiCheckCircle, FiClock, FiUsers, FiActivity, FiEdit3, FiToggleLeft, FiToggleRight, FiTrash2, FiCopy, FiArrowRight, FiSearch, FiFilter, FiBarChart2, FiPieChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const ApprovalGovernance = () => {
  const [approvals, setApprovals] = useState([
    { id: 'AP-001', type: 'Leave', requester: 'Alice Brown', detail: 'Annual Leave (5 days)', submitted: '2026-06-15', status: 'Pending', assignedTo: 'Jane Smith' },
    { id: 'AP-002', type: 'Expense', requester: 'Charlie Wilson', detail: '$1,250.00 - Travel Expenses', submitted: '2026-06-15', status: 'Pending', assignedTo: 'Bob Johnson' },
    { id: 'AP-003', type: 'Purchase Order', requester: 'Diana Prince', detail: '$15,000.00 - Equipment', submitted: '2026-06-14', status: 'Pending', assignedTo: 'Root Admin' },
    { id: 'AP-004', type: 'Leave', requester: 'Eve Adams', detail: 'Sick Leave (2 days)', submitted: '2026-06-14', status: 'Approved', assignedTo: 'Jane Smith' },
    { id: 'AP-005', type: 'Expense', requester: 'Frank Castle', detail: '$450.00 - Office Supplies', submitted: '2026-06-13', status: 'Rejected', assignedTo: 'Bob Johnson' },
    { id: 'AP-006', type: 'Recruitment', requester: 'Grace Hopper', detail: 'Senior Developer Position', submitted: '2026-06-13', status: 'Pending', assignedTo: 'Root Admin' },
    { id: 'AP-007', type: 'Document', requester: 'Henry Cavill', detail: 'NDA Agreement v3', submitted: '2026-06-12', status: 'Approved', assignedTo: 'Legal Team' },
    { id: 'AP-008', type: 'Payroll', requester: 'HR Department', detail: 'June 2026 Payroll Run', submitted: '2026-06-12', status: 'Pending', assignedTo: 'CEO' },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

  const workflows = [
    { id: 1, name: 'Leave Approval Flow', status: 'Active', steps: ['Employee', 'Manager', 'HR'], created: '2026-01-15' },
    { id: 2, name: 'Expense Approval Flow', status: 'Active', steps: ['Employee', 'Manager', 'Finance', 'GM'], created: '2026-02-10' },
    { id: 3, name: 'Payroll Approval Flow', status: 'Active', steps: ['HR', 'Finance', 'CEO'], created: '2026-03-05' },
    { id: 4, name: 'Purchase Order Flow', status: 'Active', steps: ['Requester', 'Dept Head', 'Finance', 'CEO'], created: '2026-03-20' },
    { id: 5, name: 'Recruitment Approval Flow', status: 'Inactive', steps: ['HR', 'Dept Head', 'CEO'], created: '2026-04-01' },
    { id: 6, name: 'Document Approval Flow', status: 'Active', steps: ['Creator', 'Reviewer', 'Legal'], created: '2026-04-15' },
  ];

  const approvalRules = [
    { rule: 'Auto-approve if amount < $100', type: 'Automatic', enabled: true },
    { rule: 'Escalate after 48 hours', type: 'Escalation', enabled: true },
    { rule: 'Skip if manager is unavailable', type: 'Fallback', enabled: false },
    { rule: 'Parallel approval for amounts > $10,000', type: 'Parallel', enabled: true },
  ];

  const filteredApprovals = filterStatus === 'All' ? approvals : approvals.filter(a => a.status === filterStatus);

  const getStatusBadge = (status) => {
    const colors = { Pending: { bg: '#d9770615', text: '#d97706' }, Approved: { bg: '#05966915', text: '#059669' }, Rejected: { bg: '#dc262615', text: '#dc2626' } };
    const c = colors[status] || colors.Pending;
    return <span className="gc-badge" style={{ background: c.bg, color: c.text, fontSize: 11 }}>{status}</span>;
  };

  const getStatusStyle = (status) => {
    return status === 'Active' ? '#059669' : '#64748b';
  };

  return (
    <div className="gc-approval-governance">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#05966915', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCheckCircle size={22} color="#059669" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>Approval Governance Center</h5>
            <p className="text-muted small mb-0">Manage approval workflows, rules, and pending approvals</p>
          </div>
        </div>
      </div>

      <div className="gc-kpi-row row g-3 mb-4">
        {[
          { label: 'Total Workflows', value: '6', icon: <FiActivity size={20} />, color: '#3b82f6' },
          { label: 'Active Workflows', value: '4', icon: <FiCheckCircle size={20} />, color: '#059669' },
          { label: 'Pending Approvals', value: '23', icon: <FiClock size={20} />, color: '#d97706' },
          { label: 'Avg Approval Time', value: '4.2 hrs', icon: <FiTrendingUp size={20} />, color: '#8b5cf6' },
        ].map((kpi, idx) => (
          <div key={idx} className="col-xl-3 col-lg-6">
            <div className="gc-card p-3 d-flex align-items-center gap-3">
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-muted small mb-0">{kpi.label}</p>
                <h4 className="fw-bold mb-0" style={{ fontSize: 24 }}>{kpi.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gc-workflow-designer mb-4">
        <div className="gc-card p-4">
          <h6 className="fw-bold mb-3">Approval Workflow Designer</h6>
          <div className="workflow-cards row g-3">
            {workflows.map((wf) => (
              <div key={wf.id} className="col-xl-4 col-lg-6">
                <div className="gc-card p-3 border" style={{ background: '#fafafa' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0" style={{ fontSize: 14 }}>{wf.name}</h6>
                    <span className="gc-badge" style={{ background: `${wf.status === 'Active' ? '#059669' : '#64748b'}15`, color: getStatusStyle(wf.status), fontSize: 10 }}>
                      {wf.status}
                    </span>
                  </div>
                  <div className="d-flex align-items-center mb-3" style={{ gap: 0 }}>
                    {wf.steps.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <div style={{ background: '#0f172a', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {step}
                        </div>
                        {sIdx < wf.steps.length - 1 && <FiArrowRight size={14} color="#94a3b8" style={{ margin: '0 4px', flexShrink: 0 }} />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted" style={{ fontSize: 11 }}>Created: {wf.created}</span>
                    <div className="d-flex gap-1">
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiEdit3 size={12} /></button>
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiToggleLeft size={12} /></button>
                      <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ color: '#dc2626' }}><FiTrash2 size={12} /></button>
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiCopy size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">Approval Rules</h6>
            {approvalRules.map((r, idx) => (
              <div key={idx} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontSize: 13 }}>{r.rule}</p>
                  <span className="text-muted" style={{ fontSize: 11 }}>{r.type}</span>
                </div>
                <button className={`gc-toggle ${r.enabled ? 'active' : 'inactive'}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-8">
          <div className="gc-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0">Pending Approvals</h6>
              <div className="d-flex align-items-center gap-2">
                <select className="gc-input" style={{ width: 140, fontSize: 12 }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button className="gc-btn gc-btn-outline gc-btn-sm"><FiSearch size={13} /> Search</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Type</th><th>Requester</th><th>Amount/Detail</th><th>Submitted</th><th>Status</th><th>Assigned To</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map((a) => (
                    <tr key={a.id}>
                      <td><span className="fw-semibold" style={{ fontSize: 12 }}>{a.id}</span></td>
                      <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{a.type}</span></td>
                      <td style={{ fontSize: 13 }}>{a.requester}</td>
                      <td style={{ fontSize: 12 }}>{a.detail}</td>
                      <td style={{ fontSize: 12 }}>{a.submitted}</td>
                      <td>{getStatusBadge(a.status)}</td>
                      <td style={{ fontSize: 12 }}>{a.assignedTo}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="gc-btn gc-btn-outline gc-btn-sm"><FiCheckCircle size={12} color="#059669" /></button>
                          <button className="gc-btn gc-btn-outline gc-btn-sm"><FiEdit3 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="gc-card p-4">
        <h6 className="fw-bold mb-3">Approval Analytics</h6>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="gc-card p-3 border text-center">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiPieChart size={16} color="#3b82f6" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Approvals by Type</span>
              </div>
              {[
                { label: 'Leave', value: 35, color: '#3b82f6' },
                { label: 'Expense', value: 25, color: '#059669' },
                { label: 'Purchase Order', value: 18, color: '#d97706' },
                { label: 'Recruitment', value: 12, color: '#8b5cf6' },
                { label: 'Other', value: 10, color: '#64748b' },
              ].map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{item.label}</span>
                  <span className="fw-bold" style={{ fontSize: 12 }}>{item.value}%</span>
                </div>
              ))}
              <div className="gc-progress mt-2">
                <div className="gc-progress-bar" style={{ width: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #059669 35%, #d97706 53%, #8b5cf6 65%, #64748b 100%)' }} />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="gc-card p-3 border text-center">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiTrendingUp size={16} color="#059669" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Approval Time Trend</span>
              </div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const heights = [3.2, 4.1, 3.8, 5.2, 4.5, 2.1, 1.8];
                return (
                  <div key={idx} className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: 11, width: 30 }}>{day}</span>
                    <div className="gc-progress flex-grow-1">
                      <div className="gc-progress-bar" style={{ width: `${(heights[idx] / 5.5) * 100}%`, background: '#059669' }} />
                    </div>
                    <span style={{ fontSize: 11, width: 35, textAlign: 'right' }}>{heights[idx]}h</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="gc-card p-3 border">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiUsers size={16} color="#8b5cf6" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Most Active Approvers</span>
              </div>
              {[
                { name: 'Root Admin', count: 47, color: '#3b82f6' },
                { name: 'Jane Smith', count: 38, color: '#059669' },
                { name: 'Bob Johnson', count: 29, color: '#d97706' },
                { name: 'Charlie Wilson', count: 22, color: '#8b5cf6' },
                { name: 'Legal Team', count: 15, color: '#64748b' },
              ].map((approver, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 24, height: 24, borderRadius: 8, background: `${approver.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: approver.color, fontSize: 10, fontWeight: 700 }}>
                    {approver.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: 12, flex: 1 }}>{approver.name}</span>
                  <span className="fw-bold" style={{ fontSize: 12 }}>{approver.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalGovernance;
