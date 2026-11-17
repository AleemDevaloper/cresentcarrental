import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const PaginationBar = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  variant = 'full',
  isDark = false,
}) => {
  if (variant === 'simple') {
    return (
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
          className="btn btn-sm rounded-pill px-3 border-0 fw-bold"
          style={{
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            color: isDark ? '#f1f5f9' : '#1e293b',
          }}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="me-1" /> Previous
        </button>
        <span className="small fw-bold" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm rounded-pill px-3 border-0 fw-bold"
          style={{
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            color: isDark ? '#f1f5f9' : '#1e293b',
          }}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
        </button>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
      <div className="d-flex align-items-center gap-2">
        <span className="small" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
          Page {currentPage} of {totalPages}
        </span>
        {onPerPageChange && (
          <select
            className="form-select form-select-sm border shadow-none rounded-pill px-3"
            style={{
              width: '80px',
              backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
              color: isDark ? '#f1f5f9' : '#1e293b',
              borderColor: isDark ? '#475569' : '#dee2e6',
            }}
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        )}
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm rounded-pill px-3"
          style={{
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: isDark ? '1px solid #475569' : '1px solid #dee2e6',
            opacity: currentPage <= 1 ? 0.5 : 1,
          }}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className="btn btn-sm rounded-pill px-3"
            style={
              page === currentPage
                ? { backgroundColor: '#3b82f6', color: '#fff', border: 'none' }
                : {
                    backgroundColor: isDark ? '#334155' : '#f1f5f9',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    border: isDark ? '1px solid #475569' : '1px solid #dee2e6',
                  }
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-sm rounded-pill px-3"
          style={{
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: isDark ? '1px solid #475569' : '1px solid #dee2e6',
            opacity: currentPage >= totalPages ? 0.5 : 1,
          }}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
