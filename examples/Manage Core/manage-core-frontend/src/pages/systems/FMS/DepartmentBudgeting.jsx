
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSitemap, faMoneyBillTrendUp, faFileInvoice, faCheckDouble,
    faPlus, faTimes, faFilter, faSearch, faArrowTrendUp, faArrowTrendDown,
    faEllipsisV, faChartBar
} from '@fortawesome/free-solid-svg-icons';

const DepartmentBudgeting = ({ isDark }) => {
    const [activeTab, setActiveTab] = useState('Allocations');

    const [allocations, setAllocations] = useState([]);
    const [requests, setRequests] = useState([]);
    useEffect(() => { getTabData('department-budgeting').then(res => { const d = res.data?.data || []; setAllocations(d); setRequests(d); }).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Card */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-indigo p-3 text-white shadow-indigo" style={{ backgroundColor: '#6366f1' }}>
                                <FontAwesomeIcon icon={faSitemap} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Departmental Budgeting</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Allocation, Variance Analysis & Request Management</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW ALLOCATION
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-4">
                        {[
                            { l: 'Total Budgeted', v: '$7.15M', i: faMoneyBillTrendUp, c: '#6366f1' },
                            { l: 'Total Spent', v: '$5.60M', i: faFileInvoice, c: '#10b981' },
                            { l: 'Pending Requests', v: '08', i: faCheckDouble, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                    <div className="text-muted x-small fw-bold uppercase mb-2">{s.l}</div>
                                    <div className="d-flex align-items-center gap-3">
                                        <h2 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h2>
                                        <div className="ms-auto rounded-circle p-2 bg-white shadow-sm">
                                            <FontAwesomeIcon icon={s.i} style={{ color: s.c }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-4 border-bottom border-opacity-10 pb-0">
                                {['Allocations', 'Budget Requests', 'Variance Analysis'].map(tab => (
                                    <button 
                                        key={tab} 
                                        className={`btn btn-link text-decoration-none px-0 py-3 x-small fw-black uppercase ls-wide border-bottom border-3 transition-all ${
                                            activeTab === tab 
                                            ? 'border-primary text-primary opacity-100' 
                                            : 'border-transparent text-muted opacity-50'
                                        }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search departments..." />
                            </div>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        <div className="table-responsive">
                            {activeTab === 'Allocations' && (
                                <table className="table table-hover align-middle mb-0">
                                    <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                        <tr>
                                            <th className="px-5 py-3 border-0">Department</th>
                                            <th className="py-3 border-0">Budgeted</th>
                                            <th className="py-3 border-0">Spent to Date</th>
                                            <th className="py-3 border-0">Variance</th>
                                            <th className="px-5 py-3 border-0 text-end">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allocations.map((row, i) => (
                                            <tr key={i} className="border-0">
                                                <td className="px-5 py-4 border-0">
                                                    <div className="fw-black small">{row.dept}</div>
                                                </td>
                                                <td className="border-0 fw-black small">{row.budget}</td>
                                                <td className="border-0 fw-black small">{row.spent}</td>
                                                <td className="border-0">
                                                    <span className={`fw-black small ${row.variance.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                                        {row.variance} {row.variance.startsWith('+') ? <FontAwesomeIcon icon={faArrowTrendUp} /> : <FontAwesomeIcon icon={faArrowTrendDown} />}
                                                    </span>
                                                </td>
                                                <td className="px-5 border-0 text-end">
                                                    <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                        row.status === 'Healthy' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                                                    }`}>
                                                        {row.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeTab === 'Budget Requests' && (
                                <table className="table table-hover align-middle mb-0">
                                    <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                        <tr>
                                            <th className="px-5 py-3 border-0">Request ID</th>
                                            <th className="py-3 border-0">Department</th>
                                            <th className="py-3 border-0">Amount</th>
                                            <th className="py-3 border-0">Purpose</th>
                                            <th className="px-5 py-3 border-0 text-end">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((row, i) => (
                                            <tr key={i} className="border-0">
                                                <td className="px-5 py-4 border-0 fw-black small text-primary">{row.id}</td>
                                                <td className="border-0 fw-black small">{row.dept}</td>
                                                <td className="border-0 fw-black small">{row.amount}</td>
                                                <td className="border-0 text-muted x-small fw-bold">{row.purpose}</td>
                                                <td className="px-5 border-0 text-end">
                                                    <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                        row.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'
                                                    }`}>
                                                        {row.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-indigo { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default DepartmentBudgeting;
