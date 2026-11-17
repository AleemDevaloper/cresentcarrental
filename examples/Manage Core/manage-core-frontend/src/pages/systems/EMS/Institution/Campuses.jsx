import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUser, faPhone, faEnvelope, faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listCampuses, createCampus, updateCampus, deleteCampus,
  listInstitutions
} from '../../../../api/ems';

const Campuses = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [instFilter, setInstFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', institution_id: '', campus_head: '',
    address: '', phone: '', email: '', status: 'active', capacity: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (instFilter) params.institution_id = instFilter;
      if (statusFilter) params.status = statusFilter;
      const [campusRes, instRes] = await Promise.all([
        listCampuses(params),
        listInstitutions()
      ]);
      setData(Array.isArray(campusRes) ? campusRes : []);
      setInstitutions(Array.isArray(instRes) ? instRes : []);
    } catch (err) {
      setError(err.message || 'Failed to load campuses');
      addNotification?.(err.message || 'Failed to load campuses', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, instFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getInstitutionName = (id) => {
    const inst = institutions.find(i => i.id === id);
    return inst ? inst.name : 'Unknown';
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', code: '', institution_id: institutions[0]?.id || '', campus_head: '',
      address: '', phone: '', email: '', status: 'active', capacity: '',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', code: item.code || '',
      institution_id: item.institution_id || institutions[0]?.id || '',
      campus_head: item.campus_head || '', address: item.address || '',
      phone: item.phone || '', email: item.email || '',
      status: item.status || 'active', capacity: item.capacity ?? '',
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
        await updateCampus(editItem.id, formData);
        addNotification?.('Campus updated successfully', 'success');
      } else {
        await createCampus(formData);
        addNotification?.('Campus created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving campus', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campus?')) return;
    try {
      await deleteCampus(id);
      addNotification?.('Campus deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Campuses</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage institution campuses</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Campus
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
                placeholder="Search campuses..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={instFilter} onChange={e => setInstFilter(e.target.value)}>
              <option value="">All Institutions</option>
              {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
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
              onClick={() => { setSearch(''); setInstFilter(''); setStatusFilter(''); }}>
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
                <th>Institution</th>
                <th>Campus Head</th>
                <th>Phone</th>
                <th>Capacity</th>
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
                    <FontAwesomeIcon icon={faBuilding} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No campuses found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new campus to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faBuilding} className="text-info opacity-50" />
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td className="small">{getInstitutionName(item.institution_id)}</td>
                  <td className="small">
                    {item.campus_head ? (
                      <span><FontAwesomeIcon icon={faUser} className="me-1 text-muted" />{item.campus_head}</span>
                    ) : '-'}
                  </td>
                  <td className="small">{item.phone || '-'}</td>
                  <td className="small">{item.capacity ?? '-'}</td>
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
                <h5 className="fw-bold">{editItem ? 'Edit Campus' : 'Add Campus'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Campus Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Main Campus" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. MC" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Institution</label>
                      <select className="form-select rounded-3" value={formData.institution_id}
                        onChange={e => setFormData({...formData, institution_id: e.target.value})}>
                        <option value="">Select Institution</option>
                        {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Campus Head</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faUser} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.campus_head}
                          onChange={e => setFormData({...formData, campus_head: e.target.value})} placeholder="Dr. John Doe" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control rounded-end-3" value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})} placeholder="campus@institution.edu" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Phone</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faPhone} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Capacity</label>
                      <input type="number" className="form-control rounded-3" value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 5000" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Campus address" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBuilding} className="me-2" />{editItem ? 'Update Campus' : 'Save Campus'}
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

export default Campuses;
