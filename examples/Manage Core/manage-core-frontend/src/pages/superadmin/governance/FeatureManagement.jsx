import React, { useState } from 'react';
import {
  FiChevronDown, FiChevronRight, FiToggleLeft, FiToggleRight,
  FiZap, FiBox, FiSliders, FiEdit3, FiTrash2,
  FiCode, FiCheck, FiX, FiGlobe, FiUsers, FiBriefcase,
  FiLayers, FiShield, FiUserCheck, FiActivity
} from 'react-icons/fi';

const MODULES_FEATURES = [
  {
    name: 'HRMS', icon: '👤', features: [
      { name: 'Employee Management', code: 'EMP_MGMT', desc: 'Manage employee profiles and records', enabled: true, visibility: 'Global' },
      { name: 'Attendance Tracking', code: 'ATT', desc: 'Track employee attendance', enabled: true, visibility: 'Tenant Level' },
      { name: 'Leave Management', code: 'LEAVE', desc: 'Manage leave requests', enabled: true, visibility: 'Global' },
      { name: 'Payroll Processing', code: 'PAYROLL', desc: 'Process payroll', enabled: true, visibility: 'Tenant Level' },
      { name: 'Recruitment & ATS', code: 'RECRUIT', desc: 'Applicant tracking', enabled: false, visibility: 'Company Level' },
      { name: 'Training & Development', code: 'TRAINING', desc: 'Employee training', enabled: false, visibility: 'Department Level' },
      { name: 'Performance Reviews', code: 'PERF', desc: 'Performance management', enabled: true, visibility: 'Role Level' },
      { name: 'Asset Management', code: 'ASSETS', desc: 'Manage employee assets', enabled: false, visibility: 'Company Level' },
      { name: 'Documents & Compliance', code: 'DOCS', desc: 'Document management', enabled: true, visibility: 'Global' },
      { name: 'Onboarding', code: 'ONBOARD', desc: 'Employee onboarding', enabled: true, visibility: 'Tenant Level' },
      { name: 'Offboarding', code: 'OFFBOARD', desc: 'Employee offboarding', enabled: true, visibility: 'Tenant Level' },
    ]
  },
  {
    name: 'FMS', icon: '💰', features: [
      { name: 'Expense Management', code: 'EXPENSE', desc: 'Track expenses', enabled: true, visibility: 'Global' },
      { name: 'Invoice Management', code: 'INVOICE', desc: 'Manage invoices', enabled: true, visibility: 'Tenant Level' },
      { name: 'Quotations', code: 'QUOTE', desc: 'Create quotations', enabled: true, visibility: 'Company Level' },
      { name: 'Purchase Orders', code: 'PO', desc: 'Manage POs', enabled: false, visibility: 'Tenant Level' },
      { name: 'Treasury Management', code: 'TREASURY', desc: 'Cash management', enabled: false, visibility: 'Role Level' },
      { name: 'Budgeting', code: 'BUDGET', desc: 'Budget planning', enabled: true, visibility: 'Tenant Level' },
      { name: 'Investments', code: 'INVEST', desc: 'Investment tracking', enabled: false, visibility: 'Company Level' },
      { name: 'Loans Management', code: 'LOANS', desc: 'Loan tracking', enabled: false, visibility: 'Tenant Level' },
      { name: 'Financial Reports', code: 'FREPORTS', desc: 'Financial reporting', enabled: true, visibility: 'Global' },
    ]
  }
];

const FEATURE_FLAGS = [
  { name: 'AI Payroll Assistant', key: 'ai_payroll_assist', desc: 'AI-powered payroll suggestions', status: 'Enabled', assigned: 'All Tenants' },
  { name: 'New Attendance Engine', key: 'new_attendance_engine', desc: 'Real-time attendance tracking', status: 'Disabled', assigned: 'Beta Tenants' },
  { name: 'Advanced BI Reports', key: 'advanced_bi_reports', desc: 'Enhanced analytics', status: 'Sandbox', assigned: 'Acme Corp' },
  { name: 'Smart Approval Workflow', key: 'smart_approvals', desc: 'AI-driven approvals', status: 'Pilot', assigned: 'Enterprise Tier' },
  { name: 'Custom Dashboard Builder', key: 'custom_dashboards', desc: 'Drag & drop dashboards', status: 'Internal Testing', assigned: 'Dev Team' },
];

const VISIBILITY_STYLES = {
  'Global': { bg: '#05966915', text: '#059669', icon: '🌐' },
  'Tenant Level': { bg: '#3b82f615', text: '#3b82f6', icon: '🏢' },
  'Company Level': { bg: '#8b5cf615', text: '#8b5cf6', icon: '🏛️' },
  'Department Level': { bg: '#d9770615', text: '#d97706', icon: '📂' },
  'Role Level': { bg: '#ec489915', text: '#ec4899', icon: '🔐' },
  'User Level': { bg: '#14b8a615', text: '#14b8a6', icon: '👤' },
};

const FLAG_STATUS_STYLES = {
  'Enabled': { bg: '#059669', text: '#ffffff' },
  'Disabled': { bg: '#64748b', text: '#ffffff' },
  'Sandbox': { bg: '#d97706', text: '#ffffff' },
  'Pilot': { bg: '#3b82f6', text: '#ffffff' },
  'Internal Testing': { bg: '#8b5cf6', text: '#ffffff' },
};

const FeatureManagement = () => {
  const [expandedModules, setExpandedModules] = useState({ HRMS: true, FMS: false });
  const [featuresState, setFeaturesState] = useState(MODULES_FEATURES);

  const toggleModule = (name) => {
    setExpandedModules((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleFeature = (moduleName, featureCode) => {
    setFeaturesState((prev) =>
      prev.map((mod) =>
        mod.name === moduleName
          ? {
              ...mod,
              features: mod.features.map((f) =>
                f.code === featureCode ? { ...f, enabled: !f.enabled } : f
              ),
            }
          : mod
      )
    );
  };

  const toggleGlobalOverride = (moduleName, e) => {
    const checked = e.target.checked;
    setFeaturesState((prev) =>
      prev.map((mod) =>
        mod.name === moduleName
          ? { ...mod, features: mod.features.map((f) => ({ ...f, enabled: checked })) }
          : mod
      )
    );
  };

  const getVisibilityStyle = (visibility) => VISIBILITY_STYLES[visibility] || VISIBILITY_STYLES['Global'];

  return (
    <div className="gc-feature-management">
      <div className="gc-feature-sections mb-5">
        {featuresState.map((mod) => {
          const isExpanded = expandedModules[mod.name];
          return (
            <div key={mod.name} className="gc-module-section card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div
                className="gc-module-header d-flex align-items-center justify-content-between p-4 bg-white cursor-pointer"
                onClick={() => toggleModule(mod.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '24px' }}>{mod.icon}</span>
                  <h5 className="fw-bold mb-0">{mod.name} Module Features</h5>
                  <span className="badge bg-light text-muted rounded-pill px-3" style={{ fontSize: '11px' }}>
                    {mod.features.length} features
                  </span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="small text-muted fw-semibold">Global Override</span>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        onChange={(e) => toggleGlobalOverride(mod.name, e)}
                      />
                    </div>
                  </div>
                  {isExpanded ? <FiChevronDown size={20} className="text-muted" /> : <FiChevronRight size={20} className="text-muted" />}
                </div>
              </div>

              {isExpanded && (
                <div className="gc-features-grid p-4 pt-0" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="row g-3 mt-2">
                    {mod.features.map((feature) => {
                      const visStyle = getVisibilityStyle(feature.visibility);
                      return (
                        <div key={feature.code} className="col-xl-4 col-lg-6">
                          <div className="gc-feature-card card border-0 shadow-xs rounded-3 h-100 bg-white">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-start justify-content-between mb-2">
                                <div>
                                  <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>{feature.name}</h6>
                                  <code className="gc-feature-code badge bg-light text-muted px-2 py-1" style={{ fontSize: '10px' }}>{feature.code}</code>
                                </div>
                                <div className="form-check form-switch mb-0">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={feature.enabled}
                                    onChange={() => toggleFeature(mod.name, feature.code)}
                                  />
                                </div>
                              </div>
                              <p className="gc-feature-desc small text-muted mb-3" style={{ fontSize: '12px' }}>{feature.desc}</p>
                              <div className="d-flex align-items-center justify-content-between">
                                <span
                                  className="gc-visibility-badge badge rounded-pill px-2 py-1"
                                  style={{ backgroundColor: visStyle.bg, color: visStyle.text, fontSize: '10px' }}
                                >
                                  {visStyle.icon} {feature.visibility}
                                </span>
                                <div className="gc-feature-actions d-flex gap-1">
                                  <button className="btn btn-sm btn-outline-warning border-0 p-1" title="Beta Feature">
                                    <FiZap size={12} className="text-warning" />
                                  </button>
                                  <button className="btn btn-sm btn-outline-info border-0 p-1" title="Sandbox Feature">
                                    <FiZap size={12} style={{color:'#3b82f6'}} />
                                  </button>
                                  <button className="btn btn-sm btn-outline-purple border-0 p-1" title="Experimental Feature">
                                    <FiBox size={12} style={{color:'#8b5cf6'}} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="gc-feature-flags card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white p-4 border-0">
          <div className="d-flex align-items-center gap-3">
            <FiSliders size={22} className="text-primary" />
            <div>
              <h5 className="fw-bold mb-0">Feature Flag System</h5>
              <p className="text-muted small mb-0">Manage global feature flags and progressive rollouts</p>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="gc-flags-table table align-middle mb-0">
              <thead className="bg-light">
                <tr className="small text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
                  <th className="px-4 py-3 fw-bold">Flag Name</th>
                  <th className="px-3 py-3 fw-bold">Key</th>
                  <th className="px-3 py-3 fw-bold">Description</th>
                  <th className="px-3 py-3 fw-bold">Status</th>
                  <th className="px-3 py-3 fw-bold">Assigned To</th>
                  <th className="px-4 py-3 text-end fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_FLAGS.map((flag, idx) => {
                  const flagStyle = FLAG_STATUS_STYLES[flag.status] || FLAG_STATUS_STYLES['Disabled'];
                  return (
                    <tr key={idx} className="border-bottom border-light">
                      <td className="px-4 py-3">
                        <span className="fw-semibold" style={{ fontSize: '13px' }}>{flag.name}</span>
                      </td>
                      <td className="px-3 py-3">
                        <code className="badge bg-dark bg-opacity-10 text-dark px-2 py-1 font-monospace" style={{ fontSize: '10px' }}>{flag.key}</code>
                      </td>
                      <td className="px-3 py-3">
                        <span className="small text-muted">{flag.desc}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="badge rounded-pill px-2 py-1"
                          style={{ backgroundColor: flagStyle.bg, color: flagStyle.text, fontSize: '10px' }}
                        >
                          {flag.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="small">{flag.assigned}</span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex gap-1 justify-content-end">
                          <button className="btn btn-sm btn-outline-primary border-0 p-1" title="Edit Flag">
                            <FiEdit3 size={13} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0 p-1" title="Delete Flag">
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManagement;
