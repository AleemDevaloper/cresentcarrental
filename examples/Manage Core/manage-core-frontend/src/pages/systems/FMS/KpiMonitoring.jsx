
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faBullseye, faTrophy, faBrain,
    faArrowUp, faArrowDown, faEllipsisV, faCircleCheck,
    faClock, faLightbulb, faDownload, faFilter
} from '@fortawesome/free-solid-svg-icons';

const KpiMonitoring = ({ isDark }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');

    const [kpis, setKpis] = useState([]);
    useEffect(() => { getTabData('kpi-monitoring').then(res => setKpis(res.data?.data || [])).catch(() => {}); }, []);

    const [scorecards, setScorecards] = useState([]);
    useEffect(() => { getTabData('kpi-monitoring').then(res => setScorecards(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faBrain} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">KPI Monitoring Center</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Performance Scorecards & AI-Powered Insights</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <select 
                                className={`form-select form-select-sm rounded-pill px-4 fw-black x-small border shadow-sm ${isDark ? 'bg-dark-alt text-white border-opacity-10' : 'bg-white'}`}
                                value={selectedTimeframe}
                                onChange={(e) => setSelectedTimeframe(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                <option>This Month</option>
                                <option>Last Quarter</option>
                                <option>Fiscal Year</option>
                            </select>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faDownload} className="me-2" /> EXPORT REPORT
                            </button>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="row g-4">
                        {kpis.map((kpi, i) => (
                            <div key={i} className="col-md-3">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border position-relative h-100`}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="rounded-circle p-2 bg-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                                            <FontAwesomeIcon icon={kpi.icon} style={{ color: kpi.color }} />
                                        </div>
                                        <span className={`badge rounded-pill x-small fw-black ${
                                            kpi.status === 'exceeded' ? 'bg-success-subtle text-success' : 
                                            kpi.status === 'healthy' ? 'bg-info-subtle text-info' : 'bg-danger-subtle text-danger'
                                        }`}>
                                            {kpi.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="fw-black mb-1">{kpi.actual}</h3>
                                    <div className="text-muted x-small fw-bold uppercase ls-wide mb-2">{kpi.title}</div>
                                    <div className="d-flex align-items-center gap-2 pt-2 border-top border-opacity-10">
                                        <span className="x-small text-muted fw-bold">Target: {kpi.target}</span>
                                        <FontAwesomeIcon icon={kpi.actual.includes('+') ? faArrowUp : faArrowDown} className={`x-small ${kpi.status === 'critical' ? 'text-danger' : 'text-success'}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {/* Performance Scorecards */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Departmental Scorecards</h5>
                                    <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">Q3 UPDATED</span>
                                </div>
                                <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Department</th>
                                                <th className="py-3 border-0">Efficiency Score</th>
                                                <th className="py-3 border-0">Trend</th>
                                                <th className="px-5 py-3 border-0 text-end">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {scorecards.map((item, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="fw-black small">{item.department}</div>
                                                    </td>
                                                    <td className="border-0">
                                                        <div className="d-flex align-items-center gap-3" style={{ width: '150px' }}>
                                                            <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                                                <div className="progress-bar bg-primary" style={{ width: `${item.score}%` }}></div>
                                                            </div>
                                                            <span className="fw-black small">{item.score}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="border-0">
                                                        <FontAwesomeIcon 
                                                            icon={item.trend === 'up' ? faArrowUp : item.trend === 'down' ? faArrowDown : faClock} 
                                                            className={item.trend === 'up' ? 'text-success' : item.trend === 'down' ? 'text-danger' : 'text-muted'}
                                                        />
                                                    </td>
                                                    <td className="px-5 border-0 text-end">
                                                        <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                            item.status === 'Outstanding' ? 'bg-success' : 'bg-primary'
                                                        }`}>
                                                            {item.status.toUpperCase()}
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

                    {/* AI Insights Sidebar */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faLightbulb} />
                                </div>
                                <h6 className="fw-black mb-0 uppercase ls-wide">AI Performance Insights</h6>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { text: "Operational costs have increased by 8% due to rising energy prices in European hubs.", icon: faCircleCheck },
                                    { text: "Sales efficiency is at an all-time high; consider reallocating budget to expansion.", icon: faLightbulb },
                                    { text: "A 5% variance detected in Marketing spend vs ROI in the APAC region.", icon: faFilter }
                                ].map((insight, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white shadow-sm border'} mb-3`}>
                                        <div className="d-flex gap-3">
                                            <FontAwesomeIcon icon={insight.icon} className="text-primary mt-1" />
                                            <p className="small mb-0 fw-bold opacity-75">{insight.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary w-100 rounded-pill mt-4 fw-black x-small py-3 shadow-primary">
                                GENERATE FULL AI AUDIT
                            </button>
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
            `}</style>
        </div>
    );
};

export default KpiMonitoring;
