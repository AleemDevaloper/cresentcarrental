import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTruck, faCheckCircle, faRoute, faUsers,
  faUserGraduate, faCalendarDay, faGasPump, faWrench,
  faChartPie, faChartLine, faChartBar, faArrowRight, faPlus,
  faMapMarkerAlt, faSearch, faExclamationTriangle, faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const TransportDashboard = () => {
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
          totalVehicles: 45, active: 38, onRoute: 25, drivers: 42,
          studentsUsing: 1200, todayTrips: 68, fuelConsumption: 1250, maintenanceDue: 8,
          fleetUtilization: [68, 20, 12],
          fuelTrend: [980, 1050, 1120, 1080, 1250, 1180, 1220, 1300, 1280, 1350, 1400, 1250],
          routeEfficiency: [85, 92, 78, 88, 95, 82],
          routeLabels: ['Route A', 'Route B', 'Route C', 'Route D', 'Route E', 'Route F'],
          activeTrips: [
            { id: 1, vehicle: 'BUS-001', route: 'Route A', driver: 'Ali Khan', status: 'On Time', eta: '10 min' },
            { id: 2, vehicle: 'BUS-002', route: 'Route B', driver: 'Usman Ali', status: 'Delayed', eta: '25 min' },
            { id: 3, vehicle: 'BUS-003', route: 'Route C', driver: 'Sara Khan', status: 'On Time', eta: '5 min' },
            { id: 4, vehicle: 'BUS-004', route: 'Route D', driver: 'Hassan Raza', status: 'On Time', eta: '15 min' },
            { id: 5, vehicle: 'BUS-005', route: 'Route E', driver: 'Fatima Noor', status: 'Delayed', eta: '30 min' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load transport dashboard');
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
    labels: ['In Use', 'Idle', 'Maintenance'],
    datasets: [{ data: stats.fleetUtilization, backgroundColor: ['#6366f1', '#10b981', '#f59e0b'], borderWidth: 0, hoverOffset: 10 }],
  };

  const fuelData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Fuel (L)', data: stats.fuelTrend, borderColor: colors.primary, backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }],
  };

  const routeData = {
    labels: stats.routeLabels,
    datasets: [{ label: 'Efficiency %', data: stats.routeEfficiency, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899'], borderRadius: 6 }],
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
            <FontAwesomeIcon icon={faTruck} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Transport Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor fleet, routes, and drivers</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('transport')}>
            <FontAwesomeIcon icon={faPlus} /> Add Vehicle
          </button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('transport')}>
            <FontAwesomeIcon icon={faRoute} /> Assign Route
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Vehicles', value: stats.totalVehicles, icon: faTruck, color: colors.primary },
          { title: 'Active', value: stats.active, icon: faCheckCircle, color: colors.success },
          { title: 'On Route', value: stats.onRoute, icon: faRoute, color: colors.info },
          { title: 'Drivers', value: stats.drivers, icon: faUsers, color: colors.purple },
          { title: 'Students Using', value: stats.studentsUsing, icon: faUserGraduate, color: colors.warning },
          { title: "Today's Trips", value: stats.todayTrips, icon: faCalendarDay, color: colors.primary },
          { title: 'Fuel Consumption', value: `${stats.fuelConsumption}L`, icon: faGasPump, color: colors.danger },
          { title: 'Maintenance Due', value: stats.maintenanceDue, icon: faWrench, color: colors.warning },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Fleet Utilization</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={utilizationData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Fuel Consumption</h6>
              <div style={{ height: '220px' }}>
                <Line data={fuelData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Route Efficiency</h6>
              <div style={{ height: '220px' }}>
                <Bar data={routeData} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, max: 100 } } }} />
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
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Active Trips</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.activeTrips.map((trip, idx) => (
                <div key={trip.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: trip.status === 'On Time' ? `${colors.success}15` : `${colors.danger}15` }}>
                    <FontAwesomeIcon icon={trip.status === 'On Time' ? faCheckCircle : faExclamationTriangle} style={{ color: trip.status === 'On Time' ? colors.success : colors.danger, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{trip.vehicle} - {trip.route}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{trip.driver}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className={`badge rounded-pill x-small fw-semibold ${trip.status === 'On Time' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>{trip.status}</span>
                    <div className="x-small text-muted mt-1">ETA: {trip.eta}</div>
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
                { label: 'Add Vehicle', icon: faPlus, color: colors.primary, desc: 'Register new vehicle' },
                { label: 'Assign Route', icon: faRoute, color: colors.success, desc: 'Assign vehicle to route' },
                { label: 'Track GPS', icon: faMapMarkerAlt, color: colors.info, desc: 'Live vehicle tracking' },
                { label: 'Schedule Trip', icon: faCalendarDay, color: colors.purple, desc: 'Plan new trip' },
                { label: 'Maintenance', icon: faWrench, color: colors.warning, desc: 'Service requests' },
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

export default TransportDashboard;
