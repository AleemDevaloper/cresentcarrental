import React, { useState } from 'react';
import { FiUserCheck, FiSearch, FiTerminal, FiEdit3, FiXCircle, FiClock, FiUsers, FiShield, FiAlertTriangle, FiInfo, FiList } from 'react-icons/fi';

const ImpersonationCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('Support');
  const [reasonText, setReasonText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const users = [
    'Alice Brown', 'Bob Johnson', 'Charlie Wilson', 'Diana Prince',
    'Eve Adams', 'Frank Castle', 'Grace Hopper', 'Henry Cavill',
    'Ivy League', 'Jack Sparrow', 'Kate Bishop',
  ];

  const filteredSuggestions = users.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeImpersonations = [
    { startedBy: 'Root Admin', impersonating: 'Alice Brown', role: 'Employee', tenant: 'Acme Corp', reason: 'Support: Password reset', startedAt: '5 min ago', duration: '5 min' },
    { startedBy: 'Platform Admin', impersonating: 'Bob Johnson', role: 'Finance Manager', tenant: 'Globex Inc', reason: 'Audit: Financial review', startedAt: '15 min ago', duration: '15 min' },
    { startedBy: 'Root Admin', impersonating: 'Charlie Wilson', role: 'Platform Admin', tenant: 'Initech', reason: 'Debug: Module issue', startedAt: '1 hour ago', duration: '1h' },
  ];

  const impersonationHistory = [
    { startedBy: 'Root Admin', impersonating: 'Diana Prince', role: 'Employee', tenant: 'Acme Corp', reason: 'Training: New system demo', startedAt: '2026-06-15 14:30', endedAt: '2026-06-15 15:45', duration: '1h 15m' },
    { startedBy: 'Super Admin', impersonating: 'Eve Adams', role: 'HR Manager', tenant: 'Globex Inc', reason: 'Audit: Compliance check', startedAt: '2026-06-14 10:00', endedAt: '2026-06-14 11:30', duration: '1h 30m' },
    { startedBy: 'Root Admin', impersonating: 'Frank Castle', role: 'Finance Manager', tenant: 'Soylent Corp', reason: 'Support: Access issue', startedAt: '2026-06-13 09:15', endedAt: '2026-06-13 09:45', duration: '30 min' },
    { startedBy: 'Platform Admin', impersonating: 'Grace Hopper', role: 'Employee', tenant: 'Wayne Enterprises', reason: 'Debug: Reporting bug', startedAt: '2026-06-12 16:00', endedAt: '2026-06-12 17:20', duration: '1h 20m' },
    { startedBy: 'Root Admin', impersonating: 'Henry Cavill', role: 'Employee', tenant: 'Initech', reason: 'Other: User request', startedAt: '2026-06-11 11:00', endedAt: '2026-06-11 11:30', duration: '30 min' },
  ];

  return (
    <div className="gc-impersonation-center">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUserCheck size={22} color="#8b5cf6" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>Impersonation Center</h5>
            <p className="text-muted small mb-0">Manage user impersonation with full audit trail</p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">Impersonation Controls</h6>
            <div className="mb-3" style={{ position: 'relative' }}>
              <label className="form-label small fw-semibold text-muted mb-1">Search User to Impersonate</label>
              <div className="d-flex align-items-center bg-white border rounded-3 px-3" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <FiSearch size={14} className="text-muted" />
                <input
                  type="text"
                  className="gc-input border-0"
                  style={{ fontSize: 13, padding: '8px 10px' }}
                  placeholder="Type user name..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
              </div>
              {showSuggestions && searchQuery && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, marginTop: 4, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {filteredSuggestions.map((u, idx) => (
                    <div key={idx} className="px-3 py-2" style={{ cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f1f5f9' }}
                      onMouseDown={() => { setSearchQuery(u); setShowSuggestions(false); }}>
                      <FiUsers size={12} className="text-muted me-2" />{u}
                    </div>
                  ))}
                  {filteredSuggestions.length === 0 && <div className="px-3 py-2 text-muted" style={{ fontSize: 12 }}>No users found</div>}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted mb-1">Impersonation Reason</label>
              <select className="gc-input" style={{ fontSize: 13 }} value={reason} onChange={(e) => setReason(e.target.value)}>
                <option value="Support">Support</option>
                <option value="Audit">Audit</option>
                <option value="Training">Training</option>
                <option value="Debug">Debug</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted mb-1">Reason Details</label>
              <textarea className="gc-input" rows={3} style={{ fontSize: 13, resize: 'vertical' }} placeholder="Describe why impersonation is needed..." value={reasonText} onChange={(e) => setReasonText(e.target.value)} />
            </div>
            <button className="gc-btn gc-btn-primary w-100 mb-3 justify-content-center"><FiTerminal size={14} /> Start Impersonation</button>
            <hr />
            <div className="mb-2">
              <label className="form-label small fw-semibold text-muted mb-1">Login As Tenant</label>
              <select className="gc-input" style={{ fontSize: 13 }}>
                <option value="">Select tenant...</option>
                <option value="acme">Acme Corp</option>
                <option value="globex">Globex Inc</option>
                <option value="initech">Initech</option>
                <option value="wayne">Wayne Enterprises</option>
                <option value="soylent">Soylent Corp</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label small fw-semibold text-muted mb-1">Login As Company Admin</label>
              <select className="gc-input" style={{ fontSize: 13 }}>
                <option value="">Select company admin...</option>
                <option value="admin1">John Doe - Acme Corp Admin</option>
                <option value="admin2">Sarah Connor - Globex Admin</option>
                <option value="admin3">Peter Parker - Initech Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="gc-card p-4 mb-4">
            <h6 className="fw-bold mb-3">Active Impersonations</h6>
            <div className="table-responsive">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>Started By</th><th>Impersonating As</th><th>Role</th><th>Tenant</th><th>Reason</th><th>Started At</th><th>Duration</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeImpersonations.map((imp, idx) => (
                    <tr key={idx}>
                      <td><span className="fw-semibold" style={{ fontSize: 12 }}>{imp.startedBy}</span></td>
                      <td style={{ fontSize: 12 }}>{imp.impersonating}</td>
                      <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{imp.role}</span></td>
                      <td style={{ fontSize: 12 }}>{imp.tenant}</td>
                      <td style={{ fontSize: 11 }}>{imp.reason}</td>
                      <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{imp.startedAt}</td>
                      <td style={{ fontSize: 11 }}>{imp.duration}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="gc-btn gc-btn-outline gc-btn-sm"><FiEdit3 size={12} /></button>
                          <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ color: '#dc2626' }}><FiXCircle size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">Impersonation History</h6>
            <div className="table-responsive" style={{ maxHeight: 300, overflowY: 'auto' }}>
              <table className="gc-table">
                <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr>
                    <th>Started By</th><th>Impersonating</th><th>Role</th><th>Tenant</th><th>Reason</th><th>Started</th><th>Ended</th><th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {impersonationHistory.map((imp, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: 12 }}>{imp.startedBy}</td>
                      <td style={{ fontSize: 12 }}>{imp.impersonating}</td>
                      <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{imp.role}</span></td>
                      <td style={{ fontSize: 12 }}>{imp.tenant}</td>
                      <td style={{ fontSize: 11 }}>{imp.reason}</td>
                      <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{imp.startedAt}</td>
                      <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{imp.endedAt}</td>
                      <td style={{ fontSize: 11 }}>{imp.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="gc-card p-4" style={{ borderLeft: '4px solid #8b5cf6' }}>
        <div className="d-flex align-items-start gap-3">
          <FiShield size={24} color="#8b5cf6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h6 className="fw-bold mb-1">Audit Tracking</h6>
            <p className="text-muted small mb-0">
              All impersonation sessions are automatically logged, monitored, and audited in real-time.
              Every action taken during impersonation is recorded with timestamps, including all data viewed,
              modified, or exported. Session recordings are retained for 90 days and reviewed by the Security
              Team on a weekly basis. Unauthorized access attempts trigger immediate alerts to the Super Admin.
              Impersonation sessions are automatically terminated after 4 hours of inactivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationCenter;
