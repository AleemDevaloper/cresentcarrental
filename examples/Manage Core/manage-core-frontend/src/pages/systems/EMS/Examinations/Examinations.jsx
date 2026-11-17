import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faClock, faCheckCircle, faPlay,
  faQuestionCircle, faFileAlt, faArrowLeft, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';

const DEPARTMENTS = ['Science', 'Arts', 'Commerce', 'Engineering', 'Medical', 'IT'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science', 'Economics', 'History'];
const CLASSES = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'BS 1', 'BS 2', 'BS 3', 'BS 4'];
const EXAM_TYPES = ['Quiz', 'Midterm', 'Final', 'Practical'];
const STATUSES = ['Upcoming', 'Running', 'Completed', 'Cancelled'];

const initialForm = {
  name: '', subject: '', class: '', examType: 'Midterm',
  date: '', duration: '60', totalMarks: 100, passingMarks: 40,
  room: '', description: '',
};

const Examinations = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', subject: '', examType: '', status: '' });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showMarksEntry, setShowMarksEntry] = useState(false);
  const [marksData, setMarksData] = useState({});

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const cardBg = isDark ? '#131b2e' : '#ffffff';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData([
        { id: 1, name: 'Mid-Term Physics', subject: 'Physics', class: 'Class 10', date: '2025-08-20', duration: '90 min', totalMarks: 100, status: 'Upcoming' },
        { id: 2, name: 'Final Mathematics', subject: 'Mathematics', class: 'Class 12', date: '2025-08-25', duration: '180 min', totalMarks: 200, status: 'Upcoming' },
        { id: 3, name: 'Chemistry Quiz 2', subject: 'Chemistry', class: 'Class 11', date: '2025-08-15', duration: '30 min', totalMarks: 30, status: 'Running' },
        { id: 4, name: 'English Literature Final', subject: 'English', class: 'Class 10', date: '2025-08-10', duration: '120 min', totalMarks: 100, status: 'Completed' },
        { id: 5, name: 'CS Practical', subject: 'Computer Science', class: 'BS CS', date: '2025-08-18', duration: '60 min', totalMarks: 50, status: 'Running' },
        { id: 6, name: 'Biology Midterm', subject: 'Biology', class: 'Class 11', date: '2025-08-05', duration: '90 min', totalMarks: 75, status: 'Completed' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(initialForm);
    setQuestions([]);
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', subject: item.subject || '', class: item.class || '',
      examType: item.examType || 'Midterm', date: item.date || '',
      duration: item.duration?.replace(' min', '') || '60',
      totalMarks: item.totalMarks || 100, passingMarks: item.passingMarks || 40,
      room: item.room || '', description: item.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.class || !formData.date) {
      addNotification?.('Please fill all required fields', 'warning');
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.(editItem ? 'Exam updated successfully' : 'Exam created successfully', 'success');
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving exam', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Exam deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), question: '', marks: 5 }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const getStatusBadge = (status) => {
    const map = { Upcoming: 'info', Running: 'success', Completed: 'secondary', Cancelled: 'danger' };
    return <span className={`badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`}>{status}</span>;
  };

  const mockMarks = [
    { id: 1, student: 'Ali Ahmed', rollNo: 'S-001', marks: '' },
    { id: 2, student: 'Sara Khan', rollNo: 'S-002', marks: '' },
    { id: 3, student: 'Usman Ali', rollNo: 'S-003', marks: '' },
  ];

  if (showMarksEntry) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowMarksEntry(false)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Marks Entry</h5>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="card-body p-4">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Student</th>
                  <th>Roll No</th>
                  <th>Marks</th>
                  <th className="pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMarks.map(m => (
                  <tr key={m.id}>
                    <td className="ps-4 fw-semibold small">{m.student}</td>
                    <td><code>{m.rollNo}</code></td>
                    <td style={{ maxWidth: '120px' }}>
                      <input type="number" className="form-control form-control-sm" placeholder="Marks"
                        onChange={e => setMarksData({...marksData, [m.id]: e.target.value})} />
                    </td>
                    <td className="pe-4">
                      <button className="btn btn-sm btn-primary rounded-3" onClick={() => { addNotification?.('Marks saved', 'success'); }}>
                        <FontAwesomeIcon icon={faSave} className="me-1" /> Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showQuestions) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowQuestions(false)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Question Paper Builder</h5>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0" style={{ color: textColor }}>Questions ({questions.length})</h6>
              <button className="btn btn-sm btn-primary rounded-3" onClick={addQuestion}>
                <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Question
              </button>
            </div>
            {questions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FontAwesomeIcon icon={faQuestionCircle} className="fs-1 mb-3 opacity-50" />
                <p className="small">No questions added yet. Click "Add Question" to start building.</p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <div key={q.id} className="p-3 mb-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold small" style={{ color: textColor }}>Q{idx + 1}</span>
                    <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => removeQuestion(q.id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  <textarea className="form-control form-control-sm mb-2 rounded-3" rows="2"
                    placeholder="Enter question..." value={q.question}
                    onChange={e => updateQuestion(q.id, 'question', e.target.value)} />
                  <div className="row g-2 align-items-center">
                    <div className="col-auto">
                      <label className="x-small text-muted me-2">Marks:</label>
                      <input type="number" className="form-control form-control-sm d-inline-block" style={{ width: '80px' }}
                        value={q.marks} onChange={e => updateQuestion(q.id, 'marks', Number(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
              <span className="small text-muted">Total Marks: {questions.reduce((sum, q) => sum + (q.marks || 0), 0)}</span>
              <button className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faSave} className="me-1" /> Save Paper</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Examinations</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage exams, schedules, and results</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Exam
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search exams..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})}>
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})}>
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.examType} onChange={e => setFilters({...filters, examType: e.target.value})}>
              <option value="">All Types</option>
              {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-1">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setFilters({ department: '', subject: '', examType: '', status: '' }); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Exam Name</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Total Marks</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <FontAwesomeIcon icon={faGraduationCap} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No exams found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Create a new exam to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-primary opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td className="small">{item.subject}</td>
                  <td className="small">{item.class}</td>
                  <td className="small">{item.date}</td>
                  <td className="small">{item.duration}</td>
                  <td className="small fw-bold">{item.totalMarks}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => setShowQuestions(true)} title="Question Paper">
                      <FontAwesomeIcon icon={faFileAlt} />
                    </button>
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => setShowMarksEntry(true)} title="Marks Entry">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
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

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Exam' : 'Add Exam'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Exam Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mid-Term Physics" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Subject <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3" required value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}>
                        <option value="">Select Subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Class <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3" required value={formData.class}
                        onChange={e => setFormData({...formData, class: e.target.value})}>
                        <option value="">Select Class</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Exam Type</label>
                      <select className="form-select rounded-3" value={formData.examType}
                        onChange={e => setFormData({...formData, examType: e.target.value})}>
                        {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control rounded-3" required value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Duration (minutes)</label>
                      <input type="number" className="form-control rounded-3" value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Room</label>
                      <input type="text" className="form-control rounded-3" value={formData.room}
                        onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g. Hall A" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Total Marks</label>
                      <input type="number" className="form-control rounded-3" value={formData.totalMarks}
                        onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Passing Marks</label>
                      <input type="number" className="form-control rounded-3" value={formData.passingMarks}
                        onChange={e => setFormData({...formData, passingMarks: Number(e.target.value)})} />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Exam description / instructions" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faGraduationCap} className="me-2" />{editItem ? 'Update Exam' : 'Create Exam'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default Examinations;
