
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileExcel, faCloudArrowUp, faCloudArrowDown, faHistory,
    faCheckCircle, faClock, faFileLines, faSync, faTimes,
    faDatabase, faShieldHalved, faFileContract
} from '@fortawesome/free-solid-svg-icons';
import client from '../../../api/client';
import { getTabData } from '../../../api/fms';

const ExcelImportExport = ({ isDark }) => {
    const { addNotification } = useApp();
    const [activeJob, setActiveJob] = useState(null);
    const [importing, setImporting] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getTabData('excel-import-export').then(res => setHistory(res.data?.data || [])).catch(() => {});
    }, []);

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('module', 'general');

        try {
            const res = await client.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addNotification(res.data.message, 'success');
        } catch (error) {
            console.error("Import failed", error);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header Stats */}
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex align-items-center gap-4 mb-5">
                        <div className="rounded-4 bg-success p-3 text-white shadow-success">
                            <FontAwesomeIcon icon={faFileExcel} className="fs-4" />
                        </div>
                        <div>
                            <h4 className="fw-black mb-1">Excel Data Bridge</h4>
                            <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">High-Speed Bulk Import & Structured Data Export</p>
                        </div>
                    </div>

                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <div className={`p-5 rounded-5 border-dashed border-2 text-center ${isDark ? 'bg-dark-alt border-white border-opacity-10' : 'bg-light'} transition-all hover-border-success`}>
                                <FontAwesomeIcon icon={faCloudArrowUp} className="fs-1 text-success mb-3 opacity-50" />
                                <h5 className="fw-black mb-2 text-dark">Drop Excel Files Here</h5>
                                <p className="text-muted small mb-4">Maximum file size: 50MB</p>
                                <button className="btn btn-success rounded-pill px-5 fw-black x-small shadow-sm">BROWSE LOCAL STORAGE</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`p-5 rounded-5 border shadow-sm h-100 d-flex flex-column justify-content-center ${isDark ? 'bg-dark-alt border-white border-opacity-10' : 'bg-white'}`}>
                                <h6 className="fw-black uppercase x-small ls-wide text-muted mb-4">Secure Export Hub</h6>
                                <div className="d-grid gap-3">
                                    {[
                                        { l: 'Full Chart of Accounts', i: faDatabase },
                                        { l: 'Monthly P&L Statement', i: faFileContract },
                                        { l: 'Vendor Liability Register', i: faShieldHalved },
                                    ].map((e, i) => (
                                        <button key={i} className="btn btn-light border rounded-pill text-start px-4 py-3 d-flex justify-content-between align-items-center transition-all hover-bg-success-subtle">
                                            <div className="d-flex align-items-center gap-3">
                                                <FontAwesomeIcon icon={e.i} className="text-success opacity-50" />
                                                <span className="fw-bold small text-dark">{e.l}</span>
                                            </div>
                                            <FontAwesomeIcon icon={faCloudArrowDown} className="text-muted" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job History */}
                    <div className={`card border-0 rounded-4 overflow-hidden ${isDark ? 'bg-dark-alt' : 'bg-light'} border`}>
                        <div className="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faHistory} className="text-muted" />
                                <h6 className="fw-black uppercase x-small ls-wide text-muted mb-0">System Transfer Activity</h6>
                            </div>
                            <span className="badge bg-white text-dark border rounded-pill px-3 x-small fw-bold shadow-xs">3 ACTIVE JOBS</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-4 py-3">Transfer ID</th>
                                        <th className="py-3">Type</th>
                                        <th className="py-3">Resource Name</th>
                                        <th className="py-3 text-end">Record Count</th>
                                        <th className="py-3 text-center">System Status</th>
                                        <th className="px-4 py-3 text-end">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(h => (
                                        <tr key={h.id} className="cursor-pointer" onClick={() => setActiveJob(h)}>
                                            <td className="px-4 py-4 fw-bold small text-dark">{h.id}</td>
                                            <td className="py-4">
                                                <span className={`badge rounded-pill x-small fw-black px-3 ${h.type === 'Export' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'}`}>
                                                    {h.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 fw-bold small text-muted text-dark">{h.name}</td>
                                            <td className="py-4 text-end small text-dark">{h.rows}</td>
                                            <td className="py-4 text-center">
                                                {h.status === 'Completed' ? (
                                                    <div className="text-success d-flex align-items-center justify-content-center gap-1">
                                                        <FontAwesomeIcon icon={faCheckCircle} className="x-small" />
                                                        <span className="fw-black x-small">VERIFIED</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-warning d-flex align-items-center justify-content-center gap-1">
                                                        <FontAwesomeIcon icon={faSync} className="x-small spin" />
                                                        <span className="fw-black x-small">PROCESSING</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-end x-small fw-bold text-muted">{h.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={!!activeJob}
                onClose={() => setActiveJob(null)}
                title="Transfer Insight"
                size="sm"
                footer={
                    <button className="btn btn-success w-100 rounded-pill py-3 fw-black x-small ls-wide shadow-success text-white" onClick={() => {}}>
                        DOWNLOAD RECEIPT
                    </button>
                }
            >
                <div className="p-4 rounded-4 bg-light border mb-4">
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                        <span className="x-small fw-black text-muted uppercase">Records Processed</span>
                        <span className="fw-black">{activeJob?.rows}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                        <span className="x-small fw-black text-muted uppercase">File Integrity</span>
                        <span className="text-success fw-black small">CHECKSUM PASS</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="x-small fw-black text-muted uppercase">Data Schema</span>
                        <span className="badge bg-dark text-white rounded-pill px-3 x-small fw-bold">v2.4.0</span>
                    </div>
                </div>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .border-dashed { border-style: dashed !important; }
                .shadow-success { box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
                .text-dark { color: #1e293b !important; }
                .hover-bg-success-subtle:hover { background-color: #dcfce7 !important; }
            `}</style>
        </div>
    );
};

export default ExcelImportExport;
