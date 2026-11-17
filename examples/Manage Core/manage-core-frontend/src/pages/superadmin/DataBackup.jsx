import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDatabase, faSyncAlt, faExclamationTriangle, faCheckCircle,
    faTrash, faClock, faFileExcel, faFilePdf, faCode, faFileCode,
    faShield, faHardDrive, faCloudArrowUp, faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { getBackupStats, runBackup, exportBackup } from '../../api/enterprise';

const formatDateTime = (value) => {
    if (!value) return '-';
    try {
        const d = new Date(value);
        return d.toLocaleString();
    } catch {
        return value;
    }
};

const statCards = [
    { key: 'lastBackup', label: 'Last Backup', icon: faClock, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', format: (v) => formatDateTime(v) },
    { key: 'totalBackups', label: 'Total Backups', icon: faDatabase, color: '#10b981', bg: 'rgba(16,185,129,0.1)', format: (v) => v ?? 0 },
    { key: 'successRate', label: 'Success Rate', icon: faChartLine, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', format: (v) => v ?? '0%' },
    { key: 'storageUsed', label: 'Storage Used', icon: faHardDrive, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', format: (v) => v ?? '0 MB' },
];

const exportFormats = [
    { key: 'sql', label: 'SQL', icon: faCode, color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
    { key: 'excel', label: 'Excel', icon: faFileExcel, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { key: 'nosql', label: 'NoSQL', icon: faFileCode, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { key: 'pdf', label: 'PDF', icon: faFilePdf, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const DataBackup = () => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [stats, setStats] = useState({
        lastBackup: null, totalBackups: 0, successRate: '0%', storageUsed: '0 MB',
    });

    const fetchStats = async () => {
        setRefreshing(true);
        setError('');
        try {
            const data = await getBackupStats();
            setStats(data || {});
        } catch (e) {
            setError('Failed to fetch backup stats.');
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleRunBackup = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await runBackup();
            setSuccess('Backup started. Check backup logs for progress.');
            await fetchStats();
        } catch (e) {
            setError(e?.message || 'Failed to run backup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="px-3 pb-4" variants={containerVariants} initial="hidden" animate="visible">
            {success && (
                <motion.div variants={itemVariants} className="alert alert-success d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-3" />
                    <div className="fw-bold">{success}</div>
                </motion.div>
            )}
            {error && (
                <motion.div variants={itemVariants} className="alert alert-danger d-flex align-items-center shadow-sm rounded-4 border-0 mb-4 py-3 px-4" role="alert">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />
                    <div className="fw-bold">{error}</div>
                </motion.div>
            )}

            <div className="row g-4">
                <div className="col-lg-7">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h5 className="fw-bold mb-0">Backup Overview</h5>
                                    <div className="text-muted small">Platform-wide backup integrity snapshot</div>
                                </div>
                                <button className="btn btn-light border rounded-3 px-3 py-2 fw-bold shadow-xs" onClick={fetchStats} disabled={refreshing}>
                                    <FontAwesomeIcon icon={faSyncAlt} className={`me-2 ${refreshing ? 'fa-spin' : ''}`} />
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            <div className="row g-3 mb-4">
                                {statCards.map((card) => (
                                    <div className="col-md-6" key={card.key}>
                                        <div className="p-4 rounded-4 d-flex align-items-center gap-3" style={{ background: card.bg, border: '1px solid rgba(0,0,0,0.04)' }}>
                                            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: card.bg }}>
                                                <FontAwesomeIcon icon={card.icon} style={{ color: card.color }} />
                                            </div>
                                            <div>
                                                <div className="text-muted small fw-bold">{card.label}</div>
                                                <div className="fw-bold fs-5">{card.format(stats[card.key])}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.button
                                className="btn btn-primary rounded-4 px-4 py-3 fw-bold w-100 shadow-sm mb-4 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleRunBackup}
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <FontAwesomeIcon icon={faCloudArrowUp} className={loading ? 'fa-spin' : ''} />
                                {loading ? 'Running Backup...' : 'Run Backup Now'}
                            </motion.button>

                            <div>
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faShield} className="text-primary" />
                                    Export Database
                                </h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {exportFormats.map((fmt) => (
                                        <button
                                            key={fmt.key}
                                            onClick={() => exportBackup(fmt.key)}
                                            className="btn rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2 border-0"
                                            style={{ background: fmt.bg, color: fmt.color }}
                                        >
                                            <FontAwesomeIcon icon={fmt.icon} />
                                            {fmt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="col-lg-5">
                    <motion.div variants={itemVariants} className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column">
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-4 bg-primary p-3 text-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: 54, height: 54 }}>
                                    <FontAwesomeIcon icon={faShield} className="fs-5" />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">Maintenance Tools</h5>
                                    <div className="text-muted small">Backup lifecycle management</div>
                                </div>
                            </div>

                            <div className="d-grid gap-2 flex-grow-1">
                                <button className="btn btn-outline-danger rounded-4 py-3 fw-bold" type="button" disabled>
                                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                                    Purge Old Backup Logs
                                </button>
                                <button className="btn btn-outline-primary rounded-4 py-3 fw-bold" type="button" disabled>
                                    <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
                                    Validate Backup Integrity
                                </button>
                                <button className="btn btn-outline-secondary rounded-4 py-3 fw-bold" type="button" disabled>
                                    <FontAwesomeIcon icon={faHardDrive} className="me-2" />
                                    View Backup Logs
                                </button>
                            </div>

                            <div className="alert alert-info mt-4 rounded-4 border-0 shadow-sm mb-0">
                                <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faDatabase} className="text-primary" />
                                    <span className="small fw-bold">Backup logs persist via <code className="text-primary">/api/v1/backups/*</code></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DataBackup;
