import React from 'react';
import ActivityItem from './ActivityItem';

const DateGroup = ({ date, items, onEmployeeClick }) => (
  <div className="mb-4">
    <div className="d-flex align-items-center gap-3 mb-3">
      <span className="badge bg-light text-dark border px-3 py-2 fw-semibold">{date}</span>
      <div className="flex-grow-1 border-bottom border-light" />
      <span className="text-muted x-small fw-bold text-uppercase">{items.length} events</span>
    </div>
    {items.map((activity) => (
      <ActivityItem
        key={activity.id}
        activity={activity}
        onEmployeeClick={onEmployeeClick}
      />
    ))}
  </div>
);

export default DateGroup;
