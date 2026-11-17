
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTabData } from '../../../api/fms';
import { 
    faUserTie, faChartPie, faChartLine, faChartBar,
    faBuilding, faUsers, faProjectDiagram, faScaleBalanced,
    faShieldHeart, faGem, faCrown, faFilePdf,
    faFilePowerpoint, faEnvelope, faCalendarCheck, faBolt,
    faChevronRight, faArrowTrendUp, faBullseye, faMicrochip
} from '@fortawesome/free-solid-svg-icons';

const ExecutiveSummaryReports = ({ isDark }) => {
    const [executiveKpis, setExecutiveKpis] = useState([]);
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        getTabData('executive-summary').then(res => {
            const d = res.data?.data || {};
            setExecutiveKpis(d.executiveKpis || []);
            setSummaries(d.summaries || []);
        }).catch(() => {});
    }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            {/* Executive Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark p-3 text-white shadow-lg">
                        <FontAwesomeIcon icon={faUserTie} size="xl" />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1">Executive Summary Reports</h2>
                        <p className="text-muted mb-0">High-level strategic summaries for CEOs, CFOs, and Board Directors.</p>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-dark rounded-pill px-4 shadow-sm fw-bold">
                        <FontAwesomeIcon icon={faFilePdf} className="me-2 text-danger" />
                        Board Report
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm fw-bold">
                        <FontAwesomeIcon icon={faFilePowerpoint} className="me-2 text-warning" />
                        Briefing Deck
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {executiveKpis.map((kpi, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between align-items-center mb-3 text-dark">
                                    <div className="rounded-3 p-3 text-dark" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                                        <FontAwesomeIcon icon={kpi.icon} size="lg" />
                                    </div>
                                    <span className="badge bg-light text-muted border text-dark">Strategic KPI</span>
                                </div>
                                <h2 className="fw-bold mb-1 text-dark">{kpi.value}</h2>
                                <div className="text-muted small fw-bold text-uppercase mb-2 text-dark">{kpi.label}</div>
                                <div className={`small fw-bold ${kpi.trend === 'up' ? 'text-success' : 'text-danger'} text-dark`}>
                                    <FontAwesomeIcon icon={kpi.trend === 'up' ? faArrowTrendUp : faArrowTrendUp} className="me-1" />
                                    {kpi.delta} vs Target
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                {/* Board Briefing Area */}
                <div className="col-xl-8 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Business Health Overview</h5>
                            <span className="text-muted small text-dark">Last updated: 1h ago</span>
                        </div>

                        <div className="row g-4 text-dark">
                            {summaries.map((s, i) => (
                                <div key={i} className="col-md-6 text-dark">
                                    <div className="p-4 rounded-4 border bg-light bg-opacity-50 text-dark">
                                        <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                                            <div className="rounded-circle p-2 bg-white shadow-sm text-dark" style={{ color: s.color }}>
                                                <FontAwesomeIcon icon={s.icon} />
                                            </div>
                                            <h6 className="fw-bold mb-0 text-dark">{s.title}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-end text-dark">
                                            <div>
                                                <div className={`fw-bold h5 mb-0 text-dark ${s.status === 'At Risk' ? 'text-danger' : 'text-success'}`}>{s.status}</div>
                                                <div className="x-small text-muted text-dark">Current Trend: {s.trend}</div>
                                            </div>
                                            <button className="btn btn-sm btn-white rounded-pill px-3 shadow-sm text-dark">Explore</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Strategic Objectives */}
                        <div className="mt-5 text-dark">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                                <FontAwesomeIcon icon={faBullseye} className="text-primary text-dark" />
                                2024 Strategic Objectives
                            </h6>
                            <div className="d-grid gap-3 text-dark">
                                <div className="p-3 rounded-4 bg-light border text-dark">
                                    <div className="d-flex justify-content-between mb-2 text-dark">
                                        <span className="fw-bold small text-dark">Market Expansion (Europe)</span>
                                        <span className="small fw-bold text-dark">85%</span>
                                    </div>
                                    <div className="progress rounded-pill bg-white text-dark" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-4 bg-light border text-dark">
                                    <div className="d-flex justify-content-between mb-2 text-dark">
                                        <span className="fw-bold small text-dark">Operational Automation</span>
                                        <span className="small fw-bold text-dark">62%</span>
                                    </div>
                                    <div className="progress rounded-pill bg-white text-dark" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-info" style={{ width: '62%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Briefing Sidebar */}
                <div className="col-xl-4 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                            <FontAwesomeIcon icon={faGem} className="text-warning text-dark" />
                            Executive Insights
                        </h5>
                        <div className="d-grid gap-3 text-dark">
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="fw-bold small mb-1 text-dark">Growth Analysis</div>
                                <p className="x-small text-muted mb-0 text-dark">YoY Revenue growth outperformed sector averages by 4.2%. Projecting continued expansion in services.</p>
                            </div>
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="fw-bold small mb-1 text-dark">Risk Posture</div>
                                <p className="x-small text-muted mb-0 text-dark">Strategic risk exposure mitigated through diversified investment portfolio and robust compliance.</p>
                            </div>
                        </div>
                        <button className="btn btn-outline-dark w-100 rounded-pill mt-4 fw-bold text-dark">View Executive Briefing</button>
                    </div>

                    {/* Upcoming Board Meetings */}
                    <div className="p-4 rounded-4 border border-dashed text-dark">
                        <h6 className="fw-bold mb-3 text-dark">Upcoming Board Sync</h6>
                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light text-dark">
                            <div className="rounded-circle p-2 bg-white shadow-sm text-dark">
                                <FontAwesomeIcon icon={faCalendarCheck} className="text-primary text-dark" />
                            </div>
                            <div className="text-dark">
                                <div className="fw-bold small text-dark">Q2 Board Review</div>
                                <div className="x-small text-muted text-dark">12 Jun 2024 • 10:00 AM</div>
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="ms-auto text-muted x-small text-dark" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
            `}</style>
        </div>
    );
};

export default ExecutiveSummaryReports;
