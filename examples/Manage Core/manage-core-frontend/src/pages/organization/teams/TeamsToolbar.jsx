import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faThLarge, faList, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { SORT_OPTIONS } from './teamsData';

const TeamsToolbar = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  onAddNew,
  onToggleFilters,
  showFilters,
  activeFilterCount,
}) => (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 15 }}>
    <div className="card-body">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="input-group" style={{ maxWidth: 300, minWidth: 240 }}>
          <span className="input-group-text bg-transparent border-end-0 text-muted">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="search"
            className="form-control border-start-0"
            placeholder="Search Teams"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="btn-group shadow-sm" role="group">
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              <FontAwesomeIcon icon={faList} />
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
            >
              <FontAwesomeIcon icon={faThLarge} />
            </button>
          </div>

          <select
            className="form-select form-select-sm shadow-sm"
            style={{ width: 'auto', minWidth: 180 }}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>Sort By : {opt.label}</option>
            ))}
          </select>

          <button
            type="button"
            className={`btn btn-sm ${showFilters ? 'btn-primary' : 'btn-light'} shadow-sm`}
            onClick={onToggleFilters}
          >
            <FontAwesomeIcon icon={faFilter} className="me-1" />
            Filters
            {activeFilterCount > 0 && (
              <span className="badge bg-white text-primary ms-1">{activeFilterCount}</span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-primary fw-bold shadow-sm px-4"
            style={{ height: 42 }}
            onClick={onAddNew}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TeamsToolbar;
