import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faChalkboardTeacher, faDoorOpen,
  faPlus, faExclamationTriangle, faCheckCircle,
  faPrint, faSun, faMoon, faTimes, faClock,
  faChair, faUserGraduate, faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
];

const Timetables = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('class');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday', period: '08:00-09:00', subject: '', teacher: '', room: '', class: '',
  });

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const [timetable, setTimetable] = useState({
    'Monday': {
      '08:00-09:00': { subject: 'Data Structures', teacher: 'Dr. Usman', room: 'Lab 1', class: 'CS-3A' },
      '09:00-10:00': { subject: 'Calculus I', teacher: 'Prof. Sara', room: 'Room 201', class: 'BBA-2B' },
      '10:00-11:00': { subject: '', teacher: '', room: '', class: '' },
      '11:00-12:00': { subject: 'English Comp.', teacher: 'Ms. Fatima', room: 'Room 105', class: 'CS-3A' },
      '12:00-13:00': { subject: 'Break', teacher: '-', room: '-', class: '-' },
      '13:00-14:00': { subject: 'Database Systems', teacher: 'Dr. Usman', room: 'Lab 2', class: 'CS-3A' },
      '14:00-15:00': { subject: '', teacher: '', room: '', class: '' },
      '15:00-16:00': { subject: '', teacher: '', room: '', class: '' },
    },
    'Tuesday': {
      '08:00-09:00': { subject: 'Physics', teacher: 'Dr. Ali', room: 'Lab 3', class: 'ENG-1A' },
      '09:00-10:00': { subject: '', teacher: '', room: '', class: '' },
      '10:00-11:00': { subject: 'Linear Algebra', teacher: 'Prof. Sara', room: 'Room 203', class: 'BBA-2B' },
      '11:00-12:00': { subject: '', teacher: '', room: '', class: '' },
      '12:00-13:00': { subject: 'Break', teacher: '-', room: '-', class: '-' },
      '13:00-14:00': { subject: '', teacher: '', room: '', class: '' },
      '14:00-15:00': { subject: 'AI Workshop', teacher: 'Dr. Khan', room: 'Lab 1', class: 'CS-3A' },
      '15:00-16:00': { subject: '', teacher: '', room: '', class: '' },
    },
  });

  const mockClasses = ['CS-3A', 'BBA-2B', 'ENG-1A', 'MED-4A'];
  const mockTeachers = ['Dr. Usman', 'Prof. Sara', 'Dr. Ali', 'Ms. Fatima', 'Dr. Khan'];
  const mockRooms = ['Lab 1', 'Lab 2', 'Lab 3', 'Room 101', 'Room 105', 'Room 201', 'Room 203'];
  const mockSubjects = ['Data Structures', 'Calculus I', 'Physics', 'English Comp.', 'Database Systems', 'Linear Algebra', 'AI Workshop'];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error('Error loading timetable', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const checkConflict = (day, period, teacher, room) => {
    for (const [d, periods] of Object.entries(timetable)) {
      for (const [p, entry] of Object.entries(periods)) {
        if (d === day && p === period) continue;
        if (entry.subject && entry.subject !== 'Break') {
          if (entry.teacher === teacher) {
            return `Teacher "${teacher}" already scheduled ${d} ${p}`;
          }
          if (entry.room === room) {
            return `Room "${room}" already booked ${d} ${p}`;
          }
        }
      }
    }
    return null;
  };

  const handleAddEntry = () => {
    if (!formData.subject || !formData.teacher || !formData.room) {
      addNotification?.('Subject, Teacher and Room are required', 'warning');
      return;
    }
    const conflict = checkConflict(formData.day, formData.period, formData.teacher, formData.room);
    if (conflict) {
      setShowConflict(conflict);
      return;
    }
    const updated = { ...timetable };
    if (!updated[formData.day]) updated[formData.day] = {};
    updated[formData.day][formData.period] = {
      subject: formData.subject,
      teacher: formData.teacher,
      room: formData.room,
      class: formData.class || '-',
    };
    setTimetable(updated);
    addNotification?.('Timetable entry added', 'success');
    setShowForm(false);
    setFormData({ day: 'Monday', period: '08:00-09:00', subject: '', teacher: '', room: '', class: '' });
  };

  const handleRemoveEntry = (day, period) => {
    const updated = { ...timetable };
    if (updated[day] && updated[day][period]) {
      updated[day][period] = { subject: '', teacher: '', room: '', class: '' };
      setTimetable(updated);
      addNotification?.('Entry removed', 'success');
    }
  };

  const getSlotColor = (entry) => {
    if (!entry.subject || entry.subject === 'Break') return 'transparent';
    if (entry.subject.includes('Lab') || entry.room?.includes('Lab')) return isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)';
    return isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)';
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
          <h4 className="fw-bold mb-1">Timetable Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Create and manage weekly class schedules</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary rounded-3" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} className="me-1" />Print
          </button>
          <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add Entry
          </button>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-3 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="d-flex gap-2">
          {['class', 'teacher', 'room'].map(tab => (
            <button key={tab}
              className={`btn btn-sm rounded-pill px-4 fw-semibold ${activeTab === tab ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setActiveTab(tab)}
            >
              <FontAwesomeIcon icon={tab === 'class' ? faUserGraduate : tab === 'teacher' ? faChalkboardTeacher : faDoorOpen} className="me-1" />
              {tab.charAt(0).toUpperCase() + tab.slice(1)} View
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle" style={{ minWidth: '1000px', borderColor: borderColor }}>
          <thead>
            <tr className="text-center">
              <th className="fw-bold small text-uppercase" style={{ width: '120px', color: textColor, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc' }}>Period</th>
              {DAYS.map(day => (
                <th key={day} className="fw-bold small text-uppercase" style={{ color: textColor, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc' }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map(period => (
              <tr key={period}>
                <td className="text-center fw-semibold small" style={{ color: mutedColor, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }}>
                  <FontAwesomeIcon icon={faClock} className="me-1" style={{ fontSize: '10px' }} />
                  {period}
                </td>
                {DAYS.map(day => {
                  const entry = timetable[day]?.[period] || { subject: '', teacher: '', room: '', class: '' };
                  const isBreak = entry.subject === 'Break';
                  const isEmpty = !entry.subject;
                  return (
                    <td key={`${day}-${period}`} className="text-center p-2" style={{
                      background: getSlotColor(entry),
                      cursor: isEmpty ? 'pointer' : 'default',
                      minHeight: '80px',
                    }}
                      onClick={() => {
                        if (isEmpty && !isBreak) {
                          setFormData({ ...formData, day, period });
                          setShowForm(true);
                        }
                      }}
                    >
                      {isBreak ? (
                        <span className="badge bg-warning-subtle text-warning rounded-pill px-3 py-2">Break</span>
                      ) : isEmpty ? (
                        <span className="small text-muted opacity-50">Empty</span>
                      ) : (
                        <motion.div
                          className="p-2 rounded-3"
                          whileHover={{ scale: 1.02 }}
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
                            border: `1px solid ${borderColor}`,
                          }}
                        >
                          <div className="fw-bold small" style={{ color: textColor }}>{entry.subject}</div>
                          <div className="x-small text-muted"><FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" />{entry.teacher}</div>
                          <div className="x-small text-muted"><FontAwesomeIcon icon={faDoorOpen} className="me-1" />{entry.room}</div>
                          {entry.class && entry.class !== '-' && (
                            <div className="x-small text-muted"><FontAwesomeIcon icon={faUserGraduate} className="me-1" />{entry.class}</div>
                          )}
                          <button className="btn btn-sm btn-link text-danger p-0 mt-1" onClick={(e) => { e.stopPropagation(); handleRemoveEntry(day, period); }}>
                            <FontAwesomeIcon icon={faTimes} size="xs" />
                          </button>
                        </motion.div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">Add Timetable Entry</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Day</label>
                    <select className="form-select rounded-3" value={formData.day}
                      onChange={e => setFormData({...formData, day: e.target.value})}>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Period</label>
                    <select className="form-select rounded-3" value={formData.period}
                      onChange={e => setFormData({...formData, period: e.target.value})}>
                      {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Subject <span className="text-danger">*</span></label>
                    <select className="form-select rounded-3" value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}>
                      <option value="">Select Subject</option>
                      {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Teacher <span className="text-danger">*</span></label>
                    <select className="form-select rounded-3" value={formData.teacher}
                      onChange={e => setFormData({...formData, teacher: e.target.value})}>
                      <option value="">Select Teacher</option>
                      {mockTeachers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Room <span className="text-danger">*</span></label>
                    <select className="form-select rounded-3" value={formData.room}
                      onChange={e => setFormData({...formData, room: e.target.value})}>
                      <option value="">Select Room</option>
                      {mockRooms.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted mb-2">Class</label>
                    <select className="form-select rounded-3" value={formData.class}
                      onChange={e => setFormData({...formData, class: e.target.value})}>
                      <option value="">Select Class</option>
                      {mockClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary rounded-3 px-4" onClick={handleAddEntry}>
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConflict && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold text-danger"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Conflict Detected</h5>
                <button className="btn-close" onClick={() => setShowConflict(false)} />
              </div>
              <div className="modal-body p-4">
                <p className="small mb-0">{showConflict}</p>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowConflict(false)}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .x-small { font-size: 11px; }
        .table-bordered > :not(caption) > * > * { border-color: ${borderColor}; }
        @media print {
          body { background: white !important; }
          .btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Timetables;
