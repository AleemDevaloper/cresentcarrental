import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faUserShield, faExclamationTriangle, faSearch,
  faBell, faFire, faCheckCircle, faChartLine, faChartBar, faChartPie,
  faArrowRight, faPlus, faEye, faClipboardList, faUsers,
  faFileAlt, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const SecurityDashboard = () => {
  const { theme, setActiveTab } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise(r => setTimeout(r, 600));
        setStats({
          securityStaff: 85, guardsOnDuty: 32, incidentsToday: 3, openInvestigations: 7,
          emergencyAlerts: 1, fireAlarms: 2, complianceScore: 92,
          incidentsTrend: [5, 8, 4, 6, 3, 7, 5, 4, 6, 8, 3, 5],
          incidentTypes: { labels: ['Theft', 'Trespassing', 'Fights', 'Fire', 'Medical', 'Other'], data: [8, 12, 5, 3, 6, 4] },
          monthlyStats: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [12, 15, 8, 10, 6, 9] },
          recentIncidents: [
            { id: 1, type: 'Theft', location: 'Library Block', time: '2 hours ago', status: 'Under Investigation' },
            { id: 2, type: 'Trespassing', location: 'Main Gate', time: '5 hours ago', status: 'Resolved' },
            { id: 3, type: 'Medical Emergency', location: 'Hostel A', time: '8 hours ago', status: 'Resolved' },
            { id: 4, type: 'Fire Alarm', location: 'Science Building', time: '1 day ago', status: 'False Alarm' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load security dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6' };

  if (loading) {
    return <div className="container-fluid py-4"><div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}><div className="spinner-border text-primary" /></div></div>;
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <div className="text-danger mb-3" style={{ fontSize: '3rem' }}><FontAwesomeIcon icon={faExclamationTriangle} /></div>
          <h5 className="fw-bold mb-2" style={{ color: textColor }}>Failed to Load Dashboard</h5>
          <p className="text-muted mb-3 text-center">{error}</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => { setLoading(true); setError(null); setStats(null); }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const trendData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: 'Incidents', data: stats.incidentsTrend, borderColor: colors.danger, backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 }] };
  const typeData = { labels: stats.incidentTypes.labels, datasets: [{ data: stats.incidentTypes.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'], borderWidth: 0 }] };
  const monthData = { labels: stats.monthlyStats.labels, datasets: [{ label: 'Incidents', data: stats.monthlyStats.data, backgroundColor: '#ef4444', borderRadius: 6 }] };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } } },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}><FontAwesomeIcon icon={faShieldAlt} size="xl" /></div>
          <div><h4 className="fw-bold mb-0" style={{ color: textColor }}>Security Dashboard</h4><p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor campus safety and incidents</p></div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faBell} /> Emergency Alert</button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faPlus} /> Report Incident</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Security Staff', value: stats.securityStaff, icon: faUsers, color: colors.primary },
          { title: 'Guards On Duty', value: stats.guardsOnDuty, icon: faUserShield, color: colors.success },
          { title: 'Incidents Today', value: stats.incidentsToday, icon: faExclamationTriangle, color: colors.danger },
          { title: 'Open Investigations', value: stats.openInvestigations, icon: faSearch, color: colors.warning },
          { title: 'Emergency Alerts', value: stats.emergencyAlerts, icon: faBell, color: colors.danger },
          { title: 'Fire Alarms', value: stats.fireAlarms, icon: faFire, color: colors.warning },
          { title: 'Compliance Score', value: `${stats.complianceScore}%`, icon: faCheckCircle, color: colors.success },
        ].map((stat, idx) => (
          <div key={idx} className="col-xl col-lg-3 col-md-4 col-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${stat.color}1a` }}><FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '14px' }} /></div>
                </div>
                <h5 className="fw-bold mb-0" style={{ color: textColor, fontSize: '20px' }}>{stat.value}</h5>
                <span className="x-small fw-semibold" style={{ color: stat.color }}>{stat.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Incidents Trend</h6><div style={{ height: '220px' }}><Line data={trendData} options={chartOpts} /></div></div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Incident Types</h6><div style={{ height: '220px' }}><Doughnut data={typeData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} /></div></div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Monthly Stats</h6><div style={{ height: '220px' }}><Bar data={monthData} options={chartOpts} /></div></div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Incidents</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentIncidents.map((inc, idx) => (
                <div key={inc.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: inc.status === 'Resolved' ? `${colors.success}15` : inc.status === 'False Alarm' ? `${colors.info}15` : `${colors.danger}15` }}>
                    <FontAwesomeIcon icon={inc.status === 'Resolved' ? faCheckCircle : inc.status === 'False Alarm' ? faEye : faExclamationTriangle} style={{ color: inc.status === 'Resolved' ? colors.success : inc.status === 'False Alarm' ? colors.info : colors.danger, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{inc.type} - {inc.location}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{inc.time}</div>
                  </div>
                  <span className={`badge rounded-pill x-small fw-semibold ${inc.status === 'Resolved' ? 'bg-success-subtle text-success' : inc.status === 'False Alarm' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'}`}>{inc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Quick Actions</h6>
              {[
                { label: 'Report Incident', icon: faExclamationCircle, color: colors.danger, desc: 'Log new incident' },
                { label: 'Emergency Alert', icon: faBell, color: colors.warning, desc: 'Send emergency notification' },
                { label: 'Assign Duty', icon: faClipboardList, color: colors.primary, desc: 'Assign guard duty' },
                { label: 'Visitor Log', icon: faFileAlt, color: colors.info, desc: 'Manage visitor entries' },
              ].map((act, idx) => (
                <button key={idx} className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px', background: `${act.color}15` }}>
                    <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1"><div className="small fw-bold" style={{ color: textColor }}>{act.label}</div><div className="x-small text-muted">{act.desc}</div></div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-muted" style={{ fontSize: '11px', opacity: 0.5 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; } .transition { transition: all 0.25s ease; }`}</style>
    </div>
  );
};

export default SecurityDashboard;
