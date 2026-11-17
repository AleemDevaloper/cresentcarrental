import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding, faServer, faShieldHalved, faScaleBalanced, faKey,
  faFileInvoiceDollar, faChartLine, faRobot, faDatabase, faBell,
  faSliders, faMagnifyingGlass, faUsers, faHardDrive, faBolt,
  faTriangleExclamation, faCircleCheck, faClock, faLock, faUserShield,
  faGlobe, faLayerGroup, faCloud, faRotateLeft, faWifi, faBrain,
  faFlag, faCog, faListCheck, faHistory, faCircleInfo, faArrowUp,
  faArrowDown, faPlus, faXmark, faEye, faUserSecret, faFingerprint,
  faCreditCard, faReceipt, faChartPie, faGear, faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { EnableDisableButton } from '../../../components/common';

const PALETTE = {
  primary: '#6366f1',
  success: '#10b981',
  danger: '#f43f5e',
  warning: '#f59e0b',
  info: '#06b6d4',
  purple: '#8b5cf6',
};

const cardStyle = (isDark) => ({
  background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
  borderRadius: 16,
  padding: 20,
  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 4px 16px rgba(15,23,42,0.06)',
});

const inputStyle = (isDark) => ({
  width: '100%', padding: '9px 14px', borderRadius: 10,
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#d8dee9'}`,
  background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
  color: isDark ? '#e2e8f0' : '#1e293b', fontSize: 13, outline: 'none',
});

const Kpi = ({ icon, label, value, trend, color, isDark }) => (
  <div style={cardStyle(isDark)} className="h-100">
    <div className="d-flex align-items-center gap-3">
      <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, color, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <div className="text-muted text-uppercase" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>{label}</div>
        <div className="fw-bold" style={{ fontSize: 22, lineHeight: 1.1, color: isDark ? '#f1f5f9' : '#0f172a' }}>{value}</div>
      </div>
      {trend && (
        <span className="ms-auto x-small fw-bold" style={{ color: trend.startsWith('-') ? PALETTE.danger : PALETTE.success }}>
          {trend.startsWith('-') ? <FontAwesomeIcon icon={faArrowDown} /> : <FontAwesomeIcon icon={faArrowUp} />} {trend}
        </span>
      )}
    </div>
  </div>
);

const SectionHeader = ({ icon, title, color, isDark, desc }) => (
  <div className="d-flex align-items-center gap-3 mb-3">
    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}15`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div>
      <h6 className="fw-bold mb-0" style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontSize: 15 }}>{title}</h6>
      {desc && <div className="text-muted" style={{ fontSize: 11.5 }}>{desc}</div>}
    </div>
  </div>
);

const StatusBadge = ({ status, isDark }) => {
  const map = {
    Healthy: PALETTE.success, Active: PALETTE.success, Running: PALETTE.success,
    Warning: PALETTE.warning, Paused: PALETTE.warning, Pending: PALETTE.warning,
    Critical: PALETTE.danger, Failed: PALETTE.danger, Suspended: PALETTE.danger,
    Completed: PALETTE.info, Approved: PALETTE.info,
  };
  const c = map[status] || PALETTE.info;
  return <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ background: `${c}1a`, color: c, fontSize: 10 }}>{status}</span>;
};

const ROWS = [
  { id: 'overview', label: 'Enterprise Overview', icon: faBuilding },
  { id: 'companies', label: 'Company Management', icon: faUsers },
  { id: 'licensing', label: 'Licensing & Billing', icon: faScaleBalanced },
  { id: 'security', label: 'Security Center', icon: faShieldHalved },
  { id: 'compliance', label: 'Compliance & Governance', icon: faUserShield },
  { id: 'monitoring', label: 'System Monitoring', icon: faServer },
  { id: 'aigovernance', label: 'AI Governance', icon: faRobot },
  { id: 'backup', label: 'Backup & Disaster Recovery', icon: faDatabase },
  { id: 'analytics', label: 'Analytics & BI', icon: faChartLine },
  { id: 'audit', label: 'Audit Logs', icon: faHistory },
  { id: 'notifications', label: 'Notification Center', icon: faBell },
  { id: 'featureflags', label: 'Feature Flags', icon: faFlag },
  { id: 'tools', label: 'Super Admin Tools', icon: faGear },
];

const DrawingEnterpriseAdmin = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [active, setActive] = useState('overview');
  const [search, setSearch] = useState('');

  const [featureFlags, setFeatureFlags] = useState(() => {
    const s = localStorage.getItem('drawing_admin_flags');
    return s ? JSON.parse(s) : {
      realTimeCollab: true, aiAssistant: true, plugins: false, mcp: false,
      betaExports: false, publicSharing: true, offlineMode: true, auditMode: true,
    };
  });
  const [companies, setCompanies] = useState(() => {
    const s = localStorage.getItem('drawing_admin_companies');
    return s ? JSON.parse(s) : [
      { id: 'c1', name: 'Stark Industries', plan: 'Enterprise', status: 'Active', users: 1240, storage: '842 GB', drawings: 3210 },
      { id: 'c2', name: 'Wayne Enterprises', plan: 'Business', status: 'Active', users: 540, storage: '310 GB', drawings: 1402 },
      { id: 'c3', name: 'Acme Corp', plan: 'Trial', status: 'Trial', users: 18, storage: '12 GB', drawings: 64 },
      { id: 'c4', name: 'Globex', plan: 'Professional', status: 'Suspended', users: 220, storage: '120 GB', drawings: 510 },
    ];
  });

  useEffect(() => { localStorage.setItem('drawing_admin_flags', JSON.stringify(featureFlags)); }, [featureFlags]);
  useEffect(() => { localStorage.setItem('drawing_admin_companies', JSON.stringify(companies)); }, [companies]);

  const toggleFlag = (k) => setFeatureFlags(prev => ({ ...prev, [k]: !prev[k] }));

  const auditLogs = [
    { user: 'superadmin@managecore.com', action: 'Company Updated', detail: 'Globex status → Suspended', time: '2026-07-17 09:14', ip: '203.0.113.22' },
    { user: 'tony@stark.io', action: 'AI Usage', detail: 'Generated architecture diagram', time: '2026-07-17 08:52', ip: '198.51.100.7' },
    { user: 'superadmin@managecore.com', action: 'License Changed', detail: 'Acme Corp → Trial', time: '2026-07-16 17:30', ip: '203.0.113.22' },
    { user: 'nat@wayne.com', action: 'Export', detail: 'Presentation → PPTX', time: '2026-07-16 15:11', ip: '192.0.2.45' },
    { user: 'bruce@stark.io', action: 'Permission Change', detail: 'Granted Designer role', time: '2026-07-16 11:02', ip: '198.51.100.9' },
  ];

  const threatFeeds = [
    { sev: 'Critical', msg: 'Repeated failed logins from 185.220.101.x', time: '2m ago' },
    { sev: 'Warning', msg: 'API rate limit exceeded for Globex tenant', time: '18m ago' },
    { sev: 'Info', msg: 'New device authorized: iPad Pro (nat@wayne.com)', time: '1h ago' },
  ];

  const renderOverview = () => (
    <div className="space-y-4">
      <div className="row g-3">
        <div className="col-xl-3 col-md-4 col-6"><Kpi icon={faBuilding} label="Total Companies" value={companies.length} trend="+2" color={PALETTE.primary} isDark={isDark} /></div>
        <div className="col-xl-3 col-md-4 col-6"><Kpi icon={faUsers} label="Active Users" value="14,930" trend="+5.2%" color={PALETTE.info} isDark={isDark} /></div>
        <div className="col-xl-3 col-md-4 col-6"><Kpi icon={faHardDrive} label="Storage Used" value="2.1 TB" trend="+8%" color={PALETTE.warning} isDark={isDark} /></div>
        <div className="col-xl-3 col-md-4 col-6"><Kpi icon={faRobot} label="AI Requests" value="128K" trend="+21%" color={PALETTE.purple} isDark={isDark} /></div>
      </div>
      <div className="row g-3">
        <div className="col-xl-8">
          <div style={cardStyle(isDark)}>
            <SectionHeader icon={faServer} title="System Health" color={PALETTE.success} isDark={isDark} desc="Real-time infrastructure status" />
            <div className="row g-3">
              {[
                { n: 'CPU Usage', v: '34%', c: PALETTE.success },
                { n: 'Memory', v: '61%', c: PALETTE.warning },
                { n: 'Disk I/O', v: '22%', c: PALETTE.info },
                { n: 'Bandwidth', v: '480 Mbps', c: PALETTE.primary },
                { n: 'API Requests', v: '9.2K/min', c: PALETTE.purple },
                { n: 'Queue Depth', v: '12', c: PALETTE.success },
              ].map((m, i) => (
                <div className="col-md-4" key={i}>
                  <div className="rounded-3 p-3" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                    <div className="text-muted x-small fw-bold text-uppercase">{m.n}</div>
                    <div className="fw-bold" style={{ fontSize: 18, color: isDark ? '#e2e8f0' : '#0f172a' }}>{m.v}</div>
                    <div className="mt-2" style={{ height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', overflow: 'hidden' }}>
                      <div style={{ width: Math.min(100, parseInt(m.v) || 40) + '%', height: '100%', background: m.c }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div style={cardStyle(isDark)}>
            <SectionHeader icon={faTriangleExclamation} title="Security Alerts" color={PALETTE.danger} isDark={isDark} />
            {threatFeeds.map((t, i) => (
              <div key={i} className="d-flex align-items-start gap-2 mb-2 pb-2" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#eef2f7'}` }}>
                <span className="badge rounded-pill mt-1" style={{ background: (t.sev === 'Critical' ? PALETTE.danger : t.sev === 'Warning' ? PALETTE.warning : PALETTE.info) + '22', color: t.sev === 'Critical' ? PALETTE.danger : t.sev === 'Warning' ? PALETTE.warning : PALETTE.info, fontSize: 9 }}>{t.sev}</span>
                <div>
                  <div className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{t.msg}</div>
                  <div className="x-small text-muted">{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-md-4"><div style={cardStyle(isDark)} className="d-flex align-items-center gap-3"><FontAwesomeIcon icon={faCircleCheck} className="text-success" /><div><div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>System Healthy</div><div className="x-small text-muted">All regions operational</div></div></div></div>
        <div className="col-md-4"><div style={cardStyle(isDark)} className="d-flex align-items-center gap-3"><FontAwesomeIcon icon={faClock} className="text-warning" /><div><div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>99.99% Uptime</div><div className="x-small text-muted">30-day rolling</div></div></div></div>
        <div className="col-md-4"><div style={cardStyle(isDark)} className="d-flex align-items-center gap-3"><FontAwesomeIcon icon={faBolt} className="text-info" /><div><div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>8 Automation Runs</div><div className="x-small text-muted">Last 24 hours</div></div></div></div>
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div>
      <SectionHeader icon={faUsers} title="Company Management" color={PALETTE.primary} isDark={isDark} desc="Multi-tenant isolation, branding, lifecycle" />
      <div className="row g-3 mb-3">
        <div className="col-md-3"><button className="btn btn-primary rounded-pill w-100 fw-bold" style={{ background: PALETTE.primary, border: 'none' }}><FontAwesomeIcon icon={faPlus} className="me-1" />Create Company</button></div>
        <div className="col-md-3"><button className="btn rounded-pill w-100 fw-bold" style={{ background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none' }}><FontAwesomeIcon icon={faCloudArrowUp} className="me-1" />Clone Company</button></div>
        <div className="col-md-3"><button className="btn rounded-pill w-100 fw-bold" style={{ background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none' }}><FontAwesomeIcon icon={faGlobe} className="me-1" />Custom Domain</button></div>
        <div className="col-md-3"><button className="btn rounded-pill w-100 fw-bold" style={{ background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none' }}><FontAwesomeIcon icon={faPaintBrush ?? faSliders} className="me-1" />Branding</button></div>
      </div>
      <div style={cardStyle(isDark)}>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: 13 }}>
            <thead>
              <tr className="text-uppercase" style={{ fontSize: 10, letterSpacing: '0.05em', color: '#94a3b8' }}>
                <th>Company</th><th>Plan</th><th>Status</th><th>Users</th><th>Storage</th><th>Drawings</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id}>
                  <td className="fw-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{c.name}</td>
                  <td>{c.plan}</td>
                  <td><StatusBadge status={c.status} isDark={isDark} /></td>
                  <td>{c.users.toLocaleString()}</td>
                  <td>{c.storage}</td>
                  <td>{c.drawings.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm rounded-pill px-3" style={{ background: `${PALETTE.danger}15`, color: PALETTE.danger, fontSize: 11 }} onClick={() => setCompanies(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === 'Suspended' ? 'Active' : 'Suspended' } : x))}>
                      {c.status === 'Suspended' ? 'Activate' : 'Suspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLicensing = () => (
    <div>
      <SectionHeader icon={faScaleBalanced} title="Licensing & Billing" color={PALETTE.purple} isDark={isDark} desc="Plans, feature limits, subscriptions & payment gateways" />
      <div className="row g-3 mb-3">
        {[
          { p: 'Free', users: 5, storage: '5 GB', ai: 100, c: PALETTE.info },
          { p: 'Starter', users: 25, storage: '50 GB', ai: 1000, c: PALETTE.success },
          { p: 'Professional', users: 250, storage: '500 GB', ai: 10000, c: PALETTE.primary },
          { p: 'Enterprise', users: 'Unlimited', storage: '5 TB', ai: 'Unlimited', c: PALETTE.purple },
        ].map((pl, i) => (
          <div className="col-md-3" key={i}>
            <div style={cardStyle(isDark)} className="h-100">
              <div className="fw-bold" style={{ color: pl.c, fontSize: 16 }}>{pl.p}</div>
              <div className="my-2" style={{ height: 3, borderRadius: 2, background: pl.c }} />
              <div className="x-small text-muted">Max Users: <b style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{pl.users}</b></div>
              <div className="x-small text-muted">Storage: <b style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{pl.storage}</b></div>
              <div className="x-small text-muted">AI Credits: <b style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{pl.ai}</b></div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faCreditCard} className="me-2" style={{ color: PALETTE.purple }} />Payment Gateways</div>
          {['Stripe', 'PayPal', 'Paddle', 'Razorpay', 'Payoneer', 'Wise', 'Bank Transfer'].map((g, i) => (
            <div key={i} className="d-flex align-items-center justify-content-between mb-2">
              <span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{g}</span>
              <StatusBadge status={i < 3 ? 'Active' : 'Pending'} isDark={isDark} />
            </div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faReceipt} className="me-2" style={{ color: PALETTE.success }} />Billing Summary</div>
          <div className="row g-2">
            <div className="col-6"><div className="rounded-3 p-3" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}><div className="x-small text-muted">MRR</div><div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>$71,500</div></div></div>
            <div className="col-6"><div className="rounded-3 p-3" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}><div className="x-small text-muted">ARR</div><div className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>$858,000</div></div></div>
          </div>
          <div className="x-small text-muted mt-2">Billing cycles: Monthly · Quarterly · Yearly · Custom</div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div>
      <SectionHeader icon={faShieldHalved} title="Security Center" color={PALETTE.danger} isDark={isDark} desc="Threat detection, auth, MFA, sessions & devices" />
      <div className="row g-3 mb-3">
        <div className="col-md-3"><Kpi icon={faUserSecret} label="Failed Logins" value="37" trend="-12%" color={PALETTE.danger} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faTriangleExclamation} label="Suspicious" value="3" color={PALETTE.warning} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faFingerprint} label="MFA Enabled" value="94%" color={PALETTE.success} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faLock} label="Encrypted" value="100%" color={PALETTE.info} isDark={isDark} /></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faKey} className="me-2" style={{ color: PALETTE.warning }} />Authentication Methods</div>
          {['Email / Password', 'Google SSO', 'Microsoft 365', 'GitHub', 'SAML / OIDC', 'LDAP / Active Directory'].map((a, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-2"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{a}</span><StatusBadge status={i < 5 ? 'Active' : 'Pending'} isDark={isDark} /></div>
          ))}
          <hr style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#eef2f7' }} />
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Multi-Factor Auth</div>
          {['Authenticator App', 'SMS OTP', 'Email OTP', 'Passkeys', 'Hardware Key', 'Biometric'].map((a, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{a}</span><StatusBadge status={i % 2 === 0 ? 'Active' : 'Pending'} isDark={isDark} /></div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faWifi} className="me-2" style={{ color: PALETTE.info }} />Active Sessions</div>
          {[
            { u: 'Tony Stark', d: 'Chrome · macOS', ip: '198.51.100.7', loc: 'New York' },
            { u: 'Natasha R.', d: 'Edge · Windows', ip: '192.0.2.45', loc: 'London' },
            { u: 'Bruce B.', d: 'Safari · iPad', ip: '203.0.113.9', loc: 'Bangalore' },
          ].map((s, i) => (
            <div key={i} className="d-flex align-items-center justify-content-between mb-2 pb-2" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#eef2f7'}` }}>
              <div><div className="x-small fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{s.u}</div><div className="x-small text-muted">{s.d} · {s.ip} · {s.loc}</div></div>
              <button className="btn btn-sm rounded-pill px-2" style={{ background: `${PALETTE.danger}15`, color: PALETTE.danger, fontSize: 10 }}>Terminate</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div>
      <SectionHeader icon={faUserShield} title="Compliance & Governance" color={PALETTE.info} isDark={isDark} desc="Frameworks, data governance, encryption" />
      <div className="row g-3 mb-3">
        {['GDPR', 'HIPAA', 'SOC 2', 'ISO 27001', 'PCI DSS', 'CCPA', 'FERPA'].map((c, i) => (
          <div className="col-md-4 col-6" key={i}>
            <div style={cardStyle(isDark)} className="d-flex align-items-center justify-content-between">
              <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{c}</span>
              <StatusBadge status={i < 5 ? 'Active' : 'Pending'} isDark={isDark} />
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faLock} className="me-2" style={{ color: PALETTE.success }} />Encryption</div>
          {['AES-256 (At Rest)', 'TLS 1.3 (In Transit)', 'Key Rotation', 'Key Vault', 'Secrets Management'].map((e, i) => (
            <div key={i} className="d-flex justify-content-between mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{e}</span><StatusBadge status="Active" isDark={isDark} /></div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faDatabase} className="me-2" style={{ color: PALETTE.warning }} />Data Governance</div>
          {['Retention Policies', 'Data Classification', 'Data Residency', 'Legal Hold', 'Recovery Policy'].map((e, i) => (
            <div key={i} className="d-flex justify-content-between mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{e}</span><StatusBadge status={i < 4 ? 'Active' : 'Pending'} isDark={isDark} /></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div>
      <SectionHeader icon={faServer} title="System Monitoring" color={PALETTE.primary} isDark={isDark} desc="Application health, errors, queues" />
      <div className="row g-3 mb-3">
        {[
          { n: 'App Errors', v: '0', c: PALETTE.success },
          { n: 'API Errors', v: '2', c: PALETTE.warning },
          { n: 'Plugin Errors', v: '0', c: PALETTE.success },
          { n: 'Background Jobs', v: '148', c: PALETTE.info },
        ].map((m, i) => (
          <div className="col-md-3" key={i}><Kpi icon={faCircleInfo} label={m.n} value={m.v} color={m.c} isDark={isDark} /></div>
        ))}
      </div>
      <div style={cardStyle(isDark)}>
        <div className="fw-bold mb-3" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Application Health</div>
        {[
          { s: 'Healthy', n: 41 }, { s: 'Warning', n: 3 }, { s: 'Critical', n: 0 }, { s: 'Maintenance', n: 1 }, { s: 'Offline', n: 0 },
        ].map((h, i) => (
          <div key={i} className="d-flex align-items-center justify-content-between mb-2">
            <span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{h.s}</span>
            <div className="flex-grow-1 mx-3" style={{ height: 6, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ width: `${(h.n / 45) * 100}%`, height: '100%', background: h.s === 'Healthy' ? PALETTE.success : h.s === 'Warning' ? PALETTE.warning : h.s === 'Critical' ? PALETTE.danger : PALETTE.info }} />
            </div>
            <span className="x-small fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{h.n}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAiGov = () => (
    <div>
      <SectionHeader icon={faRobot} title="AI Governance" color={PALETTE.purple} isDark={isDark} desc="Models, usage, permissions, sensitive data" />
      <div className="row g-3 mb-3">
        <div className="col-md-3"><Kpi icon={faBrain} label="AI Requests" value="128K" trend="+21%" color={PALETTE.purple} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faKey} label="AI Credits Left" value="42K" color={PALETTE.info} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faUserSecret} label="Sensitive Detected" value="6" color={PALETTE.warning} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faCircleCheck} label="Human Approved" value="98%" color={PALETTE.success} isDark={isDark} /></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>AI Models</div>
          {['GPT-4o', 'Claude 3.5', 'Gemini Pro', 'Llama 3', 'DeepSeek'].map((m, i) => (
            <div key={i} className="d-flex justify-content-between mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{m}</span><StatusBadge status={i < 4 ? 'Active' : 'Pending'} isDark={isDark} /></div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Controls</div>
          {['Prompt Filtering', 'Output Review', 'Human Approval', 'Sensitive Data Detection', 'Credit Quotas'].map((m, i) => (
            <div key={i} className="d-flex justify-content-between mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{m}</span><StatusBadge status="Active" isDark={isDark} /></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div>
      <SectionHeader icon={faDatabase} title="Backup & Disaster Recovery" color={PALETTE.warning} isDark={isDark} desc="Automated, incremental & cross-region backups" />
      <div className="row g-3 mb-3">
        <div className="col-md-3"><Kpi icon={faCloudArrowUp} label="Last Backup" value="12m ago" color={PALETTE.success} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faRotateLeft} label="Recovery Tests" value="Passed" color={PALETTE.info} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faGlobe} label="Regions" value="3" color={PALETTE.primary} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faClock} label="RPO" value="5 min" color={PALETTE.warning} isDark={isDark} /></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Backup Types</div>
          {['Incremental', 'Full', 'Manual', 'Scheduled', 'Cloud', 'Local', 'Cross-Region', 'Point-in-Time'].map((b, i) => (
            <div key={i} className="d-flex justify-content-between mb-1"><span className="x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{b}</span><StatusBadge status={i < 7 ? 'Active' : 'Pending'} isDark={isDark} /></div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><FontAwesomeIcon icon={faRotateLeft} className="me-2" style={{ color: PALETTE.info }} />Recent Recoveries</div>
          {[
            { t: 'Workspace restored', who: 'nat@wayne.com', time: '2h ago' },
            { t: 'Version restored', who: 'tony@stark.io', time: '1d ago' },
            { t: 'Asset library restored', who: 'system', time: '3d ago' },
          ].map((r, i) => (
            <div key={i} className="d-flex align-items-center justify-content-between mb-2 pb-2" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#eef2f7'}` }}>
              <div><div className="x-small fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{r.t}</div><div className="x-small text-muted">{r.who}</div></div>
              <span className="x-small text-muted">{r.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div>
      <SectionHeader icon={faChartLine} title="Analytics & Business Intelligence" color={PALETTE.info} isDark={isDark} desc="Usage, revenue, feature adoption & AI analytics" />
      <div className="row g-3 mb-3">
        <div className="col-md-3"><Kpi icon={faUsers} label="Active Companies" value="1,284" trend="+3.1%" color={PALETTE.primary} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faPalette} label="Total Drawings" value="942K" trend="+11%" color={PALETTE.purple} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faTv} label="Presentations" value="61K" trend="+9%" color={PALETTE.warning} isDark={isDark} /></div>
        <div className="col-md-3"><Kpi icon={faChartPie} label="Revenue" value="$858K" trend="+14%" color={PALETTE.success} isDark={isDark} /></div>
      </div>
      <div className="row g-3">
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Feature Adoption</div>
          {[
            { f: 'Real-time Collaboration', p: 78 }, { f: 'AI Assistant', p: 64 }, { f: 'Presentations', p: 52 }, { f: 'Plugins', p: 21 }, { f: 'MCP Integration', p: 12 },
          ].map((a, i) => (
            <div key={i} className="mb-2">
              <div className="d-flex justify-content-between x-small" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}><span>{a.f}</span><span>{a.p}%</span></div>
              <div style={{ height: 6, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: `${a.p}%`, height: '100%', background: PALETTE.primary }} />
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-6" style={cardStyle(isDark)}>
          <div className="fw-bold mb-2" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Reports</div>
          {['Usage Report', 'Security Report', 'Compliance Report', 'Revenue Report', 'Subscription Report', 'Storage Report'].map((r, i) => (
            <button key={i} className="btn btn-sm rounded-pill me-2 mb-2" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', fontSize: 11 }}>
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-1" />{r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div>
      <SectionHeader icon={faHistory} title="Audit Logs" color={PALETTE.primary} isDark={isDark} desc="Immutable activity trail across the platform" />
      <div style={cardStyle(isDark)}>
        <div className="table-responsive">
          <table className="table align-middle mb-0" style={{ fontSize: 13 }}>
            <thead>
              <tr className="text-uppercase" style={{ fontSize: 10, letterSpacing: '0.05em', color: '#94a3b8' }}>
                <th>User</th><th>Action</th><th>Detail</th><th>IP</th><th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((l, i) => (
                <tr key={i}>
                  <td className="fw-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{l.user}</td>
                  <td>{l.action}</td>
                  <td className="text-muted">{l.detail}</td>
                  <td className="text-muted">{l.ip}</td>
                  <td className="text-muted">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div>
      <SectionHeader icon={faBell} title="Notification Center" color={PALETTE.warning} isDark={isDark} desc="Channels & routing for enterprise alerts" />
      <div className="row g-3">
        {[
          { c: 'Email', i: faEnvelope ?? faBell, s: 'Active' },
          { c: 'SMS', i: faCommentDots ?? faBell, s: 'Active' },
          { c: 'Push Notification', i: faBell, s: 'Active' },
          { c: 'Slack', i: faSlack ?? faBell, s: 'Pending' },
          { c: 'Microsoft Teams', i: faUsers, s: 'Pending' },
          { c: 'Webhook', i: faWifi, s: 'Active' },
        ].map((n, i) => (
          <div className="col-md-4" key={i} style={cardStyle(isDark)} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2"><FontAwesomeIcon icon={n.i} style={{ color: PALETTE.info }} /><span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{n.c}</span></div>
            <StatusBadge status={n.s} isDark={isDark} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFlags = () => (
    <div>
      <SectionHeader icon={faFlag} title="Feature Flags" color={PALETTE.purple} isDark={isDark} desc="Enable, disable & roll out features" />
      <div style={cardStyle(isDark)}>
        <div className="row g-3">
          {Object.entries(featureFlags).map(([k, v]) => (
            <div className="col-md-4" key={k}>
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}>
                <span className="x-small fw-bold text-capitalize" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                <EnableDisableButton checked={v} onClick={() => toggleFlag(k)} label={k.replace(/([A-Z])/g, ' $1')} size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTools = () => (
    <div>
      <SectionHeader icon={faGear} title="Super Admin Tools" color={PALETTE.primary} isDark={isDark} desc="Global operations & emergency controls" />
      <div className="row g-3">
        {[
          { t: 'Global Search', i: faMagnifyingGlass, c: PALETTE.info },
          { t: 'Impersonate User', i: faUserSecret, c: PALETTE.warning },
          { t: 'Emergency Maintenance', i: faTriangleExclamation, c: PALETTE.danger },
          { t: 'Broadcast Message', i: faBell, c: PALETTE.primary },
          { t: 'System Lockdown', i: faLock, c: PALETTE.danger },
          { t: 'Force Logout All', i: faUsers, c: PALETTE.warning },
          { t: 'Cache Management', i: faLayerGroup, c: PALETTE.purple },
          { t: 'Queue Management', i: faListCheck, c: PALETTE.info },
          { t: 'Migration Manager', i: faCloudArrowUp, c: PALETTE.success },
        ].map((tl, i) => (
          <div className="col-md-4" key={i}>
            <button className="btn w-100 rounded-4 p-3 d-flex align-items-center gap-2" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', color: isDark ? '#e2e8f0' : '#1e293b', border: 'none', justifyContent: 'flex-start' }}>
              <FontAwesomeIcon icon={tl.i} style={{ color: tl.c }} />
              <span className="fw-bold x-small">{tl.t}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const RENDERERS = {
    overview: renderOverview, companies: renderCompanies, licensing: renderLicensing,
    security: renderSecurity, compliance: renderCompliance, monitoring: renderMonitoring,
    aigovernance: renderAiGov, backup: renderBackup, analytics: renderAnalytics,
    audit: renderAudit, notifications: renderNotifications, featureflags: renderFlags, tools: renderTools,
  };

  const filteredRows = ROWS.filter(r => r.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '8px 4px' }}>
      <div className="row g-4">
        <div className="col-lg-3">
          <div style={cardStyle(isDark)}>
            <div className="position-relative mb-3">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="position-absolute text-muted" style={{ left: 10, top: 9, fontSize: 11 }} />
              <input className="form-control form-control-sm rounded-pill ps-4" placeholder="Search admin..." style={inputStyle(isDark)} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="d-flex flex-column gap-1">
              <div className="x-small fw-bold text-uppercase text-muted mb-1" style={{ letterSpacing: '0.06em' }}>Administration</div>
              {filteredRows.map(r => (
                <button key={r.id} onClick={() => setActive(r.id)}
                  className="nav-btn d-flex align-items-center gap-2 px-3 py-2 border-0"
                  style={{
                    borderRadius: 10, fontSize: '0.8rem', transition: 'all 0.2s',
                    color: active === r.id ? '#fff' : isDark ? '#cbd5e1' : '#475569',
                    background: active === r.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                    boxShadow: active === r.id ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                  }}>
                  <FontAwesomeIcon icon={r.icon} />
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {RENDERERS[active]?.()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DrawingEnterpriseAdmin;
