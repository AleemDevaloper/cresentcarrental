import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ACTIVITY_TYPE_CONFIG, STATUS_CONFIG, formatActivityDateTime } from './activityLogsData';

const CATEGORY_LABELS = {
  attendance: 'Attendance',
  leave: 'Leave',
  performance: 'Performance',
  payroll: 'Payroll',
  organization: 'Organization',
  finance: 'Finance',
};

const ActivityItem = ({ activity, onEmployeeClick }) => {
  const config = ACTIVITY_TYPE_CONFIG[activity.type] || ACTIVITY_TYPE_CONFIG.checked_in;
  const statusConfig = STATUS_CONFIG[activity.status] || STATUS_CONFIG.completed;

  return (
    <div className="timeline-item mb-4 position-relative">
      <div
        className={`timeline-icon position-absolute start-0 translate-middle-x rounded-circle bg-${config.color} d-flex align-items-center justify-content-center shadow-sm`}
        style={{ width: '22px', height: '22px', marginTop: '12px', zIndex: 2 }}
      >
        <FontAwesomeIcon icon={config.icon} style={{ fontSize: '9px', color: '#fff' }} />
      </div>

      <div className="timeline-content ms-4 p-4 rounded-4 border border-light transition hover-lift-sm bg-white shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-2 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
              <span className="fw-bold text-dark">{activity.title}</span>
              {activity.isNew && (
                <span className="badge bg-danger-subtle text-danger x-small fw-bold text-uppercase">New</span>
              )}
              <span className={`badge bg-${config.color}-subtle text-${config.color} x-small fw-bold text-uppercase`}>
                {CATEGORY_LABELS[config.category] || config.category}
              </span>
            </div>
            <div className="x-small text-muted fw-bold text-uppercase">
              <FontAwesomeIcon icon={faClock} className="me-1" />
              {formatActivityDateTime(activity.timestamp)}
            </div>
          </div>
          <span className={`badge bg-${statusConfig.badge}-subtle text-${statusConfig.badge} text-uppercase flex-shrink-0`} style={{ fontSize: '10px' }}>
            {statusConfig.label}
          </span>
        </div>

        <p className="text-muted small mb-3 opacity-75">{activity.description}</p>

        {activity.employee && (
          <button
            type="button"
            className="btn btn-light btn-sm d-flex align-items-center gap-2 border-0 shadow-sm"
            onClick={() => onEmployeeClick?.(activity.employee)}
          >
            <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 28, height: 28 }}>
              <FontAwesomeIcon icon={faUser} className="text-muted small" />
            </div>
            <div className="text-start">
              <div className="small fw-bold">{activity.employee.name}</div>
              <div className="extra-small text-muted">{activity.employee.role}</div>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-muted ms-auto extra-small" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
