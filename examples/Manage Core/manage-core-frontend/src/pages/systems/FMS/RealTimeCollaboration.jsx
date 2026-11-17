
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserFriends, faComments, faEdit, faHistory,
    faCircle, faCheckCircle, faPaperPlane, faPlus,
    faLock, faFileAlt, faShareAlt, faEllipsisH
} from '@fortawesome/free-solid-svg-icons';

const RealTimeCollaboration = ({ isDark }) => {
    const [activeSessions, setActiveSessions] = useState(4);

    const [collabStats, setCollabStats] = useState([]);
    const [documentsInWork, setDocumentsInWork] = useState([]);
    const [users, setUsers] = useState([]);
    useEffect(() => { getTabData('realtime-collaboration').then(res => { const d = res.data?.data || []; setCollabStats(d); setDocumentsInWork(d); setUsers(d); }).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faUserFriends} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Real-Time Collaboration</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Multi-User Document Editing & Live Financial Workspaces</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faShareAlt} className="me-2" /> SHARE WORKSPACE
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW ROOM
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {collabStats.map((s, i) => (
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
                    {/* Active Documents Table */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Active Workspaces</h5>
                                    <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">LIVE</span>
                                </div>
                                <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faEllipsisH} /></button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Document Title</th>
                                                <th className="py-3 border-0">Collaborators</th>
                                                <th className="py-3 border-0">Last Activity</th>
                                                <th className="px-5 py-3 border-0 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentsInWork.map((doc, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${isDark ? 'bg-dark-alt' : 'bg-light'} text-primary`}>
                                                                <FontAwesomeIcon icon={faFileAlt} className="x-small" />
                                                            </div>
                                                            <div>
                                                                <div className="fw-black small">{doc.title}</div>
                                                                <div className="x-small text-muted fw-bold uppercase">Owner: {doc.owner}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0">
                                                        <div className="d-flex -space-x-2">
                                                            {[...Array(Math.min(doc.users, 3))].map((_, idx) => (
                                                                <div key={idx} className="rounded-circle border border-2 border-white bg-primary text-white d-flex align-items-center justify-content-center x-small fw-bold" style={{ width: '28px', height: '28px', marginLeft: idx > 0 ? '-10px' : '0' }}>
                                                                    {String.fromCharCode(65 + idx)}
                                                                </div>
                                                            ))}
                                                            {doc.users > 3 && <div className="rounded-circle border border-2 border-white bg-light text-muted d-flex align-items-center justify-content-center x-small fw-bold" style={{ width: '28px', height: '28px', marginLeft: '-10px' }}>+{doc.users - 3}</div>}
                                                        </div>
                                                    </td>
                                                    <td className="border-0 fw-bold x-small text-muted">{doc.lastEdit}</td>
                                                    <td className="px-5 border-0 text-end">
                                                        <button className="btn btn-xs btn-primary rounded-pill px-3 fw-black x-small shadow-sm">JOIN</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Users & Presence */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                        <FontAwesomeIcon icon={faCircle} className="x-small" />
                                    </div>
                                    <h6 className="fw-black mb-0 uppercase ls-wide">Team Presence</h6>
                                </div>
                                <span className="badge rounded-pill bg-white text-primary x-small fw-black shadow-sm">8 ONLINE</span>
                            </div>
                            
                            <div className="space-y-4">
                                {users.map((user, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white shadow-sm border'} mb-3`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex gap-3 align-items-center">
                                                <div className="position-relative">
                                                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold small" style={{ width: '40px', height: '40px' }}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className={`position-absolute bottom-0 end-0 rounded-circle border border-2 border-white ${user.status === 'online' ? 'bg-success' : 'bg-warning'}`} style={{ width: '12px', height: '12px' }}></div>
                                                </div>
                                                <div>
                                                    <div className="small fw-black uppercase x-small mb-0">{user.name}</div>
                                                    <p className="x-small mb-0 fw-bold opacity-75 text-muted">{user.role}</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-xs btn-light rounded-circle"><FontAwesomeIcon icon={faComments} className="text-primary x-small" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`mt-4 p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white'} border shadow-sm`}>
                                <div className="input-group input-group-sm">
                                    <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Message team..." />
                                    <button className="btn btn-primary rounded-pill px-3 ms-2"><FontAwesomeIcon icon={faPaperPlane} className="x-small" /></button>
                                </div>
                            </div>
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
                .-space-x-2 > * { margin-left: -0.5rem; }
            `}</style>
        </div>
    );
};

export default RealTimeCollaboration;
