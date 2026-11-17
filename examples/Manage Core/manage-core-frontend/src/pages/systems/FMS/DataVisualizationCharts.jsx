
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, faChartLine, faChartBar, faChartArea,
    faTableCellsLarge, faFilter, faFileExport, faSync,
    faRobot, faArrowTrendUp, faLayerGroup, faBolt,
    faEye, faPlus, faCogs, faShieldAlt, faSearch,
    faMaximize, faGrip, faDiagramProject, faTable
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
  ArcElement,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DataVisualizationCharts = ({ isDark }) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const [chartTypes, setChartTypes] = useState([]);
    useEffect(() => { getTabData('data-viz').then(res => setChartTypes(res.data?.data || [])).catch(() => {}); }, []);

    const [barData, setBarData] = useState({});
    useEffect(() => { getTabData('data-viz').then(res => setBarData(res.data?.data || {})).catch(() => {}); }, []);

    const [radarData, setRadarData] = useState({});
    useEffect(() => { getTabData('data-viz').then(res => setRadarData(res.data?.data || {})).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Data Visualization Center</h2>
                    <p className="text-muted mb-0">Transform complex business data into interactive, real-time visual insights.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={handleRefresh}>
                        <FontAwesomeIcon icon={faSync} className={`me-2 ${refreshing ? 'fa-spin' : ''}`} />
                        Refresh Data
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faRobot} className="me-2 text-primary" />
                        AI Insights
                    </button>
                </div>
            </div>

            <div className="row g-4 text-dark">
                {/* Chart Widgets Row */}
                <div className="col-xl-8 text-dark">
                    <div className="row g-4 mb-4 text-dark">
                        <div className="col-md-6 text-dark">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                                    <h6 className="fw-bold mb-0 text-dark">Departmental Performance</h6>
                                    <FontAwesomeIcon icon={faMaximize} className="text-muted cursor-pointer" />
                                </div>
                                <div style={{ height: '240px' }} className="text-dark">
                                    <Bar 
                                        data={barData} 
                                        options={{ 
                                            responsive: true, 
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: { y: { beginAtZero: true, grid: { color: isDark ? '#333' : '#f0f0f0' } } }
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 text-dark">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                                    <h6 className="fw-bold mb-0 text-dark">Efficiency Metrics (Radar)</h6>
                                    <FontAwesomeIcon icon={faGrip} className="text-muted cursor-pointer" />
                                </div>
                                <div style={{ height: '240px' }} className="text-dark">
                                    <Radar 
                                        data={radarData} 
                                        options={{ 
                                            responsive: true, 
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: { r: { grid: { color: isDark ? '#333' : '#f0f0f0' }, pointLabels: { color: isDark ? '#fff' : '#666' } } }
                                        }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Drill-Down Matrix Placeholder */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Cross-Module Analytic Matrix</h5>
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm rounded-pill px-3">Weekly</button>
                                <button className="btn btn-light btn-sm rounded-pill px-3">Monthly</button>
                            </div>
                        </div>
                        <div className="p-5 rounded-4 bg-light border-dashed border-2 text-center text-dark">
                            <FontAwesomeIcon icon={faDiagramProject} size="3xl" className="text-primary opacity-20 mb-3" />
                            <h6 className="fw-bold">Interactive Data Mapping</h6>
                            <p className="small text-muted mb-0">Drag and drop dimensions to create custom cross-module visualizations.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Controls & Analytics */}
                <div className="col-xl-4 text-dark">
                    {/* Visual Controls */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4">Visualization Engine</h5>
                        <div className="row g-2">
                            {chartTypes.map((c, i) => (
                                <div key={i} className="col-6">
                                    <div className="p-3 rounded-4 border text-center h-100 hover-lift transition">
                                        <div className="mb-2" style={{ color: c.color }}>
                                            <FontAwesomeIcon icon={c.icon} size="lg" />
                                        </div>
                                        <div className="x-small fw-bold text-uppercase">{c.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-100 rounded-pill mt-4 fw-bold">Custom Chart Builder</button>
                    </div>

                    {/* Real-time Insights */}
                    <div className="card border-0 rounded-4 shadow-sm p-4 bg-dark text-white mb-4">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="rounded-circle bg-primary p-3">
                                <FontAwesomeIcon icon={faBolt} size="xl" />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0 text-white">Live Data Pulse</h6>
                                <p className="x-small mb-0 opacity-75 text-white">Streaming 1.2k events/sec</p>
                            </div>
                        </div>
                        <div className="d-grid gap-3">
                            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                <div className="d-flex justify-content-between mb-1 text-white">
                                    <span className="small">Data Latency</span>
                                    <span className="fw-bold">14ms</span>
                                </div>
                                <div className="progress rounded-pill bg-white bg-opacity-10" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '98%' }}></div>
                                </div>
                            </div>
                            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                <div className="d-flex justify-content-between mb-1 text-white">
                                    <span className="small">AI Prediction Confidence</span>
                                    <span className="fw-bold">94.2%</span>
                                </div>
                                <div className="progress rounded-pill bg-white bg-opacity-10" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-primary" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="p-4 rounded-4 border border-dashed">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faFileExport} className="text-muted" />
                            Export Visuals
                        </h6>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-light rounded-pill flex-grow-1">PDF Report</button>
                            <button className="btn btn-sm btn-light rounded-pill flex-grow-1">Excel Data</button>
                            <button className="btn btn-sm btn-light rounded-pill flex-grow-1">PNG Image</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default DataVisualizationCharts;
