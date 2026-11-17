import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listDocuments, listDocumentApprovals, updateApprovalStatus } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faTimesCircle,
  faExclamationTriangle,
  faSearch,
  faFilter,
  faChevronRight,
  faPaperPlane,
  faBan,
  faFlag,
  faHistory,
  faChartBar,
  faUser,
  faCalendarAlt,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const STEPS = ['Draft', 'Submitted', 'Manager Review', 'Department Approval', 'Final Approval', 'Published'];

const DmsApprovalWorkflow = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [approvalDetails, setApprovalDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentModal, setCommentModal] = useState({ show: false, action: '', id: null });
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [activeTab]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let params = {};
      if (activeTab === 'pending') params.approval_status = 'pending';
      else if (activeTab === 'approved') params.approval_status = 'approved';
      else if (activeTab === 'rejected') params.approval_status = 'rejected';
      else if (activeTab === 'escalated') params.approval_status = 'escalated';
      const data = await listDocuments(params);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
      addNotification('Failed to load documents.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalDetails = async (doc) => {
    setSelectedDoc(doc);
    try {
      const data = await listDocumentApprovals(doc.id);
      setApprovalDetails(data);
    } catch (err) {
      console.error('Failed to fetch approval details', err);
      setApprovalDetails(null);
    }
  };

  const handleApprovalAction = async () => {
    const { action, id } = commentModal;
    try {
      await updateApprovalStatus(id, { status: action, comment });
      addNotification(`Document ${action} successfully.`, 'success');
      setCommentModal({ show: false, action: '', id: null });
      setComment('');
      fetchDocuments();
      if (selectedDoc) fetchApprovalDetails(selectedDoc);
    } catch (err) {
      addNotification(`Failed to ${action} document.`, 'danger');
    }
  };

  const openCommentModal = (id, action) => {
    setCommentModal({ show: true, action, id });
    setComment('');
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Critical': return { color: '#ef4444', bg: '#fef2f2', label: 'Critical' };
      case 'High': return { color: '#f59e0b', bg: '#fffbeb', label: 'High' };
      case 'Medium': return { color: '#8b5cf6', bg: '#f5f3ff', label: 'Medium' };
      case 'Low': return { color: '#10b981', bg: '#f0fdf4', label: 'Low' };
      default: return { color: '#64748b', bg: '#f8fafc', label: 'None' };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const summaryCards = [
    { title: 'Pending Approvals', value: documents.filter(d => d.approval_status === 'pending').length, icon: faClock, color: '#f59e0b' },
    { title: 'Approved Today', value: documents.filter(d => d.approval_status === 'approved').length, icon: faCheckCircle, color: '#10b981' },
    { title: 'Rejected', value: documents.filter(d => d.approval_status === 'rejected').length, icon: faTimesCircle, color: '#ef4444' },
    { title: 'Escalated', value: documents.filter(d => d.approval_status === 'escalated').length, icon: faFlag, color: '#8b5cf6' },
  ];

  const filteredDocs = documents.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentStepIndex = selectedDoc && approvalDetails
    ? STEPS.indexOf(approvalDetails.current_stage || selectedDoc.approval_stage || 'Draft')
    : -1;

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
          <div className="d-flex align-items-center gap-4">
            <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
              <FontAwesomeIcon icon={faCheckCircle} className="fs-3" />
            </div>
            <div>
              <h3 className="fw-bold mb-1">Approval Workflow Center</h3>
              <p className="mb-0 opacity-75">Manage document approval pipeline and review cycles.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: `${card.color}1a`, color: card.color }}>
                    <FontAwesomeIcon icon={card.icon} size="lg" />
                  </div>
                </div>
                <h6 className="text-muted small mb-1">{card.title}</h6>
                <h3 className="fw-bold mb-0">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div className="d-flex gap-2">
                  {['pending', 'approved', 'rejected', 'escalated', 'all'].map(tab => (
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
                    style={{ width: '180px' }}
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
                  <FontAwesomeIcon icon={faFilter} className="fs-2 mb-3 opacity-30" />
                  <p className="small mb-0">No documents found for this filter.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {filteredDocs.map(doc => {
                    const prio = getPriorityConfig(doc.priority);
                    const isSelected = selectedDoc?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        className={`p-3 rounded-4 border transition hover-lift-sm cursor-pointer ${isSelected ? 'border-primary bg-primary bg-opacity-5' : 'border-light bg-white'}`}
                        onClick={() => fetchApprovalDetails(doc)}
                        style={{ borderLeft: `4px solid ${prio.color}` }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0 small">{doc.name}</h6>
                          <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ backgroundColor: prio.bg, color: prio.color, fontSize: '0.6rem' }}>{prio.label}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3 text-muted x-small mb-2">
                          <span><FontAwesomeIcon icon={faUser} className="me-1" />{doc.submitter?.name || 'Unknown'}</span>
                          <span><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />{doc.submitted_date ? formatTime(doc.submitted_date) : 'N/A'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-light text-dark border rounded-pill px-2 py-1 x-small">{doc.approval_stage || 'Draft'}</span>
                          <span className="x-small text-muted"><FontAwesomeIcon icon={faClock} className="me-1" />{doc.time_in_stage || '—'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              {!selectedDoc ? (
                <div className="text-center py-5 text-muted">
                  <FontAwesomeIcon icon={faChevronRight} className="fs-2 mb-3 opacity-30" />
                  <p className="small mb-0">Select a document to view its approval details.</p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="fw-bold mb-1">{selectedDoc.name}</h5>
                      <p className="text-muted small mb-0">{selectedDoc.description || 'No description'}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => openCommentModal(approvalDetails?.id || selectedDoc.id, 'approved')}>
                        <FontAwesomeIcon icon={faPaperPlane} className="me-1" />Approve
                      </button>
                      <button className="btn btn-danger btn-sm rounded-pill px-3 fw-bold" onClick={() => openCommentModal(approvalDetails?.id || selectedDoc.id, 'rejected')}>
                        <FontAwesomeIcon icon={faBan} className="me-1" />Reject
                      </button>
                      <button className="btn btn-warning btn-sm rounded-pill px-3 fw-bold text-white" onClick={() => openCommentModal(approvalDetails?.id || selectedDoc.id, 'escalated')}>
                        <FontAwesomeIcon icon={faFlag} className="me-1" />Escalate
                      </button>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-4 p-3 rounded-4 bg-light flex-wrap">
                    {STEPS.map((step, idx) => (
                      <React.Fragment key={step}>
                        <div className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-bold small ${idx <= currentStepIndex ? 'bg-primary text-white' : 'bg-white text-muted border'}`}>
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${idx <= currentStepIndex ? 'bg-white text-primary' : 'bg-light text-muted'}`} style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}>
                            {idx < currentStepIndex ? <FontAwesomeIcon icon={faCheckCircle} /> : idx + 1}
                          </div>
                          <span className="x-small">{step}</span>
                        </div>
                        {idx < STEPS.length - 1 && <FontAwesomeIcon icon={faArrowRight} className="text-muted x-small" />}
                      </React.Fragment>
                    ))}
                  </div>

                  <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faHistory} className="me-2" />Approval History</h6>
                  {approvalDetails?.history?.length > 0 ? (
                    <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {approvalDetails.history.map((h, idx) => (
                        <div key={idx} className="p-3 rounded-3 border bg-light">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                                {h.user?.name?.[0] || 'U'}
                              </div>
                              <div>
                                <span className="fw-bold small">{h.user?.name || 'System'}</span>
                                <span className={`badge rounded-pill px-2 py-1 ms-2 fw-bold x-small ${h.status === 'approved' ? 'bg-success bg-opacity-10 text-success' : h.status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                  {h.status}
                                </span>
                              </div>
                            </div>
                            <span className="x-small text-muted">{formatTime(h.created_at)}</span>
                          </div>
                          {h.comment && <p className="text-muted small mb-0 mt-1">{h.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3 text-muted small mb-4">No approval history yet.</div>
                  )}

                  <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2" />Approval Analytics</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 rounded-4 bg-light border">
                        <span className="x-small text-muted fw-bold text-uppercase">Avg Approval Time</span>
                        <h5 className="fw-bold mb-0 mt-1">{approvalDetails?.avgApprovalTime || '—'}</h5>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 rounded-4 bg-light border">
                        <span className="x-small text-muted fw-bold text-uppercase">Bottlenecks</span>
                        <h5 className="fw-bold mb-0 mt-1">{approvalDetails?.bottlenecks || 'None detected'}</h5>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogBox show={commentModal.show} onHide={() => setCommentModal({ show: false, action: '', id: null })} title={`${commentModal.action === 'approved' ? 'Approve' : commentModal.action === 'rejected' ? 'Reject' : 'Escalate'} Document`} size="small">
        <div className="mb-3">
          <label className="form-label fw-bold small">Comment</label>
          <textarea
            className="form-control border shadow-none rounded-3"
            rows="3"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light rounded-pill px-4 py-2 fw-bold flex-grow-1" onClick={() => setCommentModal({ show: false, action: '', id: null })}>Cancel</button>
          <button
            className={`btn rounded-pill px-4 py-2 fw-bold flex-grow-1 shadow-sm text-white ${commentModal.action === 'approved' ? 'btn-success' : commentModal.action === 'rejected' ? 'btn-danger' : 'btn-warning'}`}
            onClick={handleApprovalAction}
          >
            {commentModal.action === 'approved' ? 'Approve' : commentModal.action === 'rejected' ? 'Reject' : 'Escalate'}
          </button>
        </div>
      </DialogBox>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.2s ease-in-out; }
        .hover-lift-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        ${isDark ? `
          .card { background-color: #1e293b !important; border-color: #334155 !important; }
          .bg-light { background-color: #1e293b !important; }
          .border-light { border-color: #334155 !important; }
          .text-muted { color: #94a3b8 !important; }
          .text-dark { color: #f1f5f9 !important; }
          .bg-white { background-color: #1e293b !important; }
          .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .form-control { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; }
          .bg-opacity-5 { background-color: rgba(99,102,241,0.1) !important; }
        ` : ''}
      `}</style>
    </div>
  );
};

export default DmsApprovalWorkflow;
