import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { listCalendarEvents, calendarMonthView, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faCalendar, faChevronLeft, faChevronRight, faPlus, faTrash, faEdit,
  faClock, faUsers, faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmCalendar = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await calendarMonthView({ month, year });
      setEvents(res || []);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [month, year]);

  const monthStart = useMemo(() => new Date(year, month - 1, 1), [month, year]);
  const monthEnd = useMemo(() => new Date(year, month, 0), [month, year]);
  const startDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(e => {
      const d = new Date(e.start_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [events]);

  const prev = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const monthName = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const totals = useMemo(() => ({
    events: events.length,
    tasks: events.filter(e => e.type === 'task').length,
    meetings: events.filter(e => e.type === 'meeting').length,
    reminders: events.filter(e => e.type === 'reminder').length,
  }), [events]);

  const eventTypeIcon = (type) => {
    if (type === 'task') return faTasks;
    if (type === 'meeting') return faUsers;
    return faClock;
  };

  return (
    <ErpPageShell
      icon={faCalendar}
      title="Calendar"
      description="All scheduled events, tasks, calls, meetings and follow-ups."
      action={
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ start_at: new Date().toISOString().slice(0, 16) })}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Event
        </button>
      }
    >
      <div className="row g-2 mb-3">
        <div className="col-md-3"><ErpKpiCard title="This Month" value={totals.events} icon={faCalendar} color="#6366f1" /></div>
        <div className="col-md-3"><ErpKpiCard title="Tasks" value={totals.tasks} icon={faTasks} color="#f59e0b" /></div>
        <div className="col-md-3"><ErpKpiCard title="Meetings" value={totals.meetings} icon={faUsers} color="#10b981" /></div>
        <div className="col-md-3"><ErpKpiCard title="Reminders" value={totals.reminders} icon={faClock} color="#8b5cf6" /></div>
      </div>

      <div className="glass-card p-3" style={{ borderRadius: '14px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-sm" onClick={prev}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <h4 className="mb-0">{monthName}</h4>
          <button className="btn btn-sm" onClick={next}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered mb-0" style={{ fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <th key={d} className="text-center" style={{ width: '14.28%' }}>{d}</th>
                ))}
            </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((d, i) => {
                    const dateKey = `${year}-${month}-${d}`;
                    const dayEvents = d ? (eventsByDate[dateKey] || []) : [];
                    const today = d && new Date(year, month - 1, d).toDateString() === new Date().toDateString();
                    return (
                      <td key={i} style={{
                        verticalAlign: 'top',
                        height: 110,
                        background: today ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.05)') : 'transparent',
                      }}>
                        {d && (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>{d}</div>
                            {dayEvents.slice(0, 3).map((e, idx) => (
                              <div key={idx} className="small p-1 mb-1" style={{
                                background: e.color || '#6366f1',
                                color: '#fff',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                              }} onClick={() => setModal(e)}>
                                <FontAwesomeIcon icon={eventTypeIcon(e.type)} className="me-1" />
                                {e.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && <small className="text-muted">+{dayEvents.length - 3} more</small>}
                            <button className="btn btn-sm p-0" onClick={() => {
                              const dt = new Date(year, month - 1, d, 9);
                              setModal({ start_at: dt.toISOString().slice(0, 16) });
                            }} style={{ fontSize: '0.7rem', color: '#6366f1' }}>+ Add</button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EventModal
        isOpen={!!modal}
        event={modal}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); load(); }}
        isDark={isDark}
      />

      <CrmConfirmDialog
        isOpen={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={async () => {
          await deleteCalendarEvent(confirmDel.id);
          setConfirmDel(null);
          load();
        }}
        title="Delete Event"
        message={`Delete "${confirmDel?.title}"?`}
        confirmText="Delete"
        variant="danger"
        isDark={isDark}
      />
    </ErpPageShell>
  );
};

const EventModal = ({ isOpen, event, onClose, onSaved, isDark }) => {
  const { addNotification } = useApp();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        type: event.type || 'meeting',
        start_at: event.start_at ? new Date(event.start_at).toISOString().slice(0, 16) : '',
        end_at: event.end_at ? new Date(event.end_at).toISOString().slice(0, 16) : '',
        location: event.location || '',
        all_day: event.all_day || false,
        color: event.color || '#6366f1',
      });
    }
  }, [event]);

  const save = async () => {
    if (!form.title || !form.start_at) {
      addNotification?.({ type: 'error', message: 'Title and start required' });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, start_at: new Date(form.start_at).toISOString(), end_at: form.end_at ? new Date(form.end_at).toISOString() : null };
      if (event?.id) {
        await updateCalendarEvent(event.id, payload);
      } else {
        await createCalendarEvent(payload);
      }
      addNotification?.({ type: 'success', message: 'Saved' });
      onSaved?.();
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CrmModal isOpen={isOpen} onClose={onClose} title={event?.id ? 'Edit Event' : 'New Event'} isDark={isDark}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </>
      }
    >
      <label className="form-label">Title *</label>
      <input className="form-control mb-2" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <label className="form-label">Type</label>
      <select className="form-select mb-2" value={form.type || 'meeting'} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="meeting">Meeting</option>
        <option value="call">Call</option>
        <option value="task">Task</option>
        <option value="event">Event</option>
        <option value="reminder">Reminder</option>
      </select>
      <div className="row">
        <div className="col-md-6">
          <label className="form-label">Start *</label>
          <input type="datetime-local" className="form-control mb-2" value={form.start_at || ''} onChange={(e) => setForm({ ...form, start_at: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label">End</label>
          <input type="datetime-local" className="form-control mb-2" value={form.end_at || ''} onChange={(e) => setForm({ ...form, end_at: e.target.value })} />
        </div>
      </div>
      <label className="form-label">Location</label>
      <input className="form-control mb-2" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <label className="form-label">Description</label>
      <textarea className="form-control mb-2" rows="3" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <label className="form-label">Color</label>
      <input type="color" className="form-control form-control-color" value={form.color || '#6366f1'} onChange={(e) => setForm({ ...form, color: e.target.value })} />
    </CrmModal>
  );
};

export default CrmCalendar;