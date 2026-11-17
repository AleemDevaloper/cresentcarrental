import React, { useState, useEffect } from 'react';
import { useApp } from "../../../../hooks/useApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faColumns,
  faThLarge,
  faStream,
  faPlus,
  faSearch,
  faFilter,
  faUsers,
  faEllipsisH,
  faClock,
  faCommentDots,
  faPaperclip,
  faCheckCircle,
  faRocket,
  faBolt,
  faChevronRight,
  faChartBar,
  faHistory,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import TaskDetailModal from '../TaskDetailModal';
import { listSharedBoards, createSharedBoard } from '../../../../api/tms';

const TaskCard = ({ task, isDark, styles, onDragStart, onTaskClick }) => {
  return (
    <div className={`card mb-3 rounded-4 transition-all hover-lift cursor-pointer task-card-premium ${isDark ? 'bg-dark-card text-white' : 'bg-white text-dark'}`}
         draggable={true}
         onDragStart={(e) => onDragStart(e, task.id)}
         style={{
           borderTop: `4px solid ${task.priorityColor}`,
           borderLeft: 'var(--panel-border)',
           borderRight: 'var(--panel-border)',
           borderBottom: 'var(--panel-border)',
           boxShadow: 'var(--panel-shadow)'
         }}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className={`badge rounded-pill x-small px-2 py-1`} style={{ backgroundColor: `${task.priorityColor}1a`, color: task.priorityColor }}>
            {task.priority}
          </span>
          <button className={`btn btn-sm p-0 border-0 ${styles.textMuted}`}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
        </div>

        <h6 className="fw-bold mb-2 line-clamp-2 td-title-clickable" onClick={() => onTaskClick && onTaskClick(task)}>{task.title}</h6>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className={`x-small ${styles.textMuted}`}>Progress</span>
            <span className="x-small fw-bold">{task.progress}%</span>
          </div>
          <div className="progress rounded-pill shadow-inner" style={{ height: '6px', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
            <div className="progress-bar progress-bar-animated" style={{ width: `${task.progress}%`, backgroundColor: task.priorityColor }}></div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex -space-x-2">
            {(task.assignees || []).map((a, i) => (
              <div key={i} className={`rounded-circle border border-2 ${isDark ? 'border-dark' : 'border-white'} d-flex align-items-center justify-content-center x-small text-white shadow-sm`}
                   style={{ width: '28px', height: '28px', backgroundColor: a.color }}>
                {a.avatar}
              </div>
            ))}
          </div>

          <div className="d-flex gap-3 text-muted">
            <span className="x-small d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faCommentDots} /> {task.comments}
            </span>
            <span className="x-small d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faPaperclip} /> {task.files}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TmsSharedTaskBoards = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeView, setActiveView] = useState('kanban');
  const [detailTask, setDetailTask] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await listSharedBoards();
      setData(result.data || result);
    } catch (err) {
      console.error('Failed to fetch shared boards', err);
      setError(err.response?.data?.message || err.message || 'Failed to load shared boards.');
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
    glass: isDark ? 'glass-dark' : 'glass-light',
  };

  const board = data?.board || {};
  const columns = board.columns || [
    { id: 'todo', title: 'To Do', color: '#6366f1', count: 5 },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', count: 3 },
    { id: 'review', title: 'Review', color: '#8b5cf6', count: 2 },
    { id: 'completed', title: 'Completed', color: '#10b981', count: 12 }
  ];
  const boardTasks = board.tasks || [
    {
      id: 1,
      column: 'in-progress',
      title: 'Implement Dark Mode for Analytics Dashboard',
      priority: 'High',
      priorityColor: '#ef4444',
      progress: 65,
      comments: 8,
      files: 2,
      assignees: [{ avatar: 'HK', color: '#4f46e5' }, { avatar: 'SW', color: '#ec4899' }]
    },
    {
      id: 2,
      column: 'todo',
      title: 'Bug: Fix layout shift on mobile devices',
      priority: 'Medium',
      priorityColor: '#f59e0b',
      progress: 0,
      comments: 3,
      files: 0,
      assignees: [{ avatar: 'AR', color: '#10b981' }]
    },
    {
      id: 3,
      column: 'review',
      title: 'New Landing Page Design - Phase 1',
      priority: 'Low',
      priorityColor: '#6366f1',
      progress: 95,
      comments: 15,
      files: 5,
      assignees: [{ avatar: 'SW', color: '#ec4899' }]
    }
  ];
  const boardName = board.name || 'Shared Sprint Board';
  const sprintName = board.sprint || 'Sprint 24 Active';
  const endsIn = board.ends_in || 'Ends in 4 days';
  const onlineAvatars = board.online_collaborators || ['SW', 'AR', 'EW', 'HK'];
  const additionalOnline = board.additional_online ?? 5;
  const liveActive = board.live_active ?? true;
  const floatingAvatars = board.floating_avatars || ['SW', 'AR', 'HK'];

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newColumn) => {
    const taskId = Number(e.dataTransfer.getData("taskId"));
    const task = boardTasks.find(t => t.id === taskId);

    if (task && task.column !== newColumn) {
      addNotification(`Task moved to ${newColumn.replace('-', ' ')}`, "success");
    }
  };

  return (
    <div className={`container-fluid py-4 fade-in boards-wrapper ${isDark ? 'dark-mode' : ''}`}>

      <div className={`card border-0 rounded-5 mb-4 shadow-lg overflow-hidden ${styles.cardBg}`} style={{ border: styles.border }}>
        <div className="p-4 d-flex flex-wrap align-items-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary">
              <FontAwesomeIcon icon={faColumns} className="fs-4" />
            </div>
            <div>
              <h4 className="fw-bold mb-0">{boardName}</h4>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className={`x-small fw-bold px-2 py-1 rounded bg-success bg-opacity-10 text-success`}>{sprintName}</span>
                <span className={`x-small ${styles.textMuted}`}>{endsIn}</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="btn-group rounded-pill border overflow-hidden p-1 bg-light bg-opacity-10">
              {[
                { id: 'kanban', icon: faColumns, label: 'Board' },
                { id: 'grid', icon: faThLarge, label: 'Grid' },
                { id: 'timeline', icon: faStream, label: 'Timeline' }
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`btn btn-sm rounded-pill px-3 border-0 transition-all ${activeView === view.id ? 'btn-primary shadow-sm' : styles.textMuted}`}
                >
                  <FontAwesomeIcon icon={view.icon} className="me-2" />
                  {view.label}
                </button>
              ))}
            </div>

            <div className="vr mx-2 opacity-10"></div>

            <div className="d-flex -space-x-2">
              {onlineAvatars.slice(0, 4).map((av, i) => (
                <div key={i} className="position-relative rounded-circle border border-2 border-white bg-dark-subtle d-flex align-items-center justify-content-center x-small text-white shadow-sm transition hover-scale"
                     style={{ width: '36px', height: '36px' }}>
                  {av}
                  {i === 0 && <span className="position-absolute top-0 end-0 p-1 bg-success rounded-circle border border-white" style={{ width: '10px', height: '10px' }}></span>}
                </div>
              ))}
              <div className="rounded-circle border border-2 border-white bg-primary d-flex align-items-center justify-content-center x-small text-white fw-bold shadow-sm" style={{ width: '36px', height: '36px' }}>+{additionalOnline}</div>
            </div>

            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm hover-lift ms-lg-3">
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Task
            </button>
          </div>
        </div>

        <div className={`px-4 py-3 border-top d-flex align-items-center gap-4 flex-wrap ${isDark ? 'border-white border-opacity-5' : 'border-dark border-opacity-5'}`}>
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faSearch} className={styles.textMuted} />
            <input type="text" className={`form-control form-control-sm border-0 shadow-none bg-transparent ${styles.textMain}`} placeholder="Search board..." />
          </div>
          <div className="vr opacity-10"></div>
          <div className="d-flex align-items-center gap-4">
             <span className={`x-small fw-bold cursor-pointer ${styles.textMuted} hover-text-primary`}><FontAwesomeIcon icon={faFilter} className="me-1" /> Filter</span>
             <span className={`x-small fw-bold cursor-pointer ${styles.textMuted} hover-text-primary`}><FontAwesomeIcon icon={faChartBar} className="me-1" /> Stats</span>
             <span className={`x-small fw-bold cursor-pointer ${styles.textMuted} hover-text-primary`}><FontAwesomeIcon icon={faHistory} className="me-1" /> Replay</span>
          </div>
          <div className="ms-auto d-flex align-items-center gap-3">
             <div className="pulse-dot bg-success"></div>
             <span className="x-small fw-bold text-success">{liveActive ? 'Live Collaboration Active' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="row g-4 board-container scroll-hidden" style={{ minHeight: 'calc(100vh - 300px)' }}>
        {columns.map(col => (
          <div
            key={col.id}
            className="col-xl-3 col-md-6"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className={`p-4 rounded-5 h-100 ${styles.subtleBg} border ${isDark ? 'border-white border-opacity-5' : 'border-dark border-opacity-5'}`}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: col.color }}></div>
                  <h6 className="fw-bold mb-0 text-uppercase letter-spacing-wider">{col.title}</h6>
                  <span className={`badge rounded-pill bg-secondary bg-opacity-10 text-secondary x-small px-2`}>{col.count}</span>
                </div>
                <button className={`btn btn-sm p-0 border-0 ${styles.textMuted}`}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              <div className="task-list">
                {boardTasks.filter(t => t.column === col.id).map(task => (
                  <TaskCard key={task.id} task={task} isDark={isDark} styles={styles} onDragStart={onDragStart} onTaskClick={setDetailTask} />
                ))}

                {col.id === 'todo' && boardTasks.filter(t => t.column === 'todo').length === 0 && (
                   <div className={`p-4 border-dashed rounded-4 text-center cursor-pointer transition-all hover-bg-light ${isDark ? 'opacity-50' : 'text-muted'}`}>
                      <FontAwesomeIcon icon={faPlus} className="mb-2" />
                      <div className="x-small fw-bold">Add Another Task</div>
                   </div>
                )}
                {col.id === 'todo' && boardTasks.filter(t => t.column === 'todo').length > 0 && (
                   <div className={`p-4 border-dashed rounded-4 text-center cursor-pointer transition-all hover-bg-light ${isDark ? 'opacity-50' : 'text-muted'}`}>
                      <FontAwesomeIcon icon={faPlus} className="mb-2" />
                      <div className="x-small fw-bold">Add Another Task</div>
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="position-fixed top-50 end-0 translate-middle-y me-3 z-3 d-none d-xl-block">
         <div className={`p-2 rounded-pill shadow-2xl border ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`}>
            <div className="d-flex flex-column gap-3">
               {floatingAvatars.map((av, i) => (
                  <div key={i} className="position-relative cursor-pointer hover-scale transition-all">
                     <div className="rounded-circle shadow-sm overflow-hidden" style={{ width: '40px', height: '40px', border: '2px solid #10b981' }}>
                        <div className={`w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold x-small`}>
                           {av}
                        </div>
                     </div>
                     <span className="position-absolute bottom-0 end-0 p-1 bg-success rounded-circle border border-white" style={{ width: '12px', height: '12px' }}></span>
                  </div>
               ))}
               <div className="rounded-circle bg-light d-flex align-items-center justify-content-center cursor-pointer hover-bg-primary hover-text-white transition-all" style={{ width: '40px', height: '40px' }}>
                  <FontAwesomeIcon icon={faPlus} className="small" />
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .boards-wrapper { font-family: 'Inter', system-ui, sans-serif; }
        .bg-dark-card { background-color: #1e293b !important; }
        .bg-dark-subtle-custom { background-color: rgba(30, 41, 59, 0.5) !important; }
        .bg-light-subtle-custom { background-color: rgba(248, 250, 252, 0.8) !important; }
        .rounded-5 { border-radius: 2rem !important; }
        .backdrop-blur { backdrop-filter: blur(20px); }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); }
        .x-small { font-size: 0.75rem; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .hover-scale:hover { transform: scale(1.1); }
        .hover-text-primary:hover { color: #4f46e5 !important; }
        .-space-x-2 > div { margin-left: -8px; }
        .-space-x-2 > div:first-child { margin-left: 0; }
        .scroll-hidden::-webkit-scrollbar { width: 0; background: transparent; }
        .border-dashed { border: 2px dashed rgba(0,0,0,0.1); }
        .dark-mode .border-dashed { border-color: rgba(255,255,255,0.1); }
        .task-card-premium:hover { border-left: 4px solid #4f46e5 !important; }
        .pulse-dot { width: 10px; height: 10px; border-radius: 50%; animation: pulse-green 2s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .td-title-clickable { cursor: pointer; }
        .td-title-clickable:hover { color: #6366f1 !important; }
      `}</style>

      <TaskDetailModal
        task={detailTask}
        show={!!detailTask}
        onClose={() => setDetailTask(null)}
      />
    </div>
  );
};

export default TmsSharedTaskBoards;
