
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileCsv, faUpload, faDiagramProject, faTableList,
    faCircleInfo, faCheckDouble, faTriangleExclamation, faMicrochip,
    faTimes, faPlay, faSave, faArrowRight, faDownload
} from '@fortawesome/free-solid-svg-icons';
import client from '../../../api/client';
import { getTabData } from '../../../api/fms';

const CsvImportExport = ({ isDark }) => {
    const { addNotification } = useApp();
    const [mappingMode, setMappingMode] = useState(false);
    const [importing, setImporting] = useState(false);
    const [fieldMappings, setFieldMappings] = useState([]);

    useEffect(() => {
        getTabData('csv-import-export').then(res => setFieldMappings(res.data?.data || [])).catch(() => {});
    }, []);

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
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Header */}
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-dark p-3 text-white shadow-lg">
                                <FontAwesomeIcon icon={faFileCsv} className="fs-4 text-warning" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">CSV Management & Mapping</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Raw Data Processing & Field Correlation Engine</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border">VIEW SCHEMA</button>
                        </div>
                    </div>

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
                                            {fieldMappings.map((f, i) => (
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
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .text-dark { color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default CsvImportExport;
