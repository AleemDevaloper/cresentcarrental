import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faFilter, 
    faThLarge, 
    faList,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const ClientSearchControls = ({ viewMode, setViewMode, searchQuery, setSearchQuery, filters, setFilters }) => {
    const { t } = useTranslation();

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-3">
                <div className="row g-3 align-items-center">
                    {/* Search */}
                    <div className="col-lg-4">
                        <div className="input-group bg-light rounded-pill px-3 py-1">
                            <span className="input-group-text bg-transparent border-0 text-muted">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 shadow-none" 
                                placeholder={t('search_clients')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="col-lg-6">
                        <div className="d-flex gap-2 flex-wrap">
                            <div className="dropdown">
                                <button className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white" type="button" data-bs-toggle="dropdown">
                                    <FontAwesomeIcon icon={faFilter} className="text-muted small" />
                                    <span>{t('status')}: {filters.status}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-muted extra-small" />
                                </button>
                                <ul className="dropdown-menu border-0 shadow rounded-4">
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, status: 'All'})}>All</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, status: 'Active'})}>Active</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, status: 'Inactive'})}>Inactive</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, status: 'Archived'})}>Archived</button></li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white" type="button" data-bs-toggle="dropdown">
                                    <FontAwesomeIcon icon={faFilter} className="text-muted small" />
                                    <span>{t('industry')}: {filters.industry}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-muted extra-small" />
                                </button>
                                <ul className="dropdown-menu border-0 shadow rounded-4">
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, industry: 'All'})}>All</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, industry: 'Technology'})}>Technology</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, industry: 'Logistics'})}>Logistics</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, industry: 'Finance'})}>Finance</button></li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2 border shadow-sm bg-white" type="button" data-bs-toggle="dropdown">
                                    <FontAwesomeIcon icon={faFilter} className="text-muted small" />
                                    <span>{t('country')}: {filters.country}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="text-muted extra-small" />
                                </button>
                                <ul className="dropdown-menu border-0 shadow rounded-4">
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, country: 'All'})}>All</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, country: 'USA'})}>USA</button></li>
                                    <li><button className="dropdown-item" onClick={() => setFilters({...filters, country: 'United Kingdom'})}>United Kingdom</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="col-lg-2 text-end">
                        <div className="btn-group bg-light p-1 rounded-pill">
                            <button 
                                className={`btn rounded-pill px-3 border-0 ${viewMode === 'grid' ? 'btn-white shadow-sm fw-bold' : 'btn-transparent text-muted'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <FontAwesomeIcon icon={faThLarge} />
                            </button>
                            <button 
                                className={`btn rounded-pill px-3 border-0 ${viewMode === 'table' ? 'btn-white shadow-sm fw-bold' : 'btn-transparent text-muted'}`}
                                onClick={() => setViewMode('table')}
                            >
                                <FontAwesomeIcon icon={faList} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSearchControls;
