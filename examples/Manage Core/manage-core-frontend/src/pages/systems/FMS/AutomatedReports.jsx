
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarCheck, faRobot, faPaperPlane, faPlus,
    faClock, faGear, faEnvelope, faFileExport,
    faTriangleExclamation, faCheckCircle, faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const AutomatedReports = ({ isDark }) => {
    const [showNewModal, setShowNewModal] = useState(false);
    const [stats, setStats] = useState({ totalSchedules: 0, activeSchedules: 0, reportsGenerated: 0 });
    const [loading, setLoading] = useState(true);

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        getTabData('automated-reports').then(res => {
            const data = res.data?.data || {};
            setStats({ totalSchedules: data.totalSchedules || 0, activeSchedules: data.activeSchedules || 0, reportsGenerated: data.reportsGenerated || 0 });
            setSchedules(data.schedules || []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header Stats */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-indigo p-3 text-white shadow-indigo">
                                <FontAwesomeIcon icon={faRobot} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Automated Reporting Service</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Scheduled Intelligence & Direct Stakeholder Delivery</p>
                            </div>
                        </div>
                        <button className="btn btn-indigo rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowNewModal(true)}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> CONFIGURE NEW ROBOT
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Active Schedules', v: '12 Jobs', i: faCalendarCheck, c: '#6366f1' },
                            { l: 'Reports Sent (MTD)', v: '342', i: faPaperPlane, c: '#10b981' },
                            { l: 'System Health', v: '99.9%', i: faCheckCircle, c: '#0ea5e9' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">{s.l}</h6>
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} />
                                    </div>
                                    <h2 className="fw-black mb-0">{s.v}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule Table */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-0">
                        <h5 className="fw-black mb-0 text-dark">Active Task Automations</h5>
                    </div>
                    <div className="table-responsive p-4 p-xl-5 pt-0">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-4 py-3 border-0">Report Entity</th>
                                    <th className="py-3 border-0">Recurrence</th>
                                    <th className="py-3 border-0">Primary Recipient</th>
                                    <th className="py-3 border-0 text-center">Status</th>
                                    <th className="px-4 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(job => (
                                    <tr key={job.id} className="border-0">
                                        <td className="px-4 py-4 border-0">
                                            <div className="fw-black small text-primary">{job.name}</div>
                                            <div className="text-muted x-small fw-bold">ID: {job.id} • Last Run: {job.lastRun}</div>
                                        </td>
                                        <td className="border-0 small fw-bold text-muted">
                                            <FontAwesomeIcon icon={faClock} className="me-2 opacity-50" />
                                            {job.frequency}
                                        </td>
                                        <td className="border-0 x-small fw-bold">
                                            <span className="badge bg-light text-dark border px-3 py-2">{job.recipient}</span>
                                        </td>
                                        <td className="border-0 text-center">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${job.status === 'Active' ? 'bg-success text-white' : 'bg-secondary text-white opacity-50'}`}>
                                                {job.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 border-0 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button className="btn btn-xs btn-light rounded-circle shadow-xs border"><FontAwesomeIcon icon={faGear} /></button>
                                                <button className="btn btn-xs btn-light rounded-circle shadow-xs border text-danger"><FontAwesomeIcon icon={faTrashCan} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showNewModal}
                onClose={() => setShowNewModal(false)}
                title="Configure Report Robot"
                size="md"
                footer={
                    <button className="btn btn-indigo w-100 rounded-pill py-3 fw-bold small shadow-indigo text-white">ACTIVATE AUTOMATION</button>
                }
            >
                <div className="row g-4">
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Report Definition</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Profit & Loss Summary</option>
                            <option>Tax Compliance Register</option>
                            <option>Expense Breakdown</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Frequency</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Delivery Time</label>
                        <input type="time" className="form-control rounded-pill x-small fw-bold border-2" />
                    </div>
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Distribution List (Comma Separated Emails)</label>
                        <textarea className="form-control rounded-4 x-small fw-bold border-2" rows="2" placeholder="ceo@pms.com, cfo@pms.com"></textarea>
                    </div>
                </div>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .bg-indigo { background: #6366f1; }
                .btn-indigo { background: #6366f1; border-color: #6366f1; }
                .btn-indigo:hover { background: #4f46e5; border-color: #4f46e5; }
                .shadow-indigo { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
                .text-dark { color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default AutomatedReports;
