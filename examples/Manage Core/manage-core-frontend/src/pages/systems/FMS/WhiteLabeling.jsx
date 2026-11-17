
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPalette, faGlobe, faEnvelope, faImage, faFingerprint,
     faShieldAlt,  faCloudArrowUp,
     faLayerGroup, 
    faBuilding,
    faCircleCheck, faRocket, 
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const WhiteLabeling = ({ isDark }) => {
    const [activeSection, setActiveSection] = useState('branding');

    const [sections, setSections] = useState([]);
    useEffect(() => { getTabData('white-labeling').then(res => setSections(res.data?.data || [])).catch(() => {}); }, []);

    const [brandingMetrics, setBrandingMetrics] = useState([]);
    useEffect(() => { getTabData('white-labeling').then(res => setBrandingMetrics(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            {/* Hero Header */}
            <div className="rounded-5 p-5 mb-4 position-relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                <div className="position-absolute top-0 end-0 p-5 opacity-10" style={{ transform: 'rotate(15deg) translate(20%, -20%)' }}>
                    <FontAwesomeIcon icon={faPalette} style={{ fontSize: '15rem' }} />
                </div>
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill bg-primary bg-opacity-20 text-white fw-bold px-3 py-2 mb-3 text-uppercase">Enterprise Suite</span>
                    <h1 className="display-5 fw-bold mb-2">White Labeling Center</h1>
                    <p className="fs-5 text-white text-opacity-75 mb-0 max-width-600">Rebrand and customize the entire ERP ecosystem under your corporate identity.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {brandingMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                                    <div className="rounded-circle p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <div className="text-dark">
                                        <h4 className="fw-bold mb-0 text-dark">{m.value}</h4>
                                        <span className="text-muted small fw-bold text-uppercase text-dark">{m.label}</span>
                                    </div>
                                </div>
                                <div className="small text-success text-dark">
                                    <FontAwesomeIcon icon={faCircleCheck} className="me-1 text-dark" />
                                    {m.sub}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Workspace */}
            <div className="row g-4 text-dark">
                {/* Navigation Sidebar */}
                <div className="col-xl-3 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-3 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h6 className="fw-bold text-muted text-uppercase mb-3 px-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>Configuration</h6>
                        <div className="d-grid gap-1">
                            {sections.map(s => (
                                <button 
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`btn text-start rounded-3 py-3 px-3 d-flex align-items-center gap-3 transition ${activeSection === s.id ? 'btn-primary shadow-sm' : 'btn-light'}`}
                                >
                                    <FontAwesomeIcon icon={s.icon} />
                                    <span className="fw-bold">{s.label}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-auto pt-4 px-2">
                            <div className="p-3 rounded-4 bg-light border border-dashed text-center">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-success mb-2" size="lg" />
                                <div className="small fw-bold">Enterprise Secured</div>
                                <div className="x-small text-muted">All brand assets are encrypted and served via secure CDN.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-xl-9 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h4 className="fw-bold mb-1">{sections.find(s => s.id === activeSection)?.label}</h4>
                                <p className="text-muted mb-0">Configure global visual identity and system-wide assets.</p>
                            </div>
                            <button className="btn btn-primary rounded-pill px-4 fw-bold">Save Changes</button>
                        </div>

                        <hr className="opacity-10 mb-4" />

                        {activeSection === 'branding' && (
                            <div className="row g-4 text-dark">
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-uppercase text-muted">Corporate Logo</label>
                                        <div className="p-5 rounded-4 border-dashed border-2 text-center bg-light transition hover-bg-white cursor-pointer">
                                            <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" className="text-primary mb-3" />
                                            <div className="fw-bold">Upload New Logo</div>
                                            <div className="x-small text-muted mt-1">Recommended: 512x512px SVG or PNG</div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label fw-bold small text-uppercase text-muted">System Favicon</label>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-3 rounded-3 bg-light border">
                                                <FontAwesomeIcon icon={faImage} size="xl" className="text-muted" />
                                            </div>
                                            <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">Choose File</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-uppercase text-muted">Primary Brand Color</label>
                                        <div className="d-flex gap-2 mb-3">
                                            {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9'].map(c => (
                                                <div key={c} className="rounded-circle cursor-pointer shadow-sm border border-white border-4" style={{ background: c, width: 35, height: 35 }} />
                                            ))}
                                            <div className="rounded-circle cursor-pointer shadow-sm border border-white border-4 bg-white d-flex align-items-center justify-content-center" style={{ width: 35, height: 35 }}>
                                                <FontAwesomeIcon icon={faPlus} size="xs" />
                                            </div>
                                        </div>
                                        <input type="text" className="form-control rounded-pill bg-light border-0" placeholder="#4f46e5" />
                                    </div>
                                    <div>
                                        <label className="form-label fw-bold small text-uppercase text-muted">Navigation Layout</label>
                                        <select className="form-select rounded-pill bg-light border-0">
                                            <option>Sidebar (Default)</option>
                                            <option>Top Navigation</option>
                                            <option>Collapsed Minimal</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'domains' && (
                            <div className="text-center py-5 text-dark">
                                <FontAwesomeIcon icon={faGlobe} size="3xl" className="text-primary opacity-20 mb-3" />
                                <h5 className="fw-bold">Custom Domain Configuration</h5>
                                <p className="text-muted max-width-500 mx-auto mb-4">Point your own domain (e.g., erp.yourcompany.com) to our infrastructure with automated SSL.</p>
                                <button className="btn btn-outline-primary rounded-pill px-4">Add Custom Domain</button>
                            </div>
                        )}

                        {/* Additional placeholders for other sections */}
                        {['email', 'login', 'assets'].includes(activeSection) && (
                            <div className="p-5 rounded-4 bg-light text-center text-dark">
                                <h6 className="fw-bold text-muted">Advanced White-Label Feature</h6>
                                <p className="small text-muted mb-0">This module is available for Enterprise Tenants.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .max-width-600 { max-width: 600px; }
                .max-width-500 { max-width: 500px; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
                .x-small { font-size: 11px; }
                .cursor-pointer { cursor: pointer; }
                .hover-bg-white:hover { background-color: white !important; }
                .transition { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default WhiteLabeling;
