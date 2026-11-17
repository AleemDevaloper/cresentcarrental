import React, { useState } from 'react';
import { FiHeart, FiActivity, FiUsers, FiAlertTriangle, FiMonitor, FiDatabase, FiServer, FiClock, FiBarChart2, FiTrendingUp, FiDollarSign, FiCheckCircle, FiXCircle, FiCpu } from 'react-icons/fi';

const ModuleHealthMonitoring = () => {
  const modules = [
    { name: 'HRMS', status: 'Active', health: 94, perf: 96, apiUsage: '12,450 req/day', storage: '4.2 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 245, errRate: 0.3, failedJobs: 0, adoption: 92, revenue: 84500, lastChecked: '2 min ago' },
    { name: 'PMS', status: 'Active', health: 88, perf: 91, apiUsage: '8,200 req/day', storage: '2.8 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 312, errRate: 0.8, failedJobs: 1, adoption: 85, revenue: 62000, lastChecked: '5 min ago' },
    { name: 'FMS', status: 'Active', health: 91, perf: 93, apiUsage: '6,700 req/day', storage: '3.1 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 198, errRate: 0.2, failedJobs: 0, adoption: 78, revenue: 73000, lastChecked: '3 min ago' },
    { name: 'DMS', status: 'Active', health: 85, perf: 88, apiUsage: '3,800 req/day', storage: '5.6 GB', dbHealth: 'Fair', queueHealth: 'Healthy', respTime: 420, errRate: 1.2, failedJobs: 2, adoption: 65, revenue: 31500, lastChecked: '4 min ago' },
    { name: 'CRM', status: 'Beta', health: 72, perf: 76, apiUsage: '2,100 req/day', storage: '1.5 GB', dbHealth: 'Fair', queueHealth: 'Warning', respTime: 510, errRate: 2.1, failedJobs: 3, adoption: 45, revenue: 18000, lastChecked: '7 min ago' },
    { name: 'Inventory', status: 'Active', health: 79, perf: 82, apiUsage: '4,500 req/day', storage: '2.2 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 380, errRate: 1.5, failedJobs: 1, adoption: 58, revenue: 28000, lastChecked: '6 min ago' },
    { name: 'Procurement', status: 'Sandbox', health: 55, perf: 58, apiUsage: '450 req/day', storage: '0.8 GB', dbHealth: 'Fair', queueHealth: 'Warning', respTime: 650, errRate: 3.8, failedJobs: 5, adoption: 12, revenue: 5000, lastChecked: '10 min ago' },
    { name: 'Helpdesk', status: 'Active', health: 90, perf: 92, apiUsage: '5,200 req/day', storage: '1.8 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 280, errRate: 0.5, failedJobs: 0, adoption: 88, revenue: 22500, lastChecked: '2 min ago' },
    { name: 'KnowledgeBase', status: 'Maintenance', health: 45, perf: 42, apiUsage: '320 req/day', storage: '3.5 GB', dbHealth: 'Poor', queueHealth: 'Down', respTime: 1200, errRate: 8.5, failedJobs: 12, adoption: 28, revenue: 8000, lastChecked: '15 min ago' },
    { name: 'BI', status: 'Disabled', health: 0, perf: 0, apiUsage: '0 req/day', storage: '0 GB', dbHealth: 'N/A', queueHealth: 'N/A', respTime: 0, errRate: 0, failedJobs: 0, adoption: 0, revenue: 0, lastChecked: '1 day ago' },
    { name: 'Workflow', status: 'Active', health: 83, perf: 86, apiUsage: '2,800 req/day', storage: '1.2 GB', dbHealth: 'Good', queueHealth: 'Healthy', respTime: 350, errRate: 0.9, failedJobs: 0, adoption: 72, revenue: 15000, lastChecked: '4 min ago' },
    { name: 'AIAssistant', status: 'Beta', health: 60, perf: 65, apiUsage: '1,900 req/day', storage: '0.9 GB', dbHealth: 'Fair', queueHealth: 'Warning', respTime: 780, errRate: 4.2, failedJobs: 3, adoption: 18, revenue: 3500, lastChecked: '8 min ago' },
    { name: 'DMS-vault', status: 'Archived', health: 0, perf: 0, apiUsage: '0 req/day', storage: '0 GB', dbHealth: 'N/A', queueHealth: 'N/A', respTime: 0, errRate: 0, failedJobs: 0, adoption: 0, revenue: 0, lastChecked: '30 days ago' },
  ];

  const alerts = [
    { module: 'KnowledgeBase', health: 45, issue: 'Maintenance mode', critical: true },
    { module: 'BI', health: 0, issue: 'Disabled module', critical: true },
    { module: 'Inventory', health: 79, issue: 'Performance degrading', critical: false },
    { module: 'Procurement', health: 55, issue: 'Sandbox environment', critical: false },
  ];

  const getHealthColor = (score) => {
    if (score > 80) return '#059669';
    if (score > 50) return '#d97706';
    if (score > 0) return '#dc2626';
    return '#64748b';
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: { bg: '#05966915', text: '#059669' },
      Beta: { bg: '#3b82f615', text: '#3b82f6' },
      Sandbox: { bg: '#d9770615', text: '#d97706' },
      Maintenance: { bg: '#8b5cf615', text: '#8b5cf6' },
      Disabled: { bg: '#dc262615', text: '#dc2626' },
      Archived: { bg: '#64748b15', text: '#64748b' },
    };
    const c = colors[status] || { bg: '#f1f5f9', text: '#334155' };
    return <span className="gc-badge" style={{ background: c.bg, color: c.text, fontSize: 10 }}>{status}</span>;
  };

  const overviewCards = [
    { label: 'Average Health Score', value: '78.5%', icon: <FiHeart size={20} />, color: getHealthColor(78.5) },
    { label: 'Performance Score', value: '84.2%', icon: <FiActivity size={20} />, color: '#059669' },
    { label: 'Usage Score', value: '71.3%', icon: <FiUsers size={20} />, color: '#3b82f6' },
    { label: 'Risk Score', value: '12.4%', icon: <FiAlertTriangle size={20} />, color: getHealthColor(100 - 12.4) },
  ];

  const healthTrendData = Array.from({ length: 30 }, (_, i) => ({ day: i + 1, score: 70 + Math.round(Math.random() * 25) }));

  return (
    <div className="gc-module-health">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#05966915', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiHeart size={22} color="#059669" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>Module Health Monitoring</h5>
            <p className="text-muted small mb-0">Real-time health, performance, and risk monitoring for all modules</p>
          </div>
        </div>
      </div>

      <div className="gc-kpi-row row g-3 mb-4">
        {overviewCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-lg-6">
            <div className="gc-card p-3 d-flex align-items-center gap-3">
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              <div>
                <p className="text-muted small mb-0">{card.label}</p>
                <h4 className="fw-bold mb-0" style={{ fontSize: 24 }}>{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gc-card p-4 mb-4">
        <h6 className="fw-bold mb-3">Module Health Overview</h6>
        <div className="table-responsive">
          <table className="gc-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Module</th><th>Status</th><th>Health Score</th><th>Performance</th><th>API Usage</th><th>Storage</th><th>DB Health</th><th>Queue Health</th><th>Response Time</th><th>Error Rate</th><th>Failed Jobs</th><th>Adoption</th><th>Revenue</th><th>Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, idx) => (
                <tr key={idx}>
                  <td><span className="fw-semibold" style={{ fontSize: 12 }}>{mod.name}</span></td>
                  <td>{getStatusBadge(mod.status)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="gc-progress" style={{ width: 60 }}>
                        <div className="gc-progress-bar" style={{ width: `${mod.health}%`, background: getHealthColor(mod.health) }} />
                      </div>
                      <span className="fw-bold" style={{ color: getHealthColor(mod.health), fontSize: 11 }}>{mod.health}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11 }}>{mod.perf}%</td>
                  <td style={{ fontSize: 11 }}>{mod.apiUsage}</td>
                  <td style={{ fontSize: 11 }}>{mod.storage}</td>
                  <td>
                    <span className={`gc-badge`} style={{ background: mod.dbHealth === 'Good' ? '#05966915' : mod.dbHealth === 'Fair' ? '#d9770615' : mod.dbHealth === 'Poor' ? '#dc262615' : '#f1f5f9', color: mod.dbHealth === 'Good' ? '#059669' : mod.dbHealth === 'Fair' ? '#d97706' : mod.dbHealth === 'Poor' ? '#dc2626' : '#64748b', fontSize: 10 }}>{mod.dbHealth}</span>
                  </td>
                  <td>
                    <span className={`gc-badge`} style={{ background: mod.queueHealth === 'Healthy' ? '#05966915' : mod.queueHealth === 'Warning' ? '#d9770615' : mod.queueHealth === 'Down' ? '#dc262615' : '#f1f5f9', color: mod.queueHealth === 'Healthy' ? '#059669' : mod.queueHealth === 'Warning' ? '#d97706' : mod.queueHealth === 'Down' ? '#dc2626' : '#64748b', fontSize: 10 }}>{mod.queueHealth}</span>
                  </td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace' }}>{mod.respTime}ms</td>
                  <td style={{ fontSize: 11 }}>{mod.errRate}%</td>
                  <td style={{ fontSize: 11 }}>{mod.failedJobs}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="gc-progress" style={{ width: 40 }}>
                        <div className="gc-progress-bar" style={{ width: `${mod.adoption}%`, background: mod.adoption > 60 ? '#059669' : mod.adoption > 20 ? '#d97706' : '#dc2626' }} />
                      </div>
                      <span style={{ fontSize: 11 }}>{mod.adoption}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 11 }}>${mod.revenue.toLocaleString()}</td>
                  <td style={{ fontSize: 11 }}>{mod.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="gc-card p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiTrendingUp size={16} color="#059669" />
              <h6 className="fw-bold mb-0">Health Trends (Last 30 Days)</h6>
            </div>
            <div className="d-flex align-items-end gap-1" style={{ height: 120 }}>
              {healthTrendData.map((d, idx) => (
                <div key={idx} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                  <div className="gc-progress-bar" style={{
                    height: `${d.score}%`,
                    width: '100%',
                    background: d.score > 80 ? '#059669' : d.score > 50 ? '#d97706' : '#dc2626',
                    borderRadius: '2px 2px 0 0',
                    transition: 'height 0.3s',
                  }} />
                </div>
              ))}
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span style={{ fontSize: 10, color: '#94a3b8' }}>Day 1</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>Day 15</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>Day 30</span>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="gc-card p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiBarChart2 size={16} color="#3b82f6" />
              <h6 className="fw-bold mb-0">Module Adoption Rates</h6>
            </div>
            {[
              { name: 'HRMS', val: 92 }, { name: 'Helpdesk', val: 88 }, { name: 'PMS', val: 85 },
              { name: 'FMS', val: 78 }, { name: 'Workflow', val: 72 }, { name: 'DMS', val: 65 },
              { name: 'Inventory', val: 58 }, { name: 'CRM', val: 45 }, { name: 'KnowledgeBase', val: 28 },
              { name: 'AIAssistant', val: 18 }, { name: 'Procurement', val: 12 }, { name: 'BI', val: 0 },
            ].map((m, idx) => (
              <div key={idx} className="d-flex align-items-center gap-2 mb-1">
                <span style={{ fontSize: 11, width: 85 }}>{m.name}</span>
                <div className="gc-progress flex-grow-1">
                  <div className="gc-progress-bar" style={{ width: `${m.val}%`, background: m.val > 60 ? '#059669' : m.val > 20 ? '#d97706' : '#dc2626' }} />
                </div>
                <span className="fw-bold" style={{ fontSize: 11, width: 30, textAlign: 'right' }}>{m.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gc-card p-4" style={{ borderLeft: '4px solid #dc2626' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <FiAlertTriangle size={18} color="#dc2626" />
          <h6 className="fw-bold mb-0">Modules Needing Attention</h6>
        </div>
        <div className="row g-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="col-xl-3 col-lg-6">
              <div className="gc-card p-3 border d-flex align-items-center gap-3" style={{ borderColor: alert.critical ? '#dc2626' : '#d97706' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: alert.critical ? '#dc262615' : '#d9770615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCpu size={18} color={alert.critical ? '#dc2626' : '#d97706'} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ fontSize: 14 }}>{alert.module}</h6>
                  <p className="mb-0" style={{ fontSize: 12, color: alert.critical ? '#dc2626' : '#d97706' }}>
                    Health {alert.health}% - {alert.issue}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleHealthMonitoring;
