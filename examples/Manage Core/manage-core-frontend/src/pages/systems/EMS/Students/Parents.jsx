import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUser, faEnvelope, faPhone,
  faMapMarkerAlt, faToggleOn, faToggleOff, faBriefcase,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listParents, createParent, updateParent, deleteParent,
} from '../../../../api/ems';

const Parents = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', relationship: 'Father', occupation: '',
    phone: '', email: '', address: '', student_id: '',
    is_emergency_contact: false, portal_access: false,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      const data = await listParents(params);
      setData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load parents');
      addNotification?.(err.message || 'Failed to load parents', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({ name: '', relationship: 'Father', occupation: '', phone: '', email: '', address: '', student_id: '', is_emergency_contact: false, portal_access: false });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      name: item.name || '', relationship: item.relationship || 'Father',
      occupation: item.occupation || '', phone: item.phone || '',
      email: item.email || '', address: item.address || '',
      student_id: item.student_id || '',
      is_emergency_contact: item.is_emergency_contact || false,
      portal_access: item.portal_access || false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      addNotification?.('Name is required', 'warning');
      return;
    }
    try {
      if (editItem) await updateParent(editItem.id, formData);
      else await createParent(formData);
      addNotification?.(editItem ? 'Parent updated successfully' : 'Parent created successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving parent', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this parent/guardian?')) return;
    try {
      await deleteParent(id);
      addNotification?.('Parent deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Parents / Guardians</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage parent and guardian records</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Parent
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by name, email, or phone..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => setSearch('')}>Reset</button>
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
                <th className="ps-4">Parent Name</th>
                <th>Relationship</th>
                <th>Student</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Portal Access</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <FontAwesomeIcon icon={faUsers} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No parents found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a parent or guardian to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                        {item.name?.charAt(0)}
                      </div>
                      <span className="fw-semibold small">{item.name}</span>
                    </div>
                  </td>
                  <td><span className="badge bg-primary-subtle text-primary rounded-pill">{item.relationship || '-'}</span></td>
                  <td className="small">{item.student_name || '-'}</td>
                  <td className="small">{item.phone || '-'}</td>
                  <td className="small">{item.email || '-'}</td>
                  <td className="small text-truncate" style={{ maxWidth: '150px' }}>{item.address || '-'}</td>
                  <td>
                    <span className={`badge rounded-pill bg-${item.portal_access ? 'success' : 'secondary'}-subtle text-${item.portal_access ? 'success' : 'secondary'}`}>
                      <FontAwesomeIcon icon={item.portal_access ? faToggleOn : faToggleOff} className="me-1" />
                      {item.portal_access ? 'Active' : 'Inactive'}
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
                <h5 className="fw-bold">{editItem ? 'Edit Parent' : 'Add Parent'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Full Name <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faUser} /></span>
                        <input type="text" className="form-control rounded-end-3" required value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Smith" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Relationship</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faUsers} /></span>
                        <select className="form-select rounded-end-3" value={formData.relationship}
                          onChange={e => setFormData({...formData, relationship: e.target.value})}>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Occupation</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBriefcase} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.occupation}
                          onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="Engineer" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Student</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faGraduationCap} /></span>
                        <select className="form-select rounded-end-3" value={formData.student_id}
                          onChange={e => setFormData({...formData, student_id: e.target.value})}>
                          <option value="">Select Student</option>
                        </select>
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
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faEnvelope} /></span>
                        <input type="email" className="form-control rounded-end-3" value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})} placeholder="parent@example.com" />
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
                    <div className="col-md-6">
                      <div className="form-check form-switch mt-4">
                        <input className="form-check-input" type="checkbox" id="emergencyContact" checked={formData.is_emergency_contact}
                          onChange={e => setFormData({...formData, is_emergency_contact: e.target.checked})} />
                        <label className="form-check-label small fw-bold" htmlFor="emergencyContact">Emergency Contact</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check form-switch mt-4">
                        <input className="form-check-input" type="checkbox" id="portalAccess" checked={formData.portal_access}
                          onChange={e => setFormData({...formData, portal_access: e.target.checked})} />
                        <label className="form-check-label small fw-bold" htmlFor="portalAccess">Portal Access</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faUsers} className="me-2" />{editItem ? 'Update Parent' : 'Save Parent'}
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

export default Parents;
