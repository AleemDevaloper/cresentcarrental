import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faUserCheck, faFileInvoice, faSitemap, 
  faArrowUp, faCalendarCheck, faUserPlus,
  faCheckCircle, faClock, faExclamationTriangle,
  faMoneyBillWave, faBriefcase,
  faUserSlash, faSearch, faGift, faEnvelope,
  faPenToSquare, faSun, faMoon,
  faChartBar, faBuilding, faBell, faFilter,
  faArrowRight, faChevronRight, faRotate,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { 
  getHrDashboard, 
  getHrWorkforceSummary,
  getHrLiveAttendance,
  getHrDashboardAnalytics,
  getHrDashboardDepartments,
  getHrDashboardCompliance,
  getHrDashboardCelebrations
} from '../../../api/hrms';

// Register ChartJS components
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

const HrmsOverview = () => {
  const { t } = useTranslation();
  const { theme, setActiveTab, currentUser, toggleTheme } = useApp();
  
  // Dashboard states
  const [data, setData] = useState(null);
  const [workforce, setWorkforce] = useState(null);
  const [livePunches, setLivePunches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [depts, setDepts] = useState([]);
  const [compliance, setCompliance] = useState(null);
  const [celebrations, setCelebrations] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company_id: '',
    branch_id: '',
    department: '',
    designation: '',
    employment_type: '',
    status: '',
  });

  const isDark = theme === 'dark';

  // Load all dashboard metrics
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        dashRes,
        workforceRes,
        liveRes,
        analyticsRes,
        deptRes,
        compRes,
        celebRes
      ] = await Promise.all([
        getHrDashboard(filters),
        getHrWorkforceSummary(filters),
        getHrLiveAttendance(filters),
        getHrDashboardAnalytics(filters),
        getHrDashboardDepartments(filters),
        getHrDashboardCompliance(filters),
        getHrDashboardCelebrations(filters)
      ]);

      setData(dashRes);
      setWorkforce(workforceRes);
      setLivePunches(liveRes?.live_punches || []);
      setAnalytics(analyticsRes);
      setDepts(deptRes?.departments || []);
      setCompliance(compRes);
      setCelebrations(celebRes);
    } catch (err) {
      console.error("Error loading HRMS Dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh live data every 30 seconds
    const interval = setInterval(() => {
      getHrLiveAttendance(filters).then(res => {
        if (res?.live_punches) setLivePunches(res.live_punches);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [filters, loadDashboardData]);

  const handleApplyFilters = () => {
    loadDashboardData();
  };

  const handleResetFilters = () => {
    setFilters({
      company_id: '',
      branch_id: '',
      department: '',
      designation: '',
      employment_type: '',
      status: '',
    });
  };


  // --- Charts configurations ---
  const attTrendData = {
    labels: analytics?.attendance_trend?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: t('present') || 'Present %',
        data: analytics?.attendance_trend?.present || [95, 94, 96, 92, 95, 88, 70],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('late') || 'Late %',
        data: analytics?.attendance_trend?.late || [4, 5, 3, 6, 4, 10, 15],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const compData = {
    labels: ['Permanent', 'Contract', 'Probation', 'Intern', 'Consultant'],
    datasets: [
      {
        data: [
          analytics?.employee_composition?.permanent || 60,
          analytics?.employee_composition?.contract || 20,
          analytics?.employee_composition?.probation || 10,
          analytics?.employee_composition?.intern || 7,
          analytics?.employee_composition?.consultant || 3,
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6b7280'],
        borderWidth: 0,
      }
    ]
  };

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
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
          <div className="col-lg-8">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
          <div className="col-lg-4">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`hrms-dashboard-container p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      {/* 3. Premium Welcome Hero Section */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 text-white rounded-4 h-100 p-0 shadow-sm hrms-welcome-hero" style={{ borderRadius: '18px', overflow: 'hidden' }}>
            {/* Animated aurora blobs */}
            <div className="hero-blob hero-blob-1" />
            <div className="hero-blob hero-blob-2" />
            <div className="hero-blob hero-blob-3" />
            <div className="p-4 premium-hero-content">
              <div className="d-flex flex-column h-100">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge text-white px-3 py-1.5 rounded-pill x-small fw-bold d-flex align-items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <span className="live-dot" style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                    System Online
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill x-small fw-semibold" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <FontAwesomeIcon icon={faBuilding} className="me-1" style={{ fontSize: '9px' }} />
                    HQ Workspace
                  </span>
                  <span className="badge bg-success bg-opacity-75 text-white px-3 py-1.5 rounded-pill x-small fw-bold animate-pulse-badge">
                    Live
                  </span>
                </div>
                
                <div className="row align-items-center g-4 flex-grow-1">
                  <div className="col-md-7">
                    <h2 className="fw-bold mb-2" style={{ fontSize: '28px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                      Welcome back, {currentUser?.name?.split(' ')[0] || 'HR Executive'}
                      <span className="d-inline-block" style={{ animation: 'waveHand 2s infinite' }}> 👋</span>
                    </h2>
                    <p className="text-white-50 mb-4" style={{ fontSize: '13.5px', fontWeight: '500', maxWidth: '500px', lineHeight: 1.6 }}>
                      Track employees, attendance compliance, payroll readiness, approval queues, and workforce insights from one intelligent command dashboard.
                    </p>
                    
                    <div className="d-flex flex-wrap gap-2.5 mt-2">
                      <button 
                        onClick={() => setActiveTab('hrms_health_dashboard')}
                        className="btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white border-0 hover-lift d-flex align-items-center gap-2"
                        style={{ fontSize: '12.5px', background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
                      >
                        <FontAwesomeIcon icon={faChartBar} />
                        View Health Dashboard
                      </button>
                      
                      <button 
                        onClick={toggleTheme}
                        className="btn btn-sm px-4 py-2 fw-semibold rounded-pill text-white hover-lift d-flex align-items-center gap-2"
                        style={{ fontSize: '12.5px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-5">
                    <div className="row g-2">
                      {[
                        { label: 'Present Today', value: data?.attendance_today?.present || 0, color: '#4ade80' },
                        { label: 'Absent Today', value: data?.attendance_today?.absent || 0, color: '#fb7185' },
                        { label: 'Pending Leaves', value: data?.approvals_queue?.leave_requests || 0, color: '#fbbf24' },
                        { label: 'New Joiners', value: data?.workforce_snapshot?.new_joiners_this_month || 0, color: '#60a5fa' },
                      ].map(stat => (
                        <div className="col-6" key={stat.label}>
                          <div className="p-3 rounded-3 text-center premium-stat-card" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="h3 fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="x-small text-white-50 fw-semibold mt-1">{stat.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 rounded-3 d-flex align-items-center justify-content-between" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="x-small text-white-50"><FontAwesomeIcon icon={faBell} className="me-1" /> {compliance?.alerts?.length || 0} compliance alerts</span>
                      <span className="x-small text-white-50 fw-semibold" style={{ opacity: 0.6 }}><FontAwesomeIcon icon={faChevronRight} /></span>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-white" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <FontAwesomeIcon icon={faBuilding} className="me-1" style={{ fontSize: '9px' }} /> HQ Company
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <FontAwesomeIcon icon={faLayerGroup} className="me-1" style={{ fontSize: '9px' }} /> HR Department
                  </span>
                  <span className="badge text-white-50 px-3 py-1.5 rounded-pill fw-semibold x-small" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <FontAwesomeIcon icon={faUserCheck} className="me-1" style={{ fontSize: '9px' }} /> Administrator Role
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Workforce Composition Widget */}
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 p-4 premium-composition-card ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px' }}>Workforce Composition</h5>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1.5 x-small fw-semibold d-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '9px' }} /> {workforce?.summary?.total || 0} Total
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-center mb-2" style={{ height: '140px' }}>
              <div className="position-relative" style={{ width: '130px', height: '130px' }}>
                <Doughnut 
                  data={compData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    cutout: '78%',
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    elements: { arc: { borderRadius: 4 } }
                  }} 
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <div className="h4 fw-bold mb-0 lh-1">{workforce?.summary?.total || 0}</div>
                  <div className="text-muted x-small" style={{ fontSize: '10px' }}>Employees</div>
                </div>
              </div>
            </div>
            <div className="row text-center g-1 mt-1">
              {[
                { label: 'Permanent', value: workforce?.composition?.permanent || 0, color: '#10b981' },
                { label: 'Contract', value: workforce?.composition?.contract || 0, color: '#3b82f6' },
                { label: 'Probation', value: workforce?.composition?.probation || 0, color: '#f59e0b' },
              ].map(item => (
                <div className="col" key={item.label}>
                  <div className="fw-bold small" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-muted x-small">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Premium Global Filters */}
      <div className={`card border-0 rounded-4 mb-4 premium-filter-bar ${isDark ? 'bg-dark border-1 border-secondary' : ''}`} style={{ borderRadius: '18px' }}>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-2 px-1">
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-primary" style={{ fontSize: '12px' }} />
              <span className="x-small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Dashboard Filters</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="x-small text-muted d-flex align-items-center gap-1">
                <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                Auto-refresh 30s
              </span>
            </div>
          </div>
          <div className="row g-2 align-items-end">
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block">Company</label>
              <select 
                className="form-select form-select-sm premium-select" 
                value={filters.company_id}
                onChange={e => setFilters({...filters, company_id: e.target.value})}
              >
                <option value="">All Companies</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block">Branch</label>
              <select 
                className="form-select form-select-sm premium-select"
                value={filters.branch_id}
                onChange={e => setFilters({...filters, branch_id: e.target.value})}
              >
                <option value="">All Branches</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block">Department</label>
              <select 
                className="form-select form-select-sm premium-select"
                value={filters.department}
                onChange={e => setFilters({...filters, department: e.target.value})}
              >
                <option value="">All Departments</option>
                {depts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block">Employment Type</label>
              <select 
                className="form-select form-select-sm premium-select"
                value={filters.employment_type}
                onChange={e => setFilters({...filters, employment_type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="probation">Probation</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="x-small text-muted fw-semibold mb-1 d-block">Search</label>
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y ms-2 text-muted" style={{ left: '5px', zIndex: 5 }}>
                  <FontAwesomeIcon icon={faSearch} size="xs" />
                </span>
                <input 
                  type="text" 
                  className="form-control form-control-sm ps-4 premium-input" 
                  placeholder="Search Employee..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2 d-flex gap-1">
              <button className="btn btn-sm btn-primary flex-grow-1 fw-semibold premium-btn-primary" onClick={handleApplyFilters}>
                <FontAwesomeIcon icon={faFilter} className="me-1" style={{ fontSize: '10px' }} /> Apply
              </button>
              <button className="btn btn-sm btn-outline-secondary border premium-btn-outline" onClick={handleResetFilters}>
                <FontAwesomeIcon icon={faRotate} style={{ fontSize: '10px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Premium Quick Actions */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Add Employee', icon: faUserPlus, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', tab: 'hrms_employee_database', desc: 'New hire onboarding' },
          { label: 'Mark Attendance', icon: faCheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)', tab: 'hrms_checkin_checkout', desc: 'Quick check-in' },
          { label: 'Create Leave', icon: faCalendarCheck, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', tab: 'hrms_leaves', desc: 'Request time off' },
          { label: 'Corrections', icon: faPenToSquare, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', tab: 'hrms_attendance_correction', desc: 'Fix attendance' },
          { label: 'Run Payroll', icon: faMoneyBillWave, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', tab: 'hrms_payroll_dashboard', desc: 'Process payroll' },
          { label: 'Recruitment', icon: faBriefcase, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', tab: 'hrms_recruitment', desc: 'Hire talent' },
          { label: 'Org Chart', icon: faSitemap, color: '#1e293b', bg: 'rgba(30,41,59,0.05)', tab: 'hrms_org', desc: 'View structure' }
        ].map(act => (
          <div className="col-6 col-md-3 col-xl" key={act.label}>
            <button 
              className="btn w-100 py-3 rounded-4 border-0 premium-quick-action d-flex align-items-center gap-3 h-100 text-start"
              onClick={() => setActiveTab(act.tab)}
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
            >
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 premium-action-icon" style={{ width: '40px', height: '40px', background: act.bg }}>
                <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '16px' }} />
              </div>
              <div className="overflow-hidden">
                <div className="small fw-bold text-nowrap" style={{ color: isDark ? '#f1f5f9' : '#1e293b', fontSize: '12.5px' }}>{act.label}</div>
                <div className="x-small text-muted text-nowrap" style={{ fontSize: '10.5px' }}>{act.desc}</div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="ms-auto flex-shrink-0 premium-action-arrow" style={{ color: act.color, fontSize: '11px', opacity: 0.4 }} />
            </button>
          </div>
        ))}
      </div>

      {/* 6. Workforce Snapshot (6 KPI Cards) */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Total Workforce" 
            value={workforce?.summary?.total || 0} 
            trend="up" 
            trendValue="4.8%" 
            icon={faUsers} 
            color="primary"
            subText="Growth this month"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Active Employees" 
            value={data?.workforce_snapshot?.active_employees || 0} 
            trend="up" 
            trendValue="92%" 
            icon={faUserCheck} 
            color="success"
            subText="Permanent & Contract"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Inactive Employees" 
            value={data?.workforce_snapshot?.inactive_employees || 0} 
            icon={faUserSlash} 
            color="secondary"
            subText="Resigned & Retired"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="New Joiners" 
            value={data?.workforce_snapshot?.new_joiners_this_month || 0} 
            icon={faUserPlus} 
            color="info"
            subText="Joined this month"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="On Probation" 
            value={data?.workforce_snapshot?.employees_on_probation || 0} 
            icon={faClock} 
            color="warning"
            subText="Under review"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Notice Period" 
            value={data?.workforce_snapshot?.notice_period || 0} 
            icon={faExclamationTriangle} 
            color="danger"
            subText="Clearance pending"
          />
        </div>
      </div>

      {/* 7. Attendance Overview & Live Attendance Status */}
      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Attendance Overview</h5>
            <div className="row g-3">
              {[
                { title: 'Present Today', value: data?.attendance_today?.present || 0, color: 'success' },
                { title: 'Absent Today', value: data?.attendance_today?.absent || 0, color: 'danger' },
                { title: 'Late Arrivals', value: data?.attendance_today?.late || 0, color: 'warning' },
                { title: 'Half Days', value: data?.attendance_today?.half_day || 0, color: 'info' },
                { title: 'On Leave', value: data?.attendance_today?.on_leave || 0, color: 'secondary' },
                { title: 'Outdoor Duty', value: data?.attendance_today?.outdoor_duty || 0, color: 'primary' },
                { title: 'WFH', value: data?.attendance_today?.wfh || 0, color: 'success' },
                { title: 'Missing Checkouts', value: data?.attendance_today?.missing_checkout || 0, color: 'danger' }
              ].map(att => (
                <div className="col-6 col-md-3" key={att.title}>
                  <div className="p-3 rounded-4 bg-light text-center border">
                    <div className="text-muted x-small fw-bold">{att.title}</div>
                    <div className={`h3 fw-bold mb-0 text-${att.color}`}>{att.value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chart */}
            <div className="mt-4" style={{ height: '220px' }}>
              <Line 
                data={attTrendData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
                }} 
              />
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Live Attendance Status</h5>
            <div className="overflow-auto" style={{ maxHeight: '350px' }}>
              {livePunches.length === 0 ? (
                <div className="text-center py-5 text-muted">No live punches today</div>
              ) : (
                livePunches.map(p => (
                  <div className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom" key={p.id}>
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px' }}>
                      {p.employee_name.charAt(0)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="small fw-bold">{p.employee_name}</div>
                      <div className="x-small text-muted">{p.device} | {p.gps_location !== 'N/A' ? 'GPS Valid' : 'Manual'}</div>
                    </div>
                    <div className="text-end">
                      <span className={`badge bg-${p.status === 'present' ? 'success' : 'warning'}-subtle text-${p.status === 'present' ? 'success' : 'warning'} rounded-pill x-small`}>
                        {p.clock_in}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Department Analytics */}
      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">Department Headcount</h5>
            <p className="text-muted small mb-4">Workforce distribution by department</p>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Department</th>
                    <th>Current</th>
                    <th>Budgeted</th>
                    <th>Vacant</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.map(dept => (
                    <tr key={dept.id}>
                      <td className="fw-bold small">{dept.name}</td>
                      <td>{dept.current_headcount}</td>
                      <td>{dept.budgeted_headcount}</td>
                      <td className="text-danger">{dept.vacant_positions}</td>
                      <td>
                        <span className="badge bg-success-subtle text-success rounded-pill">
                          {dept.attendance_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* HR Approval Center */}
        <div className="col-xl-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">HR Approval Queue</h5>
            <p className="text-muted small mb-4">Pending authorizations requiring immediate actions</p>
            <div className="row g-3">
              {[
                { title: 'Leave Requests', count: data?.approvals_queue?.leave_requests || 0, color: 'warning', icon: faCalendarCheck },
                { title: 'Expense Claims', count: data?.approvals_queue?.expense_claims || 0, color: 'success', icon: faMoneyBillWave },
                { title: 'Loan Requests', count: data?.approvals_queue?.loan_requests || 0, color: 'primary', icon: faFileInvoice },
                { title: 'Exit Clearances', count: data?.approvals_queue?.asset_clearances || 0, color: 'danger', icon: faUserSlash }
              ].map(app => (
                <div className="col-md-6" key={app.title}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light border">
                    <div className={`p-3 rounded-3 bg-${app.color}-subtle text-${app.color}`}>
                      <FontAwesomeIcon icon={app.icon} />
                    </div>
                    <div>
                      <div className="x-small text-muted fw-bold">{app.title}</div>
                      <div className="h4 fw-bold mb-0">{app.count} Pending</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 9. Celebrations Center */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Today's Birthdays 🎂</h5>
            <div className="d-flex flex-column gap-3">
              {celebrations?.birthdays?.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No birthdays today</p>
              ) : (
                celebrations?.birthdays?.map(b => (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border" key={b.id}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <div className="small fw-bold">{b.name}</div>
                        <div className="x-small text-muted">{b.department} | {b.designation}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-primary-subtle text-primary border-0 rounded-circle" title="Send Email">
                        <FontAwesomeIcon icon={faEnvelope} />
                      </button>
                      <button className="btn btn-sm btn-success-subtle text-success border-0 rounded-circle" title="Send Wishes">
                        <FontAwesomeIcon icon={faGift} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Work Anniversaries 🏅</h5>
            <div className="d-flex flex-column gap-3">
              {celebrations?.anniversaries?.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No anniversaries today</p>
              ) : (
                celebrations?.anniversaries?.map(a => (
                  <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border" key={a.id}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div className="small fw-bold">{a.name}</div>
                        <div className="x-small text-muted">{a.department} | {a.years_completed} Years Completed</div>
                      </div>
                    </div>
                    <span className="badge bg-success text-white rounded-pill px-3 py-2 small">
                      {a.years_completed >= 5 ? 'Gold Star' : 'Bronze'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 10. Compliance Center & Document Alerts */}
      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Compliance Center</h5>
          <span className="badge bg-danger text-white rounded-pill px-3 py-1">Score: {compliance?.compliance_score || 95}%</span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th>Employee</th>
                <th>Document Type</th>
                <th>Expiry Date</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {compliance?.alerts?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">All documents are compliant and verified.</td>
                </tr>
              ) : (
                compliance?.alerts?.map(alert => (
                  <tr key={alert.id}>
                    <td className="fw-bold small">{alert.employee_name}</td>
                    <td>{alert.document_type}</td>
                    <td className="text-danger">{alert.expiry_date}</td>
                    <td>
                      <span className={`badge bg-${alert.verification_status === 'verified' ? 'success' : 'warning'}-subtle text-${alert.verification_status === 'verified' ? 'success' : 'warning'} rounded-pill`}>
                        {alert.verification_status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-light border px-2 py-1">Notify</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hrms-welcome-hero {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%) !important;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 15px 35px -8px rgba(79, 70, 229, 0.35) !important;
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
        @keyframes waveHand {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
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
        .premium-composition-card {
          transition: all 0.3s ease;
        }
        .premium-composition-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        .premium-filter-bar {
          background: ${isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.85)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .premium-select, .premium-input {
          border-radius: 10px !important;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} !important;
          background: ${isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'} !important;
          font-size: 12.5px !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
        }
        .premium-select:focus, .premium-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
        }
        .premium-btn-primary {
          border-radius: 10px !important;
          font-size: 12px !important;
          padding: 8px 16px !important;
          background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
          border: none !important;
          transition: all 0.25s ease !important;
        }
        .premium-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.3) !important;
        }
        .premium-btn-outline {
          border-radius: 10px !important;
          font-size: 12px !important;
          padding: 8px 12px !important;
          transition: all 0.2s ease !important;
        }
        .premium-btn-outline:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'} !important;
          border-color: #6366f1 !important;
        }
        .premium-quick-action {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border-radius: 14px !important;
        }
        .premium-quick-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
          border-color: transparent !important;
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
        .x-small {
          font-size: 11px;
        }
        .skeleton-card {
          background-color: ${isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6'};
          border-radius: 18px;
        }
        .skeleton-line {
          background-color: ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'};
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
        }
        .transition {
          transition: all 0.2s ease-in-out;
        }
      `}} />
    </div>
  );
};

// --- Sub-components ---
const KPICard = ({ title, value, trend, trendValue, icon, color, subText }) => {
  return (
    <div className="card border-0 shadow-sm h-100 hover-lift transition" style={{ borderRadius: '18px' }}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`p-3 rounded-3 bg-${color}-subtle text-${color}`}>
            <FontAwesomeIcon icon={icon} size="lg" />
          </div>
          {trend && (
            <div className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1">
              <FontAwesomeIcon icon={faArrowUp} className="me-1" />
              {trendValue}
            </div>
          )}
        </div>
        <div className="text-muted small fw-bold text-uppercase mb-1">{title}</div>
        <div className="h3 fw-bold mb-1">{value}</div>
        <div className="text-muted x-small">{subText}</div>
      </div>
    </div>
  );
};



export default HrmsOverview;
