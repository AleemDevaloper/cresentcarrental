import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faRocket,
  faPlus,
  faUserPlus,
  faVideo,
  faChartBar,
  faBolt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faPaperclip,
  faCommentDots,
  faEllipsisVertical,
  faCalendarAlt,
  faRobot,
  faChevronRight,
  faSearch,
  faFilter,
  faFlag,
  faLayerGroup,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { listWorkspaces, createWorkspace } from '../../../../api/tms';

const StatCard = ({ title, value, change, icon, color, progress, isDark }) => (
  <div className={`card border-0 shadow-sm rounded-4 h-100 transition-all hover-lift ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
       style={{ border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.02)' }}>
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={`rounded-4 d-flex align-items-center justify-content-center shadow-sm`}
             style={{ width: '48px', height: '48px', backgroundColor: `${color}1a`, color: color }}>
          <FontAwesomeIcon icon={icon} className="fs-5" />
        </div>
        <span className={`badge rounded-pill ${change.startsWith('+') ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-2 py-1 x-small fw-bold`}>
          {change}
        </span>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <p className={`${isDark ? 'text-white-50' : 'text-muted'} small fw-semibold mb-3`}>{title}</p>
      {progress !== undefined && (
        <div className="progress rounded-pill shadow-inner" style={{ height: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          <div className="progress-bar progress-bar-animated" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
      )}
    </div>
  </div>
);

const TmsTeamWorkspaces = () => {
  const { theme, setActiveTab, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeBoard, setActiveBoard] = useState('kanban');
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkspace = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listWorkspaces();
      const ws = result.data || result;
      setWorkspace(Array.isArray(ws) ? ws[0] : ws);
    } catch (err) {
      console.error('Failed to fetch workspace', err);
      setError(err.response?.data?.message || err.message || 'Failed to load workspace data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
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
        <button className="btn btn-primary rounded-pill px-4" onClick={fetchWorkspace}>Retry</button>
      </div>
    );
  }

  const ws = workspace || {};
  const members = ws.members || [
    { name: 'Ahmed Khan', role: 'Full Stack Dev', status: 'online', color: 'success', tasks: 5, productivity: 94, avatar: 'AK' },
    { name: 'Sarah Wilson', role: 'UI/UX Designer', status: 'away', color: 'warning', tasks: 3, productivity: 88, avatar: 'SW' },
    { name: 'Ali Raza', role: 'Backend Engineer', status: 'online', color: 'success', tasks: 7, productivity: 91, avatar: 'AR' },
    { name: 'Emma Watson', role: 'Project Manager', status: 'offline', color: 'secondary', tasks: 2, productivity: 96, avatar: 'EW' }
  ];
  const kanbanColumns = ws.columns || [
    { id: 'backlog', title: 'Backlog', icon: faClock, color: '#64748b', count: 8 },
    { id: 'todo', title: 'To Do', icon: faBolt, color: '#0ea5e9', count: 12 },
    { id: 'in-progress', title: 'In Progress', icon: faRocket, color: '#f59e0b', count: 5 },
    { id: 'review', title: 'Review', icon: faFilter, color: '#8b5cf6', count: 3 },
    { id: 'completed', title: 'Completed', icon: faCheckCircle, color: '#10b981', count: 42 }
  ];
  const workspaceTasks = ws.tasks || [
    { id: 101, column: 'todo', title: 'Implement real-time collaboration with WebSockets', desc: 'Research and implement socket.io integration for instant task updates across the workspace.', progress: 65, assignee: 'AR', date: 'May 28', priority: 'High' },
    { id: 102, column: 'in-progress', title: 'Refactor Redux Store', desc: 'Optimize state management for better performance in large data sets.', progress: 40, assignee: 'AK', date: 'June 2', priority: 'Medium' },
    { id: 103, column: 'backlog', title: 'Database Migration', desc: 'Upgrade PostgreSQL version and migrate legacy tables.', progress: 0, assignee: 'SW', date: 'June 15', priority: 'Low' },
  ];
  const activity = ws.activity || [
    { user: 'Ahmed', action: 'completed', target: 'Dashboard UI', time: '2m ago', color: '#4f46e5' },
    { user: 'Sarah', action: 'uploaded', target: '3 files', time: '15m ago', color: '#10b981' },
    { user: 'Ali', action: 'commented on', target: 'Sprint #4', time: '1h ago', color: '#f59e0b' },
    { user: 'Emma', action: 'started', target: 'Design Sync', time: '3h ago', color: '#0ea5e9' }
  ];
  const stats = ws.stats || {};
  const workspaceName = ws.name || 'Engineering & Design';
  const workspaceTag = ws.tag || 'Team Alpha Workspace';
  const productivityPct = ws.productivity ?? 82;
  const velocity = ws.velocity || '8.4/day';
  const morale = ws.morale || 'High';
  const onlineCount = ws.online_count ?? 9;
  const memberCount = ws.member_count ?? 14;
  const projectCount = ws.project_count ?? 6;

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newColumn) => {
    const taskId = Number(e.dataTransfer.getData("taskId"));
    const task = workspaceTasks.find(t => t.id === taskId);

    if (task && task.column !== newColumn) {
      addNotification(`Task moved to ${newColumn.replace('-', ' ')}`, "success");
    }
  };

  const styles = {
    cardBg: isDark ? 'bg-dark-card' : 'bg-white',
    textMain: isDark ? 'text-white' : 'text-dark',
    textMuted: isDark ? 'text-white-50' : 'text-muted',
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
    hoverBg: isDark ? 'hover-bg-dark' : 'hover-bg-light',
    glass: isDark ? 'glass-dark' : 'glass-light',
    subtleBg: isDark ? 'bg-dark-subtle-custom' : 'bg-light-subtle-custom'
  };

  return (
    <div className={`container-fluid py-4 fade-in team-workspace-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className={`card border-0 shadow-lg rounded-5 overflow-hidden mb-5 ${styles.cardBg}`} style={{ border: styles.border }}>
        <div
          className={`p-5 position-relative hero-header-glass transition-all rounded-5 ${isDark ? 'text-white' : 'text-dark'}`}
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}
        >
          <div className="position-absolute top-2 end-0 mt-0 pt-2 me-5 pe-5 p-5" style={{ transform: 'rotate(15deg) translate(20%, -20%)' }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '20rem' }} />
          </div>
          <div className="position-absolute bottom-0 start-0 opacity-10 blur-3xl" style={{ width: '300px', height: '300px', borderRadius: '50%', background: isDark ? 'white' : '#4f46e5' }}></div>

          <div className="row align-items-center g-4 position-relative z-2">
            <div className="col-xl-7">
              <div className={`badge ${isDark ? 'bg-white bg-opacity-20 text-white' : 'bg-primary bg-opacity-10 text-primary'} rounded-pill px-4 py-2 fw-bold small mb-3 text-uppercase letter-spacing-wider border ${isDark ? 'border-white border-opacity-25' : 'border-primary border-opacity-10'} backdrop-blur`}>
                <FontAwesomeIcon icon={faRocket} className="me-2" />
                {workspaceTag}
              </div>
              <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-0.03em' }}>{workspaceName}</h1>
              <p className={`lead mb-4 opacity-75 pe-xl-5 ${isDark ? 'text-white' : 'text-secondary'}`}>{ws.description || 'Centralized hub for project management, real-time collaboration, and team productivity tracking. Empowering teams to deliver faster.'}</p>

              <div className="d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center gap-2">
                   <div className="d-flex -space-x-3">
                      {members.slice(0, 4).map((m, i) => (
                        <div key={i} className={`rounded-circle border border-2 ${isDark ? 'border-white bg-dark-subtle' : 'border-light bg-secondary-subtle'} d-flex align-items-center justify-content-center x-small ${isDark ? 'text-white' : 'text-dark'} shadow-sm transition hover-scale`} style={{ width: '36px', height: '36px', marginLeft: i > 0 ? '-12px' : 0 }}>{m.avatar}</div>
                      ))}
                      <div className={`rounded-circle border border-2 ${isDark ? 'border-white bg-white text-primary' : 'border-primary bg-primary text-white'} d-flex align-items-center justify-content-center x-small fw-bold shadow-sm`} style={{ width: '36px', height: '36px', marginLeft: '-12px' }}>+{Math.max(0, memberCount - 4)}</div>
                   </div>
                   <span className="small fw-bold opacity-90 ms-2">{memberCount} Members</span>
                </div>
                <div className="vr opacity-25"></div>
                <div className="d-flex align-items-center gap-2">
                   <span className="h4 mb-0 fw-bold">{projectCount}</span>
                   <span className="small opacity-75">Active Projects</span>
                </div>
                <div className="vr opacity-25"></div>
                <div className="d-flex align-items-center gap-2">
                   <span className="h4 mb-0 fw-bold">{productivityPct}%</span>
                   <span className="small opacity-75">Productivity</span>
                </div>
                <div className="vr opacity-25"></div>
                <div className="d-flex align-items-center gap-2">
                   <div className="pulse-dot bg-success shadow-lg"></div>
                   <span className={`small fw-bold ${isDark ? 'text-success-light' : 'text-success'}`}>{onlineCount} Online</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <button
                  className={`btn rounded-pill px-4 py-3 fw-bold shadow-lg border-0 transition-all hover-lift-lg ${isDark ? 'btn-white' : 'btn-primary'}`}
                  style={{ color: isDark ? '#4f46e5' : 'white' }}
                  onClick={() => setActiveTab('tms_add_task')}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  New Task
                </button>
                <button className={`btn rounded-pill px-4 py-3 fw-bold transition-all shadow-lg backdrop-blur border ${isDark ? 'bg-white bg-opacity-10 text-white border-white border-opacity-25 hover-bg-white' : 'bg-white text-dark border-secondary border-opacity-25 hover-bg-light'}`}>
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Invite Member
                </button>
                <button className={`btn rounded-pill px-4 py-3 fw-bold transition-all shadow-lg backdrop-blur border ${isDark ? 'bg-white bg-opacity-10 text-white border-white border-opacity-25 hover-bg-white' : 'bg-white text-dark border-secondary border-opacity-25 hover-bg-light'}`}>
                  <FontAwesomeIcon icon={faVideo} className="me-2" />
                  Start Meeting
                </button>
                <button className={`btn rounded-pill px-4 py-3 fw-bold transition-all shadow-lg backdrop-blur border ${isDark ? 'bg-white bg-opacity-10 text-white border-white border-opacity-25 hover-bg-white' : 'bg-white text-dark border-secondary border-opacity-25 hover-bg-light'}`}>
                  <FontAwesomeIcon icon={faChartBar} className="me-2" />
                  Reports
                </button>
              </div>
            </div>

            <div className="col-xl-5 d-none d-xl-block">
               <div className={`p-5 rounded-5 backdrop-blur border shadow-2xl transition hover-lift ${isDark ? 'bg-white bg-opacity-10 border-white border-opacity-10 text-white' : 'bg-white bg-opacity-40 border-white text-dark'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                     <h5 className="fw-bold mb-0">Workspace Health</h5>
                     <span className="badge bg-success rounded-pill px-3 shadow-sm">{ws.health_status || 'Optimal'}</span>
                  </div>
                  <div className="space-y-4">
                     <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                           <span className="small fw-bold">Task Velocity</span>
                           <span className="small">{velocity}</span>
                        </div>
                        <div className="progress rounded-pill shadow-inner" style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                           <div className={`progress-bar progress-bar-striped progress-bar-animated ${isDark ? 'bg-white' : 'bg-primary'}`} style={{ width: `${ws.velocity_pct || 85}%` }}></div>
                        </div>
                     </div>
                     <div className="mb-4">
                        <div className="d-flex justify-content-between mb-2">
                           <span className="small fw-bold">Team Morale</span>
                           <span className="small">{morale}</span>
                        </div>
                        <div className="progress rounded-pill shadow-inner" style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                           <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" style={{ width: `${ws.morale_pct || 92}%` }}></div>
                        </div>
                     </div>
                     <div className={`p-3 rounded-4 border transition cursor-pointer ${isDark ? 'bg-white bg-opacity-10 border-white border-opacity-10 hover-bg-opacity-20' : 'bg-white border-secondary border-opacity-10 hover-bg-light shadow-sm'}`}>
                        <div className="d-flex align-items-center gap-3">
                           <div className="rounded-circle bg-warning p-2 shadow-sm"><FontAwesomeIcon icon={faExclamationTriangle} className="text-white" /></div>
                           <div>
                              <div className="small fw-bold">{ws.blocker_count ?? 3} Potential Blockers</div>
                              <div className="x-small opacity-75">Click to view risk analysis</div>
                           </div>
                           <FontAwesomeIcon icon={faChevronRight} className={`ms-auto x-small opacity-50 ${isDark ? 'text-white' : 'text-dark'}`} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Active Tasks" value={String(stats.active_tasks ?? 124)} change={stats.active_change || '+12%'} icon={faClock} color="#0ea5e9" progress={stats.active_progress ?? 65} isDark={isDark} />
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Completed" value={String(stats.completed ?? 842)} change={stats.completed_change || '+18%'} icon={faCheckCircle} color="#10b981" progress={stats.completed_progress ?? 92} isDark={isDark} />
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Delayed" value={String(stats.delayed ?? 12)} change={stats.delayed_change || '-4%'} icon={faExclamationTriangle} color="#ef4444" progress={stats.delayed_progress ?? 15} isDark={isDark} />
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Productivity" value={`${stats.productivity ?? 82}%`} change={stats.productivity_change || '+5%'} icon={faChartLine} color="#8b5cf6" progress={stats.productivity ?? 82} isDark={isDark} />
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Workload" value={stats.workload || 'Optimal'} change={stats.workload_change || 'Balanced'} icon={faUsers} color="#f59e0b" progress={stats.workload_progress ?? 75} isDark={isDark} />
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <StatCard title="Approvals" value={String(stats.approvals ?? 5)} change={stats.approvals_change || 'Pending'} icon={faBolt} color="#06b6d4" progress={stats.approvals_progress ?? 30} isDark={isDark} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-9">
          <div className={`card border-0 shadow-sm rounded-4 h-100 overflow-hidden ${styles.cardBg}`} style={{ border: styles.border }}>
            <div className={`card-header bg-transparent border-0 p-4 pb-0 d-flex flex-wrap justify-content-between align-items-center gap-3`}>
              <div className="d-flex align-items-center gap-3">
                <h5 className={`fw-bold mb-0 ${styles.textMain}`}>Team Board</h5>
                <div className={`btn-group rounded-pill border p-1 ${isDark ? 'bg-dark border-secondary border-opacity-25' : 'bg-light'} shadow-sm`}>
                  <button className={`btn btn-sm rounded-pill px-4 transition-all ${activeBoard === 'kanban' ? (isDark ? 'btn-secondary text-white fw-bold shadow-sm' : 'btn-white shadow-sm fw-bold') : 'text-muted border-0'}`} onClick={() => setActiveBoard('kanban')}>Kanban</button>
                  <button className={`btn btn-sm rounded-pill px-4 transition-all ${activeBoard === 'list' ? (isDark ? 'btn-secondary text-white fw-bold shadow-sm' : 'btn-white shadow-sm fw-bold') : 'text-muted border-0'}`} onClick={() => setActiveBoard('list')}>List</button>
                </div>
              </div>
              <div className="d-flex gap-2 flex-grow-1 flex-xl-grow-0">
                <div className="position-relative flex-grow-1">
                   <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                   <input type="text" className={`form-control form-control-sm border shadow-none rounded-pill ps-5 ${isDark ? 'bg-dark text-white border-secondary border-opacity-50' : 'bg-light'}`} placeholder="Filter tasks..." style={{ width: '100%', minWidth: '180px' }} />
                </div>
                <button className={`btn btn-sm rounded-pill px-3 border transition-all ${isDark ? 'btn-outline-secondary text-white' : 'btn-light-subtle'}`}><FontAwesomeIcon icon={faFilter} className="me-2" />Filters</button>
              </div>
            </div>

            <div className="card-body p-4 overflow-auto board-container">
              {activeBoard === 'kanban' ? (
                <div className="d-flex gap-4 board-row" style={{ minWidth: 'max-content' }}>
                  {kanbanColumns.map(col => (
                    <div
                      key={col.id}
                      className="kanban-column"
                      style={{ width: '300px' }}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, col.id)}
                    >
                      <div className={`d-flex justify-content-between align-items-center mb-4 sticky-top py-2 ${isDark ? 'bg-dark-card' : 'bg-white'}`} style={{ zIndex: 10 }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px', backgroundColor: `${col.color}1a`, color: col.color }}>
                              <FontAwesomeIcon icon={col.icon} size="sm" />
                            </div>
                            <span className={`fw-bold small ${styles.textMain}`}>{col.title}</span>
                            <span className={`badge rounded-pill border ms-1 x-small ${isDark ? 'bg-dark text-white-50 border-secondary border-opacity-25' : 'bg-light text-muted'}`}>{col.count}</span>
                        </div>
                        <button className={`btn btn-icon btn-light rounded-circle border-0 x-small transition-all ${isDark ? 'bg-dark text-white-50' : ''}`}><FontAwesomeIcon icon={faPlus} /></button>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {workspaceTasks.filter(t => t.column === col.id).map(task => (
                          <div
                            key={task.id}
                            className={`card border-0 shadow-sm rounded-4 p-3 transition-all hover-lift-lg cursor-pointer task-card-premium position-relative group ${isDark ? 'bg-dark text-white' : 'bg-white'}`}
                            style={{ border: styles.border }}
                            draggable={true}
                            onDragStart={(e) => onDragStart(e, task.id)}
                          >
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex gap-2">
                                    <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-bold">{task.category || 'Development'}</span>
                                    {task.priority === 'High' && <span className="badge rounded-pill bg-danger-subtle text-danger x-small"><FontAwesomeIcon icon={faFlag} className="me-1" />High</span>}
                                </div>
                                <button className="btn btn-icon btn-link text-muted p-0 opacity-0 group-hover-opacity-100 transition"><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                              </div>
                              <h6 className={`fw-bold mb-2 small ${styles.textMain}`} style={{ lineHeight: '1.4' }}>{task.title}</h6>
                              <p className={`${styles.textMuted} x-small mb-3 line-clamp-2`}>{task.desc}</p>

                              <div className="mb-3">
                                <div className="d-flex justify-content-between x-small mb-1">
                                    <span className={styles.textMuted}>Progress</span>
                                    <span className={`fw-bold ${styles.textMain}`}>{task.progress}%</span>
                                </div>
                                <div className="progress rounded-pill shadow-inner" style={{ height: '5px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    <div className="progress-bar bg-primary progress-bar-animated" style={{ width: `${task.progress}%` }}></div>
                                  </div>
                              </div>

                              <div className={`d-flex justify-content-between align-items-center pt-3 border-top ${isDark ? 'border-secondary border-opacity-25' : ''}`}>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle bg-dark-subtle d-flex align-items-center justify-content-center x-small text-white fw-bold shadow-sm" style={{ width: '28px', height: '28px' }}>{task.assignee}</div>
                                    <div className={`d-flex align-items-center gap-2 ${styles.textMuted} x-small`}>
                                      <span className="d-flex align-items-center gap-1"><FontAwesomeIcon icon={faCommentDots} /> {task.comments ?? 3}</span>
                                      <span className="d-flex align-items-center gap-1"><FontAwesomeIcon icon={faPaperclip} /> {task.files ?? 2}</span>
                                    </div>
                                </div>
                                <div className={`d-flex align-items-center gap-1 x-small fw-bold ${styles.textMuted}`}>
                                    <FontAwesomeIcon icon={faClock} className="x-small" />
                                    {task.date}
                                </div>
                              </div>
                          </div>
                        ))}
                        <div className={`text-center py-4 border-dashed rounded-4 transition-all hover-lift cursor-pointer ${isDark ? 'bg-dark bg-opacity-25 border-secondary' : 'bg-light-subtle-custom'}`}>
                            <FontAwesomeIcon icon={faPlus} className="text-muted opacity-50 mb-1" />
                            <div className={`x-small fw-bold ${styles.textMuted}`}>Add Item</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className={`table align-middle mb-0 ${isDark ? 'table-dark' : ''}`}>
                    <thead>
                      <tr className={isDark ? 'border-secondary border-opacity-25' : ''}>
                        <th className={`px-4 py-3 border-0 x-small fw-bold text-uppercase ${styles.textMuted}`}>Task Details</th>
                        <th className={`py-3 border-0 x-small fw-bold text-uppercase ${styles.textMuted}`}>Assignee</th>
                        <th className={`py-3 border-0 x-small fw-bold text-uppercase ${styles.textMuted}`}>Priority</th>
                        <th className={`py-3 border-0 x-small fw-bold text-uppercase ${styles.textMuted}`}>Due Date</th>
                        <th className={`py-3 border-0 x-small fw-bold text-uppercase ${styles.textMuted}`}>Progress</th>
                        <th className={`px-4 py-3 border-0 text-end`}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaceTasks.map(task => (
                        <tr key={task.id} className={`transition-all ${styles.hoverBg} border-bottom ${isDark ? 'border-secondary border-opacity-25' : 'border-light'}`}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className={`rounded-3 p-2 ${isDark ? 'bg-dark' : 'bg-light'} text-primary`}>
                                <FontAwesomeIcon icon={faLayerGroup} />
                              </div>
                              <div>
                                <h6 className={`fw-bold mb-0 small ${styles.textMain}`}>{task.title}</h6>
                                <p className={`${styles.textMuted} x-small mb-0`}>{task.category || 'Development'} • {task.sprint || 'Sprint #4'}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center x-small fw-bold shadow-sm" style={{ width: '28px', height: '28px' }}>{task.assignee}</div>
                              <span className={`small fw-medium ${styles.textMain}`}>{task.assignee_name || task.assignee}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge rounded-pill bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}-subtle text-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'} x-small fw-bold px-3`}>{task.priority}</span>
                          </td>
                          <td>
                            <div className={`d-flex align-items-center gap-2 ${styles.textMuted} small`}>
                              <FontAwesomeIcon icon={faCalendarAlt} className="x-small" />
                              {task.date}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-3" style={{ width: '120px' }}>
                              <div className="progress rounded-pill shadow-inner flex-grow-1" style={{ height: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                <div className="progress-bar bg-primary" style={{ width: `${task.progress}%` }}></div>
                              </div>
                              <span className={`x-small fw-bold ${styles.textMain}`}>{task.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button className={`btn btn-icon rounded-circle border-0 transition-all ${isDark ? 'btn-dark text-white-50' : 'btn-light text-muted'}`}>
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-3">
           <div className={`card border-0 shadow-sm rounded-4 mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                 <h6 className={`fw-bold mb-0 d-flex align-items-center gap-2 ${styles.textMain}`}>
                    <FontAwesomeIcon icon={faBolt} className="text-warning" />
                    Live Activity
                 </h6>
                 <button className="btn btn-link text-primary x-small fw-bold text-decoration-none p-0 transition-all hover-scale">All</button>
              </div>
              <div className="card-body p-4 scroll-hidden" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                 {activity.map((act, i) => (
                   <div key={i} className="d-flex gap-3 mb-4 position-relative activity-item">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-white x-small fw-bold shadow-sm transition hover-scale" style={{ width: '32px', height: '32px', backgroundColor: act.color }}>{act.user[0]}</div>
                      <div className="flex-grow-1">
                         <div className="x-small">
                            <span className={`fw-bold ${styles.textMain}`}>{act.user}</span>
                            <span className={`${styles.textMuted} ms-1`}>{act.action}</span>
                            <span className="fw-bold text-primary ms-1">{act.target}</span>
                         </div>
                         <div className={`x-small ${styles.textMuted} mt-1`}>{act.time}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className={`card border-0 shadow-sm rounded-4 mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                 <h6 className={`fw-bold mb-0 d-flex align-items-center gap-2 ${styles.textMain}`}>
                    <FontAwesomeIcon icon={faUsers} className="text-primary" />
                    Active Members
                 </h6>
                 <span className="badge bg-primary-subtle text-primary rounded-pill x-small shadow-sm">{onlineCount} Online</span>
              </div>
              <div className="card-body p-4">
                 <div className="space-y-3">
                    {members.map((member, i) => (
                      <div key={i} className={`d-flex align-items-center gap-3 p-2 rounded-3 transition-all cursor-pointer group mb-2 ${styles.hoverBg}`}>
                         <div className="position-relative">
                            <div className="rounded-circle bg-dark-subtle d-flex align-items-center justify-content-center x-small text-white fw-bold shadow-sm transition hover-scale" style={{ width: '36px', height: '36px' }}>{member.avatar}</div>
                            <div className={`position-absolute bottom-0 end-0 border border-2 border-white rounded-circle bg-${member.color} shadow-sm`} style={{ width: '12px', height: '12px' }}></div>
                         </div>
                         <div className="flex-grow-1 overflow-hidden">
                            <div className={`x-small fw-bold ${styles.textMain} text-truncate`}>{member.name}</div>
                            <div className={styles.textMuted} style={{ fontSize: '10px' }}>{member.role}</div>
                         </div>
                         <div className="text-end d-none group-hover-block">
                            <button className={`btn btn-sm rounded-circle shadow-sm ${isDark ? 'btn-dark text-white border-secondary' : 'btn-light'}`} style={{ width: '28px', height: '28px', padding: 0 }}><FontAwesomeIcon icon={faCommentDots} size="xs" /></button>
                         </div>
                         <div className="text-end group-hover-none">
                            <div className="x-small fw-bold text-success">{member.productivity}%</div>
                            <div className={`progress rounded-pill shadow-inner`} style={{ height: '3px', width: '30px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                               <div className="progress-bar bg-success" style={{ width: `${member.productivity}%` }}></div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className={`btn w-100 btn-sm rounded-pill mt-3 fw-bold x-small border shadow-sm transition-all ${isDark ? 'btn-dark text-white border-secondary' : 'btn-light'}`}>View All Members</button>
              </div>
           </div>

           <div className={`card border-0 shadow-lg rounded-4 mb-4 bg-dark text-white overflow-hidden transition hover-lift`}>
              <div className="card-body p-4 position-relative z-1">
                 <div className="position-absolute top-0 end-0 p-3 opacity-10"><FontAwesomeIcon icon={faRobot} size="3x" /></div>
                 <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faRobot} className="text-info" />
                    AI Intelligence
                 </h6>
                 <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 mb-3 backdrop-blur">
                    <p className="x-small mb-0 opacity-90 fw-medium">{ws.ai_insight || 'Design team workload is 20% higher than average. Consider shifting Sprint #5 tasks.'}</p>
                 </div>
                 <div className="d-flex gap-2">
                    <span className="badge rounded-pill bg-danger shadow-sm x-small px-3">Workload Warning</span>
                    <span className="badge rounded-pill bg-info shadow-sm x-small px-3">Optimization</span>
                 </div>
              </div>
              <div className="position-absolute bottom-0 start-0 w-100 h-100 bg-gradient-dark-blue opacity-25 z-0"></div>
           </div>

           <div className={`card border-0 shadow-sm rounded-4 mb-4 ${styles.cardBg}`} style={{ border: styles.border }}>
              <div className="card-header bg-transparent border-0 p-4 pb-0"><h6 className={`fw-bold mb-0 ${styles.textMain}`}>Quick Actions</h6></div>
              <div className="card-body p-4">
                 <div className="row g-2">
                    {[
                      { label: 'New Task', icon: faPlus, color: 'primary' },
                      { label: 'Invite', icon: faUserPlus, color: 'success' },
                      { label: 'Meeting', icon: faVideo, color: 'info' },
                      { label: 'Report', icon: faChartBar, color: 'warning' }
                    ].map((btn, i) => (
                      <div key={i} className="col-6">
                         <button className={`btn w-100 p-3 rounded-4 border-0 shadow-sm d-flex flex-column align-items-center gap-2 transition-all hover-lift-lg group ${isDark ? 'btn-dark' : 'btn-light'}`}>
                            <div className={`rounded-circle bg-${btn.color}-subtle text-${btn.color} d-flex align-items-center justify-content-center transition group-hover-bounce shadow-sm`} style={{ width: '40px', height: '40px' }}>
                               <FontAwesomeIcon icon={btn.icon} />
                            </div>
                            <span className={`x-small fw-bold opacity-75 ${styles.textMain}`}>{btn.label}</span>
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .team-workspace-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .dark-mode { --bs-body-bg: #0f172a; }
        .bg-dark-card { background-color: #1e293b !important; }
        .bg-dark-subtle-custom { background-color: rgba(30, 41, 59, 0.5) !important; }
        .bg-light-subtle-custom { background-color: rgba(248, 250, 252, 0.8) !important; }
        .hover-bg-dark:hover { background-color: rgba(255, 255, 255, 0.03) !important; }
        .hover-bg-light:hover { background-color: rgba(0, 0, 0, 0.02) !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .backdrop-blur { backdrop-filter: blur(20px); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-lift-lg:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
        .hover-scale:hover { transform: scale(1.1); }
        .btn-white { background: white; border: none; }
        .btn-white:hover { background: #f8fafc; }
        .btn-light-subtle { background: rgba(241, 245, 249, 0.5); }
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; animation: pulse-green 2s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .-space-x-3 > div { margin-left: -12px; }
        .-space-x-3 > div:first-child { margin-left: 0; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .board-container::-webkit-scrollbar { height: 8px; }
        .board-container::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .board-container::-webkit-scrollbar-track { background: transparent; }
        .border-dashed { border: 2px dashed #e2e8f0; }
        .task-card-premium:hover { border-left: 4px solid #4f46e5 !important; }
        .activity-item:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 32px; bottom: -16px; width: 2px; background: rgba(0,0,0,0.05); z-index: 0; }
        .dark-mode .activity-item:not(:last-child)::after { background: rgba(255,255,255,0.05); }
        .text-success-light { color: #bbf7d0; }
        .scroll-hidden::-webkit-scrollbar { width: 0; background: transparent; }
        .group-hover-block { display: none; }
        .group:hover .group-hover-block { display: block; }
        .group:hover .group-hover-none { display: none; }
        .bg-gradient-dark-blue { background: linear-gradient(180deg, rgba(79, 70, 229, 0) 0%, rgba(79, 70, 229, 0.2) 100%); }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .group:hover .group-hover-bounce { animation: bounce 0.5s ease infinite; }
        .blur-3xl { filter: blur(64px); }
        .hero-header-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default TmsTeamWorkspaces;
