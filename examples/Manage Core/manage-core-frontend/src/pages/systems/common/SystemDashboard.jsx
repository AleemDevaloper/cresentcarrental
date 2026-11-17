import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChartLine, faCircleCheck, faClock, faDatabase, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import { flattenFeatures, getFeatureGroups } from '../../../data/featureRegistry';
import { readFeatureRecords } from '../../../utils/localFeatureStore';
import { getIcon } from './iconMap';

const systemCopy = {
  pms: {
    title: 'PMS Dashboard',
    subtitle: 'Project delivery cockpit for cost, budget, progress, resources, agile boards, reports, and recovery.',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
  },
  fms: {
    title: 'FMS Dashboard',
    subtitle: 'Finance command center for billing, expenses, budgets, payroll, compliance, reports, and risk.',
    gradient: 'linear-gradient(135deg, #0f766e 0%, #22c55e 100%)',
  },
  hrms: {
    title: 'HRMS Dashboard',
    subtitle: 'People operations dashboard for attendance, sites, shifts, hierarchy, import, and employee records.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  },
  tms: {
    title: 'TMS Dashboard',
    subtitle: 'Task productivity dashboard for reports, planner, focus mode, OKRs, analytics, and recovery.',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
  },
  dms: {
    title: 'DMS Dashboard',
    subtitle: 'Secure cloud repository for enterprise document versioning, archival, and sharing.',
    gradient: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
  },
  crm: {
    title: 'CRM Dashboard',
    subtitle: '360-degree customer insights, lead tracking, and sales pipeline management.',
    gradient: 'linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)',
  },
};

const MetricCard = ({ icon, label, value, help }) => (
  <div className="card border-0 rounded-4 h-100 system-metric-card">
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="system-metric-icon"><FontAwesomeIcon icon={icon} /></div>
        <span className="badge bg-success-subtle text-success rounded-pill">Live</span>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <h6 className="fw-bold text-muted mb-1">{label}</h6>
      <p className="text-muted small mb-0">{help}</p>
    </div>
  </div>
);

const SystemDashboard = ({ system = 'pms', projects = [] }) => {
  const { setActiveTab } = useApp();
  const copy = systemCopy[system] || systemCopy.pms;
  const features = flattenFeatures(system);
  const groups = getFeatureGroups(system);

  const stats = useMemo(() => {
    const records = features.flatMap((feature) => readFeatureRecords(system, feature.id));
    const total = records.length;
    const completed = records.filter((record) => ['Completed', 'Approved'].includes(record.status)).length;
    const due = records.filter((record) => record.dueDate).length;
    const amount = records.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
    return { total, completed, due, amount };
  }, [features, system]);

  const heroProgress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 72;

  return (
    <div className="system-dashboard px-3 px-lg-4 py-4">
      <div className="system-dashboard-hero rounded-5 p-4 p-xl-5 mb-4" style={{ background: copy.gradient }}>
        <div className="row align-items-center g-4">
          <div className="col-xl-8">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold">ENTERPRISE MODULE</span>
            <h1 className="text-white fw-bold mb-2">{copy.title}</h1>
            <p className="text-white-50 mb-4 fs-6">{copy.subtitle}</p>
            <div className="d-flex flex-wrap gap-2">
              {features.slice(0, 4).map((feature) => (
                <button key={feature.id} className="btn btn-light rounded-pill px-3 fw-semibold" onClick={() => setActiveTab(feature.id)}>
                  <FontAwesomeIcon icon={getIcon(feature.icon)} className="me-2" />{feature.label}
                </button>
              ))}
            </div>
          </div>
          <div className="col-xl-4">
            <div className="system-hero-glass rounded-4 p-4">
              <div className="d-flex justify-content-between text-white-50 small mb-2"><span>Operational readiness</span><span>{heroProgress}%</span></div>
              <div className="progress rounded-pill mb-4" style={{ height: 10 }}>
                <div className="progress-bar bg-white" style={{ width: `${heroProgress}%` }} />
              </div>
              <div className="row g-3 text-center">
                <div className="col-4"><div className="glass-number">{features.length}</div><div className="glass-label">Features</div></div>
                <div className="col-4"><div className="glass-number">{groups.length}</div><div className="glass-label">Groups</div></div>
                <div className="col-4"><div className="glass-number">{stats.total}</div><div className="glass-label">Records</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6"><MetricCard icon={faDatabase} label="Working Records" value={stats.total} help="Records saved in this browser." /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon={faCircleCheck} label="Closed Items" value={stats.completed} help="Completed or approved workflow items." /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon={faClock} label="Dated Items" value={stats.due} help="Items with a target date." /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon={faChartLine} label="Tracked Value" value={stats.amount.toLocaleString()} help="Total amount/budget in feature records." /></div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card border-0 rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Feature Launchpad</h5>
                  <p className="text-muted small mb-0">Every card opens a working frontend register with CRUD, filters, exports, and recovery.</p>
                </div>
              </div>
              <div className="row g-3">
                {features.slice(0, 12).map((feature) => (
                  <div className="col-md-6" key={feature.id}>
                    <button className="feature-launch-card w-100 text-start" onClick={() => setActiveTab(feature.id)}>
                      <div className="d-flex align-items-start gap-3">
                        <div className="feature-launch-icon"><FontAwesomeIcon icon={getIcon(feature.icon)} /></div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between gap-2">
                            <h6 className="fw-bold mb-1">{feature.label}</h6>
                            <FontAwesomeIcon icon={faArrowRight} className="text-primary mt-1" />
                          </div>
                          <p className="text-muted small mb-0">{feature.description}</p>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="feature-launch-icon"><FontAwesomeIcon icon={faShieldHalved} /></div>
                <div>
                  <h5 className="fw-bold mb-0">System Controls</h5>
                  <p className="text-muted small mb-0">Professional UI/UX readiness checklist.</p>
                </div>
              </div>
              {['Dark mode compatible cards', 'Mobile responsive layout', 'CRUD working registers', 'CSV/JSON/SQL exports', 'PDF print view', 'Backup and restore workflow'].map((item, index) => (
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border mb-2" key={item}>
                  <span className="badge bg-primary rounded-pill">{index + 1}</span>
                  <span className="fw-semibold small">{item}</span>
                </div>
              ))}
              {system === 'pms' && projects?.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold mb-3">Existing Projects</h6>
                  {projects.slice(0, 4).map((project) => (
                    <div className="d-flex justify-content-between small mb-2" key={project.id || project.name}>
                      <span>{project.name}</span>
                      <span className="text-muted">{project.status || 'Active'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;
