
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFilePdf, faFileExport, faDownload,
    faTableColumns, faPalette, faEye, faSignature,
    faGear, faCheckCircle, faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';
import client from '../../../api/client';
import { getTabData } from '../../../api/fms';

const PdfExport = ({ isDark }) => {
    const { addNotification } = useApp();
    const [selectedTemplate, setSelectedTemplate] = useState('Modern Corporate');
    const [generating, setGenerating] = useState(false);
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        getTabData('pdf-export').then(res => setTemplates(res.data?.data || [])).catch(() => {});
    }, []);

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
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Header */}
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-danger p-3 text-white shadow-danger">
                                <FontAwesomeIcon icon={faFilePdf} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">PDF Document Generator</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">High-Fidelity Financial Exports & Statement Layouts</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faGear} className="me-2" /> GLOBAL SETTINGS
                            </button>
                        </div>
                    </div>

                    <div className="row g-5">
                        <div className="col-lg-4">
                            <div className={`p-4 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4">Design Templates</h6>
                                <div className="space-y-3">
                                    {templates.map((t, i) => (
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
                </div>
            </motion.div>
            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-danger { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4); }
                .border-dashed { border-style: dashed !important; }
                .text-dark { color: #1e293b !important; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
};

export default PdfExport;
