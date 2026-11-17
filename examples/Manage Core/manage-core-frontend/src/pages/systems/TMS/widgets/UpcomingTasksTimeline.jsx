import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faCircle, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const UpcomingTasksTimeline = ({ upcomingTasks = [] }) => {
  const [view, setView] = useState('timeline');

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Upcoming Tasks</h5>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group btn-group-sm rounded-pill p-1 bg-light">
              <button 
                className={`btn btn-sm rounded-pill px-3 border-0 ${view === 'timeline' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
                onClick={() => setView('timeline')}
              >
                Timeline
              </button>
              <button 
                className={`btn btn-sm rounded-pill px-3 border-0 ${view === 'gantt' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
                onClick={() => setView('gantt')}
              >
                Gantt
              </button>
              <button 
                className={`btn btn-sm rounded-pill px-3 border-0 ${view === 'timelinegaant' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
                onClick={() => setView('timelinegaant')}
              >
                TimelineGaant
              </button>
            </div>
            <button className="btn btn-light btn-sm rounded-circle shadow-sm" style={{ width: 32, height: 32 }}>
                <FontAwesomeIcon icon={faFilter} className="x-small" />
            </button>
          </div>
        </div>

        {upcomingTasks.length === 0 && view === 'timeline' && (
          <div className="text-center py-5 text-muted small">No upcoming tasks</div>
        )}

        {view === 'timeline' && upcomingTasks.length > 0 && (
          <div className="timeline-container position-relative ps-4 mt-2">
            <div className="timeline-line position-absolute start-0 top-0 bottom-0 ms-1 bg-light" style={{ width: '2px' }}></div>
            {upcomingTasks.map((task) => (
              <div key={task.id} className="timeline-item position-relative mb-4">
                <div 
                  className="timeline-dot position-absolute shadow-sm" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: task.color,
                    left: '-21px',
                    top: '4px',
                    border: '3px solid #fff'
                  }}
                ></div>
                <div className="d-flex justify-content-between align-items-start transition hover-lift-sm cursor-pointer">
                  <div>
                    <h6 className="fw-bold text-dark mb-1 small">{task.name}</h6>
                    <div className="d-flex align-items-center gap-2">
                        <span className="x-small text-muted">{task.time}</span>
                        <span className="x-small px-2 py-0 rounded-pill bg-light border fw-bold text-uppercase" style={{ letterSpacing: '0.05em', color: task.priority === 'High' || task.priority === 'Critical' ? '#ef4444' : '#64748b' }}>
                            {task.priority}
                        </span>
                    </div>
                  </div>
                  <div className="text-end">
                     <span className={`badge rounded-pill x-small fw-bold ${task.status === 'In Progress' ? 'bg-warning-subtle text-warning' : 'bg-primary-subtle text-primary'}`}>
                         {task.status}
                     </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-link btn-sm text-primary p-0 x-small fw-bold text-decoration-none mt-2">
                VIEW ALL TASKS <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
            </button>
          </div>
        )}

        {view === 'gantt' && (
          <div className="gantt-mock mt-2">
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-4 text-muted small">No tasks</div>
            ) : (
              upcomingTasks.map(task => (
                <div key={task.id} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-dark">{task.name}</span>
                    <span className="x-small fw-bold text-muted">{task.progress}%</span>
                  </div>
                  <div className="progress rounded-pill shadow-sm" style={{ height: '12px', backgroundColor: '#f1f5f9' }}>
                    <div 
                      className="progress-bar rounded-pill transition-all" 
                      style={{ 
                          width: `${task.progress}%`, 
                          backgroundColor: task.color,
                          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                          backgroundSize: '1rem 1rem'
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
            <div className="d-flex justify-content-between x-small text-muted mt-3 pt-2 border-top">
                <span>Jul 20</span>
                <span>Jul 22</span>
                <span>Jul 24</span>
                <span>Jul 26</span>
                <span>Jul 28</span>
            </div>
          </div>
        )}

        {view === 'timelinegaant' && (
          <div className="timeline-gaant-mini overflow-hidden rounded-3 border mt-2">
            <div className="d-flex bg-light border-bottom">
              <div className="px-2 py-2 border-end fw-bold x-small text-muted" style={{ minWidth: '100px' }}>Task</div>
              <div className="d-flex overflow-auto flex-grow-1 no-scrollbar">
                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                  const d = new Date();
                  d.setDate(d.getDate() + offset);
                  return (
                    <div key={offset} className="text-center py-1 border-end" style={{ minWidth: '40px' }}>
                      <div style={{ fontSize: '8px' }} className="text-muted fw-bold">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div style={{ fontSize: '9px' }} className="fw-bold">{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="timeline-rows overflow-auto no-scrollbar" style={{ maxHeight: '200px' }}>
              {upcomingTasks.map((task) => (
                <div key={task.id} className="d-flex border-bottom transition">
                  <div className="px-2 py-2 border-end text-truncate x-small fw-bold" style={{ minWidth: '100px' }}>
                    {task.name}
                  </div>
                  <div className="flex-grow-1 position-relative" style={{ height: '32px', minWidth: '280px' }}>
                    <div className="d-flex h-100">
                      {[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i} className="border-end h-100" style={{ minWidth: '40px' }}></div>)}
                    </div>
                    <div 
                      className="position-absolute rounded-pill shadow-sm d-flex align-items-center px-2"
                      style={{ 
                        height: '18px', 
                        top: '7px', 
                        left: `${(upcomingTasks.indexOf(task) % 5) * 40 + 10}px`, 
                        width: '100px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        fontSize: '8px',
                        fontWeight: '700',
                        zIndex: 2
                      }}
                    >
                      <FontAwesomeIcon icon={faCircle} className="me-1" style={{ fontSize: '4px' }} />
                      {task.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .x-small { font-size: 10px; }
        .hover-lift-sm:hover { transform: translateX(5px); }
        .transition-all { transition: all 0.5s ease; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default UpcomingTasksTimeline;