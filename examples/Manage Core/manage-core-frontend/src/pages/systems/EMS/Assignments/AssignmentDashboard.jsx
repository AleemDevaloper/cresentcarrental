import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faCheckCircle, faClock, faUpload, faExclamationTriangle,
  faStar, faTimesCircle, faCalendarCheck, faArrowRight,
  faChartLine, faChartBar, faChartPie, faPlus, faLayerGroup,
  faFileAlt, faUserGraduate, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const AssignmentDashboard = () => {
  const { theme, setActiveTab } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#131b2e' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise(r => setTimeout(r, 600));
        setStats({
          totalAssignments: 245,
          published: 180,
          draft: 42,
          pendingSubmissions: 68,
          lateSubmissions: 23,
          graded: 120,
          ungraded: 60,
          upcomingDeadlines: 15,
          todayDue: 8,
          submissionRate: 72,
          gradesDistribution: [
            { range: 'A (90-100)', count: 45 },
            { range: 'B (80-89)', count: 62 },
            { range: 'C (70-79)', count: 38 },
            { range: 'D (60-69)', count: 20 },
            { range: 'F (<60)', count: 10 },
          ],
          monthlyAssignments: [18, 22, 15, 28, 30, 24, 19, 26, 32, 27, 21, 35],
          recentSubmissions: [
            { id: 1, student: 'Ali Ahmed', assignment: 'Physics Lab Report', subject: 'Physics', time: '5 min ago', status: 'submitted' },
            { id: 2, student: 'Sara Khan', assignment: 'Math Assignment 3', subject: 'Mathematics', time: '12 min ago', status: 'submitted' },
            { id: 3, student: 'Usman Ali', assignment: 'Chemistry Essay', subject: 'Chemistry', time: '25 min ago', status: 'late' },
            { id: 4, student: 'Fatima Noor', assignment: 'English Literature', subject: 'English', time: '1 hour ago', status: 'submitted' },
            { id: 5, student: 'Hassan Raza', assignment: 'Computer Science Project', subject: 'CS', time: '2 hours ago', status: 'graded' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load assignment dashboard');
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
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: textColor }}>Failed to Load Dashboard</h5>
          <p className="text-muted mb-3 text-center">{error}</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => { setLoading(true); setError(null); setStats(null); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const submissionRateData = {
    labels: ['Submitted', 'Pending', 'Late'],
    datasets: [{
      data: [stats.submissionRate, 100 - stats.submissionRate - 8, 8],
      backgroundColor: [colors.success, colors.warning, colors.danger],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const gradesChartData = {
    labels: stats.gradesDistribution.map(g => g.range),
    datasets: [{
      label: 'Students',
      data: stats.gradesDistribution.map(g => g.count),
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#f97316', '#ef4444'],
      borderRadius: 6,
    }],
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Assignments',
      data: stats.monthlyAssignments,
      borderColor: colors.primary,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#f1f5f9' : '#1e293b',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        borderColor: borderColor,
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
      },
    },
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
            <FontAwesomeIcon icon={faBook} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Assignment Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Track assignments, submissions, and grading</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('assignments')}>
            <FontAwesomeIcon icon={faPlus} /> Create Assignment
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Assignments', value: stats.totalAssignments, icon: faBook, color: colors.primary, sub: 'All time' },
          { title: 'Published', value: stats.published, icon: faCheckCircle, color: colors.success, sub: 'Active' },
          { title: 'Draft', value: stats.draft, icon: faClock, color: colors.warning, sub: 'Not published' },
          { title: 'Pending Submissions', value: stats.pendingSubmissions, icon: faUpload, color: colors.info, sub: 'Awaiting' },
          { title: 'Late Submissions', value: stats.lateSubmissions, icon: faExclamationTriangle, color: colors.danger, sub: 'Overdue' },
          { title: 'Graded', value: stats.graded, icon: faStar, color: colors.success, sub: 'Completed' },
          { title: 'Ungraded', value: stats.ungraded, icon: faTimesCircle, color: colors.warning, sub: 'Pending review' },
          { title: 'Upcoming Deadlines', value: stats.upcomingDeadlines, icon: faCalendarCheck, color: colors.info, sub: 'Next 7 days' },
          { title: "Today's Due", value: stats.todayDue, icon: faClock, color: colors.danger, sub: 'Critical' },
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
                <div className="x-small text-muted">{stat.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Submission Rate</h6>
              <div style={{ height: '220px', position: 'relative' }}>
                <Doughnut
                  data={submissionRateData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, color: mutedColor } } },
                  }}
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h3 className="fw-bold mb-0" style={{ color: textColor }}>{stats.submissionRate}%</h3>
                  <span className="x-small text-muted">Submitted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Grades Distribution</h6>
              <div style={{ height: '220px' }}>
                <Bar data={gradesChartData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Monthly Assignments</h6>
              <div style={{ height: '220px' }}>
                <Line data={monthlyData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Submissions</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentSubmissions.map((sub, idx) => (
                <div key={sub.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: sub.status === 'late' ? `${colors.danger}15` : sub.status === 'graded' ? `${colors.success}15` : `${colors.info}15` }}>
                    <FontAwesomeIcon icon={faUserGraduate} style={{ color: sub.status === 'late' ? colors.danger : sub.status === 'graded' ? colors.success : colors.info, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="small fw-bold" style={{ color: textColor }}>{sub.student}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{sub.assignment} · {sub.subject}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className={`badge rounded-pill x-small fw-semibold ${sub.status === 'late' ? 'bg-danger-subtle text-danger' : sub.status === 'graded' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'}`}>
                      {sub.status}
                    </span>
                    <div className="x-small text-muted mt-1">{sub.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Quick Actions</h6>
              {[
                { label: 'Create Assignment', icon: faPlus, color: colors.primary, desc: 'Add new assignment' },
                { label: 'Grade Submissions', icon: faStar, color: colors.success, desc: 'Review & grade' },
                { label: 'View All Assignments', icon: faLayerGroup, color: colors.info, desc: 'Manage assignments' },
                { label: 'Download Reports', icon: faFileAlt, color: colors.purple, desc: 'Export data' },
              ].map((act, idx) => (
                <button
                  key={idx}
                  className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
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

      <style>{`
        .x-small { font-size: 11px; }
        .transition { transition: all 0.25s ease; }
      `}</style>
    </div>
  );
};

export default AssignmentDashboard;
