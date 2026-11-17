import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faClock, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listPrograms, createProgram, updateProgram, deleteProgram,
  listDepartments
} from '../../../../api/ems';

const DEGREE_TYPES = ['Associate', 'Bachelor', 'Master', 'Doctorate', 'Diploma', 'Certificate', 'Other'];

const Programs = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', degree_type: 'Bachelor', duration: '', credits: '',
    department_id: '', coordinator: '', status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department_id = deptFilter;
      if (statusFilter) params.status = statusFilter;
      const [progRes, deptRes] = await Promise.all([
        listPrograms(params),
        listDepartments()
      ]);
      setData(Array.isArray(progRes) ? progRes : []);
      setDepartments(Array.isArray(deptRes) ? deptRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load programs');
      addNotification?.(err.message || 'Failed to load programs', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDepartmentName = (id) => {
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : 'Unknown';
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', code: '', degree_type: 'Bachelor', duration: '', credits: '',
      department_id: departments[0]?.id || '', coordinator: '', status: 'active',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      degree_type: item.degree_type || 'Bachelor',
      duration: item.duration ?? '', credits: item.credits ?? '',
      department_id: item.department_id || departments[0]?.id || '',
      coordinator: item.coordinator || '', status: item.status || 'active',
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
        await updateProgram(editItem.id, formData);
        addNotification?.('Program updated successfully', 'success');
      } else {
        await createProgram(formData);
        addNotification?.('Program created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving program', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await deleteProgram(id);
      addNotification?.('Program deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Programs</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage academic programs</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Program
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search programs..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
          <div className="col-md-3">
            <button className="btn btn-outline-secondary rounded-3 w-100"
              onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}>
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
                <th className="ps-4">Name</th>
                <th>Code</th>
                <th>Degree Type</th>
                <th>Duration</th>
                <th>Credits</th>
                <th>Department</th>
                <th>Coordinator</th>
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
                    <FontAwesomeIcon icon={faBookOpen} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No programs found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new program to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-primary opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td><span className="badge bg-info-subtle text-info rounded-pill">{item.degree_type}</span></td>
                  <td className="small">
                    {item.duration ? <span><FontAwesomeIcon icon={faClock} className="me-1 text-muted" />{item.duration} yrs</span> : '-'}
                  </td>
                  <td className="small">{item.credits ?? '-'}</td>
                  <td className="small">{getDepartmentName(item.department_id)}</td>
                  <td className="small">{item.coordinator || '-'}</td>
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
                <h5 className="fw-bold">{editItem ? 'Edit Program' : 'Add Program'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Program Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. B.Sc. Computer Science" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. BSC-CS" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Degree Type</label>
                      <select className="form-select rounded-3" value={formData.degree_type}
                        onChange={e => setFormData({...formData, degree_type: e.target.value})}>
                        {DEGREE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Duration (Years)</label>
                      <input type="number" className="form-control rounded-3" value={formData.duration}
                        onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 4" min="1" max="10" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Total Credits</label>
                      <input type="number" className="form-control rounded-3" value={formData.credits}
                        onChange={e => setFormData({...formData, credits: e.target.value})} placeholder="e.g. 120" min="0" />
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
                      <label className="small fw-bold text-muted mb-2">Program Coordinator</label>
                      <input type="text" className="form-control rounded-3" value={formData.coordinator}
                        onChange={e => setFormData({...formData, coordinator: e.target.value})} placeholder="Dr. John Smith" />
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
                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />{editItem ? 'Update Program' : 'Save Program'}
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

export default Programs;
