
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuildingColumns, faScaleBalanced, faWallet, faChartLine,
    faArrowRightArrowLeft, faPiggyBank, faSackDollar, faShieldHalved,
    faGlobe, faSync, faChartPie, faArrowTrendUp, faLandmark,
    faFileInvoiceDollar, faCogs, faHistory, faCheckCircle,
    faCircleNodes, faMicrochip, faMagnifyingGlassDollar
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
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

const TreasuryManagement = ({ isDark }) => {
    const [treasuryMetrics, setTreasuryMetrics] = useState([]);
    useEffect(() => { getTabData('treasury').then(res => setTreasuryMetrics(res.data?.data || [])).catch(() => {}); }, []);

    const [bankAccounts, setBankAccounts] = useState([]);
    useEffect(() => { getTabData('treasury').then(res => setBankAccounts(res.data?.data || [])).catch(() => {}); }, []);

    const [forecastData, setForecastData] = useState(null);
    useEffect(() => { getTabData('treasury').then(res => setForecastData(res.data?.data || null)).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Treasury Management Center</h2>
                    <p className="text-muted mb-0">Manage cash flow, liquidity, banking operations, and financial risk.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faArrowRightArrowLeft} className="me-2" />
                        New Transfer
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faSync} className="me-2" />
                        Bank Sync
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4">
                {treasuryMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between mb-3 text-dark">
                                    <div className="rounded-3 p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <div className={`text-end ${m.trend === 'up' ? 'text-success' : 'text-danger'} text-dark`}>
                                        <div className="fw-bold text-dark">{m.delta}</div>
                                        <div className="x-small opacity-75 text-dark">Forecast</div>
                                    </div>
                                </div>
                                <h3 className="fw-bold mb-1 text-dark">{m.value}</h3>
                                <span className="text-muted small fw-bold text-uppercase text-dark">{m.label}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8">
                    {/* Forecast Chart */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Liquidity Forecasting</h5>
                            <button className="btn btn-light btn-sm rounded-pill px-3 text-dark"><FontAwesomeIcon icon={faMicrochip} className="me-2" />AI Model V4</button>
                        </div>
                        <div style={{ height: '320px' }} className="text-dark">
                            <Line 
                                data={forecastData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, grid: { color: isDark ? '#333' : '#f0f0f0' } }, x: { grid: { display: false } } }
                                }} 
                            />
                        </div>
                    </div>

                    {/* Bank Accounts */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Connected Banking Infrastructure</h5>
                        <div className="d-grid gap-3 text-dark">
                            {bankAccounts.map((acc, i) => (
                                <div key={i} className="p-3 rounded-4 border d-flex align-items-center justify-content-between hover-lift transition text-dark">
                                    <div className="d-flex align-items-center gap-3 text-dark">
                                        <div className="rounded-circle p-3 bg-light text-dark">
                                            <FontAwesomeIcon icon={faLandmark} className="text-primary" />
                                        </div>
                                        <div className="text-dark">
                                            <div className="fw-bold text-dark">{acc.name}</div>
                                            <div className="small text-muted text-dark">{acc.type} • Secured</div>
                                        </div>
                                    </div>
                                    <div className="text-end text-dark">
                                        <div className="fw-bold text-dark">{acc.balance}</div>
                                        <span className="badge bg-success rounded-pill px-2 py-1 text-dark">Live</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* Treasury Actions */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Treasury Operations</h5>
                        <div className="d-grid gap-2 text-dark">
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faArrowRightArrowLeft} className="text-primary text-dark" />
                                <div>
                                    <div className="fw-bold small text-dark">Cash Sweeps</div>
                                    <div className="x-small text-muted text-dark">Automated fund optimization</div>
                                </div>
                            </button>
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faPiggyBank} className="text-success text-dark" />
                                <div>
                                    <div className="fw-bold small text-dark">Investment Portfolio</div>
                                    <div className="x-small text-muted text-dark">Yield management active</div>
                                </div>
                            </button>
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faScaleBalanced} className="text-info text-dark" />
                                <div>
                                    <div className="fw-bold small text-dark">Debt Management</div>
                                    <div className="x-small text-muted text-dark">Loans & credit facilities</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Risk Advisory */}
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-dark text-white text-dark">
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark">
                            <div className="rounded-circle bg-primary p-3 text-dark">
                                <FontAwesomeIcon icon={faShieldHalved} size="xl" className="text-white text-dark" />
                            </div>
                            <div className="text-dark">
                                <h6 className="fw-bold mb-0 text-white text-dark">Risk Intelligence</h6>
                                <p className="x-small mb-0 opacity-75 text-white text-dark">Real-time market exposure</p>
                            </div>
                        </div>
                        <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 mb-3 text-dark">
                            <div className="d-flex justify-content-between mb-2 text-dark text-white">
                                <span className="small">Currency Risk (FX)</span>
                                <span className="badge bg-success">Hedged</span>
                            </div>
                            <div className="progress rounded-pill bg-white bg-opacity-10 text-dark" style={{ height: '4px' }}>
                                <div className="progress-bar bg-success" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 rounded-pill fw-bold text-dark">Analyze Market Risk</button>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .hover-bg-primary:hover { background-color: rgba(79, 70, 229, 0.05) !important; color: #4f46e5 !important; }
            `}</style>
        </div>
    );
};

export default TreasuryManagement;
