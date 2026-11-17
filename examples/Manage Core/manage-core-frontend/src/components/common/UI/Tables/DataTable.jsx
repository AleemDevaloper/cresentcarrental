import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import PaginationBar from './PaginationBar';

const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyMessage = 'No data found.',
  emptyIcon,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  paginationVariant = 'full',
  hover = true,
  isDark = false,
  className = '',
  rowKey = 'id',
  onRowClick,
}) => {
  const getSortIcon = (column) => {
    if (sortBy !== column) return faSort;
    return sortOrder === 'asc' ? faSortUp : faSortDown;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="small text-muted mt-2">Loading data...</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-5 text-muted">
        {emptyIcon && <FontAwesomeIcon icon={emptyIcon} className="fs-2 mb-3 opacity-30" />}
        <p className="small mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive" style={{ borderRadius: '12px' }}>
        <table className={`table align-middle mb-0 ${hover ? 'table-hover' : ''}`} style={{ color: isDark ? '#f1f5f9' : undefined }}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 border-0 x-small fw-bold text-uppercase"
                  style={{
                    color: isDark ? '#94a3b8' : '#64748b',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && (
                    <FontAwesomeIcon
                      icon={getSortIcon(col.key)}
                      className="ms-1 x-small"
                      style={{ opacity: sortBy === col.key ? 1 : 0.3 }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={row[rowKey] || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  backgroundColor: isDark ? undefined : undefined,
                }}
                className={isDark ? 'border-light' : ''}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3"
                    style={{ color: isDark ? '#e2e8f0' : undefined }}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : row[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentPage && totalPages && onPageChange && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          perPage={perPage}
          onPerPageChange={onPerPageChange}
          variant={paginationVariant}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default DataTable;
