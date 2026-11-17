import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFileExport, faRefresh, faChevronLeft, faChevronRight, faEdit, faTrash, faEye, faCopy, faArchive, faLock, faUnlock, faPlus, faInfoCircle, faSpinner, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { erpStyles, erpColors } from './ErpTheme';

const ErpDataTable = ({
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'No records found.',
  emptyIcon = null,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchTerm = '',
  onSearchChange = null,
  filters = null,
  exportButtons = null,
  extraActions = null,
  currentPage = 1,
  totalPages = 1,
  entriesPerPage = 10,
  totalEntries = 0,
  onPageChange = null,
  onEntriesPerPageChange = null,
  onRowClick = null,
  isDark = false,
  title = '',
  titleIcon = null,
  accentColor = '#6366f1',
  renderRow = null,
}) => {
  const s = erpStyles(isDark);
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const statusStyle = (status) => {
    const map = {
      Active: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Inactive: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Open: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Closed: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Completed: { bg: isDark ? '#064e3b' : '#dcfce7', color: isDark ? '#4ade80' : '#16a34a' },
      Failed: { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
      Processing: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      Draft: { bg: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' },
      Pending: { bg: isDark ? '#1e293b' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706' },
      'Credit Hold': { bg: isDark ? '#7f1d1d' : '#fee2e2', color: isDark ? '#f87171' : '#dc2626' },
    };
    const m = map[status] || { bg: isDark ? '#1e293b' : '#f1f5f9', color: mutedColor };
    return { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em', background: m.bg, color: m.color };
  };

  const actionBtn = (color, hoverColor, icon, onClick, title) => (
    <button
      key={title}
      className="btn btn-sm border-0"
      style={{ borderRadius: '8px', color: mutedColor, transition: 'all 0.2s', background: 'transparent', padding: '4px 8px' }}
      onClick={onClick}
      title={title}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.color = color; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );

  if (loading) {
    return (
      <div className="glass-card" style={{ borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
        <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: erpColors.primary }} />
        <p className="mt-2" style={{ color: mutedColor, fontSize: '0.85rem' }}>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-0" role="alert" style={{ borderRadius: '12px', fontSize: '0.85rem' }}>
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />{error}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
      {(title || searchable || filters || exportButtons || extraActions) && (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="d-flex align-items-center gap-3">
            {title && (
              <div className="section-header mb-0">
                <div className="accent-bar" style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}dd)` }} />
                <h6 style={{ color: textColor, margin: 0 }}>
                  {titleIcon && <FontAwesomeIcon icon={titleIcon} className="me-2" style={{ color: accentColor }} />}
                  {title}
                </h6>
              </div>
            )}
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {searchable && (
              <div className="input-group input-group-sm" style={{ width: '220px' }}>
                <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: borderColor, color: mutedColor }}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            )}
            {filters}
            {exportButtons}
            {extraActions}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-5" style={{ color: mutedColor }}>
          {emptyIcon && <FontAwesomeIcon icon={emptyIcon} style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '0.5rem' }} />}
          <p className="mb-0" style={{ fontSize: '0.85rem' }}>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="premium-table-wrapper">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key} className={col.className || ''} style={{ ...s.th, ...(col.width ? { width: col.width } : {}), ...(col.align ? { textAlign: col.align } : {}) }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renderRow ? (
                    data.map((row, i) => renderRow(row, i, { isDark, textColor, mutedColor, borderColor, statusStyle, actionBtn }))
                  ) : (
                    data.map((row, i) => (
                      <tr key={row.id || i} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                        {columns.map((col) => {
                          if (col.render) return <td key={col.key} style={{ ...(col.align ? { textAlign: col.align } : {}) }}>{col.render(row[col.key], row, i)}</td>;
                          if (col.key === 'status' || col.key === 'Status') {
                            return (
                              <td key={col.key}>
                                <span style={statusStyle(row[col.key])}>
                                  <span className="badge-dot" style={{ background: statusStyle(row[col.key]).color }} />
                                  {row[col.key]}
                                </span>
                              </td>
                            );
                          }
                          return (
                            <td key={col.key} style={{
                              fontWeight: col.bold ? 600 : 400,
                              color: col.key === 'code' || col.key === 'Code' ? '#6366f1' : textColor,
                              ...(col.align ? { textAlign: col.align } : {}),
                            }}>
                              {row[col.key] ?? '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 flex-wrap gap-2" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="d-flex align-items-center gap-2">
              <span className="small" style={{ color: mutedColor }}>Show</span>
              <select
                className="form-select form-select-sm"
                style={{ width: '80px' }}
                value={entriesPerPage}
                onChange={(e) => onEntriesPerPageChange?.(parseInt(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              <span className="small" style={{ color: mutedColor }}>entries</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="small" style={{ color: mutedColor }}>
                Showing {totalEntries === 0 ? 0 : Math.min((currentPage - 1) * entriesPerPage + 1, totalEntries)} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} results
              </span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn btn-sm border-0"
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(1)}
                style={{ borderRadius: '8px', color: mutedColor, opacity: currentPage <= 1 ? 0.4 : 1 }}
                title="First page"
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} />
              </button>
              <button
                className="btn btn-sm border-0"
                disabled={currentPage <= 1}
                onClick={() => onPageChange?.(currentPage - 1)}
                style={{ borderRadius: '8px', color: mutedColor, opacity: currentPage <= 1 ? 0.4 : 1 }}
                title="Previous page"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <span className="px-2 small" style={{ color: textColor }}>
                Page <strong>{currentPage}</strong> of <strong>{Math.max(totalPages, 1)}</strong>
              </span>
              <button
                className="btn btn-sm border-0"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange?.(currentPage + 1)}
                style={{ borderRadius: '8px', color: mutedColor, opacity: currentPage >= totalPages ? 0.4 : 1 }}
                title="Next page"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              <button
                className="btn btn-sm border-0"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange?.(totalPages)}
                style={{ borderRadius: '8px', color: mutedColor, opacity: currentPage >= totalPages ? 0.4 : 1 }}
                title="Last page"
              >
                <FontAwesomeIcon icon={faAngleDoubleRight} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ErpDataTable;
