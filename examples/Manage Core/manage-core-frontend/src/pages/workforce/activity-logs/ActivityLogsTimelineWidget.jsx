import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import ActivityTimeline from './ActivityTimeline';

const ActivityLogsTimelineWidget = ({ activities, onEmployeeClick, onViewAll }) => (
  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
    <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" />
        <h6 className="mb-0 fw-bold">Recent Activity</h6>
      </div>
      {onViewAll && (
        <button type="button" className="btn btn-link btn-sm text-primary p-0 fw-bold" onClick={onViewAll}>
          View All
        </button>
      )}
    </div>
    <div className="card-body p-3">
      <ActivityTimeline
        activities={activities.slice(0, 3)}
        onEmployeeClick={onEmployeeClick}
      />
    </div>
  </div>
);

export default ActivityLogsTimelineWidget;
