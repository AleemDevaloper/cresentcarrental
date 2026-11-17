import React, { useState } from 'react';
import { FiPlus, FiSave, FiX, FiToggleLeft, FiToggleRight, FiShield, FiEye, FiInfo, FiEdit2, FiTrash2, FiChevronDown } from 'react-icons/fi';

const ACCESS_LEVELS = [
  { label: 'Own Data', value: 'Own Data', desc: 'Only their own data' },
  { label: 'Own Team', value: 'Own Team', desc: 'Direct team members' },
  { label: 'Own Department', value: 'Own Department', desc: 'Entire department' },
  { label: 'Own Branch', value: 'Own Branch', desc: 'Branch location' },
  { label: 'Own Company', value: 'Own Company', desc: 'Entire company' },
  { label: 'Own Tenant', value: 'Own Tenant', desc: 'Entire tenant' },
  { label: 'Custom Access', value: 'Custom', desc: 'Defined by rules' },
];

const INITIAL_RULES = [
  { name: 'Own Profile', scope: 'Self', role: 'Employee', level: 'Full', desc: 'View and edit own profile', status: true },
  { name: 'Direct Reports', scope: 'Team', role: 'Manager', level: 'Read/Write', desc: 'View reporting employees data', status: true },
  { name: 'Department Data', scope: 'Department', role: 'Department Head', level: 'Read', desc: 'View department employee data', status: true },
  { name: 'HR Records', scope: 'All Employees', role: 'HR Manager', level: 'Full', desc: 'Complete HR data access', status: true },
  { name: 'Payroll Data', scope: 'Finance Scope', role: 'Finance Manager', level: 'Full', desc: 'View and process payroll', status: true },
  { name: 'Company Data', scope: 'Company Wide', role: 'Tenant Admin', level: 'Full', desc: 'All company data', status: true },
  { name: 'Global Access', scope: 'All Data', role: 'Super Admin', level: 'Full', desc: 'Complete system access', status: true },
  { name: 'Audit View', scope: 'All Data', role: 'Auditor', level: 'Read-Only', desc: 'Read-only audit access', status: true },
  { name: 'Team Performance', scope: 'Team', role: 'Team Lead', level: 'Read', desc: 'View team performance metrics', status: true },
  { name: 'Employee Documents', scope: 'Own Department', role: 'HR Manager', level: 'Full', desc: 'Manage employee documents', status: true },
];

const DataAccessGovernance = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [showForm, setShowForm] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', scope: 'Own Data', role: '', level: 'Read', desc: '', status: true });

  const toggleStatus = (index) => {
    setRules(prev => prev.map((r, i) => i === index ? { ...r, status: !r.status } : r));
  };

  const addRule = () => {
    if (!newRule.name.trim() || !newRule.role.trim()) return;
    setRules(prev => [...prev, { ...newRule }]);
    setNewRule({ name: '', scope: 'Own Data', role: '', level: 'Read', desc: '', status: true });
    setShowForm(false);
  };

  const handleChange = (field, value) => {
    setNewRule(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div className="gc-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiEye size={20} style={{ color: '#0f172a' }} />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#0f172a' }}>Data Access Rules</h3>
            <span className="gc-badge" style={{ background: '#eef2ff', color: '#4f46e5' }}>{rules.length} rules</span>
          </div>
          <button className="gc-btn gc-btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {showForm ? <FiX size={14} /> : <FiPlus size={14} />} {showForm ? 'Cancel' : 'New Rule'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gc-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Data Scope</th>
                <th>Role/User</th>
                <th>Access Level</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{rule.name}</td>
                  <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{rule.scope}</span></td>
                  <td><span className="gc-badge" style={{ background: '#eef2ff', color: '#4f46e5' }}>{rule.role}</span></td>
                  <td>
                    <span className="gc-badge" style={{
                      background: rule.level === 'Full' ? '#f0fdf4' : rule.level === 'Read/Write' ? '#fffbeb' : rule.level === 'Read-Only' || rule.level === 'Read' ? '#eff6ff' : '#fef2f2',
                      color: rule.level === 'Full' ? '#059669' : rule.level === 'Read/Write' ? '#d97706' : rule.level === 'Read-Only' || rule.level === 'Read' ? '#3b82f6' : '#dc2626',
                    }}>{rule.level}</span>
                  </td>
                  <td style={{ color: '#64748b', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rule.desc}</td>
                  <td>
                    <button className={`gc-toggle ${rule.status ? 'active' : 'inactive'}`} onClick={() => toggleStatus(idx)}
                      style={{ background: rule.status ? '#059669' : '#cbd5e1' }} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="gc-btn gc-btn-outline gc-btn-sm"><FiEdit2 size={12} /></button>
                      <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ color: '#dc2626', borderColor: '#fca5a5' }}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="gc-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <FiShield size={16} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Access Levels Explained</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ACCESS_LEVELS.map(item => (
              <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 10, background: '#f8fafc', fontSize: 13 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.value === 'Custom' ? '#8b5cf6' : '#3b82f6', flexShrink: 0 }}></div>
                <span style={{ fontWeight: 600, color: '#1e293b', minWidth: 120 }}>{item.label}</span>
                <span style={{ color: '#64748b' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="gc-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <FiInfo size={16} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Data Access Summary</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ label: 'Total Rules', value: rules.length, color: '#3b82f6' }, { label: 'Active Rules', value: rules.filter(r => r.status).length, color: '#059669' }, { label: 'Inactive Rules', value: rules.filter(r => !r.status).length, color: '#dc2626' }, { label: 'Full Access', value: rules.filter(r => r.level === 'Full').length, color: '#8b5cf6' }, { label: 'Read/Write', value: rules.filter(r => r.level === 'Read/Write').length, color: '#d97706' }, { label: 'Read-Only', value: rules.filter(r => r.level === 'Read-Only' || r.level === 'Read').length, color: '#3b82f6' }].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="gc-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FiPlus size={16} style={{ color: '#0f172a' }} />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Create New Data Access Rule</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Rule Name</label>
              <input className="gc-input" placeholder="Enter rule name" value={newRule.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Data Scope</label>
              <select className="gc-input" value={newRule.scope} onChange={e => handleChange('scope', e.target.value)} style={{ cursor: 'pointer' }}>
                {ACCESS_LEVELS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Role/User</label>
              <select className="gc-input" value={newRule.role} onChange={e => handleChange('role', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">Select Role...</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Tenant Admin">Tenant Admin</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Finance Manager">Finance Manager</option>
                <option value="Department Head">Department Head</option>
                <option value="Manager">Manager</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Employee">Employee</option>
                <option value="Auditor">Auditor</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Access Level</label>
              <select className="gc-input" value={newRule.level} onChange={e => handleChange('level', e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="Full">Full</option>
                <option value="Read/Write">Read/Write</option>
                <option value="Read">Read-Only</option>
                <option value="No Access">No Access</option>
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Description</label>
              <textarea className="gc-input" style={{ resize: 'vertical', minHeight: 80, fontFamily: 'inherit' }} placeholder="Enter rule description" value={newRule.desc} onChange={e => handleChange('desc', e.target.value)} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className={`gc-toggle ${newRule.status ? 'active' : 'inactive'}`} onClick={() => handleChange('status', !newRule.status)}
                  style={{ background: newRule.status ? '#059669' : '#cbd5e1' }} />
                <span style={{ fontSize: 13, color: '#475569' }}>{newRule.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <button className="gc-btn gc-btn-outline" onClick={() => setShowForm(false)}><FiX size={14} /> Cancel</button>
            <button className="gc-btn gc-btn-primary" onClick={addRule}><FiSave size={14} /> Save Rule</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAccessGovernance;
