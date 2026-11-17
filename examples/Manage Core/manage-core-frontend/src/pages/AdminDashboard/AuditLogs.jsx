import React, { useState, useEffect } from 'react';
import { FiActivity, FiSearch, FiFilter, FiDownload, FiUser, FiCalendar } from 'react-icons/fi';
import client from '../../api/client';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await client.get('/approvals', {
                params: { view: 'admin' }
            });
            
            // Flatten history into logs
            const allLogs = [];
            res.data.data.forEach(req => {
                if (req.history) {
                    req.history.forEach(h => {
                        allLogs.push({
                            id: h.id,
                            requestId: req.id,
                            type: req.type,
                            action: h.action,
                            performedBy: h.user?.name,
                            email: h.user?.email,
                            timestamp: h.created_at,
                            note: h.note
                        });
                    });
                }
            });
            
            setLogs(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        } catch (err) {
            console.error("Error fetching audit logs", err);
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        switch (action) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'created': return 'primary';
            case 'escalated': return 'purple';
            case 'sent_back': return 'warning';
            default: return 'secondary';
        }
    };

    const filteredLogs = logs.filter(log => 
        log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="audit-logs-container p-1">
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                            <FiActivity className="text-primary" /> System Audit Logs
                        </h5>
                        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
                            <FiDownload /> Export CSV
                        </button>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0 text-muted"><FiSearch /></span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0" 
                                    placeholder="Filter by user, action or type..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-transparent border-end-0 text-muted"><FiCalendar /></span>
                                <input type="date" className="form-control border-start-0" />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2" onClick={fetchLogs}>
                                <FiFilter /> Advanced Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 text-muted small text-uppercase">Timestamp</th>
                                <th className="py-3 text-muted small text-uppercase">Performed By</th>
                                <th className="py-3 text-muted small text-uppercase">Action</th>
                                <th className="py-3 text-muted small text-uppercase">Module / Type</th>
                                <th className="py-3 text-muted small text-uppercase">Request ID</th>
                                <th className="pe-4 py-3 text-muted small text-uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5">Loading logs...</td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-5">No logs found.</td></tr>
                            ) : filteredLogs.map((log, idx) => (
                                <tr key={idx}>
                                    <td className="ps-4 small">
                                        <div className="fw-medium">{new Date(log.timestamp).toLocaleDateString()}</div>
                                        <div className="text-muted extra-small">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 28, height: 28 }}>
                                                <FiUser className="text-muted small" />
                                            </div>
                                            <div>
                                                <div className="small fw-bold">{log.performedBy}</div>
                                                <div className="extra-small text-muted">{log.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${getActionBadge(log.action)}-subtle text-${getActionBadge(log.action)} text-uppercase`} style={{ fontSize: '10px' }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-capitalize small fw-medium">{log.type.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <span className="fw-bold small">REQ-{1000 + log.requestId}</span>
                                    </td>
                                    <td className="pe-4 small text-muted">
                                        {log.note || 'Action performed on request.'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .extra-small { font-size: 10px; }
                .text-purple { color: #6f42c1; }
                .bg-purple-subtle { background-color: #f3e8ff; }
            `}} />
        </div>
    );
};

export default AuditLogs;
