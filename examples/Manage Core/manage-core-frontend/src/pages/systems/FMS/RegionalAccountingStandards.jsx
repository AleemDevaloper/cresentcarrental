import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGlobe, faScaleBalanced, faFileSignature, faLanguage, faCheckDouble,
    faPlus, faTimes, faSearch, faFilter, faChevronRight, faBuildingColumns,
    faGavel, faEarthAmericas, faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const RegionalAccountingStandards = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [standards, setStandards] = useState([]);
    useEffect(() => { getTabData('regional-accounting').then(res => setStandards(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary" style={{ backgroundColor: '#6366f1' }}>
                                <FontAwesomeIcon icon={faGlobe} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Regional Accounting Standards</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Global Compliance & Localization Framework</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-indigo rounded-pill px-4 fw-black x-small shadow-sm text-white" style={{ backgroundColor: '#6366f1' }} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> CONFIGURE REGION
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Active Jurisdictions', v: '18 Regions', i: faEarthAmericas, c: '#6366f1' },
                            { l: 'Regulatory Frameworks', v: 'IFRS/GAAP', i: faScaleBalanced, c: '#10b981' },
                            { l: 'Compliance Score', v: '99.8%', i: faCheckDouble, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100 d-flex align-items-center gap-4`}>
                                    <div className="rounded-4 p-3 bg-white shadow-sm">
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} className="fs-5" />
                                    </div>
                                    <div>
                                        <div className="text-muted x-small fw-bold uppercase ls-wide mb-1">{s.l}</div>
                                        <h4 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Standards Registry */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Regulatory Matrix</h5>
                            <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">COUNTRY-SPECIFIC REGS</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search Region/Standard..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Region & Jurisdiction</th>
                                    <th className="py-3 border-0">Primary Standard</th>
                                    <th className="py-3 border-0">Tax Governance</th>
                                    <th className="py-3 border-0 text-center">Localization</th>
                                    <th className="px-5 py-3 border-0 text-end">Audit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standards.map((s, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-primary bg-opacity-10 text-primary">
                                                    <FontAwesomeIcon icon={faBuildingColumns} />
                                                </div>
                                                <div>
                                                    <div className="fw-black small">{s.region}</div>
                                                    <div className="text-muted x-small fw-bold uppercase ls-wide">{s.status}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faFileSignature} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted uppercase">{s.standard}</span>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faGavel} className="text-muted x-small" />
                                                <span className="x-small fw-bold text-muted">{s.taxRule}</span>
                                            </div>
                                        </td>
                                        <td className="border-0 text-center">
                                            <span className="badge rounded-pill bg-light border text-dark x-small fw-black px-3">
                                                <FontAwesomeIcon icon={faLanguage} className="me-1" /> {s.localization}
                                            </span>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <button className="btn btn-xs btn-light rounded-circle shadow-sm">
                                                <FontAwesomeIcon icon={faArrowRight} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showModal}
                onHide={() => setShowModal(false)}
                title="Region Configuration"
                size="lg"
            >
                <form className="row g-4">
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Target Jurisdiction</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Germany (DE)" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Accounting Standard</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>IFRS</option>
                            <option>Local GAAP</option>
                            <option>US GAAP</option>
                            <option>SFRS</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Localization Pack</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Standard English</option>
                            <option>German (DATEV)</option>
                            <option>French (FEC)</option>
                            <option>Spanish (SII)</option>
                        </select>
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Tax Rule Reference</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. VAT Directive" />
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>DISCARD</button>
                            <button type="button" className="btn btn-primary rounded-pill w-100 fw-black x-small py-3 shadow-primary text-white" style={{ backgroundColor: '#6366f1' }}>ACTIVATE REGION</button>
                        </div>
                    </div>
                </form>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
            `}</style>
        </div>
    );
};

export default RegionalAccountingStandards;
