
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMapMarkerAlt, faTruck, faBoxOpen, faSync,
    faChevronRight, faClock, faCheckCircle, faCircle
} from '@fortawesome/free-solid-svg-icons';

const RefundTracking = ({ isDark }) => {
    const [activeTrackings, setActiveTrackings] = useState([]);
    useEffect(() => { getTabData('refund-tracking').then(res => setActiveTrackings(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex align-items-center gap-4 mb-5">
                        <div className="rounded-4 bg-primary p-3 text-white shadow-lg">
                            <FontAwesomeIcon icon={faTruck} className="fs-4" />
                        </div>
                        <div>
                            <h4 className="fw-black mb-1">Reverse Logistics & Asset Recovery Tracking</h4>
                            <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">End-to-End Refund Item Lifecycle Monitoring</p>
                        </div>
                    </div>

                    <div className="row g-4">
                        {activeTrackings.map((t, i) => (
                            <div key={i} className="col-xl-4 col-md-6">
                                <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-light border-light shadow-sm'}`}>
                                    <div className="d-flex justify-content-between mb-4">
                                        <div className="fw-black text-primary x-small ls-wide">{t.id}</div>
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faClock} className="text-muted x-small" />
                                            <span className="x-small fw-bold text-muted uppercase">{t.update}</span>
                                        </div>
                                    </div>
                                    <h6 className="fw-black mb-1">{t.item}</h6>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary x-small" />
                                        <span className="x-small fw-black text-muted opacity-75">{t.loc}</span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="x-small fw-black uppercase text-primary">{t.status}</span>
                                            <span className="x-small fw-black">{t.progress}%</span>
                                        </div>
                                        <div className="progress rounded-pill shadow-inner" style={{ height: '6px' }}>
                                            <div className="progress-bar rounded-pill bg-primary" style={{ width: `${t.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        {[1, 2, 3, 4].map(step => (
                                            <div key={step} className={`flex-grow-1 rounded-pill`} style={{ height: '4px', background: t.progress >= (step * 25) ? '#4f46e5' : 'rgba(0,0,0,0.05)' }}></div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 mt-5 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Refund Movement History</h5>
                    </div>
                    <div className="card-body p-5 pt-0">
                        <div className="space-y-4 ps-4 border-start border-2 border-primary border-opacity-10">
                            {[
                                { title: 'Asset Verified at Warehouse', time: 'Today, 10:45 AM', desc: 'Item condition matches "Like New" criteria. Proceeding to refund processing.', icon: faCheckCircle, color: '#10b981' },
                                { title: 'In-Transit to Consolidation Point', time: 'Yesterday, 04:20 PM', desc: 'Package arrived at Frankfurt distribution hub.', icon: faTruck, color: '#4f46e5' },
                                { title: 'Refund Initiated by Client', time: '06 Jun, 09:15 AM', desc: 'RMA number RMA-2026-X12 issued to Stellar Services.', icon: faBoxOpen, color: '#f59e0b' },
                            ].map((event, idx) => (
                                <div key={idx} className="position-relative mb-5">
                                    <div className="position-absolute translate-middle-x" style={{ left: '-33px', top: '0' }}>
                                        <div className="rounded-circle bg-white p-1" style={{ border: `3px solid ${event.color}` }}>
                                            <FontAwesomeIcon icon={event.icon} className="small" style={{ color: event.color }} />
                                        </div>
                                    </div>
                                    <div className="fw-black small mb-1">{event.title}</div>
                                    <div className="x-small fw-bold text-muted uppercase mb-2">{event.time}</div>
                                    <p className="text-muted small fw-bold mb-0 opacity-75">{event.desc}</p>
                                </div>
                            ))}
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

export default RefundTracking;
