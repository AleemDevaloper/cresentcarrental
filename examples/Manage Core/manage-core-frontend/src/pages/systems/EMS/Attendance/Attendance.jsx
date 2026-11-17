import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList, faSearch, faCheckCircle, faTimesCircle,
  faClock, faBed, faUserCheck, faUserSlash,
  faFilter, faRotate, faCalendarAlt, faSchool,
  faLayerGroup, faDoorOpen, faBookOpen,
  faUsers, faChalkboardTeacher, faFileExport,
  faCheck, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';

const STATUSES = ['Present', 'Absent', 'Late', 'Leave'];
const STATUS_COLORS = {
  Present: { bg: '#10b981', label: 'Present' },
  Absent: { bg: '#ef4444', label: 'Absent' },
  Late: { bg: '#f59e0b', label: 'Late' },
  Leave: { bg: '#6366f1', label: 'Leave' },
};

const Attendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [filters, setFilters] = useState({
    institution: '', campus: '', department: '', class: '', section: '', subject: '',
    date_from: '', date_to: '',
  });
  const [attendance, setAttendance] = useState({});

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const mockStudents = [
    { id: 1, name: 'Ali Ahmed', roll: 'CS-001', class: 'CS-3A' },
    { id: 2, name: 'Sara Khan', roll: 'CS-002', class: 'CS-3A' },
    { id: 3, name: 'Usman Ali', roll: 'CS-003', class: 'CS-3A' },
    { id: 4, name: 'Fatima Zahra', roll: 'CS-004', class: 'CS-3A' },
    { id: 5, name: 'Hassan Raza', roll: 'CS-005', class: 'CS-3A' },
    { id: 6, name: 'Ayesha Malik', roll: 'CS-006', class: 'CS-3A' },
    { id: 7, name: 'Bilal Ahmed', roll: 'CS-007', class: 'CS-3A' },
    { id: 8, name: 'Zainab Noor', roll: 'CS-008', class: 'CS-3A' },
  ];

  const mockTeachers = [
    { id: 1, name: 'Dr. Usman Malik', department: 'Computer Science' },
    { id: 2, name: 'Prof. Sara Khan', department: 'Mathematics' },
    { id: 3, name: 'Dr. Ali Ahmed', department: 'Physics' },
    { id: 4, name: 'Ms. Fatima Noor', department: 'English' },
  ];

  const mockClasses = [
    { id: 1, name: 'CS-3A' },
    { id: 2, name: 'BBA-2B' },
    { id: 3, name: 'ENG-1A' },
  ];

  const mockSubjects = [
    { id: 1, name: 'Data Structures', code: 'CS-201' },
    { id: 2, name: 'Calculus I', code: 'MATH-101' },
    { id: 3, name: 'English Composition', code: 'ENG-101' },
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const initial = {};
      mockStudents.forEach(s => { initial[s.id] = 'Present'; });
      setAttendance(initial);
    } catch (err) {
      console.error('Error loading attendance', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const markAll = (status) => {
    const updated = {};
    mockStudents.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
    addNotification?.(`All marked as ${status}`, 'success');
  };

  const markStudent = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleBulkSubmit = () => {
    addNotification?.('Attendance saved successfully', 'success');
  };

  const getStatusBadge = (status) => {
    const config = STATUS_COLORS[status] || STATUS_COLORS.Present;
    return (
      <span className="badge rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1" style={{ background: `${config.bg}20`, color: config.bg, border: `1px solid ${config.bg}40`, fontSize: '11px' }}>
        {status === 'Present' && <FontAwesomeIcon icon={faCheckCircle} />}
        {status === 'Absent' && <FontAwesomeIcon icon={faTimesCircle} />}
        {status === 'Late' && <FontAwesomeIcon icon={faClock} />}
        {status === 'Leave' && <FontAwesomeIcon icon={faBed} />}
        {config.label}
      </span>
    );
  };

  const counts = {
    Present: Object.values(attendance).filter(v => v === 'Present').length,
    Absent: Object.values(attendance).filter(v => v === 'Absent').length,
    Late: Object.values(attendance).filter(v => v === 'Late').length,
    Leave: Object.values(attendance).filter(v => v === 'Leave').length,
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          <div className="col-12">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '400px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Attendance Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button className="btn btn-success rounded-3 px-4" onClick={handleBulkSubmit}>
          <FontAwesomeIcon icon={faCheck} className="me-2" />Save Attendance
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Date</label>
            <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Class</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={classId} onChange={e => setClassId(e.target.value)}>
              <option value="">Select Class</option>
              {mockClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Subject</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              <option value="">Select Subject</option>
              {mockSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="col-md-6 d-flex align-items-end gap-2">
            <button className="btn btn-outline-primary rounded-3" onClick={() => setActiveTab('students')}>
              <FontAwesomeIcon icon={faUserCheck} className="me-1" />Students
            </button>
            <button className="btn btn-outline-secondary rounded-3" onClick={() => setActiveTab('teachers')}>
              <FontAwesomeIcon icon={faChalkboardTeacher} className="me-1" />Teachers
            </button>
            <button className="btn btn-outline-info rounded-3" onClick={() => setActiveTab('report')}>
              <FontAwesomeIcon icon={faFileExport} className="me-1" />Report
            </button>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Institution</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.institution} onChange={e => setFilters({...filters, institution: e.target.value})}>
              <option value="">All</option>
              <option value="1">Main Campus</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Campus</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.campus} onChange={e => setFilters({...filters, campus: e.target.value})}>
              <option value="">All</option>
              <option value="1">North Campus</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Department</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})}>
              <option value="">All</option>
              <option value="1">Computer Science</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Section</label>
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.section} onChange={e => setFilters({...filters, section: e.target.value})}>
              <option value="">All</option>
              <option value="A">Section A</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Date From</label>
            <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.date_from} onChange={e => setFilters({...filters, date_from: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="small fw-bold text-muted mb-2">Date To</label>
            <div className="d-flex gap-1">
              <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                value={filters.date_to} onChange={e => setFilters({...filters, date_to: e.target.value})} />
              <button className="btn btn-outline-secondary rounded-3" onClick={() => setFilters({
                institution: '', campus: '', department: '', class: '', section: '', subject: '',
                date_from: '', date_to: '',
              })}>
                <FontAwesomeIcon icon={faRotate} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'students' && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold small" style={{ color: textColor }}>Bulk Mark:</span>
              {STATUSES.map(status => (
                <button key={status} className="btn btn-sm rounded-pill px-3 fw-semibold" style={{
                  background: `${STATUS_COLORS[status].bg}15`,
                  color: STATUS_COLORS[status].bg,
                  border: `1px solid ${STATUS_COLORS[status].bg}30`,
                  fontSize: '11px',
                }} onClick={() => markAll(status)}>
                  {status}
                </button>
              ))}
            </div>
            <div className="d-flex gap-3">
              {STATUSES.map(status => (
                <span key={status} className="small fw-semibold" style={{ color: STATUS_COLORS[status].bg }}>
                  {status}: {counts[status]}
                </span>
              ))}
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th className="ps-4" style={{ width: '50px' }}>#</th>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th className="text-center" style={{ width: '300px' }}>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStudents.map((student, idx) => (
                    <tr key={student.id}>
                      <td className="ps-4 small text-muted">{idx + 1}</td>
                      <td className="fw-semibold small">{student.name}</td>
                      <td><code>{student.roll}</code></td>
                      <td className="small">{student.class}</td>
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          {STATUSES.map(status => (
                            <button key={status}
                              className={`btn btn-sm rounded-pill px-3 fw-semibold transition ${attendance[student.id] === status ? 'shadow-sm' : ''}`}
                              style={{
                                background: attendance[student.id] === status ? `${STATUS_COLORS[status].bg}20` : 'transparent',
                                color: attendance[student.id] === status ? STATUS_COLORS[status].bg : mutedColor,
                                border: `1px solid ${attendance[student.id] === status ? STATUS_COLORS[status].bg : borderColor}`,
                                fontSize: '11px',
                              }}
                              onClick={() => markStudent(student.id, status)}
                            >
                              {status === 'Present' && <FontAwesomeIcon icon={faCheckCircle} className="me-1" />}
                              {status === 'Absent' && <FontAwesomeIcon icon={faTimesCircle} className="me-1" />}
                              {status === 'Late' && <FontAwesomeIcon icon={faClock} className="me-1" />}
                              {status === 'Leave' && <FontAwesomeIcon icon={faBed} className="me-1" />}
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'teachers' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4" style={{ width: '50px' }}>#</th>
                  <th>Teacher Name</th>
                  <th>Department</th>
                  <th className="text-center" style={{ width: '300px' }}>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {mockTeachers.map((teacher, idx) => (
                  <tr key={teacher.id}>
                    <td className="ps-4 small text-muted">{idx + 1}</td>
                    <td className="fw-semibold small"><FontAwesomeIcon icon={faChalkboardTeacher} className="me-2 text-muted" />{teacher.name}</td>
                    <td className="small">{teacher.department}</td>
                    <td>
                      <div className="d-flex gap-1 justify-content-center">
                        {STATUSES.map(status => (
                          <button key={status}
                            className={`btn btn-sm rounded-pill px-3 fw-semibold transition`}
                            style={{
                              background: 'transparent',
                              color: mutedColor,
                              border: `1px solid ${borderColor}`,
                              fontSize: '11px',
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
          <h5 className="fw-bold mb-3" style={{ color: textColor }}>Attendance Report</h5>
          <div className="row g-4 mb-4">
            {STATUSES.map(status => (
              <div className="col-md-3" key={status}>
                <div className="p-3 rounded-4 text-center" style={{
                  background: `${STATUS_COLORS[status].bg}10`,
                  border: `1px solid ${STATUS_COLORS[status].bg}20`,
                }}>
                  <div className="h3 fw-bold mb-0" style={{ color: STATUS_COLORS[status].bg }}>{counts[status]}</div>
                  <div className="small fw-semibold text-muted">{status}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
            {STATUSES.map(status => {
              const total = Object.keys(attendance).length;
              const pct = total > 0 ? (counts[status] / total) * 100 : 0;
              return pct > 0 ? (
                <div key={status} className="progress-bar" style={{
                  width: `${pct}%`,
                  background: STATUS_COLORS[status].bg,
                  borderRadius: status === 'Present' ? '10px 0 0 10px' : status === 'Leave' ? '0 10px 10px 0' : '0',
                }}></div>
              ) : null;
            })}
          </div>
          <div className="d-flex justify-content-center gap-4 mt-3">
            {STATUSES.map(status => (
              <div className="d-flex align-items-center gap-2" key={status}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: STATUS_COLORS[status].bg, display: 'inline-block' }} />
                <span className="small fw-semibold text-muted">{status} ({counts[status]})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .x-small { font-size: 11px; }
        .transition { transition: all 0.2s ease; }
        .skeleton-card { border-radius: 18px; }
        .skeleton-line { border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

export default Attendance;
