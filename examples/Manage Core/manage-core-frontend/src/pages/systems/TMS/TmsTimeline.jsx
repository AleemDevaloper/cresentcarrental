import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faTasks,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import TaskDetailModal from './TaskDetailModal';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86400000;
const WEEK_MS = 604800000;

const TmsTimeline = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('week');
  const [range, setRange] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      /* eslint-disable-next-line no-unused-vars */
      } catch (err) {
        addNotification("Failed to load projects.", "danger");
      }
    };
    fetchProjects();
  }, [addNotification]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(data);
      /* eslint-disable-next-line no-unused-vars */
      } catch (err) {
        addNotification("Failed to load tasks.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [addNotification, selectedProject]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getMonthStart = (date) => {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const DAY_WIDTH = 80;

  const timelineConfig = (() => {
    if (viewMode === 'week') {
      const totalDays = range * 7;
      const past = Math.ceil(totalDays / 2);
      const future = totalDays - past;
      return { past, future, unit: 'day', columnWidth: DAY_WIDTH };
    }
    if (viewMode === 'month') {
      const totalWeeks = range * 4;
      const past = Math.ceil(totalWeeks / 2);
      const future = totalWeeks - past;
      return { past, future, unit: 'week', columnWidth: 120 };
    }
    const past = 2;
    const future = 9;
    return { past, future, unit: 'month', columnWidth: 140 };
  })();

  const getTimelineColumns = () => {
    const columns = [];
    if (timelineConfig.unit === 'day') {
      for (let i = -timelineConfig.past; i < timelineConfig.future; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        d.setHours(0, 0, 0, 0);
        columns.push({ type: 'day', date: d, label: `${d.toLocaleDateString(undefined, { weekday: 'short' })} ${d.getDate()}`, fullDate: d });
      }
    } else if (timelineConfig.unit === 'week') {
      const startWeek = getWeekStart(today);
      for (let i = -timelineConfig.past; i < timelineConfig.future; i++) {
        const d = new Date(startWeek);
        d.setDate(startWeek.getDate() + i * 7);
        d.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setDate(d.getDate() + 6);
        columns.push({ type: 'week', date: d, label: `${MONTHS[d.getMonth()]} ${d.getDate()}`, fullDate: d, endDate: end });
      }
    } else {
      const startMonth = getMonthStart(today);
      for (let i = -timelineConfig.past; i < timelineConfig.future; i++) {
        const d = new Date(startMonth);
        d.setMonth(startMonth.getMonth() + i);
        d.setHours(0, 0, 0, 0);
        columns.push({ type: 'month', date: d, label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, fullDate: d });
      }
    }
    return columns;
  };

  const columns = getTimelineColumns();
  const timelineStart = columns[0]?.fullDate || today;

  const daysBetween = (d1, d2) => (d2.getTime() - d1.getTime()) / DAY_MS;

  const weeksBetween = (d1, d2) => {
    const monday1 = getWeekStart(d1);
    const monday2 = getWeekStart(d2);
    return Math.round((monday2.getTime() - monday1.getTime()) / WEEK_MS);
  };

  const monthsBetween = (d1, d2) => (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();

  const getColumnIndex = (date) => {
    if (!date) return -1;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (timelineConfig.unit === 'day') {
      return Math.round(daysBetween(timelineStart, d));
    }
    if (timelineConfig.unit === 'week') {
      return weeksBetween(timelineStart, d);
    }
    return monthsBetween(timelineStart, d);
  };

  const getBarStyle = (task) => {
    const startDate = task.start_date ? new Date(task.start_date) : (task.created_at ? new Date(task.created_at) : null);
    const dueDate = task.due_date ? new Date(task.due_date) : null;

    let barStart = dueDate ? new Date(dueDate) : new Date();
    if (!dueDate) barStart.setDate(barStart.getDate() - 3);
    if (startDate && startDate < barStart) barStart = new Date(startDate);

    let barEnd = dueDate ? new Date(dueDate) : new Date();
    if (startDate && startDate > barEnd) barEnd = new Date(startDate);
    if (barEnd < barStart) { const t = barEnd; barEnd = barStart; barStart = t; }

    const startIdx = getColumnIndex(barStart);
    const endIdx = getColumnIndex(barEnd);
    const totalCols = columns.length;
    const cw = timelineConfig.columnWidth;

    let left = Math.max(0, startIdx * cw);
    let width = Math.max(cw * 0.5, (endIdx - startIdx + 1) * cw);
    if (left + width > totalCols * cw) width = totalCols * cw - left;

    const statusColors = {
      'To Do': { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
      'In Progress': { bg: '#fef3c7', border: '#fde68a', text: '#b45309' },
      'Testing': { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
      'Done': { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46' },
      'Completed': { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46' },
    };
    const colors = statusColors[task.status] || { bg: '#f1f5f9', border: '#e2e8f0', text: '#475569' };

    return { left: `${left}px`, width: `${width}px`, backgroundColor: colors.bg, borderColor: colors.border, color: colors.text };
  };

  const rangeOptions = viewMode === 'week'
    ? [{ value: 1, label: '1 Week' }, { value: 2, label: '2 Weeks' }, { value: 3, label: '3 Weeks' }]
    : viewMode === 'month'
      ? [{ value: 1, label: '1 Month' }, { value: 2, label: '2 Months' }]
      : [{ value: 1, label: '1 Year' }];

  const todayColIdx = (() => {
    if (timelineConfig.unit === 'day') return getColumnIndex(today);
    if (timelineConfig.unit === 'week') return getColumnIndex(getWeekStart(today));
    return getColumnIndex(getMonthStart(today));
  })();

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-success bg-opacity-10 p-3 rounded-4">
                <FontAwesomeIcon icon={faChartLine} className="text-success fs-4" />
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Timeline & Gantt View</h4>
                <p className="text-muted small mb-0">Strategic roadmap and project scheduling visualization.</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="btn-group shadow-none rounded-pill overflow-hidden border">
                {['week', 'month', 'year'].map(m => (
                  <button key={m} className={`btn btn-sm px-3 ${viewMode === m ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => { setViewMode(m); if (m === 'year') setRange(1); }}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
              <div className="btn-group shadow-none rounded-pill overflow-hidden border">
                {rangeOptions.map(o => (
                  <button key={o.value} className={`btn btn-sm px-3 ${range === o.value ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setRange(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <select
                className="form-select border shadow-none rounded-pill px-4 bg-light fw-medium"
                style={{ width: '180px' }}
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">All Tasks</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-body p-0">
          <div className="timeline-header d-flex border-bottom bg-light bg-opacity-50">
            <div className="task-list-header px-4 py-3 fw-bold text-muted small text-uppercase border-end d-flex align-items-center gap-2" style={{ minWidth: '300px' }}>
              <FontAwesomeIcon icon={faTasks} className="text-muted" />
              Tasks
            </div>
            <div className="timeline-scroll-header d-flex overflow-hidden flex-grow-1">
              {columns.map((col, idx) => (
                <div key={idx} className="timeline-day-col border-end text-center py-2" style={{ minWidth: `${timelineConfig.columnWidth}px`, width: `${timelineConfig.columnWidth}px` }}>
                  {timelineConfig.unit === 'day' ? (
                    <>
                      <div className="small fw-bold text-muted">{col.date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className={`x-small fw-bold ${col.date.toDateString() === today.toDateString() ? 'text-primary' : 'text-secondary'}`}>{col.date.getDate()}</div>
                    </>
                  ) : timelineConfig.unit === 'week' ? (
                    <>
                      <div className="small fw-bold text-muted">{col.label}</div>
                      <div className={`x-small fw-bold ${today >= col.date && today <= col.endDate ? 'text-primary' : 'text-secondary'}`}>
                        {col.date.toLocaleDateString(undefined, { month: 'short' })} {col.date.getDate()} - {col.endDate.getDate()}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="small fw-bold text-muted">{col.label.split(' ')[0]}</div>
                      <div className={`x-small fw-bold ${col.date.getMonth() === today.getMonth() && col.date.getFullYear() === today.getFullYear() ? 'text-primary' : 'text-secondary'}`}>
                        {col.date.getFullYear()}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="timeline-body overflow-auto" style={{ maxHeight: '600px' }}>
            {tasks.map(task => {
              const barStyle = getBarStyle(task);
              return (
                <div key={task.id} className="timeline-row d-flex border-bottom transition">
                  <div className="task-name-cell px-4 py-3 border-end d-flex align-items-center gap-3" style={{ minWidth: '300px' }}>
                    <FontAwesomeIcon icon={faCircle} className={`x-small text-${task.priority === 'Critical' ? 'danger' : 'primary'}`} />
                    <span className="fw-bold text-dark text-truncate small">{task.title}</span>
                  </div>
                  <div className="timeline-bar-cell flex-grow-1 position-relative d-flex" style={{ height: '54px' }}>
                    {columns.map((col, i) => (
                      <div key={i} className="flex-grow-1 border-end" style={{
                        minWidth: `${timelineConfig.columnWidth}px`,
                        background: i === todayColIdx ? 'rgba(99,102,241,0.06)' : ''
                      }}></div>
                    ))}
                    <div
                      className="position-absolute rounded-pill shadow-sm d-flex align-items-center px-3 timeline-bar"
                      style={{
                        height: '24px', top: '15px', ...barStyle, zIndex: 2, cursor: 'pointer'
                      }}
                      onClick={() => setSelectedTask(task)}
                      title={`${task.title} — ${task.status}${task.due_date ? ' — Due: ' + new Date(task.due_date).toLocaleDateString() : ''}`}
                    >
                      {task.status}
                    </div>
                  </div>
                </div>
              );
            })}
            {tasks.length === 0 && !loading && (
              <div className="text-center py-5 opacity-50">
                <p>No tasks found to generate timeline.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskDetailModal task={selectedTask} show={!!selectedTask} onClose={() => setSelectedTask(null)} />

      <style>{`
        .timeline-body::-webkit-scrollbar { height: 10px; width: 8px; }
        .timeline-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .timeline-row:hover { background: #f8fafc; }
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
        .transition { transition: all 0.2s; }
        .timeline-bar { transition: all 0.2s; }
        .timeline-bar:hover { transform: scaleY(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
        .btn-group .btn-primary { z-index: 1; }
      `}</style>
    </div>
  );
};

export default TmsTimeline;
