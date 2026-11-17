import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faBolt,
  faDownload,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import TeamsToolbar from './TeamsToolbar';
import TeamGrid from './TeamGrid';
import TeamsTable from './TeamsTable';
import TeamsPagination from './TeamsPagination';
import {
  SAMPLE_TEAMS,
  DEPARTMENTS,
  MANAGERS,
  TEAM_STATUSES,
} from './teamsData';

const TeamsPage = () => {
  const { addNotification } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [initialLoading] = useState(false);
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

  const handleSearchChange = (v) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  const handleSortChange = (v) => {
    setSortBy(v);
    setCurrentPage(1);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
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

  const handleAddNew = () => {
    addNotification('Create Team wizard coming soon.', 'info');
  };

  const handleExportAll = () => {
    const csv = [
      ['Team', 'Department', 'Manager', 'Members', 'Total Worked', 'Productive', 'Manual', 'Unproductive', 'Efficiency %'].join(','),
      ...filteredTeams.map((t) =>
        [t.name, t.department, t.manager, t.memberCount, t.totalWorked, t.productive, t.manual, t.unproductive, t.efficiency].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teams-productivity-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Teams data exported to CSV.', 'success');
  };

  const handleClearFilters = () => {
    setDepartmentFilter('All Departments');
    setManagerFilter('All Managers');
    setStatusFilter('All Status');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  return (
    <div className="p-1 fade-in">
      {/* Summary Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
            <div className="card-body d-flex align-items-center gap-3 p-3">
              <div className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div>
                <div className="fw-bold fs-5">{summary.totalTeams}</div>
                <div className="text-muted small">Active Teams</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
            <div className="card-body d-flex align-items-center gap-3 p-3">
              <div className="rounded-3 bg-success-subtle text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div>
                <div className="fw-bold fs-5">{summary.avgProductivity}%</div>
                <div className="text-muted small">Avg Productivity</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
            <div className="card-body d-flex align-items-center gap-3 p-3">
              <div className="rounded-3 bg-warning-subtle text-warning d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div>
                <div className="fw-bold fs-5">{summary.totalMembers}</div>
                <div className="text-muted small">Total Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="alert alert-primary border-0 shadow-sm d-flex align-items-start gap-3 mb-4" style={{ borderRadius: 15 }}>
        <FontAwesomeIcon icon={faLightbulb} className="mt-1" />
        <div className="small">
          <strong>AI Team Insight:</strong> DevOps and Cloud Computing teams show the highest productivity this month.
          IT Support has elevated manual hours — consider workload rebalancing.
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm ms-auto flex-shrink-0" onClick={handleExportAll}>
          <FontAwesomeIcon icon={faDownload} className="me-1" />
          Export
        </button>
      </div>

      <TeamsToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onAddNew={handleAddNew}
        onToggleFilters={() => setShowFilters((s) => !s)}
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
      />

      {showFilters && (
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 15 }}>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold text-uppercase">Department</label>
                <select className="form-select" value={departmentFilter} onChange={(e) => handleFilterChange(setDepartmentFilter, e.target.value)}>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold text-uppercase">Manager</label>
                <select className="form-select" value={managerFilter} onChange={(e) => handleFilterChange(setManagerFilter, e.target.value)}>
                  {MANAGERS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted fw-bold text-uppercase">Status</label>
                <select className="form-select" value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}>
                  {TEAM_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted fw-bold text-uppercase">From</label>
                <input type="date" className="form-control" value={dateFrom} onChange={(e) => handleFilterChange(setDateFrom, e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted fw-bold text-uppercase">To</label>
                <input type="date" className="form-control" value={dateTo} onChange={(e) => handleFilterChange(setDateTo, e.target.value)} />
              </div>
            </div>
            <div className="text-end mt-3">
              <button type="button" className="btn btn-link btn-sm" onClick={handleClearFilters}>Clear filters</button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'table' ? (
        <TeamsTable
          teams={paginatedTeams}
          onAction={handleAction}
          loading={loading}
        />
      ) : (
        <TeamGrid
          teams={paginatedTeams}
          viewMode={viewMode}
          onAction={handleAction}
          loading={loading}
        />
      )}

      <TeamsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalItems={filteredTeams.length}
      />

      <style>{`
        .x-small { font-size: 10px; }
        .transition { transition: all 0.2s ease; }
        .transition-width { transition: width 0.6s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .team-card { border: 1px solid rgba(0,0,0,0.06) !important; }
        .team-card:hover { border-color: rgba(99,102,241,0.25) !important; }
        .team-avatar-stack .team-avatar { transition: transform 0.2s ease; }
        .team-avatar-stack:hover .team-avatar { transform: translateY(-2px); }
      `}</style>
    </div>
  );
};

export default TeamsPage;
