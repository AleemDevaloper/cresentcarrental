
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTabData } from '../../../api/fms';
import { 
    faSackDollar, faPiggyBank, faVault, faShieldHalved,
    faChartLine, faSync, faArrowRightArrowLeft, faTriangleExclamation,
    faBuildingColumns, faWallet, faChartArea, faCircleCheck,
    faFilter, faFileExport, faLock, faScaleBalanced,
    faClock, faUsers, faBriefcase, faHandHoldingUsd
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
import { Line, Doughnut } from 'react-chartjs-2';

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

const CashReserveTracking = ({ isDark }) => {
    const [reserveMetrics, setReserveMetrics] = useState([]);
    const [fundAllocation, setFundAllocation] = useState({ labels: [], datasets: [] });
    const [reserveFunds, setReserveFunds] = useState([]);

    useEffect(() => {
        getTabData('cash-reserve').then(res => {
            const d = res.data?.data || {};
            setReserveMetrics(d.reserveMetrics || []);
            setFundAllocation(d.fundAllocation || { labels: [], datasets: [] });
            setReserveFunds(d.reserveFunds || []);
        }).catch(() => {});
    }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Cash Reserve Tracking</h2>
                    <p className="text-muted mb-0">Monitor liquidity, available cash, and strategic financial reserves.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faHandHoldingUsd} className="me-2" />
                        Allocate Funds
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faSync} className="me-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4 text-dark">
                {reserveMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between align-items-center mb-3 text-dark">
                                    <div className="rounded-circle p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <span className="badge bg-light text-muted border text-dark">Reserve Metric</span>
                                </div>
                                <h3 className="fw-bold mb-1 text-dark">{m.value}</h3>
                                <div className="text-muted small fw-bold text-uppercase mb-2 text-dark">{m.label}</div>
                                <div className={`small fw-bold text-dark ${m.trend === 'success' || m.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                                    {m.delta}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8 text-dark">
                    {/* Allocation Analysis */}
                    <div className="row g-4 mb-4 text-dark">
                        <div className="col-lg-6 text-dark">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <h5 className="fw-bold mb-4 text-dark">Reserve Allocation (%)</h5>
                                <div style={{ height: '240px' }} className="text-dark">
                                    <Doughnut 
                                        data={fundAllocation} 
                                        options={{ 
                                            responsive: true, 
                                            maintainAspectRatio: false,
                                            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } } },
                                            cutout: '70%'
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-dark">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <h5 className="fw-bold mb-4 text-dark">Liquidity Runway</h5>
                                <div className="text-center py-4 text-dark">
                                    <div className="display-4 fw-bold text-primary text-dark">18.4</div>
                                    <div className="text-muted text-dark text-uppercase small fw-bold mt-1">Months of Runway</div>
                                    <p className="small text-muted mt-3 px-4 text-dark">Based on current average burn rate and liquid reserve holdings.</p>
                                </div>
                                <div className="mt-auto p-3 rounded-4 bg-light text-dark">
                                    <div className="d-flex justify-content-between x-small fw-bold text-dark">
                                        <span>Target Runway</span>
                                        <span>12 Months</span>
                                    </div>
                                    <div className="progress rounded-pill bg-white mt-2 text-dark" style={{ height: '6px' }}>
                                        <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reserve Fund Details */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Strategic Fund Details</h5>
                        <div className="row g-3 text-dark">
                            {reserveFunds.map((fund, i) => (
                                <div key={i} className="col-md-6 text-dark">
                                    <div className="p-3 rounded-4 border d-flex align-items-center gap-3 hover-lift transition text-dark">
                                        <div className="rounded-circle p-3 bg-light text-dark" style={{ color: fund.color }}>
                                            <FontAwesomeIcon icon={fund.icon} size="lg" />
                                        </div>
                                        <div className="flex-grow-1 text-dark">
                                            <div className="fw-bold text-dark">{fund.name}</div>
                                            <div className="h5 fw-bold mb-0 text-dark">{fund.amount}</div>
                                        </div>
                                        <span className={`badge rounded-pill ${fund.status === 'Optimal' ? 'bg-success' : 'bg-warning'} text-dark`}>{fund.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* Banking Integrations */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 text-dark">Multi-Bank Connectivity</h5>
                        <div className="d-grid gap-2 text-dark">
                            <div className="p-3 rounded-4 bg-light d-flex align-items-center gap-3 text-dark">
                                <FontAwesomeIcon icon={faBuildingColumns} className="text-primary text-dark" />
                                <div className="text-dark">
                                    <div className="fw-bold small text-dark">Global Custody</div>
                                    <div className="x-small text-muted text-dark">Secured Portfolio Sync</div>
                                </div>
                                <FontAwesomeIcon icon={faCircleCheck} className="ms-auto text-success text-dark" />
                            </div>
                            <div className="p-3 rounded-4 bg-light d-flex align-items-center gap-3 text-dark">
                                <FontAwesomeIcon icon={faShieldHalved} className="text-success text-dark" />
                                <div className="text-dark">
                                    <div className="fw-bold small text-dark">Risk Monitoring</div>
                                    <div className="x-small text-muted text-dark">Liquidity stress active</div>
                                </div>
                                <FontAwesomeIcon icon={faCircleCheck} className="ms-auto text-success text-dark" />
                            </div>
                        </div>
                    </div>

                    {/* Alerts & Planning */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 bg-dark text-white text-dark`}>
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark">
                            <FontAwesomeIcon icon={faTriangleExclamation} size="xl" className="text-warning text-dark" />
                            <div className="text-dark text-white">
                                <h6 className="fw-bold mb-0 text-white">Reserve Alerts</h6>
                                <p className="x-small mb-0 opacity-75">Liquidity Thresholds</p>
                            </div>
                        </div>
                        <p className="small mb-4 text-white">Tax reserve threshold reached. Automatic allocation from Operating Cash scheduled for 15th.</p>
                        <button className="btn btn-primary w-100 rounded-pill fw-bold text-dark">Adjust Reserve Plan</button>
                    </div>

                    {/* Quick Link */}
                    <div className="p-4 rounded-4 border border-dashed text-center text-dark">
                        <FontAwesomeIcon icon={faChartArea} size="2xl" className="text-muted mb-3 text-dark" />
                        <h6 className="fw-bold text-dark">Historical Trends</h6>
                        <p className="small text-muted mb-0 text-dark">View 5-year reserve accumulation data.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
            `}</style>
        </div>
    );
};

export default CashReserveTracking;
