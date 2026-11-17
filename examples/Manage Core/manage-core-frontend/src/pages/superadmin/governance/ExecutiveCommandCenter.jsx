import React, { useState } from 'react';
import { FiTerminal, FiUsers, FiDollarSign, FiShield, FiHeart, FiActivity, FiAlertTriangle, FiBarChart2, FiZap, FiLock, FiLogOut, FiPower, FiToggleLeft, FiCheckCircle, FiXCircle, FiGlobe, FiDatabase, FiServer, FiClock, FiMonitor } from 'react-icons/fi';

const ExecutiveCommandCenter = () => {
  const [showKillConfirm, setShowKillConfirm] = useState(false);

  const qaCards = [
    {
      question: 'How many active tenants?',
      answer: '8 of 10 tenants are active',
      icon: <FiGlobe size={18} />,
      color: '#3b82f6',
      priority: 'info',
    },
    {
      question: 'How many active companies?',
      answer: '15 companies across 10 tenants',
      icon: <FiActivity size={18} />,
      color: '#059669',
      priority: 'info',
    },
    {
      question: 'Which modules generate the most revenue?',
      answer: 'HRMS ($84,500), FMS ($73,000), PMS ($62,000)',
      icon: <FiDollarSign size={18} />,
      color: '#059669',
      priority: 'revenue',
    },
    {
      question: 'Which tenants are at risk?',
      answer: 'Soylent Corp (expired trial), Wayne Enterprises (suspended)',
      icon: <FiAlertTriangle size={18} />,
      color: '#dc2626',
      priority: 'critical',
    },
    {
      question: 'Which users are most active?',
      answer: 'Root Admin, Jane Smith, Charlie Wilson',
      icon: <FiUsers size={18} />,
      color: '#3b82f6',
      priority: 'info',
    },
    {
      question: 'Which permissions are changing frequently?',
      answer: 'Employee Management (12 changes), Payroll (8 changes)',
      icon: <FiShield size={18} />,
      color: '#8b5cf6',
      priority: 'warning',
    },
    {
      question: 'Which modules are underutilized?',
      answer: 'BI (0 users), Procurement (45 users), AI Assistant (95 users)',
      icon: <FiBarChart2 size={18} />,
      color: '#d97706',
      priority: 'warning',
    },
    {
      question: 'What security threats exist?',
      answer: '2 active threats: Brute force attack blocked, Suspicious login from China',
      icon: <FiZap size={18} />,
      color: '#dc2626',
      priority: 'critical',
    },
    {
      question: 'Which workflows are blocked?',
      answer: '3 pending approvals stuck for >48 hours',
      icon: <FiLock size={18} />,
      color: '#d97706',
      priority: 'warning',
    },
    {
      question: 'What requires attention today?',
      answer: '2 expiring licenses, 1 module in maintenance, 3 pending impersonation requests',
      icon: <FiTerminal size={18} />,
      color: '#f43f5e',
      priority: 'critical',
    },
  ];

  const systemStatus = [
    { name: 'API Status', status: 'Operational', icon: <FiServer size={16} />, color: '#059669' },
    { name: 'Database', status: 'Healthy', icon: <FiDatabase size={16} />, color: '#059669' },
    { name: 'Queue', status: 'Processing', icon: <FiActivity size={16} />, color: '#3b82f6' },
    { name: 'Cache', status: 'Operational', icon: <FiZap size={16} />, color: '#059669' },
    { name: 'Storage', status: '68% Used', icon: <FiDatabase size={16} />, color: '#d97706' },
    { name: 'Backups', status: 'Last backup 2 hours ago', icon: <FiClock size={16} />, color: '#059669' },
  ];

  const quickStats = [
    { label: 'Active Tenants', value: '8', icon: <FiGlobe size={18} />, color: '#3b82f6' },
    { label: 'Active Companies', value: '15', icon: <FiActivity size={18} />, color: '#059669' },
    { label: 'Total Users', value: '2,847', icon: <FiUsers size={18} />, color: '#8b5cf6' },
    { label: 'Total Revenue', value: '$384K', icon: <FiDollarSign size={18} />, color: '#059669' },
    { label: 'Security Score', value: '87.6/100', icon: <FiShield size={18} />, color: '#d97706' },
    { label: 'System Health', value: '94.2%', icon: <FiHeart size={18} />, color: '#059669' },
  ];

  const getPriorityStyle = (priority) => {
    const styles = {
      info: { border: '#3b82f6' },
      revenue: { border: '#059669' },
      warning: { border: '#d97706' },
      critical: { border: '#dc2626' },
    };
    return styles[priority] || styles.info;
  };

  return (
    <div className="gc-executive-command-center">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#0f172a15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiTerminal size={22} color="#0f172a" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>Executive Command Center</h5>
            <p className="text-muted small mb-0">Interactive Q&A dashboard with instant answers and system controls</p>
          </div>
        </div>
      </div>

      <div className="gc-kpi-row row g-2 mb-4">
        {quickStats.map((stat, idx) => (
          <div key={idx} className="col-xl-2 col-lg-4 col-md-6">
            <div className="gc-card p-3 d-flex align-items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: 10 }}>{stat.label}</p>
                <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>{stat.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {qaCards.map((qa, idx) => {
          const pStyle = getPriorityStyle(qa.priority);
          return (
            <div key={idx} className="col-xl-6">
              <div className="gc-card p-3 d-flex align-items-start gap-3" style={{ borderLeft: `4px solid ${pStyle.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${qa.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: qa.color, flexShrink: 0 }}>
                  {qa.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="fw-semibold mb-1" style={{ fontSize: 13 }}>{qa.question}</p>
                  <p className="mb-0" style={{ fontSize: 14, color: qa.color, fontWeight: 600 }}>{qa.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3">System Status</h6>
            <div className="row g-2">
              {systemStatus.map((s, idx) => (
                <div key={idx} className="col-6">
                  <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: '#f8fafc' }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <div>
                      <p className="mb-0" style={{ fontSize: 11, color: '#64748b' }}>{s.name}</p>
                      <p className="fw-bold mb-0" style={{ fontSize: 12, color: s.color }}>{s.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="gc-card p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#dc2626' }}>Emergency Actions</h6>
            <div className="d-flex flex-column gap-2">
              <button className="gc-btn gc-btn-danger w-100 justify-content-center" onClick={() => setShowKillConfirm(!showKillConfirm)}>
                <FiZap size={14} /> Emergency Kill Switch
              </button>
              {showKillConfirm && (
                <div className="gc-card p-3 border border-danger text-center">
                  <p className="fw-bold text-danger mb-2" style={{ fontSize: 12 }}>Are you sure? This will disable all systems.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button className="gc-btn gc-btn-danger gc-btn-sm"><FiCheckCircle size={12} /> Confirm Kill</button>
                    <button className="gc-btn gc-btn-outline gc-btn-sm" onClick={() => setShowKillConfirm(false)}><FiXCircle size={12} /> Cancel</button>
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between gc-card p-3 border">
                <div className="d-flex align-items-center gap-2">
                  <FiToggleLeft size={16} color="#d97706" />
                  <span className="fw-semibold" style={{ fontSize: 13 }}>Emergency Maintenance Mode</span>
                </div>
                <button className="gc-toggle inactive" />
              </div>
              <button className="gc-btn gc-btn-warning w-100 justify-content-center"><FiLock size={14} /> Disable All Non-Critical Modules</button>
              <button className="gc-btn gc-btn-danger w-100 justify-content-center"><FiLogOut size={14} /> Force Logout All Users</button>
            </div>
          </div>
        </div>
      </div>

      <div className="gc-card p-4" style={{ borderLeft: '4px solid #059669', background: '#f0fdf4' }}>
        <div className="d-flex align-items-center gap-3">
          <FiMonitor size={24} color="#059669" />
          <div>
            <h6 className="fw-bold mb-1" style={{ color: '#059669' }}>All Systems are being monitored</h6>
            <p className="mb-0 text-muted small">Executive Command Center provides real-time insights and emergency controls for the entire platform. All actions are logged and require Super Admin privileges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCommandCenter;
