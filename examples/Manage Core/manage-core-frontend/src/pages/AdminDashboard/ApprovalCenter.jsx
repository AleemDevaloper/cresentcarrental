import React, { useState, useEffect } from 'react';
import { 
    FiSearch, FiFilter, FiCheckCircle, FiXCircle, FiClock, 
    FiAlertCircle, FiTrendingUp, FiMoreVertical, FiChevronRight,
    FiMessageSquare, FiPaperclip, FiActivity, FiUser, FiInfo,
    FiSend, FiShield, FiCornerUpRight, FiRefreshCw
} from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';
import client, { clearCache } from '../../api/client';

const ApprovalCenter = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pending: 0,
        approved_today: 0,
        rejected_today: 0,
        high_priority: 0
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        fetchRequests();
        fetchStats();
    }, [filters.status, filters.type, filters.priority, filters.search]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await client.get('/approvals', {
                params: { ...filters, view: 'admin' }
            });
            setRequests(res.data?.data || []);
        } catch (err) {
            console.error("Error fetching requests", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await client.get('/approvals/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    const handleAction = async (requestId, status, actionComment = '') => {
        try {
            await client.patch(`/approvals/${requestId}`, {
                status,
                comment: actionComment || comment
            });
            
            clearCache('/approvals');
            setComment('');
            fetchRequests();
            fetchStats();
            if (selectedRequest && selectedRequest.id === requestId) {
                const updatedRes = await client.get(`/approvals/${requestId}`);
                setSelectedRequest(updatedRes.data.data);
            }
        } catch (err) {
            console.error("Error updating request", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'in_review': return 'info';
            case 'escalated': return 'purple';
            case 'sent_back': return 'orange';
            default: return 'secondary';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'primary';
            case 'low': return 'info';
            default: return 'secondary';
        }
    };

    const kpiCards = [
        { label: 'Pending Requests', value: stats.pending, icon: <FiClock />, color: '#ffc107', bg: 'rgba(255, 193, 7, 0.1)' },
        { label: 'Approved Today', value: stats.approved_today, icon: <FiCheckCircle />, color: '#198754', bg: 'rgba(25, 135, 84, 0.1)' },
        { label: 'Rejected Today', value: stats.rejected_today, icon: <FiXCircle />, color: '#dc3545', bg: 'rgba(220, 53, 69, 0.1)' },
        { label: 'High Priority', value: stats.high_priority, icon: <FiAlertCircle />, color: '#fd7e14', bg: 'rgba(253, 126, 20, 0.1)' },
        { label: 'Avg. Response', value: '2.4h', icon: <FiTrendingUp />, color: '#0dcaf0', bg: 'rgba(13, 202, 240, 0.1)' }
    ];

    return (
        <div className="approval-center-container p-1">
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
                {kpiCards.map((card, idx) => (
                    <div key={idx} className="col-md">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                            <div className="card-body d-flex align-items-center gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 45, height: 45, backgroundColor: card.bg, color: card.color }}>
                                    {card.icon}
                                </div>
                                <div>
                                    <div className="text-muted small fw-medium">{card.label}</div>
                                    <div className="fs-4 fw-bold" style={{ color: 'var(--text-main)' }}>{card.value}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0 text-muted"><FiSearch /></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Search by ID, Requester or Type..." 
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
                                <option value="">All Types</option>
                                <option value="leave_request">Leave Request</option>
                                <option value="expense">Expense Approval</option>
                                <option value="role_change">Role Change</option>
                                <option value="user_registration">User Registration</option>
                                <option value="asset_deletion">Asset Deletion</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="in_review">In Review</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})}>
                                <option value="">All Priority</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => fetchRequests()}>
                                <FiFilter /> Filter
                            </button>
                            <button className="btn btn-light" onClick={() => setFilters({status:'', type:'', priority:'', search:''})}>
                                <FiRefreshCw />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Table */}
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-muted small text-uppercase">Request ID</th>
                                <th className="py-3 text-muted small text-uppercase">Type</th>
                                <th className="py-3 text-muted small text-uppercase">Requested By</th>
                                <th className="py-3 text-muted small text-uppercase">Priority</th>
                                <th className="py-3 text-muted small text-uppercase">Submitted Date</th>
                                <th className="py-3 text-muted small text-uppercase">Status</th>
                                <th className="pe-4 py-3 text-end text-muted small text-uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Loading requests...
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">No requests found matching filters.</td>
                                </tr>
                            ) : requests.map((req) => (
                                <tr key={req.id} onClick={() => { setSelectedRequest(req); setIsDrawerOpen(true); }} style={{ cursor: 'pointer' }}>
                                    <td className="ps-4 fw-bold">REQ-{1000 + req.id}</td>
                                    <td>
                                        <span className="text-capitalize">{req.type?.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                                <FiUser className="text-muted" />
                                            </div>
                                            <div>
                                                <div className="fw-medium small">{req.requester?.name || 'Unknown'}</div>
                                                <div className="text-muted extra-small">{req.requester?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getPriorityColor(req.priority)}-subtle text-${getPriorityColor(req.priority)} text-uppercase px-2`} style={{ fontSize: '10px' }}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="small text-muted">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getStatusColor(req.status)} px-3 rounded-pill fw-medium`} style={{ fontSize: '11px' }}>
                                            {req.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="pe-4 text-end">
                                        <button className="btn btn-icon btn-light rounded-circle" onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); setIsDrawerOpen(true); }}>
                                            <FiChevronRight />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Drawer */}
            <div className={`drawer-overlay ${isDrawerOpen ? 'show' : ''}`} onClick={() => setIsDrawerOpen(false)}></div>
            <div className={`request-drawer p-0 ${isDrawerOpen ? 'open' : ''}`} style={{ width: '450px', backgroundColor: 'var(--card-bg)' }}>
                {selectedRequest && (
                    <div className="d-flex flex-column h-100">
                        {/* Drawer Header */}
                        <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1 fw-bold">Request Details</h5>
                                <div className="text-muted small">REQ-{1000 + selectedRequest.id} • Submitted on {new Date(selectedRequest.created_at).toLocaleDateString()}</div>
                            </div>
                            <button className="btn-close" onClick={() => setIsDrawerOpen(false)}></button>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-grow-1 overflow-auto p-4">
                            {/* Status Section */}
                            <div className="mb-4 d-flex justify-content-between align-items-center p-3 rounded bg-light border border-dashed">
                                <span className="text-muted fw-medium">Current Status</span>
                                <span className={`badge bg-${getStatusColor(selectedRequest.status)} px-3 py-2 rounded-pill`}>
                                    {selectedRequest.status?.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>

                            {/* Request Info */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FiInfo className="text-primary" /> Request Information</h6>
                                <div className="p-3 border rounded shadow-sm">
                                    <div className="mb-2">
                                        <label className="text-muted small d-block">Type</label>
                                        <span className="fw-medium text-capitalize">{selectedRequest.type?.replace('_', ' ')}</span>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-muted small d-block">Requester</label>
                                        <span className="fw-medium">{selectedRequest.requester?.name}</span>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-muted small d-block">Reason</label>
                                        <p className="mb-0 small">{selectedRequest.reason || 'No reason provided.'}</p>
                                    </div>
                                    {selectedRequest.metadata && (
                                        <div className="mt-3 p-2 bg-light rounded border">
                                            <label className="text-muted small d-block mb-1">Additional Details</label>
                                            <pre className="extra-small mb-0" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(selectedRequest.metadata, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Approval History */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FiActivity className="text-primary" /> Approval History</h6>
                                <div className="timeline ps-3">
                                    {selectedRequest.history?.map((entry, idx) => (
                                        <div key={idx} className="timeline-item position-relative pb-3 ps-4 border-start">
                                            <div className="timeline-marker position-absolute rounded-circle bg-primary" style={{ width: 10, height: 10, left: -5, top: 5 }}></div>
                                            <div className="small fw-bold text-capitalize">{entry.action} by {entry.user?.name}</div>
                                            <div className="extra-small text-muted mb-1">{new Date(entry.created_at).toLocaleString()}</div>
                                            {entry.note && <div className="extra-small p-2 bg-light rounded">{entry.note}</div>}
                                        </div>
                                    ))}
                                    {(!selectedRequest.history || selectedRequest.history.length === 0) && (
                                        <div className="small text-muted">No history recorded yet.</div>
                                    )}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FiMessageSquare className="text-primary" /> Comments</h6>
                                <div className="comments-list mb-3">
                                    {selectedRequest.comments?.map((c, idx) => (
                                        <div key={idx} className="d-flex gap-2 mb-3">
                                            <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 28, height: 28 }}>
                                                <FiUser className="text-muted small" />
                                            </div>
                                            <div className="bg-light p-2 rounded flex-grow-1 border">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="fw-bold extra-small">{c.user?.name}</span>
                                                    <span className="text-muted extra-small">{new Date(c.created_at).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="small">{c.comment}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Add a comment..." 
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAction(selectedRequest.id, selectedRequest.status, comment)}
                                    />
                                    <button className="btn btn-primary" onClick={() => handleAction(selectedRequest.id, selectedRequest.status, comment)}>
                                        <FiSend />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Actions */}
                        {selectedRequest.status === 'pending' && (
                            <div className="p-4 border-top bg-white d-flex gap-2">
                                <button className="btn btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2" onClick={() => handleAction(selectedRequest.id, 'approved')}>
                                    <FiCheckCircle /> Approve
                                </button>
                                <button className="btn btn-danger flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2" onClick={() => handleAction(selectedRequest.id, 'rejected')}>
                                    <FiXCircle /> Reject
                                </button>
                                <div className="dropdown">
                                    <button className="btn btn-light" data-bs-toggle="dropdown">
                                        <FiMoreVertical />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                        <li><button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleAction(selectedRequest.id, 'sent_back')}><FiShield className="text-warning" /> Send Back</button></li>
                                        <li><button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => handleAction(selectedRequest.id, 'escalated')}><FiCornerUpRight className="text-purple" /> Escalate</button></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .request-drawer {
                    position: fixed;
                    right: -450px;
                    top: 0;
                    bottom: 0;
                    z-index: 1050;
                    transition: right 0.3s ease;
                    box-shadow: -5px 0 25px rgba(0,0,0,0.1);
                }
                .request-drawer.open { right: 0; }
                .drawer-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 1040;
                    display: none;
                    backdrop-filter: blur(2px);
                }
                .drawer-overlay.show { display: block; }
                .text-purple { color: #6f42c1; }
                .bg-purple { background-color: #6f42c1; }
                .extra-small { font-size: 10px; }
                .avatar { font-size: 14px; }
                .timeline-marker { z-index: 1; border: 2px solid white; }
                .timeline-item:last-child { border-left: none !important; }
                .border-dashed { border-style: dashed !important; }
            `}} />
        </div>
    );
};

export default ApprovalCenter;
