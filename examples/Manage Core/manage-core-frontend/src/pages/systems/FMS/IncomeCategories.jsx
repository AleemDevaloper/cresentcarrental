
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHandHoldingUsd, faPlus, faChartLine, faGlobe, faStore,
   faArrowUp, faArrowDown,
   faSync
} from '@fortawesome/free-solid-svg-icons';

const IncomeCategories = ({ isDark }) => {
    const [streams, setStreams] = useState([]);
    useEffect(() => { getTabData('income-categories').then(res => setStreams(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h4 className="fw-black mb-1">Revenue Stream Segmentation</h4>
                            <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Income Categories & Portfolio Allocation</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-xs rounded-pill px-3 bg-light border-0 fw-black x-small">EXPORT REPORT</button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW STREAM
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {streams.map((s, i) => (
                            <div key={i} className="col-xl-3 col-md-6">
                                <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-light border-light'}`}>
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="rounded-4 p-3 shadow-sm" style={{ background: `${s.color}15`, color: s.color }}>
                                            <FontAwesomeIcon icon={s.icon || faChartLine} />
                                        </div>
                                        <div className={`x-small fw-black ${s.delta.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                            <FontAwesomeIcon icon={s.delta.startsWith('+') ? faArrowUp : faArrowDown} className="me-1" />
                                            {s.delta}
                                        </div>
                                    </div>
                                    <h6 className="fw-black mb-1">{s.name}</h6>
                                    <div className="text-muted x-small fw-bold uppercase mb-3">{s.cat}</div>
                                    <h4 className="fw-black text-primary mb-0">{s.rev}</h4>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4 mt-4">
                    <div className="col-xl-7">
                        <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3">
                                <h5 className="fw-black mb-0">Monthly Revenue Distribution</h5>
                            </div>
                            <div className="card-body p-5 pt-0">
                                <div className="space-y-4">
                                    {[
                                        { label: 'Direct Sales', value: 75, color: '#4f46e5' },
                                        { label: 'Partner Channel', value: 15, color: '#10b981' },
                                        { label: 'Referrals', value: 10, color: '#f59e0b' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="mb-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="x-small fw-black text-muted uppercase">{item.label}</span>
                                                <span className="x-small fw-black">{item.value}%</span>
                                            </div>
                                            <div className="progress rounded-pill" style={{ height: '8px' }}>
                                                <div className="progress-bar rounded-pill" style={{ width: `${item.value}%`, background: item.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-5">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3">
                                <h5 className="fw-black mb-0">Revenue Analytics Insights</h5>
                            </div>
                            <div className="card-body p-5 pt-0">
                                <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10 mb-4">
                                    <div className="fw-black x-small text-primary uppercase mb-2">Portfolio Mix</div>
                                    <p className="text-muted small fw-bold mb-0">Recurring revenue now accounts for 68% of total income, up from 54% last year.</p>
                                </div>
                                <div className="p-4 rounded-4 bg-info bg-opacity-5 border border-info border-opacity-10">
                                    <div className="fw-black x-small text-info uppercase mb-2">Trend Alert</div>
                                    <p className="text-muted small fw-bold mb-0">Consulting services showing a high burn rate relative to revenue generation.</p>
                                </div>
                            </div>
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

export default IncomeCategories;
