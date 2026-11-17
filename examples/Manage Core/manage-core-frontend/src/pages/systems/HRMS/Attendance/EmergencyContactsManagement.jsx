import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faMobile, faEnvelope, faLocationDot, faStar, faUser,
  faPlus, faEdit, faTrash, faCheckCircle, faExclamationTriangle,
  faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listEmergencyContacts, createEmergencyContact, updateEmergencyContact,
  deleteEmergencyContact, setEmergencyContactPriority
} from '../../../../api/hrms';

const RELATIONSHIPS = ['Father', 'Mother', 'Spouse', 'Sibling', 'Guardian', 'Friend', 'Relative'];

const EmergencyContactsManagement = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '', relationship: 'Spouse', phone_number: '', mobile_number: '',
    email: '', address: '', priority: 'secondary'
  });

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listEmergencyContacts();
      setContacts(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      addNotification?.(err.message || 'Failed to load contacts', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const openAddForm = () => {
    setEditContact(null);
    setFormData({
      contact_name: '', relationship: 'Spouse', phone_number: '', mobile_number: '',
      email: '', address: '', priority: 'secondary'
    });
    setShowModal(true);
  };

  const openEditForm = (contact) => {
    setEditContact(contact);
    setFormData({
      contact_name: contact.contact_name || contact.name || '',
      relationship: contact.relationship || 'Spouse',
      phone_number: contact.phone_number || contact.phone || '',
      mobile_number: contact.mobile_number || contact.mobile || '',
      email: contact.email || '',
      address: contact.address || '',
      priority: contact.priority || 'secondary'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editContact) {
        await updateEmergencyContact(editContact.id, formData);
        addNotification?.('Contact updated', 'success');
      } else {
        await createEmergencyContact(formData);
        addNotification?.('Contact added', 'success');
      }
      setShowModal(false);
      setEditContact(null);
      fetchContacts();
    } catch (err) {
      addNotification?.(err.message || 'Error saving contact', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await deleteEmergencyContact(id);
      addNotification?.('Contact deleted', 'success');
      fetchContacts();
    } catch (err) {
      addNotification?.(err.message || 'Error deleting contact', 'danger');
    }
  };

  const handlePriorityChange = async (id, priority) => {
    try {
      await setEmergencyContactPriority(id, priority);
      addNotification?.(`Priority set to ${priority}`, 'success');
      fetchContacts();
    } catch (err) {
      addNotification?.(err.message || 'Failed to update priority', 'danger');
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Emergency Contacts</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage employee emergency contact information</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Add Contact
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {/* Contact Cards Grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faUser} className="fs-1 text-muted mb-3 opacity-50" />
          <p className="text-muted">No emergency contacts added</p>
        </div>
      ) : (
        <div className="row g-4">
          {contacts.map(contact => (
            <div key={contact.id} className="col-md-6 col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`p-3 rounded-4 ${contact.priority === 'primary' ? 'bg-danger-subtle' : 'bg-info-subtle'}`}>
                        <FontAwesomeIcon icon={faPhone} className={`${contact.priority === 'primary' ? 'text-danger' : 'text-info'} fs-4`} />
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h6 className="fw-bold mb-0">{contact.contact_name || contact.name}</h6>
                          {contact.priority === 'primary' && (
                            <FontAwesomeIcon icon={faStar} className="text-warning" title="Primary Contact" />
                          )}
                        </div>
                        <span className={`small ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>
                          <FontAwesomeIcon icon={faUser} className="me-1" />{contact.relationship}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light rounded-3" title="Edit" onClick={() => openEditForm(contact)}>
                        <FontAwesomeIcon icon={faEdit} className="text-secondary" />
                      </button>
                      <button className="btn btn-sm btn-light rounded-3" title="Delete" onClick={() => handleDelete(contact.id)}>
                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${contact.priority === 'primary' ? 'bg-danger' : 'bg-info'} rounded-pill`}>
                      {contact.priority === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                    {contact.verification_status === 'verified' && (
                      <span className="badge bg-success-subtle text-success rounded-pill">
                        <FontAwesomeIcon icon={faCheckCircle} className="me-1" />Verified
                      </span>
                    )}
                  </div>

                  <div className={`${isDark ? 'bg-dark' : 'bg-light'} rounded-3 p-3`}>
                    {(contact.phone_number || contact.phone) && (
                      <p className="mb-1 small"><FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />{contact.phone_number || contact.phone}</p>
                    )}
                    {(contact.mobile_number || contact.mobile) && (
                      <p className="mb-1 small"><FontAwesomeIcon icon={faMobile} className="me-2 text-success" />{contact.mobile_number || contact.mobile}</p>
                    )}
                    {contact.email && <p className="mb-1 small"><FontAwesomeIcon icon={faEnvelope} className="me-2 text-info" />{contact.email}</p>}
                    {contact.address && <p className="mb-0 small"><FontAwesomeIcon icon={faLocationDot} className="me-2 text-danger" />{contact.address}</p>}
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    {contact.priority !== 'primary' && (
                      <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handlePriorityChange(contact.id, 'primary')}>
                        <FontAwesomeIcon icon={faArrowUp} className="me-1" />Set Primary
                      </button>
                    )}
                    {contact.priority !== 'secondary' && (
                      <button className="btn btn-sm btn-outline-info rounded-3" onClick={() => handlePriorityChange(contact.id, 'secondary')}>
                        <FontAwesomeIcon icon={faArrowDown} className="me-1" />Set Secondary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editContact ? 'Edit Contact' : 'Add Emergency Contact'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Full Name</label>
                      <input type="text" className="form-control rounded-3" required value={formData.contact_name}
                        onChange={e => setFormData({ ...formData, contact_name: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Relationship</label>
                      <select className="form-select rounded-3" value={formData.relationship}
                        onChange={e => setFormData({ ...formData, relationship: e.target.value })}>
                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Priority</label>
                      <select className="form-select rounded-3" value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Phone</label>
                      <input type="text" className="form-control rounded-3" value={formData.phone_number}
                        onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Mobile</label>
                      <input type="text" className="form-control rounded-3" value={formData.mobile_number}
                        onChange={e => setFormData({ ...formData, mobile_number: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <input type="email" className="form-control rounded-3" value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Address</label>
                      <textarea className="form-control rounded-3" rows="2" value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : (editContact ? 'Update' : 'Save Contact')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsManagement;
