import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import DateGroup from './DateGroup';
import LoadMoreButton from './LoadMoreButton';
import { groupActivitiesByDate } from './activityLogsData';

const ActivityTimeline = ({
  activities,
  onLoadMore,
  loading,
  hasMore,
  onEmployeeClick,
  totalCount,
}) => {
  const grouped = groupActivitiesByDate(activities);

  if (activities.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FontAwesomeIcon icon={faInbox} className="fs-2 mb-3 d-block opacity-50" />
        <h6 className="fw-bold text-dark">No activities found</h6>
        <p className="small mb-0">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline position-relative ps-4">
      <div
        className="timeline-line position-absolute top-0 bottom-0 start-0 bg-light"
        style={{ width: '2px', marginLeft: '10px' }}
      />

      {totalCount != null && (
        <p className="text-muted small mb-4">
          Showing <strong>{activities.length}</strong> of <strong>{totalCount}</strong> activities
        </p>
      )}

      {grouped.map(({ date, items }) => (
        <DateGroup
          key={date}
          date={date}
          items={items}
          onEmployeeClick={onEmployeeClick}
        />
      ))}

      <LoadMoreButton
        onClick={onLoadMore}
        loading={loading}
        hasMore={hasMore}
        remaining={totalCount != null ? totalCount - activities.length : 0}
      />
    </div>
  );
};

export default ActivityTimeline;
