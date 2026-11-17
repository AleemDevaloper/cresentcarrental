import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  FiBox, FiShield, FiUsers, FiLock, FiEye, FiActivity,
  FiList, FiTerminal, FiGlobe, FiLayers, FiAlertTriangle,
  FiClock, FiTrendingUp, FiPieChart, FiBarChart2, FiRefreshCw,
  FiServer, FiCloud, FiSmartphone
} from 'react-icons/fi';
import {
  getGovernanceOverview, getFeatureFlags, getLicenses,
  getGovernanceModules, getGovernanceFeatures, getGovernanceRoles,
  getGovernancePermissions, getDataAccessRules, getSecurityData,
  getSessions, getApprovalWorkflows, getAuditLogs,
  getHealthData, getAIGovernance, getCommandCenter
} from '../../../api/governance';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const GovernanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overview, modules, features, flags, licenses, roles, permissions, access, security, sessions, approvals, audit, health, ai, cmd] = await Promise.all([
        getGovernanceOverview().catch(() => null),
        getGovernanceModules().catch(() => null),
        getGovernanceFeatures().catch(() => null),
        getFeatureFlags().catch(() => null),
        getLicenses().catch(() => null),
        getGovernanceRoles().catch(() => null),
        getGovernancePermissions().catch(() => null),
        getDataAccessRules().catch(() => null),
        getSecurityData().catch(() => null),
        getSessions().catch(() => null),
        getApprovalWorkflows().catch(() => null),
        getAuditLogs().catch(() => null),
        getHealthData().catch(() => null),
        getAIGovernance().catch(() => null),
        getCommandCenter().catch(() => null),
      ]);
      setData({ overview, modules, features, flags, licenses, roles, permissions, access, security, sessions, approvals, audit, health, ai, cmd });
    } catch (err) {
      setError(err.message || 'Failed to load governance data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <FiRefreshCw size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#64748b', marginTop: 16, fontWeight: 600 }}>Loading governance dashboard...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gc-card" style={{ padding: 48, textAlign: 'center' }}>
        <FiAlertTriangle size={48} style={{ color: '#ef4444' }} />
        <h3 style={{ color: '#0f172a', marginTop: 16 }}>Failed to Load Dashboard</h3>
        <p style={{ color: '#64748b', margin: '4px 0 20px' }}>{error}</p>
        <button className="gc-btn gc-btn-primary" onClick={fetchData}>
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  }

  const modulesCount = data?.modules?.length || 24;
  const activeModules = data?.modules?.filter(m => m.status !== false)?.length || 18;
  const sandboxModules = data?.modules?.filter(m => m.sandbox)?.length || 4;
  const disabledModules = modulesCount - activeModules;
  const activeSessions = data?.sessions?.length || 142;
  const securityIncidents = data?.security?.incidents || 3;
  const permChanges = data?.permissions?.recentChanges || 12;

  const monthlyLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const moduleUsageTrend = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'HRMS',
        data: [120, 135, 142, 158, 165, 172, 180, 195, 210, 225, 240, 258],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.04)',
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'FMS',
        data: [85, 92, 98, 105, 112, 120, 128, 135, 142, 150, 158, 165],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.04)',
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'PMS',
        data: [60, 68, 72, 80, 85, 92, 100, 108, 115, 122, 130, 140],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.04)',
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'TMS',
        data: [42, 48, 55, 60, 68, 72, 78, 85, 92, 98, 105, 112],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.04)',
        tension: 0.4,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const tenantModuleDistribution = {
    labels: ['HRMS', 'FMS', 'PMS', 'DMS', 'TMS', 'CRM'],
    datasets: [
      {
        data: [92, 78, 65, 54, 48, 32],
        backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const featureAdoptionData = {
    labels: ['AI Copilot', 'Advanced Analytics', 'Automated Workflows', 'Custom Reports', 'SSO/SAML', 'API Webhooks', 'Audit Trails', 'Multi-Currency'],
    datasets: [
      {
        label: 'Adoption Rate (%)',
        data: [34, 72, 58, 81, 66, 47, 93, 41],
        backgroundColor: [
          'rgba(59,130,246,0.8)', 'rgba(16,185,129,0.8)', 'rgba(139,92,246,0.8)',
          'rgba(245,158,11,0.8)', 'rgba(6,182,212,0.8)', 'rgba(239,68,68,0.8)',
          'rgba(34,197,94,0.8)', 'rgba(168,85,247,0.8)',
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const kpiCards = [
    { label: 'Total Modules', value: modulesCount, icon: <FiBox size={22} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Active Modules', value: activeModules, icon: <FiActivity size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Sandbox Modules', value: sandboxModules, icon: <FiLayers size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Disabled Modules', value: disabledModules, icon: <FiCloud size={22} />, color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
    { label: 'Total Features', value: data?.features?.length || 186, icon: <FiList size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Total Permissions', value: data?.permissions?.length || 342, icon: <FiLock size={22} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Total Roles', value: data?.roles?.length || 28, icon: <FiUsers size={22} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Total Tenants', value: data?.overview?.tenantCount || 12, icon: <FiGlobe size={22} />, color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Total Companies', value: data?.overview?.companyCount || 48, icon: <FiServer size={22} />, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
    { label: 'Active Users', value: data?.sessions?.length ? `${activeSessions}k` : '1,424', icon: <FiSmartphone size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Security Incidents', value: securityIncidents, icon: <FiAlertTriangle size={22} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Perm Changes Today', value: permChanges, icon: <FiClock size={22} />, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  ];

  const licenseUtilization = 72;
  const securityRiskScore = 18;

  const doughnutOptions = {
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleFont: { size: 12 }, bodyFont: { size: 13 }, padding: 12, cornerRadius: 8 },
    },
    maintainAspectRatio: false,
  };

  const lineOptions = {
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6, padding: 16, font: { size: 11, weight: '600' }, color: '#64748b' } },
      tooltip: { backgroundColor: '#0f172a', titleFont: { size: 12 }, bodyFont: { size: 13 }, padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } }, beginAtZero: true },
    },
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
  };

  const barOptions = {
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleFont: { size: 12 }, bodyFont: { size: 13 }, padding: 12, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, max: 100 },
      y: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11, weight: '600' } } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="gc-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {kpi.icon}
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 2 }}>{kpi.label}</div>
            </div>
          </div>
        ))}
        <div className="gc-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FiTrendingUp size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>License Utilization</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="gc-progress">
                  <div className="gc-progress-bar" style={{ width: `${licenseUtilization}%`, background: licenseUtilization > 80 ? '#dc2626' : licenseUtilization > 60 ? '#f59e0b' : '#10b981' }}></div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{licenseUtilization}%</span>
            </div>
          </div>
        </div>
        <div className="gc-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FiShield size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>Security Risk Score</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="gc-progress">
                  <div className="gc-progress-bar" style={{ width: `${securityRiskScore}%`, background: securityRiskScore > 50 ? '#dc2626' : securityRiskScore > 25 ? '#f59e0b' : '#10b981' }}></div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{securityRiskScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="gc-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiTrendingUp size={18} style={{ color: '#3b82f6' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Module Usage Trends</h3>
            </div>
            <div className="gc-badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>12 Months</div>
          </div>
          <div style={{ height: 280 }}>
            <Line data={moduleUsageTrend} options={lineOptions} />
          </div>
        </div>
        <div className="gc-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiPieChart size={18} style={{ color: '#8b5cf6' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Tenant Module Distribution</h3>
            </div>
            <div className="gc-badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>{data?.overview?.tenantCount || 12} Tenants</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 280 }}>
            <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={tenantModuleDistribution} options={doughnutOptions} />
            </div>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['HRMS', 'FMS', 'PMS', 'DMS', 'TMS', 'CRM'].map((mod, idx) => {
                const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
                const vals = [92, 78, 65, 54, 48, 32];
                return (
                  <div key={mod} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: colors[idx], flexShrink: 0 }}></span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', flex: 1 }}>{mod}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{vals[idx]}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="gc-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiBarChart2 size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>Feature Adoption Rate</h3>
            </div>
            <div className="gc-badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
              {featureAdoptionData.datasets[0].data.reduce((a, b) => a + b, 0) / featureAdoptionData.datasets[0].data.length}% Avg
            </div>
          </div>
          <div style={{ height: 260 }}>
            <Bar data={featureAdoptionData} options={barOptions} />
          </div>
        </div>
        <div className="gc-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FiTerminal size={18} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>License Utilization</h3>
            </div>
            <div className="gc-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>{licenseUtilization}% Used</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '8px 0' }}>
            {[
              { label: 'Enterprise Licenses', total: 200, used: 178 },
              { label: 'Pro Licenses', total: 500, used: 320 },
              { label: 'Basic Licenses', total: 300, used: 210 },
              { label: 'Sandbox Licenses', total: 50, used: 28 },
              { label: 'API License Tokens', total: 1000, used: 612 },
            ].map((item, idx) => {
              const pct = Math.round((item.used / item.total) * 100);
              const barColor = pct > 85 ? '#dc2626' : pct > 65 ? '#f59e0b' : '#10b981';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.used} / {item.total}</span>
                  </div>
                  <div className="gc-progress">
                    <div className="gc-progress-bar" style={{ width: `${pct}%`, background: barColor }}></div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 600 }}>{pct}% utilized</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceDashboard;
