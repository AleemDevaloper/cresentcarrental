import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const TeamsPagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  totalItems 
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 px-1">
      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-medium">Show Per Page</span>
          <select 
            className="form-select form-select-sm border-0 shadow-sm" 
            style={{ width: 'auto', backgroundColor: '#fff', borderRadius: 8, cursor: 'pointer' }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <span className="text-muted small">
          Showing <span className="fw-bold text-dark">{startItem}-{endItem}</span> of <span className="fw-bold text-dark">{totalItems}</span> teams
        </span>
      </div>

      <nav aria-label="Teams pagination">
        <ul className="pagination pagination-sm mb-0 gap-1">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center" 
              style={{ width: 32, height: 32 }}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          </li>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Simple pagination display: 1 2 3 ... total
            if (totalPages > 5) {
              if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                if (pageNum === 2 || pageNum === totalPages - 1) return <li key={pageNum} className="px-1 text-muted">...</li>;
                return null;
              }
            }

            return (
              <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                <button 
                  className={`page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center fw-bold ${currentPage === pageNum ? 'bg-primary text-white' : 'bg-white text-muted'}`}
                  style={{ width: 32, height: 32 }}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center" 
              style={{ width: 32, height: 32 }}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </li>
        </ul>
      </nav>

      <style>{`
        .pagination .page-link {
          transition: all 0.2s ease;
        }
        .pagination .page-link:hover:not(.bg-primary) {
          background-color: #f8fafc !important;
          color: var(--bs-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default TeamsPagination;
