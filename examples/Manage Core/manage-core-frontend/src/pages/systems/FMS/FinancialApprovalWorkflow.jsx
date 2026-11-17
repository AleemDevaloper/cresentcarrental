
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faProjectDiagram, faCheckDouble, faUserShield, faHistory,
    faHourglassHalf, faCheckCircle, faTimesCircle, faChevronRight,
    faPlus, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';

const FinancialApprovalWorkflow = ({ isDark }) => {
    const [workflows, setWorkflows] = useState([]);
    useEffect(() => { getTabData('financial-approval').then(res => setWorkflows(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="row g-4 mb-4">
                    <div className="col-12">
                        <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <div>
                                    <h4 className="fw-black mb-1">Financial Orchestration Workflows</h4>
                                    <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Multi-stage Approval Engine Configuration</p>
                                </div>
                                <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                    <FontAwesomeIcon icon={faPlus} className="me-2" /> CREATE WORKFLOW
                                </button>
                            </div>

                            <div className="row g-4">
                                {workflows.map((wf, i) => (
                                    <div key={i} className="col-xl-3 col-md-6">
                                        <motion.div whileHover={{ y: -5 }} className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-light border-light shadow-hover'}`}>
                                            <div className="d-flex justify-content-between align-items-start mb-4">
                                                <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-2">
                                                    <FontAwesomeIcon icon={faProjectDiagram} />
                                                </div>
                                                <span className={`badge rounded-pill x-small fw-black px-2 py-1 ${wf.status === 'Priority' ? 'bg-danger text-white' : 'bg-success bg-opacity-10 text-success'}`}>
                                                    {wf.status}
                                                </span>
                                            </div>
                                            <h6 className="fw-black mb-1">{wf.name}</h6>
                                            <p className="text-muted x-small fw-bold mb-4 uppercase">{wf.owner}</p>
                                            
                                            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-opacity-10">
                                                <div>
                                                    <div className="fw-black small text-primary">{wf.steps} STEPS</div>
                                                    <div className="text-muted x-small fw-bold uppercase">Structure</div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-black small">{wf.active}</div>
                                                    <div className="text-muted x-small fw-bold uppercase">Pending</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Live Approval Queue</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Request</th>
                                        <th className="py-3 border-0">Workflow</th>
                                        <th className="py-3 border-0">Current Stage</th>
                                        <th className="py-3 border-0">Assignee</th>
                                        <th className="py-3 border-0">Time in Stage</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: 'REQ-451', title: 'Q3 Cloud Expansion', wf: 'CapEx > $50k', stage: 'Finance Review', user: 'Sarah Jenkins', time: '4h 12m' },
                                        { id: 'REQ-452', title: 'Client Dinner - Tokyo', wf: 'Travel Claims', stage: 'Manager Approval', user: 'David Chen', time: '1d 2h' },
                                        { id: 'REQ-453', title: 'Adobe License Renewal', wf: 'Vendor Renewal', stage: 'Legal Verification', user: 'Emma Wilson', time: '2h 45m' },
                                    ].map(req => (
                                        <tr key={req.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small">{req.title}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{req.id}</div>
                                            </td>
                                            <td className="border-0 fw-bold small text-muted">{req.wf}</td>
                                            <td className="border-0">
                                                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary x-small fw-black px-3 py-2">{req.stage.toUpperCase()}</span>
                                            </td>
                                            <td className="border-0 fw-bold small">{req.user}</td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={faHourglassHalf} className="text-warning x-small" />
                                                    <span className="fw-black small">{req.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs btn-primary rounded-pill px-3 fw-black x-small">VIEW FLOW</button>
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

export default FinancialApprovalWorkflow;
