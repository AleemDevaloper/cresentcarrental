
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTowerBroadcast, faGlobe, faShieldAlt, 
    faUserCheck, faChartPie, faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

const ExecutiveBriefing = ({ isDark }) => {
    const alerts = [
        { type: 'Critical', msg: 'System Latency Spike in EU-West Cluster', icon: faExclamationTriangle, color: 'danger' },
        { type: 'Notice', msg: 'Governance Audit Completed (98% Pass)', icon: faShieldAlt, color: 'success' },
        { type: 'Update', msg: 'New Workforce Policy Deployed via HRMS', icon: faUserCheck, color: 'primary' },
    ];

    return (
        <div className={`p-4 rounded-5 shadow-2xl overflow-hidden position-relative ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white border-light'}`} style={{ border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
            <div className="position-absolute top-0 end-0 p-4 opacity-5">
                <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '10rem' }} />
            </div>
            
            <div className="d-flex align-items-center justify-content-between mb-4 position-relative z-1">
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-4 bg-danger bg-opacity-10 p-2 text-danger animate-pulse">
                        <FontAwesomeIcon icon={faTowerBroadcast} />
                    </div>
                    <div>
                        <h6 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Live Executive Briefing</h6>
                        <small className="text-muted fw-bold x-small">Mission Control Data Stream</small>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2 bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill x-small fw-bold">
                    <span className="pulse-dot bg-success"></span> ONLINE
                </div>
            </div>

            <div className="space-y-4 position-relative z-1">
                {alerts.map((alert, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-3 my-2 rounded-4 d-flex align-items-center gap-3 ${isDark ? 'bg-white bg-opacity-5' : 'bg-light'} border ${isDark ? 'border-white border-opacity-10' : 'border-gray-200'} shadow-sm`}
                    >
                        <div className={`rounded-circle p-2 text-${alert.color} bg-${alert.color} bg-opacity-10 x-small`}>
                            <FontAwesomeIcon icon={alert.icon} />
                        </div>
                        <div className="flex-grow-1">
                            <div className={`fw-black x-small text-uppercase text-${alert.color}`} style={{ letterSpacing: '0.05em' }}>{alert.type}</div>
                            <div className={`small fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>{alert.msg}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-2 pt-3 border-top border-white border-opacity-10">
                <div className="row g-3">
                    <div className="col-4 text-center">
                        <div className="text-muted x-small fw-bold text-uppercase mb-1">Global Health</div>
                        <div className="h4 fw-black text-success mb-0">99.4%</div>
                    </div>
                    <div className="col-4 text-center border-start border-end border-white border-opacity-10">
                        <div className="text-muted x-small fw-bold text-uppercase mb-1">Risk Score</div>
                        <div className="h4 fw-black text-warning mb-0">12.8</div>
                    </div>
                    <div className="col-4 text-center">
                        <div className="text-muted x-small fw-bold text-uppercase mb-1">Compliance</div>
                        <div className="h4 fw-black text-primary mb-0">97%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveBriefing;
