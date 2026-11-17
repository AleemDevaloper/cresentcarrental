import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faStar, faPenFancy,
  faHandshake, faFlask, faFutbol, faEye,
  faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';

const EVENT_TYPES = ['Exam', 'Holiday', 'Meeting', 'Workshop', 'Sports', 'Other'];
const EVENT_COLORS = {
  Exam: '#ef4444',
  Holiday: '#10b981',
  Meeting: '#3b82f6',
  Workshop: '#8b5cf6',
  Sports: '#f59e0b',
  Other: '#6b7280',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Events = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: 'Exam', date: '', location: '', description: '',
  });

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      setData([
        { id: 1, name: 'Mid-Term Examinations', type: 'Exam', date: '2026-08-15', location: 'Main Campus', description: 'Mid-term exams for all departments', color: '#ef4444' },
        { id: 2, name: 'Independence Day', type: 'Holiday', date: '2026-08-14', location: '-', description: 'National holiday', color: '#10b981' },
        { id: 3, name: 'Faculty Board Meeting', type: 'Meeting', date: '2026-08-10', location: 'Conference Room A', description: 'Monthly faculty coordination', color: '#3b82f6' },
        { id: 4, name: 'AI in Education Workshop', type: 'Workshop', date: '2026-09-05', location: 'Auditorium', description: 'Hands-on AI tools for educators', color: '#8b5cf6' },
        { id: 5, name: 'Annual Sports Gala', type: 'Sports', date: '2026-08-25', location: 'Sports Complex', description: 'Inter-department sports competition', color: '#f59e0b' },
        { id: 6, name: 'Final Term Examinations', type: 'Exam', date: '2026-12-10', location: 'All Campuses', description: 'Final exams for fall semester', color: '#ef4444' },
        { id: 7, name: 'Parent-Teacher Meeting', type: 'Meeting', date: '2026-09-15', location: 'Main Campus', description: 'Semester progress review', color: '#3b82f6' },
        { id: 8, name: 'Research Symposium', type: 'Workshop', date: '2026-10-20', location: 'Auditorium', description: 'Student research presentations', color: '#8b5cf6' },
      ]);
    } catch (err) {
      console.error('Error loading events', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const filtered = data.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || item.type === typeFilter;
    return matchSearch && matchType;
  });

  const getEventsForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filtered.filter(e => e.date === dateStr);
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({ name: '', type: 'Exam', date: '', location: '', description: '' });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', type: item.type || 'Exam', date: item.date || '',
      location: item.location || '', description: item.description || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      addNotification?.('Name and Date are required', 'warning');
      return;
    }
    try {
      addNotification?.((editItem ? 'Event updated' : 'Event created') + ' successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving event', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      addNotification?.('Event deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const today = new Date();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      cells.push(
        <div key={day} className="p-1" style={{ minHeight: '80px' }}>
          <div className={`d-flex align-items-center justify-content-center mb-1 fw-semibold small rounded-circle ${isToday ? 'bg-primary text-white' : ''}`}
            style={{ width: '26px', height: '26px', color: isToday ? '#fff' : textColor }}>
            {day}
          </div>
          <div className="d-flex flex-column gap-1">
            {events.slice(0, 2).map(evt => (
              <div key={evt.id} className="rounded-2 px-1 py-0.5 x-small fw-semibold text-truncate"
                style={{ background: `${evt.color}20`, color: evt.color, border: `1px solid ${evt.color}30`, fontSize: '9px', lineHeight: 1.4 }}
                title={evt.name}
              >
                {evt.name}
              </div>
            ))}
            {events.length > 2 && (
              <div className="x-small text-muted fw-semibold" style={{ fontSize: '9px' }}>+{events.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }
    return cells;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '500px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Events Calendar</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage exams, holidays, meetings, workshops, and sports events</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Event
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-3 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="d-flex flex-wrap align-items-center gap-2 justify-content-between">
          <div className="d-flex gap-1">
            {['month', 'week', 'day'].map(mode => (
              <button key={mode}
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${viewMode === mode ? 'btn-primary' : 'btn-light'}`}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-light rounded-3" onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(prev => prev - 1); } else { setCurrentMonth(prev => prev - 1); } }}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="fw-bold small" style={{ color: textColor }}>{MONTHS[currentMonth]} {currentYear}</span>
            <button className="btn btn-sm btn-light rounded-3" onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(prev => prev + 1); } else { setCurrentMonth(prev => prev + 1); } }}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="d-flex gap-2">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} size="xs" />
              </span>
              <input type="text" className={`form-control form-control-sm rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search events..." value={search}
                onChange={e => setSearch(e.target.value)} style={{ width: '200px' }} />
            </div>
            <select className={`form-select form-select-sm rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: '130px' }}>
              <option value="">All Types</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {viewMode === 'month' && (
        <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
          <div className="row g-0 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="col text-center fw-bold small text-uppercase" style={{ color: mutedColor, fontSize: '11px' }}>
                {d}
              </div>
            ))}
          </div>
          <div className="row g-0">
            {renderCalendar()}
          </div>
          <div className="d-flex flex-wrap gap-3 mt-3 pt-3 border-top" style={{ borderColor }}>
            {EVENT_TYPES.filter(t => t !== 'Other').map(type => (
              <div className="d-flex align-items-center gap-2" key={type}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: EVENT_COLORS[type], display: 'inline-block' }} />
                <span className="x-small fw-semibold text-muted">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode !== 'month' && (
        <div className="text-center py-5 text-muted">
          <FontAwesomeIcon icon={faCalendarAlt} className="fs-1 mb-3 opacity-50" />
          <h6 className="fw-bold">Weekly & Daily views coming soon</h6>
          <p className="small">Switch to Month view for the calendar</p>
        </div>
      )}

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Event Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <FontAwesomeIcon icon={faCalendarAlt} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No events found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new event to get started</p>
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color || EVENT_COLORS[item.type], display: 'inline-block' }} />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge rounded-pill px-3 py-1.5 fw-semibold" style={{ background: `${(item.color || EVENT_COLORS[item.type])}20`, color: item.color || EVENT_COLORS[item.type], border: `1px solid ${(item.color || EVENT_COLORS[item.type])}30` }}>
                      {item.type}
                    </span>
                  </td>
                  <td className="small">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="small">{item.location}</td>
                  <td className="small text-muted" style={{ maxWidth: '250px' }}><span className="text-truncate d-inline-block" style={{ maxWidth: '250px' }}>{item.description}</span></td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Event' : 'Add Event'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="small fw-bold text-muted mb-2">Event Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mid-Term Exams" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Type</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control rounded-3" required value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Location</label>
                      <input type="text" className="form-control rounded-3" value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Main Campus" />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Event description..." />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />{editItem ? 'Update Event' : 'Save Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .x-small { font-size: 11px; }
        .skeleton-card { border-radius: 18px; }
        .skeleton-line { border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

export default Events;
