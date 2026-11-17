
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faDiagramPredecessor, faSitemap, faShareNodes, faPlus,
    faUserCheck, faCheckDouble, faArrowRight, faTrash,
    faFileInvoiceDollar, faHandshake, faGear, faCirclePlay
} from '@fortawesome/free-solid-svg-icons';

const ApprovalChains = ({ isDark }) => {
    const [selectedChain, setSelectedChain] = useState('PO-ENT-01');

    const [chains, setChains] = useState([]);
    useEffect(() => { getTabData('approval-chains').then(res => setChains(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-indigo p-3 text-white shadow-indigo" style={{ backgroundColor: '#6366f1' }}>
                                <FontAwesomeIcon icon={faDiagramPredecessor} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Approval Chains & Workflows</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Multi-level, Parallel & Conditional Approval Orchestration</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm" style={{ backgroundColor: '#6366f1', borderColor: '#6366f1' }}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> DEFINE NEW CHAIN
                            </button>
                        </div>
                    </div>

                    <div className="row g-5">
                        {/* Chain List */}
                        <div className="col-lg-4">
                            <label className="x-small fw-black uppercase text-muted mb-3">Active Chains</label>
                            <div className="space-y-2">
                                {chains.map(chain => (
                                    <div 
                                        key={chain.id}
                                        className={`p-4 rounded-4 border cursor-pointer transition-all mb-3 ${
                                            selectedChain === chain.id 
                                            ? 'bg-primary bg-opacity-10 border-primary shadow-sm' 
                                            : isDark ? 'bg-dark-alt text-white opacity-50' : 'bg-light text-muted'
                                        }`}
                                        onClick={() => setSelectedChain(chain.id)}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="x-small fw-black uppercase ls-wide">{chain.id}</span>
                                            <span className="badge rounded-pill bg-white text-dark x-small border">{chain.type}</span>
                                        </div>
                                        <h6 className="fw-black mb-0">{chain.name}</h6>
                                        <div className="mt-2 x-small fw-bold opacity-75">{chain.steps} Approval Levels</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Builder Placeholder */}
                        <div className="col-lg-8">
                            <div className={`p-5 rounded-5 h-100 d-flex flex-column ${isDark ? 'bg-dark-alt border-dashed' : 'bg-light border-dashed'} border-2`}>
                                <div className="d-flex justify-content-between align-items-center mb-5">
                                    <h6 className="fw-black mb-0 uppercase ls-wide text-primary">Workflow Canvas: {selectedChain}</h6>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faGear} /></button>
                                        <button className="btn btn-xs btn-light rounded-circle border text-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </div>

                                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                                    {/* Visual Representation of Workflow Steps */}
                                    <div className="d-flex flex-column align-items-center gap-4 w-100" style={{ maxWidth: '400px' }}>
                                        {[
                                            { label: 'Department Head', icon: faUserCheck, color: '#6366f1' },
                                            { label: 'Finance Controller', icon: faCheckDouble, color: '#10b981' },
                                            { label: 'CEO / Board', icon: faHandshake, color: '#f59e0b' }
                                        ].map((step, i) => (
                                            <React.Fragment key={i}>
                                                <div className={`w-100 p-4 rounded-4 ${isDark ? 'bg-dark-card' : 'bg-white'} border shadow-sm d-flex align-items-center gap-4`}>
                                                    <div className="rounded-circle p-2 text-white" style={{ backgroundColor: step.color }}>
                                                        <FontAwesomeIcon icon={step.icon} className="x-small" />
                                                    </div>
                                                    <div>
                                                        <div className="x-small fw-black uppercase text-muted">Level {i+1}</div>
                                                        <div className="fw-black small">{step.label}</div>
                                                    </div>
                                                    <div className="ms-auto x-small fw-bold text-primary">Required</div>
                                                </div>
                                                {i < 2 && <FontAwesomeIcon icon={faArrowRight} className="text-muted opacity-25 rotation-90" style={{ transform: 'rotate(90deg)' }} />}
                                            </React.Fragment>
                                        ))}
                                        
                                        <button className={`btn btn-xs rounded-pill px-4 mt-3 fw-black uppercase border-dashed border-2 ${isDark ? 'btn-outline-light' : 'btn-outline-primary'}`}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" /> INSERT CONDITIONAL STEP
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-5 p-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <FontAwesomeIcon icon={faCirclePlay} className="text-primary" />
                                        <div className="x-small fw-black uppercase ls-wide">Chain is LIVE & Active</div>
                                    </div>
                                    <button className="btn btn-xs btn-primary rounded-pill px-3 fw-black x-small">TEST FLOW</button>
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
                .shadow-indigo { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default ApprovalChains;
