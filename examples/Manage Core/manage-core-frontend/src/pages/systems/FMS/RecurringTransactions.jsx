
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSync, faPlus, faCalendarAlt, faHistory,
    faChevronRight, faSearch, faFilter, faClock
} from '@fortawesome/free-solid-svg-icons';

const RecurringTransactions = ({ isDark }) => {
    const [subs, setSubs] = useState([]);
    useEffect(() => { getTabData('recurring-transactions').then(res => setSubs(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faSync} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Recurring Transaction Engine</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Subscription Management & Automated Ledger Entries</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW TEMPLATE
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Monthly Commitment', v: '$24,500', c: '#4f46e5' },
                            { l: 'Active Subscriptions', v: '38', c: '#10b981' },
                            { l: 'Next Run Date', v: 'Jun 15, 2026', c: '#f59e0b' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 bg-light border border-light">
                                    <h3 className="fw-black mb-1" style={{ color: k.c }}>{k.v}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Automated Billing Templates</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Service Entity</th>
                                        <th className="py-3 border-0">Cycle Frequency</th>
                                        <th className="py-3 border-0">Next Execution</th>
                                        <th className="py-3 border-0 text-end">Periodic Amount</th>
                                        <th className="py-3 border-0 text-center">Lifecycle</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subs.map(s => (
                                        <tr key={s.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small">{s.name}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{s.id}</div>
                                            </td>
                                            <td className="border-0">
                                                <span className="badge rounded-pill bg-light text-muted x-small fw-black px-3 py-2">{s.freq.toUpperCase()}</span>
                                            </td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={faClock} className="text-primary x-small" />
                                                    <span className="fw-bold small text-muted">{s.next}</span>
                                                </div>
                                            </td>
                                            <td className="border-0 text-end fw-black small text-primary">{s.amt}</td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${s.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-muted'}`}>
                                                    {s.status.toUpperCase()}
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

export default RecurringTransactions;
