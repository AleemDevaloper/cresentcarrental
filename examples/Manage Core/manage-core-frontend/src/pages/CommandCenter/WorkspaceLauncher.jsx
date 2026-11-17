import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faThLarge, faUsers, faProjectDiagram, faTasks, 
    faFileAlt, faHandshake, faWallet, faHeadset, 
    faBoxes, faTools, faChevronRight, faCircle,
    faIndustry, faDollarSign, faBrain
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../hooks/useApp';
import { getSystemModules } from '../../api/enterprise';

const ICON_MAP = {
    faUsers, faProjectDiagram, faTasks, faFileAlt,
    faHandshake, faWallet, faHeadset, faTools, faBoxes,
    faIndustry, faDollarSign, faBrain,
};

const MODULE_TAB_MAP = {
    HRMS: 'hrms_overview',
    PMS: 'pms_overview',
    TMS: 'tms_dashboard',
    DMS: 'dms_dashboard',
    CRM: 'crm_overview',
    FMS: 'fms_overview',
    ASST: 'asst_overview',
    INV: 'inv_overview',
    POS: 'pos_overview',
    MFG: 'mfg_overview',
    FX: 'fx_overview',
    AI: 'ai_overview',
};

const WorkspaceLauncher = ({ isDark }) => {
    const { setSystemContext, setActiveModule, setActiveTab } = useApp();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSystemModules()
            .then(res => {
                setModules(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                setModules([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleLaunch = (mod) => {
        if (mod.status === 'In Building' || mod.status === '--') return;
        const sysId = mod.code.toLowerCase();
        setSystemContext(sysId);
        setActiveModule(sysId);
        setActiveTab(MODULE_TAB_MAP[mod.code] || `${sysId}_overview`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.04 }
        }
    };

    const itemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    const displayModules = loading
        ? Array.from({ length: 9 }, (_, i) => ({
            code: '...', name: 'Loading...', icon: 'faTools',
            color: '#6b7280', status: '--', uptime: '--', _skeleton: true
        }))
        : modules;

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="row g-4"
        >
            {displayModules.map((mod, i) => {
                const isDisabled = mod.status === 'In Building' || mod._skeleton;
                const IconComponent = ICON_MAP[mod.icon] || faTools;
                return (
                <div key={mod.code + i} className="col-12 col-md-6 col-xl-4">
                    <motion.div
                        variants={itemVariants}
                        whileHover={isDisabled ? {} : { 
                            y: -4, 
                            boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 20px 40px rgba(79, 70, 229, 0.08)',
                        }}
                        onClick={() => !isDisabled && handleLaunch(mod)}
                        className={`card border-0 shadow-sm h-100 overflow-hidden position-relative ${isDisabled ? '' : 'cursor-pointer group'} ${isDark ? 'bg-dark-card' : 'bg-white'}`}
                        style={{ 
                            borderRadius: '20px', 
                            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                            background: isDark ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' : '#ffffff',
                            ...(isDisabled ? { opacity: 0.55, filter: 'grayscale(0.5)', cursor: 'not-allowed' } : {})
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-4">
                                <div 
                                    className={`flex-shrink-0 rounded-4 d-flex align-items-center justify-content-center transition-all ${isDisabled ? '' : 'group-hover-scale'}`}
                                    style={{ 
                                        width: '64px', 
                                        height: '64px', 
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.03)',
                                        color: isDisabled ? '#adb5bd' : mod.color
                                    }}
                                >
                                    <FontAwesomeIcon icon={IconComponent} className="fs-3" />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <span className={`fw-black text-uppercase letter-spacing-wider ${isDark ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>
                                            {mod.code} SUBSYSTEM
                                        </span>
                                        {!isDisabled && mod.uptime && mod.uptime !== '--' && (
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faCircle} className="text-success x-small animate-pulse" style={{ fontSize: '6px' }} />
                                            <span className="x-small fw-bold text-success" style={{ fontSize: '0.6rem' }}>{mod.uptime}</span>
                                        </div>
                                        )}
                                    </div>
                                    <h5 className={`fw-black mb-1 ${isDark ? 'text-white' : 'text-dark'}`} style={{ letterSpacing: '-0.02em' }}>{mod.name}</h5>
                                    {mod.description && (
                                        <p
                                            className="mb-0"
                                            style={{
                                                color: isDark ? 'rgba(255,255,255,0.55)' : '#6b7280',
                                                fontSize: '0.75rem',
                                                marginTop: '4px',
                                                lineHeight: '1.4',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {mod.description}
                                        </p>
                                    )}

                                    <div className="d-flex align-items-center gap-3 mt-2">
                                        <div className={`badge rounded-pill px-2 py-1 fw-bold ${isDisabled ? 'bg-warning-subtle text-warning' : (isDark ? 'bg-white bg-opacity-5 text-white-50' : 'bg-light text-muted')}`} style={{ fontSize: '0.6rem' }}>
                                            {mod.status}
                                        </div>
                                        {!isDisabled && (
                                        <div className="ms-auto opacity-0 group-hover-opacity-100 transition-all transform group-hover-translate-x">
                                            <span className="x-small fw-black text-primary me-2">LAUNCH</span>
                                            <FontAwesomeIcon icon={faChevronRight} className="text-primary x-small" />
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!isDisabled && (
                        <div 
                            className="position-absolute bottom-0 start-0 h-100 w-1 transition-all opacity-0 group-hover-opacity-100" 
                            style={{ width: '4px', background: mod.color }}
                        ></div>
                        )}
                    </motion.div>
                </div>
                );
            })}

            {/* Hub Launcher - Wide Version */}
            <div className="col-12">
                <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className={`card border-0 shadow-sm overflow-hidden group cursor-pointer bg-opacity-50 ${isDark ? 'bg-primary bg-opacity-10' : 'bg-primary bg-opacity-50'}`}
                    style={{ 
                        borderRadius: '20px', 
                        border: '1px dashed rgba(79, 70, 229, 0.3)'
                    }}
                >
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-lg" style={{ width: '48px', height: '48px' }}>
                                <FontAwesomeIcon icon={faThLarge} />
                            </div>
                            <div>
                                <h6 className={`fw-black mb-0 bold ${isDark ? 'text-white' : 'text-dark'}`}>Global Module Directory</h6>
                                <p className="x-small text-muted mb-0 fw-bold">Access the full enterprise application landscape</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black shadow-sm d-flex align-items-center gap-2" onClick={() => setActiveTab('systems-hub')}>
                            <span>Explore All Modules</span>
                            <FontAwesomeIcon icon={faChevronRight} className="small" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default WorkspaceLauncher;
