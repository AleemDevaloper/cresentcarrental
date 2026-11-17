import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faCheckCircle, faClock, faPlay, faUsers,
  faGraduationCap, faCertificate, faVideo, faChartLine,
  faArrowRight, faStar, faUserGraduate, faArrowUp,
  faArrowDown, faExclamationTriangle, faLayerGroup,
  faPlus, faChartBar, faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const LmsDashboard = () => {
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
          totalCourses: 64,
          active: 48,
          published: 52,
          draft: 12,
          lessons: 520,
          studentsEnrolled: 3850,
          completionRate: 78,
          certificatesIssued: 1250,
          liveClasses: 24,
          courseEnrollments: [320, 480, 560, 420, 680, 540, 390, 610, 720, 580, 490, 650],
          monthlyActivity: [120, 190, 170, 210, 250, 200, 180, 230, 280, 220, 195, 260],
          popularCourses: [
            { id: 1, name: 'Introduction to AI', instructor: 'Dr. Ahmad Khan', students: 340, rating: 4.8 },
            { id: 2, name: 'Web Development Bootcamp', instructor: 'Prof. Sara Ali', students: 280, rating: 4.6 },
            { id: 3, name: 'Data Science Fundamentals', instructor: 'Mr. Usman Malik', students: 250, rating: 4.7 },
            { id: 4, name: 'English Communication', instructor: 'Ms. Fatima Noor', students: 220, rating: 4.5 },
            { id: 5, name: 'Digital Marketing 101', instructor: 'Dr. Hassan Raza', students: 190, rating: 4.4 },
          ],
          recentActivity: [
            { id: 1, user: 'Ali Ahmed', action: 'Enrolled in AI Course', time: '5 min ago', type: 'enrollment' },
            { id: 2, user: 'Sara Khan', action: 'Completed Web Dev Module 3', time: '15 min ago', type: 'completion' },
            { id: 3, user: 'Usman Ali', action: 'Submitted Assignment', time: '30 min ago', type: 'submission' },
            { id: 4, user: 'Fatima Noor', action: 'Achieved 95% in Quiz', time: '1 hour ago', type: 'quiz' },
            { id: 5, user: 'Hassan Raza', action: 'Earned Completion Certificate', time: '2 hours ago', type: 'certificate' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load LMS dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
  };

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

  const enrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Enrollments',
      data: stats.courseEnrollments,
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const completionData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [{
      data: [stats.completionRate, 15, 100 - stats.completionRate - 15],
      backgroundColor: [colors.success, colors.warning, colors.muted || '#94a3b8'],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Activities',
      data: stats.monthlyActivity,
      borderColor: colors.primary,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: {
      y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
    },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}>
            <FontAwesomeIcon icon={faBookOpen} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>LMS Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Learning management system analytics</p>
          </div>
        </div>
        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('courses')}>
          <FontAwesomeIcon icon={faPlus} /> Create Course
        </button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: faBookOpen, color: colors.primary },
          { title: 'Active', value: stats.active, icon: faPlay, color: colors.success },
          { title: 'Published', value: stats.published, icon: faCheckCircle, color: colors.success },
          { title: 'Draft', value: stats.draft, icon: faClock, color: colors.warning },
          { title: 'Lessons', value: stats.lessons, icon: faLayerGroup, color: colors.info },
          { title: 'Students Enrolled', value: stats.studentsEnrolled, icon: faUsers, color: colors.primary },
          { title: 'Completion Rate', value: `${stats.completionRate}%`, icon: faGraduationCap, color: colors.success },
          { title: 'Certificates', value: stats.certificatesIssued, icon: faCertificate, color: colors.purple },
          { title: 'Live Classes', value: stats.liveClasses, icon: faVideo, color: colors.info },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Course Enrollments</h6>
              <div style={{ height: '220px' }}><Bar data={enrollmentData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Completion Rate</h6>
              <div style={{ height: '220px', position: 'relative' }}>
                <Doughnut data={completionData}
                  options={{ responsive: true, maintainAspectRatio: false, cutout: '72%',
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, color: mutedColor } } } }} />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h3 className="fw-bold mb-0" style={{ color: textColor }}>{stats.completionRate}%</h3>
                  <span className="x-small text-muted">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Monthly Activity</h6>
              <div style={{ height: '220px' }}><Line data={activityData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Popular Courses</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.popularCourses.map((course, idx) => (
                <div key={course.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', background: `${colors.primary}15` }}>
                    <FontAwesomeIcon icon={faBookOpen} style={{ color: colors.primary, fontSize: '16px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{course.name}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{course.instructor} · {course.students} students</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className="badge bg-warning-subtle text-warning rounded-pill x-small">
                      <FontAwesomeIcon icon={faStar} className="me-1" />{course.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Learning Activity</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentActivity.map((act, idx) => (
                <div key={act.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{
                    width: '38px', height: '38px',
                    background: act.type === 'completion' ? `${colors.success}15` : act.type === 'certificate' ? `${colors.purple}15` : act.type === 'quiz' ? `${colors.warning}15` : `${colors.info}15`
                  }}>
                    <FontAwesomeIcon icon={act.type === 'completion' ? faCheckCircle : act.type === 'certificate' ? faCertificate : act.type === 'quiz' ? faStar : faUserGraduate}
                      style={{ color: act.type === 'completion' ? colors.success : act.type === 'certificate' ? colors.purple : act.type === 'quiz' ? colors.warning : colors.info, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{act.user}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{act.action}</div>
                  </div>
                  <div className="x-small text-muted flex-shrink-0">{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default LmsDashboard;
