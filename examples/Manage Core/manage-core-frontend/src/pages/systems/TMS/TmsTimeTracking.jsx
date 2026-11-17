import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, startTimeLog, stopTimeLog, getTimeLogsWeeklySummary, getRecentTimeLogs } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock, faPlay, faPause, faStop, faHistory, faChartPie, faTasks,
  faSquareCheck, faSquare, faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

const LS_KEY = 'tms_active_timers';

const TmsTimeTracking = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  // activeTimers: { [taskId]: { taskId, logId, startTime } }
  const [activeTimers, setActiveTimers] = useState({});
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [now, setNow] = useState(() => Date.now());
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Tick every second for elapsed time display
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch { addNotification("Failed to load projects.", "danger"); }

      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) setActiveTimers(JSON.parse(saved));
      } catch { /* invalid JSON */ }
    })();
  }, [addNotification]);

  useEffect(() => {
    (async () => {
      try {
        const data = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(data);
      } catch { addNotification("Failed to load tasks.", "danger"); }
    })();
  }, [selectedProject, refreshKey, addNotification]);

  useEffect(() => {
    (async () => {
      try {
        const [summary, logs] = await Promise.all([
          getTimeLogsWeeklySummary(),
          getRecentTimeLogs(),
        ]);
        setWeeklySummary(summary);
        setRecentLogs(logs);
      } catch { /* ignore */ }
    })();
  }, []);

  const persistTimers = (timers) => {
    localStorage.setItem(LS_KEY, JSON.stringify(timers));
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const elapsedFor = (timer) => {
    if (!timer) return 0;
    return Math.floor((now - new Date(timer.startTime).getTime()) / 1000);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  const saveTimer = async (taskId, note = '') => {
    const log = await startTimeLog(taskId, note);
    const timer = { taskId, logId: log.id, startTime: log.start_time };
    const next = { ...activeTimers, [taskId]: timer };
    setActiveTimers(next);
    persistTimers(next);
    return timer;
  };

  const startTimer = async (taskId) => {
    try {
      await saveTimer(taskId);
      addNotification("Timer started.", "info");
    } catch {
      addNotification("Failed to start timer.", "danger");
    }
  };

  const startSelectedTimers = async () => {
    let started = 0;
    for (const taskId of selectedTasks) {
      if (activeTimers[taskId]) continue;
      try {
        await saveTimer(taskId);
        started++;
      } catch {
        addNotification(`Failed to start timer for task ${taskId}.`, "danger");
      }
    }
    if (started > 0) {
      addNotification(`Started ${started} timer(s).`, "info");
      setSelectedTasks(new Set());
    }
  };

  const stopOneTimer = async (taskId) => {
    const timer = activeTimers[taskId];
    if (!timer) return;
    try {
      await stopTimeLog(timer.logId);
      const next = { ...activeTimers };
      delete next[taskId];
      setActiveTimers(next);
      persistTimers(next);

      const [summary, logs] = await Promise.all([
        getTimeLogsWeeklySummary(),
        getRecentTimeLogs(),
      ]);
      setWeeklySummary(summary);
      setRecentLogs(logs);
      setRefreshKey(k => k + 1);
    } catch {
      addNotification("Failed to stop timer.", "danger");
    }
  };

  const stopAllTimers = async () => {
    const ids = Object.keys(activeTimers);
    let stopped = 0;
    for (const taskId of ids) {
      try {
        await stopTimeLog(activeTimers[taskId].logId);
        stopped++;
      } catch { /* continue */ }
    }
    if (stopped > 0) {
      setActiveTimers({});
      persistTimers({});
      const [summary, logs] = await Promise.all([
        getTimeLogsWeeklySummary(),
        getRecentTimeLogs(),
      ]);
      setWeeklySummary(summary);
      setRecentLogs(logs);
      setRefreshKey(k => k + 1);
      addNotification(`Stopped ${stopped} timer(s).`, "success");
    }
  };

  const stopSelectedTimers = async () => {
    let stopped = 0;
    for (const taskId of selectedTasks) {
      if (!activeTimers[taskId]) continue;
      try {
        await stopTimeLog(activeTimers[taskId].logId);
        stopped++;
        const next = { ...activeTimers };
        delete next[taskId];
        setActiveTimers(next);
        persistTimers(next);
      } catch { /* continue */ }
    }
    if (stopped > 0) {
      const [summary, logs] = await Promise.all([
        getTimeLogsWeeklySummary(),
        getRecentTimeLogs(),
      ]);
      setWeeklySummary(summary);
      setRecentLogs(logs);
      setRefreshKey(k => k + 1);
      setSelectedTasks(new Set());
      addNotification(`Stopped ${stopped} timer(s).`, "success");
    }
  };

  const toggleTask = (id) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  };

  const activeCount = Object.keys(activeTimers).length;
  const hasSelected = selectedTasks.size > 0;
  const weeklyGoal = 40 * 3600;

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                <FontAwesomeIcon icon={faClock} className="text-primary fs-4" />
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Time Tracking</h4>
                <p className="text-muted small mb-0">
                  {activeCount > 0
                    ? `${activeCount} timer(s) running — select tasks to manage`
                    : 'Monitor productivity and log billable hours in real-time.'}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {Object.entries(activeTimers).map(([taskId, timer]) => (
                <div key={taskId} className="d-flex align-items-center gap-1 bg-dark text-white rounded-pill px-3 py-1 shadow-sm" style={{ fontSize: '0.85rem' }}>
                  <FontAwesomeIcon icon={faStopwatch} className="text-warning me-1" style={{ fontSize: '0.7rem' }} />
                  <span className="fw-bold font-monospace me-1">{formatTime(elapsedFor(timer))}</span>
                  <span className="opacity-75 small text-truncate" style={{ maxWidth: '80px' }}>{tasks.find(t => t.id === Number(taskId))?.title || taskId}</span>
                  <button className="btn btn-sm text-white p-0 ms-1 border-0" style={{ lineHeight: 1, opacity: 0.6 }} onClick={() => stopOneTimer(timer.taskId)} title="Stop this timer">
                    <FontAwesomeIcon icon={faStop} style={{ fontSize: '0.65rem' }} />
                  </button>
                </div>
              ))}
              {activeCount > 0 && (
                <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={stopAllTimers}>
                  <FontAwesomeIcon icon={faStop} className="me-1" /> Stop All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
          <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                  <div className="card-header bg-transparent border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-0">Project Tasks</h6>
                      <select 
                        className="form-select border-0 shadow-none rounded-pill px-4 bg-light fw-medium small" 
                        style={{ width: '180px' }}
                        value={selectedProject || ''} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                      >
                        <option value="">All Tasks</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    {hasSelected && (
                      <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
                        <span className="small text-muted fw-medium me-2">{selectedTasks.size} selected</span>
                        <button className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm" onClick={startSelectedTimers} disabled={selectedTasks.size === 0}>
                          <FontAwesomeIcon icon={faPlay} className="me-1" /> Start Selected
                        </button>
                        <button className="btn btn-sm btn-warning rounded-pill px-3 fw-bold shadow-sm text-dark" onClick={stopSelectedTimers} disabled={selectedTasks.size === 0}>
                          <FontAwesomeIcon icon={faPause} className="me-1" /> Stop Selected
                        </button>
                        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setSelectedTasks(new Set())}>
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body p-0">
                      <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <th className="ps-4 py-3 border-0" style={{ width: '40px' }}>
                                        <button className="btn btn-sm p-0 border-0 bg-transparent" onClick={toggleAll}>
                                          <FontAwesomeIcon icon={selectedTasks.size === tasks.length && tasks.length > 0 ? faSquareCheck : faSquare} className="text-muted" />
                                        </button>
                                      </th>
                                      <th className="py-3 border-0 x-small fw-bold text-muted text-uppercase">Task</th>
                                      <th className="py-3 border-0 x-small fw-bold text-muted text-uppercase">Log</th>
                                      <th className="py-3 border-0 x-small fw-bold text-muted text-uppercase text-end pe-4">Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {tasks.map(task => {
                                    const isActive = !!activeTimers[task.id];
                                    const isSelected = selectedTasks.has(task.id);
                                    return (
                                      <tr key={task.id} className={isSelected ? 'table-active' : ''}>
                                          <td className="ps-4 py-4">
                                            <button className="btn btn-sm p-0 border-0 bg-transparent" onClick={() => toggleTask(task.id)}>
                                              <FontAwesomeIcon icon={isSelected ? faSquareCheck : faSquare} className={isSelected ? 'text-primary' : 'text-muted'} />
                                            </button>
                                          </td>
                                          <td className="py-4">
                                              <div className="d-flex align-items-center gap-3">
                                                  <div className={`p-2 rounded-3 ${isActive ? 'bg-warning bg-opacity-10 text-warning' : 'bg-light text-primary'}`}>
                                                    <FontAwesomeIcon icon={isActive ? faStopwatch : faTasks} />
                                                  </div>
                                                  <div>
                                                      <div className="fw-bold text-dark small">{task.title}</div>
                                                      <div className="x-small text-muted">{task.priority} Priority{isActive ? ' · Running' : ''}</div>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="small fw-bold text-muted">
                                            {isActive ? (
                                              <span className="text-warning font-monospace">{formatTime(elapsedFor(activeTimers[task.id]))}</span>
                                            ) : (
                                              formatTime(task.total_duration)
                                            )}
                                          </td>
                                          <td className="text-end pe-4">
                                              {isActive ? (
                                                  <button className="btn btn-sm btn-outline-warning rounded-pill px-4 fw-bold" onClick={() => stopOneTimer(task.id)}>
                                                    <FontAwesomeIcon icon={faPause} className="me-2" /> Stop
                                                  </button>
                                              ) : (
                                                  <button className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => startTimer(task.id)}>
                                                    <FontAwesomeIcon icon={faPlay} className="me-2" /> Start
                                                  </button>
                                              )}
                                          </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>

          <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
                  <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faChartPie} className="text-primary" />
                      Weekly Summary
                  </h6>
                  <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                          <span className="small text-muted fw-bold">Today</span>
                          <span className="fw-bold text-dark">{formatTime(weeklySummary?.today || 0)}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                          <span className="small text-muted fw-bold">This Week</span>
                          <span className="fw-bold text-primary">{formatTime(weeklySummary?.week || 0)}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-light">
                          <span className="small text-muted fw-bold">Weekly Goal</span>
                          <span className="fw-bold text-dark">{formatTime(weeklyGoal)}</span>
                      </div>
                      {weeklySummary?.week > 0 && (
                        <div className="progress rounded-pill" style={{ height: '8px' }}>
                          <div className="progress-bar bg-primary rounded-pill" style={{ width: `${Math.min(100, (weeklySummary.week / weeklyGoal) * 100)}%` }}></div>
                        </div>
                      )}
                  </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 bg-dark text-white p-4">
                  <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faHistory} className="text-primary" />
                      Recent Logs
                  </h6>
                  {recentLogs.length > 0 ? (
                    recentLogs.map(log => (
                      <div key={log.id} className="log-item mb-3">
                          <div className="x-small fw-bold opacity-75">{formatDate(log.start_time)}</div>
                          <div className="small fw-bold">{log.task?.title || 'Unknown Task'}</div>
                          <div className="x-small opacity-75">Duration: {formatTime(log.duration)}</div>
                      </div>
                    ))
                  ) : (
                    <div className="opacity-50 text-center py-3">
                      <div className="x-small">No time logs yet</div>
                    </div>
                  )}
              </div>
          </div>
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
      `}</style>
    </div>
  );
};

export default TmsTimeTracking;
