
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTabData } from '../../../api/fms';
import { 
    faRobot, faChartPie, faChartLine, faChartBar,
    faLayerGroup, faBolt, faBrain, faGem,
    faLightbulb, faMagnifyingGlassChart, faDatabase,
    faCogs, faUserShield, faScaleBalanced, faShieldHeart,
    faSatellite, faMicrochip, faArrowTrendUp, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BusinessIntelligenceReports = ({ isDark }) => {
    const [biMetrics, setBiMetrics] = useState([]);
    const [forecastData, setForecastData] = useState({ labels: [], datasets: [] });
    const [biModules, setBiModules] = useState([]);

    useEffect(() => {
        getTabData('bi-reports').then(res => {
            const d = res.data?.data || {};
            setBiMetrics(d.biMetrics || []);
            setForecastData(d.forecastData || { labels: [], datasets: [] });
            setBiModules(d.biModules || []);
        }).catch(() => {});
    }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="rounded-5 p-5 mb-4 position-relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                <div className="position-absolute top-0 end-0 p-5 opacity-10" style={{ transform: 'rotate(15deg) translate(20%, -20%)' }}>
                    <FontAwesomeIcon icon={faRobot} style={{ fontSize: '15rem' }} />
                </div>
                <div className="position-relative" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill bg-white bg-opacity-20 text-white fw-bold px-3 py-2 mb-3 text-uppercase">Enterprise Intelligence</span>
                    <h1 className="display-5 fw-bold mb-2">Business Intelligence Center</h1>
                    <p className="fs-5 text-white text-opacity-75 mb-0 max-width-600">Advanced strategic analytics, predictive modeling, and data-driven decision intelligence.</p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {biMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                                    <div className="rounded-circle p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <div className="text-dark">
                                        <h4 className="fw-bold mb-0 text-dark">{m.value}</h4>
                                        <span className="text-muted small fw-bold text-uppercase text-dark">{m.label}</span>
                                    </div>
                                </div>
                                <div className={`small fw-bold text-dark ${m.trend === 'up' ? 'text-success' : 'text-primary'}`}>
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="me-1 text-dark" />
                                    {m.delta}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8 text-dark">
                    {/* Forecast Model */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Strategic Trend Forecasting</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3 text-dark"><FontAwesomeIcon icon={faMicrochip} className="me-2" />Neural Engine Active</button>
                        </div>
                        <div style={{ height: '340px' }} className="text-dark">
                            <Line 
                                data={forecastData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
                                    scales: { y: { grid: { color: isDark ? '#333' : '#f0f0f0' } } }
                                }} 
                            />
                        </div>
                    </div>

                    {/* BI Intelligence Modules */}
                    <div className="row g-4 text-dark">
                        {biModules.map((mod, i) => (
                            <div key={i} className="col-md-6 text-dark">
                                <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 hover-lift transition text-dark ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                                    <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                                        <FontAwesomeIcon icon={mod.icon} className="text-primary fs-4 text-dark" />
                                        <h6 className="fw-bold mb-0 text-dark">{mod.name}</h6>
                                    </div>
                                    <p className="small text-muted mb-4 text-dark">{mod.desc}</p>
                                    <button className="btn btn-outline-primary btn-sm rounded-pill px-4 mt-auto text-dark">Open Insights</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* AI Insights Panel */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                            <FontAwesomeIcon icon={faLightbulb} className="text-warning text-dark" />
                            AI-Powered Observations
                        </h5>
                        <div className="d-grid gap-3 text-dark">
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="fw-bold small mb-1 text-dark text-dark">Revenue Optimization</div>
                                <p className="x-small text-muted mb-0 text-dark">Neural model suggests a 14% potential increase in Q4 by optimizing regional allocation.</p>
                            </div>
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="fw-bold small mb-1 text-dark">Churn Risk Detected</div>
                                <p className="x-small text-muted mb-0 text-dark">Identified 3 high-value accounts with decreasing engagement patterns.</p>
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 rounded-pill mt-4 fw-bold text-dark">Full Intelligence Brief</button>
                    </div>

                    {/* Data Warehouse Sync */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 bg-dark text-white text-dark`}>
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark">
                            <FontAwesomeIcon icon={faSatellite} size="xl" className="text-primary text-dark" />
                            <div className="text-dark text-white">
                                <h6 className="fw-bold mb-0">Warehouse Integration</h6>
                                <p className="x-small mb-0 opacity-75">Snowflake / BigQuery Sync</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 mb-3 text-dark">
                            <div className="d-flex justify-content-between mb-1 text-white">
                                <span className="small">Last Sync Status</span>
                                <span className="badge bg-success">Success</span>
                            </div>
                            <div className="x-small opacity-75 text-white">14.2M records ingested today</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .max-width-600 { max-width: 600px; }
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
            `}</style>
        </div>
    );
};

export default BusinessIntelligenceReports;
