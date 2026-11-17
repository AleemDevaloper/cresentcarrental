import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listAuditLogs } from '../../../api/dms';
import { StatCard, HeaderCard } from '../../../components/common/UI/Cards';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faFilter,
  faFileExport,
  faEye,
  faEdit,
  faDownload,
  faShare,
  faCheck,
  faTimes,
  faTrash,
  faPen,
  faUser,
  faFile,
  faFolder,
  faLaptop,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";

const ACTION_ICONS = {
  viewed: faEye,
  edited: faEdit,
  downloaded: faDownload,
  shared: faShare,
  approved: faCheck,
  rejected: faTimes,
  deleted: faTrash,
  signed: faPen,
};

const ACTION_COLORS = {
  viewed: '#0ea5e9',
  edited: '#f59e0b',
  downloaded: '#8b5cf6',
  shared: '#10b981',
  approved: '#10b981',
  rejected: '#ef4444',
  deleted: '#ef4444',
  signed: '#6366f1',
};

const DmsAuditLogs = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchLogs(true);
  }, []);

  const fetchLogs = async (reset = false) => {
    if (reset) { setLoading(true); setPage(1); }
    try {
      const params = {
        page: reset ? 1 : page,
        limit: 20,
        action: actionFilter || undefined,
        user: userSearch || undefined,
        document: docSearch || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };
      const data = await listAuditLogs(params);
      const items = Array.isArray(data) ? data : data?.data || [];
      if (reset) {
        setLogs(items);
      } else {
        setLogs(prev => [...prev, ...items]);
      }
      setHasMore(items.length === 20);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
      addNotification('Failed to load audit logs.', 'danger');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilter = () => {
    fetchLogs(true);
  };

  const loadMore = () => {
    setLoadingMore(true);
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchLogs();
  }, [page]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const summaryCards = [
    { title: 'Total Events (Today)', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: faHistory, color: '#8b5cf6' },
    { title: 'Views', value: logs.filter(l => l.action === 'viewed').length, icon: faEye, color: '#0ea5e9' },
    { title: 'Downloads', value: logs.filter(l => l.action === 'downloaded').length, icon: faDownload, color: '#10b981' },
    { title: 'Deletions', value: logs.filter(l => l.action === 'deleted').length, icon: faTrash, color: '#ef4444' },
  ];

  const filteredLogs = logs.filter(l => {
    if (searchQuery && !l.document_name?.toLowerCase().includes(searchQuery.toLowerCase()) && !l.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container-fluid py-4 fade-in">
      <HeaderCard
        title="Document Audit Trail"
        description="Complete audit log of all document activities across the system."
        icon={faHistory}
        isDark={isDark}
      >
        <div className="d-flex justify-content-end mt-3 mt-md-0">
          <button className="btn btn-white rounded-pill px-5 py-3 fw-bold shadow-lg transition hover-lift">
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export CSV
          </button>
        </div>
      </HeaderCard>

      <div className="row g-4 mb-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <StatCard label={card.title} value={card.value} icon={card.icon} color={card.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-xl-2 col-md-4">
              <label className="x-small fw-bold text-uppercase text-muted mb-1">Action</label>
              <select className="form-select border shadow-none rounded-pill bg-light small" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="">All Actions</option>
                {Object.keys(ACTION_ICONS).map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-xl-2 col-md-4">
              <label className="x-small fw-bold text-uppercase text-muted mb-1">User</label>
              <div className="position-relative">
                <FontAwesomeIcon icon={faUser} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem' }} />
                <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light small" placeholder="Search user..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-xl-2 col-md-4">
              <label className="x-small fw-bold text-uppercase text-muted mb-1">Document</label>
              <div className="position-relative">
                <FontAwesomeIcon icon={faFile} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem' }} />
                <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light small" placeholder="Search document..." value={docSearch} onChange={(e) => setDocSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-xl-2 col-md-4">
              <label className="x-small fw-bold text-uppercase text-muted mb-1">From</label>
              <input type="date" className="form-control border shadow-none rounded-pill bg-light small" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="col-xl-2 col-md-4">
              <label className="x-small fw-bold text-uppercase text-muted mb-1">To</label>
              <input type="date" className="form-control border shadow-none rounded-pill bg-light small" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="col-xl-2 col-md-4">
              <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold w-100 shadow-sm" onClick={handleFilter}>
                <FontAwesomeIcon icon={faFilter} className="me-2" />Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faHistory} className="fs-2 mb-3 opacity-30" />
              <p className="small mb-0">No audit logs found for the selected filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 py-3 border-0 x-small fw-bold text-uppercase text-muted">Timestamp</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">User</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Action</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Document</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Folder</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">IP Address</th>
                    <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Device</th>
                    <th className="px-4 py-3 border-0 text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, idx) => {
                    const actionIcon = ACTION_ICONS[log.action] || faHistory;
                    const actionColor = ACTION_COLORS[log.action] || '#64748b';
                    return (
                      <React.Fragment key={log.id || idx}>
                        <tr className="transition cursor-pointer" onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}>
                          <td className="px-4 py-3">
                            <div className="small fw-medium" title={new Date(log.timestamp).toLocaleString()}>{formatTime(log.timestamp)}</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.6rem' }}>
                                {log.user?.name?.[0] || 'U'}
                              </div>
                              <span className="small fw-medium">{log.user?.name || 'System'}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: `${actionColor}15`, color: actionColor, fontSize: '0.6rem' }}>
                              <FontAwesomeIcon icon={actionIcon} className="me-1" />{log.action}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faFile} className="text-muted x-small" />
                              <span className="small text-truncate" style={{ maxWidth: '180px' }}>{log.document_name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td><span className="small text-muted">{log.folder || '—'}</span></td>
                          <td><span className="x-small text-muted font-monospace">{log.ip_address || '—'}</span></td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <FontAwesomeIcon icon={faLaptop} className="text-muted x-small" />
                              <span className="x-small text-muted">{log.device || '—'}</span>
                            </div>
                          </td>
                          <td className="px-4 text-end">
                            <FontAwesomeIcon icon={expandedRow === idx ? faChevronUp : faChevronDown} className="text-muted x-small" />
                          </td>
                        </tr>
                        {expandedRow === idx && (
                          <tr>
                            <td colSpan="8" className="px-4 py-3 bg-light border-top">
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <span className="x-small fw-bold text-uppercase text-muted d-block mb-1">User Agent</span>
                                  <span className="small">{log.user_agent || 'N/A'}</span>
                                </div>
                                <div className="col-md-3">
                                  <span className="x-small fw-bold text-uppercase text-muted d-block mb-1">Location</span>
                                  <span className="small">{log.location || 'N/A'}</span>
                                </div>
                                <div className="col-md-3">
                                  <span className="x-small fw-bold text-uppercase text-muted d-block mb-1">Exact Time</span>
                                  <span className="small">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</span>
                                </div>
                                {log.details && (
                                  <div className="col-12">
                                    <span className="x-small fw-bold text-uppercase text-muted d-block mb-1">Full Details</span>
                                    <pre className="small mb-0 bg-white p-3 rounded-3 border" style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.7rem' }}>{JSON.stringify(log.details, null, 2)}</pre>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {hasMore && !loading && (
            <div className="text-center py-4">
              <button className="btn btn-light rounded-pill px-5 py-2 fw-bold shadow-sm" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? <><span className="spinner-border spinner-border-sm me-2" />Loading...</> : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        .btn-white { background: white; border: none; }
        .cursor-pointer { cursor: pointer; }
        .font-monospace { font-family: 'Courier New', monospace; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        ${isDark ? `
          .card, .bg-white { background-color: #1e293b !important; border-color: #334155 !important; }
          .bg-light { background-color: #1e293b !important; }
          .border-light { border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .text-dark { color: #f1f5f9 !important; }
          .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .form-control, .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .table { color: #f1f5f9 !important; }
          .table-hover tbody tr:hover { background-color: rgba(99,102,241,0.08) !important; }
          pre { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155 !important; }
          .btn-white { background-color: #334155 !important; color: #f1f5f9 !important; }
        ` : ''}
      `}</style>
    </div>
  );
};

export default DmsAuditLogs;
