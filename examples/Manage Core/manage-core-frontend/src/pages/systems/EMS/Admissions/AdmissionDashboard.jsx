import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faClock, faCheckCircle, faTimesCircle,
  faUsers, faSearch, faEye, faHourglassHalf, faUserGraduate,
  faDoorOpen, faChartLine, faClipboardList, faFileAlt,
  faCalendarCheck, faTrophy, faPlus, faDownload,
  faExclamationTriangle, faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getAdmissionDashboard } from '../../../../api/ems';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const AdmissionDashboard = () => {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdmissionDashboard();
      setDashboard(data || {});
    } catch (err) {
      setError(err.message);
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const d = dashboard || {};

  const kpis = [
    { title: 'Total Applications', value: d.total_applications ?? 340, icon: faFileInvoice, color: 'primary', sub: 'All time applications' },
    { title: 'Pending', value: d.pending ?? 85, icon: faClock, color: 'warning', sub: 'Awaiting review' },
    { title: 'Approved', value: d.approved ?? 180, icon: faCheckCircle, color: 'success', sub: 'Applications approved' },
    { title: 'Rejected', value: d.rejected ?? 30, icon: faTimesCircle, color: 'danger', sub: 'Applications rejected' },
    { title: 'Waiting List', value: d.waiting_list ?? 15, icon: faHourglassHalf, color: 'info', sub: 'On hold' },
    { title: 'Under Review', value: d.under_review ?? 40, icon: faEye, color: 'primary', sub: 'Being processed' },
    { title: 'Enrolled', value: d.enrolled ?? 150, icon: faUserGraduate, color: 'success', sub: 'Confirmed enrollment' },
    { title: 'Available Seats', value: d.available_seats ?? 200, icon: faDoorOpen, color: 'info', sub: 'Open for applications' },
    { title: 'Filled Seats', value: d.filled_seats ?? 150, icon: faUsers, color: 'warning', sub: 'Seats occupied' },
  ];

  const trendData = {
    labels: d.application_trend?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Applications',
      data: d.application_trend?.data || [40, 55, 70, 85, 60, 50],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const statusData = {
    labels: ['Approved', 'Rejected', 'Pending', 'Under Review', 'Waiting List'],
    datasets: [{
      data: [
        d.approved ?? 180, d.rejected ?? 30, d.pending ?? 85,
        d.under_review ?? 40, d.waiting_list ?? 15,
      ],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b', '#6366f1', '#06b6d4'],
      borderWidth: 0,
    }]
  };

  const programData = {
    labels: d.program_wise?.labels || ['CS', 'Engineering', 'Business', 'Arts', 'Medicine'],
    datasets: [{
      label: 'Applications',
      data: d.program_wise?.data || [80, 65, 55, 40, 30],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      borderRadius: 6,
    }]
  };

  const recentApplications = d.recent_applications || [
    { id: 1, name: 'Alice Johnson', program: 'Computer Science', date: '2026-07-26', status: 'pending' },
    { id: 2, name: 'Bob Smith', program: 'Business Administration', date: '2026-07-25', status: 'approved' },
    { id: 3, name: 'Carol Williams', program: 'Electrical Engineering', date: '2026-07-24', status: 'under_review' },
    { id: 4, name: 'David Brown', program: 'Medicine', date: '2026-07-23', status: 'rejected' },
    { id: 5, name: 'Emma Davis', program: 'Computer Science', date: '2026-07-22', status: 'approved' },
  ];

  const quickActions = [
    { label: 'New Application', icon: faPlus, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Verify Documents', icon: faFileAlt, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Schedule Interview', icon: faCalendarCheck, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Generate Merit List', icon: faTrophy, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1,2,3,4,5,6,7,8,9].map(i => (
            <div className="col-md-4 col-xl" key={i}>
              <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '140px', borderRadius: '18px' }}>
                <div className="skeleton-line w-50 mb-3" style={{ height: '15px' }}></div>
                <div className="skeleton-line w-75 mb-2" style={{ height: '25px' }}></div>
                <div className="skeleton-line w-25" style={{ height: '10px' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4 g-4">
          <div className="col-lg-4"><div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div></div>
          <div className="col-lg-4"><div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div></div>
          <div className="col-lg-4"><div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${isDark ? 'text-white bg-dark' : ''}`}>
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Admissions Dashboard</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Track and manage student applications</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map(kpi => (
          <div className="col-md-4 col-xl" key={kpi.title}>
            <div className={`card border-0 shadow-sm h-100 hover-lift transition ${isDark ? 'bg-dark border-1 border-secondary' : ''}`} style={{ borderRadius: '18px' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-3 rounded-3 bg-${kpi.color}-subtle text-${kpi.color}`}>
                    <FontAwesomeIcon icon={kpi.icon} size="lg" />
                  </div>
                </div>
                <div className={`small fw-bold text-uppercase mb-1 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{kpi.title}</div>
                <div className="h3 fw-bold mb-1">{kpi.value}</div>
                <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{kpi.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {quickActions.map(qa => (
          <div className="col-6 col-md-3" key={qa.label}>
            <button className="btn w-100 py-3 rounded-4 border-0 d-flex align-items-center gap-3 hover-lift transition"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', background: qa.bg }}>
                <FontAwesomeIcon icon={qa.icon} style={{ color: qa.color, fontSize: '16px' }} />
              </div>
              <div className="small fw-bold text-start">{qa.label}</div>
            </button>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Application Trend</h5>
            <div style={{ height: '220px' }}>
              <Line data={trendData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
              }} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Status Distribution</h5>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
              <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                <Doughnut data={statusData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '72%',
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                  elements: { arc: { borderRadius: 6 } }
                }} />
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
              {statusData.labels.map((l, i) => (
                <div className="d-flex align-items-center gap-2" key={l}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusData.datasets[0].backgroundColor[i], display: 'inline-block' }} />
                  <span className="x-small fw-semibold">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Program-wise</h5>
            <div style={{ height: '220px' }}>
              <Bar data={programData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <h5 className="fw-bold mb-3">Recent Applications</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th>Name</th>
                <th>Program</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map(a => (
                <tr key={a.id}>
                  <td className="fw-semibold small">{a.name}</td>
                  <td className="small">{a.program}</td>
                  <td className="small">{a.date}</td>
                  <td>
                    <span className={`badge rounded-pill bg-${a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'danger' : a.status === 'under_review' ? 'primary' : 'warning'}-subtle text-${a.status === 'approved' ? 'success' : a.status === 'rejected' ? 'danger' : a.status === 'under_review' ? 'primary' : 'warning'}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important; }
        .transition { transition: all 0.2s ease-in-out; }
        .x-small { font-size: 11px; }
        .skeleton-card { background-color: ${isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6'}; }
        .skeleton-line { background-color: ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

export default AdmissionDashboard;
