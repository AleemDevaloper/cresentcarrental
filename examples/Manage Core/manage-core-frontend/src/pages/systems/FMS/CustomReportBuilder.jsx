
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileMedical, faDatabase, faObjectGroup, faTableList,
    faGripVertical, faPlus, faTrash, faSave, faPlay,
    faLayerGroup, faChartArea, faFileExport, faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';

const CustomReportBuilder = ({ isDark }) => {
    const [selectedModule, setSelectedModule] = useState('FMS');
    const [columns, setColumns] = useState(['Transaction Date', 'Amount', 'Vendor', 'Category', 'Status']);

    const [modules, setModules] = useState([]);
    useEffect(() => { getTabData('custom-report').then(res => setModules(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Builder Interface */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-purple p-3 text-white shadow-purple" style={{ backgroundColor: '#a855f7' }}>
                                <FontAwesomeIcon icon={faFileMedical} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Custom Report Builder</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Cross-Modular Analytics & Dynamic Data Modeling</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faSave} className="me-2" /> SAVE TEMPLATE
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}>
                                <FontAwesomeIcon icon={faPlay} className="me-2" /> RUN REPORT
                            </button>
                        </div>
                    </div>

                    <div className="row g-5">
                        {/* Sidebar Configuration */}
                        <div className="col-lg-4">
                            <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                <div className="mb-4">
                                    <label className="x-small fw-black uppercase text-muted mb-3">Data Source Module</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {modules.map(m => (
                                            <button 
                                                key={m} 
                                                className={`btn btn-xs rounded-pill px-3 fw-black ${selectedModule === m ? 'btn-primary shadow-sm' : 'btn-light border'}`}
                                                onClick={() => setSelectedModule(m)}
                                                style={selectedModule === m ? { backgroundColor: '#a855f7', borderColor: '#a855f7' } : {}}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4 pt-4 border-top border-opacity-10">
                                    <label className="x-small fw-black uppercase text-muted mb-3">Selected Columns (Drag to Reorder)</label>
                                    <div className="space-y-2">
                                        {columns.map((col, idx) => (
                                            <div key={idx} className={`p-3 rounded-3 ${isDark ? 'bg-dark-card' : 'bg-white'} border d-flex align-items-center justify-content-between shadow-sm mb-2`}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <FontAwesomeIcon icon={faGripVertical} className="text-muted opacity-25" />
                                                    <span className="small fw-bold">{col}</span>
                                                </div>
                                                <FontAwesomeIcon icon={faTrash} className="text-danger opacity-50 cursor-pointer x-small" />
                                            </div>
                                        ))}
                                        <button className="btn btn-link text-decoration-none x-small fw-black p-0 mt-3">
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> ADD DATA FIELD
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-top border-opacity-10">
                                    <label className="x-small fw-black uppercase text-muted mb-3">Output Format</label>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 border text-center cursor-pointer bg-white text-dark shadow-sm">
                                                <FontAwesomeIcon icon={faTableList} className="mb-2 fs-5 d-block mx-auto text-primary" />
                                                <span className="x-small fw-black uppercase">Table</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className={`p-3 rounded-4 border text-center cursor-pointer ${isDark ? 'bg-dark-card' : 'bg-light'} opacity-50`}>
                                                <FontAwesomeIcon icon={faChartArea} className="mb-2 fs-5 d-block mx-auto text-muted" />
                                                <span className="x-small fw-black uppercase">Pivot</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="col-lg-8">
                            <div className={`p-5 rounded-4 border h-100 d-flex flex-column ${isDark ? 'bg-dark-alt border-dashed' : 'bg-white border-dashed'} border-2`}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" />
                                        <h6 className="fw-black mb-0 uppercase ls-wide opacity-50">Report Live Preview</h6>
                                    </div>
                                    <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary x-small fw-black px-3">AUTO-SYNC ON</div>
                                </div>
                                
                                <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center opacity-25">
                                    <div>
                                        <FontAwesomeIcon icon={faDatabase} className="fs-1 mb-4" />
                                        <h5 className="fw-black">Dynamic Data Workspace</h5>
                                        <p className="small fw-bold">Drag fields from the left to populate the report structure.</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-primary p-2 text-white">
                                            <FontAwesomeIcon icon={faObjectGroup} className="x-small" />
                                        </div>
                                        <div className="x-small fw-bold">Grouping by <span className="text-primary text-decoration-underline">Transaction Date (Monthly)</span></div>
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
                .border-dashed { border-style: dashed !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-purple { box-shadow: 0 10px 20px -5px rgba(168, 85, 247, 0.4); }
                .cursor-pointer { cursor: pointer; }
                .space-y-2 > * + * { margin-top: 0.5rem; }
            `}</style>
        </div>
    );
};

export default CustomReportBuilder;
