import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faSchool, faBuilding, faUniversity,
  faUsers, faUserCheck, faUserPlus, faUserGraduate,
  faChalkboardTeacher, faClipboardList, faCalendarCheck,
  faMoneyBillWave, faBookOpen, faPenFancy,
  faFileInvoice, faArrowUp, faArrowDown,
  faBell, faFilter, faSearch, faRotate,
  faChevronRight, faExclamationTriangle,
  faCheckCircle, faClock, faChartBar,
  faPlus, faCalendarAlt, faEnvelope,
  faStar, faTrophy, faLightbulb,
  faHandshake, faBullhorn, faLayerGroup,
  faChartLine, faChartPie, faArrowRight,
  faUserSlash, faFlag, faSun, faMoon,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { getEmsDashboard, getEmsDashboardAnalytics, getEmsAiInsights } from '../../../api/ems';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EmsDashboard = () => {
  const { t } = useTranslation();
  const { theme, setActiveTab, currentUser, toggleTheme } = useApp();

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    institution: '',
    campus: '',
    department: '',
    academic_year: '',
    date_from: '',
    date_to: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const isDark = theme === 'dark';

  const bgColor = isDark ? '#060816' : '#f5f7ff';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const shellBg = isDark ? 'linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)' : 'linear-gradient(135deg, #f8faff 0%, #fdfdff 45%, #eef2ff 100%)';

  const activityIconMap = {
    student_registered: { icon: faUserPlus, color: '#6366f1' },
    admission_approved: { icon: faCheckCircle, color: '#10b981' },
    teacher_joined: { icon: faChalkboardTeacher, color: '#3b82f6' },
    attendance_marked: { icon: faClipboardList, color: '#f59e0b' },
    assignment_submitted: { icon: faBookOpen, color: '#ec4899' },
    exam_created: { icon: faPenFancy, color: '#8b5cf6' },
    result_published: { icon: faTrophy, color: '#14b8a6' },
    fee_paid: { icon: faMoneyBillWave, color: '#ef4444' },
    fee_overdue: { icon: faExclamationTriangle, color: '#ef4444' },
    class_created: { icon: faBookOpen, color: '#ec4899' },
    announcement: { icon: faBullhorn, color: '#f97316' },
  };

  const eventIconMap = {
    exam: { icon: faPenFancy, color: '#ef4444' },
    holiday: { icon: faStar, color: '#10b981' },
    meeting: { icon: faHandshake, color: '#3b82f6' },
    deadline: { icon: faFlag, color: '#f59e0b' },
    event: { icon: faTrophy, color: '#8b5cf6' },
    sports: { icon: faTrophy, color: '#8b5cf6' },
    default: { icon: faCalendarAlt, color: '#6366f1' },
  };

  const insightIconMap = {
    attendance: { icon: faExclamationTriangle, color: '#ef4444' },
    academic: { icon: faLightbulb, color: '#f59e0b' },
    fee: { icon: faMoneyBillWave, color: '#f59e0b' },
    deadline: { icon: faClock, color: '#3b82f6' },
    department: { icon: faBuilding, color: '#8b5cf6' },
    default: { icon: faLightbulb, color: '#6366f1' },
  };

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, analyticsRes, insightsRes] = await Promise.all([
        getEmsDashboard().catch(() => null),
        getEmsDashboardAnalytics().catch(() => null),
        getEmsAiInsights().catch(() => null),
      ]);

      const totals = dashRes?.totals || {};
      const attendance = dashRes?.attendance || {};
      const fees = dashRes?.fees || {};
      const rawActivities = dashRes?.recent_activities || [];
      const rawEvents = dashRes?.upcoming_events || [];

      const resolvedInsights = (insightsRes?.insights || insightsRes || []).map((item, i) => {
        const key = (item.type || item.category || item.title || '').toLowerCase().replace(/\s+/g, '_');
        const match = Object.keys(insightIconMap).find(k => key.includes(k));
        const map = insightIconMap[match] || insightIconMap.default;
        return {
          id: item.id || i + 1,
          title: item.title || item.name || 'Insight',
          desc: item.description || item.desc || item.message || '',
          severity: item.severity || item.priority || 'low',
          icon: map.icon,
          color: map.color,
        };
      });

      const resolvedActivities = rawActivities.map((a, i) => {
        const key = (a.type || a.activity_type || '').toLowerCase().replace(/\s+/g, '_');
        const match = Object.keys(activityIconMap).find(k => key.includes(k));
        const map = match ? activityIconMap[match] : { icon: faCheckCircle, color: '#6366f1' };
        return {
          id: a.id || i + 1,
          type: a.type || a.activity_type || a.title || 'Activity',
          entity: a.entity || a.student_name || a.teacher_name || a.name || '',
          dept: a.department || a.dept || a.department_name || '',
          time: a.time || a.created_at || a.timestamp || '',
          icon: map.icon,
          color: a.color || map.color,
        };
      });

      const resolvedEvents = rawEvents.map((e, i) => {
        const key = (e.type || e.event_type || '').toLowerCase().replace(/\s+/g, '_');
        const match = Object.keys(eventIconMap).find(k => key.includes(k));
        const map = match ? eventIconMap[match] : eventIconMap.default;
        return {
          id: e.id || i + 1,
          title: e.title || e.name || 'Event',
          date: e.date || e.event_date || '',
          type: e.type || e.event_type || 'Event',
          icon: map.icon,
          color: e.color || map.color,
        };
      });

      setDashboardData({
        totalInstitutions: totals.total_institutions ?? totals.institutions ?? 0,
        totalCampuses: totals.total_campuses ?? totals.campuses ?? 0,
        totalDepartments: totals.total_departments ?? totals.departments ?? 0,
        totalStudents: totals.total_students ?? totals.students ?? 0,
        activeStudents: totals.active_students ?? totals.students_active ?? 0,
        newAdmissions: totals.new_admissions ?? totals.admissions ?? 0,
        totalTeachers: totals.total_teachers ?? totals.teachers ?? 0,
        activeTeachers: totals.active_teachers ?? totals.teachers_active ?? 0,
        totalEmployees: totals.total_employees ?? totals.employees ?? 0,
        attendanceToday: attendance.total_today ?? attendance.total ?? 0,
        studentsPresent: attendance.present ?? 0,
        studentsAbsent: attendance.absent ?? 0,
        pendingFees: fees.pending ?? fees.pending_fees ?? 0,
        collectedFees: fees.collected ?? fees.total_collected ?? 0,
        monthlyRevenue: fees.monthly_revenue ?? fees.revenue ?? 0,
        studentGrowth: analyticsRes?.student_growth || analyticsRes?.studentGrowth || [],
        admissionTrend: analyticsRes?.admission_trend || analyticsRes?.admissionTrend || [],
        attendanceAnalytics: {
          present: analyticsRes?.attendance_analytics?.present ?? attendance.present ?? 0,
          absent: analyticsRes?.attendance_analytics?.absent ?? attendance.absent ?? 0,
          late: analyticsRes?.attendance_analytics?.late ?? attendance.late ?? 0,
        },
        departmentPerformance: analyticsRes?.department_performance || analyticsRes?.departmentPerformance || [],
        feeCollection: analyticsRes?.fee_collection || analyticsRes?.feeCollection || [],
        recentActivities: resolvedActivities,
        upcomingEvents: resolvedEvents,
        aiInsights: resolvedInsights,
      });
    } catch (err) {
      console.error('Error loading EMS Dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(() => {
      setNotifications(prev => [...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, [filters, loadDashboardData]);

  const handleApplyFilters = () => {
    loadDashboardData();
  };

  const handleResetFilters = () => {
    setFilters({
      institution: '',
      campus: '',
      department: '',
      academic_year: '',
      date_from: '',
      date_to: '',
    });
  };

  const d = dashboardData;

  const studentGrowthData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Students',
        data: d.studentGrowth,
        borderColor: '#6366f1',
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          g.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
          g.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return g;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const admissionTrendData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Admissions',
        data: d.admissionTrend,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const attendanceAnalyticsData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [d.attendanceAnalytics.present, d.attendanceAnalytics.absent, d.attendanceAnalytics.late],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const deptPerfData = {
    labels: d.departmentPerformance.map(dp => dp.name),
    datasets: [
      {
        label: 'Avg. Performance %',
        data: d.departmentPerformance.map(dp => dp.avg),
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(6, 182, 212, 0.7)',
        ],
        borderRadius: 6,
      },
    ],
  };

  const feeCollectionData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Fee Collection (Rs.)',
        data: d.feeCollection,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#f59e0b',
      },
    ],
  };

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#f1f5f9' : '#1e293b',
        bodyColor: isDark ? '#94a3b8' : '#64748b',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
        ticks: { color: mutedColor, font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: mutedColor, font: { size: 10 } },
      },
    },
  });

  if (loading || !d) {
    return (
      <div className="p-3">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div className="col-xl col-lg-4 col-md-6" key={i}>
              <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '140px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}>
                <div className="skeleton-line w-50 mb-3" style={{ height: '15px', background: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}></div>
                <div className="skeleton-line w-75 mb-2" style={{ height: '25px', background: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}></div>
                <div className="skeleton-line w-25" style={{ height: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4 g-4">
          <div className="col-lg-8">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}></div>
          </div>
          <div className="col-lg-4">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ems-root ems-dashboard-container p-2 ${isDark ? 'text-white' : ''}`} style={{ background: shellBg, minHeight: '100vh' }}>
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <motion.div
            className="card border-0 text-white rounded-4 h-100 p-0 shadow-sm ems-welcome-hero"
            style={{ borderRadius: '24px', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-blob hero-blob-1" />
            <div className="hero-blob hero-blob-2" />
            <div className="hero-blob hero-blob-3" />
            <div className="p-4 premium-hero-content">
              <div className="d-flex flex-column h-100">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span className="badge text-white px-3 py-1.5 rounded-pill x-small fw-bold d-flex align-items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                    <span className="live-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
                    Premium Education Command Center
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill x-small fw-semibold" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <FontAwesomeIcon icon={faUniversity} className="me-1" style={{ fontSize: '9px' }} />
                    Intelligent Campus Operations
                  </span>
                </div>
                <div className="row align-items-center g-4 flex-grow-1">
                  <div className="col-md-7">
                    <h2 className="fw-bold mb-2" style={{ fontSize: '30px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                      Welcome back, {currentUser?.name?.split(' ')[0] || 'Education Admin'}
                    </h2>
                    <p className="text-white-50 mb-4" style={{ fontSize: '13.8px', fontWeight: '500', maxWidth: '560px', lineHeight: 1.6 }}>
                      Elevate every campus decision with a refined command center for enrollment, attendance, academic insight, fees, and institutional performance.
                    </p>
                    <div className="d-flex flex-wrap gap-2.5 mt-2">
                      <button className="btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white border-0 hover-lift d-flex align-items-center gap-2" style={{ fontSize: '12.5px', background: 'linear-gradient(135deg, rgba(255,255,255,0.24), rgba(255,255,255,0.09))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                        <FontAwesomeIcon icon={faChartBar} />
                        Open Analytics
                      </button>
                      <button onClick={toggleTheme} className="btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white hover-lift d-flex align-items-center gap-2" style={{ fontSize: '12.5px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)' }}>
                        <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="row g-2">
                      {[
                        { label: 'Present Today', value: d.studentsPresent, color: '#4ade80' },
                        { label: 'Absent Today', value: d.studentsAbsent, color: '#fb7185' },
                        { label: 'New Admissions', value: d.newAdmissions, color: '#fbbf24' },
                        { label: 'Active Teachers', value: d.activeTeachers, color: '#60a5fa' },
                      ].map(stat => (
                        <div className="col-6" key={stat.label}>
                          <div className="p-3 rounded-3 text-center premium-stat-card" style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <div className="h3 fw-bold mb-0" style={{ color: stat.color }}>{stat.value.toLocaleString()}</div>
                            <div className="x-small text-white-50 fw-semibold mt-1">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 rounded-3 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="x-small text-white-50"><FontAwesomeIcon icon={faBell} className="me-1" /> 3 new notifications</span>
                      <span className="x-small text-white-50 fw-semibold" style={{ opacity: 0.7 }}><FontAwesomeIcon icon={faChevronRight} /></span>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-white" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <FontAwesomeIcon icon={faUniversity} className="me-1" style={{ fontSize: '9px' }} /> {d.totalInstitutions} Institutions
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <FontAwesomeIcon icon={faLayerGroup} className="me-1" style={{ fontSize: '9px' }} /> {d.totalDepartments} Departments
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <FontAwesomeIcon icon={faUserGraduate} className="me-1" style={{ fontSize: '9px' }} /> {d.totalStudents.toLocaleString()} Students
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-lg-4">
          <motion.div className={`card border-0 shadow-sm rounded-4 h-100 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '20px', background: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)', boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Student Composition</h5>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1.5 x-small fw-semibold d-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '9px' }} /> {d.totalStudents.toLocaleString()} Total
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: '140px' }}>
              <div className="position-relative" style={{ width: '130px', height: '130px' }}>
                <Doughnut data={{ labels: ['Active', 'Inactive', 'New'], datasets: [{ data: [d.activeStudents, d.totalStudents - d.activeStudents, d.newAdmissions], backgroundColor: ['#10b981', '#94a3b8', '#6366f1'], borderWidth: 0 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: '78%', plugins: { legend: { display: false }, tooltip: { enabled: true } }, elements: { arc: { borderRadius: 4 } } }} />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <div className="h4 fw-bold mb-0 lh-1" style={{ color: textColor }}>{d.activeStudents.toLocaleString()}</div>
                  <div className="x-small" style={{ color: mutedColor }}>Active</div>
                </div>
              </div>
            </div>
            <div className="row text-center g-1 mt-1">
              {[
                { label: 'Active', value: d.activeStudents, color: '#10b981' },
                { label: 'Inactive', value: d.totalStudents - d.activeStudents, color: '#94a3b8' },
                { label: 'New', value: d.newAdmissions, color: '#6366f1' },
              ].map(item => (
                <div className="col" key={item.label}>
                  <div className="fw-bold small" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
                  <div className="x-small" style={{ color: mutedColor }}>{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div
        className={`card border-0 rounded-4 mb-4 sticky-top premium-filter-bar ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}
        style={{
          top: '80px',
          zIndex: 100,
          borderRadius: '18px',
          background: isDark ? 'rgba(19, 27, 46, 0.9)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${borderColor}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-2 px-1">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-primary" style={{ fontSize: '12px' }} />
              <span className="x-small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Dashboard Filters</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="x-small text-muted d-flex align-items-center gap-1">
                <span className="live-dot" style={{ width: '5px', height: '5px', backgroundColor: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
                Auto-refresh 30s
              </span>
            </div>
          </div>
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block" style={{ color: mutedColor }}>Institution</label>
              <select
                className="form-select form-select-sm premium-select"
                value={filters.institution}
                onChange={e => setFilters({ ...filters, institution: e.target.value })}
                style={{
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  fontSize: '12.5px',
                  padding: '8px 12px',
                  color: textColor,
                }}
              >
                <option value="">All Institutions</option>
                <option value="1">Main Campus</option>
                <option value="2">City College</option>
                <option value="3">National University</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block" style={{ color: mutedColor }}>Campus</label>
              <select
                className="form-select form-select-sm premium-select"
                value={filters.campus}
                onChange={e => setFilters({ ...filters, campus: e.target.value })}
                style={{
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  fontSize: '12.5px',
                  padding: '8px 12px',
                  color: textColor,
                }}
              >
                <option value="">All Campuses</option>
                <option value="1">North Campus</option>
                <option value="2">South Campus</option>
                <option value="3">City Campus</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block" style={{ color: mutedColor }}>Department</label>
              <select
                className="form-select form-select-sm premium-select"
                value={filters.department}
                onChange={e => setFilters({ ...filters, department: e.target.value })}
                style={{
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  fontSize: '12.5px',
                  padding: '8px 12px',
                  color: textColor,
                }}
              >
                <option value="">All Departments</option>
                {d.departmentPerformance.map(dp => (
                  <option key={dp.name} value={dp.name}>{dp.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block" style={{ color: mutedColor }}>Academic Year</label>
              <select
                className="form-select form-select-sm premium-select"
                value={filters.academic_year}
                onChange={e => setFilters({ ...filters, academic_year: e.target.value })}
                style={{
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  fontSize: '12.5px',
                  padding: '8px 12px',
                  color: textColor,
                }}
              >
                <option value="">All Years</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block" style={{ color: mutedColor }}>Search</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-2" style={{ left: '5px', zIndex: 5, color: mutedColor }}>
                  <FontAwesomeIcon icon={faSearch} size="xs" />
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm ps-4 premium-input"
                  placeholder="Search Students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    borderRadius: '10px',
                    border: `1px solid ${borderColor}`,
                    background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                    fontSize: '12.5px',
                    padding: '8px 12px',
                    color: textColor,
                  }}
                />
              </div>
            </div>
            <div className="col-md-2 d-flex gap-1">
              <button className="btn btn-sm flex-grow-1 fw-semibold premium-btn-primary" onClick={handleApplyFilters}
                style={{
                  borderRadius: '10px',
                  fontSize: '12px',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none',
                  color: '#fff',
                }}
              >
                <FontAwesomeIcon icon={faFilter} className="me-1" style={{ fontSize: '10px' }} /> Apply
              </button>
              <button className="btn btn-sm btn-outline-secondary border premium-btn-outline" onClick={handleResetFilters}
                style={{
                  borderRadius: '10px',
                  fontSize: '12px',
                  padding: '8px 12px',
                  color: mutedColor,
                  borderColor: borderColor,
                }}
              >
                <FontAwesomeIcon icon={faRotate} style={{ fontSize: '10px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TOP KPI CARDS ===== */}
      <div className="row g-3 mb-4">
        <KPICard title="Institutions" value={d.totalInstitutions} icon={faUniversity} color="#6366f1" subText="Campuses: 48 | Depts: 156" trend="up" trendValue="2" />
        <KPICard title="Total Students" value={d.totalStudents.toLocaleString()} icon={faUserGraduate} color="#10b981" subText="Active: 27,120 | New: 1,240" trend="up" trendValue="8.5%" />
        <KPICard title="Total Teachers" value={d.totalTeachers} icon={faChalkboardTeacher} color="#3b82f6" subText="Active: 1,720 | Employees: 3,420" trend="up" trendValue="3.2%" />
        <KPICard title="Attendance Today" value={d.attendanceToday.toLocaleString()} icon={faClipboardList} color="#f59e0b" subText={`Present: ${d.studentsPresent.toLocaleString()} | Absent: ${d.studentsAbsent}`} />
        <KPICard title="Fee Collection" value={`Rs. ${(d.collectedFees / 1000000).toFixed(1)}M`} icon={faMoneyBillWave} color="#ef4444" subText={`Pending: Rs. ${(d.pendingFees / 100000).toFixed(1)}L`} trend="up" trendValue="12.3%" />
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Add Student', icon: faUserPlus, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', desc: 'New enrollment' },
          { label: 'New Admission', icon: faGraduationCap, color: '#10b981', bg: 'rgba(16,185,129,0.1)', desc: 'Process admission' },
          { label: 'Add Teacher', icon: faChalkboardTeacher, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'Hire faculty' },
          { label: 'Mark Attendance', icon: faClipboardList, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'Daily attendance' },
          { label: 'Create Class', icon: faBookOpen, color: '#ec4899', bg: 'rgba(236,72,153,0.1)', desc: 'New section' },
          { label: 'Create Assignment', icon: faPenFancy, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', desc: 'Assign work' },
          { label: 'Examination', icon: faStar, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', desc: 'Create exam' },
          { label: 'Collect Fees', icon: faMoneyBillWave, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', desc: 'Fee collection' },
          { label: 'Schedule Meeting', icon: faHandshake, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', desc: 'Plan meeting' },
          { label: 'Send Announcement', icon: faBullhorn, color: '#f97316', bg: 'rgba(249,115,22,0.1)', desc: 'Broadcast' },
        ].map(act => (
          <motion.div className="col-6 col-md-3 col-xl" key={act.label}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <button
              className="btn w-100 py-3 rounded-4 border-0 premium-quick-action d-flex align-items-center gap-3 h-100 text-start"
              style={{
                background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                borderRadius: '14px',
              }}
            >
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 premium-action-icon" style={{ width: '40px', height: '40px', background: act.bg }}>
                <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '16px' }} />
              </div>
              <div className="overflow-hidden">
                <div className="small fw-bold text-nowrap" style={{ color: textColor, fontSize: '12.5px' }}>{act.label}</div>
                <div className="x-small text-muted text-nowrap" style={{ fontSize: '10.5px', color: mutedColor }}>{act.desc}</div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="ms-auto flex-shrink-0 premium-action-arrow" style={{ color: act.color, fontSize: '11px', opacity: 0.4 }} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* ===== CHARTS SECTION ===== */}
      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Student Growth Trend</h5>
              <span className="x-small" style={{ color: mutedColor }}>Last 12 months</span>
            </div>
            <div style={{ height: '240px' }}>
              <Line data={studentGrowthData} options={chartOptions('Student Growth')} />
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Admission Trend</h5>
              <span className="x-small" style={{ color: mutedColor }}>Monthly</span>
            </div>
            <div style={{ height: '240px' }}>
              <Bar data={admissionTrendData} options={chartOptions('Admissions')} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Attendance Analytics</h5>
              <span className="x-small" style={{ color: mutedColor }}>Today</span>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
              <div className="position-relative" style={{ width: '180px', height: '180px' }}>
                <Doughnut
                  data={attendanceAnalyticsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    elements: { arc: { borderRadius: 6 } },
                  }}
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <div className="h3 fw-bold mb-0 lh-1" style={{ color: textColor }}>{(d.studentsPresent / d.attendanceToday * 100).toFixed(1)}%</div>
                  <div className="x-small" style={{ color: mutedColor }}>Present</div>
                </div>
              </div>
            </div>
            <div className="row text-center g-2 mt-2">
              {[
                { label: 'Present', value: d.attendanceAnalytics.present, color: '#10b981' },
                { label: 'Absent', value: d.attendanceAnalytics.absent, color: '#ef4444' },
                { label: 'Late', value: d.attendanceAnalytics.late, color: '#f59e0b' },
              ].map(item => (
                <div className="col" key={item.label}>
                  <div className="fw-bold small" style={{ color: item.color }}>{item.value.toLocaleString()}</div>
                  <div className="x-small" style={{ color: mutedColor }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Department Performance</h5>
              <span className="x-small" style={{ color: mutedColor }}>Avg. %</span>
            </div>
            <div style={{ height: '240px' }}>
              <Bar
                data={deptPerfData}
                options={{
                  ...chartOptions('Performance'),
                  indexAxis: 'y',
                  scales: {
                    x: { beginAtZero: true, max: 100, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
                    y: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Fee Collection</h5>
              <span className="x-small" style={{ color: mutedColor }}>Monthly trend</span>
            </div>
            <div style={{ height: '240px' }}>
              <Line data={feeCollectionData} options={chartOptions('Fee Collection')} />
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECENT ACTIVITIES & UPCOMING EVENTS ===== */}
      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Recent Activities</h5>
              <button className="btn btn-sm border-0 fw-semibold" style={{ color: '#6366f1', fontSize: '11px' }}>View All <FontAwesomeIcon icon={faChevronRight} size="xs" /></button>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '380px' }}>
              {d.recentActivities.map((act, idx) => (
                <motion.div
                  className="d-flex align-items-center gap-3 mb-3 pb-3"
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                  key={act.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: `${act.color}15` }}>
                    <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="small fw-bold" style={{ color: textColor }}>{act.type}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{act.entity} · {act.dept}</div>
                  </div>
                  <div className="x-small text-end flex-shrink-0" style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{act.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Upcoming Events</h5>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: mutedColor }} />
            </div>
            <div className="overflow-auto" style={{ maxHeight: '380px' }}>
              {d.upcomingEvents.map((evt, idx) => (
                <motion.div
                  className="d-flex align-items-center gap-3 mb-3 pb-3"
                  style={{ borderBottom: `1px solid ${borderColor}` }}
                  key={evt.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', background: `${evt.color}15` }}>
                    <FontAwesomeIcon icon={evt.icon} style={{ color: evt.color, fontSize: '16px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{evt.title}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{evt.date}</div>
                  </div>
                  <span className="badge rounded-pill px-2 py-1 x-small fw-semibold flex-shrink-0" style={{ background: `${evt.color}15`, color: evt.color, border: `1px solid ${evt.color}30` }}>
                    {evt.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== AI INSIGHTS & NOTIFICATION CENTER ===== */}
      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faLightbulb} style={{ color: '#f59e0b', fontSize: '16px' }} />
                <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>AI Insights</h5>
              </div>
              <span className="badge rounded-pill px-3 py-1.5 x-small fw-semibold" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>Powered by AI</span>
            </div>
            <div className="row g-3">
              {d.aiInsights.map((insight, idx) => (
                <motion.div
                  className="col-md-6"
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div
                    className="p-3 rounded-4 d-flex align-items-start gap-3 h-100"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: `${insight.color}15`,
                      }}
                    >
                      <FontAwesomeIcon icon={insight.icon} style={{ color: insight.color, fontSize: '16px' }} />
                    </div>
                    <div>
                      <div className="small fw-bold mb-1" style={{ color: textColor }}>
                        {insight.title}
                        {insight.severity === 'high' && <span className="ms-2 badge bg-danger rounded-pill x-small">Urgent</span>}
                        {insight.severity === 'medium' && <span className="ms-2 badge bg-warning text-dark rounded-pill x-small">Moderate</span>}
                      </div>
                      <div className="x-small" style={{ color: mutedColor }}>{insight.desc}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faBell} style={{ color: '#6366f1', fontSize: '16px' }} />
                <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Notifications</h5>
              </div>
              <span className="badge bg-danger rounded-pill px-2 py-1 x-small">3</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {[
                { title: 'Unread Notifications', desc: '12 pending notifications from admin', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
                { title: 'Attendance Alerts', desc: '5 students marked absent without reason', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
                { title: 'Fee Alerts', desc: '340 students have pending fee > 30 days', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                { title: 'Exam Alerts', desc: 'Mid-term exams start in 2 weeks', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
              ].map((notif, idx) => (
                <motion.div
                  className="p-3 rounded-4 d-flex align-items-start gap-3"
                  style={{ background: notif.bg, border: `1px solid ${notif.color}20` }}
                  key={notif.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '10px', height: '10px', background: notif.color, marginTop: '4px' }} />
                  <div>
                    <div className="small fw-bold" style={{ color: textColor }}>{notif.title}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{notif.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ems-welcome-hero {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%) !important;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 15px 35px -8px rgba(99, 102, 241, 0.35) !important;
          transition: all 0.3s ease;
        }
        .premium-hero-content {
          position: relative;
          z-index: 2;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 1;
        }
        .hero-blob-1 {
          width: 300px;
          height: 300px;
          background: #c084fc;
          top: -120px;
          right: -60px;
          animation: heroFloat 12s infinite alternate ease-in-out;
        }
        .hero-blob-2 {
          width: 250px;
          height: 250px;
          background: #38bdf8;
          bottom: -100px;
          left: 20%;
          animation: heroFloat2 15s infinite alternate ease-in-out;
        }
        .hero-blob-3 {
          width: 180px;
          height: 180px;
          background: #fb7185;
          top: 30%;
          left: -80px;
          animation: heroFloat 9s infinite alternate-reverse ease-in-out;
        }
        @keyframes heroFloat {
          0% { transform: translateY(0) translateX(0) scale(1); }
          100% { transform: translateY(25px) translateX(15px) scale(1.1); }
        }
        @keyframes heroFloat2 {
          0% { transform: translateY(0) translateX(0) scale(1); }
          100% { transform: translateY(-20px) translateX(-10px) scale(1.05); }
        }
        .animate-pulse-badge {
          animation: pulseBadge 2s infinite;
        }
        @keyframes pulseBadge {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .premium-stat-card {
          transition: all 0.25s ease;
        }
        .premium-stat-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.12) !important;
        }
        .premium-quick-action {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.95)) !important;
        }
        .premium-quick-action:hover {
          box-shadow: 0 12px 24px rgba(99,102,241,0.14) !important;
          border-color: rgba(99,102,241,0.2) !important;
          transform: translateY(-3px);
        }
        .premium-quick-action:hover .premium-action-icon {
          transform: scale(1.05);
        }
        .premium-quick-action:hover .premium-action-arrow {
          opacity: 1 !important;
          transform: translateX(2px);
        }
        .premium-action-icon {
          transition: all 0.25s ease;
        }
        .premium-action-arrow {
          transition: all 0.25s ease;
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
        }
        .x-small {
          font-size: 11px;
        }
        .skeleton-card {
          border-radius: 18px;
        }
        .skeleton-line {
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .premium-select:focus, .premium-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
        }
        .premium-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
        }
        .premium-btn-outline:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'} !important;
          border-color: #6366f1 !important;
        }
      `}} />
    </div>
  );
};

const KPICard = ({ title, value, icon, color, subText, trend, trendValue }) => {
  return (
    <motion.div
      className="col-xl col-lg-4 col-md-6"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card border-0 shadow-sm h-100 hover-lift transition" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)' }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ background: `${color}15`, color, boxShadow: `inset 0 0 0 1px ${color}14` }}>
              <FontAwesomeIcon icon={icon} size="lg" />
            </div>
            {trend && (
              <div className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1" style={{ fontSize: '10px' }}>
                <FontAwesomeIcon icon={faArrowUp} className="me-1" style={{ fontSize: '8px' }} />
                {trendValue}
              </div>
            )}
          </div>
          <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '10.5px', letterSpacing: '0.3px' }}>{title}</div>
          <div className="h3 fw-bold mb-1" style={{ fontSize: '22px' }}>{value}</div>
          <div className="text-muted x-small" style={{ fontSize: '10.5px' }}>{subText}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmsDashboard;
