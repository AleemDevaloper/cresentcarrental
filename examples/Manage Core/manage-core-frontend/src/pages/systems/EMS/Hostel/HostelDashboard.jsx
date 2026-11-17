import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faBed, faDoorOpen, faUserGraduate,
  faUsers, faClipboardList, faSignInAlt, faSignOutAlt,
  faWrench, faChartPie, faChartBar, faChartLine,
  faArrowRight, faPlus, faKey, faExclamationTriangle, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const HostelDashboard = () => {
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
          totalHostels: 6, totalRooms: 240, totalBeds: 720, occupied: 580, available: 140,
          studentsLiving: 560, staff: 48, todayCheckIns: 12, todayCheckOuts: 8, pendingMaintenance: 15,
          occupancyRate: 80.5,
          roomTypes: {
            labels: ['Single', 'Double', 'Triple', 'Dormitory'],
            data: [40, 80, 60, 60],
          },
          monthlyCheckins: [45, 52, 38, 65, 48, 55, 42, 58, 62, 50, 44, 55],
          recentActivities: [
            { id: 1, action: 'Room Allocated', student: 'Ali Ahmed', room: 'H1-201', time: '10 min ago' },
            { id: 2, action: 'Check-Out', student: 'Sara Khan', room: 'H2-105', time: '30 min ago' },
            { id: 3, action: 'Maintenance Request', student: 'Block A', room: 'Room 301', time: '1 hour ago' },
            { id: 4, action: 'New Allotment', student: 'Usman Ali', room: 'H3-401', time: '2 hours ago' },
            { id: 5, action: 'Visitor Entry', student: 'Fatima Noor', room: 'H1-202', time: '3 hours ago' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load hostel dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6', pink: '#ec4899' };

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

  const occupancyData = {
    labels: ['Occupied', 'Available'],
    datasets: [{ data: [stats.occupied, stats.available], backgroundColor: ['#6366f1', '#10b981'], borderWidth: 0, hoverOffset: 10 }],
  };

  const roomTypeData = {
    labels: stats.roomTypes.labels,
    datasets: [{ label: 'Rooms', data: stats.roomTypes.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'], borderRadius: 6 }],
  };

  const checkinData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Check-Ins', data: stats.monthlyCheckins, borderColor: colors.primary, backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }],
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
            <FontAwesomeIcon icon={faBuilding} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Hostel Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor hostels, rooms, and allocations</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('hostel')}>
            <FontAwesomeIcon icon={faKey} /> Allocate Room
          </button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('hostel')}>
            <FontAwesomeIcon icon={faPlus} /> Add Hostel
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Hostels', value: stats.totalHostels, icon: faBuilding, color: colors.primary },
          { title: 'Total Rooms', value: stats.totalRooms, icon: faDoorOpen, color: colors.info },
          { title: 'Total Beds', value: stats.totalBeds, icon: faBed, color: colors.purple },
          { title: 'Occupied', value: stats.occupied, icon: faUserGraduate, color: colors.primary },
          { title: 'Available', value: stats.available, icon: faBed, color: colors.success },
          { title: 'Students Living', value: stats.studentsLiving, icon: faUsers, color: colors.warning },
          { title: 'Staff', value: stats.staff, icon: faClipboardList, color: colors.pink },
          { title: "Today's Check-Ins", value: stats.todayCheckIns, icon: faSignInAlt, color: colors.success },
          { title: "Today's Check-Outs", value: stats.todayCheckOuts, icon: faSignOutAlt, color: colors.danger },
          { title: 'Pending Maintenance', value: stats.pendingMaintenance, icon: faWrench, color: colors.warning },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Occupancy Rate ({stats.occupancyRate}%)</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={occupancyData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Room Types</h6>
              <div style={{ height: '220px' }}>
                <Bar data={roomTypeData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Monthly Check-Ins</h6>
              <div style={{ height: '220px' }}>
                <Line data={checkinData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Activities</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentActivities.map((act, idx) => (
                <div key={act.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: `${colors.info}15` }}>
                    <FontAwesomeIcon icon={faClipboardList} style={{ color: colors.info, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{act.action}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{act.student} - {act.room}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="x-small text-muted">{act.time}</div>
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
                { label: 'Allocate Room', icon: faKey, color: colors.primary, desc: 'Assign room to student' },
                { label: 'Check-In Student', icon: faSignInAlt, color: colors.success, desc: 'Process check-in' },
                { label: 'Check-Out', icon: faSignOutAlt, color: colors.danger, desc: 'Process check-out' },
                { label: 'Maintenance Request', icon: faWrench, color: colors.warning, desc: 'Report issue' },
                { label: 'Add Hostel', icon: faPlus, color: colors.purple, desc: 'Register new hostel' },
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

export default HostelDashboard;
