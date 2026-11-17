import React, { useState } from 'react';
import { FiCpu, FiZap, FiUsers, FiClock, FiDollarSign, FiActivity, FiToggleLeft, FiToggleRight, FiEdit3, FiSearch, FiFilter, FiBarChart2, FiShield, FiSliders, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AIGovernance = () => {
  const [aiFeatures, setAiFeatures] = useState([
    { name: 'AI Assistant', status: 'Enabled', access: 'All Users', dailyLimit: 1000, model: 'GPT-4o', updated: '2026-06-15' },
    { name: 'AI Reporting', status: 'Enabled', access: 'Enterprise Tier', dailyLimit: 500, model: 'GPT-4o', updated: '2026-06-14' },
    { name: 'AI Payroll Insights', status: 'Beta', access: 'Finance Role', dailyLimit: 200, model: 'GPT-4o-mini', updated: '2026-06-10' },
    { name: 'AI Attendance Insights', status: 'Enabled', access: 'HR Role', dailyLimit: 300, model: 'Custom Model', updated: '2026-06-12' },
    { name: 'AI Forecasting', status: 'Disabled', access: 'Enterprise Tier', dailyLimit: 100, model: 'GPT-4o', updated: '2026-05-01' },
    { name: 'AI Workforce Analytics', status: 'Beta', access: 'Manager Role', dailyLimit: 250, model: 'Custom Model', updated: '2026-06-08' },
  ]);

  const aiAuditLogs = [
    { timestamp: '2026-06-16 09:15:00', user: 'Jane Smith', feature: 'AI Assistant', prompt: 'Generate employee performance report...', tokens: 1250, cost: 0.06, status: 'Success' },
    { timestamp: '2026-06-16 09:10:22', user: 'Bob Johnson', feature: 'AI Payroll Insights', prompt: 'Analyze payroll trends for Q2...', tokens: 3400, cost: 0.17, status: 'Success' },
    { timestamp: '2026-06-16 08:55:10', user: 'Charlie Wilson', feature: 'AI Reporting', prompt: 'Create financial summary report...', tokens: 2800, cost: 0.14, status: 'Success' },
    { timestamp: '2026-06-16 08:45:30', user: 'Alice Brown', feature: 'AI Assistant', prompt: 'Help with onboarding checklist...', tokens: 890, cost: 0.04, status: 'Success' },
    { timestamp: '2026-06-16 08:30:00', user: 'Diana Prince', feature: 'AI Workforce Analytics', prompt: 'Show department headcount trends...', tokens: 2100, cost: 0.11, status: 'Success' },
    { timestamp: '2026-06-16 08:15:45', user: 'Root Admin', feature: 'AI Assistant', prompt: 'Debug authentication module...', tokens: 4500, cost: 0.23, status: 'Success' },
    { timestamp: '2026-06-16 07:55:20', user: 'Eve Adams', feature: 'AI Attendance Insights', prompt: 'Check attendance anomalies this month...', tokens: 1800, cost: 0.09, status: 'Failed' },
    { timestamp: '2026-06-16 07:40:12', user: 'Frank Castle', feature: 'AI Forecasting', prompt: 'Predict Q3 revenue projections...', tokens: 0, cost: 0, status: 'Blocked' },
    { timestamp: '2026-06-16 07:25:00', user: 'Grace Hopper', feature: 'AI Assistant', prompt: 'Summarize meeting notes...', tokens: 1500, cost: 0.08, status: 'Success' },
    { timestamp: '2026-06-16 07:10:30', user: 'Henry Cavill', feature: 'AI Reporting', prompt: 'Generate department expense report...', tokens: 3200, cost: 0.16, status: 'Success' },
  ];

  const statusCards = [
    { name: 'AI Assistant', status: 'Enabled', color: '#059669' },
    { name: 'AI Reporting', status: 'Enabled', color: '#059669' },
    { name: 'AI Payroll Insights', status: 'Beta', color: '#3b82f6' },
    { name: 'AI Attendance Insights', status: 'Enabled', color: '#059669' },
    { name: 'AI Forecasting', status: 'Disabled', color: '#dc2626' },
    { name: 'AI Workforce Analytics', status: 'Beta', color: '#3b82f6' },
  ];

  const getStatusBadge = (status) => {
    const colors = { Enabled: { bg: '#05966915', text: '#059669' }, Beta: { bg: '#3b82f615', text: '#3b82f6' }, Disabled: { bg: '#dc262615', text: '#dc2626' }, Failed: { bg: '#dc262615', text: '#dc2626' }, Blocked: { bg: '#d9770615', text: '#d97706' }, Success: { bg: '#05966915', text: '#059669' } };
    const c = colors[status] || { bg: '#f1f5f9', text: '#334155' };
    return <span className="gc-badge" style={{ background: c.bg, color: c.text, fontSize: 10 }}>{status}</span>;
  };

  const roleAccessMatrix = {
    'AI Assistant': { admin: true, manager: true, employee: true, finance: true, hr: true },
    'AI Reporting': { admin: true, manager: true, employee: false, finance: true, hr: true },
    'AI Payroll Insights': { admin: true, manager: false, employee: false, finance: true, hr: false },
    'AI Attendance Insights': { admin: true, manager: true, employee: false, finance: false, hr: true },
    'AI Forecasting': { admin: true, manager: false, employee: false, finance: true, hr: false },
    'AI Workforce Analytics': { admin: true, manager: true, employee: false, finance: false, hr: true },
  };

  const roles = ['admin', 'manager', 'employee', 'finance', 'hr'];

  return (
    <div className="gc-ai-governance">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCpu size={22} color="#8b5cf6" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>AI Governance Center</h5>
            <p className="text-muted small mb-0">Manage AI features, usage, access controls, and audit logging</p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {statusCards.map((card, idx) => (
          <div key={idx} className="col-xl-2 col-lg-4 col-md-6">
            <div className="gc-card p-3 text-center">
              <FiCpu size={24} color={card.color} className="mb-2" />
              <p className="fw-semibold mb-1" style={{ fontSize: 12 }}>{card.name}</p>
              <span className="gc-badge" style={{ background: `${card.color}15`, color: card.color, fontSize: 10 }}>{card.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="gc-kpi-row row g-3 mb-4">
        {[
          { label: 'Total AI Requests Today', value: '1,245', icon: <FiActivity size={20} />, color: '#3b82f6' },
          { label: 'Active AI Users', value: '342', icon: <FiUsers size={20} />, color: '#059669' },
          { label: 'Avg Response Time', value: '1.2s', icon: <FiClock size={20} />, color: '#d97706' },
          { label: 'Token Usage', value: '245,890', icon: <FiZap size={20} />, color: '#8b5cf6' },
          { label: 'Cost Today', value: '$12.45', icon: <FiDollarSign size={20} />, color: '#14b8a6' },
        ].map((kpi, idx) => (
          <div key={idx} className="col-xl-2 col-lg-4 col-md-6">
            <div className="gc-card p-3 d-flex align-items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: 11 }}>{kpi.label}</p>
                <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>{kpi.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gc-card p-4 mb-4">
        <h6 className="fw-bold mb-3">AI Feature Toggles</h6>
        <div className="table-responsive">
          <table className="gc-table">
            <thead>
              <tr>
                <th>AI Feature</th><th>Status</th><th>Access Level</th><th>Daily Limit</th><th>Model Version</th><th>Last Updated</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aiFeatures.map((f, idx) => (
                <tr key={idx}>
                  <td><span className="fw-semibold" style={{ fontSize: 12 }}>{f.name}</span></td>
                  <td>{getStatusBadge(f.status)}</td>
                  <td style={{ fontSize: 12 }}>{f.access}</td>
                  <td style={{ fontSize: 12 }}>{f.dailyLimit} req/day</td>
                  <td><code className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{f.model}</code></td>
                  <td style={{ fontSize: 11 }}>{f.updated}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiToggleLeft size={12} /></button>
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiEdit3 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">AI Audit Log</h6>
            <div className="table-responsive" style={{ maxHeight: 340, overflowY: 'auto' }}>
              <table className="gc-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr>
                    <th>Timestamp</th><th>User</th><th>Feature</th><th>Prompt Summary</th><th>Tokens Used</th><th>Cost</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {aiAuditLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                      <td style={{ fontSize: 12 }}>{log.user}</td>
                      <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{log.feature}</span></td>
                      <td style={{ fontSize: 11, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.prompt}</td>
                      <td style={{ fontSize: 11 }}>{log.tokens.toLocaleString()}</td>
                      <td style={{ fontSize: 11 }}>${log.cost.toFixed(2)}</td>
                      <td>{getStatusBadge(log.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">AI Usage Analytics</h6>
            <div className="mb-3">
              <span className="fw-semibold" style={{ fontSize: 13 }}>Usage by Feature</span>
              {[
                { name: 'AI Assistant', pct: 45, color: '#3b82f6' },
                { name: 'AI Reporting', pct: 22, color: '#059669' },
                { name: 'AI Payroll Insights', pct: 15, color: '#d97706' },
                { name: 'AI Workforce Analytics', pct: 10, color: '#8b5cf6' },
                { name: 'AI Attendance Insights', pct: 8, color: '#14b8a6' },
              ].map((item, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{item.name}</span>
                  <div className="gc-progress" style={{ width: 80 }}>
                    <div className="gc-progress-bar" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                  <span className="fw-bold" style={{ fontSize: 12 }}>{item.pct}%</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="mb-2">
              <span className="fw-semibold" style={{ fontSize: 13 }}>Daily Request Trend</span>
              <div className="d-flex align-items-end gap-1 mt-2" style={{ height: 80 }}>
                {[800, 950, 1100, 890, 1245, 1050, 980].map((val, idx) => (
                  <div key={idx} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                    <div className="gc-progress-bar" style={{
                      height: `${(val / 1245) * 100}%`,
                      width: '100%',
                      background: '#8b5cf6',
                      borderRadius: '2px 2px 0 0',
                    }} />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <span key={d} style={{ fontSize: 9, color: '#94a3b8' }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gc-card p-4">
        <h6 className="fw-bold mb-3">AI Access Control</h6>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>AI Feature</th>
                    {roles.map(r => <th key={r} style={{ textTransform: 'capitalize' }}>{r}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(roleAccessMatrix).map(([feature, accessMap]) => (
                    <tr key={feature}>
                      <td style={{ fontSize: 12 }}>{feature}</td>
                      {roles.map(r => (
                        <td key={r}>
                          {accessMap[r]
                            ? <FiCheckCircle size={16} color="#059669" />
                            : <FiXCircle size={16} color="#dc2626" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="gc-card p-3 border">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiSliders size={16} color="#3b82f6" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Limit AI Usage</span>
              </div>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">Daily Limit (requests)</label>
                <input type="number" className="gc-input" style={{ fontSize: 13 }} defaultValue={1000} />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted mb-1">Assign AI Access</label>
                <select className="gc-input" style={{ fontSize: 13 }}>
                  <option value="">Select user/role...</option>
                  <option value="all">All Users</option>
                  <option value="enterprise">Enterprise Tier</option>
                  <option value="manager">Manager Role</option>
                  <option value="finance">Finance Role</option>
                  <option value="hr">HR Role</option>
                </select>
              </div>
              <button className="gc-btn gc-btn-primary w-100 justify-content-center"><FiShield size={14} /> Update Access</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGovernance;
