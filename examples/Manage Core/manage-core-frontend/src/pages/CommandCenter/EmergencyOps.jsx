
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRadiation, faBiohazard, faExclamationCircle, 
    faTowerCell, faPlug, faDatabase, faMicrochip
} from '@fortawesome/free-solid-svg-icons';

const EmergencyOps = ({ isDark }) => {
    const [defcon, setDefcon] = useState(5);
    const [isEmergency, setIsEmergency] = useState(false);

    const systems = [
        { name: 'Core API', status: 'Optimal', load: '12%', color: 'success' },
        { name: 'Data Shard A', status: 'Optimal', load: '45%', color: 'success' },
        { name: 'Identity Provider', status: 'Warning', load: '88%', color: 'warning' },
        { name: 'Storage Cluster', status: 'Optimal', load: '5%', color: 'success' },
    ];

    return (
        <div className={`p-4 rounded-5 overflow-hidden position-relative ${isDark ? 'bg-dark-card border-danger border-opacity-20' : 'bg-white border-danger border-opacity-10'}`} style={{ border: '2px solid' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div className={`p-2 rounded-3 ${isEmergency ? 'bg-danger text-white animate-pulse' : 'bg-danger bg-opacity-10 text-danger'}`}>
                        <FontAwesomeIcon icon={faRadiation} />
                    </div>
                    <div>
                        <h6 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Emergency Operations Center</h6>
                        <small className="text-muted fw-bold x-small">EOC System Status</small>
                    </div>
                </div>
                <div className="badge bg-danger text-white px-3 py-1 rounded-pill x-small fw-black">DEFCON {defcon}</div>
            </div>

            <div className="row g-3 mb-4">
                {systems.map((sys) => (
                    <div key={sys.name} className="col-6">
                        <div className={`p-2 rounded-3 ${isDark ? 'bg-white bg-opacity-5' : 'bg-light'} border-start border-4 border-${sys.color}`}>
                            <div className="x-small text-muted fw-bold text-uppercase">{sys.name}</div>
                            <div className={`small fw-black ${isDark ? 'text-white' : 'text-dark'}`}>{sys.status}</div>
                            <div className="progress mt-1" style={{ height: '4px' }}>
                                <div className={`progress-bar bg-${sys.color}`} style={{ width: sys.load }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2 mt-auto">
                <button 
                    className={`btn btn-sm flex-grow-1 rounded-pill fw-black ${isEmergency ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setIsEmergency(!isEmergency)}
                >
                    {isEmergency ? 'ABORT EMERGENCY' : 'DECLARE EMERGENCY'}
                </button>
                <button className={`btn btn-sm btn-dark rounded-pill px-3`} onClick={() => setDefcon(prev => prev > 1 ? prev - 1 : 5)}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                </button>
            </div>

            <AnimatePresence>
                {isEmergency && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="position-absolute top-0 start-0 w-100 h-100 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center pointer-events-none"
                        style={{ zIndex: 0 }}
                    >
                        <div className="display-1 opacity-10 fw-black rotate-12">EMERGENCY</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmergencyOps;
