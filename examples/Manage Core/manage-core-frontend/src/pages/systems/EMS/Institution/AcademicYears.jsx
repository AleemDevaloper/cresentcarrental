import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faToggleOn,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear
} from '../../../../api/ems';

const AcademicYears = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', start_date: '', end_date: '',
    is_current: false, status: 'active',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await listAcademicYears(params);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to load academic years');
      addNotification?.(err.message || 'Failed to load academic years', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({ name: '', code: '', start_date: '', end_date: '', is_current: false, status: 'active' });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      start_date: item.start_date || '', end_date: item.end_date || '',
      is_current: item.is_current || false, status: item.status || 'active',
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
        await updateAcademicYear(editItem.id, formData);
        addNotification?.('Academic year updated successfully', 'success');
      } else {
        await createAcademicYear(formData);
        addNotification?.('Academic year created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving academic year', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this academic year?')) return;
    try {
      await deleteAcademicYear(id);
      addNotification?.('Academic year deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Academic Years</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage academic years and current year settings</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Academic Year
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-5">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search academic years..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-secondary rounded-3 w-100"
              onClick={() => { setSearch(''); setStatusFilter(''); }}>
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Current Year</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <FontAwesomeIcon icon={faCalendar} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No academic years found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new academic year to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faCalendar} className="text-success opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td className="small">{item.start_date || '-'}</td>
                  <td className="small">{item.end_date || '-'}</td>
                  <td>
                    {item.is_current ? (
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        <FontAwesomeIcon icon={faToggleOn} className="me-1" />Current
                      </span>
                    ) : (
                      <span className="badge bg-light text-muted rounded-pill">No</span>
                    )}
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
                <h5 className="fw-bold">{editItem ? 'Edit Academic Year' : 'Add Academic Year'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Year Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Academic Year 2025-2026" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. AY-2025-26" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Start Date</label>
                      <input type="date" className="form-control rounded-3" value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">End Date</label>
                      <input type="date" className="form-control rounded-3" value={formData.end_date}
                        onChange={e => setFormData({...formData, end_date: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" checked={formData.is_current}
                          onChange={e => setFormData({...formData, is_current: e.target.checked})} />
                        <label className="form-check-label small fw-bold text-muted">Set as Current Year</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />{editItem ? 'Update Academic Year' : 'Save Academic Year'}
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

export default AcademicYears;
