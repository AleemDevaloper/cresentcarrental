import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faProjectDiagram, faCoins, faUserTie, faShoppingCart, faTruck,
    faPlane, faChartLine, faPlus, faTimes, faSearch, faFilter,
    faArrowRight, faFileInvoiceDollar, faReceipt
} from '@fortawesome/free-solid-svg-icons';

const ProjectCostTracking = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [projects, setProjects] = useState([]);
    useEffect(() => { getTabData('project-cost').then(res => setProjects(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-success p-3 text-white shadow-success" style={{ backgroundColor: '#10b981' }}>
                                <FontAwesomeIcon icon={faProjectDiagram} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Project Cost Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Granular Expense Monitoring & Labor Analysis</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-success rounded-pill px-4 fw-black x-small shadow-sm text-white" style={{ backgroundColor: '#10b981' }} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> LOG PROJECT COST
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Project Spend', v: '$1.24M', i: faCoins, c: '#10b981' },
                            { l: 'Labor Investment', v: '$295K', i: faUserTie, c: '#6366f1' },
                            { l: 'Average Profitability', v: '21.4%', i: faChartLine, c: '#f59e0b' },
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

                {/* Registry View */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Project Ledger</h5>
                            <span className="badge rounded-pill bg-success-subtle text-success x-small fw-black px-3">COST RECONCILIATION</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search Projects..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Project Identity</th>
                                    <th className="py-3 border-0">Labor & Talent</th>
                                    <th className="py-3 border-0">Procurement/Materials</th>
                                    <th className="py-3 border-0 text-center">Travel/Logistics</th>
                                    <th className="px-5 py-3 border-0 text-end">Profitability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-success bg-opacity-10 text-success">
                                                    <FontAwesomeIcon icon={faProjectDiagram} />
                                                </div>
                                                <div>
                                                    <div className="fw-black small">{p.name}</div>
                                                    <div className="text-muted x-small fw-bold uppercase ls-wide">{p.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faUserTie} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted">{p.labor}</span>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faShoppingCart} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted">{p.procurement}</span>
                                            </div>
                                        </td>
                                        <td className="border-0 text-center">
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <FontAwesomeIcon icon={faPlane} className="text-muted x-small" />
                                                <span className="x-small fw-bold text-muted">{p.travel}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <span className="badge rounded-pill bg-success text-white x-small fw-black px-3">{p.profitability}</span>
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
                title="New Cost Entry"
                size="lg"
            >
                <form className="row g-4">
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Select Project</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Cloud Infrastructure Upgrade</option>
                            <option>Q3 Security Audit</option>
                            <option>AI Model Training</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Cost Category</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Labor/Human Resources</option>
                            <option>Procurement/Materials</option>
                            <option>Travel/Logistics</option>
                            <option>Software/Licensing</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Amount (USD)</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.00" />
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Description / Justification</label>
                        <textarea className="form-control rounded-4 x-small fw-bold border-2" rows="3" placeholder="Describe the expenditure..."></textarea>
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>DISCARD</button>
                            <button type="button" className="btn btn-success rounded-pill w-100 fw-black x-small py-3 shadow-success text-white" style={{ backgroundColor: '#10b981' }}>LOG EXPENDITURE</button>
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
                .shadow-success { box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
            `}</style>
        </div>
    );
};

export default ProjectCostTracking;
