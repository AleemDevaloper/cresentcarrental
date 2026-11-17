import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faChalkboardTeacher,
  faLayerGroup, faClock, faUsers,
  faUserCheck, faMinus, faPlus as faPlusIcon,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';

const Subjects = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showMapping, setShowMapping] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', course_id: '', credits: '',
    theory_hours: '', practical_hours: '', lab_hours: '',
    department_id: '', teacher_id: '',
    prerequisites: '', min_students: '', max_students: '', status: 'active',
  });

  const mockDepartments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Mathematics' },
    { id: 3, name: 'Physics' },
  ];

  const mockCourses = [
    { id: 1, name: 'B.Sc. Computer Science' },
    { id: 2, name: 'B.Sc. Mathematics' },
    { id: 3, name: 'B.Sc. Physics' },
  ];

  const mockTeachers = [
    { id: 1, name: 'Dr. Usman Malik' },
    { id: 2, name: 'Prof. Sara Khan' },
    { id: 3, name: 'Dr. Ali Ahmed' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 300));
      setData([
        { id: 1, name: 'Data Structures', code: 'CS-201', course_id: 1, credits: 3, theory_hours: 2, practical_hours: 2, lab_hours: 1, department_id: 1, teacher_id: 1, prerequisites: 'Programming Fundamentals', min_students: 10, max_students: 40, status: 'active' },
        { id: 2, name: 'Calculus I', code: 'MATH-101', course_id: 2, credits: 4, theory_hours: 3, practical_hours: 1, lab_hours: 0, department_id: 2, teacher_id: 2, prerequisites: 'None', min_students: 5, max_students: 50, status: 'active' },
        { id: 3, name: 'Quantum Physics', code: 'PHY-301', course_id: 3, credits: 3, theory_hours: 2, practical_hours: 1, lab_hours: 2, department_id: 3, teacher_id: 3, prerequisites: 'Classical Physics', min_students: 5, max_students: 30, status: 'inactive' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load subjects');
      addNotification?.(err.message || 'Failed to load subjects', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, courseFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDepartmentName = (id) => {
    const d = mockDepartments.find(x => x.id === id);
    return d ? d.name : 'Unknown';
  };

  const getCourseName = (id) => {
    const c = mockCourses.find(x => x.id === id);
    return c ? c.name : 'Unknown';
  };

  const getTeacherName = (id) => {
    const t = mockTeachers.find(x => x.id === id);
    return t ? t.name : 'Unknown';
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', code: '', course_id: '', credits: '',
      theory_hours: '', practical_hours: '', lab_hours: '',
      department_id: '', teacher_id: '',
      prerequisites: '', min_students: '', max_students: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      course_id: item.course_id || '',
      credits: item.credits ?? '',
      theory_hours: item.theory_hours ?? '',
      practical_hours: item.practical_hours ?? '',
      lab_hours: item.lab_hours ?? '',
      department_id: item.department_id || '',
      teacher_id: item.teacher_id || '',
      prerequisites: item.prerequisites || '',
      min_students: item.min_students ?? '',
      max_students: item.max_students ?? '',
      status: item.status || 'active',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      addNotification?.('Name and Code are required', 'warning');
      return;
    }
    try {
      addNotification?.((editItem ? 'Subject updated' : 'Subject created') + ' successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving subject', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    try {
      addNotification?.('Subject deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const filtered = data.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || item.department_id === Number(deptFilter);
    const matchCourse = !courseFilter || item.course_id === Number(courseFilter);
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchDept && matchCourse && matchStatus;
  });

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Subjects</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage subjects, credit hours, and teacher mappings</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Subject
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search subjects..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
              <option value="">All Courses</option>
              {mockCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100"
              onClick={() => { setSearch(''); setDeptFilter(''); setCourseFilter(''); setStatusFilter(''); }}>
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

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Subject Name</th>
                <th>Code</th>
                <th>Course</th>
                <th>Credits</th>
                <th>Theory</th>
                <th>Practical</th>
                <th>Department</th>
                <th>Teacher</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                    <FontAwesomeIcon icon={faBook} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No subjects found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new subject to get started</p>
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faBook} className="text-primary opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td className="small">{getCourseName(item.course_id)}</td>
                  <td className="small fw-semibold">{item.credits}</td>
                  <td className="small">{item.theory_hours}h</td>
                  <td className="small">{item.practical_hours}h</td>
                  <td className="small">{getDepartmentName(item.department_id)}</td>
                  <td className="small">
                    <span className="d-flex align-items-center gap-1">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-muted" style={{ fontSize: '10px' }} />
                      {getTeacherName(item.teacher_id)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-info border rounded-3 me-1 text-white" onClick={() => setShowMapping(item)} title="Teacher Mapping">
                      <FontAwesomeIcon icon={faUserCheck} />
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

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Subject' : 'Add Subject'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Subject Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Data Structures" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. CS-201" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Course</label>
                      <select className="form-select rounded-3" value={formData.course_id}
                        onChange={e => setFormData({...formData, course_id: e.target.value})}>
                        <option value="">Select Course</option>
                        {mockCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Department</label>
                      <select className="form-select rounded-3" value={formData.department_id}
                        onChange={e => setFormData({...formData, department_id: e.target.value})}>
                        <option value="">Select Department</option>
                        {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Credits</label>
                      <input type="number" className="form-control rounded-3" value={formData.credits}
                        onChange={e => setFormData({...formData, credits: e.target.value})} placeholder="3" min="0" step="0.5" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Theory Hours</label>
                      <input type="number" className="form-control rounded-3" value={formData.theory_hours}
                        onChange={e => setFormData({...formData, theory_hours: e.target.value})} placeholder="2" min="0" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Practical Hours</label>
                      <input type="number" className="form-control rounded-3" value={formData.practical_hours}
                        onChange={e => setFormData({...formData, practical_hours: e.target.value})} placeholder="2" min="0" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Lab Hours</label>
                      <input type="number" className="form-control rounded-3" value={formData.lab_hours}
                        onChange={e => setFormData({...formData, lab_hours: e.target.value})} placeholder="1" min="0" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Teacher</label>
                      <select className="form-select rounded-3" value={formData.teacher_id}
                        onChange={e => setFormData({...formData, teacher_id: e.target.value})}>
                        <option value="">Select Teacher</option>
                        {mockTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Prerequisites</label>
                      <input type="text" className="form-control rounded-3" value={formData.prerequisites}
                        onChange={e => setFormData({...formData, prerequisites: e.target.value})} placeholder="e.g. Programming Fundamentals" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Min Students</label>
                      <input type="number" className="form-control rounded-3" value={formData.min_students}
                        onChange={e => setFormData({...formData, min_students: e.target.value})} placeholder="5" min="1" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Max Students</label>
                      <input type="number" className="form-control rounded-3" value={formData.max_students}
                        onChange={e => setFormData({...formData, max_students: e.target.value})} placeholder="40" min="1" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBook} className="me-2" />{editItem ? 'Update Subject' : 'Save Subject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showMapping && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faUserCheck} className="me-2 text-primary" />Teacher Mapping - {showMapping.name}</h5>
                <button className="btn-close" onClick={() => setShowMapping(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">Assign Teacher</label>
                  <select className="form-select rounded-3">
                    <option value="">Select Teacher</option>
                    <option value="1">Dr. Usman Malik (Computer Science)</option>
                    <option value="2">Prof. Sara Khan (Mathematics)</option>
                    <option value="3">Dr. Ali Ahmed (Physics)</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-primary" />
                  <span className="small">Current: {getTeacherName(showMapping.teacher_id)}</span>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowMapping(null)}>Cancel</button>
                <button className="btn btn-primary rounded-3 px-4" onClick={() => { addNotification?.('Teacher mapping updated', 'success'); setShowMapping(null); }}>
                  <FontAwesomeIcon icon={faUserCheck} className="me-2" />Update Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default Subjects;
