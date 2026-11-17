import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, faSackDollar, faBullseye, faSliders, faHeartPulse,
    faPlus, faTimes, faSearch, faFilter, faArrowRight,
    faChartArea, faCircleCheck, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const ProjectBudgetTracking = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [budgets, setBudgets] = useState([]);
    useEffect(() => { getTabData('project-budget').then(res => setBudgets(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-orange p-3 text-white shadow-orange" style={{ backgroundColor: '#f59e0b' }}>
                                <FontAwesomeIcon icon={faChartPie} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Project Budget Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Financial Planning & Spending Health Monitor</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-warning rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> ALLOCATE BUDGET
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Portfolio Budget', v: '$5.05M', i: faSackDollar, c: '#f59e0b' },
                            { l: 'Spending Targets', v: '12 Active', i: faBullseye, c: '#6366f1' },
                            { l: 'Overall Health Index', v: '92/100', i: faHeartPulse, c: '#10b981' },
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

                {/* Budget Overview */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Allocation Registry</h5>
                            <span className="badge rounded-pill bg-warning-subtle text-warning x-small fw-black px-3">REAL-TIME MONITORING</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search Budgets..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Project / Objective</th>
                                    <th className="py-3 border-0 text-center">Health Status</th>
                                    <th className="py-3 border-0">Budget Progress</th>
                                    <th className="py-3 border-0 text-end">Spent / Total</th>
                                    <th className="px-5 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {budgets.map((b, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-warning bg-opacity-10 text-warning">
                                                    <FontAwesomeIcon icon={faChartArea} />
                                                </div>
                                                <div className="fw-black small">{b.name}</div>
                                            </div>
                                        </td>
                                        <td className="border-0 text-center">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                b.health === 'Healthy' ? 'bg-success-subtle text-success' : 
                                                b.health === 'Stable' ? 'bg-primary-subtle text-primary' :
                                                b.health === 'Warning' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'
                                            }`}>
                                                <FontAwesomeIcon icon={b.health === 'Critical' ? faTriangleExclamation : faCircleCheck} className="me-1" />
                                                {b.health.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="border-0" style={{ minWidth: '200px' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="progress flex-grow-1 rounded-pill" style={{ height: '6px' }}>
                                                    <div className={`progress-bar rounded-pill ${
                                                        b.progress > 90 ? 'bg-danger' : b.progress > 70 ? 'bg-warning' : 'bg-success'
                                                    }`} style={{ width: `${b.progress}%` }}></div>
                                                </div>
                                                <span className="x-small fw-black text-muted">{b.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="border-0 text-end">
                                            <div className="fw-black small text-primary">{b.spent}</div>
                                            <div className="text-muted x-small fw-bold">{b.total}</div>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <button className="btn btn-xs btn-light rounded-circle shadow-sm">
                                                <FontAwesomeIcon icon={faSliders} className="x-small" />
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
                title="Budget Provisioning"
                size="lg"
            >
                <form className="row g-4">
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Project Assignment</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="Search project name..." />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Total Allocated Capital</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.00" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Threshold Warning (%)</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" defaultValue="80" />
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Budget Period</label>
                        <div className="d-flex gap-2">
                            <input type="date" className="form-control rounded-pill x-small fw-bold border-2" />
                            <input type="date" className="form-control rounded-pill x-small fw-bold border-2" />
                        </div>
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>DISCARD</button>
                            <button type="button" className="btn btn-warning rounded-pill w-100 fw-black x-small py-3 shadow-orange text-white">CONFIRM ALLOCATION</button>
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
                .shadow-orange { box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.4); }
            `}</style>
        </div>
    );
};

export default ProjectBudgetTracking;
