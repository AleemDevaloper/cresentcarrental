import React, { useState, useEffect } from 'react';
import {
  FiMonitor, FiUsers, FiGlobe, FiSmartphone, FiTerminal, FiClock,
  FiSearch, FiFilter, FiMoreVertical, FiXCircle, FiLogOut,
  FiLock, FiUserX, FiCheckCircle, FiAlertTriangle, FiBarChart2,
  FiPieChart, FiTrendingUp, FiRefreshCw
} from 'react-icons/fi';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';
import { getSessions, terminateSession } from '../../../api/governance';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      setSessions(Array.isArray(data) ? data : data?.data ? data.data : []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (sessionId) => {
    if (!window.confirm('Terminate this session?')) return;
    try {
      await terminateSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to terminate session:', err);
    }
  };

  const overviewCards = [
    { label: 'Total Active Sessions', value: String(sessions.length), icon: <FiMonitor size={20} />, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Unique Users', value: String(new Set(sessions.map(s => s.user)).size), icon: <FiUsers size={20} />, color: '#059669', bg: '#f0fdf4' },
    { label: 'Web Sessions', value: String(sessions.filter(s => !s.device?.includes('Mobile') && !s.device?.includes('API')).length), icon: <FiGlobe size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Mobile Sessions', value: String(sessions.filter(s => s.device?.includes('Mobile') || s.device?.includes('iPhone') || s.device?.includes('Android')).length), icon: <FiSmartphone size={20} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'API Sessions', value: String(sessions.filter(s => s.device?.includes('API')).length), icon: <FiTerminal size={20} />, color: '#ec4899', bg: '#fdf2f8' },
    { label: 'Sessions Today', value: String(sessions.length), icon: <FiClock size={20} />, color: '#0ea5e9', bg: '#f0f9ff' },
  ];

const statusStyles = {
  Active: { bg: '#f0fdf4', text: '#059669', dot: '#10b981' },
  Idle: { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
};

const doughnutData = {
  labels: ['Desktop', 'Mobile', 'Tablet', 'API'],
  datasets: [{
    data: [32, 12, 3, 3],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
    borderWidth: 0,
    hoverOffset: 6,
  }]
};

const barData = {
  labels: ['Chrome', 'Edge', 'Safari', 'Firefox', 'Other'],
  datasets: [{
    label: 'Sessions',
    data: [18, 10, 8, 7, 4],
    backgroundColor: ['#3b82f6', '#059669', '#d97706', '#8b5cf6', '#ec4899'],
    borderRadius: 6,
    borderSkipped: false,
  }]
};

const lineData = {
  labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  datasets: [{
    label: 'Sessions',
    data: [12, 5, 18, 42, 35, 28, 22, 15],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    fill: true,
    tension: 0.4,
    pointBackgroundColor: '#3b82f6',
    pointRadius: 4,
    pointHoverRadius: 6,
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 11 }, color: '#64748b' }
    }
  }
};

const doughnutOptions = {
  ...chartOptions,
  cutout: '70%',
  plugins: {
    ...chartOptions.plugins,
    legend: { ...chartOptions.plugins.legend, position: 'bottom' }
  }
};

const barOptions = {
  ...chartOptions,
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } }
  },
  plugins: { legend: { display: false } }
};

const lineOptions = {
  ...chartOptions,
  scales: {
    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } }
  },
  plugins: { legend: { display: false } }
};

const SessionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const filteredSessions = sessions.filter(s =>
    s.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ip.includes(searchTerm)
  );

  const toggleSelect = (user) => {
    setSelectedSessions(prev =>
      prev.includes(user) ? prev.filter(u => u !== user) : [...prev, user]
    );
  };

  const toggleAll = () => {
    if (selectedSessions.length === filteredSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(filteredSessions.map(s => s.user));
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              <FiMonitor style={{ marginRight: 10, verticalAlign: 'middle', color: '#3b82f6' }} size={24} />
              Session Management Center
            </h2>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: 14 }}>
              Monitor and manage active user sessions across all platforms
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="gc-btn gc-btn-outline" style={{ gap: 6 }}>
              <FiRefreshCw size={15} /> Refresh
            </button>
            <button className="gc-btn gc-btn-primary" style={{ gap: 6 }}>
              <FiBarChart2 size={15} /> Analytics
            </button>
          </div>
        </div>

        <div className="gc-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {overviewCards.map((card, idx) => (
            <div key={idx} className="gc-card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{card.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="gc-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiMonitor size={18} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Active Sessions</h3>
            <span className="gc-badge" style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 11 }}>{filteredSessions.length} sessions</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                className="gc-input"
                style={{ paddingLeft: 34, width: 220 }}
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ gap: 4 }}>
              <FiFilter size={13} /> Filter
            </button>
          </div>
        </div>

        {selectedSessions.length > 0 && (
          <div style={{ padding: '10px 22px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedSessions.length} selected</span>
            <button className="gc-btn gc-btn-danger gc-btn-sm" style={{ gap: 4 }}>
              <FiXCircle size={12} /> Force Logout Selected
            </button>
            <button className="gc-btn gc-btn-warning gc-btn-sm" style={{ gap: 4 }}>
              <FiLogOut size={12} /> Terminate All
            </button>
            <button className="gc-btn gc-btn-outline gc-btn-sm" style={{ gap: 4 }}>
              <FiClock size={12} /> Suspend All Idle
            </button>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table className="gc-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedSessions.length === filteredSessions.length && filteredSessions.length > 0}
                    onChange={toggleAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Device / Browser</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Login Time</th>
                <th>Last Activity</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session, idx) => {
                const sts = statusStyles[session.status];
                return (
                  <tr key={idx}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedSessions.includes(session.user)}
                        onChange={() => toggleSelect(session.user)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td><span style={{ fontWeight: 600, fontSize: 13 }}>{session.user}</span></td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{session.role}</td>
                    <td style={{ fontSize: 13 }}>{session.device}</td>
                    <td style={{ fontSize: 13, fontFamily: 'monospace', fontSize: 12 }}>{session.ip}</td>
                    <td style={{ fontSize: 13 }}>{session.location}</td>
                    <td style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{session.loginTime}</td>
                    <td style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{session.lastActivity}</td>
                    <td>
                      <span className="gc-badge" style={{ background: sts.bg, color: sts.text, fontSize: 11, gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: sts.dot, display: 'inline-block' }}></span>
                        {session.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          className="gc-btn gc-btn-outline gc-btn-sm"
                          style={{ gap: 4 }}
                          onClick={() => setDropdownOpen(dropdownOpen === idx ? null : idx)}
                        >
                          <FiMoreVertical size={13} /> Actions
                        </button>
                        {dropdownOpen === idx && (
                          <div
                            style={{
                              position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'white',
                              borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
                              padding: 6, zIndex: 100, minWidth: 180
                            }}
                            onClick={() => setDropdownOpen(null)}
                          >
                            <button className="gc-btn gc-btn-sm" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: '#dc2626', marginBottom: 2 }}>
                              <FiLogOut size={13} style={{ marginRight: 8 }} /> Force Logout
                            </button>
                            <button className="gc-btn gc-btn-sm" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: '#d97706', marginBottom: 2 }}>
                              <FiXCircle size={13} style={{ marginRight: 8 }} /> Terminate Session
                            </button>
                            <button className="gc-btn gc-btn-sm" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: '#3b82f6', marginBottom: 2 }}>
                              <FiClock size={13} style={{ marginRight: 8 }} /> Suspend Access
                            </button>
                            <button className="gc-btn gc-btn-sm" style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: '#8b5cf6' }}>
                              <FiLock size={13} style={{ marginRight: 8 }} /> Lock User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <div className="gc-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
              <FiPieChart size={16} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Sessions by Device Type</h3>
          </div>
          <div style={{ maxWidth: 240, margin: '0 auto' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="gc-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <FiBarChart2 size={16} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Sessions by Browser</h3>
          </div>
          <Bar data={barData} options={barOptions} height={200} />
        </div>

        <div className="gc-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <FiTrendingUp size={16} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Peak Login Times</h3>
          </div>
          <Line data={lineData} options={lineOptions} height={200} />
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
