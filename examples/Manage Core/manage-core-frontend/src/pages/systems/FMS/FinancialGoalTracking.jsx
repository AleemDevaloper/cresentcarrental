
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFlagCheckered, faChartLine, faCoins, faShieldHalved,
    faPlus, faTimes, faChevronRight, faCircleNotch,
    faCalendarAlt, faArrowTrendUp, faFilter, faSearch
} from '@fortawesome/free-solid-svg-icons';

const FinancialGoalTracking = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [goals, setGoals] = useState([]);
    useEffect(() => { getTabData('goal-tracking').then(res => setGoals(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-success p-3 text-white shadow-success">
                                <FontAwesomeIcon icon={faFlagCheckered} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Financial Goal Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Set, Monitor & Achieve Corporate Milestones</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> PLANNER
                            </button>
                            <button className="btn btn-success rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> CREATE NEW GOAL
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Active Goals', v: '12', i: faFlagCheckered, c: '#10b981' },
                            { l: 'Avg Completion Rate', v: '62.5%', i: faCircleNotch, c: '#6366f1' },
                            { l: 'Capital at Target', v: '$15.2M', i: faCoins, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                            <FontAwesomeIcon icon={s.i} style={{ color: s.c }} className="x-small" />
                                        </div>
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">{s.l}</h6>
                                    </div>
                                    <h2 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Goals Grid */}
                <div className="row g-4">
                    {goals.map((goal, i) => (
                        <div key={i} className="col-xl-6">
                            <div className={`p-5 rounded-5 border-0 h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-4 p-3 ${isDark ? 'bg-dark-alt' : 'bg-light'} border`}>
                                            <FontAwesomeIcon icon={goal.type === 'Revenue' ? faChartLine : goal.type === 'Profit' ? faArrowTrendUp : faShieldHalved} className="text-primary" />
                                        </div>
                                        <div>
                                            <h5 className="fw-black mb-1">{goal.title}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-2">{goal.type.toUpperCase()}</span>
                                                <span className="text-muted x-small fw-bold">Deadline: {goal.deadline}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`badge rounded-pill x-small fw-black px-3 ${
                                        goal.status === 'On Track' ? 'bg-success-subtle text-success' : 
                                        goal.status === 'Behind' ? 'bg-danger-subtle text-danger' : 'bg-info-subtle text-info'
                                    }`}>
                                        {goal.status}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <span className="x-small fw-black text-muted uppercase">Progress</span>
                                        <span className="fw-black small">{goal.progress}%</span>
                                    </div>
                                    <div className="progress rounded-pill overflow-hidden" style={{ height: '10px' }}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.progress}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="progress-bar bg-primary rounded-pill shadow-sm"
                                        ></motion.div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center pt-4 border-top border-opacity-10">
                                    <div>
                                        <div className="text-muted x-small fw-bold uppercase mb-1">Target Amount</div>
                                        <div className="fw-black small">{goal.target}</div>
                                    </div>
                                    <button className="btn btn-xs btn-light rounded-pill px-3 border fw-black x-small">
                                        VIEW MILESTONES <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <DialogBox
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Define Financial Objective"
                size="md"
                footer={
                    <div className="d-flex gap-2 w-100">
                        <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>CANCEL</button>
                        <button type="button" className="btn btn-success rounded-pill w-100 fw-black x-small py-3 shadow-success text-white">INITIALIZE GOAL</button>
                    </div>
                }
            >
                <form className="row g-4">
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Goal Title</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Q4 Growth Target" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Category</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Revenue</option>
                            <option>Profit Margin</option>
                            <option>Cost Reduction</option>
                            <option>Investment</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Target Value</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="$ 0.00" />
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Target Deadline</label>
                        <input type="date" className="form-control rounded-pill x-small fw-bold border-2" />
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

export default FinancialGoalTracking;
