import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, listTaskActivityLogs } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHistory, 
  // faUser, 
  faClock, 
  // faCheckCircle,
  // faEdit,
  faTrash,
  faPlus,
  faExchangeAlt,
  faSearch,
  faFilter,
  faFileImport
} from "@fortawesome/free-solid-svg-icons";

const TmsActivityLogs = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (err) {
        addNotification("Failed to load projects.", "danger");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const tasks = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        const allLogs = await Promise.all(tasks.map(t => listTaskActivityLogs(t.id)));
        const flattenedLogs = allLogs.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLogs(flattenedLogs);
      } catch (err) {
        console.error("Failed to fetch logs", err);
        addNotification("Failed to load activity logs.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [selectedProject]);

  const getActionConfig = (action) => {
    switch (action) {
      case 'created': return { icon: faPlus, color: 'success', label: 'Created' };
      case 'updated_status': return { icon: faExchangeAlt, color: 'primary', label: 'Status Change' };
      case 'added_tag': return { icon: faPlus, color: 'info', label: 'Added Tag' };
      case 'removed_tag': return { icon: faTrash, color: 'warning', label: 'Removed Tag' };
      default: return { icon: faHistory, color: 'secondary', label: 'Updated' };
    }
  };

  const formatTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 172800) return 'Yesterday';
      return date.toLocaleDateString();
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-header p-0 border-0">
          <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
                  <FontAwesomeIcon icon={faHistory} className="fs-3" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1">System Activity Logs</h3>
                  <p className="mb-0 opacity-75">Real-time audit trail of all actions performed within the TMS.</p>
                </div>
              </div>
              <button className="btn btn-white rounded-pill px-5 py-3 fw-bold shadow-lg transition hover-lift">
                <FontAwesomeIcon icon={faFileImport} className="me-2" />
                Export Audit Trail
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5 p-4 rounded-4 bg-light border border-light">
                <div className="d-flex align-items-center gap-3">
                    <select 
                      className="form-select border-0 shadow-sm rounded-pill px-4 bg-white fw-bold small" 
                      style={{ width: '200px' }}
                      value={selectedProject || ''} 
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">All Tasks</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <div className="vr opacity-20 mx-2"></div>
                    <div className="text-muted small fw-bold text-uppercase letter-spacing-wider">
                        Live Tracking Enabled
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="position-relative">
                        <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted small" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                          type="text" 
                          className="form-control border-0 shadow-sm rounded-pill ps-5 bg-white small" 
                          placeholder="Filter actions..." 
                          style={{ width: '220px' }}
                        />
                    </div>
                    <button className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm transition">
                        <FontAwesomeIcon icon={faFilter} className="me-2 text-primary" />
                        Refine
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="activity-timeline position-relative ps-4">
                    <div className="timeline-line position-absolute top-0 bottom-0 start-0 bg-light" style={{ width: '2px', marginLeft: '9px' }}></div>
                    
                    {logs.map(log => {
                        const config = getActionConfig(log.action);
                        return (
                            <div key={log.id} className="timeline-item mb-5 position-relative">
                                <div className={`timeline-icon position-absolute start-0 translate-middle-x rounded-circle bg-${config.color} d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '20px', height: '20px', marginTop: '10px' }}>
                                    <FontAwesomeIcon icon={config.icon} style={{ fontSize: '8px', color: '#fff' }} />
                                </div>
                                <div className="timeline-content ms-4 p-4 rounded-4 border border-light transition hover-lift-sm bg-white shadow-sm">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span className="fw-bold text-dark">{log.user?.name || 'System'}</span>
                                            <span className="text-muted mx-2">{config.label}</span>
                                            <span className="badge bg-light text-primary border px-2 py-1 x-small fw-bold text-uppercase">{log.task?.title || 'Task'}</span>
                                        </div>
                                        <div className="text-end">
                                            <div className="x-small text-muted fw-bold text-uppercase"><FontAwesomeIcon icon={faClock} className="me-1" />{formatTime(log.created_at)}</div>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-0 opacity-75">{log.description}</p>
                                </div>
                            </div>
                        );
                    })}
                    {logs.length === 0 && (
                        <div className="text-center py-5 text-muted">No activity logs found for this project.</div>
                    )}
                </div>
            )}
        </div>
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
        .transition { transition: all 0.2s; }
        .hover-lift:hover { transform: translateY(-3px); }
        .hover-lift-sm:hover { transform: translateY(-1px); border-color: #e2e8f0 !important; }
        .btn-white { background: white; border: none; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};

export default TmsActivityLogs;
