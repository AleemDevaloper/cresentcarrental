import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSliders,
  faSync,
  faCheckDouble,
  faSearch,
  faFilter,
  faEnvelope,
  faPaperclip,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUser,
  faTrash,
  faArchive,
  faArrowLeft,
  faCog,
  faSave,
  faUndo,
  faExclamationTriangle,
  faCheck,
  faBan,
  faVolumeUp,
  faNetworkWired,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { EnableDisableButton } from '../../../../components/common';
import { useApp } from '../../../../hooks/useApp';
import { listNotifications, markAsRead, markAllAsRead } from '../../../../api/notifications';

const initialPreferences = {
  inApp: true,
  email: true,
  sms: false,
  push: true,
  browser: true,
  sound: true,
  popup: true,
  hrEvents: ['Attendance Corrections', 'Leave Requests', 'Leave Approval', 'Holiday Announcement'],
  payrollEvents: ['Salary Generated', 'Payroll Approved', 'Payslip Available'],
  systemEvents: ['Login Alerts', 'Role Updated', 'Server Alerts'],
  quietHours: false,
  quietStart: '22:00',
  quietEnd: '08:00',
  timezone: 'GMT+5',
  senderName: 'ManageCore HR',
  senderEmail: 'hr@managecore.com'
};

const HrmsNotificationInbox = () => {
  const { currentUser, addNotification } = useApp();
  const [currentView, setCurrentView] = useState('inbox');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(false);

  // Settings preferences (still client-only - no backend endpoint exposed)
  const [preferences, setPreferences] = useState(() => initialPreferences);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Selected details note
  const [selectedNotifId, setSelectedNotifId] = useState(null);
  const selectedNotif = useMemo(() => {
    return notifications.find(n => n.id === selectedNotifId) || null;
  }, [notifications, selectedNotifId]);

  // Filter toolbar inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  
  // Active sub-tab folder (horizontal list tabs)
  const [activeTabCategory, setActiveTabCategory] = useState('All');
  
  // Folder tree sidebar
  const [activeFolder, setActiveFolder] = useState('Inbox');

  // Form states inside Notification Settings view
  const [notifInApp, setNotifInApp] = useState(preferences.inApp);
  const [notifEmail, setNotifEmail] = useState(preferences.email);
  const [notifSms, setNotifSms] = useState(preferences.sms);
  const [notifPush, setNotifPush] = useState(preferences.push);
  const [notifBrowser, setNotifBrowser] = useState(preferences.browser);
  const [notifSound, setNotifSound] = useState(preferences.sound);
  const [notifPopup, setNotifPopup] = useState(preferences.popup);
  const [notifQuietHours, setNotifQuietHours] = useState(preferences.quietHours);
  const [notifQuietStart, setNotifQuietStart] = useState(preferences.quietStart);
  const [notifQuietEnd, setNotifQuietEnd] = useState(preferences.quietEnd);

  const mapNotification = (raw) => {
    if (!raw) return null;
    const id = raw.id;
    const createdAt = raw.created_at ? new Date(raw.created_at) : new Date();
    const date = createdAt.toISOString().split('T')[0];
    const time = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const role = raw.role || '';
    const lowerTitle = (raw.title || '').toLowerCase();
    let category = 'System';
    if (lowerTitle.includes('leave')) category = 'Leave';
    else if (lowerTitle.includes('attendance')) category = 'Attendance';
    else if (lowerTitle.includes('payroll') || lowerTitle.includes('salary')) category = 'Payroll';
    else if (lowerTitle.includes('employee') || lowerTitle.includes('hr') || lowerTitle.includes('profile')) category = 'HR';
    return {
      id,
      title: raw.title || 'Notification',
      desc: raw.message || '',
      detail: raw.message || '',
      category,
      priority: 'Medium',
      sender: role || 'System',
      dept: role || 'System',
      date,
      time,
      read: !!raw.is_read,
      pinned: false,
      hasAttachment: false,
      approvalType: 'none',
      archived: false,
      deleted: false,
      _raw: raw
    };
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const role = currentUser?.role;
      const data = await listNotifications(role);
      const list = Array.isArray(data) ? data : (data?.data || []);
      const mapped = list.map(mapNotification).filter(Boolean);
      setNotifications(mapped);
      if (mapped.length > 0 && !selectedNotifId) {
        setSelectedNotifId(mapped[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
      addNotification('Failed to load notifications', 'danger');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.role]);

  // Search filter implementation
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFolder === 'Unread' && n.read) return false;
      if (activeFolder === 'Archived' && !n.archived) return false;
      if (activeFolder === 'Deleted' && !n.deleted) return false;
      
      if (activeFolder !== 'Deleted' && activeFolder !== 'Archived') {
        if (n.deleted || n.archived) return false;
      }

      if (activeTabCategory !== 'All' && n.category !== activeTabCategory) return false;

      const categoryMatch = filterCategory === 'All' ? true : n.category === filterCategory;
      const priorityMatch = filterPriority === 'All' ? true : n.priority === filterPriority;
      
      const queryMatch = searchQuery ? (
        (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.sender || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) : true;

      return categoryMatch && priorityMatch && queryMatch;
    });
  }, [notifications, searchQuery, filterCategory, filterPriority, activeTabCategory, activeFolder]);

  // Action: Mark all read
  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true, _raw: { ...n._raw, is_read: true } })));
      addToast('All notifications marked as read.');
    } catch (err) {
      addNotification(err.message || 'Failed to mark all as read', 'danger');
    } finally {
      setMarking(false);
    }
  };

  // Action: Mark single read/unread (toggle - backend only supports marking read, not unmarking)
  const handleToggleReadStatus = async (notifId, e) => {
    e.stopPropagation();
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;
    if (notif.read) {
      // Allow local toggle to unread (backend has no unmark endpoint, so this is local-only)
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: false, _raw: { ...n._raw, is_read: false } } : n));
      return;
    }
    try {
      await markAsRead(notifId);
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true, _raw: { ...n._raw, is_read: true } } : n));
    } catch (err) {
      addNotification(err.message || 'Failed to mark as read', 'danger');
    }
  };

  const handleSelectNotif = async (notifId) => {
    setSelectedNotifId(notifId);
    const notif = notifications.find(n => n.id === notifId);
    if (notif && !notif.read) {
      try {
        await markAsRead(notifId);
        setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true, _raw: { ...n._raw, is_read: true } } : n));
      } catch (err) {
        addNotification(err.message || 'Failed to mark as read', 'danger');
      }
    }
  };

  // Action: Archive single (local-only - no backend endpoint)
  const handleArchiveNotif = (notifId, e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, archived: true } : n));
    addToast('Notification archived.');
  };

  // Action: Delete single (local-only - no backend endpoint)
  const handleDeleteNotif = (notifId, e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, deleted: true } : n));
    addToast('Notification moved to trash.', 'danger');
  };

  // Save Settings Preferences
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updatedPref = {
      ...preferences,
      inApp: notifInApp,
      email: notifEmail,
      sms: notifSms,
      push: notifPush,
      browser: notifBrowser,
      sound: notifSound,
      popup: notifPopup,
      quietHours: notifQuietHours,
      quietStart: notifQuietStart,
      quietEnd: notifQuietEnd
    };
    setPreferences(updatedPref);
    addToast('Notification settings saved successfully.');
    setTimeout(() => {
      setCurrentView('inbox');
    }, 1500);
  };

  const today = new Date().toISOString().split('T')[0];
  const unreadCount = notifications.filter(n => !n.read && !n.deleted).length;
  const todayCount = notifications.filter(n => n.date === today && !n.deleted).length;
  const criticalCount = notifications.filter(n => n.priority === 'Critical' && !n.deleted).length;

  return (
    <div className="container-fluid px-0">
      
      {/* Toast popup */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast show align-items-center text-white border-0 mb-2 ${t.type === 'danger' ? 'bg-danger' : 'bg-success'}`} role="alert">
            <div className="d-flex">
              <div className="toast-body small fw-medium">{t.msg}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToasts(toasts.filter(x => x.id !== t.id))} />
            </div>
          </div>
        ))}
      </div>

      {/* breadcrumb header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0" style={{ fontSize: '12px' }}>
            <li className="breadcrumb-item text-muted">Workspace</li>
            <li className="breadcrumb-item text-primary active" aria-current="page">HRMS</li>
          </ol>
        </nav>
        {currentView === 'settings' && (
          <button 
            className="btn btn-sm btn-white border rounded-3 text-dark px-3" 
            onClick={() => setCurrentView('inbox')}
          >
            Back to Notification Inbox
          </button>
        )}
      </div>

      {/* VIEW A: MAIN NOTIFICATION INBOX PANEL */}
      {currentView === 'inbox' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Notification Inbox</h4>
              <p className="text-muted small mb-0">Centralized inbox for system alerts, approvals, announcements, reminders and real-time enterprise notifications.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-white border rounded-3 text-dark px-3" onClick={handleMarkAllRead} disabled={marking}>
                <FontAwesomeIcon icon={faCheckDouble} className="me-1.5" /> {marking ? 'Marking...' : 'Mark All Read'}
              </button>
              <button className="btn btn-sm btn-white border rounded-3 text-dark px-3" onClick={() => setCurrentView('settings')}>
                <FontAwesomeIcon icon={faCog} className="me-1.5" /> Notification Settings
              </button>
              <button className="btn btn-sm btn-white border rounded-3 text-dark" onClick={fetchNotifications} disabled={loading} title="Refresh">
                <FontAwesomeIcon icon={faSync} className={loading ? 'fa-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="p-4 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-4" style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}>
            <div>
              <span className="badge bg-light text-primary fw-bold text-uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Enterprise Communication Center</span>
              <h4 className="fw-black mb-1">Notification Inbox</h4>
              <p className="mb-0 text-white-50 small">View all HR, Payroll, Attendance, Leave, Finance and System notifications from one centralized inbox.</p>
            </div>

            <div className="d-flex gap-3">
              <div className="bg-white bg-opacity-10 p-2.5 rounded-3 text-center" style={{ minWidth: '90px' }}>
                <span className="x-small text-white-50 d-block" style={{ fontSize: '10px' }}>Unread</span>
                <strong className="fs-5">{unreadCount}</strong>
              </div>
              <div className="bg-white bg-opacity-10 p-2.5 rounded-3 text-center" style={{ minWidth: '90px' }}>
                <span className="x-small text-white-50 d-block" style={{ fontSize: '10px' }}>Total Today</span>
                <strong className="fs-5">{todayCount}</strong>
              </div>
              <div className="bg-white bg-opacity-10 p-2.5 rounded-3 text-center" style={{ minWidth: '90px' }}>
                <span className="x-small text-white-50 d-block" style={{ fontSize: '10px' }}>Critical</span>
                <strong className="fs-5 text-warning">{criticalCount}</strong>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger rounded-3 small mb-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </div>
          )}

          {/* Filter Toolbar */}
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="small fw-bold text-muted mb-1.5">Search Notifications</label>
                <div className="position-relative">
                  <span className="position-absolute text-muted" style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }}>
                    <FontAwesomeIcon icon={faSearch} size="xs" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control form-control-sm border ps-4.5 rounded-pill shadow-sm"
                    placeholder="Search by keywords..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-lg-3 col-md-3">
                <label className="small fw-bold text-muted mb-1.5">Category</label>
                <select className="form-select form-select-sm border-light shadow-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Leave">Leave Requests</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Payroll">Payroll</option>
                  <option value="HR">HR Events</option>
                  <option value="System">System Alerts</option>
                </select>
              </div>

              <div className="col-lg-3 col-md-3">
                <label className="small fw-bold text-muted mb-1.5">Priority</label>
                <select className="form-select form-select-sm border-light shadow-sm" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                  <option value="All">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="col-lg-2 col-md-6 d-flex gap-2">
                <button className="btn btn-sm btn-primary w-100 rounded-pill shadow-sm" onClick={fetchNotifications} disabled={loading}>
                  <FontAwesomeIcon icon={faFilter} className="me-1" /> Apply
                </button>
                <button className="btn btn-sm btn-light border w-100 rounded-pill text-dark" onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('All');
                  setFilterPriority('All');
                }}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Category Tabs */}
          <div className="d-flex gap-1.5 overflow-x-auto pb-3 mb-4 border-bottom flex-nowrap scrollbar-none">
            {['All', 'Unread', 'Approvals', 'Attendance', 'Leave', 'Payroll', 'HR', 'System'].map(cat => (
              <button 
                key={cat}
                className={`btn btn-xs rounded-pill px-3 py-1 text-nowrap ${
                  (cat === 'Unread' && activeFolder === 'Unread') || (activeTabCategory === cat && activeFolder !== 'Unread')
                    ? 'btn-primary shadow-sm' 
                    : 'btn-light border text-dark'
                }`}
                onClick={() => {
                  if (cat === 'Unread') {
                    setActiveFolder('Unread');
                    setActiveTabCategory('All');
                  } else {
                    setActiveFolder('Inbox');
                    setActiveTabCategory(cat);
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="row g-4 mb-4">
            
            <div className="col-lg-5 col-md-6">
              <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden p-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                
                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                  {['Inbox', 'Starred', 'Archived', 'Deleted'].map(fld => (
                    <button 
                      key={fld} 
                      className={`btn btn-link btn-xs text-decoration-none px-1.5 ${activeFolder === fld ? 'text-primary fw-bold' : 'text-muted'}`}
                      onClick={() => { setActiveFolder(fld); setActiveTabCategory('All'); }}
                    >
                      {fld}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <FontAwesomeIcon icon={faBell} size="2x" className="opacity-25 mb-2" />
                      <p className="small mb-0">No notifications found.</p>
                      <span className="x-small text-muted" style={{ fontSize: '11px' }}>You're all caught up.</span>
                    </div>
                  ) : (
                    filteredNotifications.map(notif => (
                      <div 
                        key={notif.id}
                        className={`card p-3 rounded-4 cursor-pointer hover-lift transition-all position-relative ${
                          selectedNotifId === notif.id ? 'border-primary bg-primary bg-opacity-5' : 'border-light'
                        } ${!notif.read ? 'border-start border-4 border-start-primary' : 'bg-light bg-opacity-30'}`}
                        onClick={() => handleSelectNotif(notif.id)}
                      >
                        <div className="d-flex align-items-start gap-3">
                          <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 34, height: 34, flexShrink: 0 }}>
                            <FontAwesomeIcon icon={faEnvelope} />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center justify-content-between gap-1 mb-1">
                              <span className="small text-muted font-monospace">{notif.time}</span>
                              <span className={`badge ${
                                notif.priority === 'Critical' ? 'bg-danger text-white' : notif.priority === 'High' ? 'bg-warning text-dark' : 'bg-light text-dark'
                              }`} style={{ fontSize: '9px' }}>{notif.priority}</span>
                            </div>
                            <h6 className={`mb-1 small text-truncate text-dark ${!notif.read ? 'fw-bold' : ''}`}>{notif.title}</h6>
                            <p className="text-muted x-small text-truncate mb-0" style={{ fontSize: '11px' }}>{notif.desc}</p>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2.5 mt-2 border-top pt-1.5 opacity-60 hover-opacity-100">
                          <span className="x-small text-muted me-auto" style={{ fontSize: '9px' }}>From: {notif.sender}</span>
                          <button className="btn btn-link btn-xs p-0 text-muted" onClick={(e) => handleToggleReadStatus(notif.id, e)} title={notif.read ? "Mark Unread" : "Mark Read"}>
                            <FontAwesomeIcon icon={faCheck} className={notif.read ? 'text-success' : ''} />
                          </button>
                          <button className="btn btn-link btn-xs p-0 text-muted hover-text-primary" onClick={(e) => handleArchiveNotif(notif.id, e)} title="Archive"><FontAwesomeIcon icon={faArchive} /></button>
                          <button className="btn btn-link btn-xs p-0 text-danger" onClick={(e) => handleDeleteNotif(notif.id, e)} title="Trash"><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-7 col-md-6">
              {selectedNotif ? (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 space-y-4">
                  <div className="d-flex justify-content-between align-items-start border-bottom pb-3 flex-wrap gap-2">
                    <div>
                      <span className="badge bg-primary bg-opacity-10 text-primary mb-1">{selectedNotif.category}</span>
                      <h5 className="fw-bold mb-1 text-dark">{selectedNotif.title}</h5>
                      <span className="x-small text-muted" style={{ fontSize: '11px' }}>Logged on {selectedNotif.date} at {selectedNotif.time}</span>
                    </div>
                    <span className={`badge ${
                      selectedNotif.priority === 'Critical' ? 'bg-danger text-white' : selectedNotif.priority === 'High' ? 'bg-warning text-dark' : 'bg-light text-dark'
                    } rounded-pill px-3 py-1`}>{selectedNotif.priority} Priority</span>
                  </div>

                  <div>
                    <h6 className="fw-bold text-dark mb-2">Details & Description</h6>
                    <p className="small text-dark-emphasis" style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                      {selectedNotif.detail || selectedNotif.desc}
                    </p>
                  </div>

                  <div className="p-3 bg-light rounded-4 row g-2 border">
                    <div className="col-sm-6 small"><span className="text-muted d-block">Sender</span><strong className="text-dark">{selectedNotif.sender}</strong></div>
                    <div className="col-sm-6 small"><span className="text-muted d-block">Department</span><strong className="text-dark">{selectedNotif.dept}</strong></div>
                  </div>

                  <div>
                    <h6 className="fw-bold text-dark mb-2">Activity Timeline Comments</h6>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded bg-light border small text-dark-emphasis">
                        <div className="fw-bold mb-0.5" style={{ fontSize: '11px' }}>System Audit Logs:</div>
                        <span className="x-small">Notification received from backend HRMS notification service.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-5 text-center text-muted">
                  <FontAwesomeIcon icon={faEnvelope} size="3x" className="opacity-20 mb-3" />
                  <p>Select a notification from the inbox to view details.</p>
                </div>
              )}
            </div>

          </div>
        </>
      )}

      {/* VIEW B: NOTIFICATION SETTINGS MODULE */}
      {currentView === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-4">
          
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1 text-dark">Notification Settings</h4>
              <p className="text-muted small mb-0">Configure company-wide notification preferences for employees, managers, HR, payroll and administrators.</p>
            </div>
            <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm">
              <FontAwesomeIcon icon={faSave} className="me-1.5" /> Save Preferences
            </button>
          </div>

          <div className="row g-4 mb-4">
            
            <div className="col-lg-8 space-y-4">
              
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-3">
                <h6 className="fw-bold text-dark border-bottom pb-2">General Delivery Channels</h6>
                <div className="row g-3">
                  {[
                    { label: 'Enable In-App Notifications', state: notifInApp, setter: setNotifInApp },
                    { label: 'Enable Email Notifications', state: notifEmail, setter: setNotifEmail },
                    { label: 'Enable SMS Notifications', state: notifSms, setter: setNotifSms },
                    { label: 'Enable Push Notifications', state: notifPush, setter: setNotifPush },
                    { label: 'Enable Browser Notifications', state: notifBrowser, setter: setNotifBrowser },
                    { label: 'Play Notification Sound', state: notifSound, setter: setNotifSound },
                    { label: 'Desktop Popup Alerts', state: notifPopup, setter: setNotifPopup },
                  ].map((toggle, idx) => (
                    <div key={idx} className="col-md-6 d-flex justify-content-between align-items-center py-1">
                      <span className="small text-dark-emphasis">{toggle.label}</span>
                      <EnableDisableButton
                        checked={toggle.state}
                        onClick={() => toggle.setter(!toggle.state)}
                        label={toggle.label}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-3">
                <h6 className="fw-bold text-dark border-bottom pb-2">Quiet Hours / Delivery Silence</h6>
                <div className="row g-3">
                  <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="small fw-bold text-dark-emphasis d-block">Enable Quiet Hours</span>
                      <span className="x-small text-muted" style={{ fontSize: '11px' }}>Mute all non-critical notifications during configured intervals.</span>
                    </div>
                    <EnableDisableButton
                      checked={notifQuietHours}
                      onClick={() => setNotifQuietHours(!notifQuietHours)}
                      label="Enable Quiet Hours"
                      size="small"
                    />
                  </div>

                  {notifQuietHours && (
                    <>
                      <div className="col-md-4">
                        <label className="small text-muted mb-1">Start Time</label>
                        <input type="time" className="form-control form-control-sm" value={notifQuietStart} onChange={e => setNotifQuietStart(e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label className="small text-muted mb-1">End Time</label>
                        <input type="time" className="form-control form-control-sm" value={notifQuietEnd} onChange={e => setNotifQuietEnd(e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label className="small text-muted mb-1">Timezone</label>
                        <select className="form-select form-select-sm">
                          <option value="GMT+5">GMT+5 (Karachi)</option>
                          <option value="GMT+0">GMT+0 (London)</option>
                          <option value="GMT-5">GMT-5 (New York)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-3">
                <h6 className="fw-bold text-dark border-bottom pb-2">Email Sender Credentials</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Sender Name</label>
                    <input type="text" className="form-control form-control-sm" value={preferences.senderName} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Sender Email</label>
                    <input type="email" className="form-control form-control-sm" value={preferences.senderEmail} readOnly />
                  </div>
                </div>
              </div>

            </div>

            <div className="col-lg-4 space-y-4">
              
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-3">
                <h6 className="fw-bold text-dark">Settings Summary</h6>
                <div className="p-3 bg-light rounded-4 space-y-2.5">
                  <div className="d-flex justify-content-between small"><span className="text-muted font-bold">Enabled Channels</span><span className="text-success fw-bold">{[notifInApp, notifEmail, notifPush, notifBrowser].filter(Boolean).length} Channels</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">SMS Delivery</span><span className={`fw-bold ${notifSms ? 'text-success' : 'text-danger'}`}>{notifSms ? 'Enabled' : 'Disabled'}</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Quiet Hours</span><span className="text-dark font-monospace">{notifQuietHours ? 'ON' : 'OFF'}</span></div>
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white space-y-3">
                <h6 className="fw-bold text-dark">Delivery System Health</h6>
                <div className="space-y-2">
                  {[
                    { service: 'Email Delivery (SMTP)', status: 'Online', color: 'success' },
                    { service: 'SMS Gateway', status: 'Connected', color: 'success' },
                    { service: 'Firebase Push API', status: 'Connected', color: 'success' },
                    { service: 'Notification Queue', status: 'Healthy', color: 'success' },
                    { service: 'CRON Scheduler Engine', status: 'Running', color: 'success' },
                  ].map((sys, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center py-1.5 border-bottom border-light small">
                      <span className="text-muted">{sys.service}</span>
                      <span className={`badge bg-${sys.color} bg-opacity-10 text-${sys.color} border border-${sys.color} px-2 py-0.5`}>{sys.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div className="sticky-bottom p-3 bg-white border-top shadow-lg rounded-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span className="small text-muted"><FontAwesomeIcon icon={faInfoCircle} className="text-primary me-1" /> System changes take effect immediately across all department groups.</span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-sm btn-outline-secondary text-dark rounded-pill px-3" onClick={() => setCurrentView('inbox')}>Cancel</button>
              <button type="button" className="btn btn-sm btn-light border rounded-pill px-3 text-dark" onClick={() => {
                setNotifInApp(true);
                setNotifEmail(true);
                setNotifSms(false);
                setNotifPush(true);
                setNotifBrowser(true);
                setNotifSound(true);
                setNotifPopup(true);
                setNotifQuietHours(false);
              }}>Restore Defaults</button>
              <button type="submit" className="btn btn-sm btn-primary rounded-pill px-4 shadow-sm">Save Settings</button>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};

export default HrmsNotificationInbox;
