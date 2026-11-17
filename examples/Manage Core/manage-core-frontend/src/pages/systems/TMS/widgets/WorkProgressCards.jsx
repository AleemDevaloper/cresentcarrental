import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faClock } from '@fortawesome/free-solid-svg-icons';

const WorkProgressCards = ({ activeTasks = [] }) => {
  const getProgressColor = (percent) => {
    if (percent <= 30) return '#ef4444';
    if (percent <= 60) return '#f59e0b';
    if (percent <= 90) return '#0ea5e9';
    return '#10b981';
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">Work Progress</h5>
            <p className="text-muted x-small mb-0">Current Tasks In Progress</p>
          </div>
          <button className="btn btn-link text-muted p-0"><FontAwesomeIcon icon={faEllipsisVertical} /></button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-center py-5 text-muted small">No tasks in progress</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {activeTasks.map(task => (
              <div key={task.id} className="p-3 rounded-4 border bg-white transition hover-lift shadow-hover">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold text-dark mb-1 small">{task.title}</h6>
                    <span className="x-small text-muted fw-medium">{task.project}</span>
                  </div>
                  <span className={`badge rounded-pill x-small fw-bold ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold x-small" 
                    style={{ width: '24px', height: '24px', backgroundColor: '#6366f1' }}
                  >
                    {task.member && task.member.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="x-small text-muted">{task.member}</span>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="x-small fw-bold text-muted">{task.progress}% Complete</span>
                    <span className="x-small text-muted"><FontAwesomeIcon icon={faClock} className="me-1" />{task.hours}</span>
                  </div>
                  <div className="progress rounded-pill shadow-inner" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                    <div 
                      className="progress-bar rounded-pill transition-all" 
                      style={{ 
                          width: `${task.progress}%`, 
                          backgroundColor: getProgressColor(task.progress),
                          boxShadow: `0 0 10px ${getProgressColor(task.progress)}4d`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="badge bg-light text-muted border x-small fw-bold px-3 py-1 rounded-pill">{task.status}</span>
                  <button className="btn btn-link p-0 text-primary x-small fw-bold text-decoration-none">Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }
        .shadow-hover:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default WorkProgressCards;