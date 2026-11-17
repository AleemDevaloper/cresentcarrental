import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faCheckCircle, faClock, faUpload,
  faDownload, faPaperclip, faFileAlt, faTimes, faStar,
  faArrowLeft, faFilter
} from '@fortawesome/free-solid-svg-icons';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 'Computer Science', 'History', 'Geography', 'Islamic Studies'];
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'BS CS', 'BS SE', 'BS AI'];
const TEACHERS = ['Dr. Ahmad Khan', 'Prof. Sara Ali', 'Mr. Usman Malik', 'Ms. Fatima Noor', 'Dr. Hassan Raza'];
const STATUSES = ['Draft', 'Published', 'Closed'];
const SUBMISSION_TYPES = ['File', 'Text', 'Both'];

const initialForm = {
  title: '', description: '', subject: '', class: '', teacher: '',
  dueDate: '', totalMarks: 100, passingMarks: 40,
  submissionType: 'File', instructions: '', attachments: '',
};

const Assignments = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: '', teacher: '', class: '', status: '', dateFrom: '', dateTo: '' });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [viewSubmissions, setViewSubmissions] = useState(null);
  const [gradeData, setGradeData] = useState({});

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData([
        { id: 1, title: 'Physics Lab Report', subject: 'Physics', class: 'Class 10', teacher: 'Dr. Ahmad Khan', dueDate: '2025-08-15', submissions: 28, totalStudents: 35, status: 'Published' },
        { id: 2, title: 'Math Assignment 3', subject: 'Mathematics', class: 'Class 9', teacher: 'Prof. Sara Ali', dueDate: '2025-08-20', submissions: 22, totalStudents: 30, status: 'Published' },
        { id: 3, title: 'Chemistry Essay', subject: 'Chemistry', class: 'Class 11', teacher: 'Mr. Usman Malik', dueDate: '2025-08-25', submissions: 15, totalStudents: 25, status: 'Draft' },
        { id: 4, title: 'English Literature Review', subject: 'English', class: 'Class 8', teacher: 'Ms. Fatima Noor', dueDate: '2025-08-10', submissions: 32, totalStudents: 32, status: 'Closed' },
        { id: 5, title: 'CS Project Proposal', subject: 'Computer Science', class: 'BS CS', teacher: 'Dr. Hassan Raza', dueDate: '2025-09-01', submissions: 18, totalStudents: 20, status: 'Published' },
        { id: 6, title: 'Biology Diagram', subject: 'Biology', class: 'Class 10', teacher: 'Dr. Ahmad Khan', dueDate: '2025-08-18', submissions: 0, totalStudents: 35, status: 'Draft' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title || '', description: item.description || '',
      subject: item.subject || '', class: item.class || '',
      teacher: item.teacher || '', dueDate: item.dueDate || '',
      totalMarks: item.totalMarks || 100, passingMarks: item.passingMarks || 40,
      submissionType: item.submissionType || 'File', instructions: item.instructions || '',
      attachments: item.attachments || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.class || !formData.teacher || !formData.dueDate) {
      addNotification?.('Please fill all required fields', 'warning');
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.(editItem ? 'Assignment updated successfully' : 'Assignment created successfully', 'success');
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving assignment', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Assignment deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const getStatusBadge = (status) => {
    const map = { Draft: 'warning', Published: 'success', Closed: 'secondary' };
    return <span className={`badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`}>{status}</span>;
  };

  const mockSubmissions = [
    { id: 1, student: 'Ali Ahmed', rollNo: 'S-001', submittedAt: '2025-08-14 10:30', file: 'report.pdf', marks: null, status: 'pending' },
    { id: 2, student: 'Sara Khan', rollNo: 'S-002', submittedAt: '2025-08-14 11:00', file: 'report.docx', marks: 85, status: 'graded' },
    { id: 3, student: 'Usman Ali', rollNo: 'S-003', submittedAt: '2025-08-13 09:15', file: 'report.pdf', marks: null, status: 'pending' },
    { id: 4, student: 'Fatima Noor', rollNo: 'S-004', submittedAt: '2025-08-12 14:00', file: 'essay.pdf', marks: 92, status: 'graded' },
  ];

  const updateGrade = (submissionId, marks) => {
    setGradeData(prev => ({ ...prev, [submissionId]: { ...prev[submissionId], marks } }));
  };

  const saveGrade = async (submissionId) => {
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Grade saved successfully', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to save grade', 'danger');
    }
  };

  if (viewSubmissions) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setViewSubmissions(null)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Submissions: {viewSubmissions.title}</h5>
          <span className={`badge rounded-pill ${viewSubmissions.status === 'Published' ? 'bg-success' : 'bg-warning'}`}>{viewSubmissions.status}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="small text-muted">{mockSubmissions.filter(s => s.status === 'graded').length} / {mockSubmissions.length} Graded</span>
          <button className="btn btn-sm btn-primary rounded-pill"><FontAwesomeIcon icon={faDownload} className="me-1" /> Export</button>
        </div>

        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Student</th>
                  <th>Roll No</th>
                  <th>Submitted At</th>
                  <th>File</th>
                  <th>Marks</th>
                  <th>Feedback</th>
                  <th className="pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockSubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td className="ps-4"><span className="fw-semibold small">{sub.student}</span></td>
                    <td><code className="small">{sub.rollNo}</code></td>
                    <td className="small">{sub.submittedAt}</td>
                    <td><span className="badge bg-light text-dark rounded-pill"><FontAwesomeIcon icon={faPaperclip} className="me-1" />{sub.file}</span></td>
                    <td style={{ minWidth: '120px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <input type="number" className="form-control form-control-sm" style={{ width: '70px' }}
                          defaultValue={sub.marks || ''} placeholder="Marks"
                          onChange={e => updateGrade(sub.id, e.target.value)} />
                        <span className="x-small text-muted">/100</span>
                      </div>
                    </td>
                    <td>
                      <input type="text" className="form-control form-control-sm" placeholder="Feedback" style={{ minWidth: '120px' }} />
                    </td>
                    <td className="pe-4">
                      <button className="btn btn-sm btn-success rounded-3" onClick={() => saveGrade(sub.id)} disabled={sub.status === 'graded'}>
                        {sub.status === 'graded' ? 'Graded' : 'Save'}
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

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Assignments</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage assignments, submissions, and grading</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Assignment
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
                placeholder="Search assignments..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
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
              value={filters.teacher} onChange={e => setFilters({...filters, teacher: e.target.value})}>
              <option value="">All Teachers</option>
              {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-md-1">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.class} onChange={e => setFilters({...filters, class: e.target.value})}>
              <option value="">All Classes</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setFilters({ subject: '', teacher: '', class: '', status: '', dateFrom: '', dateTo: '' }); }}>
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
                <th className="ps-4">Title</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Teacher</th>
                <th>Due Date</th>
                <th>Submissions</th>
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
                    <FontAwesomeIcon icon={faBook} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No assignments found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Create a new assignment to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faBook} className="text-primary opacity-50" />
                      <span className="fw-semibold small">{item.title}</span>
                    </div>
                  </td>
                  <td className="small">{item.subject}</td>
                  <td className="small">{item.class}</td>
                  <td className="small">{item.teacher}</td>
                  <td className="small">{item.dueDate}</td>
                  <td>
                    <span className={`fw-semibold small ${item.submissions === item.totalStudents ? 'text-success' : item.submissions > 0 ? 'text-warning' : 'text-muted'}`}>
                      {item.submissions}/{item.totalStudents}
                    </span>
                    <div className="progress rounded-pill" style={{ height: '4px', width: '60px' }}>
                      <div className="progress-bar" style={{ width: `${(item.submissions / (item.totalStudents || 1)) * 100}%`, background: item.submissions === item.totalStudents ? '#10b981' : '#f59e0b' }}></div>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => setViewSubmissions(item)} title="View Submissions">
                      <FontAwesomeIcon icon={faEye} />
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
                <h5 className="fw-bold">{editItem ? 'Edit Assignment' : 'Add Assignment'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Title <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Assignment title" />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Assignment description" />
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
                      <label className="small fw-bold text-muted mb-2">Teacher <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3" required value={formData.teacher}
                        onChange={e => setFormData({...formData, teacher: e.target.value})}>
                        <option value="">Select Teacher</option>
                        {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Due Date <span className="text-danger">*</span></label>
                      <input type="date" className="form-control rounded-3" required value={formData.dueDate}
                        onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Total Marks</label>
                      <input type="number" className="form-control rounded-3" value={formData.totalMarks}
                        onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Passing Marks</label>
                      <input type="number" className="form-control rounded-3" value={formData.passingMarks}
                        onChange={e => setFormData({...formData, passingMarks: Number(e.target.value)})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Submission Type</label>
                      <select className="form-select rounded-3" value={formData.submissionType}
                        onChange={e => setFormData({...formData, submissionType: e.target.value})}>
                        {SUBMISSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Attachments</label>
                      <input type="file" className="form-control rounded-3" />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Instructions</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.instructions}
                        onChange={e => setFormData({...formData, instructions: e.target.value})}
                        placeholder="Instructions for students..." />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBook} className="me-2" />{editItem ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
