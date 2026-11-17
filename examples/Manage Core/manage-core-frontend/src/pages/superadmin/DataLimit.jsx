import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHdd, faSyncAlt, faExclamationTriangle, faCheckCircle,
    faUserShield, faChartPie, faDatabase, faSave, faUsers,
    faHardDrive, faInfoCircle, faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { getStorageLimits, updateStorageLimit } from '../../api/settings';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const DataLimit = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const fetchLimits = async () => {
        setFetching(true);
        setError('');
        try {
            const data = await getStorageLimits();
            setUsers(data?.data || data || []);
        } catch (err) {
            setError('Failed to fetch storage limits.');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchLimits(); }, []);

    const handleLimitChange = (id, newLimit) => {
        const parsed = parseInt(newLimit, 10);
        setUsers((prev) =>
            prev.map((user) => (user.id === id ? { ...user, totalSpace: Number.isFinite(parsed) ? parsed : 0 } : user))
        );
    };

    const handleSave = async (userId) => {
        const user = users.find((u) => u.id === userId);
        if (!user) return;
        setLoading(true);
        setError('');
        try {
            await updateStorageLimit(userId, user.totalSpace);
            setSuccessMessage(`Storage quota updated for ${user.name}.`);
            setTimeout(() => setSuccessMessage(''), 3000);
            await fetchLimits();
        } catch (err) {
            setError(err?.message || 'Failed to update storage limit.');
        } finally {
            setLoading(false);
        }
    };

    const getUsagePercentage = (used, total) => {
        if (!total) return 0;
        return Math.min(Math.round((used / total) * 100), 100);
    };

    const getStatusColor = (percentage) => {
        if (percentage > 90) return '#ef4444';
        if (percentage > 70) return '#f59e0b';
        return '#10b981';
    };

    const totalUsedBytes = useMemo(() => users.reduce((acc, user) => acc + (user.usedSpace || 0), 0), [users]);
    const formattedTotalUsed = useMemo(() => {
        if (totalUsedBytes > 1024) return (totalUsedBytes / 1024).toFixed(2) + ' GB';
        return totalUsedBytes.toFixed(2) + ' MB';
    }, [totalUsedBytes]);

    const usersApproachingLimit = useMemo(
        () => users.filter((user) => getUsagePercentage(user.usedSpace, user.totalSpace) > 80).length,
        [users]
    );

    const totalAllocated = useMemo(() => users.reduce((acc, u) => acc + (u.totalSpace || 0), 0), [users]);

    if (fetching) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}>Loading Storage Limits...</p>
            </div>
        );
    }

    return (
        <motion.div className="px-3 pb-4" variants={containerVariants} initial="hidden" animate="visible">
            {successMessage && (
                <motion.div variants={itemVariants} className="alert alert-success d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-3" />
                    <div className="fw-bold">{successMessage}</div>
                </motion.div>
            )}
            {error && (
                <motion.div variants={itemVariants} className="alert alert-danger d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />
                    <div className="fw-bold">{error}</div>
                </motion.div>
            )}

            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(79,70,229,0.1)' }}>
                                <FontAwesomeIcon icon={faUsers} className="text-primary fs-4" />
                            </div>
                            <h3 className="fw-bold mb-0">{users.length}</h3>
                            <small className="text-muted">Users Tracked</small>
                        </div>
                    </motion.div>
                </div>
                <div className="col-md-3">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(16,185,129,0.1)' }}>
                                <FontAwesomeIcon icon={faHardDrive} className="text-success fs-4" />
                            </div>
                            <h3 className="fw-bold mb-0">{formattedTotalUsed}</h3>
                            <small className="text-muted">Total Used</small>
                        </div>
                    </motion.div>
                </div>
                <div className="col-md-3">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(245,158,11,0.1)' }}>
                                <FontAwesomeIcon icon={faDatabase} className="text-warning fs-4" />
                            </div>
                            <h3 className="fw-bold mb-0">{totalAllocated} MB</h3>
                            <small className="text-muted">Total Allocated</small>
                        </div>
                    </motion.div>
                </div>
                <div className="col-md-3">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ background: 'rgba(239,68,68,0.1)' }}>
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger fs-4" />
                            </div>
                            <h3 className="fw-bold mb-0">{usersApproachingLimit}</h3>
                            <small className="text-muted">Near/Over Limit</small>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xl-8">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faUserShield} className="text-primary" />
                                    <h5 className="fw-bold mb-0">User Storage Allocation</h5>
                                </div>
                                <button className="btn btn-light border rounded-3 px-3 py-2 fw-bold shadow-xs" onClick={fetchLimits} disabled={fetching}>
                                    <FontAwesomeIcon icon={faSyncAlt} className={`me-2 ${fetching ? 'fa-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold" style={{ fontSize: '10px' }}>
                                        <tr>
                                            <th className="py-3 px-4">User</th>
                                            <th className="py-3 text-center">Utilization</th>
                                            <th className="py-3">Quota (MB)</th>
                                            <th className="py-3 px-4 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => {
                                            const percentage = getUsagePercentage(user.usedSpace, user.totalSpace);
                                            const statusColor = getStatusColor(percentage);
                                            return (
                                                <tr key={user.id}>
                                                    <td className="py-4 px-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontSize: 14 }}>
                                                                {user.name?.charAt?.(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold small">{user.name}</div>
                                                                <div className="small text-muted">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div style={{ minWidth: 180 }}>
                                                            <div className="d-flex justify-content-between mb-1">
                                                                <span className="small text-muted">{user.usedSpace} MB used</span>
                                                                <span className="small fw-bold" style={{ color: statusColor }}>{percentage}%</span>
                                                            </div>
                                                            <div className="progress rounded-pill bg-light" style={{ height: 8 }}>
                                                                <div className="progress-bar rounded-pill" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: statusColor }} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="input-group input-group-sm" style={{ maxWidth: 140 }}>
                                                            <input
                                                                type="number"
                                                                className="form-control border-0 bg-light fw-bold text-center"
                                                                value={user.totalSpace}
                                                                onChange={(e) => handleLimitChange(user.id, e.target.value)}
                                                            />
                                                            <span className="input-group-text bg-light border-0 small text-muted fw-bold">MB</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-end">
                                                        <button
                                                            className="btn btn-sm btn-primary rounded-3 px-3 fw-bold shadow-xs"
                                                            onClick={() => handleSave(user.id)}
                                                            disabled={loading}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} className="me-1" />
                                                            Save
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="col-xl-4">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-4 bg-primary p-3 d-flex align-items-center justify-content-center text-white shadow-sm" style={{ width: 54, height: 54 }}>
                                    <FontAwesomeIcon icon={faHdd} className="fs-5" />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">Storage Insights</h5>
                                    <div className="text-muted small">Platform allocation overview</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-4 bg-light mb-4">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <FontAwesomeIcon icon={faChartPie} className="text-primary" />
                                    <span className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '1px' }}>Total Utilization</span>
                                </div>
                                <h2 className="fw-bold mb-1">{formattedTotalUsed}</h2>
                                <div className="small text-muted">Across {users.length} provisioned users</div>
                                <div className="progress mt-3 bg-white rounded-pill" style={{ height: 6 }}>
                                    <div className="progress-bar bg-primary rounded-pill" style={{ width: totalAllocated > 0 ? `${Math.min((totalUsedBytes / totalAllocated) * 100, 100)}%` : '0%' }} />
                                </div>
                            </div>

                            {usersApproachingLimit > 0 && (
                                <div className="p-4 rounded-4 mb-4" style={{ background: 'rgba(245,158,11,0.08)', borderLeft: '4px solid #f59e0b' }}>
                                    <div className="d-flex align-items-center gap-2 text-warning mb-2">
                                        <FontAwesomeIcon icon={faExclamationTriangle} />
                                        <span className="fw-bold small text-uppercase">Alert</span>
                                    </div>
                                    <p className="small fw-bold mb-0">
                                        {usersApproachingLimit} user{usersApproachingLimit > 1 ? 's are' : ' is'} above 80% threshold.
                                    </p>
                                </div>
                            )}

                            <div className="mt-auto p-3 rounded-4 d-flex align-items-center gap-3" style={{ background: 'rgba(79,70,229,0.06)' }}>
                                <FontAwesomeIcon icon={faInfoCircle} className="text-primary" />
                                <span className="small fw-bold text-primary">Changes persist via <code>PATCH /api/v1/storage-limits/:id</code></span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DataLimit;
