import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faChartPie,
  faUsers,
  faChevronDown,
  faChevronRight,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faFire,
  faCubes,
  faSitemap,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faEllipsisVertical,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { listDeptTasks } from '../../../../api/tms';

const AnalyticsWidget = ({ title, value, change, isPositive, icon, color, isDark, styles }) => (
  <div className={`card border-0 rounded-4 h-100 transition-all hover-lift ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
       style={{
         border: 'var(--panel-border)',
         boxShadow: 'var(--panel-shadow)'
       }}>
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="rounded-4 d-flex align-items-center justify-content-center shadow-sm"
             style={{ width: '48px', height: '48px', backgroundColor: `${color}1a`, color: color }}>
          <FontAwesomeIcon icon={icon} className="fs-5" />
        </div>
        <span className={`badge rounded-pill ${isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2 py-1 x-small fw-bold`}>
          <FontAwesomeIcon icon={isPositive ? faArrowUp : faArrowDown} className="me-1" />
          {change}%
        </span>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <p className={`${styles.textMuted} small fw-semibold mb-0 text-uppercase letter-spacing-wider`}>{title}</p>
    </div>
  </div>
);

const TmsDeptTaskMgmt = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState('Engineering');

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listDeptTasks({ department: selectedDept });
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch department tasks', err);
      setError(err.response?.data?.message || err.message || 'Failed to load department task data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDept]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" size="2x" />
        <p className="text-danger mb-3">{error}</p>
        <button className="btn btn-primary rounded-pill px-4" onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!data) return null;

  const styles = {
    cardBg: isDark ? 'bg-dark-card' : 'bg-white',
    textMain: isDark ? 'text-white' : 'text-dark',
    textMuted: isDark ? 'text-white-50' : 'text-muted',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
    subtleBg: isDark ? 'bg-dark-subtle-custom' : 'bg-light-subtle-custom',
  };

  const departments = data.departments || ['Engineering', 'Product', 'Design', 'Marketing', 'Sales'];
  const workloadData = data.workload || [
    { name: 'Ahmed Khan', load: 85, tasks: 12, status: 'Overloaded' },
    { name: 'Sarah Wilson', load: 45, tasks: 6, status: 'Optimal' },
    { name: 'Ali Raza', load: 92, tasks: 15, status: 'Overloaded' },
    { name: 'Emma Watson', load: 30, tasks: 4, status: 'Available' },
    { name: 'Hamza Malik', load: 60, tasks: 8, status: 'Optimal' }
  ];
  const stats = data.stats || {};
  const blockers = data.blockers || [
    { title: 'API Gateway Timeout', severity: 'High', color: '#ef4444' },
    { title: 'Figma Asset Export Delay', severity: 'Medium', color: '#f59e0b' }
  ];
  const efficiency = data.efficiency ?? 84;
  const completedRatio = data.completed_ratio ?? { done: 48, total: 60 };
  const aiMessage = data.ai_message || 'Based on current workload, Engineering might need 2 more developers for the next sprint.';

  const getLoadColor = (load) => {
    if (load > 80) return '#ef4444';
    if (load > 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className={`container-fluid py-4 fade-in dept-mgmt-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className="row mb-4 align-items-center g-4">
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary">
              <FontAwesomeIcon icon={faBuilding} className="fs-4" />
            </div>
            <div>
              <div className="dropdown">
                <select
                  className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 ${styles.textMain} h2 fw-bold border-0 shadow-none bg-transparent`}
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{ fontSize: '2rem', fontWeight: 'bold' }}
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <p className={`${styles.textMuted} mb-0`}>Operational command center for department performance</p>
            </div>
          </div>
        </div>
        <div className="col-lg-5 text-lg-end">
          <div className="d-flex gap-2 justify-content-lg-end">
             <button className="btn btn-white rounded-pill px-4 fw-bold shadow-sm border">
                <FontAwesomeIcon icon={faSitemap} className="me-2 text-primary" /> View Hierarchy
             </button>
             <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                <FontAwesomeIcon icon={faChartPie} className="me-2" /> Global Report
             </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-sm-6">
          <AnalyticsWidget title="Total Tasks" value={String(stats.total_tasks ?? 142)} change={String(stats.total_change ?? 12)} isPositive={stats.total_positive ?? true} icon={faCubes} color="#4f46e5" isDark={isDark} styles={styles} />
        </div>
        <div className="col-xl-3 col-sm-6">
          <AnalyticsWidget title="SLA Compliance" value={`${stats.sla_compliance ?? 94.2}%`} change={String(stats.sla_change ?? 3)} isPositive={stats.sla_positive ?? true} icon={faCheckCircle} color="#10b981" isDark={isDark} styles={styles} />
        </div>
        <div className="col-xl-3 col-sm-6">
          <AnalyticsWidget title="Resource Load" value={`${stats.resource_load ?? 78}%`} change={String(stats.load_change ?? 5)} isPositive={stats.load_positive ?? false} icon={faFire} color="#f59e0b" isDark={isDark} styles={styles} />
        </div>
        <div className="col-xl-3 col-sm-6">
          <AnalyticsWidget title="Avg Completion" value={`${stats.avg_completion ?? 4.2}d`} change={String(stats.completion_change ?? 8)} isPositive={stats.completion_positive ?? true} icon={faClock} color="#0ea5e9" isDark={isDark} styles={styles} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className={`card border-0 rounded-5 shadow-lg h-100 ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                  <h5 className="fw-bold mb-1">Team Workload Heatmap</h5>
                  <p className={`${styles.textMuted} small mb-0`}>Real-time resource capacity and task distribution</p>
                </div>
                <div className="d-flex gap-2">
                  <span className="x-small fw-bold d-flex align-items-center gap-1"><span className="rounded-circle" style={{ width: '8px', height: '8px', background: '#10b981' }}></span> Available</span>
                  <span className="x-small fw-bold d-flex align-items-center gap-1"><span className="rounded-circle" style={{ width: '8px', height: '8px', background: '#ef4444' }}></span> Overloaded</span>
                </div>
              </div>

              <div className="space-y-5">
                {workloadData.map((user, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold x-small shadow-sm`} style={{ width: '32px', height: '32px' }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`small fw-bold ${styles.textMain}`}>{user.name}</div>
                          <div className={`x-small ${styles.textMuted}`}>{user.tasks} active tasks</div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="small fw-bold" style={{ color: getLoadColor(user.load) }}>{user.load}% Load</div>
                        <div className={`x-small text-uppercase fw-bold letter-spacing-wider opacity-75`}>{user.status}</div>
                      </div>
                    </div>
                    <div className="progress rounded-pill shadow-inner" style={{ height: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{ width: `${user.load}%`, backgroundColor: getLoadColor(user.load) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className={`card border-0 rounded-5 shadow-lg mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-opacity-10">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-4 bg-gradient-primary-soft p-2 text-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
                    <FontAwesomeIcon icon={faChartLine} className="fs-5" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 fs-5">Productivity Insights</h6>
                    <div className="d-flex align-items-center gap-2">
                       <span className="badge bg-primary bg-opacity-10 text-primary x-small rounded-pill px-2 border border-primary border-opacity-10">Operational AI</span>
                       <div className="d-flex align-items-center gap-1">
                          <span className="pulse-dot-green"></span>
                          <p className="x-small text-muted mb-0 opacity-75">Live • {data.last_updated || '2m ago'}</p>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="dropdown">
                  <button className={`btn btn-sm rounded-circle shadow-sm ${isDark ? 'btn-dark border-white border-opacity-10' : 'btn-light border'}`} style={{ width: '36px', height: '36px' }}>
                    <FontAwesomeIcon icon={faEllipsisVertical} className="x-small" />
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-4 mb-4 ${isDark ? 'bg-dark bg-opacity-25' : 'bg-light'}`}>
                 <div className="text-center">
                    <div className="h1 fw-bold mb-0 text-primary">{efficiency}%</div>
                    <div className={`small fw-bold ${styles.textMuted}`}>Overall Efficiency</div>
                 </div>
                 <div className="mt-4 space-y-3">
                    <div className="d-flex justify-content-between x-small">
                       <span className={styles.textMuted}>Tasks Completed</span>
                       <span className="fw-bold">{completedRatio.done}/{completedRatio.total}</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '4px' }}>
                       <div className="progress-bar bg-primary" style={{ width: `${Math.round((completedRatio.done / (completedRatio.total || 1)) * 100)}%` }}></div>
                    </div>
                 </div>
              </div>

              <h6 className="fw-bold mb-3 small text-uppercase letter-spacing-wider opacity-75">Recent Blockers</h6>
              <div className="space-y-3">
                {blockers.map((b, i) => (
                  <div key={i} className={`p-3 rounded-4 border transition hover-lift cursor-pointer ${isDark ? 'bg-white bg-opacity-5 border-white border-opacity-10' : 'bg-white border-secondary border-opacity-10 shadow-sm'}`}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px', backgroundColor: `${b.color}20`, color: b.color }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="x-small" />
                      </div>
                      <div className="flex-grow-1">
                        <div className={`x-small fw-bold ${styles.textMain}`}>{b.title}</div>
                        <div className={`x-small ${styles.textMuted}`}>{b.severity} Priority</div>
                      </div>
                      <FontAwesomeIcon icon={faChevronRight} className={`x-small opacity-50 ${styles.textMuted}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 rounded-5 shadow-lg bg-primary text-white overflow-hidden transition hover-lift">
             <div className="card-body p-4 position-relative">
                <FontAwesomeIcon icon={faCubes} className="position-absolute top-50 end-0 translate-middle-y opacity-25" style={{ fontSize: '10rem', marginRight: '-2rem' }} />
                <h6 className="fw-bold mb-2">Resource Planning AI</h6>
                <p className="small text-white text-opacity-75 mb-3">{aiMessage}</p>
                <button className="btn btn-white btn-sm rounded-pill px-3 fw-bold shadow-sm">Review Recommendations</button>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .dept-mgmt-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .bg-dark-subtle-custom { background-color: rgba(30, 41, 59, 0.5) !important; }
        .bg-light-subtle-custom { background-color: rgba(248, 250, 252, 0.8) !important; }
        .bg-gradient-primary-soft { background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%); }
        .pulse-dot-green {
          width: 8px;
          height: 8px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          position: relative;
        }
        .pulse-dot-green::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #10b981;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .rounded-5 { border-radius: 2rem !important; }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        .btn-white { background: white; border: none; }
        .btn-white:hover { background: #f8fafc; }
        .space-y-3 > *:not(:last-child) { margin-bottom: 1rem; }
        .space-y-4 > *:not(:last-child) { margin-bottom: 1.5rem; }
        .space-y-5 > *:not(:last-child) { margin-bottom: 2rem; }
      `}</style>
    </div>
  );
};

export default TmsDeptTaskMgmt;
