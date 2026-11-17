import React, { useState } from 'react';
import {
  FiAlertTriangle, FiUsers, FiMonitor, FiGlobe, FiShield, FiActivity,
  FiLock, FiSmartphone, FiMapPin, FiClock, FiEye, FiCheckCircle,
  FiXCircle, FiAlertCircle, FiInfo, FiSearch, FiDownload
} from 'react-icons/fi';

const kpiCards = [
  { label: 'Failed Logins Today', value: '24', icon: <FiAlertTriangle size={22} />, color: '#dc2626', bg: '#fef2f2' },
  { label: 'Blocked Users', value: '18', icon: <FiUsers size={22} />, color: '#d97706', bg: '#fffbeb' },
  { label: 'Blocked Devices', value: '7', icon: <FiMonitor size={22} />, color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'Blocked IPs', value: '12', icon: <FiGlobe size={22} />, color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Risk Score', value: '12.4', sub: '/100 Low', icon: <FiShield size={22} />, color: '#059669', bg: '#f0fdf4' },
  { label: 'Active Threats', value: '2', icon: <FiActivity size={22} />, color: '#dc2626', bg: '#fef2f2' },
];

const initialControls = {
  passwordPolicy: {
    minLength: 12, requireUpper: true, requireLower: true, requireNumbers: true, requireSpecial: true,
    expiryDays: 90, historyCount: 5, maxFailed: 5, lockoutDuration: 30
  },
  mfa: {
    enabled: true, defaultMethod: 'Authenticator App', backupCodes: true,
    rememberDevice: 30, enforcement: 'All Users', exemptRoles: ['Viewer', 'Auditor']
  },
  ipRestrictions: {
    whitelistEnabled: true, countryAllowlist: 'US, CA, UK, DE, FR, AU, JP, SG',
    countryBlocklist: 'None', dynamicIpDetection: true
  },
  sessionPolicies: {
    timeout: 60, concurrentLimit: 3, deviceTrust: true,
    browserFingerprinting: true, newDeviceNotification: true
  }
};

const severityStyles = {
  High: { bg: '#fef2f2', text: '#dc2626', icon: <FiAlertCircle size={14} /> },
  Medium: { bg: '#fffbeb', text: '#d97706', icon: <FiAlertTriangle size={14} /> },
  Low: { bg: '#eff6ff', text: '#3b82f6', icon: <FiInfo size={14} /> },
  Info: { bg: '#f0fdf4', text: '#059669', icon: <FiCheckCircle size={14} /> },
};

const statusStyles = {
  Blocked: { bg: '#fef2f2', text: '#dc2626' },
  Investigated: { bg: '#fffbeb', text: '#d97706' },
  Warned: { bg: '#eff6ff', text: '#3b82f6' },
  Approved: { bg: '#f0fdf4', text: '#059669' },
  Logged: { bg: '#f1f5f9', text: '#64748b' },
};

const mockThreats = [
  { timestamp: '2026-06-16 08:23:14', type: 'Brute Force', source: '185.22.43.12 (Russia)', description: 'Multiple failed login attempts for admin@acme.com', severity: 'High', status: 'Blocked' },
  { timestamp: '2026-06-16 07:45:02', type: 'Suspicious Login', source: '91.234.56.78 (China)', description: 'Login from unusual location for user jsmith', severity: 'Medium', status: 'Investigated' },
  { timestamp: '2026-06-15 23:12:45', type: 'API Abuse', source: '10.0.1.45 (Internal)', description: 'Excessive API calls exceeding rate limit', severity: 'Low', status: 'Warned' },
  { timestamp: '2026-06-15 18:30:22', type: 'Device Change', source: '192.168.1.100 (USA)', description: 'New device detected for user admin', severity: 'Info', status: 'Approved' },
  { timestamp: '2026-06-14 14:15:33', type: 'Permission Change', source: '203.0.113.42 (USA)', description: 'Bulk permission update by super admin', severity: 'Info', status: 'Logged' },
];

const SecurityGovernance = () => {
  const [controls, setControls] = useState(initialControls);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleControl = (section, key) => {
    setControls(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] }
    }));
  };

  const filteredThreats = mockThreats.filter(t =>
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Toggle = ({ active, onToggle }) => (
    <button
      className={`gc-toggle ${active ? 'active' : 'inactive'}`}
      onClick={onToggle}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              <FiShield style={{ marginRight: 10, verticalAlign: 'middle', color: '#3b82f6' }} size={24} />
              Security Governance Center
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
              Monitor and configure security policies, threat detection, and access controls
            </p>
          </div>
          <button className="gc-btn gc-btn-primary" style={{ gap: 8 }}>
            <FiDownload size={16} /> Export Security Report
          </button>
        </div>

        <div className="gc-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {kpiCards.map((kpi, idx) => (
            <div key={idx} className="gc-card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {kpi.value}
                {kpi.sub && <span style={{ fontSize: 13, fontWeight: 600, color: '#059669', marginLeft: 4 }}>{kpi.sub}</span>}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="gc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <FiLock size={18} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Password Policy</h3>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {[
              { label: 'Min Length', value: `${controls.passwordPolicy.minLength} characters` },
              { label: 'Require Uppercase', value: controls.passwordPolicy.requireUpper, toggle: true, key: 'requireUpper', section: 'passwordPolicy' },
              { label: 'Require Lowercase', value: controls.passwordPolicy.requireLower, toggle: true, key: 'requireLower', section: 'passwordPolicy' },
              { label: 'Require Numbers', value: controls.passwordPolicy.requireNumbers, toggle: true, key: 'requireNumbers', section: 'passwordPolicy' },
              { label: 'Require Special Characters', value: controls.passwordPolicy.requireSpecial, toggle: true, key: 'requireSpecial', section: 'passwordPolicy' },
              { label: 'Password Expiry', value: `${controls.passwordPolicy.expiryDays} days` },
              { label: 'Password History', value: `${controls.passwordPolicy.historyCount} passwords` },
              { label: 'Max Failed Attempts', value: controls.passwordPolicy.maxFailed },
              { label: 'Lockout Duration', value: `${controls.passwordPolicy.lockoutDuration} minutes` },
            ].map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: idx < 8 ? '1px solid #f8fafc' : 'none' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{row.label}</span>
                {row.toggle ? (
                  <Toggle active={row.value} onToggle={() => toggleControl(row.section, row.key)} />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="gc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <FiSmartphone size={18} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Multi-Factor Authentication</h3>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {[
              { label: 'MFA Status', value: controls.mfa.enabled, toggle: true, key: 'enabled', section: 'mfa' },
              { label: 'Default Method', value: controls.mfa.defaultMethod },
              { label: 'Backup Codes', value: controls.mfa.backupCodes, toggle: true, key: 'backupCodes', section: 'mfa' },
              { label: 'Remember Device', value: `${controls.mfa.rememberDevice} days` },
              { label: 'Enforcement', value: controls.mfa.enforcement },
              { label: 'Exempt Roles', value: controls.mfa.exemptRoles.join(', ') },
            ].map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: idx < 5 ? '1px solid #f8fafc' : 'none' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{row.label}</span>
                {row.toggle ? (
                  <Toggle active={row.value} onToggle={() => toggleControl(row.section, row.key)} />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="gc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <FiGlobe size={18} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>IP & Country Restrictions</h3>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {[
              { label: 'IP Whitelist Enabled', value: controls.ipRestrictions.whitelistEnabled, toggle: true, key: 'whitelistEnabled', section: 'ipRestrictions' },
              { label: 'Country Allowlist', value: controls.ipRestrictions.countryAllowlist },
              { label: 'Country Blocklist', value: controls.ipRestrictions.countryBlocklist },
              { label: 'Dynamic IP Detection', value: controls.ipRestrictions.dynamicIpDetection, toggle: true, key: 'dynamicIpDetection', section: 'ipRestrictions' },
            ].map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: idx < 3 ? '1px solid #f8fafc' : 'none' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{row.label}</span>
                {row.toggle ? (
                  <Toggle active={row.value} onToggle={() => toggleControl(row.section, row.key)} />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="gc-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
              <FiMonitor size={18} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Session & Device Policies</h3>
          </div>
          <div style={{ padding: '16px 22px' }}>
            {[
              { label: 'Session Timeout', value: `${controls.sessionPolicies.timeout} minutes` },
              { label: 'Concurrent Login Limit', value: controls.sessionPolicies.concurrentLimit },
              { label: 'Device Trust', value: controls.sessionPolicies.deviceTrust, toggle: true, key: 'deviceTrust', section: 'sessionPolicies' },
              { label: 'Browser Fingerprinting', value: controls.sessionPolicies.browserFingerprinting, toggle: true, key: 'browserFingerprinting', section: 'sessionPolicies' },
              { label: 'New Device Notification', value: controls.sessionPolicies.newDeviceNotification, toggle: true, key: 'newDeviceNotification', section: 'sessionPolicies' },
            ].map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: idx < 4 ? '1px solid #f8fafc' : 'none' }}>
                <span style={{ fontSize: 13, color: '#475569' }}>{row.label}</span>
                {row.toggle ? (
                  <Toggle active={row.value} onToggle={() => toggleControl(row.section, row.key)} />
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <FiActivity size={18} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Security Threat Log</h3>
            <span className="gc-badge" style={{ background: '#fef2f2', color: '#dc2626', fontSize: 11 }}>{mockThreats.length} Threats</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                className="gc-input"
                style={{ paddingLeft: 34, width: 240 }}
                placeholder="Search threats..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="gc-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Source</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.map((threat, idx) => {
                const sev = severityStyles[threat.severity];
                const sts = statusStyles[threat.status];
                return (
                  <tr key={idx}>
                    <td style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{threat.timestamp}</td>
                    <td><span style={{ fontWeight: 600, fontSize: 13 }}>{threat.type}</span></td>
                    <td style={{ fontSize: 13 }}>{threat.source}</td>
                    <td style={{ fontSize: 13, color: '#475569' }}>{threat.description}</td>
                    <td>
                      <span className="gc-badge" style={{ background: sev.bg, color: sev.text, fontSize: 11 }}>
                        {sev.icon} {threat.severity}
                      </span>
                    </td>
                    <td>
                      <span className="gc-badge" style={{ background: sts.bg, color: sts.text, fontSize: 11 }}>
                        {threat.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ marginRight: 6 }}>
                        <FiEye size={12} /> View
                      </button>
                      <button className="gc-btn gc-btn-primary gc-btn-sm">
                        <FiCheckCircle size={12} /> Resolve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityGovernance;
