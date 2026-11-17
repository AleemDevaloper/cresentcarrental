import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate, faUserCheck, faUserSlash, faGraduationCap,
  faUserPlus, faClock, faAward, faUsers, faBus, faMoneyBillWave,
  faCheckDouble, faExclamationTriangle, faSearch, faFilter,
  faRotate, faArrowUp, faVenus, faChartBar,
  faEnvelope, faCalendarCheck, faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getStudentDashboard } from '../../../../api/ems';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const StudentDashboard = () => {
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
      const data = await getStudentDashboard();
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
    { title: 'Total Students', value: d.total_students ?? 1250, icon: faUserGraduate, color: 'primary', sub: 'All enrolled students' },
    { title: 'Active', value: d.active ?? 1120, icon: faUserCheck, color: 'success', sub: 'Currently enrolled' },
    { title: 'Inactive', value: d.inactive ?? 80, icon: faUserSlash, color: 'secondary', sub: 'Dropped / Graduated' },
    { title: 'Graduated', value: d.graduated ?? 50, icon: faGraduationCap, color: 'info', sub: 'Completed programs' },
    { title: 'New Admissions', value: d.new_admissions ?? 45, icon: faUserPlus, color: 'success', sub: 'This academic year' },
    { title: 'Pending', value: d.pending ?? 30, icon: faClock, color: 'warning', sub: 'Awaiting approval' },
    { title: 'Scholarship', value: d.scholarship ?? 120, icon: faAward, color: 'warning', sub: 'On scholarship' },
    { title: 'Hostel', value: d.hostel ?? 200, icon: faBuilding, color: 'info', sub: 'Residential students' },
    { title: 'Transport', value: d.transport ?? 350, icon: faBus, color: 'primary', sub: 'Using transport service' },
    { title: 'Fee Defaulters', value: d.fee_defaulters ?? 15, icon: faMoneyBillWave, color: 'danger', sub: 'Pending dues' },
    { title: 'Perfect Attendance', value: d.perfect_attendance ?? 180, icon: faCheckDouble, color: 'success', sub: 'No absences' },
    { title: 'At Risk', value: d.at_risk ?? 25, icon: faExclamationTriangle, color: 'danger', sub: 'Needs intervention' },
  ];

  const trendData = {
    labels: d.enrollment_trend?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Enrollments',
      data: d.enrollment_trend?.data || [120, 135, 150, 145, 160, 180],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [{
      data: [d.gender_distribution?.male ?? 600, d.gender_distribution?.female ?? 540, d.gender_distribution?.other ?? 10],
      backgroundColor: ['#6366f1', '#ec4899', '#6b7280'],
      borderWidth: 0,
    }]
  };

  const deptData = {
    labels: d.department_wise?.labels || ['CS', 'Engineering', 'Business', 'Arts', 'Science'],
    datasets: [{
      label: 'Students',
      data: d.department_wise?.data || [300, 250, 200, 150, 100],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'],
      borderRadius: 6,
    }]
  };

  const recentRegistrations = d.recent_registrations || [
    { id: 1, name: 'Alice Johnson', student_id: 'STU-001', program: 'Computer Science', date: '2026-07-25', status: 'active' },
    { id: 2, name: 'Bob Smith', student_id: 'STU-002', program: 'Business Administration', date: '2026-07-24', status: 'active' },
    { id: 3, name: 'Carol Williams', student_id: 'STU-003', program: 'Electrical Engineering', date: '2026-07-23', status: 'pending' },
    { id: 4, name: 'David Brown', student_id: 'STU-004', program: 'Mechanical Engineering', date: '2026-07-22', status: 'active' },
    { id: 5, name: 'Emma Davis', student_id: 'STU-005', program: 'Psychology', date: '2026-07-21', status: 'active' },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div className="col-md-4 col-xl-2" key={i}>
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
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Student Dashboard</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Student Information System overview</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map(kpi => (
          <div className="col-md-4 col-xl-2" key={kpi.title}>
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
            <h5 className="fw-bold mb-3">Enrollment Trend</h5>
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
            <h5 className="fw-bold mb-3">Gender Distribution</h5>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
              <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                <Doughnut data={genderData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '72%',
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                  elements: { arc: { borderRadius: 6 } }
                }} />
              </div>
            </div>
            <div className="d-flex justify-content-center gap-4 mt-2">
              {['Male', 'Female', 'Other'].map((g, i) => (
                <div className="d-flex align-items-center gap-2" key={g}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: genderData.datasets[0].backgroundColor[i], display: 'inline-block' }} />
                  <span className="small fw-semibold">{g}</span>
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
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Recent Registrations</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Program</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map(r => (
                    <tr key={r.id}>
                      <td className="fw-semibold small">{r.name}</td>
                      <td><code>{r.student_id}</code></td>
                      <td className="small">{r.program}</td>
                      <td className="small">{r.date}</td>
                      <td>
                        <span className={`badge rounded-pill bg-${r.status === 'active' ? 'success' : 'warning'}-subtle text-${r.status === 'active' ? 'success' : 'warning'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Student Stats Summary</h5>
            <div className="row g-3">
              {[
                { label: 'Avg Attendance', value: '94.2%', color: 'success', icon: faCalendarCheck },
                { label: 'Avg GPA', value: '3.45', color: 'primary', icon: faAward },
                { label: 'Retention Rate', value: '97.1%', color: 'info', icon: faArrowUp },
                { label: 'Male/Female Ratio', value: `${d.gender_distribution?.male ?? 600}:${d.gender_distribution?.female ?? 540}`, color: 'warning', icon: faVenus },
              ].map(s => (
                <div className="col-md-6" key={s.label}>
                  <div className={`p-3 rounded-4 d-flex align-items-center gap-3 ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <div className={`p-3 rounded-3 bg-${s.color}-subtle text-${s.color}`}>
                      <FontAwesomeIcon icon={s.icon} />
                    </div>
                    <div>
                      <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{s.label}</div>
                      <div className="h4 fw-bold mb-0">{s.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className={`small fw-bold ${isDark ? 'text-light' : ''}`}>Total Active Students</div>
                  <div className="x-small text-muted">Across all programs</div>
                </div>
                <div className="h3 fw-bold text-primary">{d.active ?? 1120}</div>
              </div>
            </div>
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

export default StudentDashboard;
