import React from 'react';
import { FiShield, FiEdit2, FiCopy, FiArchive, FiTrash2, FiGitBranch, FiUsers, FiPlus, FiPieChart, FiTrendingUp, FiChevronRight, FiChevronDown, FiLayers } from 'react-icons/fi';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler);

const roleHierarchy = [
  { name: 'Super Admin', level: 0, color: '#dc2626', children: [
    { name: 'Platform Admin', level: 1, color: '#ea580c', children: [
      { name: 'Tenant Admin', level: 2, color: '#d97706', children: [
        { name: 'HR Manager', level: 3, color: '#059669' },
        { name: 'Finance Manager', level: 3, color: '#3b82f6' },
        { name: 'Project Manager', level: 3, color: '#8b5cf6', children: [
          { name: 'Department Head', level: 4, color: '#6366f1', children: [
            { name: 'Team Lead', level: 5, color: '#0ea5e9', children: [
              { name: 'Employee', level: 6, color: '#64748b' },
            ]},
          ]},
        ]},
      ]},
    ]},
    { name: 'Auditor', level: 7, color: '#14b8a6' },
    { name: 'Viewer', level: 7, color: '#94a3b8' },
  ]},
];

const rolesData = [
  { name: 'Super Admin', desc: 'Full system access', level: 0, users: 3, perms: 240, status: 'Active', color: '#dc2626' },
  { name: 'Platform Admin', desc: 'Platform level management', level: 1, users: 8, perms: 200, status: 'Active', color: '#ea580c' },
  { name: 'Tenant Admin', desc: 'Tenant level administration', level: 2, users: 15, perms: 160, status: 'Active', color: '#d97706' },
  { name: 'HR Manager', desc: 'Manage HR operations', level: 3, users: 24, perms: 85, status: 'Active', color: '#059669' },
  { name: 'Finance Manager', desc: 'Manage financial operations', level: 3, users: 18, perms: 78, status: 'Active', color: '#3b82f6' },
  { name: 'Project Manager', desc: 'Manage projects', level: 3, users: 42, perms: 65, status: 'Active', color: '#8b5cf6' },
  { name: 'Department Head', desc: 'Department management', level: 4, users: 56, perms: 45, status: 'Active', color: '#6366f1' },
  { name: 'Team Lead', desc: 'Team management', level: 5, users: 128, perms: 30, status: 'Active', color: '#0ea5e9' },
  { name: 'Employee', desc: 'Basic employee access', level: 6, users: 1845, perms: 18, status: 'Active', color: '#64748b' },
  { name: 'Auditor', desc: 'Read-only audit access', level: 7, users: 12, perms: 40, status: 'Active', color: '#14b8a6' },
  { name: 'Viewer', desc: 'View-only access', level: 7, users: 89, perms: 10, status: 'Active', color: '#94a3b8' },
];

const templates = [
  { name: 'Default Employee', icon: FiUsers, color: '#64748b' },
  { name: 'Default Manager', icon: FiUsers, color: '#0ea5e9' },
  { name: 'Default HR', icon: FiShield, color: '#059669' },
  { name: 'Default Finance', icon: FiShield, color: '#3b82f6' },
  { name: 'Custom Template', icon: FiLayers, color: '#8b5cf6' },
];

const roleAssignmentData = {
  labels: ['Employee', 'Team Lead', 'Department Head', 'Project Manager', 'HR Manager', 'Finance Manager', 'Viewer', 'Auditor'],
  datasets: [{
    data: [1845, 128, 56, 42, 24, 18, 89, 12],
    backgroundColor: ['#64748b', '#0ea5e9', '#6366f1', '#8b5cf6', '#059669', '#3b82f6', '#94a3b8', '#14b8a6'],
    borderWidth: 0,
    cutout: '65%',
    borderRadius: 4,
  }],
};

const roleGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'New Roles Created',
      data: [2, 1, 3, 0, 2, 1, 4, 2, 1, 3, 2, 1],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#8b5cf6',
      borderWidth: 2,
    },
    {
      label: 'Roles Modified',
      data: [5, 8, 6, 10, 7, 9, 12, 8, 11, 14, 10, 13],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#0ea5e9',
      borderWidth: 2,
    },
  ],
};

const RoleNode = ({ node, depth }) => (
  <div className="gc-role-node" style={{ marginLeft: depth * 28 }}>
    <div className="gc-role-node-card" style={{ borderLeftColor: node.color }}>
      <div className="gc-role-node-badge" style={{ background: node.color }}>{node.name.charAt(0)}</div>
      <div className="gc-role-node-info">
        <div className="gc-role-node-name">{node.name}</div>
        <div className="gc-role-node-level">Level {node.level}</div>
      </div>
      {node.children && <FiChevronDown size={14} className="gc-role-node-chevron" />}
    </div>
    {node.children && node.children.map((child, idx) => (
      <RoleNode key={idx} node={child} depth={depth + 1} />
    ))}
  </div>
);

const RoleManagement = () => {
  return (
    <div className="gc-section role-management">
      <div className="gc-section-header">
        <div className="gc-section-header-left">
          <h3 className="gc-section-title">Role Management Center</h3>
          <p className="gc-section-subtitle">Define, assign, and govern role-based access across the platform</p>
        </div>
        <div className="gc-section-header-actions">
          <button className="gc-btn gc-btn-primary">
            <FiPlus size={16} /> Create New Role
          </button>
        </div>
      </div>

      <div className="gc-section-body">
        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiShield className="gc-card-icon" />
            <span>Role Hierarchy</span>
          </div>
          <div className="gc-card-body">
            <div className="gc-role-tree">
              {roleHierarchy.map((node, idx) => (
                <RoleNode key={idx} node={node} depth={0} />
              ))}
            </div>
          </div>
        </div>

        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiLayers className="gc-card-icon" />
            <span>Role Definitions</span>
          </div>
          <div className="gc-card-body p-0">
            <div className="gc-table-wrapper">
              <table className="gc-table">
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th>Description</th>
                    <th>Level</th>
                    <th>Users</th>
                    <th>Permissions</th>
                    <th>Status</th>
                    <th>Color</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rolesData.map((role, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="gc-cell-role">
                          <span className="gc-role-avatar" style={{ background: role.color }}>{role.name.charAt(0)}</span>
                          <span className="gc-cell-primary">{role.name}</span>
                        </div>
                      </td>
                      <td className="gc-cell-muted">{role.desc}</td>
                      <td><span className="gc-level-badge">L{role.level}</span></td>
                      <td><span className="gc-count-badge"><FiUsers size={12} /> {role.users.toLocaleString()}</span></td>
                      <td><span className="gc-count-badge gc-count-purple">{role.perms} perms</span></td>
                      <td><span className="gc-status-badge gc-status-active">{role.status}</span></td>
                      <td>
                        <span className="gc-color-swatch" style={{ background: role.color }} />
                        <span className="gc-cell-mono">{role.color}</span>
                      </td>
                      <td>
                        <div className="gc-action-btns">
                          <button className="gc-btn-icon" title="Edit"><FiEdit2 size={14} /></button>
                          <button className="gc-btn-icon" title="Clone"><FiCopy size={14} /></button>
                          <button className="gc-btn-icon" title="Archive"><FiArchive size={14} /></button>
                          <button className="gc-btn-icon gc-btn-icon-danger" title="Delete"><FiTrash2 size={14} /></button>
                          <button className="gc-btn-icon" title="Compare"><FiGitCompare size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiUsers className="gc-card-icon" />
            <span>Bulk Role Assignment</span>
          </div>
          <div className="gc-card-body">
            <div className="gc-bulk-row">
              <div className="gc-bulk-field">
                <label className="gc-field-label">Select Users</label>
                <select className="gc-select">
                  <option>All Users (2,214)</option>
                  <option>By Department</option>
                  <option>By Location</option>
                  <option>Custom Selection</option>
                </select>
              </div>
              <div className="gc-bulk-field">
                <label className="gc-field-label">Target Role</label>
                <select className="gc-select">
                  <option>Select role...</option>
                  {rolesData.map((r, i) => (
                    <option key={i}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="gc-bulk-field">
                <label className="gc-field-label">Assignment Mode</label>
                <select className="gc-select">
                  <option>Replace existing roles</option>
                  <option>Add to existing roles</option>
                </select>
              </div>
              <div className="gc-bulk-action">
                <button className="gc-btn gc-btn-primary">Apply Assignment</button>
              </div>
            </div>
          </div>
        </div>

        <div className="gc-card mb-4">
          <div className="gc-card-header">
            <FiCopy className="gc-card-icon" />
            <span>Role Templates</span>
          </div>
          <div className="gc-card-body">
            <div className="gc-templates-grid">
              {templates.map((tmpl, idx) => (
                <div key={idx} className="gc-template-card" style={{ borderTop: `3px solid ${tmpl.color}` }}>
                  <div className="gc-template-icon-wrap" style={{ color: tmpl.color }}>
                    <tmpl.icon size={24} />
                  </div>
                  <div className="gc-template-name">{tmpl.name}</div>
                  <div className="gc-template-actions">
                    <button className="gc-btn gc-btn-outline gc-btn-sm">Preview</button>
                    <button className="gc-btn gc-btn-primary gc-btn-sm">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="gc-analytics-grid">
          <div className="gc-card">
            <div className="gc-card-header">
              <FiPieChart className="gc-card-icon" />
              <span>Most Assigned Roles</span>
            </div>
            <div className="gc-card-body gc-center-chart">
              <div className="gc-chart-container gc-chart-sm">
                <Doughnut
                  data={roleAssignmentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, font: { size: 10 } } },
                    },
                    cutout: '65%',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="gc-card">
            <div className="gc-card-header">
              <FiTrendingUp className="gc-card-icon" />
              <span>Role Growth Trend</span>
            </div>
            <div className="gc-card-body">
              <div className="gc-chart-container">
                <Line
                  data={roleGrowthData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 }, padding: 16 } },
                    },
                    scales: {
                      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 11 } } },
                    },
                    interaction: { intersect: false, mode: 'index' },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
