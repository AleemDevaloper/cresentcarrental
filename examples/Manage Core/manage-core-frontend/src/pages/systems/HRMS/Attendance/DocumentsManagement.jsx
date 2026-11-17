import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileUpload, faDownload, faLock, faSearch,
  faCheckCircle, faTimesCircle, faHourglassHalf,
  faPlus, faFilePdf, faFileImage, faEllipsisV,
  faUpload, faShield, faExclamationTriangle, faTrash,
  faCalendar, faTag
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listDocuments, uploadDocument, verifyDocument,
  lockDocument, deleteDocument, downloadDocument
} from '../../../../api/hrms';

const DOC_TYPES = [
  'CNIC', 'Passport', 'Visa', 'Employment Contract', 'Appointment Letter',
  'Offer Letter', 'Education Certificates', 'Experience Certificates',
  'Professional Certifications', 'Driving License', 'Medical Records',
  'NDA Agreements', 'Salary Agreements', 'Termination Documents', 'Exit Documents'
];

const STATUSES = ['verified', 'pending', 'rejected'];
const STATUS_ICONS = { verified: faCheckCircle, pending: faHourglassHalf, rejected: faTimesCircle };
const STATUS_COLORS = { verified: 'success', pending: 'warning', rejected: 'danger' };

const DocumentsManagement = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ document_type: 'CNIC', expiry_date: '' });
  const [uploadFile, setUploadFile] = useState(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDocuments();
      setDocuments(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
      addNotification?.(err.message || 'Failed to load documents', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const getExpiryColor = (expiry) => {
    if (!expiry) return 'text-muted';
    const now = new Date();
    const exp = new Date(expiry);
    const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-danger';
    if (days < 30) return 'text-warning';
    return 'text-success';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('document_type', uploadForm.document_type);
      fd.append('file', uploadFile);
      if (uploadForm.expiry_date) fd.append('expiry_date', uploadForm.expiry_date);
      await uploadDocument(fd);
      addNotification?.('Document uploaded successfully', 'success');
      setShowUpload(false);
      setUploadFile(null);
      setUploadForm({ document_type: 'CNIC', expiry_date: '' });
      fetchDocs();
    } catch (err) {
      addNotification?.(err.message || 'Upload failed', 'danger');
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await verifyDocument(id);
      addNotification?.('Document verified', 'success');
      fetchDocs();
    } catch (err) {
      addNotification?.(err.message || 'Verification failed', 'danger');
    }
  };

  const handleLock = async (id) => {
    try {
      await lockDocument(id);
      addNotification?.('Document locked', 'success');
      fetchDocs();
    } catch (err) {
      addNotification?.(err.message || 'Lock failed', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await deleteDocument(id);
      addNotification?.('Document deleted', 'success');
      fetchDocs();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const token = localStorage.getItem('auth_token');
      const url = `${baseUrl}/api/v1/hrms/documents/${id}/download`;
      const a = document.createElement('a');
      a.href = token ? `${url}?token=${encodeURIComponent(token)}` : url;
      a.download = name || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      addNotification?.(err.message || 'Download failed', 'danger');
    }
  };

  const filtered = documents.filter(d => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || d.document_type === filterType;
    const matchStatus = !filterStatus || d.verification_status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1">Documents Management</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Centralized employee document repository</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => setShowUpload(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Upload Document
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      {/* Document Type Badges */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {DOC_TYPES.map(type => (
          <span key={type} className={`badge rounded-pill px-3 py-2 cursor-pointer ${filterType === type ? 'bg-primary' : isDark ? 'bg-secondary text-light' : 'bg-light text-dark'}`}
            onClick={() => setFilterType(filterType === type ? '' : type)}>
            {type}
          </span>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-transparent"><FontAwesomeIcon icon={faSearch} /></span>
            <input type="text" className="form-control" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className={`table align-middle mb-0 ${isDark ? 'table-dark' : ''}`}>
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr>
                <th className="ps-4 small fw-bold">Document</th>
                <th className="small fw-bold">Type</th>
                <th className="small fw-bold">Version</th>
                <th className="small fw-bold">Status</th>
                <th className="small fw-bold">Expiry</th>
                <th className="small fw-bold text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-5 text-muted">
                  <FontAwesomeIcon icon={faFileUpload} className="fs-1 mb-3 opacity-25 d-block" />
                  No documents found
                </td></tr>
              ) : filtered.map(doc => (
                <tr key={doc.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3 bg-primary-subtle">
                        <FontAwesomeIcon icon={doc.document_type?.includes('PDF') ? faFilePdf : faFileImage} className="text-primary" />
                      </div>
                      <div>
                        <p className="mb-0 fw-bold small">{doc.name || doc.file_name}</p>
                        <p className={`mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'} x-small`}>{doc.employee_name || 'Unassigned'}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge bg-secondary-subtle text-secondary">{doc.document_type}</span></td>
                  <td><span className="badge bg-info-subtle text-info">v{doc.version || 1}</span></td>
                  <td>
                    <span className={`badge bg-${STATUS_COLORS[doc.verification_status] || 'secondary'}-subtle text-${STATUS_COLORS[doc.verification_status] || 'secondary'}`}>
                      <FontAwesomeIcon icon={STATUS_ICONS[doc.verification_status] || faHourglassHalf} className="me-1" />{doc.verification_status || 'pending'}
                    </span>
                  </td>
                  <td className={getExpiryColor(doc.expiry_date)}>
                    {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'N/A'}
                    {doc.expiry_date && new Date(doc.expiry_date) < new Date() && <FontAwesomeIcon icon={faExclamationTriangle} className="ms-1 text-danger" />}
                  </td>
                  <td className="pe-4 text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button className="btn btn-sm btn-light rounded-3" title="Download" onClick={() => handleDownload(doc.id, doc.name)}>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button className={`btn btn-sm rounded-3 ${doc.is_locked ? 'btn-danger' : 'btn-light'}`} title={doc.is_locked ? 'Locked' : 'Lock'} onClick={() => handleLock(doc.id)}>
                        <FontAwesomeIcon icon={faLock} />
                      </button>
                      {doc.verification_status === 'pending' && (
                        <button className="btn btn-sm btn-success rounded-3" title="Verify" onClick={() => handleVerify(doc.id)}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}
                      <button className="btn btn-sm btn-danger rounded-3" title="Delete" onClick={() => handleDelete(doc.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light rounded-3" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faEllipsisV} /></button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><button className="dropdown-item" onClick={() => handleVerify(doc.id)}><FontAwesomeIcon icon={faShield} className="me-2" />Verify</button></li>
                          <li><button className="dropdown-item" onClick={() => handleLock(doc.id)}><FontAwesomeIcon icon={faLock} className="me-2" />{doc.is_locked ? 'Unlock' : 'Lock'}</button></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faUpload} className="me-2 text-primary" />Upload Document</h5>
                <button className="btn-close" onClick={() => setShowUpload(false)} />
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2"><FontAwesomeIcon icon={faTag} className="me-1" />Document Type</label>
                    <select className="form-select rounded-3" value={uploadForm.document_type}
                      onChange={e => setUploadForm({ ...uploadForm, document_type: e.target.value })} required>
                      {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2"><FontAwesomeIcon icon={faFileUpload} className="me-1" />File</label>
                    <input type="file" className="form-control rounded-3"
                      onChange={e => setUploadFile(e.target.files[0])} required />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold text-muted mb-2"><FontAwesomeIcon icon={faCalendar} className="me-1" />Expiry Date (optional)</label>
                    <input type="date" className="form-control rounded-3" value={uploadForm.expiry_date}
                      onChange={e => setUploadForm({ ...uploadForm, expiry_date: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowUpload(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={uploading}>
                    {uploading ? <><span className="spinner-border spinner-border-sm me-2" />Uploading...</> : <><FontAwesomeIcon icon={faUpload} className="me-2" />Upload</>}
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

export default DocumentsManagement;
