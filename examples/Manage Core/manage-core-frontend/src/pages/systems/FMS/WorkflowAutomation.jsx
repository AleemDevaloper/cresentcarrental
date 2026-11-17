
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRobot, faBolt, faMicrochip, faPlus,
    faPlay, faPause, faRotate, faGear,
    faEnvelopeOpenText, faUserPlus, faPlaneDeparture, faBan,
    faCodeMerge, faPlug
} from '@fortawesome/free-solid-svg-icons';

const WorkflowAutomation = ({ isDark }) => {
    const [automations, setAutomations] = useState([]);
    useEffect(() => { getTabData('workflow-automation').then(res => setAutomations(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-dark p-3 text-white shadow-lg">
                                <FontAwesomeIcon icon={faRobot} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Workflow & Process Automation</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Event-driven Orchestration, Triggers & Robotic Process Automation</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faPlug} className="me-2" /> INTEGRATIONS
                            </button>
                            <button className="btn btn-dark rounded-pill px-4 fw-black x-small shadow-sm text-white">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> DESIGN NEW AUTOMATION
                            </button>
                        </div>
                    </div>

                    <div className="row g-4 text-center">
                        {[
                            { l: 'Total Automations', v: '24', i: faMicrochip, c: '#6366f1' },
                            { l: 'Events Processed (24h)', v: '1,250', i: faBolt, c: '#f59e0b' },
                            { l: 'Time Saved (Monthly)', v: '184 Hrs', i: faRotate, c: '#10b981' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="text-muted x-small fw-black uppercase ls-wide mb-2">{s.l}</div>
                                    <h2 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Automation List */}
                <div className="row g-4">
                    {automations.map((auto, i) => (
                        <div key={i} className="col-xl-6">
                            <div className={`p-5 rounded-5 border-0 h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="rounded-4 p-3 border shadow-sm" style={{ backgroundColor: `${auto.color}15`, color: auto.color }}>
                                            <FontAwesomeIcon icon={auto.icon} className="fs-4" />
                                        </div>
                                        <div>
                                            <h5 className="fw-black mb-1">{auto.name}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge rounded-pill bg-light border text-muted x-small fw-black px-2">TRIGGER</span>
                                                <span className="text-primary x-small fw-black uppercase">{auto.trigger}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`badge rounded-pill x-small fw-black px-3 ${
                                        auto.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                                    }`}>
                                        {auto.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className={`p-4 rounded-4 mb-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border border-opacity-50`}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                            <FontAwesomeIcon icon={faCodeMerge} className="x-small text-muted" />
                                        </div>
                                        <div className="small fw-bold">{auto.actions} Robotic Actions Configured</div>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className={`btn btn-sm flex-grow-1 rounded-pill fw-black x-small border ${auto.status === 'Active' ? 'btn-light' : 'btn-primary text-white'}`}>
                                        <FontAwesomeIcon icon={auto.status === 'Active' ? faPause : faPlay} className="me-2" /> 
                                        {auto.status === 'Active' ? 'PAUSE FLOW' : 'RESUME FLOW'}
                                    </button>
                                    <button className="btn btn-sm btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                        <FontAwesomeIcon icon={faGear} className="me-2" /> CONFIGURE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workflow Builder Teaser */}
                <div className={`p-5 rounded-5 text-center bg-opacity-25 mt-4 border-2 border-primary ${isDark ? 'bg-primary bg-opacity-25 border-primary border-opacity-10' : 'bg-primary bg-opacity-50 border-primary border-opacity-10'}`}>
                    <FontAwesomeIcon icon={faRobot} className="fs-1 text-primary mb-4 opacity-50" />
                    <h4 className="fw-black mb-2">Advanced Workflow Orchestrator</h4>
                    <p className="text-muted fw-bold small mb-4">Connect over 50+ internal modules and external APIs to automate your entire enterprise lifecycle.</p>
                    <button className="btn btn-primary rounded-pill px-5 fw-black x-small py-3 shadow-primary">
                        LAUNCH FLOW DESIGNER
                    </button>
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
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
            `}</style>
        </div>
    );
};

export default WorkflowAutomation;
