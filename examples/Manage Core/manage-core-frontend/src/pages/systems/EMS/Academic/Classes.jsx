import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUser, faUsers,
  faSchool, faLayerGroup, faGraduationCap,
  faChalkboardTeacher, faEye, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listDepartments, listPrograms, listAcademicYears,
} from '../../../../api/ems';

const STATUSES = ['active', 'inactive'];

const Classes = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [instFilter, setInstFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [progFilter, setProgFilter] = useState('');
  const [acYearFilter, setAcYearFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showStudents, setShowStudents] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', program_id: '', department_id: '',
    class_teacher: '', capacity: '', room: '', status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department_id = deptFilter;
      if (progFilter) params.program_id = progFilter;
      const [clsRes, deptRes, progRes, ayRes] = await Promise.all([
        Promise.resolve([]),
        listDepartments(),
        listPrograms(),
        listAcademicYears(),
      ]);
      setData(Array.isArray(clsRes) ? clsRes : []);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
      setPrograms(Array.isArray(progRes) ? progRes : []);
      setAcademicYears(Array.isArray(ayRes) ? ayRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      addNotification?.(err.message || 'Failed to load classes', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, progFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDepartmentName = (id) => {
    const d = departments.find(x => x.id === id);
    return d ? d.name : 'Unknown';
  };

  const getProgramName = (id) => {
    const p = programs.find(x => x.id === id);
    return p ? p.name : 'Unknown';
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', code: '', program_id: '', department_id: '',
      class_teacher: '', capacity: '', room: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      program_id: item.program_id || '',
      department_id: item.department_id || '',
      class_teacher: item.class_teacher || '',
      capacity: item.capacity ?? '',
      room: item.room || '',
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
      if (editItem) {
        addNotification?.('Class updated successfully', 'success');
      } else {
        addNotification?.('Class created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving class', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      addNotification?.('Class deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const studentList = [
    { id: 1, name: 'Ali Ahmed', roll: 'CS-001', status: 'active' },
    { id: 2, name: 'Sara Khan', roll: 'CS-002', status: 'active' },
    { id: 3, name: 'Usman Ali', roll: 'CS-003', status: 'active' },
    { id: 4, name: 'Fatima Zahra', roll: 'CS-004', status: 'active' },
    { id: 5, name: 'Hassan Raza', roll: 'CS-005', status: 'active' },
  ];

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Classes</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage classes, sections, and student grouping</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Class
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
                placeholder="Search classes..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={deptFilter} onChange={e => { setDeptFilter(e.target.value); }}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={progFilter} onChange={e => setProgFilter(e.target.value)}>
              <option value="">All Programs</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={acYearFilter} onChange={e => setAcYearFilter(e.target.value)}>
              <option value="">All Years</option>
              {academicYears.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
            </select>
          </div>
          <div className="col-md-2 d-flex gap-1">
            <button className="btn btn-primary rounded-3 w-100" onClick={fetchData}>
              <FontAwesomeIcon icon={faSearch} className="me-1" /> Search
            </button>
            <button className="btn btn-outline-secondary rounded-3"
              onClick={() => { setSearch(''); setDeptFilter(''); setProgFilter(''); setAcYearFilter(''); }}>
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
                <th className="ps-4">Class Name</th>
                <th>Code</th>
                <th>Program</th>
                <th>Department</th>
                <th>Class Teacher</th>
                <th>Capacity</th>
                <th>Students</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <FontAwesomeIcon icon={faDoorOpen} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No classes found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new class to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faDoorOpen} className="text-info opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td className="small">{getProgramName(item.program_id)}</td>
                  <td className="small">{getDepartmentName(item.department_id)}</td>
                  <td className="small">
                    {item.class_teacher ? <span><FontAwesomeIcon icon={faChalkboardTeacher} className="me-1 text-muted" />{item.class_teacher}</span> : '-'}
                  </td>
                  <td className="small">{item.capacity ?? '-'}</td>
                  <td className="small">
                    <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => setShowStudents(item)}>
                      <FontAwesomeIcon icon={faUsers} className="me-1 text-primary" /> View
                    </button>
                  </td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
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
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Class' : 'Add Class'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Class Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Grade 10-A" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. 10-A" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Program</label>
                      <select className="form-select rounded-3" value={formData.program_id}
                        onChange={e => setFormData({...formData, program_id: e.target.value})}>
                        <option value="">Select Program</option>
                        {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Department</label>
                      <select className="form-select rounded-3" value={formData.department_id}
                        onChange={e => setFormData({...formData, department_id: e.target.value})}>
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Class Teacher</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faChalkboardTeacher} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.class_teacher}
                          onChange={e => setFormData({...formData, class_teacher: e.target.value})} placeholder="Mr. John Smith" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Capacity</label>
                      <input type="number" className="form-control rounded-3" value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 40" min="1" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">Room</label>
                      <input type="text" className="form-control rounded-3" value={formData.room}
                        onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g. Room 201" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faDoorOpen} className="me-2" />{editItem ? 'Update Class' : 'Save Class'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showStudents && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />Students - {showStudents.name}</h5>
                <button className="btn-close" onClick={() => setShowStudents(null)} />
              </div>
              <div className="modal-body p-4">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="small text-uppercase text-muted">
                        <th>#</th>
                        <th>Name</th>
                        <th>Roll No</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map((s, idx) => (
                        <tr key={s.id}>
                          <td className="small">{idx + 1}</td>
                          <td className="fw-semibold small">{s.name}</td>
                          <td><code>{s.roll}</code></td>
                          <td>
                            <span className={`badge rounded-pill bg-${s.status === 'active' ? 'success' : 'secondary'}-subtle text-${s.status === 'active' ? 'success' : 'secondary'}`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowStudents(null)}>
                  <FontAwesomeIcon icon={faTimes} className="me-2" />Close
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

export default Classes;
