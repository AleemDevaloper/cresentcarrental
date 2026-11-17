
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserTag, faCarSide, faPlaneDeparture, faUtensils,
    faPlus, faFilter, faSearch, faChevronRight, faWallet
} from '@fortawesome/free-solid-svg-icons';

const EmployeeReimbursements = ({ isDark }) => {
    const [claims, setClaims] = useState([]);
    useEffect(() => { getTabData('employee-reimbursement').then(res => setClaims(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="row g-4 mb-4">
                    <div className="col-md-8">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="d-flex align-items-center gap-4 mb-5">
                                <div className="rounded-4 bg-primary p-3 text-white">
                                    <FontAwesomeIcon icon={faUserTag} className="fs-4" />
                                </div>
                                <div>
                                    <h4 className="fw-black mb-1">Personal Out-of-Pocket Claims</h4>
                                    <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Employee Expense Reimbursement Management</p>
                                </div>
                            </div>
                            <div className="row g-4">
                                {[
                                    { l: 'Open Claims', v: '42', c: '#4f46e5' },
                                    { l: 'Pending Payout', v: '$12,450', c: '#f59e0b' },
                                    { l: 'Avg Processing', v: '2.4 Days', i: faWallet, c: '#10b981' },
                                ].map((k, i) => (
                                    <div key={i} className="col-4">
                                        <h3 className="fw-black mb-1" style={{ color: k.c }}>{k.v}</h3>
                                        <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10' : 'bg-primary text-white shadow-lg'}`}>
                            <h6 className="fw-black mb-4 uppercase ls-wide">Quick Submit</h6>
                            <div className="row g-2">
                                {[
                                    { n: 'Mileage', i: faCarSide },
                                    { n: 'Travel', i: faPlaneDeparture },
                                    { n: 'Meals', i: faUtensils },
                                ].map((item, i) => (
                                    <div key={i} className="col-4 text-center">
                                        <div className="p-3 rounded-4 bg-white bg-opacity-10 cursor-pointer transition-all hover-bg-opacity-20 mb-2">
                                            <FontAwesomeIcon icon={item.i} className="fs-5" />
                                        </div>
                                        <div className="x-small fw-black uppercase">{item.n}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-black mb-0">Personal Reimbursement Queue</h5>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">INITIATE PAYOUT BATCH</button>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Claimant</th>
                                        <th className="py-3 border-0">Category</th>
                                        <th className="py-3 border-0">Amount</th>
                                        <th className="py-3 border-0">Date</th>
                                        <th className="py-3 border-0 text-center">Status</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map(claim => (
                                        <tr key={claim.id} className="border-0 cursor-pointer">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-bold small">{claim.emp}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{claim.id}</div>
                                            </td>
                                            <td className="border-0 fw-black small text-primary">{claim.cat}</td>
                                            <td className="border-0 fw-black small">{claim.amt}</td>
                                            <td className="border-0 text-muted small">{claim.date}</td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${claim.status === 'Paid' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                    {claim.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs rounded-circle bg-light border-0"><FontAwesomeIcon icon={faChevronRight} /></button>
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
                .uppercase { text-transform: uppercase; }
            `}</style>
        </div>
    );
};

export default EmployeeReimbursements;
