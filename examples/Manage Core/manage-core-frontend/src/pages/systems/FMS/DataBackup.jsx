
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCloudArrowUp, faDatabase, faHistory, faRotateLeft,
    faShield, faServer, faLock, faCheckCircle,
    faTimes, faGear, faArrowsRotate, faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
import { runBackup } from '../../../api/enterprise';

const DataBackup = ({ isDark }) => {
    const { addNotification } = useApp();
    const [runningBackup, setRunningBackup] = useState(false);
    const [stats, setStats] = useState({ lastBackup: '', totalBackups: 0, successRate: '0%', storageUsed: '0 GB' });
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTabData('data-backup').then(res => {
            const data = res.data?.data || {};
            setStats({ lastBackup: data.lastBackup || '', totalBackups: data.totalBackups || 0, successRate: data.successRate || '0%', storageUsed: data.storageUsed || '0 GB' });
            setBackups(data.backups || []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const startBackup = async () => {
        setRunningBackup(true);
        try {
            await runBackup();
            addNotification("Backup started successfully", 'success');
        } catch (error) {
            console.error("Backup failed", error);
        } finally {
            setRunningBackup(false);
        }
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faDatabase} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Financial Data Vault & Backup</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Disaster Recovery, Point-in-Time Restore & Encryption Control</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faGear} className="me-2" /> RETENTION POLICY
                            </button>
                            <button 
                                className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm"
                                disabled={runningBackup}
                                onClick={startBackup}
                            >
                                {runningBackup ? (
                                    <><FontAwesomeIcon icon={faArrowsRotate} className="me-2 spin" /> SYNCING...</>
                                ) : (
                                    <><FontAwesomeIcon icon={faCloudArrowUp} className="me-2" /> TRIGGER MANUAL SNAPSHOT</>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="p-5 rounded-5 bg-dark text-white shadow-lg h-100 position-relative overflow-hidden d-flex align-items-center justify-content-between border">
                                <div className="z-index-1">
                                    <h6 className="uppercase fw-black x-small ls-wide opacity-50 mb-3">Health Status</h6>
                                    <h2 className="fw-black mb-1 text-success">
                                        <FontAwesomeIcon icon={faShield} className="me-2" />
                                        All Nodes Protected
                                    </h2>
                                    <p className="x-small fw-bold text-white-50 mt-2 uppercase ls-wide">Next Auto-Sync: 46 Minutes</p>
                                </div>
                                <div className="z-index-1 text-end">
                                    <div className="x-small fw-bold opacity-50 uppercase mb-2">Vault Storage</div>
                                    <div className="fw-black h3 mb-0">45.8 GB <small className="opacity-25 h6 fw-bold">/ 500 GB</small></div>
                                    <div className="progress mt-3 border border-white border-opacity-10" style={{ height: '6px', width: '220px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '9%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4 text-dark">Security Cluster</h6>
                                <div className="space-y-4">
                                    {[
                                        { l: 'AES-256 Encryption', i: faLock, c: 'text-primary' },
                                        { l: 'Geo-Redundant Sync', i: faServer, c: 'text-success' },
                                    ].map((s, i) => (
                                        <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                            <div className="rounded-circle bg-white shadow-sm p-3 border">
                                                <FontAwesomeIcon icon={s.i} className={s.c} />
                                            </div>
                                            <div>
                                                <div className="x-small fw-black text-dark">{s.l}</div>
                                                <div className="x-small text-muted fw-bold">Active and Verified</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Registry */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-black mb-0 text-dark">Snapshot Retention Registry</h5>
                        <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '200px' }}>
                            <span className="input-group-text bg-transparent border-0 ps-3">
                                <FontAwesomeIcon icon={faHistory} className="text-muted" />
                            </span>
                            <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Filter Date..." />
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive p-5 pt-3">
                            <table className="table table-hover align-middle mb-0">
                                <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                    <tr>
                                        <th className="px-4 py-3 border-0">Archive Label</th>
                                        <th className="py-3 border-0">Type</th>
                                        <th className="py-3 border-0 text-end">Size</th>
                                        <th className="py-3 border-0 text-center">Retention</th>
                                        <th className="px-4 py-3 border-0 text-end">Restore</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {backups.map(bak => (
                                        <tr key={bak.id} className="border-0">
                                            <td className="px-4 py-4 border-0">
                                                <div className="fw-black small text-primary">{bak.name}</div>
                                                <div className="text-muted x-small fw-bold">Created: {bak.date}</div>
                                            </td>
                                            <td className="border-0">
                                                <span className="x-small fw-black text-muted uppercase">{bak.type}</span>
                                            </td>
                                            <td className="border-0 text-end fw-bold small text-dark">{bak.size}</td>
                                            <td className="border-0 text-center">
                                                <span className="badge bg-light text-muted border rounded-pill px-3 x-small fw-bold">{bak.retention}</span>
                                            </td>
                                            <td className="px-4 border-0 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button className="btn btn-xs btn-outline-primary rounded-pill x-small fw-black px-3 shadow-xs">
                                                        <FontAwesomeIcon icon={faRotateLeft} className="me-1" /> REVERT
                                                    </button>
                                                    <button className="btn btn-xs btn-light rounded-circle text-danger border"><FontAwesomeIcon icon={faTrashCan} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                .z-index-1 { z-index: 1; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
                .text-dark { color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default DataBackup;
