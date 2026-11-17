import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHistory,
  faSearch,
  faFilter,
  faDownload,
  faCalendar,
  faChartLine,
  faHourglassHalf,
  faCheckCircle,
  faBell,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import { EnableDisableButton } from '../../../components/common';
import ActivityTimeline from './ActivityTimeline';
import {
  SAMPLE_ACTIVITIES,
  EXTRA_ACTIVITIES,
  ACTIVITY_CATEGORIES,
  ACTIVITY_TYPE_CONFIG,
} from './activityLogsData';

const PAGE_SIZE = 5;

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-3 col-6">
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
      <div className="card-body d-flex align-items-center gap-3 p-3">
        <div
          className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-${color}-subtle text-${color}`}
          style={{ width: 44, height: 44 }}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <div className="fw-bold fs-5">{value}</div>
          <div className="text-muted small">{title}</div>
        </div>
      </div>
    </div>
  </div>
);

const ActivityLogsPage = () => {
  const { currentUser, addNotification } = useApp();
  const role = currentUser?.role || 'Employee';

  const [allActivities, setAllActivities] = useState(SAMPLE_ACTIVITIES);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [liveUpdates, setLiveUpdates] = useState(true);

  const roleVisibleActivities = useMemo(() => {
    if (role === 'Admin' || role === 'HR' || role === 'Manager') {
      return allActivities;
    }
    return allActivities.filter(
      (a) => a.employee?.name === 'You' || a.employee?.role === 'Team Lead'
    );
  }, [allActivities, role]);

  const filteredActivities = useMemo(() => {
    return roleVisibleActivities.filter((activity) => {
      const config = ACTIVITY_TYPE_CONFIG[activity.type];
      const matchesSearch =
        !searchQuery ||
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.employee?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' || config?.category === categoryFilter;

      const matchesType = typeFilter === 'all' || activity.type === typeFilter;

      const activityDate = new Date(activity.timestamp);
      const matchesDateFrom = !dateFrom || activityDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || activityDate <= new Date(`${dateTo}T23:59:59`);

      return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [roleVisibleActivities, searchQuery, categoryFilter, typeFilter, dateFrom, dateTo]);

  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  const stats = useMemo(() => ({
    total: filteredActivities.length,
    pending: filteredActivities.filter((a) => a.status === 'pending').length,
    completed: filteredActivities.filter((a) => a.status === 'completed' || a.status === 'approved').length,
    new: filteredActivities.filter((a) => a.isNew).length,
  }), [filteredActivities]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const nextCount = visibleCount + PAGE_SIZE;
      if (nextCount >= allActivities.length && allActivities.length < SAMPLE_ACTIVITIES.length + EXTRA_ACTIVITIES.length) {
        setAllActivities((prev) => [...prev, ...EXTRA_ACTIVITIES.filter((e) => !prev.find((p) => p.id === e.id))]);
      }
      setVisibleCount(nextCount);
      setLoading(false);
    }, 600);
  }, [visibleCount, allActivities.length]);

  const handleExport = () => {
    const csvContent = [
      ['Title', 'Description', 'Date', 'Status', 'Employee', 'Type'].join(','),
      ...filteredActivities.map((a) =>
        [a.title, `"${a.description}"`, a.timestamp, a.status, a.employee?.name, a.type].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Activity logs exported successfully.', 'success');
  };

  const handleEmployeeClick = (employee) => {
    addNotification(`Viewing profile: ${employee.name} (${employee.role})`, 'info');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setDateFrom('');
    setDateTo('');
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    if (!liveUpdates) return undefined;
    const interval = setInterval(() => {
      setAllActivities((prev) =>
        prev.map((a) => (a.isNew ? { ...a, isNew: false } : a))
      );
    }, 15000);
    return () => clearInterval(interval);
  }, [liveUpdates]);

  return (
    <div className="p-1 fade-in">
      {/* Stats */}
      <div className="row g-3 mb-4">
        <StatCard title="Total Activities" value={stats.total} icon={faChartLine} color="primary" />
        <StatCard title="Pending" value={stats.pending} icon={faHourglassHalf} color="warning" />
        <StatCard title="Completed" value={stats.completed} icon={faCheckCircle} color="success" />
        {stats.new > 0 && (
          <StatCard title="New Updates" value={stats.new} icon={faBell} color="danger" />
        )}
      </div>

      {/* Filters Card — AuditLogs pattern */}
      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-primary" />
              Filter Activity Logs
            </h5>
            <div className="d-flex align-items-center gap-2">
              <EnableDisableButton
                checked={liveUpdates}
                onClick={() => setLiveUpdates(!liveUpdates)}
                label="Live Updates"
              />
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                onClick={handleExport}
              >
                <FontAwesomeIcon icon={faDownload} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search activity, employee..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                {ACTIVITY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="all">All Activity Types</option>
                {Object.entries(ACTIVITY_TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleClearFilters}
              >
                <FontAwesomeIcon icon={faFilter} />
                Reset Filters
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <input
                  type="date"
                  className="form-control border-start-0"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted">
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
                <input
                  type="date"
                  className="form-control border-start-0"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setVisibleCount(PAGE_SIZE);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Card — TmsActivityLogs / HrmsAttendance pattern */}
      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" />
            <h5 className="mb-0 fw-bold">Activity Timeline</h5>
          </div>
          {liveUpdates && (
            <span className="badge bg-success-subtle text-success x-small fw-bold text-uppercase">
              Live Tracking Enabled
            </span>
          )}
        </div>
        <div className="card-body p-4">
          <ActivityTimeline
            activities={visibleActivities}
            onLoadMore={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
            onEmployeeClick={handleEmployeeClick}
            totalCount={filteredActivities.length}
          />
        </div>
      </div>

      {role !== 'Admin' && role !== 'HR' && (
        <div className="alert alert-light border mt-4 mb-0 d-flex align-items-center gap-2 small text-muted">
          <FontAwesomeIcon icon={faShieldHalved} className="text-primary" />
          Showing activities visible to your role (<strong>{role}</strong>).
          Admin and HR users can view all workforce activity.
        </div>
      )}

      <style>{`
        .x-small { font-size: 10px; }
        .extra-small { font-size: 10px; }
        .transition { transition: all 0.2s; }
        .hover-lift-sm:hover { transform: translateY(-1px); border-color: #e2e8f0 !important; }
      `}</style>
    </div>
  );
};

export default ActivityLogsPage;
