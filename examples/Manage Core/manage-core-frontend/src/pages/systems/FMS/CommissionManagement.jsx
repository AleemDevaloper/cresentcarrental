
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faAward, faUsers, faChartLine, faTrophy, faHandshake,
    faChevronRight, faStar, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';

import { getTabData } from '../../../api/fms';

const CommissionManagement = ({ isDark }) => {
    const [reps, setReps] = useState([]);
    useEffect(() => { getTabData('commission').then(res => setReps(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-sm">
                                <FontAwesomeIcon icon={faAward} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Sales Commission & Incentive Engine</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Variable Payout Management & Tiered Performance</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-xs rounded-pill px-4 bg-light border-0 fw-black x-small">TIER CONFIG</button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">CALCULATE BATCH</button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Commissions', v: '$124,850', i: faChartLine, c: '#4f46e5' },
                            { l: 'Top Performer', v: 'Lucius Verus', i: faTrophy, c: '#f59e0b' },
                            { l: 'Average Payout', v: '$8,450', i: faStar, c: '#10b981' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 bg-light bg-opacity-50 border border-light d-flex align-items-center gap-4">
                                    <div className="fs-3" style={{ color: k.c }}><FontAwesomeIcon icon={k.i} /></div>
                                    <div>
                                        <h4 className="fw-black mb-0">{k.v}</h4>
                                        <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Agent Performance & Payout Ledger</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Sales Representative</th>
                                        <th className="py-3 border-0">Gross Sales</th>
                                        <th className="py-3 border-0 text-center">Comm Rate</th>
                                        <th className="py-3 border-0 text-end">Total Incentive</th>
                                        <th className="py-3 border-0 text-center">Target Quota</th>
                                        <th className="py-3 border-0 text-center">Lifecycle</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reps.map(rep => (
                                        <tr key={rep.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-black x-small" style={{ width: '32px', height: '32px' }}>{rep.name.charAt(0)}</div>
                                                    <div>
                                                        <div className="fw-bold small">{rep.name}</div>
                                                        <div className="text-muted x-small fw-bold uppercase">{rep.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-0 fw-black small">{rep.sales}</td>
                                            <td className="border-0 text-center fw-bold small text-muted">{rep.rate}</td>
                                            <td className="border-0 text-end fw-black small text-primary">{rep.comm}</td>
                                            <td className="border-0 text-center">
                                                <div className="fw-black small text-info">{rep.target}</div>
                                                <div className="progress rounded-pill mt-1 mx-auto" style={{ height: '4px', width: '60px' }}>
                                                    <div className="progress-bar bg-info" style={{ width: rep.target }}></div>
                                                </div>
                                            </td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${rep.status === 'Paid' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                    {rep.status.toUpperCase()}
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

export default CommissionManagement;
