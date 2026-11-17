
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlay, faPause, faStop, faSync, 
} from '@fortawesome/free-solid-svg-icons';

const AutomationControl = ({ isDark }) => {
    const automations = [
        { name: 'Daily Backup Sync', status: 'Running', health: 98, lastRun: '2h ago', color: 'success' },
        { name: 'Payroll Processing', status: 'Idle', health: 100, lastRun: '1d ago', color: 'primary' },
        { name: 'Asset Auto-Discovery', status: 'Warning', health: 65, lastRun: '10m ago', color: 'warning' },
        { name: 'CRM Data Scrubbing', status: 'Paused', health: 100, lastRun: '3h ago', color: 'secondary' },
    ];

    return (
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px', background: isDark ? 'rgba(15, 23, 42, 0.4)' : 'white', height: '500px' }}>
            <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Automation Control</h5>
                <button className="btn btn-sm btn-light-primary rounded-pill px-3"><FontAwesomeIcon icon={faSync} className="me-1" /> Refresh</button>
            </div>
            <div className="card-body p-4">
                <div className="space-y-4 overflow-y-auto custom-work-queue-scroll" style={{ maxHeight: '325px' }}>
                    {automations.map((auto) => (
                        <div key={auto.name} className={`p-3 rounded-4 border ${isDark ? 'border-white border-opacity-10' : 'border-light'} transition-all hover-lift`}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded-circle pulse-dot bg-${auto.color}`}></div>
                                    <div>
                                        <div className={`fw-bold small ${isDark ? 'text-white' : 'text-dark'}`}>{auto.name}</div>
                                        <div className="x-small text-muted">{auto.status} &middot; Last run {auto.lastRun}</div>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-xs btn-light-primary rounded-circle" style={{ width: '28px', height: '28px', padding: 0 }}><FontAwesomeIcon icon={auto.status === 'Running' ? faPause : faPlay} className="x-small" /></button>
                                    <button className="btn btn-xs btn-light-danger rounded-circle" style={{ width: '28px', height: '28px', padding: 0 }}><FontAwesomeIcon icon={faStop} className="x-small" /></button>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="flex-grow-1">
                                    <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                                        <div className={`progress-bar bg-${auto.color}`} style={{ width: `${auto.health}%` }}></div>
                                    </div>
                                </div>
                                <span className={`fw-bold x-small ${auto.health < 80 ? 'text-danger' : 'text-success'}`}>{auto.health}% Health</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn btn-primary w-100 rounded-pill mt-4 fw-bold py-2 shadow-sm">Enter Workflow Designer</button>
            </div>
        </div>
    );
};

export default AutomationControl;
