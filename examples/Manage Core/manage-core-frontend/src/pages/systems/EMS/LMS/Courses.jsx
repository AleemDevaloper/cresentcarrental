import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faCheckCircle, faClock, faUsers,
  faVideo, faFileAlt, faList, faTh, faGraduationCap,
  faUserGraduate, faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Technology', 'Science', 'Arts', 'Business', 'Language', 'Mathematics', 'Engineering'];
const INSTRUCTORS = ['Dr. Ahmad Khan', 'Prof. Sara Ali', 'Mr. Usman Malik', 'Ms. Fatima Noor', 'Dr. Hassan Raza'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const STATUSES = ['Draft', 'Published', 'Archived'];

const initialForm = {
  name: '', code: '', description: '', category: '', instructor: '',
  level: 'Beginner', duration: '', thumbnail: '', status: 'Draft',
};

const Courses = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '', level: '' });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLessons, setShowLessons] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', content: '', duration: '' });

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
        { id: 1, name: 'Introduction to AI', code: 'CS-AI-101', category: 'Technology', instructor: 'Dr. Ahmad Khan', lessons: 24, students: 340, status: 'Published', level: 'Beginner', duration: '12 weeks', thumbnail: '' },
        { id: 2, name: 'Web Development Bootcamp', code: 'CS-WD-201', category: 'Technology', instructor: 'Prof. Sara Ali', lessons: 36, students: 280, status: 'Published', level: 'Intermediate', duration: '16 weeks', thumbnail: '' },
        { id: 3, name: 'Data Science Fundamentals', code: 'CS-DS-301', category: 'Science', instructor: 'Mr. Usman Malik', lessons: 28, students: 250, status: 'Published', level: 'Intermediate', duration: '14 weeks', thumbnail: '' },
        { id: 4, name: 'English Communication', code: 'ENG-101', category: 'Language', instructor: 'Ms. Fatima Noor', lessons: 20, students: 220, status: 'Published', level: 'Beginner', duration: '8 weeks', thumbnail: '' },
        { id: 5, name: 'Digital Marketing 101', code: 'BUS-MKT-101', category: 'Business', instructor: 'Dr. Hassan Raza', lessons: 18, students: 190, status: 'Draft', level: 'Beginner', duration: '6 weeks', thumbnail: '' },
        { id: 6, name: 'Advanced Machine Learning', code: 'CS-ML-401', category: 'Technology', instructor: 'Dr. Ahmad Khan', lessons: 32, students: 120, status: 'Published', level: 'Advanced', duration: '16 weeks', thumbnail: '' },
        { id: 7, name: 'Creative Writing', code: 'ENG-201', category: 'Arts', instructor: 'Ms. Fatima Noor', lessons: 16, students: 150, status: 'Draft', level: 'Intermediate', duration: '8 weeks', thumbnail: '' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
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
      name: item.name || '', code: item.code || '', description: item.description || '',
      category: item.category || '', instructor: item.instructor || '',
      level: item.level || 'Beginner', duration: item.duration || '',
      thumbnail: item.thumbnail || '', status: item.status || 'Draft',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.category) {
      addNotification?.('Please fill all required fields', 'warning');
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.(editItem ? 'Course updated successfully' : 'Course created successfully', 'success');
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving course', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Course deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const addLesson = () => {
    if (!newLesson.title) return;
    setLessons([...lessons, { ...newLesson, id: Date.now() }]);
    setNewLesson({ title: '', content: '', duration: '' });
  };

  const removeLesson = (id) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const getStatusBadge = (status) => {
    const map = { Draft: 'warning', Published: 'success', Archived: 'secondary' };
    return <span className={`badge bg-${map[status]}-subtle text-${map[status]} rounded-pill`}>{status}</span>;
  };

  if (showLessons && selectedCourse) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowLessons(false)}>
            <FontAwesomeIcon icon={faList} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Lessons: {selectedCourse.name}</h5>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <input type="text" className="form-control form-control-sm" style={{ maxWidth: '250px' }}
                placeholder="Lesson title" value={newLesson.title}
                onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
              <input type="text" className="form-control form-control-sm" style={{ maxWidth: '80px' }}
                placeholder="Min" value={newLesson.duration}
                onChange={e => setNewLesson({...newLesson, duration: e.target.value})} />
              <button className="btn btn-sm btn-primary" onClick={addLesson}><FontAwesomeIcon icon={faPlus} className="me-1" /> Add</button>
            </div>
            {lessons.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FontAwesomeIcon icon={faFileAlt} className="fs-1 mb-3 opacity-50" />
                <p className="small">No lessons added yet</p>
              </div>
            ) : (
              lessons.map((lesson, idx) => (
                <div key={lesson.id} className="d-flex align-items-center gap-3 mb-2 p-3 rounded-3"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}>
                  <span className="badge bg-primary rounded-circle">{idx + 1}</span>
                  <div className="flex-grow-1">
                    <span className="fw-semibold small" style={{ color: textColor }}>{lesson.title}</span>
                    {lesson.duration && <span className="ms-2 x-small text-muted">({lesson.duration} min)</span>}
                  </div>
                  <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => removeLesson(lesson.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showEnrollments && selectedCourse) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowEnrollments(false)}>
            <FontAwesomeIcon icon={faList} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Enrollments: {selectedCourse.name}</h5>
          <span className="badge bg-primary rounded-pill">{selectedCourse.students} students</span>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Student</th>
                  <th>Email</th>
                  <th>Enrolled Date</th>
                  <th>Progress</th>
                  <th className="pe-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td className="ps-4 d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-primary opacity-50" />
                      <span className="fw-semibold small">Student {i}</span>
                    </td>
                    <td className="small">student{i}@example.com</td>
                    <td className="small">2025-0{i}-10</td>
                    <td style={{ minWidth: '120px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress rounded-pill flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar" style={{ width: `${i * 18}%`, background: i * 18 > 70 ? '#10b981' : '#6366f1' }}></div>
                        </div>
                        <span className="x-small fw-bold">{i * 18}%</span>
                      </div>
                    </td>
                    <td className="pe-4">
                      <span className={`badge rounded-pill ${i * 18 >= 100 ? 'bg-success' : 'bg-primary'}`}>
                        {i * 18 >= 100 ? 'Completed' : 'Active'}
                      </span>
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
          <h4 className="fw-bold mb-1">Courses</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage courses, lessons, and enrollments</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Course
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
                placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.level} onChange={e => setFilters({...filters, level: e.target.value})}>
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-outline-secondary rounded-3 flex-grow-1" onClick={() => { setSearch(''); setFilters({ category: '', status: '', level: '' }); }}>
              Reset
            </button>
            <div className="btn-group">
              <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('grid')}>
                <FontAwesomeIcon icon={faTh} />
              </button>
              <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('table')}>
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : viewMode === 'grid' ? (
        <div className="row g-4">
          {data.map(item => (
            <div key={item.id} className="col-xl-4 col-lg-6">
              <div className={`card border-0 shadow-sm rounded-4 h-100 overflow-hidden transition hover-lift ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <div className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center mx-auto" style={{ width: '64px', height: '64px' }}>
                    <FontAwesomeIcon icon={faBookOpen} className="fs-3 text-white" />
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: textColor }}>{item.name}</h6>
                      <code className="x-small">{item.code}</code>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="small text-muted mb-3">{item.instructor} · {item.level}</p>
                  <div className="d-flex justify-content-between small text-muted mb-3">
                    <span><FontAwesomeIcon icon={faFileAlt} className="me-1" />{item.lessons} lessons</span>
                    <span><FontAwesomeIcon icon={faUsers} className="me-1" />{item.students} students</span>
                    <span><FontAwesomeIcon icon={faClock} className="me-1" />{item.duration}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light border rounded-3 flex-grow-1" onClick={() => { setSelectedCourse(item); setShowLessons(true); }}>
                      <FontAwesomeIcon icon={faFileAlt} className="me-1" /> Lessons
                    </button>
                    <button className="btn btn-sm btn-light border rounded-3 flex-grow-1" onClick={() => { setSelectedCourse(item); setShowEnrollments(true); }}>
                      <FontAwesomeIcon icon={faUsers} className="me-1" /> Students
                    </button>
                    <button className="btn btn-sm btn-light border rounded-3" onClick={() => openEditForm(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-12 text-center py-5">
              <FontAwesomeIcon icon={faBookOpen} className="fs-1 text-muted opacity-50 mb-3" />
              <h6 className="fw-bold">No courses found</h6>
            </div>
          )}
        </div>
      ) : (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Course Name</th>
                  <th>Code</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faBookOpen} className="text-primary opacity-50" />
                        <span className="fw-semibold small">{item.name}</span>
                      </div>
                    </td>
                    <td><code>{item.code}</code></td>
                    <td className="small">{item.instructor}</td>
                    <td><span className="badge bg-light text-dark rounded-pill">{item.category}</span></td>
                    <td className="small">{item.lessons}</td>
                    <td className="small">{item.students}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => { setSelectedCourse(item); setShowLessons(true); }}>
                        <FontAwesomeIcon icon={faFileAlt} />
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
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Course' : 'Add Course'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="small fw-bold text-muted mb-2">Course Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Course name" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. CS-101" />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Course description" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Category <span className="text-danger">*</span></label>
                      <select className="form-select rounded-3" required value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Instructor</label>
                      <select className="form-select rounded-3" value={formData.instructor}
                        onChange={e => setFormData({...formData, instructor: e.target.value})}>
                        <option value="">Select Instructor</option>
                        {INSTRUCTORS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Level</label>
                      <select className="form-select rounded-3" value={formData.level}
                        onChange={e => setFormData({...formData, level: e.target.value})}>
                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Duration</label>
                      <input type="text" className="form-control rounded-3" value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 12 weeks" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Thumbnail</label>
                      <input type="file" className="form-control rounded-3" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />{editItem ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; } .transition { transition: all 0.3s ease; } .hover-lift:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }`}</style>
    </div>
  );
};

export default Courses;
