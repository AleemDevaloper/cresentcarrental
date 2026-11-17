import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listDocuments, listDocumentSignatures, createSignature } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenFancy,
  faSearch,
  faPlus,
  faPaperPlane,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faDownload,
  faBell,
  faUser,
  faCalendarAlt,
  faCog,
  faAngleRight,
  faFile,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const DmsSignatureCenter = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [signatureDetails, setSignatureDetails] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [sendingLoading, setSendingLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let params = {};
      if (activeTab === 'pending') params.signature_status = 'pending';
      else if (activeTab === 'sent') params.signature_status = 'sent';
      else if (activeTab === 'signed') params.signature_status = 'signed';
      else if (activeTab === 'declined') params.signature_status = 'declined';
      else if (activeTab === 'expired') params.signature_status = 'expired';
      const data = await listDocuments(params);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
      addNotification('Failed to load documents.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchSignatureDetails = async (doc) => {
    setSelectedDoc(doc);
    try {
      const data = await listDocumentSignatures(doc.id);
      setSignatureDetails(data);
      setShowDetailDrawer(true);
    } catch (err) {
      console.error('Failed to fetch signature details', err);
      setSignatureDetails(null);
    }
  };

  const handleSendForSignature = async (e) => {
    e.preventDefault();
    setSendingLoading(true);
    try {
      const form = e.target;
      const data = {
        document_id: form.document.value,
        recipients: [],
        signing_type: form.signingType.value,
        message: form.message.value,
        fields: [],
      };
      if (form.recipientName?.value && form.recipientEmail?.value) {
        data.recipients.push({
          name: form.recipientName.value,
          email: form.recipientEmail.value,
          order: form.recipientOrder.value || 1,
        });
      }
      if (form.fieldSignature?.checked) data.fields.push({ type: 'signature' });
      if (form.fieldInitials?.checked) data.fields.push({ type: 'initials' });
      if (form.fieldDate?.checked) data.fields.push({ type: 'date' });
      if (form.fieldName?.checked) data.fields.push({ type: 'name' });
      if (form.fieldTitle?.checked) data.fields.push({ type: 'title' });

      await createSignature(data.document_id, data);
      addNotification('Document sent for signature successfully.', 'success');
      setShowSendModal(false);
      fetchDocuments();
    } catch (err) {
      addNotification('Failed to send for signature.', 'danger');
    } finally {
      setSendingLoading(false);
    }
  };

  const handleReminder = async () => {
    try {
      addNotification('Reminder sent to pending signers.', 'success');
    } catch (err) {
      addNotification('Failed to send reminder.', 'danger');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
      sent: { bg: '#dbeafe', color: '#2563eb', label: 'Sent' },
      signed: { bg: '#d1fae5', color: '#059669', label: 'Signed' },
      declined: { bg: '#fee2e2', color: '#dc2626', label: 'Declined' },
      expired: { bg: '#f3e8ff', color: '#7c3aed', label: 'Expired' },
    };
    const c = configs[status] || configs.pending;
    return <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: c.bg, color: c.color, fontSize: '0.65rem' }}>{c.label}</span>;
  };

  const filteredDocs = documents.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = ['pending', 'sent', 'signed', 'declined', 'expired'];

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-4">
              <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
                <FontAwesomeIcon icon={faPenFancy} className="fs-3" />
              </div>
              <div>
                <h3 className="fw-bold mb-1">Digital Signature Center</h3>
                <p className="mb-0 opacity-75">Send, track, and manage digital signatures.</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm transition" onClick={() => setShowSendModal(true)}>
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" />Send for Signature
              </button>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-bold shadow-sm transition">
                <FontAwesomeIcon icon={faCog} className="me-2" />Create Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="d-flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`btn btn-sm rounded-pill px-3 border-0 fw-bold transition ${activeTab === tab ? 'btn-primary shadow-sm text-white' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="position-relative">
              <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem' }} />
              <input
                type="text"
                className="form-control border shadow-none rounded-pill ps-5 bg-light small"
                placeholder="Search documents..."
                style={{ width: '200px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FontAwesomeIcon icon={faPenFancy} className="fs-2 mb-3 opacity-30" />
              <p className="small mb-0">No documents found for this signature status.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredDocs.map(doc => {
                const signers = doc.signers || [];
                const completedSigners = signers.filter(s => s.status === 'signed').length;
                const totalSigners = signers.length || 1;
                const progress = Math.round((completedSigners / totalSigners) * 100);
                return (
                  <div key={doc.id} className="col-xl-4 col-lg-6">
                    <div className="card border shadow-sm rounded-4 h-100 transition hover-lift-sm cursor-pointer" onClick={() => fetchSignatureDetails(doc)}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-start gap-3 mb-3">
                          <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                            <FontAwesomeIcon icon={faFile} />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="fw-bold mb-1 text-truncate">{doc.name}</h6>
                            {getStatusBadge(doc.signature_status || activeTab)}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          {signers.slice(0, 4).map((s, idx) => (
                            <div
                              key={idx}
                              className="rounded-circle border-2 d-flex align-items-center justify-content-center fw-bold position-relative"
                              style={{
                                width: '30px', height: '30px', fontSize: '0.6rem',
                                backgroundColor: s.status === 'signed' ? '#d1fae5' : s.status === 'declined' ? '#fee2e2' : '#f1f5f9',
                                color: s.status === 'signed' ? '#059669' : s.status === 'declined' ? '#dc2626' : '#64748b',
                                borderColor: s.status === 'signed' ? '#059669' : s.status === 'declined' ? '#dc2626' : '#e2e8f0'
                              }}
                              title={`${s.name}: ${s.status}`}
                            >
                              {s.name?.[0] || '?'}
                            </div>
                          ))}
                          {signers.length > 4 && <span className="x-small text-muted fw-bold">+{signers.length - 4}</span>}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className={`badge rounded-pill px-2 py-1 fw-bold x-small ${doc.signing_type === 'sequential' ? 'bg-info bg-opacity-10 text-info' : 'bg-primary bg-opacity-10 text-primary'}`}>
                            {doc.signing_type === 'sequential' ? 'Sequential' : 'Parallel'}
                          </span>
                          <span className="x-small text-muted"><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />{doc.sent_date ? formatTime(doc.sent_date) : '—'}</span>
                        </div>
                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="x-small text-muted">Progress</span>
                            <span className="x-small fw-bold">{completedSigners}/{totalSigners}</span>
                          </div>
                          <div className="progress rounded-pill" style={{ height: '6px' }}>
                            <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DialogBox show={showSendModal} onHide={() => setShowSendModal(false)} title="Send for Signature" size="large">
        <form onSubmit={handleSendForSignature}>
          <div className="mb-3">
            <label className="form-label fw-bold small">Select Document</label>
            <select name="document" className="form-select border shadow-none rounded-3" required>
              <option value="">Choose a document...</option>
              {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Recipient</label>
            <div className="row g-2">
              <div className="col-md-5">
                <input name="recipientName" className="form-control border shadow-none rounded-3" placeholder="Full name" />
              </div>
              <div className="col-md-4">
                <input name="recipientEmail" type="email" className="form-control border shadow-none rounded-3" placeholder="Email address" />
              </div>
              <div className="col-md-3">
                <input name="recipientOrder" type="number" className="form-control border shadow-none rounded-3" placeholder="Order" min="1" defaultValue="1" />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Signature Fields</label>
            <div className="d-flex flex-wrap gap-3">
              {['Signature', 'Initials', 'Date', 'Name', 'Title'].map(field => (
                <div key={field} className="form-check">
                  <input className="form-check-input" type="checkbox" name={`field${field}`} id={`field${field}`} defaultChecked={field === 'Signature'} />
                  <label className="form-check-label small" htmlFor={`field${field}`}>{field}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Signing Type</label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="signingType" value="sequential" id="signSeq" defaultChecked />
                <label className="form-check-label small" htmlFor="signSeq">Sequential</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="signingType" value="parallel" id="signPar" />
                <label className="form-check-label small" htmlFor="signPar">Parallel</label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold small">Message to Recipients</label>
            <textarea name="message" className="form-control border shadow-none rounded-3" rows="2" placeholder="Optional message..." />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={() => setShowSendModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold flex-grow-1 shadow-sm" disabled={sendingLoading}>
              {sendingLoading ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : <><FontAwesomeIcon icon={faPaperPlane} className="me-2" />Send</>}
            </button>
          </div>
        </form>
      </DialogBox>

      <div className={`position-fixed top-0 end-0 h-100 bg-white shadow-xl transition-all ${showDetailDrawer ? 'translate-x-0' : 'translate-x-100'}`} style={{ width: '480px', zIndex: 1050, overflowY: 'auto', borderLeft: '1px solid #e2e8f0' }}>
        {selectedDoc && signatureDetails && (
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">{selectedDoc.name}</h5>
              <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowDetailDrawer(false)}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
            <div className="mb-4 p-3 rounded-4 bg-light border">
              <p className="small mb-1 text-muted">Sent: {selectedDoc.sent_date ? new Date(selectedDoc.sent_date).toLocaleString() : '—'}</p>
              <p className="small mb-0 text-muted">Status: {selectedDoc.signature_status}</p>
            </div>

            <h6 className="fw-bold mb-3">Signers</h6>
            {(signatureDetails.signers || []).map((s, idx) => (
              <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-3 border bg-light mb-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '34px', height: '34px', fontSize: '0.7rem', backgroundColor: s.status === 'signed' ? '#d1fae5' : s.status === 'declined' ? '#fee2e2' : '#f1f5f9', color: s.status === 'signed' ? '#059669' : s.status === 'declined' ? '#dc2626' : '#64748b' }}>
                    {s.name?.[0] || '?'}
                  </div>
                  <div>
                    <span className="fw-bold small d-block">{s.name}</span>
                    <span className="x-small text-muted">{s.email}</span>
                  </div>
                </div>
                <div className="text-end">
                  <span className="badge rounded-pill px-2 py-1 fw-bold x-small" style={{
                    backgroundColor: s.status === 'signed' ? '#d1fae5' : s.status === 'viewed' ? '#dbeafe' : s.status === 'declined' ? '#fee2e2' : '#fef3c7',
                    color: s.status === 'signed' ? '#059669' : s.status === 'viewed' ? '#2563eb' : s.status === 'declined' ? '#dc2626' : '#d97706'
                  }}>{s.status}</span>
                  {s.signed_at && <div className="x-small text-muted mt-1">{new Date(s.signed_at).toLocaleDateString()}</div>}
                </div>
              </div>
            ))}

            {(signatureDetails.certificate) && (
              <div className="mb-4 p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25">
                <h6 className="fw-bold text-success mb-2"><FontAwesomeIcon icon={faCheckCircle} className="me-2" />Certificate Info</h6>
                <p className="x-small text-muted mb-1">Issued to: {signatureDetails.certificate.issued_to}</p>
                <p className="x-small text-muted mb-1">Issued by: {signatureDetails.certificate.issued_by}</p>
                <p className="x-small text-muted mb-0">Valid until: {signatureDetails.certificate.valid_until}</p>
              </div>
            )}

            <h6 className="fw-bold mb-3">Activity Log</h6>
            {(signatureDetails.activity || []).map((a, idx) => (
              <div key={idx} className="d-flex align-items-center gap-3 p-2 border-bottom border-light">
                <FontAwesomeIcon icon={a.event === 'signed' ? faCheckCircle : a.event === 'viewed' ? faEye : faClock} className="text-muted x-small" />
                <div className="flex-grow-1">
                  <span className="small fw-medium">{a.event}</span>
                  <span className="x-small text-muted ms-2">by {a.user}</span>
                </div>
                <span className="x-small text-muted">{formatTime(a.timestamp)}</span>
              </div>
            ))}

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={handleReminder}>
                <FontAwesomeIcon icon={faBell} className="me-2" />Remind
              </button>
              <button className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold flex-grow-1">
                <FontAwesomeIcon icon={faDownload} className="me-2" />Download
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.3s ease; }
        .hover-lift-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important; cursor: pointer; }
        .translate-x-0 { transform: translateX(0); }
        .translate-x-100 { transform: translateX(100%); }
        .shadow-xl { box-shadow: -8px 0 30px rgba(0,0,0,0.1); }
        .cursor-pointer { cursor: pointer; }
        ${isDark ? `
          .card, .bg-white { background-color: #1e293b !important; border-color: #334155 !important; }
          .bg-light { background-color: #1e293b !important; }
          .border-light { border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .text-dark { color: #f1f5f9 !important; }
          .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .form-control, .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .shadow-xl { box-shadow: -8px 0 30px rgba(0,0,0,0.3); }
        ` : ''}
      `}</style>
    </div>
  );
};

export default DmsSignatureCenter;
