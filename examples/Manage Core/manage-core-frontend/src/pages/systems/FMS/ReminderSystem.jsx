
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBell, faBullhorn, faEnvelopeOpenText, faMobileAlt,
    faClock, faCheckCircle, faExclamationCircle, faCog,
    faPlus, faFilter, faSearch, faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const ReminderSystem = ({ isDark }) => {
    const [activeTab, setActiveTab] = useState('active');

    const [reminderStats, setReminderStats] = useState([]);
    const [activeReminders, setActiveReminders] = useState([]);
    useEffect(() => { getTabData('reminder-system').then(res => { const d = res.data?.data || []; setReminderStats(d); setActiveReminders(d); }).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faBell} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Enterprise Reminder System</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Multi-Channel Notifications & Automated Escalations</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faCog} className="me-2" /> SETTINGS
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> CREATE REMINDER
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {reminderStats.map((s, i) => (
                            <div key={i} className="col-md-3">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border position-relative overflow-hidden`}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <FontAwesomeIcon icon={s.icon} className="fs-2" />
                                    </div>
                                    <h3 className="fw-black mb-1" style={{ color: s.color }}>{s.value}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{s.label}</div>
                                    <div className="x-small text-muted opacity-75 mt-2 fw-bold">{s.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {/* Active Notifications Table */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Queue Management</h5>
                                    <div className="d-flex bg-light rounded-pill p-1">
                                        <button className={`btn btn-xs rounded-pill px-3 fw-black ${activeTab === 'active' ? 'bg-white shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('active')}>ACTIVE</button>
                                        <button className={`btn btn-xs rounded-pill px-3 fw-black ${activeTab === 'scheduled' ? 'bg-white shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('scheduled')}>SCHEDULED</button>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '180px' }}>
                                        <span className="input-group-text bg-transparent border-0 ps-3">
                                            <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                        </span>
                                        <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search..." />
                                    </div>
                                    <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Notification Detail</th>
                                                <th className="py-3 border-0">Due Time</th>
                                                <th className="py-3 border-0">Channel</th>
                                                <th className="px-5 py-3 border-0 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeReminders.map((reminder, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${isDark ? 'bg-dark-alt' : 'bg-light'} ${reminder.priority === 'High' ? 'text-danger' : 'text-primary'}`}>
                                                                <FontAwesomeIcon icon={reminder.priority === 'High' ? faExclamationCircle : faBell} className="x-small" />
                                                            </div>
                                                            <div>
                                                                <div className="fw-black small">{reminder.title}</div>
                                                                <div className="x-small text-muted fw-bold uppercase">{reminder.type}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 fw-bold x-small text-muted">{reminder.time}</td>
                                                    <td className="border-0">
                                                        <span className="x-small fw-bold text-muted uppercase border px-2 py-1 rounded">{reminder.channel}</span>
                                                    </td>
                                                    <td className="px-5 border-0 text-end">
                                                        <button className="btn btn-xs btn-light rounded-circle shadow-sm">
                                                            <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Enterprise Sidebar */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faBullhorn} />
                                </div>
                                <h6 className="fw-black mb-0 uppercase ls-wide">Channel Controls</h6>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: "Escalation Logic", desc: "Auto-escalate to managers if reminders are ignored.", icon: faExclamationCircle },
                                    { title: "Template Manager", desc: "Design enterprise-wide notification branding.", icon: faEnvelopeOpenText },
                                    { title: "Governance", desc: "Set limits on notification frequency and quiet hours.", icon: faCog },
                                    { title: "Multi-Device", desc: "Unified sync across mobile, desktop, and web.", icon: faMobileAlt }
                                ].map((feature, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white shadow-sm border'} mb-3`}>
                                        <div className="d-flex gap-3">
                                            <FontAwesomeIcon icon={feature.icon} className="text-primary mt-1" />
                                            <div>
                                                <div className="small fw-black uppercase x-small mb-1">{feature.title}</div>
                                                <p className="x-small mb-0 fw-bold opacity-75">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary w-100 rounded-pill mt-4 fw-black x-small py-3 shadow-primary">
                                RE-SYNC ALL CHANNELS
                            </button>
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
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
            `}</style>
        </div>
    );
};

export default ReminderSystem;
