import React, { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../hooks/useApp'
import { listNotifications, markAsRead, markAllAsRead } from '../../api/notifications'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faCheckCircle,
  faTrashAlt,
  faClock,
  faBoxOpen,
  faFlag,
  faTriangleExclamation,
  faSearch,
  faFilter,
  faCheckDouble,
  faTimes
} from "@fortawesome/free-solid-svg-icons"

const CATEGORIES = [
  { key: 'all', label: 'All', color: '#6366f1' },
  { key: 'project', label: 'Projects', color: '#4f46e5' },
  { key: 'task', label: 'Tasks', color: '#f59e0b' },
  { key: 'milestone', label: 'Milestones', color: '#10b981' },
]

const getNotifIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("project")) return { icon: faBoxOpen, color: "#4f46e5", bg: "#eef2ff" };
  if (t.includes("task")) return { icon: faBell, color: "#f59e0b", bg: "#fff7ed" };
  if (t.includes("milestone")) return { icon: faFlag, color: "#10b981", bg: "#ecfdf5" };
  return { icon: faBell, color: "#6366f1", bg: "#f5f3ff" };
};

const getCategoryKey = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("project")) return "project";
  if (t.includes("task")) return "task";
  if (t.includes("milestone")) return "milestone";
  return "all";
};

const getTimeAgo = (date) => {
  if (!date) return '';
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const formatDate = (date) => {
  if (!date) return 'Unknown date';
  return new Date(date).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDateGroup = (date) => {
  if (!date) return 'Older';
  const now = new Date();
  const notifDate = new Date(date);
  const diffDays = Math.floor((now - notifDate) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'This Week';
  return 'Older';
};

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Older'];

function Notification() {
  const { currentUser, addNotification, contentLayout, theme } = useApp()
  const isDark = theme === 'dark'
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [dismissingIds, setDismissingIds] = useState(new Set())

  const fetchNotifications = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await listNotifications(currentUser?.role)
      setNotifications(Array.isArray(data) ? data : [])
    } catch {
      setError('Failed to fetch notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchNotifications()
      const interval = setInterval(() => fetchNotifications(true), 30000)
      return () => clearInterval(interval)
    }
  }, [currentUser])

  const filtered = useMemo(() => {
    let result = notifications;
    if (activeCategory !== 'all') {
      result = result.filter(n => getCategoryKey(n.title) === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.message || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [notifications, activeCategory, searchQuery]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(n => {
      const g = getDateGroup(n.created_at);
      if (!groups[g]) groups[g] = [];
      groups[g].push(n);
    });
    return groups;
  }, [filtered]);

  const handleMarkAsRead = async (id) => {
    setDismissingIds(prev => new Set([...prev, id]))
    try {
      await markAsRead(id)
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
        setDismissingIds(prev => { const next = new Set(prev); next.delete(id); return next; })
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; })
      }, 300)
      addNotification('Notification dismissed', 'success')
    } catch {
      setDismissingIds(prev => { const next = new Set(prev); next.delete(id); return next; })
      addNotification('Failed to mark as read.', 'danger')
    }
  }

  const handleBulkMarkAsRead = async () => {
    if (selectedIds.size === 0) return;
    for (const id of selectedIds) {
      await markAsRead(id).catch(() => {});
    }
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)))
    addNotification(`${selectedIds.size} notification(s) dismissed`, 'success')
    setSelectedIds(new Set())
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) return
    try {
      await markAllAsRead()
      setNotifications([])
      setSelectedIds(new Set())
      addNotification('All notifications cleared', 'success')
    } catch {
      addNotification('Failed to clear notifications.', 'danger')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    const ids = new Set(filtered.map(n => n.id));
    setSelectedIds(ids);
  };

  const deselectAll = () => setSelectedIds(new Set());

  const categoryCounts = useMemo(() => {
    const counts = { all: notifications.length };
    CATEGORIES.slice(1).forEach(c => {
      counts[c.key] = notifications.filter(n => getCategoryKey(n.title) === c.key).length;
    });
    return counts;
  }, [notifications]);

  if (!currentUser) return null

  const colClass = contentLayout === 'compact' ? 'col-lg-10 col-xl-8 mx-auto' : 'col-12 px-4';

  return (
    <div className="py-2 px-2">
      <div className="row">
        <div className={colClass}>

          {/* Premium Enterprise Header */}
          <div className="position-relative overflow-hidden rounded-4 p-4 p-lg-5 mb-4" style={{
            background: isDark ? 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)'}`,
            borderRadius: '24px',
            boxShadow: isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(99,102,241,0.15)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            }} />
            <div className="position-absolute" style={{ right: '-10%', top: '-20%', width: '300px', height: '300px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div className="position-absolute" style={{ left: '-5%', bottom: '-30%', width: '250px', height: '250px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="row align-items-center position-relative" style={{ zIndex: 3 }}>
              <div className="col-lg-12 mb-3">
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{
                    background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
                    color: isDark ? '#cbd5e1' : '#4f46e5',
                    border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
                    Notifications
                  </span>
                  <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{
                    background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)',
                    border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'}`,
                  }}>
                    <span style={{ position: 'relative', display: 'inline-flex', height: '8px', width: '8px' }}>
                      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#10b981', animation: 'notif-pulse 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite' }}></span>
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>{notifications.length > 0 ? `${notifications.length} active` : 'All clear'}</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-xl-8">
                <h1 className="fw-extrabold mb-2" style={{ color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em', fontSize: '2.25rem' }}>
                  <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: '#6366f1' }} />
                  Notification Center
                </h1>
                <p className="fs-6 mb-0" style={{ color: isDark ? '#94a3b8' : '#475569', maxWidth: '600px', lineHeight: '1.7' }}>
                  {notifications.length > 0
                    ? `You have ${notifications.length} notification${notifications.length > 1 ? 's' : ''}`
                    : 'Stay updated with activities across the platform.'}
                </p>
              </div>
              <div className="col-lg-5 col-xl-4 mt-3 mt-lg-0">
                <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
                  {selectedIds.size > 0 && (
                    <button className="btn btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 border-0 text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }} onClick={handleBulkMarkAsRead}>
                      <FontAwesomeIcon icon={faCheckDouble} /> Dismiss ({selectedIds.size})
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button className={`btn btn-sm rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2 ${isDark ? 'btn-outline-light' : 'btn-outline-danger'}`} onClick={handleClearAll}>
                      <FontAwesomeIcon icon={faTrashAlt} /> Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
            <div className="position-relative flex-grow-1" style={{ minWidth: 200, maxWidth: 360 }}>
              <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13 }} />
              <input
                type="text"
                className={`form-control rounded-pill ps-5 border-0 shadow-sm ${isDark ? 'bg-dark text-light' : 'bg-white'}`}
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="position-absolute btn btn-link text-muted p-0" style={{ right: 12, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setSearchQuery('')}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold shadow-sm transition ${activeCategory === cat.key ? 'text-white' : `${isDark ? 'text-light bg-dark border-secondary' : 'text-secondary bg-white border'}`}`}
                    style={activeCategory === cat.key ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                    onClick={() => setActiveCategory(cat.key)}
                  >
                    {cat.label}
                    {categoryCounts[cat.key] > 0 && (
                      <span className={`badge ms-2 ${activeCategory === cat.key ? 'bg-white text-dark' : `${isDark ? 'bg-dark text-light' : 'bg-light text-secondary'}`}`}>
                        {categoryCounts[cat.key]}
                      </span>
                    )}
                  </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading && notifications.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="text-muted">Loading your notifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={`text-center py-5 rounded-4 border mt-3 ${isDark ? 'bg-dark-card border-secondary' : 'bg-body-tertiary'}`}>
              <div className="mb-4 text-primary opacity-25">
                <FontAwesomeIcon icon={searchQuery || activeCategory !== 'all' ? faSearch : faCheckCircle} size="4x" />
              </div>
              <h4 className="fw-bold">
                {searchQuery ? 'No results found' : activeCategory !== 'all' ? `No ${activeCategory} notifications` : 'All Caught Up!'}
              </h4>
              <p className="text-muted mb-3">
                {searchQuery
                  ? 'Try a different search term'
                  : activeCategory !== 'all'
                    ? `You don't have any ${activeCategory} notifications`
                    : "You don't have any new notifications at the moment."}
              </p>
              <button className="btn btn-primary rounded-pill px-4" onClick={() => fetchNotifications()}>
                <FontAwesomeIcon icon={faBell} className="me-2" />
                Check for updates
              </button>
            </div>
          ) : (
            <>
              {/* Bulk select bar */}
              <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                <div className="small text-muted d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} className="me-1" />
                  {filtered.length} notification{filtered.length > 1 ? 's' : ''}
                  {activeCategory !== 'all' && <span className="badge bg-light text-secondary ms-1">{activeCategory}</span>}
                </div>
                <div className="d-flex gap-2">
                  {selectedIds.size > 0 ? (
                    <button className="btn btn-link btn-sm text-muted p-0 text-decoration-none" onClick={deselectAll}>
                      Deselect all
                    </button>
                  ) : (
                    <button className="btn btn-link btn-sm text-muted p-0 text-decoration-none" onClick={selectAllVisible}>
                      Select all
                    </button>
                  )}
                </div>
              </div>

              {/* Grouped list */}
              {GROUP_ORDER.filter(g => grouped[g]).map(group => (
                <div key={group} className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <h6 className="text-muted fw-bold mb-0 text-uppercase small letter-spacing-1">{group}</h6>
                    <hr className="flex-grow-1 m-0" style={{ opacity: 0.15 }} />
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {grouped[group].map((notif) => {
                      const style = getNotifIcon(notif.title);
                      const isDismissing = dismissingIds.has(notif.id);
                      const isSelected = selectedIds.has(notif.id);
                      return (
                        <div
                          key={notif.id}
                          className={`card shadow-sm rounded-3 overflow-hidden transition ${isDismissing ? 'notif-dismissing' : 'notif-card'} ${isDark ? 'bg-dark-card border-secondary' : 'border-0'}`}
                          onClick={() => toggleSelect(notif.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={e => { if (e.key === 'Enter') toggleSelect(notif.id); }}
                        >
                          <div className={`card-body p-3 ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}>
                            <div className="d-flex gap-3 align-items-start">
                              <div className="form-check mb-0 mt-1 flex-shrink-0">
                                <input
                                  type="checkbox"
                                  className="form-check-input cursor-pointer"
                                  checked={isSelected}
                                  onChange={() => toggleSelect(notif.id)}
                                  onClick={e => e.stopPropagation()}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                              <div
                                className="notif-page-icon rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                                style={{ width: 44, height: 44, backgroundColor: style.bg, color: style.color, fontSize: '1rem' }}
                              >
                                <FontAwesomeIcon icon={style.icon} />
                              </div>
                              <div className="flex-grow-1 min-w-0">
                                <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                  <h6 className="fw-bold mb-0 text-truncate">{notif.title}</h6>
                                  <span className="small text-muted text-nowrap d-flex align-items-center gap-1" title={formatDate(notif.created_at)}>
                                    <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.65rem' }} />
                                    {getTimeAgo(notif.created_at)}
                                  </span>
                                </div>
                                <p className="text-secondary mb-2 small" style={{ lineHeight: 1.4 }}>{notif.message}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="small text-muted d-flex align-items-center gap-2">
                                    <span
                                      className="rounded-circle d-inline-block"
                                      style={{ width: 6, height: 6, backgroundColor: style.color }}
                                    />
                                    Sent to {notif.role || 'All Users'}
                                  </div>
                                  <button
                                    className="btn btn-sm rounded-pill fw-semibold transition"
                                    style={{
                                      backgroundColor: '#10b981',
                                      color: '#fff',
                                      padding: '0.25rem 0.9rem',
                                      fontSize: '0.75rem'
                                    }}
                                    onClick={e => { e.stopPropagation(); handleMarkAsRead(notif.id); }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'}
                                  >
                                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                    Done
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {error && (
            <div className="alert alert-danger rounded-4 mt-4 shadow-sm border-0 d-flex align-items-center gap-3">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <div className="fw-medium">{error}</div>
            </div>
          )}
          <style>{`
            @keyframes notif-pulse {
              0% { transform: scale(0.6); opacity: 1; }
              100% { transform: scale(2.8); opacity: 0; }
            }
            .notif-card { transition: all 0.2s ease; }
            .notif-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
            .notif-dismissing { opacity: 0; transform: translateX(30px); transition: all 0.3s ease; }
            ${isDark ? `
              .notif-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important; }
              .form-check-input { background-color: #334155; border-color: #475569; }
              hr { border-color: #334155 !important; }
            ` : ''}
          `}</style>
        </div>
      </div>
    </div>
  )
}

export default Notification
