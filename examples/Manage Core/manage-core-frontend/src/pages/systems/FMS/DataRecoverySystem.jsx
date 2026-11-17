
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDatabase, faRetweet, faShieldVirus, faServer,
    faCloudUploadAlt, faHistory, faCheckCircle, faExclamationTriangle,
    faSearch, faDownload, faSyncAlt, faLock
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const DataRecoverySystem = ({ isDark }) => {
    const [isSimulating, setIsSimulating] = useState(false);

    const [recoveryStats, setRecoveryStats] = useState([]);
    const [backupHistory, setBackupHistory] = useState([]);
    useEffect(() => { getTabData('data-recovery').then(res => { const d = res.data?.data || {}; setRecoveryStats(d.recoveryStats || []); setBackupHistory(d.backupHistory || []); }).catch(() => {}); }, []);

    const handleSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => setIsSimulating(false), 3000);
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faDatabase} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Data Recovery System</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Disaster Recovery & Enterprise Continuity Management</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className={`btn rounded-pill px-4 fw-black x-small shadow-sm ${isSimulating ? 'btn-light disabled' : 'btn-outline-primary border-2'}`}
                                onClick={handleSimulation}
                            >
                                <FontAwesomeIcon icon={faSyncAlt} className={`me-2 ${isSimulating ? 'fa-spin' : ''}`} /> 
                                {isSimulating ? 'SIMULATING...' : 'SIMULATE RECOVERY'}
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faRetweet} className="me-2" /> RESTORE POINT
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {recoveryStats.map((s, i) => (
                            <div key={i} className="col-md-3">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border position-relative overflow-hidden`}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <FontAwesomeIcon icon={s.icon} className="fs-2" />
                                    </div>
                                    <h3 className="fw-black mb-1" style={{ color: s.color }}>{s.value}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{s.label}</div>
                                    <div className="x-small text-muted opacity-75 mt-2 fw-bold">{s.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {/* Backup Timeline */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Incremental Backup History</h5>
                                    <span className="badge rounded-pill bg-success-subtle text-success x-small fw-black px-3">PROTECTED</span>
                                </div>
                                <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faDownload} /></button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Snapshot ID</th>
                                                <th className="py-3 border-0">Timestamp</th>
                                                <th className="py-3 border-0">Type</th>
                                                <th className="px-5 py-3 border-0 text-end">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {backupHistory.map((backup, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${isDark ? 'bg-dark-alt' : 'bg-light'} text-primary`}>
                                                                <FontAwesomeIcon icon={faServer} className="x-small" />
                                                            </div>
                                                            <div className="fw-black small">{backup.version}</div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 fw-bold x-small text-muted">{backup.date}</td>
                                                    <td className="border-0">
                                                        <span className="x-small fw-bold text-muted uppercase border px-2 py-1 rounded">{backup.type}</span>
                                                    </td>
                                                    <td className="px-5 border-0 text-end">
                                                        <span className="badge rounded-pill bg-success x-small fw-black px-3">
                                                            {backup.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Continuity Sidebar */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faShieldVirus} />
                                </div>
                                <h6 className="fw-black mb-0 uppercase ls-wide">Disaster Recovery</h6>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: "Geo-Redundancy", desc: "Data mirrored across 3 geographic regions.", icon: faServer },
                                    { title: "Point-in-Time", desc: "Roll back to any minute in the last 30 days.", icon: faHistory },
                                    { title: "Zero Data Loss", desc: "Synchronous replication for critical databases.", icon: faShieldVirus },
                                    { title: "End-to-End Encryption", desc: "AES-256 encryption for all backup volumes.", icon: faLock }
                                ].map((feature, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white shadow-sm border'} mb-3`}>
                                        <div className="d-flex gap-3">
                                            <FontAwesomeIcon icon={feature.icon} className="text-primary mt-1" />
                                            <div>
                                                <div className="small fw-black uppercase x-small mb-1">{feature.title}</div>
                                                <p className="x-small mb-0 fw-bold opacity-75">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary w-100 rounded-pill mt-4 fw-black x-small py-3 shadow-primary">
                                VIEW FULL RECOVERY LOGS
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
            `}</style>
        </div>
    );
};

export default DataRecoverySystem;
