import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faBuilding, faGlobe, faEnvelope,
  faPhone, faMapMarkerAlt, faCity, faGlobeAmericas,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listInstitutions, createInstitution, updateInstitution, deleteInstitution
} from '../../../../api/ems';

const INSTITUTION_TYPES = ['School', 'College', 'University', 'Institute', 'Academy', 'Other'];

const Institutions = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', short_name: '', code: '', type: 'School', status: 'active',
    founded_date: '', website: '', email: '', phone: '',
    address: '', city: '', province: '', country: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await listInstitutions(params);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || 'Failed to load institutions');
      addNotification?.(err.message || 'Failed to load institutions', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      name: '', short_name: '', code: '', type: 'School', status: 'active',
      founded_date: '', website: '', email: '', phone: '',
      address: '', city: '', province: '', country: '',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', short_name: item.short_name || '', code: item.code || '',
      type: item.type || 'School', status: item.status || 'active',
      founded_date: item.founded_date || '', website: item.website || '',
      email: item.email || '', phone: item.phone || '',
      address: item.address || '', city: item.city || '',
      province: item.province || '', country: item.country || '',
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
        await updateInstitution(editItem.id, formData);
        addNotification?.('Institution updated successfully', 'success');
      } else {
        await createInstitution(formData);
        addNotification?.('Institution created successfully', 'success');
      }
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving institution', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this institution? This action cannot be undone.')) return;
    try {
      await deleteInstitution(id);
      addNotification?.('Institution deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Institutions</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage educational institutions</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Institution
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
                placeholder="Search by name or code..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); }}>
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
                <th>Type</th>
                <th>Status</th>
                <th>Founded</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <FontAwesomeIcon icon={faUniversity} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No institutions found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new institution to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faUniversity} className="text-primary opacity-50" />
                      <div>
                        <div className="fw-semibold small">{item.name}</div>
                        {item.short_name && <div className="x-small text-muted">{item.short_name}</div>}
                      </div>
                    </div>
                  </td>
                  <td><code>{item.code}</code></td>
                  <td><span className="badge bg-primary-subtle text-primary rounded-pill">{item.type}</span></td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.status === 'active' ? 'success' : 'secondary'}-subtle text-${item.status === 'active' ? 'success' : 'secondary'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="small">{item.founded_date || '-'}</td>
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
                <h5 className="fw-bold">{editItem ? 'Edit Institution' : 'Add Institution'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Institution Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Springfield University" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Short Name</label>
                      <input type="text" className="form-control rounded-3" value={formData.short_name}
                        onChange={e => setFormData({...formData, short_name: e.target.value})} placeholder="e.g. SU" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Code <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. SPR-U" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Type</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
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
                      <label className="small fw-bold text-muted mb-2">Founded Date</label>
                      <input type="date" className="form-control rounded-3" value={formData.founded_date}
                        onChange={e => setFormData({...formData, founded_date: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Website</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faGlobe} /></span>
                        <input type="url" className="form-control rounded-end-3" value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control rounded-end-3" value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})} placeholder="info@institution.edu" />
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
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Main Street" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">City</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faCity} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Province/State</label>
                      <input type="text" className="form-control rounded-3" value={formData.province}
                        onChange={e => setFormData({...formData, province: e.target.value})} placeholder="Province" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Country</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faGlobeAmericas} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})} placeholder="Country" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBuilding} className="me-2" />{editItem ? 'Update Institution' : 'Save Institution'}
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

export default Institutions;
