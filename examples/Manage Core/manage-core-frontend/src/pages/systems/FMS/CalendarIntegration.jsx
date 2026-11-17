
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarAlt, faSync, faCalendarCheck, faBell,
    faPlus, faCalendarDay, faUsers, faShieldAlt,
    faClock, faCheckCircle, faExclamationTriangle, faLink
} from '@fortawesome/free-solid-svg-icons';

const CalendarIntegration = ({ isDark }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);

    const [stats, setStats] = useState([]);
    useEffect(() => { getTabData('calendar-integration').then(res => setStats(res.data?.data || [])).catch(() => {}); }, []);

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    useEffect(() => { getTabData('calendar-integration').then(res => setUpcomingEvents(res.data?.data || [])).catch(() => {}); }, []);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faCalendarAlt} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Calendar Integration</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Unified Financial Scheduling & Deadline Management</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className={`btn rounded-pill px-4 fw-black x-small shadow-sm ${isSyncing ? 'btn-light disabled' : 'btn-primary'}`}
                                onClick={handleSync}
                            >
                                <FontAwesomeIcon icon={faSync} className={`me-2 ${isSyncing ? 'fa-spin' : ''}`} /> 
                                {isSyncing ? 'SYNCING...' : 'SYNC NOW'}
                            </button>
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm" onClick={() => setShowConnectModal(true)}>
                                <FontAwesomeIcon icon={faLink} className="me-2" /> CONNECT EXTERNAL
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {stats.map((s, i) => (
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
                    {/* Events Timeline */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Upcoming Financial Events</h5>
                                    <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">NEXT 30 DAYS</span>
                                </div>
                                <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Event Detail</th>
                                                <th className="py-3 border-0">Date</th>
                                                <th className="py-3 border-0">Category</th>
                                                <th className="px-5 py-3 border-0 text-end">Priority</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingEvents.map((event, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${isDark ? 'bg-dark-alt' : 'bg-light'} text-primary`}>
                                                                <FontAwesomeIcon icon={faCalendarDay} className="x-small" />
                                                            </div>
                                                            <div className="fw-black small">{event.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 fw-bold x-small text-muted">{event.date}</td>
                                                    <td className="border-0">
                                                        <span className="x-small fw-bold text-muted uppercase border px-2 py-1 rounded">{event.type}</span>
                                                    </td>
                                                    <td className="px-5 border-0 text-end">
                                                        <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                            event.priority === 'Critical' ? 'bg-danger' : 
                                                            event.priority === 'High' ? 'bg-warning text-dark' : 'bg-info'
                                                        }`}>
                                                            {event.priority.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Integration Settings */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                </div>
                                <h6 className="fw-black mb-0 uppercase ls-wide">Enterprise Settings</h6>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: "Two-Way Sync", desc: "Changes in FMS reflect in your external calendar instantly.", icon: faSync },
                                    { title: "Shared Team Calendars", desc: "Collaborate on deadlines across departments.", icon: faUsers },
                                    { title: "Audit Logging", desc: "Every calendar modification is tracked for security.", icon: faShieldAlt },
                                    { title: "Deadline Reminders", desc: "Automated alerts for critical financial milestones.", icon: faBell }
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
                                MANAGE ALL CONNECTIONS
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showConnectModal}
                onClose={() => setShowConnectModal(false)}
                title="Connect Your Calendar"
                size="md"
                footer={
                    <button className="btn btn-light rounded-pill w-100 fw-bold small py-2 border" onClick={() => setShowConnectModal(false)}>CANCEL</button>
                }
            >
                <p className="text-muted small fw-bold mb-4">Select a provider to sync your financial deadlines</p>
                <div className="d-grid gap-3">
                    <button className="btn btn-outline-dark rounded-pill py-3 fw-bold small d-flex align-items-center justify-content-center gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Color_Icon.svg" width="18" alt="Google" />
                        CONNECT GOOGLE CALENDAR
                    </button>
                    <button className="btn btn-outline-primary rounded-pill py-3 fw-bold small d-flex align-items-center justify-content-center gap-3">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" width="18" alt="Outlook" />
                        CONNECT OUTLOOK CALENDAR
                    </button>
                </div>
            </DialogBox>

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

export default CalendarIntegration;
