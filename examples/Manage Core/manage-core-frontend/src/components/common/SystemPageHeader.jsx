import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChevronRight, faRefresh, faDownload } from '@fortawesome/free-solid-svg-icons';

const SystemPageHeader = ({ main, title, icon = faChartLine, isDark }) => {
  return (
    <div className={`mb-4 px-4 py-4 ${isDark ? 'bg-dark border-bottom border-white border-opacity-10' : 'bg-white border-bottom shadow-sm'} d-flex flex-wrap align-items-center justify-content-between gap-3`}>
      <div className="d-flex align-items-center gap-3">
        <div 
          className="rounded-4 bg-primary bg-opacity-10 p-2 text-primary d-flex align-items-center justify-content-center shadow-sm" 
          style={{ width: '52px', height: '52px', border: '1px solid rgba(79, 70, 229, 0.2)' }}
        >
          <FontAwesomeIcon icon={icon} className="fs-4" />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="text-muted small text-uppercase letter-spacing-wider fw-bold">{main}</span>
            <FontAwesomeIcon icon={faChevronRight} className="x-small text-muted opacity-50" />
            <span className="text-primary small text-uppercase letter-spacing-wider fw-bold">Analytics</span>
          </div>
          <h3 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>{title}</h3>
        </div>
      </div>
      <div className="d-flex gap-2">
         <button className={`btn ${isDark ? 'btn-outline-light border-opacity-25' : 'btn-white border'} rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 transition-all hover-lift`}>
            <FontAwesomeIcon icon={faRefresh} className="small text-primary" />
            <span className="small">Refresh</span>
         </button>
         <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 transition-all hover-lift">
            <FontAwesomeIcon icon={faDownload} className="small" />
            <span className="small">Export Insight</span>
         </button>
      </div>
    </div>
  );
};

export default SystemPageHeader;
