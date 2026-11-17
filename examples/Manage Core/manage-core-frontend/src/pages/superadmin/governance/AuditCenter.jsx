import React, { useState, useEffect } from 'react';
import { FiClock, FiUsers, FiLogIn, FiLogOut, FiPlusCircle, FiEdit3, FiTrash2, FiDownload, FiSearch, FiFilter, FiBarChart2, FiPieChart, FiTrendingUp, FiActivity, FiMonitor, FiGlobe, FiShield } from 'react-icons/fi';
import { getAuditLogs } from '../../../api/governance';

const AuditCenter = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs();
      setAuditLogs(Array.isArray(data) ? data : data?.data ? data.data : []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = ['Login', 'Logout', 'Create', 'Edit', 'Delete', 'Export', 'Permission Change'];

  const kpis = [
    { label: 'Total Events Today', value: '342', icon: <FiActivity size={20} />, color: '#3b82f6' },
    { label: 'Logins', value: '89', icon: <FiLogIn size={20} />, color: '#059669' },
    { label: 'Logouts', value: '76', icon: <FiLogOut size={20} />, color: '#64748b' },
    { label: 'Creates', value: '48', icon: <FiPlusCircle size={20} />, color: '#8b5cf6' },
    { label: 'Edits', value: '62', icon: <FiEdit3 size={20} />, color: '#d97706' },
    { label: 'Deletes', value: '12', icon: <FiTrash2 size={20} />, color: '#dc2626' },
    { label: 'Exports', value: '18', icon: <FiDownload size={20} />, color: '#14b8a6' },
    { label: 'Permission Changes', value: '15', icon: <FiShield size={20} />, color: '#f43f5e' },
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesEvent = eventFilter === 'All' || log.eventType === eventFilter;
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const getEventIcon = (type) => {
    const icons = {
      Login: <FiLogIn size={14} color="#059669" />,
      Logout: <FiLogOut size={14} color="#64748b" />,
      Create: <FiPlusCircle size={14} color="#8b5cf6" />,
      Edit: <FiEdit3 size={14} color="#d97706" />,
      Delete: <FiTrash2 size={14} color="#dc2626" />,
      Export: <FiDownload size={14} color="#14b8a6" />,
      'Permission Change': <FiShield size={14} color="#f43f5e" />,
    };
    return icons[type] || <FiActivity size={14} />;
  };

  const getEventBadge = (type) => {
    const colors = {
      Login: { bg: '#05966915', text: '#059669' },
      Logout: { bg: '#64748b15', text: '#64748b' },
      Create: { bg: '#8b5cf615', text: '#8b5cf6' },
      Edit: { bg: '#d9770615', text: '#d97706' },
      Delete: { bg: '#dc262615', text: '#dc2626' },
      Export: { bg: '#14b8a615', text: '#14b8a6' },
      'Permission Change': { bg: '#f43f5e15', text: '#f43f5e' },
    };
    const c = colors[type] || { bg: '#f1f5f9', text: '#334155' };
    return <span className="gc-badge" style={{ background: c.bg, color: c.text, fontSize: 10 }}>{type}</span>;
  };

  const eventCounts = eventTypes.map(type => ({ label: type, count: auditLogs.filter(l => l.eventType === type).length }));

  return (
    <div className="gc-audit-center">
      <div className="gc-section-header d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#3b82f615', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiClock size={22} color="#3b82f6" />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: 18 }}>Audit Center</h5>
            <p className="text-muted small mb-0">Comprehensive audit logging, monitoring, and analytics</p>
          </div>
        </div>
      </div>

      <div className="gc-kpi-row row g-2 mb-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-xl-3 col-lg-6">
            <div className="gc-card p-3 d-flex align-items-center gap-3">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: 11 }}>{kpi.label}</p>
                <h5 className="fw-bold mb-0" style={{ fontSize: 20 }}>{kpi.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gc-card p-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <h6 className="fw-bold mb-0">Audit Log</h6>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="d-flex align-items-center bg-white border rounded-3 px-3" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <FiSearch size={14} className="text-muted" />
              <input
                type="text"
                className="gc-input border-0"
                style={{ width: 200, fontSize: 12, padding: '6px 10px' }}
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="gc-input" style={{ width: 150, fontSize: 12, padding: '6px 10px' }} value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
              <option value="All">All Events</option>
              {eventTypes.map(et => <option key={et} value={et}>{et}</option>)}
            </select>
            <input type="date" className="gc-input" style={{ width: 150, fontSize: 12, padding: '6px 10px' }} />
            <button className="gc-btn gc-btn-primary gc-btn-sm"><FiDownload size={13} /> Export</button>
          </div>
        </div>
        <div className="table-responsive" style={{ maxHeight: 500, overflowY: 'auto' }}>
          <table className="gc-table">
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr>
                <th>Timestamp</th><th>User</th><th>Role</th><th>Event Type</th><th>Module</th><th>Description</th><th>IP Address</th><th>Location</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td><span className="fw-semibold" style={{ fontSize: 12 }}>{log.user}</span></td>
                  <td style={{ fontSize: 11 }}>{log.role}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      {getEventIcon(log.eventType)}
                      {getEventBadge(log.eventType)}
                    </div>
                  </td>
                  <td><span className="gc-badge" style={{ background: '#f1f5f9', color: '#334155', fontSize: 10 }}>{log.module}</span></td>
                  <td style={{ fontSize: 12, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.description}</td>
                  <td style={{ fontSize: 11, fontFamily: 'monospace' }}>{log.ip}</td>
                  <td style={{ fontSize: 11 }}>{log.location}</td>
                  <td>
                    <button className="gc-btn gc-btn-outline gc-btn-sm"><FiActivity size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="gc-card p-4">
        <h6 className="fw-bold mb-3">Audit Analytics</h6>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="gc-card p-3 border">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiBarChart2 size={16} color="#3b82f6" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Most Active Users</span>
              </div>
              {[
                { name: 'Root Admin', count: 85, color: '#3b82f6' },
                { name: 'Jane Smith', count: 62, color: '#059669' },
                { name: 'Bob Johnson', count: 48, color: '#d97706' },
                { name: 'Charlie Wilson', count: 41, color: '#8b5cf6' },
                { name: 'Alice Brown', count: 35, color: '#14b8a6' },
              ].map((u, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: 11, width: 80 }}>{u.name}</span>
                  <div className="gc-progress flex-grow-1">
                    <div className="gc-progress-bar" style={{ width: `${(u.count / 85) * 100}%`, background: u.color }} />
                  </div>
                  <span className="fw-bold" style={{ fontSize: 11, width: 25, textAlign: 'right' }}>{u.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="gc-card p-3 border">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiPieChart size={16} color="#8b5cf6" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Events by Type</span>
              </div>
              {eventCounts.map((item, idx) => {
                const colors = ['#3b82f6', '#059669', '#8b5cf6', '#d97706', '#dc2626', '#14b8a6', '#f43f5e'];
                const total = eventCounts.reduce((s, e) => s + e.count, 0);
                return (
                  <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: colors[idx] }} />
                    <span style={{ fontSize: 12, flex: 1 }}>{item.label}</span>
                    <span className="fw-bold" style={{ fontSize: 12 }}>{item.count}</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>({Math.round((item.count / total) * 100)}%)</span>
                  </div>
                );
              })}
              <div className="gc-progress mt-2">
                <div className="gc-progress-bar" style={{ width: '100%', height: 8, background: 'linear-gradient(90deg, #3b82f6 0%, #059669 20%, #8b5cf6 35%, #d97706 50%, #dc2626 60%, #14b8a6 75%, #f43f5e 100%)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="gc-card p-3 border">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FiTrendingUp size={16} color="#059669" />
                <span className="fw-semibold" style={{ fontSize: 13 }}>Events Timeline</span>
              </div>
              {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'].map((time, idx) => {
                const values = [12, 8, 45, 78, 120, 65, 14];
                return (
                  <div key={idx} className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ fontSize: 10, width: 40 }}>{time}</span>
                    <div className="gc-progress flex-grow-1">
                      <div className="gc-progress-bar" style={{ width: `${(values[idx] / 120) * 100}%`, background: idx === 6 ? '#3b82f6' : '#059669' }} />
                    </div>
                    <span style={{ fontSize: 11, width: 30, textAlign: 'right' }}>{values[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCenter;
