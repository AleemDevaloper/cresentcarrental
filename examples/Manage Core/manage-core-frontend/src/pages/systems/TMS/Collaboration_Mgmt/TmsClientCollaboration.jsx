import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EnableDisableButton } from '../../../../components/common';
import {
  faHandshake,
  faProjectDiagram,
  faFileContract,
  faComments,
  faCalendarAlt,
  faCheckCircle,
  faCloudDownloadAlt,
  faSearch,
  faShieldAlt,
  faEye,
  faLock,
  faEllipsisH,
  faUsers,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { listClientCollaboration } from '../../../../api/tms';

const DeliverableCard = ({ item, isDark, styles }) => (
  <div className={`card border-0 mb-3 rounded-4 shadow-sm transition-all hover-lift ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
       style={{ border: styles.border }}>
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-3">
           <div className="rounded-4 bg-primary bg-opacity-10 p-3 text-primary">
              <FontAwesomeIcon icon={faFileContract} className="fs-5" />
           </div>
           <div>
              <div className={`small fw-bold ${styles.textMain}`}>{item.title}</div>
              <div className={`x-small ${styles.textMuted}`}>Version {item.version} • {item.date}</div>
           </div>
        </div>
        <div className="d-flex gap-2">
           <button className={`btn btn-sm rounded-pill px-3 fw-bold x-small border ${isDark ? 'bg-white bg-opacity-5 border-white border-opacity-10 text-white' : 'bg-white border-secondary border-opacity-10 text-dark'}`}>
              <FontAwesomeIcon icon={faCloudDownloadAlt} className="me-1" /> Download
           </button>
           <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold x-small shadow-sm">
              Approve
           </button>
        </div>
      </div>
      <div className={`p-3 rounded-4 bg-light bg-opacity-50 border ${isDark ? 'border-white border-opacity-5' : 'border-dark border-opacity-5'}`}>
         <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></div>
            <span className="x-small fw-bold opacity-75">Status: {item.status || 'Ready for Review'}</span>
         </div>
         <p className="x-small mb-0 opacity-75">{item.description}</p>
      </div>
    </div>
  </div>
);

const TmsClientCollaboration = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibilitySettings, setVisibilitySettings] = useState({});

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listClientCollaboration();
      const d = result.data || result;
      setData(d);
      if (d?.visibility_settings) {
        const vs = {};
        d.visibility_settings.forEach(s => { vs[s.label] = s.active; });
        setVisibilitySettings(vs);
      }
    } catch (err) {
      console.error('Failed to fetch client collaboration data', err);
      setError(err.response?.data?.message || err.message || 'Failed to load client collaboration data.');
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
  };

  const project = data?.project || {};
  const milestones = data?.milestones || [
    { title: 'Project Initiation', date: 'May 01', status: 'Completed' },
    { title: 'UI/UX Design Phase', date: 'May 15', status: 'Completed' },
    { title: 'Frontend Development', date: 'June 10', status: 'In Progress' },
    { title: 'Backend Integration', date: 'July 01', status: 'Pending' },
    { title: 'Final QA & Launch', date: 'July 15', status: 'Pending' }
  ];
  const deliverables = data?.deliverables || [
    { title: 'Brand Identity Guidelines', version: '2.4', date: 'Today', status: 'Ready for Review', description: 'Final design assets for the landing page including mobile and desktop versions.' },
    { title: 'Mobile App High-Fidelity Mockups', version: '1.0', date: 'Yesterday', status: 'Ready for Review', description: 'Mobile app high-fidelity mockups for review and approval.' }
  ];
  const defaultSettings = [
    { label: 'Show task progress', active: visibilitySettings['Show task progress'] ?? true },
    { label: 'Allow file comments', active: visibilitySettings['Allow file comments'] ?? true },
    { label: 'Show internal team chat', active: visibilitySettings['Show internal team chat'] ?? false },
    { label: 'Show detailed time logs', active: visibilitySettings['Show detailed time logs'] ?? false }
  ];
  const stakeholders = data?.stakeholders || [
    { name: 'Emma Watson', role: 'Project Manager', avatar: 'EW', color: '#4f46e5' },
    { name: 'Sarah Wilson', role: 'Lead Designer', avatar: 'SW', color: '#ec4899' },
    { name: 'Ali Raza', role: 'Tech Lead', avatar: 'AR', color: '#10b981' }
  ];

  return (
    <div className={`container-fluid py-4 fade-in client-portal-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className={`card border-0 rounded-5 mb-4 shadow-lg overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`} style={{ border: styles.border }}>
        <div className="p-5 position-relative text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
          <div className="position-absolute top-0 end-0 p-5 opacity-10">
             <FontAwesomeIcon icon={faHandshake} style={{ fontSize: '15rem' }} />
          </div>
          <div className="row align-items-center g-4 position-relative z-2">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-white rounded-circle p-2 shadow-lg" style={{ width: '60px', height: '60px' }}>
                   <div className="w-100 h-100 bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold text-white">{project.initials || 'CP'}</div>
                </div>
                <div>
                   <h2 className="fw-bold mb-0">{project.name || 'Acme Corp Digital Transformation'}</h2>
                   <div className="d-flex align-items-center gap-3 mt-1">
                      <span className="x-small fw-bold px-2 py-1 rounded bg-success bg-opacity-20 text-success border border-success border-opacity-25">{project.status || 'On Track'}</span>
                      <span className="x-small opacity-75"><FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Started {project.started || 'May 2026'}</span>
                   </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
               <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg border-0 transition-all hover-lift">
                  <FontAwesomeIcon icon={faComments} className="me-2" /> Message Team
               </button>
            </div>
          </div>
        </div>

        <div className={`px-5 py-4 border-top d-flex flex-wrap gap-5 ${isDark ? 'border-white border-opacity-5' : 'border-dark border-opacity-5'}`}>
           <div className="d-flex align-items-center gap-3">
              <div className="h4 fw-bold mb-0 text-primary">{project.progress ?? 65}%</div>
              <div className={`small fw-bold ${styles.textMuted}`}>Overall Progress</div>
           </div>
           <div className="vr opacity-10"></div>
           <div className="d-flex align-items-center gap-3">
              <div className="h4 fw-bold mb-0 text-success">{project.milestones_reached ?? 12}</div>
              <div className={`small fw-bold ${styles.textMuted}`}>Milestones Reached</div>
           </div>
           <div className="vr opacity-10"></div>
           <div className="d-flex align-items-center gap-3">
              <div className="h4 fw-bold mb-0 text-info">{project.files_shared ?? 24}</div>
              <div className={`small fw-bold ${styles.textMuted}`}>Files Shared</div>
           </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
           <div className="d-flex align-items-center justify-content-between mb-4 px-2">
              <h5 className={`fw-bold mb-0 ${styles.textMain}`}>Deliverables Center</h5>
              <div className="input-group rounded-pill border overflow-hidden shadow-sm" style={{ maxWidth: '250px' }}>
                 <span className={`input-group-text border-0 bg-transparent ${styles.textMuted}`}><FontAwesomeIcon icon={faSearch} /></span>
                 <input type="text" className={`form-control border-0 shadow-none x-small ${isDark ? 'bg-dark text-white' : ''}`} placeholder="Search files..." />
              </div>
           </div>

           <div className="deliverables-feed">
              {deliverables.map((d, i) => (
                <DeliverableCard key={i} item={d} isDark={isDark} styles={styles} />
              ))}
              {deliverables.length === 0 && (
                <div className="text-center py-4 text-muted">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  No deliverables available.
                </div>
              )}
           </div>

           <div className={`card border-0 rounded-5 shadow-lg mt-5 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                 <h6 className="fw-bold mb-0">Project Roadmap</h6>
                 <button className="btn btn-sm text-primary fw-bold x-small">View Full Timeline</button>
              </div>
              <div className="card-body p-4">
                 <div className="roadmap-container overflow-auto">
                    <div className="d-flex justify-content-between min-w-800 pb-4">
                       {milestones.map((m, i) => (
                          <div key={i} className="text-center position-relative" style={{ width: '120px' }}>
                             <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm ${m.status === 'Completed' ? 'bg-success text-white' : (m.status === 'In Progress' ? 'bg-primary text-white scale-110 shadow-primary' : (isDark ? 'bg-dark border border-secondary border-opacity-25 text-white-50' : 'bg-white border text-muted'))}`}
                                  style={{ width: '40px', height: '40px', zIndex: 2 }}>
                                <FontAwesomeIcon icon={m.status === 'Completed' ? faCheckCircle : (m.status === 'In Progress' ? faProjectDiagram : faLock)} className="small" />
                             </div>
                             <div className={`x-small fw-bold ${styles.textMain}`}>{m.title}</div>
                             <div className={`x-small opacity-50 mt-1`}>{m.date}</div>
                             {i < milestones.length - 1 && (
                                <div className="position-absolute top-0 start-50 translate-middle-x" style={{ left: '100%', width: '100%', borderTop: '2px dashed rgba(0,0,0,0.1)', marginTop: '20px' }}></div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="col-xl-4">
           <div className={`card border-0 rounded-5 shadow-lg mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="p-4 border-bottom">
                 <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                    Visibility Settings
                 </h6>
              </div>
              <div className="card-body p-4">
                 <div className="space-y-4">
                    {defaultSettings.map((s, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center">
                         <span className={`small ${styles.textMain}`}>{s.label}</span>
                         <EnableDisableButton
                            checked={s.active}
                            onClick={() => setVisibilitySettings(prev => ({ ...prev, [s.label]: !prev[s.label] }))}
                            label={s.label}
                            size="small"
                         />
                      </div>
                    ))}
                 </div>
                 <div className={`mt-4 p-3 rounded-4 bg-info bg-opacity-10 border border-info border-opacity-10`}>
                    <div className="d-flex gap-3 text-info">
                       <FontAwesomeIcon icon={faEye} className="mt-1" />
                       <p className="x-small fw-bold mb-0">{data?.viewing_message || 'Client is currently viewing the "Dashboard" and "Files" modules only.'}</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className={`card border-0 rounded-5 shadow-lg ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="p-4 border-bottom">
                 <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-secondary" />
                    Project Stakeholders
                 </h6>
              </div>
              <div className="card-body p-4">
                 <div className="space-y-4">
                    {stakeholders.map((u, i) => (
                       <div key={i} className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                             <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold x-small text-white shadow-sm" style={{ width: '36px', height: '36px', backgroundColor: u.color }}>{u.avatar}</div>
                             <div>
                                <div className={`small fw-bold ${styles.textMain}`}>{u.name}</div>
                                <div className={`x-small ${styles.textMuted}`}>{u.role}</div>
                             </div>
                          </div>
                          <button className={`btn btn-sm p-0 border-0 ${styles.textMuted}`}><FontAwesomeIcon icon={faEllipsisH} /></button>
                       </div>
                    ))}
                 </div>
                 <button className="btn btn-outline-primary w-100 rounded-pill mt-4 fw-bold small">Manage Access</button>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .client-portal-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-scale:hover { transform: scale(1.1); }
        .shadow-primary { box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); }
        .min-w-800 { min-width: 800px; }
        .roadmap-container::-webkit-scrollbar { height: 6px; }
        .roadmap-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .dark-mode .roadmap-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
        .space-y-4 > *:not(:last-child) { margin-bottom: 1.5rem; }
      `}</style>
    </div>
  );
};

export default TmsClientCollaboration;
