
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faUsers, faLayerGroup, faClock,
    faFingerprint, faRoute, faBolt, faChartArea,
    faBuilding, faUserSecret, faCogs, faSync,
    faRobot, faArrowTrendUp, faShieldAlt, faEye,
    faMobileAlt, faLaptopCode, faShareNodes, faDatabase
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
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UsageAnalytics = ({ isDark }) => {
    const [usageMetrics, setUsageMetrics] = useState([]);
    useEffect(() => { getTabData('usage-analytics').then(res => setUsageMetrics(res.data?.data || [])).catch(() => {}); }, []);

    const [adoptionData, setAdoptionData] = useState({});
    useEffect(() => { getTabData('usage-analytics').then(res => setAdoptionData(res.data?.data || {})).catch(() => {}); }, []);

    const [userJourney, setUserJourney] = useState([]);
    useEffect(() => { getTabData('usage-analytics').then(res => setUserJourney(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Usage Analytics Center</h2>
                    <p className="text-muted mb-0">Monitor user activity, module adoption, and platform engagement metrics.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faRobot} className="me-2" />
                        Usage Forecast
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faSync} className="me-2" />
                        Live Feed
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {usageMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between align-items-center mb-3 text-dark">
                                    <div className="rounded-3 p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <span className="badge bg-light text-muted border text-dark">Real-time</span>
                                </div>
                                <h3 className="fw-bold mb-1 text-dark">{m.value}</h3>
                                <div className="text-muted small fw-bold text-uppercase mb-2 text-dark">{m.label}</div>
                                <div className={`small fw-bold text-dark ${m.trend === 'up' ? 'text-success' : 'text-primary'}`}>
                                    <FontAwesomeIcon icon={faArrowTrendUp} className="me-1 text-dark" />
                                    {m.delta} Activity
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8 text-dark">
                    {/* Adoption Chart */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Module Adoption Analysis</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3 text-dark">Filter Tenants</button>
                        </div>
                        <div style={{ height: '300px' }} className="text-dark">
                            <Bar 
                                data={adoptionData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, grid: { color: isDark ? '#333' : '#f0f0f0' } } }
                                }} 
                            />
                        </div>
                    </div>

                    {/* User Journey Matrix */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">User Journey Conversion</h5>
                        <div className="d-grid gap-3 text-dark">
                            {userJourney.map((j, i) => (
                                <div key={i} className="p-3 rounded-4 bg-light d-flex align-items-center justify-content-between text-dark">
                                    <div className="d-flex align-items-center gap-3 text-dark">
                                        <div className="rounded-circle bg-white shadow-sm p-2 text-dark" style={{ width: 35, height: 35, textAlign: 'center' }}>
                                            <span className="fw-bold small text-dark">{i + 1}</span>
                                        </div>
                                        <div className="fw-bold text-dark">{j.step}</div>
                                    </div>
                                    <div className="d-flex gap-4 text-end text-dark">
                                        <div className="text-dark">
                                            <div className="fw-bold text-dark">{j.hits}</div>
                                            <div className="x-small text-muted text-dark">Unique Hits</div>
                                        </div>
                                        <div className="text-dark">
                                            <div className={`fw-bold text-dark ${j.drop === '0%' ? 'text-success' : 'text-danger'}`}>{j.drop}</div>
                                            <div className="x-small text-muted text-dark">Drop-off</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* Engagement Insights */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Intelligence Insights</h5>
                        <div className="d-grid gap-3 text-dark">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 text-dark">
                                <div className="fw-bold small mb-1 text-primary text-dark">Top Feature</div>
                                <div className="fw-bold text-dark">Bulk Invoice Processing</div>
                                <div className="x-small text-muted text-dark">84% of power users utilize this daily.</div>
                            </div>
                            <div className="p-3 rounded-4 bg-info bg-opacity-10 border border-info border-opacity-10 text-dark">
                                <div className="fw-bold small mb-1 text-info text-dark">API Usage Spike</div>
                                <div className="fw-bold text-dark">+240% External Syncs</div>
                                <div className="x-small text-muted text-dark">Increased activity from regional ERP nodes.</div>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Status */}
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-dark text-white text-dark">
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark">
                            <div className="rounded-circle bg-success p-3 text-dark">
                                <FontAwesomeIcon icon={faDatabase} size="xl" className="text-white text-dark" />
                            </div>
                            <div className="text-dark">
                                <h6 className="fw-bold mb-0 text-white text-dark">Telemetry Engine</h6>
                                <p className="x-small mb-0 opacity-75 text-white text-dark">Secured Event Pipeline</p>
                            </div>
                        </div>
                        <div className="d-grid gap-2 text-dark">
                            <button className="btn btn-white w-100 rounded-pill fw-bold text-dark">Analytics Dashboard</button>
                            <button className="btn btn-outline-light w-100 rounded-pill mt-1 text-dark text-white">Export Logs</button>
                        </div>
                    </div>

                    {/* Device Distribution Placeholder */}
                    <div className="mt-4 p-4 rounded-4 border border-dashed text-center text-dark">
                        <div className="d-flex justify-content-center gap-4 text-muted mb-2 text-dark">
                            <FontAwesomeIcon icon={faLaptopCode} />
                            <FontAwesomeIcon icon={faMobileAlt} />
                            <FontAwesomeIcon icon={faShareNodes} />
                        </div>
                        <h6 className="fw-bold text-dark">Device Distribution</h6>
                        <p className="x-small text-muted mb-0 text-dark">72% Desktop • 24% Mobile • 4% API</p>
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

export default UsageAnalytics;
