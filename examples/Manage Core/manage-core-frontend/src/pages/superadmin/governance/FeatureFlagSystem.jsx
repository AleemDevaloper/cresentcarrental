import React, { useState } from 'react';
import { FiFlag, FiSearch, FiPlus, FiList } from 'react-icons/fi';

const FLAGS_DATA = [
  { name: 'AI Payroll Assistant', key: 'ai_payroll_assist', desc: 'AI-powered payroll suggestions', status: 'Enabled', environment: 'Production', assigned: 'All Tenants' },
  { name: 'New Attendance Engine', key: 'new_attendance_engine', desc: 'Real-time attendance tracking with biometric sync', status: 'Disabled', environment: 'Staging', assigned: 'Beta Tenants' },
  { name: 'Advanced BI Reports', key: 'advanced_bi_reports', desc: 'Enhanced analytics with predictive forecasting', status: 'Sandbox', environment: 'Development', assigned: 'Acme Corp' },
  { name: 'Smart Approval Workflow', key: 'smart_approvals', desc: 'AI-driven approval routing', status: 'Pilot', environment: 'Production', assigned: 'Enterprise Tier' },
  { name: 'Custom Dashboard Builder', key: 'custom_dashboards', desc: 'Drag-and-drop dashboards', status: 'Internal Testing', environment: 'Development', assigned: 'Dev Team' },
  { name: 'AI Chat Support', key: 'ai_chat_support', desc: 'Intelligent chatbot for employee queries', status: 'Enabled', environment: 'Production', assigned: 'All Tenants' },
  { name: 'Mobile BI Access', key: 'mobile_bi_access', desc: 'Mobile-optimized BI dashboards', status: 'Disabled', environment: 'Staging', assigned: 'Professional Tier' },
];

const STATUS_STYLES = {
  'Enabled': { bg: '#dcfce7', text: '#059669' },
  'Disabled': { bg: '#fee2e2', text: '#dc2626' },
  'Sandbox': { bg: '#fef3c7', text: '#d97706' },
  'Pilot': { bg: '#dbeafe', text: '#3b82f6' },
  'Internal Testing': { bg: '#f3e8ff', text: '#8b5cf6' },
  'Early Access': { bg: '#ffedd5', text: '#ea580c' },
};

const ASSIGNED_OPTIONS = [
  'Specific Tenant',
  'Specific Company',
  'Specific Department',
  'Specific Role',
  'Specific User',
  'All Tenants',
];

const FeatureFlagSystem = () => {
  const [flags, setFlags] = useState(FLAGS_DATA);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', key: '', desc: '', status: 'Disabled', assigned: 'All Tenants' });

  const toggleSelect = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    setSelected((prev) =>
      prev.length === filteredFlags.length ? [] : filteredFlags.map((f) => f.key)
    );
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateFlag = () => {
    if (!form.name || !form.key) return;
    setFlags((prev) => [
      ...prev,
      {
        name: form.name,
        key: form.key.replace(/\s+/g, '_').toLowerCase(),
        desc: form.desc,
        status: form.status,
        environment: 'Development',
        assigned: form.assigned,
      },
    ]);
    setForm({ name: '', key: '', desc: '', status: 'Disabled', assigned: 'All Tenants' });
  };

  const filteredFlags = flags.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gc-feature-flag-system">
      <div className="gc-card card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{ width: 48, height: 48, backgroundColor: '#eef2ff' }}
            >
              <FiFlag size={22} color="#4f46e5" />
            </div>
            <div>
              <h5 className="fw-bold mb-1" style={{ fontSize: 18 }}>Feature Flag System</h5>
              <p className="text-muted mb-0" style={{ fontSize: 13 }}>
                Enterprise-wide feature flag management for controlled rollouts and A/B testing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="gc-card card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-0 p-4 pb-0">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <FiList size={18} color="#64748b" />
              <h6 className="fw-bold mb-0" style={{ fontSize: 15 }}>Feature Flags</h6>
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: 11 }}
              >
                {flags.length}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center" style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '4px 12px' }}>
                <FiSearch size={15} color="#94a3b8" />
                <input
                  className="gc-input"
                  type="text"
                  placeholder="Search flags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 13, marginLeft: 8, background: 'transparent', width: 180 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="gc-table table align-middle mb-0">
              <thead className="bg-light">
                <tr className="small text-muted text-uppercase" style={{ fontSize: 10, letterSpacing: '0.05em' }}>
                  <th className="px-4 py-3" style={{ width: 40 }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selected.length === filteredFlags.length && filteredFlags.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 fw-bold">Flag Name</th>
                  <th className="px-3 py-3 fw-bold">Key</th>
                  <th className="px-3 py-3 fw-bold">Description</th>
                  <th className="px-3 py-3 fw-bold">Status</th>
                  <th className="px-3 py-3 fw-bold">Environment</th>
                  <th className="px-3 py-3 fw-bold">Assigned To</th>
                  <th className="px-4 py-3 text-end fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlags.map((flag) => {
                  const statusStyle = STATUS_STYLES[flag.status] || STATUS_STYLES.Disabled;
                  return (
                    <tr key={flag.key} className="border-bottom border-light">
                      <td className="px-4 py-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selected.includes(flag.key)}
                          onChange={() => toggleSelect(flag.key)}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span className="fw-semibold" style={{ fontSize: 13 }}>{flag.name}</span>
                      </td>
                      <td className="px-3 py-3">
                        <code
                          className="badge font-monospace"
                          style={{ backgroundColor: '#f1f5f9', color: '#0f172a', fontSize: 10, padding: '4px 8px' }}
                        >
                          {flag.key}
                        </code>
                      </td>
                      <td className="px-3 py-3">
                        <span className="small text-muted">{flag.desc}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="gc-badge badge rounded-pill px-2 py-1"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontSize: 10 }}
                        >
                          {flag.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="small" style={{ color: '#475569' }}>{flag.environment}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="small">{flag.assigned}</span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          className="gc-btn gc-btn-sm gc-btn-outline btn btn-sm btn-outline-primary border-0 p-1 me-1"
                          title="Edit Flag"
                        >
                          <FiFlag size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredFlags.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <span className="text-muted small">No feature flags found</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="gc-card card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 p-4">
          <div className="d-flex align-items-center gap-2">
            <FiPlus size={18} color="#4f46e5" />
            <h6 className="fw-bold mb-0" style={{ fontSize: 15 }}>Create Feature Flag</h6>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ fontSize: 12, color: '#374151' }}>Flag Name</label>
              <input
                className="gc-input form-control"
                type="text"
                placeholder="Enter flag name"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ fontSize: 12, color: '#374151' }}>Flag Key</label>
              <input
                className="gc-input form-control"
                type="text"
                placeholder="e.g. my_feature_flag"
                value={form.key}
                onChange={(e) => handleFormChange('key', e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontFamily: 'monospace' }}
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold" style={{ fontSize: 12, color: '#374151' }}>Description</label>
              <textarea
                className="gc-input form-control"
                rows={3}
                placeholder="Describe the feature flag purpose"
                value={form.desc}
                onChange={(e) => handleFormChange('desc', e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', resize: 'vertical' }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ fontSize: 12, color: '#374151' }}>Status</label>
              <select
                className="gc-input form-select"
                value={form.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
                <option value="Sandbox">Sandbox</option>
                <option value="Pilot">Pilot</option>
                <option value="Internal Testing">Internal Testing</option>
                <option value="Early Access">Early Access</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold" style={{ fontSize: 12, color: '#374151' }}>Assigned To</label>
              <select
                className="gc-input form-select"
                value={form.assigned}
                onChange={(e) => handleFormChange('assigned', e.target.value)}
                style={{ fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px' }}
              >
                {ASSIGNED_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="col-12 d-flex justify-content-end gap-2 mt-4">
              <button
                className="gc-btn gc-btn-outline btn btn-outline-secondary rounded-3 px-4"
                style={{ fontSize: 13 }}
                onClick={() => setForm({ name: '', key: '', desc: '', status: 'Disabled', assigned: 'All Tenants' })}
              >
                Cancel
              </button>
              <button
                className="gc-btn gc-btn-primary btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2"
                style={{ fontSize: 13 }}
                onClick={handleCreateFlag}
              >
                <FiPlus size={15} />
                Create Feature Flag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagSystem;
