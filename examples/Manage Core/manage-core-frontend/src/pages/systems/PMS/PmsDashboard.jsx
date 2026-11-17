import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faArrowTrendUp, faCalendarCheck, faCircleCheck,
  faClock, faDatabase, faGaugeHigh, faLayerGroup, faPlay,
  faProjectDiagram, faRocket, faShieldHalved, faTasks, faTimeline,
  faTriangleExclamation, faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import { flattenFeatures, getFeatureGroups } from '../../../data/featureRegistry';
import { readFeatureRecords } from '../../../utils/localFeatureStore';
import { getIcon } from '../common/iconMap';

const PMS_GRADIENT = 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 48%, #06b6d4 100%)';

const domainColor = (label) => {
  const l = String(label || '').toLowerCase();
  if (l.includes('cost') || l.includes('budget') || l.includes('progress')) return '#f59e0b';
  if (l.includes('agile')) return '#8b5cf6';
  if (l.includes('recovery') || l.includes('control')) return '#10b981';
  return '#06b6d4';
};

const domainIcon = (label) => {
  const l = String(label || '').toLowerCase();
  if (l.includes('cost') || l.includes('budget') || l.includes('progress')) return faWallet;
  if (l.includes('agile')) return faLayerGroup;
  if (l.includes('recovery') || l.includes('control')) return faShieldHalved;
  return faCalendarCheck;
};

const MetricCard = ({ icon, label, value, help, accent }) => (
  <div className="card border-0 rounded-4 h-100 system-metric-card">
    <div className="card-body p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="system-metric-icon" style={{ background: `${accent}1a`, color: accent, fontSize: '1.1rem' }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <span className="badge bg-success-subtle text-success rounded-pill">Live</span>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <h6 className="fw-bold text-muted mb-1">{label}</h6>
      <p className="text-muted small mb-0">{help}</p>
    </div>
  </div>
);

const PmsDashboard = ({ projects = [] }) => {
  const { setActiveTab, theme } = useApp();
  const isDark = theme === 'dark';
  const features = flattenFeatures('pms');
  const groups = getFeatureGroups('pms');

  const stats = useMemo(() => {
    const records = features.flatMap((feature) => readFeatureRecords('pms', feature.id));
    const total = records.length;
    const completed = records.filter((record) => ['Completed', 'Approved'].includes(record.status)).length;
    const overdue = records.filter((record) => record.dueDate && !['Completed', 'Approved'].includes(record.status)).length;
    const due = records.filter((record) => record.dueDate).length;
    const amount = records.reduce((sum, record) => sum + (Number(record.amount) || 0), 0);
    return { total, completed, overdue, due, amount };
  }, [features]);

  const groupStats = useMemo(() => groups.map((group) => {
    const records = group.features.flatMap((feature) => readFeatureRecords('pms', feature.id));
    const completed = records.filter((record) => ['Completed', 'Approved'].includes(record.status)).length;
    return {
      ...group,
      total: records.length,
      completed,
      progress: records.length ? Math.round((completed / records.length) * 100) : 0,
    };
  }), [groups]);

  const heroProgress = stats.total ? Math.round((stats.completed / stats.total) * 100) : 72;
  const openCount = stats.total - stats.completed;

  const quickActions = [
    { id: 'projectentry', label: 'Projects', icon: faProjectDiagram },
    { id: 'pms_milestones', label: 'Milestones', icon: faTimeline },
    { id: 'pms_tasks', label: 'Tasks', icon: faTasks },
    { id: 'pms_sprint_management', label: 'Sprints', icon: faRocket },
    { id: 'pms_calendar', label: 'Calendar', icon: faCalendarCheck },
  ];

  const ringBackground = `conic-gradient(#ffffff ${heroProgress * 3.6}deg, rgba(255,255,255,0.22) 0deg)`;

  return (
    <div className="system-dashboard px-3 px-lg-4 py-4">
      {/* Hero */}
      <div className="system-dashboard-hero rounded-5 p-4 p-xl-5 mb-4 position-relative" style={{ background: PMS_GRADIENT, overflow: 'hidden' }}>
        <div className="row align-items-center g-4 position-relative">
          <div className="col-xl-8">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-bold">PROJECT MANAGEMENT SYSTEM</span>
              <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>
                <FontAwesomeIcon icon={faPlay} className="me-1" size="xs" /> Live Portfolio
              </span>
            </div>
            <h1 className="text-white fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)' }}>Project Delivery Command Center</h1>
            <p className="text-white-50 mb-4 fs-6" style={{ maxWidth: 560 }}>
              Plan sprints, track cost, budget, progress, resources, risks, and delivery health — all from one cockpit.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button key={action.id} className="btn btn-light rounded-pill px-3 fw-semibold" onClick={() => setActiveTab(action.id)}>
                  <FontAwesomeIcon icon={action.icon} className="me-2" />{action.label}
                </button>
              ))}
            </div>
          </div>
          <div className="col-xl-4">
            <div className="system-hero-glass rounded-4 p-4 h-100">
              <div className="d-flex align-items-center gap-4">
                <div style={{ width: 92, height: 92, borderRadius: '50%', background: ringBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(15,23,42,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <span className="glass-number" style={{ fontSize: '1rem', lineHeight: 1 }}>{heroProgress}%</span>
                    <span className="glass-label" style={{ fontSize: '0.55rem' }}>health</span>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between text-white-50 small mb-1"><span>Delivery health</span><span className="fw-bold text-white">{heroProgress}%</span></div>
                  <div className="d-flex justify-content-between text-white-50 small mb-3"><span>Open work items</span><span className="fw-bold text-white">{openCount}</span></div>
                  <div className="d-flex justify-content-between text-white-50 small"><span>Closed items</span><span className="fw-bold text-white">{stats.completed}</span></div>
                </div>
              </div>
              <div className="row g-3 text-center mt-3">
                <div className="col-4"><div className="glass-number">{features.length}</div><div className="glass-label">Features</div></div>
                <div className="col-4"><div className="glass-number">{groups.length}</div><div className="glass-label">Domains</div></div>
                <div className="col-4"><div className="glass-number">{stats.total}</div><div className="glass-label">Records</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric row */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <MetricCard icon={faDatabase} label="Working Records" value={stats.total} help="Records saved in this browser." accent="#6366f1" />
        </div>
        <div className="col-xl-3 col-md-6">
          <MetricCard icon={faCircleCheck} label="Closed Items" value={stats.completed} help="Completed or approved workflow items." accent="#10b981" />
        </div>
        <div className="col-xl-3 col-md-6">
          <MetricCard icon={faTriangleExclamation} label="Overdue & Open" value={stats.overdue} help="Dated items still not closed." accent="#f43f5e" />
        </div>
        <div className="col-xl-3 col-md-6">
          <MetricCard icon={faWallet} label="Tracked Budget" value={stats.amount.toLocaleString()} help="Total amount across feature records." accent="#06b6d4" />
        </div>
      </div>

      <div className="row g-4">
        {/* Workspace Launchpad */}
        <div className="col-xl-8">
          <div className="card border-0 rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div>
                  <h5 className="fw-bold mb-1">Workspace Launchpad</h5>
                  <p className="text-muted small mb-0">Every card opens a working register with CRUD, filters, exports, and recovery.</p>
                </div>
              </div>
              <div className="row g-3 mt-1">
                {features.slice(0, 12).map((feature) => {
                  const domain = groupStats.find((g) => g.features.some((f) => f.id === feature.id));
                  const color = domain ? domainColor(domain.label) : '#6366f1';
                  return (
                    <div className="col-md-6" key={feature.id}>
                      <button className="feature-launch-card w-100 text-start" onClick={() => setActiveTab(feature.id)}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="feature-launch-icon" style={{ background: `${color}1a`, color }}>
                            <FontAwesomeIcon icon={getIcon(feature.icon)} />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between gap-2 align-items-start">
                              <h6 className="fw-bold mb-1">{feature.label}</h6>
                              <FontAwesomeIcon icon={faArrowRight} className="mt-1" style={{ color }} />
                            </div>
                            <p className="text-muted small mb-1">{feature.description}</p>
                            <span className="badge rounded-pill" style={{ background: `${color}1a`, color, fontSize: '0.58rem', fontWeight: 700 }}>
                              {feature.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="col-xl-4">
          <div className="card border-0 rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="feature-launch-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                  <FontAwesomeIcon icon={faArrowTrendUp} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Delivery Snapshot</h5>
                  <p className="text-muted small mb-0">Progress by domain.</p>
                </div>
              </div>
              {groupStats.map((group) => {
                const color = domainColor(group.label);
                return (
                  <button
                    key={group.id}
                    className="w-100 text-start border-0 bg-transparent mb-3"
                    onClick={() => group.features[0] && setActiveTab(group.features[0].id)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold">
                        <FontAwesomeIcon icon={domainIcon(group.label)} className="me-2" style={{ color }} />
                        {group.label}
                      </span>
                      <span className="small text-muted">{group.completed}/{group.total} · {group.progress}%</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: 6, background: isDark ? '#1e293b' : '#e2e8f0' }}>
                      <div className="progress-bar rounded-pill" style={{ width: `${group.progress}%`, background: color }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {projects?.length > 0 && (
            <div className="card border-0 rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Existing Projects</h5>
                {projects.slice(0, 5).map((project) => (
                  <div className="d-flex justify-content-between align-items-center small mb-2 p-2 rounded-3" style={{ background: isDark ? '#1a1d29' : '#f8fafc' }} key={project.id || project.name}>
                    <span className="fw-semibold">{project.name}</span>
                    <span className="badge rounded-pill" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>{project.status || 'Active'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="feature-launch-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">System Controls</h5>
                  <p className="text-muted small mb-0">Readiness checklist.</p>
                </div>
              </div>
              {['Dark mode compatible cards', 'Mobile responsive layout', 'CRUD working registers', 'CSV/JSON/SQL exports', 'PDF print view', 'Backup and restore workflow'].map((item, index) => (
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 border mb-2" key={item} style={{ borderColor: isDark ? '#2d3248' : '#e2e8f0' }}>
                  <span className="badge bg-primary rounded-pill">{index + 1}</span>
                  <span className="fw-semibold small">{item}</span>
                </div>
              ))}
              <button className="btn btn-sm w-100 mt-3" style={{ borderRadius: '10px', background: isDark ? '#1e293b' : '#f1f5f9', color: '#6366f1', fontWeight: 700 }} onClick={() => setActiveTab('pms_data_backup')}>
                <FontAwesomeIcon icon={faGaugeHigh} className="me-2" />Open Backup & Recovery
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmsDashboard;
