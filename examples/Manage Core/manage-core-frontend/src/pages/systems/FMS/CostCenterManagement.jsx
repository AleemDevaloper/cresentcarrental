
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuildingCircleArrowRight, faNetworkWired, faCodeBranch, faPlus,
    faSearch, faFilter, faChevronRight, faLayerGroup,
    faWallet, faChartPie, faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const CostCenterManagement = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [costCenters, setCostCenters] = useState([]);
    useEffect(() => { getTabData('cost-center').then(res => setCostCenters(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-orange p-3 text-white shadow-orange" style={{ backgroundColor: '#f59e0b' }}>
                                <FontAwesomeIcon icon={faBuildingCircleArrowRight} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Cost Center Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Organizational Unit Budgeting & Branch Allocation</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-warning rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTER COST CENTER
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Cost Centers', v: '24 Units', i: faNetworkWired, c: '#f59e0b' },
                            { l: 'Active Branches', v: '142 Locations', i: faCodeBranch, c: '#6366f1' },
                            { l: 'Allocated Capital', v: '$14.8M', i: faWallet, c: '#10b981' },
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
                            <h5 className="fw-black mb-0">Unit Registry</h5>
                            <span className="badge rounded-pill bg-warning-subtle text-warning x-small fw-black px-3">HIERARCHICAL VIEW</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search Unit/Branch..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Cost Center Details</th>
                                    <th className="py-3 border-0">Classification</th>
                                    <th className="py-3 border-0 text-end">Budget Assignment</th>
                                    <th className="py-3 border-0 text-center">Branches</th>
                                    <th className="px-5 py-3 border-0 text-end">Management</th>
                                </tr>
                            </thead>
                            <tbody>
                                {costCenters.map((cc, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-primary bg-opacity-10 text-primary">
                                                    <FontAwesomeIcon icon={faBuildingCircleArrowRight} />
                                                </div>
                                                <div>
                                                    <div className="fw-black small">{cc.name}</div>
                                                    <div className="text-muted x-small fw-bold uppercase ls-wide">{cc.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faLayerGroup} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted uppercase">{cc.type}</span>
                                            </div>
                                        </td>
                                        <td className="border-0 text-end fw-black small text-primary">{cc.budget}</td>
                                        <td className="border-0 text-center">
                                            <span className="badge rounded-pill bg-light border text-dark x-small fw-black px-3">{cc.branches} Units</span>
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
                onClose={() => setShowModal(false)}
                title="New Cost Center Entry"
                size="md"
                footer={
                    <div className="d-flex gap-2 w-100">
                        <button className="btn btn-light rounded-pill w-100 fw-bold small py-2 border" onClick={() => setShowModal(false)}>DISCARD</button>
                        <button className="btn btn-warning rounded-pill w-100 fw-bold small py-2 shadow-orange text-white">PROVISION CENTER</button>
                    </div>
                }
            >
                <div className="row g-4">
                    <div className="col-md-8">
                        <label className="x-small fw-black uppercase text-muted mb-2">Center Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Berlin Data Center" />
                    </div>
                    <div className="col-md-4">
                        <label className="x-small fw-black uppercase text-muted mb-2">Unit Code</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="CC-BER-01" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Primary Classification</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Administrative</option>
                            <option>Operational</option>
                            <option>R&D</option>
                            <option>Support</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Initial Budget Allocation</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.00" />
                    </div>
                </div>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-orange { box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.4); }
            `}</style>
        </div>
    );
};

export default CostCenterManagement;
