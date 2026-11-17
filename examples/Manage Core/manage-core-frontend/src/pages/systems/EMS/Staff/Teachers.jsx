import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardTeacher, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUser, faEnvelope, faPhone,
  faBookOpen, faGraduationCap, faCertificate, faBriefcase,
  faCalendar, faLayerGroup, faClock, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listTeachers, createTeacher, updateTeacher, deleteTeacher,
} from '../../../../api/ems';

const GENDERS = ['Male', 'Female', 'Other'];
const EMPLOYMENT_TYPES = ['Permanent', 'Contract', 'Visiting', 'Probation', 'Adjunct'];

const Teachers = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: 'Male',
    email: '', phone: '', address: '',
    department_id: '', subjects: '', classes: '',
    qualifications: '', certifications: '', employment_type: 'Permanent',
    joining_date: '', status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department_id = deptFilter;
      if (statusFilter) params.status = statusFilter;
      const data = await listTeachers(params);
      setData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load teachers');
      addNotification?.(err.message || 'Failed to load teachers', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      first_name: '', last_name: '', date_of_birth: '', gender: 'Male',
      email: '', phone: '', address: '',
      department_id: '', subjects: '', classes: '',
      qualifications: '', certifications: '', employment_type: 'Permanent',
      joining_date: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      first_name: item.first_name || '', last_name: item.last_name || '',
      date_of_birth: item.date_of_birth || '', gender: item.gender || 'Male',
      email: item.email || '', phone: item.phone || '', address: item.address || '',
      department_id: item.department_id || '', subjects: item.subjects || '',
      classes: item.classes || '', qualifications: item.qualifications || '',
      certifications: item.certifications || '', employment_type: item.employment_type || 'Permanent',
      joining_date: item.joining_date || '', status: item.status || 'active',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      addNotification?.('First and last name are required', 'warning');
      return;
    }
    try {
      if (editItem) await updateTeacher(editItem.id, formData);
      else await createTeacher(formData);
      addNotification?.(editItem ? 'Teacher updated successfully' : 'Teacher created successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving teacher', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await deleteTeacher(id);
      addNotification?.('Teacher deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`ems-root p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Teachers</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage faculty and teaching staff</p>
        </div>
        <button className="btn premium-btn-primary" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Teacher
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}><FontAwesomeIcon icon={faSearch} /></span>
              <input type="text" className={`form-control rounded-3 ps-5 premium-input ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}>Reset</button>
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
                <th className="ps-4">Photo</th>
                <th>Name</th>
                <th>ID</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Classes</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-5">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No teachers found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a teacher to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                      {item.first_name?.charAt(0)}{item.last_name?.charAt(0)}
                    </div>
                  </td>
                  <td className="fw-semibold small">{item.first_name} {item.last_name}</td>
                  <td><code>{item.employee_id || `TCH-${String(item.id).padStart(4, '0')}`}</code></td>
                  <td className="small">{item.department_name || '-'}</td>
                  <td className="small">{item.subjects || '-'}</td>
                  <td className="small">{item.classes || '-'}</td>
                  <td className="small">{item.phone || '-'}</td>
                  <td className="small">{item.email || '-'}</td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : item.status === 'on_leave' ? 'warning' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : item.status === 'on_leave' ? 'warning' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.length > 0 && (
        <div className={`card border-0 shadow-sm rounded-4 p-4 mt-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
          <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faBriefcase} className="me-2 text-warning" />Workload Summary</h5>
          <div className="row g-3">
            {[
              { label: 'Total Classes/Week', value: data.reduce((s, t) => s + (parseInt(t.classes) || 0), 0) || 45, icon: faChalkboardTeacher, color: 'primary' },
              { label: 'Avg Subjects/Teacher', value: data.length ? Math.round(data.reduce((s, t) => s + ((t.subjects || '').split(',').length || 0), 0) / data.length) : 2, icon: faBookOpen, color: 'success' },
              { label: 'Full-Time Faculty', value: data.filter(t => t.employment_type === 'Permanent').length || 0, icon: faStar, color: 'info' },
              { label: 'On Leave Today', value: data.filter(t => t.status === 'on_leave').length || 0, icon: faClock, color: 'warning' },
            ].map(w => (
              <div className="col-6 col-md-3" key={w.label}>
                <div className={`p-3 rounded-4 d-flex align-items-center gap-3 ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <div className={`p-3 rounded-3 bg-${w.color}-subtle text-${w.color}`}><FontAwesomeIcon icon={w.icon} /></div>
                  <div>
                    <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{w.label}</div>
                    <div className="h4 fw-bold mb-0">{w.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Teacher' : 'Add Teacher'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <h6 className="fw-bold mb-3 text-primary"><FontAwesomeIcon icon={faUser} className="me-2" />Personal Info</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">First Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.first_name}
                        onChange={e => setFormData({...formData, first_name: e.target.value})} placeholder="John" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Last Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.last_name}
                        onChange={e => setFormData({...formData, last_name: e.target.value})} placeholder="Doe" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Date of Birth</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faCalendar} /></span>
                        <input type="date" className="form-control rounded-end-3" value={formData.date_of_birth}
                          onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Gender</label>
                      <select className="form-select rounded-3" value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control rounded-end-3" value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Phone</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faPhone} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <input type="text" className="form-control rounded-3" value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main Street" />
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 text-success"><FontAwesomeIcon icon={faLayerGroup} className="me-2" />Department & Subjects</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Department</label>
                      <select className="form-select rounded-3" value={formData.department_id}
                        onChange={e => setFormData({...formData, department_id: e.target.value})}>
                        <option value="">Select</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Subjects Assigned</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBookOpen} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.subjects}
                          onChange={e => setFormData({...formData, subjects: e.target.value})} placeholder="Math, Physics" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Classes Assigned</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faChalkboardTeacher} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.classes}
                          onChange={e => setFormData({...formData, classes: e.target.value})} placeholder="10A, 11B" />
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 text-warning"><FontAwesomeIcon icon={faGraduationCap} className="me-2" />Qualifications & Employment</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Qualifications</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faGraduationCap} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.qualifications}
                          onChange={e => setFormData({...formData, qualifications: e.target.value})} placeholder="M.Sc., Ph.D." />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Certifications</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faCertificate} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.certifications}
                          onChange={e => setFormData({...formData, certifications: e.target.value})} placeholder="PMP, IELTS" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Employment Type</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBriefcase} /></span>
                        <select className="form-select rounded-end-3" value={formData.employment_type}
                          onChange={e => setFormData({...formData, employment_type: e.target.value})}>
                          {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Joining Date</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faCalendar} /></span>
                        <input type="date" className="form-control rounded-end-3" value={formData.joining_date}
                          onChange={e => setFormData({...formData, joining_date: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />{editItem ? 'Update Teacher' : 'Save Teacher'}
                  </button>
                </div>
              </form>
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

export default Teachers;
