import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice, faPlus, faSearch, faEdit, faTrash,
  faExclamationTriangle, faUser, faBookOpen, faFileAlt,
  faCheckCircle, faTimesCircle, faClock, faEye, faHourglassHalf,
  faArrowRight, faComment, faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listAdmissions, createAdmission, updateAdmission, deleteAdmission,
  updateAdmissionStatus, addAdmissionComment,
} from '../../../../api/ems';

const STATUS_WORKFLOW = [
  { value: 'applied', label: 'Applied', icon: faFileInvoice, color: 'secondary' },
  { value: 'document_verification', label: 'Document Verification', icon: faFileAlt, color: 'info' },
  { value: 'eligibility_check', label: 'Eligibility Check', icon: faCheckCircle, color: 'primary' },
  { value: 'exam', label: 'Exam', icon: faFileAlt, color: 'warning' },
  { value: 'interview', label: 'Interview', icon: faEye, color: 'info' },
  { value: 'approved', label: 'Approved', icon: faCheckCircle, color: 'success' },
  { value: 'rejected', label: 'Rejected', icon: faTimesCircle, color: 'danger' },
];

const Admissions = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    institution: '', program: '', status: '', date_from: '', date_to: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    application_no: '', student_name: '', student_email: '', student_phone: '',
    institution_id: '', program_id: '', academic_year_id: '',
    documents: '', status: 'applied', remarks: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const data = await listAdmissions(params);
      setData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load admissions');
      addNotification?.(err.message || 'Failed to load admissions', 'danger');
    } finally {
      setLoading(false);
    }
  }, [search, filters, addNotification]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddForm = () => {
    setEditItem(null);
    setFormData({
      application_no: '', student_name: '', student_email: '', student_phone: '',
      institution_id: '', program_id: '', academic_year_id: '',
      documents: '', status: 'applied', remarks: '',
    });
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      application_no: item.application_no || '', student_name: item.student_name || '',
      student_email: item.student_email || '', student_phone: item.student_phone || '',
      institution_id: item.institution_id || '', program_id: item.program_id || '',
      academic_year_id: item.academic_year_id || '', documents: item.documents || '',
      status: item.status || 'applied', remarks: item.remarks || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name) {
      addNotification?.('Student name is required', 'warning');
      return;
    }
    try {
      if (editItem) await updateAdmission(editItem.id, formData);
      else await createAdmission(formData);
      addNotification?.(editItem ? 'Application updated successfully' : 'Application created successfully', 'success');
      setShowForm(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving application', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteAdmission(id);
      addNotification?.('Application deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateAdmissionStatus(id, { status: newStatus });
      addNotification?.(`Status updated to ${newStatus}`, 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message, 'danger');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedApp) return;
    try {
      await addAdmissionComment(selectedApp.id, { comment: newComment });
      setNewComment('');
      addNotification?.('Comment added', 'success');
    } catch (err) {
      addNotification?.(err.message, 'danger');
    }
  };

  const getStatusStyle = (status) => {
    const s = STATUS_WORKFLOW.find(w => w.value === status);
    return s ? { color: s.color, Icon: s.icon } : { color: 'secondary', Icon: faClock };
  };

  return (
    <div className={`ems-root p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Admissions</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage student applications and admissions</p>
        </div>
        <button className="btn premium-btn-primary" onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />New Application
        </button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="row g-3">
          <div className="col-md-2">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}><FontAwesomeIcon icon={faSearch} /></span>
              <input type="text" className={`form-control rounded-3 ps-5 premium-input ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col"><select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={filters.institution} onChange={e => setFilters({...filters, institution: e.target.value})}><option value="">All Institutions</option></select></div>
          <div className="col"><select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={filters.program} onChange={e => setFilters({...filters, program: e.target.value})}><option value="">All Programs</option></select></div>
          <div className="col"><select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}><option value="">All Status</option>{STATUS_WORKFLOW.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
          <div className="col"><input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={filters.date_from} onChange={e => setFilters({...filters, date_from: e.target.value})} /></div>
          <div className="col"><input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={filters.date_to} onChange={e => setFilters({...filters, date_to: e.target.value})} /></div>
          <div className="col-auto"><button className="btn btn-outline-secondary rounded-3 h-100" onClick={() => { setSearch(''); setFilters({institution: '', program: '', status: '', date_from: '', date_to: ''}); }}><FontAwesomeIcon icon={faRotate} /></button></div>
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
                <th className="ps-4">Application No</th>
                <th>Student Name</th>
                <th>Program</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <FontAwesomeIcon icon={faFileInvoice} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No applications found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new application to get started</p>
                  </td>
                </tr>
              ) : data.map(item => {
                const { color, Icon } = getStatusStyle(item.status);
                const idx = STATUS_WORKFLOW.findIndex(w => w.value === item.status);
                return (
                  <tr key={item.id}>
                    <td className="ps-4"><code>{item.application_no || `APP-${String(item.id).padStart(4, '0')}`}</code></td>
                    <td className="fw-semibold small">{item.student_name}</td>
                    <td className="small">{item.program_name || '-'}</td>
                    <td className="small">{item.created_at?.split('T')[0] || '-'}</td>
                    <td>
                      <span className={`badge rounded-pill bg-${color}-subtle text-${color}`}>
                        <FontAwesomeIcon icon={Icon} className="me-1" />{STATUS_WORKFLOW[idx]?.label || item.status}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => { setSelectedApp(item); setShowComments(true); }}><FontAwesomeIcon icon={faComment} /></button>
                      <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {data.map(item => {
        const idx = STATUS_WORKFLOW.findIndex(w => w.value === item.status);
        if (idx === -1 || idx >= STATUS_WORKFLOW.length - 2) return null;
        return (
          <div key={item.id} className={`card border-0 shadow-sm rounded-4 p-3 mt-3 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="small fw-bold">{item.student_name} - Status Workflow</span>
              <div className="d-flex gap-1">
                {STATUS_WORKFLOW.slice(idx + 1, idx + 3).map(s => (
                  <button key={s.value} className={`btn btn-sm rounded-3 bg-${s.color}-subtle text-${s.color} fw-semibold`}
                    onClick={() => updateStatus(item.id, s.value)}>
                    <FontAwesomeIcon icon={s.icon} className="me-1" />{s.label}
                    <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Application' : 'New Application'}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Application No</label>
                      <input type="text" className="form-control rounded-3" value={formData.application_no}
                        onChange={e => setFormData({...formData, application_no: e.target.value})} placeholder="APP-2026-001" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Student Name <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faUser} /></span>
                        <input type="text" className="form-control rounded-end-3" required value={formData.student_name}
                          onChange={e => setFormData({...formData, student_name: e.target.value})} placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Email</label>
                      <input type="email" className="form-control rounded-3" value={formData.student_email}
                        onChange={e => setFormData({...formData, student_email: e.target.value})} placeholder="john@example.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Phone</label>
                      <input type="text" className="form-control rounded-3" value={formData.student_phone}
                        onChange={e => setFormData({...formData, student_phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Institution</label>
                      <select className="form-select rounded-3" value={formData.institution_id}
                        onChange={e => setFormData({...formData, institution_id: e.target.value})}>
                        <option value="">Select</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Program</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faBookOpen} /></span>
                        <select className="form-select rounded-end-3" value={formData.program_id}
                          onChange={e => setFormData({...formData, program_id: e.target.value})}>
                          <option value="">Select</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Academic Year</label>
                      <select className="form-select rounded-3" value={formData.academic_year_id}
                        onChange={e => setFormData({...formData, academic_year_id: e.target.value})}>
                        <option value="">Select</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Status</label>
                      <select className="form-select rounded-3" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}>
                        {STATUS_WORKFLOW.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Documents</label>
                      <div className="input-group">
                        <span className="input-group-text rounded-start-3 bg-transparent"><FontAwesomeIcon icon={faFileAlt} /></span>
                        <input type="text" className="form-control rounded-end-3" value={formData.documents}
                          onChange={e => setFormData({...formData, documents: e.target.value})} placeholder="Document links or notes" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Remarks</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.remarks}
                        onChange={e => setFormData({...formData, remarks: e.target.value})} placeholder="Additional remarks..." />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faFileInvoice} className="me-2" />{editItem ? 'Update Application' : 'Save Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showComments && selectedApp && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">Comments - {selectedApp.student_name}</h5>
                <button className="btn-close" onClick={() => setShowComments(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {(selectedApp.comments || []).length === 0 ? (
                    <p className="text-muted text-center py-3">No comments yet</p>
                  ) : selectedApp.comments.map((c, i) => (
                    <div key={i} className={`p-3 rounded-3 mb-2 ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                      <div className="x-small text-muted fw-bold">{c.created_at}</div>
                      <div className="small">{c.text}</div>
                    </div>
                  ))}
                </div>
                <div className="input-group">
                  <input type="text" className="form-control rounded-3" value={newComment}
                    onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." />
                  <button className="btn btn-primary rounded-3 ms-2" onClick={handleAddComment}>Send</button>
                </div>
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

export default Admissions;
