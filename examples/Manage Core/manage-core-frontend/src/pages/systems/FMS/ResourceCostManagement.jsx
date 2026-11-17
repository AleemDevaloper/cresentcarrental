import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsersGear, faDolly, faCubes, faMagnifyingGlassChart, faRocket,
    faPeopleArrows, faPlus, faTimes, faSearch, faFilter, faArrowRight,
    faUserTie, faChartLine, faArrowsToDot
} from '@fortawesome/free-solid-svg-icons';

const ResourceCostManagement = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [resources, setResources] = useState([]);
    useEffect(() => { getTabData('resource-cost').then(res => setResources(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-teal p-3 text-white shadow-teal" style={{ backgroundColor: '#14b8a6' }}>
                                <FontAwesomeIcon icon={faUsersGear} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Resource Cost Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Labor Analysis & Workforce Capacity Optimization</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-teal rounded-pill px-4 fw-black x-small shadow-sm text-white" style={{ backgroundColor: '#14b8a6' }} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> PROVISION RESOURCE
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Workforce Cost', v: '$4.55M', i: faUserTie, c: '#14b8a6' },
                            { l: 'Avg Capacity Load', v: '87.5%', i: faMagnifyingGlassChart, c: '#6366f1' },
                            { l: 'Efficiency Gain', v: '+14.2%', i: faRocket, c: '#10b981' },
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

                {/* Resource Registry */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Workforce Matrix</h5>
                            <span className="badge rounded-pill bg-teal-subtle text-teal x-small fw-black px-3">CAPACITY PLANNING</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search resources..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Resource Group / Team</th>
                                    <th className="py-3 border-0">Allocated FTE</th>
                                    <th className="py-3 border-0">Annual Cost Load</th>
                                    <th className="py-3 border-0 text-center">Capacity Use</th>
                                    <th className="px-5 py-3 border-0 text-end">Optimization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map((r, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-teal bg-opacity-10 text-teal">
                                                    <FontAwesomeIcon icon={faPeopleArrows} />
                                                </div>
                                                <div className="fw-black small">{r.name}</div>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faCubes} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted">{r.size}</span>
                                            </div>
                                        </td>
                                        <td className="border-0 fw-bold small text-muted">{r.cost}</td>
                                        <td className="border-0 text-center">
                                            <div className="x-small fw-black text-teal">{r.capacity}</div>
                                            <div className="progress mx-auto" style={{ height: '4px', width: '60px' }}>
                                                <div className="progress-bar bg-teal" style={{ width: r.capacity }}></div>
                                            </div>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                r.optimization === 'Optimized' ? 'bg-success-subtle text-success' : 
                                                r.optimization === 'At Capacity' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'
                                            }`}>{r.optimization.toUpperCase()}</span>
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
                onClose={() => setShowModal(false)}
                title="Resource Provisioning"
                size="md"
            >
                <form className="row g-4">
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Team / Resource Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Data Science Unit" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">FTE Allocation</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="1.0" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Avg Annual Cost (USD)</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.00" />
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Utilization Target (%)</label>
                        <input type="range" className="form-range" min="0" max="100" defaultValue="85" />
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>DISCARD</button>
                            <button type="button" className="btn btn-teal rounded-pill w-100 fw-black x-small py-3 shadow-teal text-white" style={{ backgroundColor: '#14b8a6' }}>ADD RESOURCE</button>
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
                .shadow-teal { box-shadow: 0 10px 20px -5px rgba(20, 184, 166, 0.4); }
            `}</style>
        </div>
    );
};

export default ResourceCostManagement;
