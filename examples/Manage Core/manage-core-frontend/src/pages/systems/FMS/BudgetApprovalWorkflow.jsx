
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileInvoiceDollar, faCheckDouble, faSitemap, faHistory,
    faPlus, faFilter, faSearch, faChevronRight, faFileSignature
} from '@fortawesome/free-solid-svg-icons';

const BudgetApprovalWorkflow = ({ isDark }) => {
    const [budgets, setBudgets] = useState([]);
    useEffect(() => { getTabData('budget-approval').then(res => setBudgets(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-sm">
                                <FontAwesomeIcon icon={faSitemap} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Budgetary Governance & Approval Cycles</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Fiscal Period Planning & Departmental Allocation Workflows</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> INITIATE BUDGET
                        </button>
                    </div>

                    <div className="row g-4">
                        {budgets.map((b, i) => (
                            <div key={i} className="col-xl-4 col-md-6">
                                <motion.div whileHover={{ y: -5 }} className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-light border-light shadow-hover'}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="fw-black text-primary small">{b.id}</div>
                                        <span className={`badge rounded-pill x-small fw-black px-2 py-1 ${b.status === 'Approved' ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                                            {b.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h6 className="fw-black mb-1">{b.dept} Department</h6>
                                    <h4 className="fw-black mb-4">{b.amount}</h4>
                                    
                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-opacity-10">
                                        <div className="text-muted x-small fw-bold uppercase">{b.period}</div>
                                        <div className="text-end">
                                            <div className="x-small fw-black uppercase opacity-50">Custodian</div>
                                            <div className="fw-bold small">{b.owner}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Audit Trail: Fiscal Authorization Logs</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Timestamp</th>
                                        <th className="py-3 border-0">Entity</th>
                                        <th className="py-3 border-0">Action</th>
                                        <th className="py-3 border-0">Authorized By</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { time: '2026-06-08 14:20', entity: 'Marketing Q3 Budget', action: 'Approved Phase 1', user: 'Director of Finance' },
                                        { time: '2026-06-08 11:45', entity: 'Engineering FY26', action: 'Requested Revision', user: 'Global Controller' },
                                        { time: '2026-06-07 09:30', entity: 'Ops Maintenance', action: 'Final Approval', user: 'CFO Office' },
                                    ].map((log, idx) => (
                                        <tr key={idx} className="border-0">
                                            <td className="px-5 py-4 border-0 x-small fw-bold text-muted">{log.time}</td>
                                            <td className="border-0 fw-black small">{log.entity}</td>
                                            <td className="border-0">
                                                <span className="badge rounded-pill bg-light text-muted x-small fw-black px-3 py-2">{log.action.toUpperCase()}</span>
                                            </td>
                                            <td className="border-0 fw-bold small">{log.user}</td>
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

export default BudgetApprovalWorkflow;
