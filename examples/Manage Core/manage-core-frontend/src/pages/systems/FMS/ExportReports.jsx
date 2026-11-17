
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileExcel, faFileCsv, faFilePdf, faCloudArrowUp,
    faCloudArrowDown, faHistory, faCheckCircle, faClock,
    faFileLines, faSync, faTimes, faDatabase, faShieldHalved,
    faFileContract, faUpload, faDiagramProject, faTableList,
    faCircleInfo, faCheckDouble, faTriangleExclamation, faMicrochip,
    faPlay, faSave, faArrowRight, faDownload, faFileExport,
    faTableColumns, faPalette, faEye, faSignature, faGear,
    faArrowsRotate, faChartBar
} from '@fortawesome/free-solid-svg-icons';
import client from '../../../api/client';
import { getTabData } from '../../../api/fms';

const TAB_EXCEL = 'excel';
const TAB_CSV = 'csv';
const TAB_PDF = 'pdf';

const ExcelTab = ({ isDark }) => {
    const { addNotification } = useApp();
    const [activeJob, setActiveJob] = useState(null);
    const [importing, setImporting] = useState(false);
    const [history, setHistory] = useState([]);
    useEffect(() => { getTabData('export-reports').then(res => setHistory(res.data?.data || [])).catch(() => {}); }, []);

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

            <DialogBox
                show={!!activeJob}
                onClose={() => setActiveJob(null)}
                title="Transfer Insight"
                size="md"
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
                <button className="btn btn-success w-100 rounded-pill py-3 fw-black x-small ls-wide shadow-success text-white">DOWNLOAD RECEIPT</button>
            </DialogBox>
        </motion.div>
    );
};

const CsvTab = ({ isDark }) => {
    const { addNotification } = useApp();
    const [mappingMode, setMappingMode] = useState(false);
    const [importing, setImporting] = useState(false);

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('module', 'csv_exchange');
        try {
            const res = await client.post('/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addNotification(res.data.message, 'success');
        } catch (error) {
            console.error("CSV Import failed", error);
        } finally {
            setImporting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="row g-5">
                <div className="col-lg-7">
                    <div className={`p-4 rounded-5 border ${isDark ? 'bg-dark-alt border-white border-opacity-10' : 'bg-light bg-opacity-50'} mb-4`}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="rounded-circle bg-white p-2 border shadow-sm">
                                <FontAwesomeIcon icon={faUpload} className="text-primary" />
                            </div>
                            <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">Upload CSV Source</h6>
                        </div>
                        <div className={`p-5 border-dashed border-2 rounded-4 text-center mb-3 transition-all ${mappingMode ? 'opacity-50' : 'hover-border-primary'}`}>
                            <p className="text-muted small">Drag source file or click to browse</p>
                            <button className="btn btn-outline-dark rounded-pill px-4 x-small fw-black" onClick={() => setMappingMode(true)}>CHOOSE FILE</button>
                        </div>
                        <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-warning-subtle text-warning border border-warning border-opacity-25">
                            <FontAwesomeIcon icon={faCircleInfo} />
                            <span className="x-small fw-bold">Headers must match the system schema for auto-mapping.</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {mappingMode && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-4 rounded-5 border ${isDark ? 'bg-dark-alt' : 'bg-white'} shadow-sm`}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-purple p-2 text-white shadow-sm">
                                            <FontAwesomeIcon icon={faDiagramProject} />
                                        </div>
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">Field Mapping Engine</h6>
                                    </div>
                                    <button className="btn btn-xs btn-light rounded-circle" onClick={() => setMappingMode(false)}><FontAwesomeIcon icon={faTimes} /></button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { s: 'transaction_id', d: 'ID Reference', m: true },
                                        { s: 'date_posted', d: 'Transaction Date', m: true },
                                        { s: 'amount_total', d: 'Net Amount', m: false, error: 'Type Mismatch' },
                                        { s: 'vendor_name', d: 'Payee Entity', m: true },
                                    ].map((f, i) => (
                                        <div key={i} className="p-3 rounded-4 bg-white border d-flex justify-content-between align-items-center mb-2 shadow-xs transition-all hover-shadow-sm">
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="badge bg-light text-muted fw-mono x-small border">{f.s}</span>
                                                <FontAwesomeIcon icon={faArrowRight} className="text-muted opacity-25" />
                                                <span className="fw-black small text-dark">{f.d}</span>
                                            </div>
                                            {f.m ? (
                                                <div className="badge bg-success-subtle text-success rounded-pill px-2 py-1"><FontAwesomeIcon icon={faCheckDouble} /></div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-1 text-danger">
                                                    <FontAwesomeIcon icon={faTriangleExclamation} className="x-small" />
                                                    <span className="x-small fw-black">{f.error}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary w-100 rounded-pill py-3 mt-4 fw-black x-small shadow-primary">SAVE MAPPING & PROCEED</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="col-lg-5">
                    <div className="p-5 rounded-5 bg-dark text-white shadow-lg h-100 position-relative overflow-hidden d-flex flex-column">
                        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5" style={{ background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
                        <h6 className="uppercase fw-black x-small ls-wide opacity-50 mb-4 position-relative">Export Configuration</h6>
                        <div className="space-y-4 position-relative">
                            <div className="mb-4">
                                <label className="x-small fw-black uppercase text-white-50 d-block mb-2">Delimiter Type</label>
                                <select className="form-select bg-transparent text-white border-secondary rounded-pill x-small fw-bold">
                                    <option>Comma ( , )</option>
                                    <option>Semicolon ( ; )</option>
                                    <option>Tab ( \t )</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="x-small fw-black uppercase text-white-50 d-block mb-2">Encoding</label>
                                <select className="form-select bg-transparent text-white border-secondary rounded-pill x-small fw-bold">
                                    <option>UTF-8 (Recommended)</option>
                                    <option>ASCII</option>
                                    <option>ISO-8859-1</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="x-small fw-black uppercase text-white-50 d-block mb-2">Date Format</label>
                                <select className="form-select bg-transparent text-white border-secondary rounded-pill x-small fw-bold">
                                    <option>YYYY-MM-DD</option>
                                    <option>DD/MM/YYYY</option>
                                    <option>MM-DD-YYYY</option>
                                </select>
                            </div>
                            <hr className="opacity-25 my-5" />
                            <div className="mt-auto">
                                <button className="btn btn-warning w-100 rounded-pill py-3 fw-black x-small ls-wide shadow-lg mb-3">
                                    <FontAwesomeIcon icon={faDownload} className="me-2" /> GENERATE EXPORT FILE
                                </button>
                                <p className="x-small text-center opacity-50 fw-bold mb-0">Export will be logged in system audit trail.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const PdfTab = ({ isDark }) => {
    const { addNotification } = useApp();
    const [selectedTemplate, setSelectedTemplate] = useState('Modern Corporate');
    const [generating, setGenerating] = useState(false);

    const handleExport = async () => {
        setGenerating(true);
        try {
            const res = await client.post('/export', { module: 'general', format: 'pdf' });
            addNotification(res.data.message, 'success');
        } catch (error) {
            console.error("PDF Export failed", error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="row g-5">
                <div className="col-lg-4">
                    <div className={`p-4 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4">Design Templates</h6>
                        <div className="space-y-3">
                            {[
                                { n: 'Modern Corporate', p: 'Default Layout', icon: faTableColumns },
                                { n: 'Compact Auditor', p: 'High density, no icons', icon: faFileExport },
                                { n: 'Visual Summary', p: 'Includes charts & colors', icon: faPalette },
                            ].map((t, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-4 bg-white border cursor-pointer transition-all mb-3 ${selectedTemplate === t.n ? 'border-danger border-2 shadow-sm' : 'opacity-75 hover-opacity-100 border-1'}`}
                                    onClick={() => setSelectedTemplate(t.n)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-3 p-2 ${selectedTemplate === t.n ? 'bg-danger text-white' : 'bg-light text-muted'}`}>
                                            <FontAwesomeIcon icon={t.icon} />
                                        </div>
                                        <div>
                                            <div className="fw-black small text-dark">{t.n}</div>
                                            <div className="text-muted x-small fw-bold">{t.p}</div>
                                        </div>
                                        {selectedTemplate === t.n && <FontAwesomeIcon icon={faCheckCircle} className="ms-auto text-danger" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className={`p-5 rounded-5 border shadow-sm h-100 d-flex flex-column position-relative overflow-hidden ${isDark ? 'bg-dark-alt' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">Live Preview: {selectedTemplate}</h6>
                            <div className="d-flex gap-2">
                                <button className="btn btn-xs bg-light rounded-pill px-3 x-small fw-black border"><FontAwesomeIcon icon={faEye} className="me-1" /> ZOOM</button>
                                <button
                                    className="btn btn-xs btn-danger rounded-pill px-4 x-small fw-black shadow-sm"
                                    disabled={generating}
                                    onClick={handleExport}
                                >
                                    {generating ? (
                                        <><FontAwesomeIcon icon={faArrowsRotate} className="me-1 spin" /> GENERATING...</>
                                    ) : (
                                        <><FontAwesomeIcon icon={faDownload} className="me-1" /> EXPORT PDF</>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow-1 bg-light bg-opacity-50 rounded-4 border-dashed border-2 d-flex align-items-center justify-content-center p-5 overflow-hidden">
                            <motion.div
                                key={selectedTemplate}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white shadow-lg p-5 rounded-2"
                                style={{ width: '210mm', height: '297mm', transform: 'scale(0.35)', transformOrigin: 'center center' }}
                            >
                                <div className="d-flex justify-content-between border-bottom pb-4 mb-5 text-dark">
                                    <div className="fw-black h3">FINANCIAL STATEMENT</div>
                                    <div className="text-end">
                                        <div className="fw-black small uppercase">PMS Core Systems</div>
                                        <div className="text-muted x-small">Generated on June 08, 2026</div>
                                    </div>
                                </div>
                                <div className="row mb-5 text-dark">
                                    <div className="col-6">
                                        <div className="text-muted x-small uppercase fw-bold mb-2">Organization</div>
                                        <div className="fw-black small">GLOBAL OPERATIONS HUB</div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div className="text-muted x-small uppercase fw-bold mb-2">Audit Status</div>
                                        <div className="badge bg-success-subtle text-success rounded-pill px-3 x-small fw-black">CERTIFIED</div>
                                    </div>
                                </div>
                                <div className="py-5 text-center opacity-25 text-dark">
                                    <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '100px' }} />
                                    <p className="fw-black mt-4 h1 uppercase">{selectedTemplate}</p>
                                </div>
                                <div className="mt-auto pt-5 border-top d-flex justify-content-between align-items-end text-dark">
                                    <div className="x-small text-muted fw-bold">System Generated ID: PDF-90210-AUDIT</div>
                                    <div className="text-center" style={{ width: '150px' }}>
                                        <FontAwesomeIcon icon={faSignature} className="fs-2 mb-2 text-primary" />
                                        <div className="border-top pt-2 x-small fw-black uppercase">Official Seal</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ExportReports = ({ isDark }) => {
    const [activeTab, setActiveTab] = useState(TAB_EXCEL);

    const innerTabs = [
        { id: TAB_EXCEL, label: 'Excel', icon: faFileExcel, color: 'success' },
        { id: TAB_CSV, label: 'CSV', icon: faFileCsv, color: 'warning' },
        { id: TAB_PDF, label: 'PDF', icon: faFilePdf, color: 'danger' },
    ];

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex align-items-center gap-4 mb-5">
                        <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                            <FontAwesomeIcon icon={faChartBar} className="fs-4" />
                        </div>
                        <div>
                            <h4 className="fw-black mb-1">Export Reports</h4>
                            <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Excel, CSV & PDF — Unified Export Hub</p>
                        </div>
                    </div>

                    <div className="d-flex gap-2 mb-5 border-bottom pb-3">
                        {innerTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`btn rounded-pill px-4 py-2 fw-black x-small ls-wide d-flex align-items-center gap-2 transition-all ${activeTab === tab.id ? `btn-${tab.color} text-white shadow-sm` : 'btn-light border text-muted'}`}
                            >
                                <FontAwesomeIcon icon={tab.icon} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === TAB_EXCEL && <ExcelTab key="excel" isDark={isDark} />}
                        {activeTab === TAB_CSV && <CsvTab key="csv" isDark={isDark} />}
                        {activeTab === TAB_PDF && <PdfTab key="pdf" isDark={isDark} />}
                    </AnimatePresence>
                </div>
            </motion.div>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .fw-mono { font-family: 'JetBrains Mono', monospace; }
                .border-dashed { border-style: dashed !important; }
                .shadow-success { box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .shadow-danger { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
                .text-dark { color: #1e293b !important; }
                .hover-bg-success-subtle:hover { background-color: #dcfce7 !important; }
                .bg-purple { background-color: #7c3aed; }
            `}</style>
        </div>
    );
};

export default ExportReports;
