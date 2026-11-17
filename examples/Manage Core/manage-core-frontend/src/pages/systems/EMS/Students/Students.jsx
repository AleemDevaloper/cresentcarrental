import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUpload, faDownload, faFilter,
  faEnvelope, faPhone, faMapMarkerAlt, faCity, faGlobe,
  faUser, faTransgender, faCalendar, faDroplet, faFlag,
  faBuilding, faLayerGroup, faBookOpen, faChalkboardTeacher,
  faUsers, faVenus, faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listStudents, createStudent, updateStudent, deleteStudent,
} from '../../../../api/ems';

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['active', 'inactive', 'graduated', 'suspended'];
const CLASSES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const Students = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    institution: '', campus: '', department: '', program: '',
    academic_year: '', status: '', gender: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', date_of_birth: '', gender: 'Male',
    blood_group: '', nationality: '', mobile: '', email: '',
    address: '', city: '', institution_id: '', campus_id: '',
    department_id: '', program_id: '', class: '', section: '',
    academic_year_id: '', semester_id: '',
    father_name: '', mother_name: '', guardian_name: '', guardian_phone: '', guardian_email: '',
    status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const data = await listStudents(params);
      setData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load students');
      addNotification?.(err.message || 'Failed to load students', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, filters, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      first_name: '', last_name: '', date_of_birth: '', gender: 'Male',
      blood_group: '', nationality: '', mobile: '', email: '',
      address: '', city: '', institution_id: '', campus_id: '',
      department_id: '', program_id: '', class: '', section: '',
      academic_year_id: '', semester_id: '',
      father_name: '', mother_name: '', guardian_name: '', guardian_phone: '', guardian_email: '',
      status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      first_name: item.first_name || '', last_name: item.last_name || '',
      date_of_birth: item.date_of_birth || '', gender: item.gender || 'Male',
      blood_group: item.blood_group || '', nationality: item.nationality || '',
      mobile: item.mobile || '', email: item.email || '',
      address: item.address || '', city: item.city || '',
      institution_id: item.institution_id || '', campus_id: item.campus_id || '',
      department_id: item.department_id || '', program_id: item.program_id || '',
      class: item.class || '', section: item.section || '',
      academic_year_id: item.academic_year_id || '', semester_id: item.semester_id || '',
      father_name: item.father_name || '', mother_name: item.mother_name || '',
      guardian_name: item.guardian_name || '', guardian_phone: item.guardian_phone || '',
      guardian_email: item.guardian_email || '', status: item.status || 'active',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      addNotification?.('First name and Last name are required', 'warning');
      return;
    }
    try {
      if (editItem) await updateStudent(editItem.id, formData);
      else await createStudent(formData);
      addNotification?.(editItem ? 'Student updated successfully' : 'Student created successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving student', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    try {
      await deleteStudent(id);
      addNotification?.('Student deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const handleBulkImport = () => {
    addNotification?.('Bulk import feature - upload CSV file', 'info');
  };

  const handleExport = () => {
    addNotification?.('Exporting student data...', 'info');
  };

  return (
    <div className={`ems-root p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Students</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage student records</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary rounded-3" onClick={handleBulkImport}>
            <FontAwesomeIcon icon={faUpload} className="me-2" />Bulk Import
          </button>
          <button className="btn btn-outline-success rounded-3" onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} className="me-2" />Export
          </button>
          <button className="btn premium-btn-primary" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add Student
          </button>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 premium-input ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by name or ID..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {Object.entries({
            institution: 'Institution', campus: 'Campus', department: 'Department',
            program: 'Program', academic_year: 'Academic Year', status: 'Status', gender: 'Gender',
          }).map(([key, label]) => (
            <div className="col" key={key} style={{ minWidth: '120px' }}>
              <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                value={filters[key]} onChange={e => setFilters({...filters, [key]: e.target.value})}>
                <option value="">All {label}</option>
                {key === 'status' && STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                {key === 'gender' && GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          ))}
          <div className="col-auto">
            <button className="btn btn-outline-secondary rounded-3 h-100" onClick={() => { setSearch(''); setFilters({institution: '', campus: '', department: '', program: '', academic_year: '', status: '', gender: ''}); }}>
              <FontAwesomeIcon icon={faRotate} />
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
                <th className="ps-4">Photo</th>
                <th>Name</th>
                <th>ID</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Department</th>
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
                    <FontAwesomeIcon icon={faUserGraduate} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No students found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new student to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                      {item.first_name?.charAt(0)}{item.last_name?.charAt(0)}
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold small">{item.first_name} {item.last_name}</div>
                  </td>
                  <td><code>{item.student_id || `STU-${String(item.id).padStart(4, '0')}`}</code></td>
                  <td className="small">{item.roll_no || '-'}</td>
                  <td className="small">{item.class || '-'}</td>
                  <td className="small">{item.department_name || '-'}</td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : item.status === 'graduated' ? 'info' : item.status === 'suspended' ? 'danger' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : item.status === 'graduated' ? 'info' : item.status === 'suspended' ? 'danger' : 'secondary'}`}>
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
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Student' : 'Add Student'}</h5>
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
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faTransgender} /></span>
                        <select className="form-select rounded-end-3" value={formData.gender}
                          onChange={e => setFormData({...formData, gender: e.target.value})}>
                          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Blood Group</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faDroplet} /></span>
                        <select className="form-select rounded-end-3" value={formData.blood_group}
                          onChange={e => setFormData({...formData, blood_group: e.target.value})}>
                          <option value="">Select</option>
                          {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Nationality</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faFlag} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.nationality}
                          onChange={e => setFormData({...formData, nationality: e.target.value})} placeholder="American" />
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 text-success"><FontAwesomeIcon icon={faEnvelope} className="me-2" />Contact Info</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Mobile</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faPhone} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.mobile}
                          onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="+1 (555) 000-0000" />
                      </div>
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
                      <label className="small fw-bold text-muted mb-2">City</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faCity} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})} placeholder="New York" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main Street" />
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 text-warning"><FontAwesomeIcon icon={faBookOpen} className="me-2" />Academic Info</h6>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Institution</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBuilding} /></span>
                        <select className="form-select rounded-end-3" value={formData.institution_id}
                          onChange={e => setFormData({...formData, institution_id: e.target.value})}>
                          <option value="">Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Campus</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBuilding} /></span>
                        <select className="form-select rounded-end-3" value={formData.campus_id}
                          onChange={e => setFormData({...formData, campus_id: e.target.value})}>
                          <option value="">Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Department</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faLayerGroup} /></span>
                        <select className="form-select rounded-end-3" value={formData.department_id}
                          onChange={e => setFormData({...formData, department_id: e.target.value})}>
                          <option value="">Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Program</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBookOpen} /></span>
                        <select className="form-select rounded-end-3" value={formData.program_id}
                          onChange={e => setFormData({...formData, program_id: e.target.value})}>
                          <option value="">Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Class</label>
                      <select className="form-select rounded-3" value={formData.class}
                        onChange={e => setFormData({...formData, class: e.target.value})}>
                        <option value="">Select</option>
                        {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Section</label>
                      <input type="text" className="form-control rounded-3" value={formData.section}
                        onChange={e => setFormData({...formData, section: e.target.value})} placeholder="A" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Academic Year</label>
                      <select className="form-select rounded-3" value={formData.academic_year_id}
                        onChange={e => setFormData({...formData, academic_year_id: e.target.value})}>
                        <option value="">Select</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Semester</label>
                      <select className="form-select rounded-3" value={formData.semester_id}
                        onChange={e => setFormData({...formData, semester_id: e.target.value})}>
                        <option value="">Select</option>
                      </select>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-3 text-info"><FontAwesomeIcon icon={faUsers} className="me-2" />Guardian Info</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Father's Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.father_name}
                        onChange={e => setFormData({...formData, father_name: e.target.value})} placeholder="Robert Doe" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Mother's Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.mother_name}
                        onChange={e => setFormData({...formData, mother_name: e.target.value})} placeholder="Jane Doe" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Guardian Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.guardian_name}
                        onChange={e => setFormData({...formData, guardian_name: e.target.value})} placeholder="Guardian" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Guardian Phone</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faPhone} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.guardian_phone}
                          onChange={e => setFormData({...formData, guardian_phone: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Guardian Email</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control rounded-end-3" value={formData.guardian_email}
                          onChange={e => setFormData({...formData, guardian_email: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faUserGraduate} className="me-2" />{editItem ? 'Update Student' : 'Save Student'}
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

export default Students;
