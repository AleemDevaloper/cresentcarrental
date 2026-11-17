import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faChalkboardTeacher, faUserTie, faUserCheck,
  faUserClock, faLayerGroup, faBriefcase, faUserPlus,
  faGift, faCake, faArrowUp, faSearch, faFilter,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getStaffDashboard } from '../../../../api/ems';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const StaffDashboard = () => {
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
      const data = await getStaffDashboard();
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
    { title: 'Total Employees', value: d.total_employees ?? 250, icon: faUsers, color: 'primary', sub: 'All staff members' },
    { title: 'Teachers', value: d.teachers ?? 120, icon: faChalkboardTeacher, color: 'success', sub: 'Faculty members' },
    { title: 'Non-Teaching', value: d.non_teaching ?? 80, icon: faUserTie, color: 'info', sub: 'Support staff' },
    { title: 'Active', value: d.active ?? 220, icon: faUserCheck, color: 'success', sub: 'Currently employed' },
    { title: 'On Leave', value: d.on_leave ?? 12, icon: faUserClock, color: 'warning', sub: 'On leave today' },
    { title: 'Departments', value: d.departments ?? 15, icon: faLayerGroup, color: 'info', sub: 'Academic departments' },
    { title: 'Open Vacancies', value: d.open_vacancies ?? 8, icon: faBriefcase, color: 'danger', sub: 'Positions to fill' },
  ];

  const staffData = {
    labels: ['Teachers', 'Non-Teaching'],
    datasets: [{
      data: [d.teachers ?? 120, d.non_teaching ?? 80],
      backgroundColor: ['#6366f1', '#10b981'],
      borderWidth: 0,
    }]
  };

  const deptData = {
    labels: d.department_wise?.labels || ['CS', 'Math', 'Science', 'Arts', 'Admin'],
    datasets: [{
      label: 'Staff',
      data: d.department_wise?.data || [30, 25, 20, 15, 10],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      borderRadius: 6,
    }]
  };

  const attTrendData = {
    labels: d.attendance_trend?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
      label: 'Attendance %',
      data: d.attendance_trend?.data || [96, 94, 97, 93, 95],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const recentJoiners = d.recent_joiners || [
    { id: 1, name: 'Dr. Sarah Johnson', department: 'Computer Science', role: 'Professor', date: '2026-07-20' },
    { id: 2, name: 'Mr. Michael Brown', department: 'Mathematics', role: 'Lecturer', date: '2026-07-18' },
    { id: 3, name: 'Ms. Emily Davis', department: 'Administration', role: 'Coordinator', date: '2026-07-15' },
    { id: 4, name: 'Mr. James Wilson', department: 'Science', role: 'Lab Assistant', date: '2026-07-12' },
  ];

  const celebrations = d.celebrations || {
    birthdays: [
      { id: 1, name: 'Dr. Alan Turing', department: 'Computer Science' },
      { id: 2, name: 'Ms. Marie Curie', department: 'Science' },
    ],
    anniversaries: [
      { id: 1, name: 'Prof. John Nash', department: 'Mathematics', years: 5 },
    ]
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1,2,3,4,5,6,7].map(i => (
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
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3"><FontAwesomeIcon icon={faArrowUp} /><span>{error}</span></div>
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Staff Dashboard</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Employee and faculty overview</p>
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

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Staff Distribution</h5>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
              <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                <Doughnut data={staffData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '72%',
                  plugins: { legend: { display: false } },
                  elements: { arc: { borderRadius: 6 } }
                }} />
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-2">
              {['Teachers', 'Non-Teaching'].map((l, i) => (
                <div className="d-flex align-items-center gap-2" key={l}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: staffData.datasets[0].backgroundColor[i], display: 'inline-block' }} />
                  <span className="small fw-semibold">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Department-wise</h5>
            <div style={{ height: '220px' }}>
              <Bar data={deptData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
              }} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Attendance Trend</h5>
            <div style={{ height: '220px' }}>
              <Line data={attTrendData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, grid: { display: false } }, x: { grid: { display: false } } }
              }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faUserPlus} className="me-2 text-success" />Recent Joiners</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJoiners.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">No recent joiners</td></tr>
                  ) : recentJoiners.map(j => (
                    <tr key={j.id}>
                      <td className="fw-semibold small">{j.name}</td>
                      <td className="small">{j.department}</td>
                      <td className="small">{j.role}</td>
                      <td className="small">{j.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faCake} className="me-2 text-warning" />Birthdays</h5>
            {celebrations.birthdays.length === 0 ? (
              <p className="text-muted text-center py-4 small">No birthdays today</p>
            ) : celebrations.birthdays.map(b => (
              <div key={b.id} className="d-flex align-items-center gap-3 mb-3 p-2 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>{b.name.charAt(0)}</div>
                <div>
                  <div className="small fw-bold">{b.name}</div>
                  <div className="x-small text-muted">{b.department}</div>
                </div>
                <FontAwesomeIcon icon={faGift} className="ms-auto text-warning" />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-3">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faBriefcase} className="me-2 text-primary" />Anniversaries</h5>
            {celebrations.anniversaries.length === 0 ? (
              <p className="text-muted text-center py-4 small">No anniversaries today</p>
            ) : celebrations.anniversaries.map(a => (
              <div key={a.id} className="d-flex align-items-center gap-3 mb-3 p-2 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>{a.name.charAt(0)}</div>
                <div>
                  <div className="small fw-bold">{a.name}</div>
                  <div className="x-small text-muted">{a.department} | {a.years} yrs</div>
                </div>
              </div>
            ))}
          </div>
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

export default StaffDashboard;
