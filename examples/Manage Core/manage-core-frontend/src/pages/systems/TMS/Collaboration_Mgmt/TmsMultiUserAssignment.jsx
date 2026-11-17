import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTag,
  faUsers,
  faCheckCircle,
  faSearch,
  faPlus,
  faEllipsisV,
  faHistory,
  faChartPie,
  faLayerGroup,
  faShieldAlt,
  faInfoCircle,
  faRobot,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { listMultiAssignment, createMultiAssignment } from '../../../../api/tms';

const UserRow = ({ user, roles, isDark, styles }) => {
  return (
    <tr className={`align-middle ${isDark ? 'border-white border-opacity-5' : 'border-light'}`}>
      <td className="ps-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold x-small text-white shadow-sm`}
               style={{ width: '36px', height: '36px', backgroundColor: user.color }}>
            {user.avatar}
          </div>
          <div>
            <div className={`small fw-bold ${styles.textMain}`}>{user.name}</div>
            <div className={`x-small ${styles.textMuted}`}>{user.designation}</div>
          </div>
        </div>
      </td>
      {roles.map((role, i) => (
        <td key={i} className="text-center">
          <div className={`mx-auto rounded-circle d-flex align-items-center justify-content-center cursor-pointer transition-all hover-scale ${user.roles?.includes(role) ? 'bg-primary text-white shadow-sm' : (isDark ? 'bg-white bg-opacity-5 text-white-50' : 'bg-light text-muted')}`}
               style={{ width: '32px', height: '32px' }}>
            {user.roles?.includes(role) ? <FontAwesomeIcon icon={faCheckCircle} className="small" /> : <div className="rounded-circle border border-2 opacity-25" style={{ width: '12px', height: '12px' }}></div>}
          </div>
        </td>
      ))}
      <td className="text-center">
        <div className="d-flex flex-column align-items-center gap-1">
          <div className="progress rounded-pill w-75" style={{ height: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <div className={`progress-bar ${user.capacity > 80 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${user.capacity}%` }}></div>
          </div>
          <span className={`x-small fw-bold ${user.capacity > 80 ? 'text-danger' : 'text-success'}`}>{user.capacity}%</span>
        </div>
      </td>
      <td className="pe-4 text-end">
        <button className={`btn btn-sm p-0 border-0 ${styles.textMuted}`}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </td>
    </tr>
  );
};

const TmsMultiUserAssignment = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeTask, setActiveTask] = useState('Task #412: Frontend Refactor');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listMultiAssignment();
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch multi-assignment data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load multi-assignment data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const styles = {
    cardBg: isDark ? 'bg-dark-card' : 'bg-white',
    textMain: isDark ? 'text-white' : 'text-dark',
    textMuted: isDark ? 'text-white-50' : 'text-muted',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
    subtleBg: isDark ? 'bg-dark-subtle-custom' : 'bg-light-subtle-custom',
  };

  const roles = data?.roles || ['Owner', 'Contributor', 'Reviewer', 'QA', 'Observer'];
  const users = data?.users || [
    { name: 'Ahmed Khan', avatar: 'AK', color: '#4f46e5', designation: 'Senior Developer', roles: ['Owner', 'Contributor'], capacity: 85 },
    { name: 'Sarah Wilson', avatar: 'SW', color: '#ec4899', designation: 'UI/UX Designer', roles: ['Reviewer'], capacity: 40 },
    { name: 'Ali Raza', avatar: 'AR', color: '#10b981', designation: 'Backend Engineer', roles: ['Contributor'], capacity: 92 },
    { name: 'Hamza Malik', avatar: 'HM', color: '#f59e0b', designation: 'QA Specialist', roles: ['QA'], capacity: 60 },
    { name: 'Emma Watson', avatar: 'EW', color: '#8b5cf6', designation: 'Product Manager', roles: ['Observer'], capacity: 20 }
  ];
  const recommendations = data?.recommendations || [
    { name: 'Sarah Wilson', match: 98, reason: 'Expert in UI components' },
    { name: 'Ali Raza', match: 85, reason: 'Strong backend experience' }
  ];
  const rules = data?.rules || [
    'Every task must have exactly one **Owner**.',
    '**Reviewers** cannot be **Contributors** for the same task.'
  ];
  const trends = data?.trends || { active_pct: 85, dev_pct: 60, review_pct: 25, development: 'Development', review: 'Review' };
  const taskName = data?.active_task || activeTask;
  const assigneeCount = data?.assignee_count ?? 5;

  return (
    <div className={`container-fluid py-4 fade-in multi-assignment-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className="row mb-4 align-items-center g-4">
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary">
              <FontAwesomeIcon icon={faUserTag} className="fs-4" />
            </div>
            <div>
              <h2 className="fw-bold mb-0">Multi-User Assignment</h2>
              <p className={`${styles.textMuted} mb-0`}>Define collaborative ownership and shared accountability</p>
            </div>
          </div>
        </div>
        <div className="col-lg-5 text-lg-end">
          <div className="d-flex gap-2 justify-content-lg-end">
             <div className="input-group rounded-pill border overflow-hidden shadow-sm bg-white" style={{ maxWidth: '300px' }}>
                <span className={`input-group-text border-0 bg-transparent ${styles.textMuted}`}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input type="text" className={`form-control border-0 shadow-none small ${isDark ? 'bg-dark text-white' : ''}`} placeholder="Find user to assign..." />
             </div>
             <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Invite Member
             </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-9">
          <div className={`card border-0 rounded-5 shadow-lg overflow-hidden ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                 <div className="rounded-3 bg-primary bg-opacity-10 px-3 py-2 text-primary fw-bold small">
                    {taskName}
                 </div>
                 <button className={`btn btn-sm ${styles.textMuted} hover-text-primary fw-bold small`}>Change Task</button>
              </div>
              <div className="d-flex gap-4">
                 <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-primary small" />
                    <span className="x-small fw-bold">{assigneeCount} Assignees</span>
                 </div>
                 <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faHistory} className="text-secondary small" />
                    <span className="x-small fw-bold">Audit Logs</span>
                 </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className={isDark ? 'bg-white bg-opacity-5' : 'bg-light'}>
                  <tr>
                    <th className="ps-4 py-3 border-0 small text-uppercase letter-spacing-wider opacity-75">Team Member</th>
                    {roles.map((role, i) => (
                      <th key={i} className="text-center py-3 border-0 small text-uppercase letter-spacing-wider opacity-75">{role}</th>
                    ))}
                    <th className="text-center py-3 border-0 small text-uppercase letter-spacing-wider opacity-75">Workload</th>
                    <th className="pe-4 py-3 border-0"></th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {users.map((user, i) => (
                    <UserRow key={i} user={user} roles={roles} isDark={isDark} styles={styles} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-light bg-opacity-50 text-center">
              <button className="btn btn-link text-decoration-none small fw-bold text-primary">
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add custom role to this task
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-3">
          <div className={`card border-0 rounded-5 shadow-lg mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faRobot} className="text-primary" />
                AI Recommendations
              </h6>

              <p className={`x-small ${styles.textMuted} mb-4`}>Based on historical performance and current skills, these users are recommended for this task.</p>

              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className={`p-3 rounded-4 border-dashed transition-all hover-bg-light cursor-pointer ${isDark ? 'border-secondary' : ''}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className={`small fw-bold ${styles.textMain}`}>{rec.name}</span>
                      <span className="badge bg-success-subtle text-success x-small">{rec.match}% Match</span>
                    </div>
                    <div className={`x-small ${styles.textMuted}`}>{rec.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`card border-0 rounded-5 shadow-lg mb-4 bg-dark text-white overflow-hidden transition hover-lift`}>
             <div className="card-body p-4 position-relative z-3">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-info" />
                  Ownership Rules
                </h6>
                <div className="space-y-3">
                  {rules.map((rule, i) => (
                    <div key={i} className="d-flex gap-3">
                      <FontAwesomeIcon icon={faInfoCircle} className="x-small text-info mt-1" />
                      <p className="x-small mb-0 opacity-75">{rule}</p>
                    </div>
                  ))}
                </div>
             </div>
             <div className="position-absolute bottom-0 end-0 opacity-10 p-3">
                <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: '6rem', opacity: 0.3 }} />
             </div>
          </div>

          <div className={`card border-0 rounded-5 shadow-lg ${styles.cardBg}`} style={{ border: styles.border }}>
             <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Participation Trends</h6>
                <div className="d-flex align-items-center gap-2 mb-3">
                   <div className="rounded-circle bg-primary p-2 text-white shadow-sm"><FontAwesomeIcon icon={faChartPie} className="x-small" /></div>
                   <span className="small fw-bold">{trends.active_pct}% Active Participation</span>
                </div>
                <div className="progress rounded-pill mb-2" style={{ height: '8px' }}>
                   <div className="progress-bar bg-primary" style={{ width: `${trends.dev_pct}%` }}></div>
                   <div className="progress-bar bg-info" style={{ width: `${trends.review_pct}%` }}></div>
                </div>
                <div className="d-flex justify-content-between x-small opacity-75">
                   <span>{trends.development}</span>
                   <span>{trends.review}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .multi-assignment-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-scale:hover { transform: scale(1.1); }
        .hover-text-primary:hover { color: #4f46e5 !important; }
        .border-dashed { border: 2px dashed rgba(0,0,0,0.1); }
        .dark-mode .border-dashed { border-color: rgba(255,255,255,0.1); }
        .space-y-3 > *:not(:last-child) { margin-bottom: 1rem; }
      `}</style>
    </div>
  );
};

export default TmsMultiUserAssignment;
