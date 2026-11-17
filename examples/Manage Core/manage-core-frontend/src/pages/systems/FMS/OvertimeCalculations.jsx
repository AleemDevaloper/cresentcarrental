
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, faCalculator, faUsers, faFileInvoiceDollar,
    faSearch, faFilter, faEllipsisV, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

import { getTabData } from '../../../api/fms';

const OvertimeCalculations = ({ isDark }) => {
    const [logs, setLogs] = useState([]);
    useEffect(() => { getTabData('overtime').then(res => setLogs(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="row g-4 mb-4">
                    <div className="col-md-8">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="d-flex align-items-center gap-4 mb-5">
                                <div className="rounded-4 bg-primary p-3 text-white">
                                    <FontAwesomeIcon icon={faClock} className="fs-4" />
                                </div>
                                <div>
                                    <h4 className="fw-black mb-1">Overtime Multiplier Analytics</h4>
                                    <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Policy Enforcement & Wage Calculation Engine</p>
                                </div>
                            </div>
                            <div className="row g-4">
                                {[
                                    { l: 'Total OT Hours', v: '1,458', c: '#4f46e5' },
                                    { l: 'Projected Cost', v: '$42,500', c: '#10b981' },
                                    { l: 'Active Claims', v: '24', c: '#f59e0b' },
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
                            <h6 className="fw-black mb-4 uppercase ls-wide">Multiplier Config</h6>
                            <div className="space-y-3">
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-white bg-opacity-10">
                                    <span className="x-small fw-black uppercase ls-wide">Standard OT</span>
                                    <span className="fw-black">1.5x</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-white bg-opacity-10">
                                    <span className="x-small fw-black uppercase ls-wide">Weekend/Holiday</span>
                                    <span className="fw-black">2.0x</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-white bg-opacity-10">
                                    <span className="x-small fw-black uppercase ls-wide">Night Shift</span>
                                    <span className="fw-black">1.75x</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-black mb-0">Employee Overtime Ledger</h5>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">APPROVE ALL</button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Claim ID</th>
                                        <th className="py-3 border-0">Employee</th>
                                        <th className="py-3 border-0">Hours</th>
                                        <th className="py-3 border-0 text-center">Multiplier</th>
                                        <th className="py-3 border-0 text-end">Settlement</th>
                                        <th className="py-3 border-0 text-center">Status</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <span className="fw-black text-primary small">{log.id}</span>
                                            </td>
                                            <td className="border-0">
                                                <div className="fw-bold small">{log.emp}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{log.dept}</div>
                                            </td>
                                            <td className="border-0 fw-black small">{log.hours}h</td>
                                            <td className="border-0 text-center fw-bold small text-muted">{log.rate}</td>
                                            <td className="border-0 text-end fw-black small text-primary">{log.total}</td>
                                            <td className="border-0 text-center">
                                                <span className={`badge rounded-pill x-small fw-black px-3 py-2 ${log.status === 'Verified' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                    {log.status.toUpperCase()}
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
                .uppercase { text-transform: uppercase; }
            `}</style>
        </div>
    );
};

export default OvertimeCalculations;
