
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUndo, faHistory, faCheckCircle, faTimesCircle,
    faPlus, faSearch, faFilter, faChevronRight, faWallet
} from '@fortawesome/free-solid-svg-icons';

const RefundManagement = ({ isDark }) => {
    const [refunds, setRefunds] = useState([]);
    useEffect(() => { getTabData('refund-management').then(res => setRefunds(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faUndo} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Corporate Refund & Credit Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Reversal Orchestration & Original Transaction Linking</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> INITIATE REFUND
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Pending Refunds', v: '$12,450', c: '#f59e0b' },
                            { l: 'Processed (MTD)', v: '$84,200', c: '#10b981' },
                            { l: 'Rejection Rate', v: '1.2%', c: '#ef4444' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 bg-light border border-light text-center">
                                    <h3 className="fw-black mb-1" style={{ color: k.c }}>{k.v}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Refund Authorization Ledger</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Beneficiary</th>
                                        <th className="py-3 border-0">Reasoning</th>
                                        <th className="py-3 border-0">Origination Date</th>
                                        <th className="py-3 border-0 text-end">Gross Refund</th>
                                        <th className="py-3 border-0 text-center">Status</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {refunds.map(r => (
                                        <tr key={r.id} className="border-0 cursor-pointer">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small">{r.customer}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{r.id}</div>
                                            </td>
                                            <td className="border-0 fw-bold small text-muted">{r.reason}</td>
                                            <td className="border-0 text-muted small">{r.date}</td>
                                            <td className="border-0 text-end fw-black small text-primary">{r.amount}</td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${r.status === 'Processed' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                    {r.status.toUpperCase()}
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

export default RefundManagement;
