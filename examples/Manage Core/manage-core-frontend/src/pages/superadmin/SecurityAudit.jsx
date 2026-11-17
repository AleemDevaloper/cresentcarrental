import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  faShieldHalved,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faExclamationCircle,
  faChartLine,
  faServer,
  faLock,
  faDatabase,
  faHardDrive,
  faUserShield,
  faSync,
  faClock,
  faWrench,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SecurityAudit = ({ isDark }) => {
  const [running, setRunning] = useState(false);

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const analyticsStats = [
    { label: 'Total Checks', value: '284', color: '#4f46e5', icon: faShieldHalved },
    { label: 'Passed', value: '218', color: '#10b981', icon: faCheckCircle },
    { label: 'Warnings', value: '42', color: '#f59e0b', icon: faExclamationTriangle },
    { label: 'Failed', value: '18', color: '#ef4444', icon: faTimesCircle },
    { label: 'Critical Issues', value: '6', color: '#dc2626', icon: faExclamationCircle },
    { label: 'Security Score', value: '86/100', color: '#6366f1', icon: faChartLine },
  ];

  const auditSections = [
    { name: 'Production Environment', status: 'Pass', checks: 42, icon: faServer, color: '#10b981' },
    { name: 'Runtime Readiness', status: 'Warning', checks: 28, icon: faClock, color: '#f59e0b' },
    { name: 'Security Controls', status: 'Fail', checks: 35, icon: faLock, color: '#ef4444' },
    { name: 'Tenant Isolation', status: 'Pass', checks: 32, icon: faUserShield, color: '#10b981' },
    { name: 'Database Security', status: 'Warning', checks: 25, icon: faDatabase, color: '#f59e0b' },
    { name: 'Storage Security', status: 'Pass', checks: 18, icon: faHardDrive, color: '#10b981' },
    { name: 'Authentication Security', status: 'Fail', checks: 22, icon: faShieldHalved, color: '#ef4444' },
    { name: 'Backup Validation', status: 'Pass', checks: 30, icon: faSync, color: '#10b981' },
    { name: 'Queue Health', status: 'Warning', checks: 52, icon: faWrench, color: '#f59e0b' },
  ];

  const recommendations = [
    { text: 'HTTPS is not enforced on all subdomains', severity: 'Critical' },
    { text: 'Session timeout is set to 24 hours (recommended: 8 hours)', severity: 'High' },
    { text: 'Debug mode is enabled in production environment', severity: 'High' },
  ];

  const severityColors = {
    Critical: { bg: 'rgba(220,38,38,0.15)', text: '#ef4444', border: 'rgba(220,38,38,0.3)' },
    High: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
    Medium: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemAnim = {
    hidden: { y: 24, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 18 } },
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '32px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: textColor }}>
      <motion.div variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={itemAnim} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: radius, background: primaryGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', flexShrink: 0,
            }}>
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.3px' }}>Enterprise Security & Production Audit</h1>
              <p style={{ margin: '4px 0 0', color: mutedColor, fontSize: 14 }}>Comprehensive deployment, security, compliance and production readiness auditing</p>
            </div>
          </div>
          <button
            onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 2400); }}
            style={{
              height: 42, padding: '0 22px', borderRadius: radius, border: 'none', background: primaryGradient,
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              opacity: running ? 0.7 : 1, transition: '0.2s',
            }}
          >
            <FontAwesomeIcon icon={running ? faSync : faShieldHalved} spin={running} />
            {running ? 'Running...' : 'Run New Audit'}
          </button>
        </motion.div>

        {/* Analytics Row */}
        <motion.div variants={itemAnim} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {analyticsStats.map((s, i) => (
            <div key={i} style={{
              background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
              padding: '20px 18px', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: `${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: s.color, flexShrink: 0,
              }}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: mutedColor, fontWeight: 500 }}>{s.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Audit Sections Grid */}
        <motion.div variants={itemAnim} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
          {auditSections.map((sec, i) => {
            const statusBg = sec.status === 'Pass' ? 'rgba(16,185,129,0.12)' : sec.status === 'Warning' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
            const statusColor = sec.status === 'Pass' ? '#10b981' : sec.status === 'Warning' ? '#f59e0b' : '#ef4444';
            return (
              <div key={i} style={{
                background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`,
                padding: 22, backdropFilter: 'blur(12px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, background: `${sec.color}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: sec.color, flexShrink: 0,
                  }}>
                    <FontAwesomeIcon icon={sec.icon} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{sec.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: mutedColor }}>{sec.checks} checks</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: statusBg, color: statusColor,
                  }}>
                    {sec.status}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: mutedColor }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 4, color: sec.checks > 30 ? '#10b981' : '#f59e0b' }} />
                    {sec.status === 'Pass' ? 'All checks passed' : `${sec.checks} issues found`}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={itemAnim} style={{ background: cardBg, borderRadius: radius, border: `1px solid ${borderColor}`, padding: 24, backdropFilter: 'blur(12px)', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Recommendations</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: mutedColor }}>Critical and high-severity issues requiring immediate attention</p>
            </div>
            <button style={{
              height: 38, padding: '0 18px', borderRadius: radius, border: `1px solid ${borderColor}`,
              background: inputBg, color: textColor, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <FontAwesomeIcon icon={faFileExport} /> Export Report
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recommendations.map((rec, i) => {
              const sv = severityColors[rec.severity];
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 18px', borderRadius: 12, border: `1px solid ${sv.border}`,
                  background: sv.bg,
                }}>
                  <span style={{
                    padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: sv.text + '22', color: sv.text, whiteSpace: 'nowrap',
                  }}>
                    {rec.severity}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{rec.text}</span>
                  <button style={{
                    width: 34, height: 34, borderRadius: 10, border: 'none', background: `${textColor}0c`,
                    color: textColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0, transition: '0.15s',
                  }} title="Fix issue">
                    <FontAwesomeIcon icon={faWrench} />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SecurityAudit;
