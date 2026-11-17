import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faBolt,
  faDownload,
  faLightbulb,
  faPeopleGroup,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import TeamsToolbar from './TeamsToolbar';
import TeamGrid from './TeamGrid';
import TeamsPagination from './TeamsPagination';
import {
  SAMPLE_TEAMS,
  DEPARTMENTS,
  MANAGERS,
  TEAM_STATUSES,
} from './teamsData';

const TeamsProductivityDashboard = () => {
  const { addNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default to grid for dashboard
  const [sortBy, setSortBy] = useState('highest_productivity'); // Default sort for productivity
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // 6 per page for grid
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [managerFilter, setManagerFilter] = useState('All Managers');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const activeFilterCount = [
    departmentFilter !== 'All Departments',
    managerFilter !== 'All Managers',
    statusFilter !== 'All Status',
    dateFrom,
    dateTo,
  ].filter(Boolean).length;

  const filteredTeams = useMemo(() => {
    let result = SAMPLE_TEAMS.filter((team) => {
      const matchesSearch =
        !searchQuery ||
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.members && team.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesDept =
        departmentFilter === 'All Departments' || team.department === departmentFilter;

      const matchesManager =
        managerFilter === 'All Managers' || team.manager === managerFilter;

      const matchesStatus =
        statusFilter === 'All Status' || team.status === statusFilter;

      const created = new Date(team.createdAt);
      const matchesFrom = !dateFrom || created >= new Date(dateFrom);
      const matchesTo = !dateTo || created <= new Date(`${dateTo}T23:59:59`);

      return matchesSearch && matchesDept && matchesManager && matchesStatus && matchesFrom && matchesTo;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest_productivity':
          return b.productivityPercent - a.productivityPercent;
        case 'lowest_productivity':
          return a.productivityPercent - b.productivityPercent;
        case 'most_members':
          return b.memberCount - a.memberCount;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [searchQuery, departmentFilter, managerFilter, statusFilter, dateFrom, dateTo, sortBy]);

  const totalPages = Math.ceil(filteredTeams.length / pageSize);
  const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const summary = useMemo(() => ({
    totalTeams: filteredTeams.length,
    avgProductivity: filteredTeams.length
      ? Math.round(filteredTeams.reduce((s, t) => s + t.productivityPercent, 0) / filteredTeams.length)
      : 0,
    totalMembers: filteredTeams.reduce((s, t) => s + t.memberCount, 0),
  }), [filteredTeams]);

  const handlePageChange = (page) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleAction = (action, team) => {
    const messages = {
      view: `Opening details for ${team.name}`,
      edit: `Editing ${team.name}`,
      assign: `Assign members to ${team.name}`,
      export: `Exporting data for ${team.name}`,
      delete: `Delete request for ${team.name}`,
    };
    addNotification(messages[action] || 'Action completed', action === 'delete' ? 'warning' : 'info');
  };

  const handleExportAll = () => {
    addNotification('Exporting productivity report...', 'info');
  };

  return (
    <div className="p-1 fade-in">
      {/* Stats Overview */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <div className="card-body p-3">
              <div className="text-muted small fw-bold text-uppercase mb-2">Total Teams</div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                   <FontAwesomeIcon icon={faPeopleGroup} />
                </div>
                <div className="fs-3 fw-bold">{summary.totalTeams}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <div className="card-body p-3">
              <div className="text-muted small fw-bold text-uppercase mb-2">Efficiency</div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                   <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div className="fs-3 fw-bold">{summary.avgProductivity}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <div className="card-body p-3">
              <div className="text-muted small fw-bold text-uppercase mb-2">Total Members</div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                   <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="fs-3 fw-bold">{summary.totalMembers}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16 }}>
            <div className="card-body p-3">
              <div className="text-muted small fw-bold text-uppercase mb-2">Critical Tasks</div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                   <FontAwesomeIcon icon={faBolt} />
                </div>
                <div className="fs-3 fw-bold">12</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeamsToolbar
        searchQuery={searchQuery}
        onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={(v) => { setSortBy(v); setCurrentPage(1); }}
        onAddNew={() => addNotification('Adding new team...', 'info')}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="mb-4">
        <TeamGrid
          teams={paginatedTeams}
          viewMode={viewMode}
          onAction={handleAction}
          loading={loading}
        />
      </div>

      <TeamsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalItems={filteredTeams.length}
      />

      {/* AI Recommendations */}
      <div className="mt-5">
        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faLightbulb} className="text-warning" />
          AI Team Productivity Recommendations
        </h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16, borderLeft: '4px solid #4f46e5' }}>
              <div className="card-body">
                <h6 className="fw-bold text-primary mb-2">Workload Rebalancing</h6>
                <p className="small text-muted mb-0">DevOps team is currently at 94% capacity. Consider moving non-critical tasks to the Testing team to avoid burnout.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 16, borderLeft: '4px solid #f59e0b' }}>
              <div className="card-body">
                <h6 className="fw-bold text-warning mb-2">Efficiency Insight</h6>
                <p className="small text-muted mb-0">UX Research shows a 15% increase in manual hours this week. Recommend automated reporting tools to save time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsProductivityDashboard;
