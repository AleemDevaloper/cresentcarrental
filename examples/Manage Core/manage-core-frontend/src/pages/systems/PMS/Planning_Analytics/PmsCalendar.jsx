import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { listProjects } from '../../../../api/projects';
import { listCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../../../api/pms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faPlus, faEdit, faTrash, faSearch,
  faCheckCircle, faClock, faFilter, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const PmsCalendar = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const cardBg = isDark ? '#1a1d29' : '#fff';

  const today = new Date();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', start_date: today.toISOString().slice(0, 10), type: 'Meeting', description: '' });

  useEffect(() => {
    listProjects().then(data => {
      setProjects(data);
      if (data.length > 0) setProjectId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await listCalendarEvents({ project_id: projectId });
      setEvents(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'All' || e.type === filterType;
      return matchSearch && matchType;
    });
  }, [events, search, filterType]);

  const monthEvents = useMemo(() => {
    const map = {};
    filteredEvents.forEach(e => {
      const d = e.start_date?.slice(0, 10);
      if (d) {
        if (!map[d]) map[d] = [];
        map[d].push(e);
      }
    });
    return map;
  }, [filteredEvents]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return filteredEvents
      .filter(e => new Date(e.start_date) >= now)
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      .slice(0, 5);
  }, [filteredEvents]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const openAdd = (dateStr) => {
    setEditEvent(null);
    setForm({ title: '', start_date: dateStr || today.toISOString().slice(0, 10), type: 'Meeting', description: '' });
    setShowModal(true);
  };

  const openEdit = (evt) => {
    setEditEvent(evt);
    setForm({ title: evt.title, start_date: evt.start_date?.slice(0, 10), type: evt.type || 'Meeting', description: evt.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_date) return;
    const payload = { ...form, project_id: projectId };
    try {
      if (editEvent) {
        await updateCalendarEvent(editEvent.id, payload);
      } else {
        await createCalendarEvent(payload);
      }
      await loadData();
    } catch (err) { console.error(err); }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteCalendarEvent(id);
      await loadData();
    } catch (err) { console.error(err); }
  };

  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter(e => new Date(e.start_date) >= new Date()).length;
    const thisMonth = events.filter(e => e.start_date?.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)).length;
    return { total, upcoming, thisMonth };
  }, [events, currentMonth, currentYear]);

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="px-3 px-lg-4 py-4" style={{ color: textColor }}>
      <div className="row g-4 mb-4">
        {[
          { label: 'Total Events', value: stats.total, color: '#4f46e5' },
          { label: 'Upcoming', value: stats.upcoming, color: '#10b981' },
          { label: 'This Month', value: stats.thisMonth, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', background: cardBg }}>
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: `${s.color}18`, color: s.color, fontSize: 20 }}>
                  <FontAwesomeIcon icon={[faCalendarAlt, faClock, faFilter][i]} />
                </div>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div className="small" style={{ color: mutedColor, lineHeight: 1.2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: cardBg }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                  <button className="btn btn-light btn-sm rounded-circle" onClick={handlePrevMonth} style={{ width: 36, height: 36 }}><FontAwesomeIcon icon={faChevronLeft} /></button>
                  <h5 className="fw-bold mb-0">{MONTHS[currentMonth]} {currentYear}</h5>
                  <button className="btn btn-light btn-sm rounded-circle" onClick={handleNextMonth} style={{ width: 36, height: 36 }}><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select form-select-sm" style={{ width: 'auto', background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}
                    value={projectId} onChange={e => setProjectId(e.target.value)}>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={() => openAdd(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)} disabled={!projectId}>
                    <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Event
                  </button>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-7">
                  <div className="input-group" style={{ borderColor }}>
                    <span className="input-group-text" style={{ background: isDark ? '#262a3a' : '#f8f9fa', borderColor, color: mutedColor }}><FontAwesomeIcon icon={faSearch} /></span>
                    <input className="form-control" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }} />
                  </div>
                </div>
                <div className="col-md-5">
                  <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ background: isDark ? '#1a1d29' : '#fff', borderColor, color: textColor }}>
                    <option value="All">All Types</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Sprint">Sprint</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row g-1">
                {DAYS.map(d => <div key={d} className="col text-center small fw-bold py-2" style={{ color: mutedColor }}>{d}</div>)}
                {calendarCells.map((day, i) => {
                  const dateStr = day ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                  const dayEvents = monthEvents[dateStr] || [];
                  const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                  return (
                    <div key={i} className="col p-1" style={{ minHeight: 80 }}>
                      {day && (
                        <div
                          className={`rounded-3 p-1 h-100 d-flex flex-column ${isToday ? 'border border-primary' : ''}`}
                          style={{ background: isDark ? '#262a3a' : '#f8f9fa', cursor: 'pointer', borderColor: isToday ? '#4f46e5' : 'transparent' }}
                          onClick={() => openAdd(dateStr)}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className={`small fw-bold ${isToday ? 'text-primary' : ''}`} style={{ fontSize: 11 }}>{day}</span>
                            {dayEvents.length > 2 && <span className="badge bg-primary rounded-pill" style={{ fontSize: 9 }}>{dayEvents.length}</span>}
                          </div>
                          <div className="d-flex flex-column gap-1 overflow-hidden" style={{ flex: 1 }}>
                            {dayEvents.slice(0, 2).map((ev, ei) => (
                              <div key={ei}
                                className="rounded-1 px-1 text-truncate"
                                style={{ fontSize: 10, background: `${EVENT_COLORS[ei % EVENT_COLORS.length]}22`, color: EVENT_COLORS[ei % EVENT_COLORS.length], borderLeft: `2px solid ${EVENT_COLORS[ei % EVENT_COLORS.length]}` }}
                                title={ev.title}
                                onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                              >
                                {ev.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', background: cardBg }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Upcoming Events</h6>
              {loading ? (
                <div className="text-center py-4" style={{ color: mutedColor }}>Loading...</div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-4" style={{ color: mutedColor }}>
                  <FontAwesomeIcon icon={faCalendarAlt} className="fs-2 mb-2 opacity-50" />
                  <p className="small mb-0">No upcoming events</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {upcomingEvents.map((ev, i) => (
                    <div key={ev.id} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: isDark ? '#262a3a' : '#f8f9fa' }}>
                      <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, background: `${EVENT_COLORS[i % EVENT_COLORS.length]}18`, color: EVENT_COLORS[i % EVENT_COLORS.length] }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="fw-bold small text-truncate">{ev.title}</div>
                        <div className="extra-small" style={{ color: mutedColor }}>{ev.start_date?.slice(0, 10)} • {ev.type}</div>
                      </div>
                      <div className="d-flex gap-1 flex-shrink-0">
                        <button className="btn btn-sm p-1 text-primary" onClick={() => openEdit(ev)} title="Edit">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-sm p-1 text-danger" onClick={() => handleDelete(ev.id)} title="Delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: cardBg, borderRadius: '16px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">{editEvent ? 'Edit Event' : 'New Event'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Title</label>
                    <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Date</label>
                      <input type="date" className="form-control" required value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Type</label>
                      <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option>Meeting</option>
                        <option>Deadline</option>
                        <option>Milestone</option>
                        <option>Sprint</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description</label>
                    <textarea className="form-control" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional details" />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">{editEvent ? 'Update' : 'Add Event'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.extra-small { font-size: 10px; }`}</style>
    </div>
  );
};

export default PmsCalendar;
