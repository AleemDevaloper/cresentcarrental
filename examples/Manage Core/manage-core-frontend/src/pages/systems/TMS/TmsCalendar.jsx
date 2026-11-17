import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, 
  faChevronLeft, 
  faChevronRight, 
  faTasks,
  faCircle,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import TaskDetailModal from './TaskDetailModal';

const TmsCalendar = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

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
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(data);
      } catch (err) {
        addNotification("Failed to load tasks.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.due_date && t.due_date.startsWith(dateStr));
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div key={d} className={`calendar-day ${isToday ? 'today' : ''}`}>
          <span className="day-number">{d}</span>
          <div className="day-tasks mt-1">
            {dayTasks.map(t => (
              <div key={t.id} className="calendar-task-badge" title={t.title} onClick={() => setSelectedTask(t)}>
                <FontAwesomeIcon icon={faCircle} className={`x-small me-1 text-${t.priority === 'Critical' ? 'danger' : 'primary'}`} />
                <span className="text-truncate">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="container-fluid py-4 fade-in">
      <div className={`card border-0 shadow-lg rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
        <div className="card-header p-0 border-0">
          <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-4 shadow-sm">
                  <FontAwesomeIcon icon={faCalendarAlt} className="fs-3" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1">Project Calendar</h3>
                  <p className="mb-0 opacity-75">Track deadlines and schedule work visually across the timeline.</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <select 
                  className="form-select border-0 shadow-none rounded-pill px-4 bg-white bg-opacity-10 text-white fw-bold" 
                  style={{ width: '220px' }}
                  value={selectedProject || ''} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Tasks</option>
                  {projects.map(p => <option key={p.id} value={p.id} className={`${isDark ? 'text-light bg-dark' : 'text-dark'}`}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5">
          <div className="d-flex align-items-center justify-content-between mb-5">
            <h4 className={`fw-bold mb-0 ${isDark ? 'text-light' : 'text-dark'}`}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
            <div className="d-flex gap-2">
              <button className={`btn rounded-circle border shadow-sm ${isDark ? 'btn-dark border-white border-opacity-10' : 'btn-light'}`} style={{ width: '40px', height: '40px' }} onClick={prevMonth}><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm mx-2" onClick={() => setCurrentDate(new Date())}>Today</button>
              <button className={`btn rounded-circle border shadow-sm ${isDark ? 'btn-dark border-white border-opacity-10' : 'btn-light'}`} style={{ width: '40px', height: '40px' }} onClick={nextMonth}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>

          <div className={`calendar-wrapper border rounded-4 overflow-hidden shadow-sm ${isDark ? 'border-white border-opacity-10' : ''}`}>
            <div className={`calendar-grid-header d-grid ${isDark ? 'bg-dark-header' : 'bg-light'}`}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center py-3 fw-bold text-muted small text-uppercase letter-spacing-wider">{day}</div>
              ))}
            </div>
            <div className="calendar-grid d-grid">
              {renderCalendar()}
            </div>
          </div>
        </div>
      </div>

      <TaskDetailModal task={selectedTask} show={!!selectedTask} onClose={() => setSelectedTask(null)} />

      <style>{`
        .calendar-grid-header, .calendar-grid { grid-template-columns: repeat(7, 1fr); }
        .calendar-day { min-height: 120px; border: 1px solid #f1f5f9; padding: 10px; background: #fff; transition: all 0.2s; }
        .calendar-day:hover { background: #f8fafc; }
        .calendar-day.empty { background: #fdfdfd; }
        .calendar-day.today { background: #f5f3ff; border-color: #ddd6fe; }
        .calendar-day.today .day-number { background: #6366f1; color: white; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 700; }
        .day-number { font-weight: 600; color: #64748b; font-size: 0.9rem; }
        .calendar-task-badge { background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 8px; margin-bottom: 4px; font-size: 10px; font-weight: 700; display: flex; align-items: center; cursor: pointer; transition: all 0.2s; }
        .calendar-task-badge:hover { transform: scale(1.02); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .rounded-5 { border-radius: 2.5rem !important; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .x-small { font-size: 8px; }
        ${isDark ? `
          .calendar-grid-header .text-muted { color: #94a3b8 !important; }
          .calendar-day { background: #1e293b; border-color: #334155 !important; }
          .calendar-day:hover { background: #334155; }
          .calendar-day.empty { background: #1a2332; }
          .calendar-day.today { background: #1e1b4b; border-color: #6366f1 !important; }
          .day-number { color: #94a3b8; }
          .calendar-day.today .day-number { background: #6366f1; color: white; }
          .calendar-task-badge { background: #1e293b; border-color: #475569; color: #e2e8f0; }
          .calendar-task-badge:hover { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
        ` : ''}
      `}</style>
    </div>
  );
};

export default TmsCalendar;
