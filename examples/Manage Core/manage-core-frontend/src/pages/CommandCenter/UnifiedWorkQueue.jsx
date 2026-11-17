
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faInbox, faClock, faCheckCircle, faExclamationCircle,
    faFilter, faSortAmountDown, faEllipsisV, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const UnifiedWorkQueue = ({ isDark }) => {
    const queueItems = [
        { id: 1, system: 'HRMS', task: 'Review Leave Application', priority: 'High', due: '2h', color: '#4f46e5', user: 'Sarah Jenkins' },
        { id: 2, system: 'PMS', task: 'Milestone Approval Required', priority: 'Medium', due: '5h', color: '#10b981', user: 'Project Alpha' },
        { id: 3, system: 'FMS', task: 'Audit Report Discrepancy', priority: 'Critical', due: '30m', color: '#ef4444', user: 'Finance Dept' },
        { id: 4, system: 'CRM', task: 'Follow up with Enterprise Lead', priority: 'Low', due: '1d', color: '#f59e0b', user: 'Microsoft Corp' },
        { id: 5, system: 'DMS', task: 'Renew System Certificates', priority: 'Medium', due: '12h', color: '#3b82f6', user: 'IT Infrastructure' },
        { id: 6, system: 'TMS', task: 'Task Dependency Conflict', priority: 'High', due: '1h', color: '#8b5cf6', user: 'Dev Team' },
    ];

    return (
        <div className={`card border-0 shadow-sm h-100 overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ borderRadius: '24px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
            <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-end">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faInbox} className="small" />
                        </div>
                        <span className="x-small fw-black text-primary letter-spacing-wider text-uppercase">Priority Stream</span>
                    </div>
                    <h5 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Unified Work Queue</h5>
                </div>
                <div className="d-flex gap-2 mb-1">
                    <button className={`btn btn-sm rounded-pill px-3 fw-bold border ${isDark ? 'btn-outline-light border-opacity-10' : 'btn-outline-primary border-opacity-20'}`} style={{ fontSize: '0.7rem' }}>
                        <FontAwesomeIcon icon={faFilter} className="me-2" /> Filter
                    </button>
                </div>
            </div>
            
            <div className="card-body p-4 pt-4">
                <div className="custom-work-queue-scroll pe-2" style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {queueItems.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ x: 4 }}
                            className={`p-3 mb-3 rounded-4 border transition-all cursor-pointer group position-relative ${isDark ? 'border-white border-opacity-5 bg-white bg-opacity-5 hover-bg-opacity-10' : 'border-light bg-light bg-opacity-50 hover-bg-white shadow-hover'}`}
                        >
                            <div className="d-flex align-items-start justify-content-between">
                                <div className="d-flex align-items-start gap-3">
                                    <div 
                                        className="rounded-circle mt-1 d-flex align-items-center justify-content-center flex-shrink-0"
                                        style={{ width: '8px', height: '8px', background: item.color, boxShadow: `0 0 10px ${item.color}80` }}
                                    ></div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className={`fw-black x-small text-uppercase opacity-50 ${isDark ? 'text-white' : 'text-dark'}`}>{item.system}</span>
                                            <span className="text-muted x-small opacity-50">&bull;</span>
                                            <span className="text-muted x-small fw-bold">{item.user}</span>
                                        </div>
                                        <div className={`fw-bold mb-2 ${isDark ? 'text-white' : 'text-dark'}`} style={{ fontSize: '0.9rem' }}>{item.task}</div>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center gap-1 x-small text-muted fw-bold">
                                                <FontAwesomeIcon icon={faClock} className="x-small opacity-50" />
                                                <span>{item.due} left</span>
                                            </div>
                                            <div 
                                                className="badge rounded-pill fw-black text-uppercase" 
                                                style={{ 
                                                    fontSize: '0.55rem', 
                                                    background: item.priority === 'Critical' ? '#ef444420' : (item.priority === 'High' ? '#f59e0b20' : '#10b98120'),
                                                    color: item.priority === 'Critical' ? '#ef4444' : (item.priority === 'High' ? '#f59e0b' : '#10b981'),
                                                    border: `1px solid ${item.priority === 'Critical' ? '#ef444430' : (item.priority === 'High' ? '#f59e0b30' : '#10b98130')}`
                                                }}
                                            >
                                                {item.priority}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover-opacity-100 transition-all">
                                    <button className={`btn btn-xs rounded-circle ${isDark ? 'btn-outline-light' : 'btn-outline-primary'}`} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={faChevronRight} className="x-small" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-4 pt-2 border-top border-primary border-opacity-10">
                    <button className="btn btn-primary w-100 rounded-pill fw-black py-2 shadow-sm d-flex align-items-center justify-content-center gap-2">
                        <span>Execute All Tasks</span>
                        <FontAwesomeIcon icon={faSortAmountDown} className="small" />
                    </button>
                </div>
            </div>

            <style>{`
                .custom-work-queue-scroll::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
                    border-radius: 10px;
                    transition: all 0.3s;
                }
                .custom-work-queue-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
                }
                .shadow-hover:hover {
                    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05);
                }
                .letter-spacing-wider {
                    letter-spacing: 0.1em;
                }
            `}</style>
        </div>
    );
};

export default UnifiedWorkQueue;
