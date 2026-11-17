import React from 'react';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiHardDrive, FiActivity, FiArrowUp, FiArrowDown, FiToggleLeft, FiRefreshCw, FiDollarSign, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const plans = [
  { name: 'Starter', price: '$99/mo', users: '10 users', storage: '5GB storage', api: '10K API calls', modules: '2 modules', color: '#3b82f6' },
  { name: 'Professional', price: '$299/mo', users: '50 users', storage: '50GB storage', api: '50K API calls', modules: '5 modules', color: '#8b5cf6' },
  { name: 'Enterprise', price: '$999/mo', users: '500 users', storage: '1TB storage', api: '1M API calls', modules: 'All modules', color: '#059669' },
  { name: 'Corporate', price: '$1,999/mo', users: '2000 users', storage: '5TB storage', api: '5M API calls', modules: 'All modules', color: '#d97706' },
  { name: 'Custom', price: 'Negotiable', users: 'Unlimited users', storage: 'Unlimited storage', api: 'Custom API limits', modules: 'Custom modules', color: '#64748b' },
];

const licenseData = [
  { tenant: 'Acme Corp', plan: 'Enterprise', module: 'HRMS', status: 'Active', users: '245/500', storage: '340GB/1TB', expiry: '2027-06-30' },
  { tenant: 'Globex Inc', plan: 'Professional', module: 'FMS', status: 'Active', users: '34/50', storage: '22GB/50GB', expiry: '2026-12-31' },
  { tenant: 'Soylent Corp', plan: 'Starter', module: 'PMS', status: 'Active', users: '8/10', storage: '3GB/5GB', expiry: '2026-09-15' },
  { tenant: 'Initech', plan: 'Custom', module: 'All', status: 'Active', users: '150/300', storage: '120GB/500GB', expiry: '2027-01-01' },
  { tenant: 'Stark Industries', plan: 'Enterprise', module: 'All', status: 'Active', users: '420/500', storage: '780GB/1TB', expiry: '2028-03-15' },
  { tenant: 'Wayne Enterprises', plan: 'Corporate', module: 'All', status: 'Suspended', users: '0/2000', storage: '0GB/5TB', expiry: '2026-08-20' },
];

const revenueData = {
  labels: ['Starter', 'Professional', 'Enterprise', 'Corporate', 'Custom'],
  datasets: [{
    label: 'Revenue ($)',
    data: [9900, 59800, 499500, 199900, 85000],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#059669', '#d97706', '#64748b'],
    borderRadius: 6,
    barThickness: 28,
  }],
};

const licenseUsageData = {
  labels: ['Enterprise', 'Professional', 'Starter', 'Corporate', 'Custom'],
  datasets: [{
    data: [40, 20, 15, 10, 5],
    backgroundColor: ['#059669', '#8b5cf6', '#3b82f6', '#d97706', '#64748b'],
    borderWidth: 0,
    cutout: '70%',
    borderRadius: 4,
  }],
};

const LicensingManagement = () => {
  const getUsageBar = (used, total) => {
    const parseGB = (val) => {
      if (val.includes('GB')) return parseFloat(val.replace('GB', ''));
      if (val.includes('TB')) return parseFloat(val.replace('TB', '')) * 1024;
      return 0;
    };
    const pct = Math.min((parseGB(used) / parseGB(total)) * 100, 100);
    return pct;
  };

  return (
    <div className="gc-section licensing-management">
      <div className="gc-section-header">
        <h3 className="gc-section-title">Licensing Management Center</h3>
        <p className="gc-section-subtitle">Manage plans, licenses, and subscription analytics across all tenants</p>
      </div>

      <div className="gc-section-body">
        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiDollarSign className="gc-card-icon" />
            <span>Plans Overview</span>
          </div>
          <div className="gc-card-body">
            <div className="gc-plans-grid">
              {plans.map((plan, idx) => (
                <div key={idx} className="gc-plan-card" style={{ borderTop: `4px solid ${plan.color}` }}>
                  <div className="gc-plan-name">{plan.name}</div>
                  <div className="gc-plan-price" style={{ color: plan.color }}>{plan.price}</div>
                  <div className="gc-plan-features">
                    <div className="gc-plan-feature"><FiCheckCircle className="gc-feature-icon" />{plan.users}</div>
                    <div className="gc-plan-feature"><FiCheckCircle className="gc-feature-icon" />{plan.storage}</div>
                    <div className="gc-plan-feature"><FiCheckCircle className="gc-feature-icon" />{plan.api}</div>
                    <div className="gc-plan-feature"><FiCheckCircle className="gc-feature-icon" />{plan.modules}</div>
                  </div>
                  <div className="gc-plan-actions">
                    <button className="gc-btn gc-btn-primary gc-btn-sm">Upgrade</button>
                    <button className="gc-btn gc-btn-warning gc-btn-sm">Downgrade</button>
                    <button className="gc-btn gc-btn-danger gc-btn-sm">Suspend</button>
                    <button className="gc-btn gc-btn-info gc-btn-sm">Renew</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiActivity className="gc-card-icon" />
            <span>License Usage</span>
          </div>
          <div className="gc-card-body p-0">
            <div className="gc-table-wrapper">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Plan</th>
                    <th>Module</th>
                    <th>Status</th>
                    <th>Users / Allowed</th>
                    <th>Storage Used / Allowed</th>
                    <th>Expiry</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {licenseData.map((row, idx) => (
                    <tr key={idx}>
                      <td><span className="gc-cell-primary">{row.tenant}</span></td>
                      <td><span className={`gc-plan-badge gc-plan-${row.plan.toLowerCase()}`}>{row.plan}</span></td>
                      <td>{row.module}</td>
                      <td><span className={`gc-status-badge gc-status-${row.status.toLowerCase()}`}>{row.status}</span></td>
                      <td>
                        <div className="gc-progress-cell">
                          <span>{row.users}</span>
                          <div className="gc-progress-bar-track">
                            <div className="gc-progress-bar-fill" style={{ width: `${(parseInt(row.users.split('/')[0]) / parseInt(row.users.split('/')[1])) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="gc-progress-cell">
                          <span>{row.storage}</span>
                          <div className="gc-progress-bar-track">
                            <div className="gc-progress-bar-fill gc-progress-orange" style={{ width: `${getUsageBar(row.storage.split('/')[0], row.storage.split('/')[1])}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="gc-cell-mono">{row.expiry}</td>
                      <td>
                        <div className="gc-action-btns">
                          <button className="gc-btn-icon" title="Edit"><FiActivity size={14} /></button>
                          <button className="gc-btn-icon" title="Renew"><FiRefreshCw size={14} /></button>
                          <button className="gc-btn-icon gc-btn-icon-danger" title="Suspend"><FiToggleLeft size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="gc-analytics-grid">
          <div className="gc-card">
            <div className="gc-card-header">
              <FiBarChart2 className="gc-card-icon" />
              <span>Revenue Per Plan</span>
            </div>
            <div className="gc-card-body">
              <div className="gc-chart-container">
                <Bar
                  data={revenueData}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="gc-card">
            <div className="gc-card-header">
              <FiPieChart className="gc-card-icon" />
              <span>License Usage Distribution</span>
            </div>
            <div className="gc-card-body gc-center-chart">
              <div className="gc-chart-container gc-chart-sm">
                <Doughnut
                  data={licenseUsageData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true, font: { size: 11 } } },
                    },
                    cutout: '70%',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="gc-card">
            <div className="gc-card-header">
              <FiTrendingUp className="gc-card-icon" />
              <span>Plan Distribution Stats</span>
            </div>
            <div className="gc-card-body">
              <div className="gc-stats-list">
                <div className="gc-stat-row">
                  <div className="gc-stat-label"><span className="gc-dot" style={{ background: '#059669' }} />Enterprise</div>
                  <div className="gc-stat-value">40%</div>
                  <div className="gc-stat-bar"><div className="gc-stat-bar-fill" style={{ width: '40%', background: '#059669' }} /></div>
                </div>
                <div className="gc-stat-row">
                  <div className="gc-stat-label"><span className="gc-dot" style={{ background: '#8b5cf6' }} />Professional</div>
                  <div className="gc-stat-value">20%</div>
                  <div className="gc-stat-bar"><div className="gc-stat-bar-fill" style={{ width: '20%', background: '#8b5cf6' }} /></div>
                </div>
                <div className="gc-stat-row">
                  <div className="gc-stat-label"><span className="gc-dot" style={{ background: '#3b82f6' }} />Starter</div>
                  <div className="gc-stat-value">15%</div>
                  <div className="gc-stat-bar"><div className="gc-stat-bar-fill" style={{ width: '15%', background: '#3b82f6' }} /></div>
                </div>
                <div className="gc-stat-row">
                  <div className="gc-stat-label"><span className="gc-dot" style={{ background: '#d97706' }} />Corporate</div>
                  <div className="gc-stat-value">10%</div>
                  <div className="gc-stat-bar"><div className="gc-stat-bar-fill" style={{ width: '10%', background: '#d97706' }} /></div>
                </div>
                <div className="gc-stat-row">
                  <div className="gc-stat-label"><span className="gc-dot" style={{ background: '#64748b' }} />Custom</div>
                  <div className="gc-stat-value">5%</div>
                  <div className="gc-stat-bar"><div className="gc-stat-bar-fill" style={{ width: '5%', background: '#64748b' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicensingManagement;
