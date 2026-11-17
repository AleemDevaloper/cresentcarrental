import React, { useState, useEffect } from 'react';
import { FiShield, FiUserPlus, FiKey, FiLock, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import client, { clearCache } from '../../api/client';

const AccessRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccessRequests();
    }, []);

    const fetchAccessRequests = async () => {
        setLoading(true);
        try {
            const res = await client.get('/approvals', {
                params: { view: 'admin' }
            });
            
            // Filter for access related types
            const accessTypes = ['user_registration', 'role_change', 'dashboard_access', 'account_reactivation', 'access', 'deletion'];
            const filtered = (res.data?.data || []).filter(req => accessTypes.includes(req.type));
            
            setRequests(filtered);
        } catch (err) {
            console.error("Error fetching access requests", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status) => {
        try {
            await client.patch(`/approvals/${requestId}`, {
                status,
                comment: `Access ${status === 'approved' ? 'granted' : 'denied'} by administrator.`
            });
            clearCache('/approvals');
            fetchAccessRequests();
        } catch (err) {
            console.error("Error updating access request", err);
        }
    };

    return (
        <div className="access-requests-container p-1">
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                <div className="card-body">
                    <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        <FiShield className="text-primary" /> Access & Identity Requests
                    </h5>
                    <p className="text-muted small mb-0">Manage system registration, role elevations, and specific resource access permissions.</p>
                </div>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center py-5">Loading access requests...</div>
                ) : requests.length === 0 ? (
                    <div className="col-12 text-center py-5 text-muted">No pending access requests.</div>
                ) : requests.map((req) => (
                    <div key={req.id} className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100 transition hover-lift" style={{ borderRadius: '15px' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="p-2 rounded bg-primary-subtle text-primary">
                                        {req.type === 'user_registration' ? <FiUserPlus size={20} /> : (req.type === 'role_change' ? <FiKey size={20} /> : <FiLock size={20} />)}
                                    </div>
                                    <span className={`badge bg-${req.status === 'pending' ? 'warning' : (req.status === 'approved' ? 'success' : 'danger')} px-2`}>
                                        {req.status?.toUpperCase()}
                                    </span>
                                </div>
                                <h6 className="fw-bold text-capitalize mb-1">{req.type?.replace('_', ' ')}</h6>
                                <div className="small text-muted mb-3">Requested by <b>{req.requester?.name}</b></div>
                                
                                <div className="p-2 bg-light rounded mb-3 border border-dashed">
                                    <div className="extra-small text-muted mb-1 text-uppercase fw-bold">Reason / Details</div>
                                    <div className="small">{req.reason || 'Requested standard access permissions.'}</div>
                                </div>

                                <div className="d-flex gap-2 mt-auto">
                                    {req.status === 'pending' ? (
                                        <>
                                            <button className="btn btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={() => handleAction(req.id, 'approved')}>
                                                <FiCheck /> Approve
                                            </button>
                                            <button className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1" onClick={() => handleAction(req.id, 'rejected')}>
                                                <FiX /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-light btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                                            <FiInfo /> View Record
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-primary-subtle { background-color: #eef2ff !important; }
                .extra-small { font-size: 10px; }
                .hover-lift:hover { transform: translateY(-5px); }
                .border-dashed { border-style: dashed !important; }
            `}} />
        </div>
    );
};

export default AccessRequests;
