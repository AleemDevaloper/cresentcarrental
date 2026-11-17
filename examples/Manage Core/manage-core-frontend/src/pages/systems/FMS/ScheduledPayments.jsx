
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faClock, faCheckCircle, faExclamationCircle, 
    faSync, faArrowRight, faFilter, faSearch, faPlus, faBuilding,
    faDollarSign, faEllipsisV, faBell
} from '@fortawesome/free-solid-svg-icons';

const ScheduledPayments = ({ isDark }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const [payments, setPayments] = useState([]);
    useEffect(() => { getTabData('scheduled-payments').then(res => setPayments(res.data?.data || [])).catch(() => {}); }, []);

    const [kpis, setKpis] = useState([]);
    useEffect(() => { getTabData('scheduled-payments').then(res => setKpis(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="row g-4">
                    {kpis.map((kpi, i) => (
                        <div key={i} className="col-md-4">
                            <div className={`p-4 rounded-5 mb-4 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-4 p-3" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                                        <FontAwesomeIcon icon={kpi.icon} className="fs-4" />
                                    </div>
                                    <div>
                                        <h4 className="fw-black mb-0">{kpi.value}</h4>
                                        <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">{kpi.label}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="fw-black mb-0">Upcoming Disbursement Calendar</h5>
                            <div className="d-flex gap-3">
                                <div className="input-group input-group-sm rounded-pill bg-light border-0 px-3">
                                    <span className="input-group-text bg-transparent border-0"><FontAwesomeIcon icon={faSearch} /></span>
                                    <input type="text" className="form-control bg-transparent border-0 x-small fw-bold" placeholder="Search payments..." />
                                </div>
                                <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW PAYMENT
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Transaction ID</th>
                                        <th className="py-3 border-0">Vendor</th>
                                        <th className="py-3 border-0">Scheduled Date</th>
                                        <th className="py-3 border-0 text-end">Amount</th>
                                        <th className="py-3 border-0 text-center">Frequency</th>
                                        <th className="py-3 border-0 text-center">Status</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(p => (
                                        <tr key={p.id} className="border-0 cursor-pointer">
                                            <td className="px-5 py-4 border-0">
                                                <span className="fw-black text-primary small">{p.id}</span>
                                            </td>
                                            <td className="border-0">
                                                <div className="fw-bold small">{p.vendor}</div>
                                                <div className="text-muted x-small uppercase">{p.category}</div>
                                            </td>
                                            <td className="border-0 fw-bold small text-muted">{p.date}</td>
                                            <td className="border-0 text-end fw-black small">{p.amount}</td>
                                            <td className="border-0 text-center">
                                                <span className="badge rounded-pill bg-light text-dark x-small fw-black px-3 py-2">{p.freq}</span>
                                            </td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${p.status === 'Scheduled' ? 'bg-info bg-opacity-10 text-info' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                    {p.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs rounded-circle bg-light border-0"><FontAwesomeIcon icon={faEllipsisV} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>
            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .dark-mode { color: #fff; }
                .uppercase { text-transform: uppercase; }
            `}</style>
        </div>
    );
};

export default ScheduledPayments;
