import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity, faBuilding, faDoorOpen, faChalkboardTeacher,
  faFlask, faCalendarCheck, faWrench, faMicrochip,
  faChartPie, faChartLine, faChartBar, faArrowRight, faPlus,
  faExclamationTriangle, faTools
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CampusDashboard = () => {
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
          campuses: 3, buildings: 25, rooms: 320, smartClassrooms: 45,
          labs: 60, activeBookings: 28, maintenanceRequests: 15, iotDevices: 1200,
          roomUtilization: [65, 20, 15],
          energyUsage: [4500, 4200, 4800, 4100, 4600, 4400, 4700, 4300, 4900, 4500, 4800, 5000],
          maintenanceByType: [8, 5, 12, 6],
          maintLabels: ['Electrical', 'Plumbing', 'HVAC', 'Structural'],
          recentBookings: [
            { id: 1, room: 'Lab 101', purpose: 'AI Workshop', bookedBy: 'Dr. Ali Khan', time: '10:00-12:00' },
            { id: 2, room: 'Smart Class A', purpose: 'Guest Lecture', bookedBy: 'Prof. Sara', time: '14:00-16:00' },
            { id: 3, room: 'Seminar Hall', purpose: 'Conference', bookedBy: 'Admin', time: '09:00-17:00' },
            { id: 4, room: 'CS Lab 2', purpose: 'Lab Session', bookedBy: 'Dr. Usman', time: '11:00-13:00' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load campus dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6' };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </div>
    );
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

  const utilizationData = {
    labels: ['In Use', 'Available', 'Maintenance'],
    datasets: [{ data: stats.roomUtilization, backgroundColor: ['#6366f1', '#10b981', '#f59e0b'], borderWidth: 0 }],
  };

  const energyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'kWh', data: stats.energyUsage, borderColor: colors.warning, backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4 }],
  };

  const maintData = {
    labels: stats.maintLabels,
    datasets: [{ label: 'Requests', data: stats.maintenanceByType, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'], borderRadius: 6 }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } } },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}>
            <FontAwesomeIcon icon={faUniversity} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Campus Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor facilities, bookings, and energy usage</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faCalendarCheck} /> Book Room</button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faPlus} /> Report Issue</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Campuses', value: stats.campuses, icon: faUniversity, color: colors.primary },
          { title: 'Buildings', value: stats.buildings, icon: faBuilding, color: colors.info },
          { title: 'Rooms', value: stats.rooms, icon: faDoorOpen, color: colors.purple },
          { title: 'Smart Classrooms', value: stats.smartClassrooms, icon: faChalkboardTeacher, color: colors.success },
          { title: 'Labs', value: stats.labs, icon: faFlask, color: colors.warning },
          { title: 'Active Bookings', value: stats.activeBookings, icon: faCalendarCheck, color: colors.primary },
          { title: 'Maintenance Req.', value: stats.maintenanceRequests, icon: faWrench, color: colors.danger },
          { title: 'IoT Devices', value: stats.iotDevices.toLocaleString(), icon: faMicrochip, color: colors.info },
        ].map((stat, idx) => (
          <div key={idx} className="col-xl col-lg-3 col-md-4 col-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${stat.color}1a` }}>
                    <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '14px' }} />
                  </div>
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
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Room Utilization</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={utilizationData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Energy Usage (kWh)</h6>
              <div style={{ height: '220px' }}><Line data={energyData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Maintenance Requests</h6>
              <div style={{ height: '220px' }}><Bar data={maintData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Facility Bookings</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View Calendar <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentBookings.map((b, idx) => (
                <div key={b.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: `${colors.info}15` }}>
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ color: colors.info, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{b.room}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{b.purpose} - {b.bookedBy}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className="badge rounded-pill bg-primary-subtle text-primary x-small">{b.time}</span>
                  </div>
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
                { label: 'Book Room', icon: faCalendarCheck, color: colors.primary, desc: 'Reserve facility' },
                { label: 'Report Issue', icon: faTools, color: colors.warning, desc: 'Maintenance request' },
                { label: 'Add Building', icon: faBuilding, color: colors.success, desc: 'Register new building' },
                { label: 'IoT Dashboard', icon: faMicrochip, color: colors.info, desc: 'Monitor devices' },
              ].map((act, idx) => (
                <button key={idx} className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px', background: `${act.color}15` }}>
                    <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{act.label}</div>
                    <div className="x-small text-muted">{act.desc}</div>
                  </div>
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

export default CampusDashboard;
