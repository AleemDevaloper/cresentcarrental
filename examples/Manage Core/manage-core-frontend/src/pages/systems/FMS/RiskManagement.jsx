
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTabData } from '../../../api/fms';
import { 
    faShieldHalved, faTriangleExclamation, faListCheck, faEye,
    faChartPie, faBolt, faFileShield, faUserShield,
    faScaleBalanced, faClockRotateLeft, faCircleExclamation,
    faChartLine, faTemperatureHigh, faLayerGroup, faSitemap,
    faLock, faCircleCheck, faPlus, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';

const RiskManagement = ({ isDark }) => {
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [riskMetrics, setRiskMetrics] = useState([]);
    const [riskRegister, setRiskRegister] = useState([]);
    const [riskCategories, setRiskCategories] = useState([]);

    useEffect(() => {
        getTabData('risk').then(res => {
            const d = res.data?.data || {};
            setRiskMetrics(d.riskMetrics || []);
            setRiskRegister(d.riskRegister || []);
            setRiskCategories(d.riskCategories || []);
        }).catch(() => {});
    }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Risk Management Center</h2>
                    <p className="text-muted mb-0">Identify, assess, and mitigate organizational risks across business operations.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-danger rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Report Risk
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faClockRotateLeft} className="me-2" />
                        Audit Trail
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {riskMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between align-items-center mb-3 text-dark">
                                    <div className="rounded-circle p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <span className="badge bg-light text-muted border text-dark">Real-time</span>
                                </div>
                                <h3 className="fw-bold mb-1 text-dark">{m.value}</h3>
                                <div className="text-muted small fw-bold text-uppercase mb-2 text-dark">{m.label}</div>
                                <div className={`small fw-bold ${m.trend === 'up' ? 'text-danger' : 'text-success'} text-dark`}>
                                    <FontAwesomeIcon icon={m.trend === 'up' ? faBolt : faCircleCheck} className="me-1" />
                                    {m.delta} Activity
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8 text-dark">
                    {/* Risk Heat Map Placeholder */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Risk Heat Map</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3 text-dark">Exposure View</button>
                        </div>
                        <div className="p-5 rounded-4 bg-light bg-opacity-50 text-center border-dashed border-2 text-dark">
                            <FontAwesomeIcon icon={faTemperatureHigh} size="3xl" className="text-danger opacity-20 mb-3" />
                            <h6 className="fw-bold">Visual Risk Distribution</h6>
                            <p className="small text-muted mb-0">Interactive heat map plotting Likelihood vs. Impact.</p>
                        </div>
                    </div>

                    {/* Risk Register Table */}
                    <div className={`card border-0 rounded-4 shadow-sm overflow-hidden ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="card-header bg-transparent border-0 p-4 pb-0 text-dark">
                            <div className="d-flex justify-content-between align-items-center mb-3 text-dark">
                                <h5 className="fw-bold mb-0 text-dark">Corporate Risk Register</h5>
                                <div className="input-group input-group-sm w-auto text-dark">
                                    <span className="input-group-text bg-light border-0"><FontAwesomeIcon icon={faSearch} /></span>
                                    <input type="text" className="form-control bg-light border-0" placeholder="Search risks..." />
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0 mt-3 text-dark">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 text-dark">
                                    <thead className="bg-light text-muted small text-uppercase text-dark">
                                        <tr className="text-dark">
                                            <th className="px-4 text-dark">Risk Title</th>
                                            <th className="text-dark">Category</th>
                                            <th className="text-dark text-center">Severity</th>
                                            <th className="text-dark text-center">Score</th>
                                            <th className="text-dark">Status</th>
                                            <th className="text-end px-4 text-dark">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskRegister.map((r, i) => (
                                            <tr key={i}>
                                                <td className="px-4">
                                                    <div className="fw-bold text-dark">{r.title}</div>
                                                    <div className="x-small text-muted text-dark">{r.id} • {r.owner}</div>
                                                </td>
                                                <td>{r.cat}</td>
                                                <td className="text-center">
                                                    <span className={`badge rounded-pill ${r.severity === 'Critical' ? 'bg-danger' : r.severity === 'High' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                        {r.severity}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="fw-bold text-dark">{r.score}</div>
                                                    <div className="progress rounded-pill bg-light" style={{ height: '4px' }}>
                                                        <div className={`progress-bar bg-${r.score > 70 ? 'danger' : r.score > 40 ? 'warning' : 'success'}`} style={{ width: `${r.score}%` }}></div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className={`rounded-circle ${r.status === 'Mitigated' ? 'bg-success' : 'bg-primary'}`} style={{ width: 8, height: 8 }}></div>
                                                        <span className="small fw-bold text-dark">{r.status}</span>
                                                    </div>
                                                </td>
                                                <td className="text-end px-4 text-dark">
                                                    <button className="btn btn-sm btn-light rounded-pill px-3 text-dark">Assess</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* Risk Categories */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Risk Classifications</h5>
                        <div className="row g-2">
                            {riskCategories.map((c, i) => (
                                <div key={i} className="col-6">
                                    <div className="p-3 rounded-4 border text-center h-100 transition hover-bg-primary text-dark">
                                        <div className="mb-2" style={{ color: c.color }}>
                                            <FontAwesomeIcon icon={c.icon} size="lg" />
                                        </div>
                                        <div className="x-small fw-bold text-uppercase text-dark">{c.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mitigation Engine */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 bg-primary text-white text-dark`}>
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark">
                            <div className="rounded-circle bg-white bg-opacity-20 p-3">
                                <FontAwesomeIcon icon={faShieldHalved} size="xl" />
                            </div>
                            <div className="text-dark text-white">
                                <h6 className="fw-bold mb-0">Mitigation Engine</h6>
                                <p className="x-small mb-0 opacity-75">Automated control validation</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 mb-4 text-dark">
                            <div className="d-flex justify-content-between mb-2 text-white">
                                <span className="small">Control Effectiveness</span>
                                <span className="fw-bold text-white">84%</span>
                            </div>
                            <div className="progress rounded-pill bg-white bg-opacity-10" style={{ height: '6px' }}>
                                <div className="progress-bar bg-white" style={{ width: '84%' }}></div>
                            </div>
                        </div>
                        <button className="btn btn-white w-100 rounded-pill fw-bold text-dark">Corrective Actions</button>
                    </div>

                    {/* Alerts & Notifications */}
                    <div className="p-4 rounded-4 border border-dashed text-dark">
                        <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                            <FontAwesomeIcon icon={faBolt} className="text-warning" />
                            <h6 className="fw-bold mb-0 text-dark">Risk Alerts</h6>
                        </div>
                        <div className="x-small text-muted mb-0 text-dark">3 high-severity risks require immediate executive review.</div>
                    </div>
                </div>
            </div>

            <style>{`
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
                .x-small { font-size: 11px; }
                .transition { transition: all 0.3s ease; }
                .hover-bg-primary:hover { background-color: rgba(79, 70, 229, 0.05) !important; }
            `}</style>
        </div>
    );
};

export default RiskManagement;
