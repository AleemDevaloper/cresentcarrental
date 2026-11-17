import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faClock, faLayerGroup,
  faUser, faList, faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';

const COURSE_TYPES = ['Theory', 'Practical', 'Lab', 'Workshop', 'Seminar'];

const Courses = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSubjects, setShowSubjects] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', type: 'Theory', credits: '', duration: '',
    department_id: '', coordinator: '', description: '',
    learning_outcomes: '', status: 'active',
  });

  const mockDepartments = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Mathematics' },
    { id: 3, name: 'Physics' },
    { id: 4, name: 'English' },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 300));
      setData([
        { id: 1, name: 'B.Sc. Computer Science', code: 'BSC-CS', type: 'Theory', credits: 120, duration: 4, department_id: 1, coordinator: 'Dr. Usman Malik', description: 'Comprehensive computer science program', status: 'active' },
        { id: 2, name: 'B.Sc. Mathematics', code: 'BSC-MATH', type: 'Theory', credits: 110, duration: 4, department_id: 2, coordinator: 'Prof. Sara Khan', description: 'Pure and applied mathematics', status: 'active' },
        { id: 3, name: 'Physics Lab', code: 'PHY-LAB', type: 'Lab', credits: 2, duration: 1, department_id: 3, coordinator: 'Dr. Ali Ahmed', description: 'Experimental physics lab course', status: 'active' },
        { id: 4, name: 'Creative Writing Workshop', code: 'ENG-WS', type: 'Workshop', credits: 1, duration: 1, department_id: 4, coordinator: 'Ms. Fatima', description: 'Writing skills workshop', status: 'inactive' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
      addNotification?.(err.message || 'Failed to load courses', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, typeFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDepartmentName = (id) => {
    const d = mockDepartments.find(x => x.id === id);
    return d ? d.name : 'Unknown';
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', code: '', type: 'Theory', credits: '', duration: '',
      department_id: '', coordinator: '', description: '',
      learning_outcomes: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      type: item.type || 'Theory',
      credits: item.credits ?? '',
      duration: item.duration ?? '',
      department_id: item.department_id || '',
      coordinator: item.coordinator || '',
      description: item.description || '',
      learning_outcomes: item.learning_outcomes || '',
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
      addNotification?.((editItem ? 'Course updated' : 'Course created') + ' successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving course', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      addNotification?.('Course deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const filtered = data.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || item.department_id === Number(deptFilter);
    const matchType = !typeFilter || item.type === typeFilter;
    const matchStatus = !statusFilter || item.status === statusFilter;
    return matchSearch && matchDept && matchType && matchStatus;
  });

  const mockSubjects = [
    { id: 1, name: 'Data Structures', code: 'CS-201', credits: 3 },
    { id: 2, name: 'Algorithms', code: 'CS-202', credits: 3 },
    { id: 3, name: 'Database Systems', code: 'CS-301', credits: 4 },
    { id: 4, name: 'Operating Systems', code: 'CS-302', credits: 3 },
  ];

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Courses</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage academic courses, types, and subject mappings</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Course
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
                placeholder="Search courses..." value={search}
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
              value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
              onClick={() => { setSearch(''); setDeptFilter(''); setTypeFilter(''); setStatusFilter(''); }}>
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
                <th className="ps-4">Course Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Credits</th>
                <th>Duration</th>
                <th>Department</th>
                <th>Coordinator</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <FontAwesomeIcon icon={faBookOpen} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No courses found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new course to get started</p>
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faBookOpen} className="text-warning opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td><span className="badge bg-info-subtle text-info rounded-pill">{item.type}</span></td>
                  <td className="small fw-semibold">{item.credits}</td>
                  <td className="small">{item.duration ? `${item.duration} yr${item.duration > 1 ? 's' : ''}` : '-'}</td>
                  <td className="small">{getDepartmentName(item.department_id)}</td>
                  <td className="small">
                    {item.coordinator ? <span><FontAwesomeIcon icon={faUser} className="me-1 text-muted" />{item.coordinator}</span> : '-'}
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-info border rounded-3 me-1 text-white" onClick={() => setShowSubjects(item)} title="View Subjects">
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

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Course' : 'Add Course'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Course Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. B.Sc. Computer Science" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. BSC-CS" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Type</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Credits</label>
                      <input type="number" className="form-control rounded-3" value={formData.credits}
                        onChange={e => setFormData({...formData, credits: e.target.value})} placeholder="e.g. 120" min="0" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Duration (Years)</label>
                      <input type="number" className="form-control rounded-3" value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 4" min="1" max="10" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Department</label>
                      <select className="form-select rounded-3" value={formData.department_id}
                        onChange={e => setFormData({...formData, department_id: e.target.value})}>
                        <option value="">Select Department</option>
                        {mockDepartments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Coordinator</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faUser} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.coordinator}
                          onChange={e => setFormData({...formData, coordinator: e.target.value})} placeholder="Dr. John Smith" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="2" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Course description..." />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Learning Outcomes</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.learning_outcomes}
                        onChange={e => setFormData({...formData, learning_outcomes: e.target.value})}
                        placeholder="List the key learning outcomes..." />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />{editItem ? 'Update Course' : 'Save Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showSubjects && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faList} className="me-2 text-warning" />Subjects - {showSubjects.name}</h5>
                <button className="btn-close" onClick={() => setShowSubjects(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="small text-uppercase text-muted">
                        <th>#</th>
                        <th>Subject</th>
                        <th>Code</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSubjects.map((s, idx) => (
                        <tr key={s.id}>
                          <td className="small">{idx + 1}</td>
                          <td className="fw-semibold small">{s.name}</td>
                          <td><code>{s.code}</code></td>
                          <td className="small">{s.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowSubjects(null)}>Close</button>
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

export default Courses;
