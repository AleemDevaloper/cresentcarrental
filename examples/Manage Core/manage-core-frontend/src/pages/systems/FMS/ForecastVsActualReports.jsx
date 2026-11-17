
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getTabData } from '../../../api/fms';
import { 
    faChartLine, faScaleBalanced, faBullseye, faChartBar,
    faClock, faSync, faArrowTrendUp, faTriangleExclamation,
    faCheckCircle, faFilter, faFileExport, faMicrochip,
    faRobot, faLayerGroup, faCogs, faBuilding,
    faUsers, faWallet, faChartArea, faArrowRight
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

const ForecastVsActualReports = ({ isDark }) => {
    const [selectedView, setSelectedView] = useState('revenue');
    const [forecastMetrics, setForecastMetrics] = useState([]);
    const [comparisonData, setComparisonData] = useState({ labels: [], datasets: [] });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getTabData('forecast-actual').then(res => {
            const d = res.data?.data || {};
            setForecastMetrics(d.forecastMetrics || []);
            setComparisonData(d.comparisonData || { labels: [], datasets: [] });
            setCategories(d.categories || []);
        }).catch(() => {});
    }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Forecast vs Actual Analysis</h2>
                    <p className="text-muted mb-0">Compare projected business outcomes against actual performance.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faRobot} className="me-2" />
                        AI Re-forecast
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faFileExport} className="me-2" />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="row g-3 mb-4 text-dark">
                {forecastMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6 text-dark">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                            <div className="card-body p-4 text-dark">
                                <div className="d-flex justify-content-between mb-3 text-dark">
                                    <div className="rounded-3 p-3 text-dark" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <span className="x-small fw-bold text-muted text-uppercase text-dark">Verified Data</span>
                                </div>
                                <h3 className="fw-bold mb-1 text-dark">{m.value}</h3>
                                <div className="small fw-bold text-dark">{m.label}</div>
                                <div className={`x-small mt-2 fw-bold ${m.trend === 'up' ? 'text-success' : 'text-primary'} text-dark`}>
                                    {m.delta} Activity
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 text-dark">
                <div className="col-xl-8 text-dark">
                    {/* Main Comparison Chart */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Performance Comparison Matrix</h5>
                            <div className="btn-group btn-group-sm rounded-pill p-1 bg-light text-dark">
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => setSelectedView(cat.id)}
                                        className={`btn rounded-pill px-3 border-0 text-dark ${selectedView === cat.id ? 'btn-white shadow-sm fw-bold' : ''}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ height: '340px' }} className="text-dark">
                            <Line 
                                data={comparisonData} 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true } } },
                                    scales: { y: { grid: { color: isDark ? '#333' : '#f0f0f0' } } }
                                }} 
                            />
                        </div>
                    </div>

                    {/* Variance Breakdown Table */}
                    <div className={`card border-0 rounded-4 shadow-sm overflow-hidden ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="card-header bg-transparent border-0 p-4 pb-0 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Variance Detail Analysis</h5>
                        </div>
                        <div className="card-body p-0 mt-3 text-dark">
                            <div className="table-responsive text-dark">
                                <table className="table table-hover align-middle mb-0 text-dark">
                                    <thead className="bg-light text-muted small text-uppercase text-dark">
                                        <tr className="text-dark">
                                            <th className="px-4 text-dark">Category</th>
                                            <th className="text-dark">Projected</th>
                                            <th className="text-dark">Actual</th>
                                            <th className="text-dark">Variance</th>
                                            <th className="text-dark">Accuracy</th>
                                            <th className="text-end px-4 text-dark">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-dark">
                                        {[
                                            { name: 'Direct Revenue', proj: '$420k', act: '$428k', var: '+$8k', acc: '98.1%' },
                                            { name: 'Operational Exp', proj: '$120k', act: '$114k', var: '-$6k', acc: '95.0%' },
                                            { name: 'Sales Pipeline', proj: '$850k', act: '$810k', var: '-$40k', acc: '95.3%' },
                                            { name: 'Resource Cost', proj: '$64k', act: '$66k', var: '+$2k', acc: '96.8%' },
                                        ].map((row, i) => (
                                            <tr key={i} className="text-dark">
                                                <td className="px-4 fw-bold text-dark">{row.name}</td>
                                                <td className="text-dark">{row.proj}</td>
                                                <td className="text-dark">{row.act}</td>
                                                <td className={`fw-bold text-dark ${row.var.startsWith('+') ? 'text-success' : 'text-danger'}`}>{row.var}</td>
                                                <td className="text-dark">{row.acc}</td>
                                                <td className="text-end px-4 text-dark">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
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
                    {/* Scenario Planning */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-primary text-dark" />
                            Scenario Simulations
                        </h5>
                        <div className="d-grid gap-3 text-dark">
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="d-flex justify-content-between mb-2 text-dark">
                                    <span className="fw-bold small text-dark">Best Case (+10%)</span>
                                    <span className="badge bg-success bg-opacity-10 text-success text-dark">Active</span>
                                </div>
                                <div className="x-small text-muted text-dark">Revenue target: $673k • Confidence: High</div>
                            </div>
                            <div className="p-3 rounded-4 bg-light text-dark">
                                <div className="d-flex justify-content-between mb-2 text-dark">
                                    <span className="fw-bold small text-dark">Conservative (-5%)</span>
                                    <span className="badge bg-light text-muted border text-dark">Secondary</span>
                                </div>
                                <div className="x-small text-muted text-dark">Revenue target: $581k • Confidence: Medium</div>
                            </div>
                        </div>
                        <button className="btn btn-outline-primary w-100 rounded-pill mt-4 fw-bold text-dark">Run New Simulation</button>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="p-4 rounded-4 bg-primary text-white text-dark">
                        <div className="d-flex align-items-center gap-3 mb-4 text-dark text-white">
                            <div className="rounded-circle bg-white bg-opacity-20 p-3 text-dark text-white">
                                <FontAwesomeIcon icon={faMicrochip} size="xl" />
                            </div>
                            <div className="text-dark text-white">
                                <h6 className="fw-bold mb-0">Predictive Gap Analysis</h6>
                                <p className="x-small mb-0 opacity-75">Neural Logic V4.8</p>
                            </div>
                        </div>
                        <p className="small mb-4 text-white text-dark">Identified a potential $24k budget surplus in regional ops for Q3. Recommend reallocation to R&D.</p>
                        <button className="btn btn-white w-100 rounded-pill fw-bold text-dark">View Recommendations</button>
                    </div>
                </div>
            </div>

            <style>{`
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
            `}</style>
        </div>
    );
};

export default ForecastVsActualReports;
