
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserShield, faDisplay, faMobileScreenButton, faGlobe,
    faClock, faBan, faRotateLeft, faCircle, faLocationDot,
    faFingerprint, faShieldVirus
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const SessionManagement = ({ isDark }) => {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        getTabData('session-management').then(res => setSessions(res.data?.data || [])).catch(() => {});
    }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Security Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-danger p-3 text-white shadow-danger">
                                <FontAwesomeIcon icon={faUserShield} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Session & Security Guard</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Active User Monitoring & Real-time Session Revocation</p>
                            </div>
                        </div>
                        <button className="btn btn-outline-danger rounded-pill px-4 fw-black x-small shadow-sm border-2">
                            <FontAwesomeIcon icon={faBan} className="me-2" /> REVOKE ALL SESSIONS
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Active Sessions', v: '42', i: faDisplay, c: '#ef4444' },
                            { l: 'Login Security Score', v: '98%', i: faFingerprint, c: '#10b981' },
                            { l: 'Threats Blocked (24h)', v: '12', i: faShieldVirus, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                            <FontAwesomeIcon icon={s.i} style={{ color: s.c }} className="x-small" />
                                        </div>
                                        <div className="text-muted x-small fw-bold uppercase ls-wide">{s.l}</div>
                                    </div>
                                    <h3 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Session List */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Live Auth Sessions</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                    <tr>
                                        <th className="px-5 py-3 border-0">Identity & Device</th>
                                        <th className="py-3 border-0">Network Details</th>
                                        <th className="py-3 border-0">Location</th>
                                        <th className="py-3 border-0">Last Activity</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr key={session.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className={`rounded-4 p-3 ${session.isCurrent ? 'bg-success text-white' : 'bg-light text-muted'} border`}>
                                                        <FontAwesomeIcon icon={session.device.includes('iPhone') ? faMobileScreenButton : faDisplay} />
                                                    </div>
                                                    <div>
                                                        <div className="fw-black small">{session.user}</div>
                                                        <div className="text-muted x-small fw-bold">{session.device}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={faGlobe} className="text-muted x-small" />
                                                    <span className="x-small fw-bold text-muted">{session.ip}</span>
                                                </div>
                                            </td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={faLocationDot} className="text-danger x-small" />
                                                    <span className="x-small fw-bold text-muted">{session.location}</span>
                                                </div>
                                            </td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={faClock} className="text-primary x-small" />
                                                    <span className={`x-small fw-black ${session.isCurrent ? 'text-success' : 'text-muted'}`}>{session.lastActive}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                {!session.isCurrent && (
                                                    <button className="btn btn-xs btn-outline-danger rounded-pill px-3 fw-black x-small">
                                                        REVOKE
                                                    </button>
                                                )}
                                                {session.isCurrent && (
                                                    <span className="badge rounded-pill bg-success-subtle text-success x-small fw-black px-3">THIS DEVICE</span>
                                                )}
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
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-danger { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4); }
            `}</style>
        </div>
    );
};

export default SessionManagement;
