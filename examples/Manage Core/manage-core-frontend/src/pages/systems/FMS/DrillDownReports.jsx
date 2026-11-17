
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMagnifyingGlassChart, faTableList, faSitemap, faFilter,
    faFileExport, faSync, faChartLine, faFolderTree,
    faBuilding, faUsers, faProjectDiagram, faTasks,
    faBoxOpen, faShoppingCart, faChartBar, faCogs,
    faSearch, faChevronRight, faFileLines, faCalendarAlt,
    faArrowDownWideShort, faDatabase
} from '@fortawesome/free-solid-svg-icons';

const DrillDownReports = ({ isDark }) => {
    const [drillPath, setDrillPath] = useState(['Global Overview']);

    const [reportAreas, setReportAreas] = useState([]);
    useEffect(() => { getTabData('drill-down').then(res => setReportAreas(res.data?.data || [])).catch(() => {}); }, []);

    const [currentData, setCurrentData] = useState([]);
    useEffect(() => { getTabData('drill-down').then(res => setCurrentData(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Drill-Down Reports Center</h2>
                    <p className="text-muted mb-0">Explore business data from high-level summaries down to detailed transactional records.</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm w-auto">
                        <span className="input-group-text bg-white border-end-0 rounded-start-pill"><FontAwesomeIcon icon={faSearch} /></span>
                        <input type="text" className="form-control border-start-0 rounded-end-pill" placeholder="Search report metrics..." />
                    </div>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                        Date Range
                    </button>
                </div>
            </div>

            {/* Breadcrumb / Drill Path */}
            <div className={`card border-0 rounded-4 shadow-sm p-3 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                <div className="d-flex align-items-center gap-2 overflow-auto">
                    {drillPath.map((path, i) => (
                        <React.Fragment key={i}>
                            <button 
                                className={`btn btn-sm rounded-pill px-3 fw-bold transition ${i === drillPath.length - 1 ? 'btn-primary' : 'btn-light text-muted'}`}
                                onClick={() => setDrillPath(drillPath.slice(0, i + 1))}
                            >
                                {path}
                            </button>
                            {i < drillPath.length - 1 && <FontAwesomeIcon icon={faChevronRight} className="text-muted small mx-1" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="row g-4 text-dark">
                {/* Main Report Area */}
                <div className="col-xl-9 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
                            <h5 className="fw-bold mb-0 text-dark">Hierarchical Exploration</h5>
                            <div className="d-flex gap-2 text-dark">
                                <button className="btn btn-light btn-sm rounded-pill px-3 text-dark"><FontAwesomeIcon icon={faFilter} className="me-2" />Filters</button>
                                <button className="btn btn-light btn-sm rounded-pill px-3 text-dark"><FontAwesomeIcon icon={faFileExport} className="me-2" />Export</button>
                            </div>
                        </div>

                        <div className="row g-3 text-dark">
                            {currentData.map((item, i) => (
                                <div key={i} className="col-md-6 col-lg-3 text-dark">
                                    <div 
                                        className="p-4 rounded-4 border bg-light bg-opacity-50 cursor-pointer hover-lift transition text-dark"
                                        onClick={() => setDrillPath([...drillPath, item.label])}
                                    >
                                        <div className="small text-muted text-uppercase fw-bold mb-1 text-dark">{item.type}</div>
                                        <div className="fw-bold h5 mb-2 text-dark">{item.label}</div>
                                        <div className="d-flex justify-content-between align-items-center text-dark">
                                            <span className="h4 fw-bold mb-0 text-primary text-dark">{item.value}</span>
                                            <span className="badge bg-success bg-opacity-10 text-success text-dark">{item.change}</span>
                                        </div>
                                        <div className="x-small text-muted mt-2 text-dark">{item.sub} available</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Table Placeholder */}
                        <div className="mt-5 text-dark">
                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                                <FontAwesomeIcon icon={faTableList} className="text-primary text-dark" />
                                Transactional Detail Level
                            </h6>
                            <div className="table-responsive text-dark">
                                <table className="table align-middle text-dark">
                                    <thead className="bg-light text-muted small text-uppercase text-dark">
                                        <tr className="text-dark">
                                            <th className="text-dark">Reference</th>
                                            <th className="text-dark">Department</th>
                                            <th className="text-dark">Amount</th>
                                            <th className="text-dark">Date</th>
                                            <th className="text-dark">Validation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-dark">
                                        {[1, 2, 3, 4].map(i => (
                                            <tr key={i} className="text-dark">
                                                <td className="fw-bold text-dark text-dark">TRX-9904{i}</td>
                                                <td className="text-dark">Global Ops</td>
                                                <td className="fw-bold text-dark">$24,500.00</td>
                                                <td className="text-dark">08 Jun 2024</td>
                                                <td className="text-dark"><span className="badge bg-success rounded-pill text-dark">Verified</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Areas & Controls */}
                <div className="col-xl-3 text-dark">
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h6 className="fw-bold text-muted text-uppercase mb-3 px-1" style={{ fontSize: '11px' }}>Report Areas</h6>
                        <div className="d-grid gap-2 text-dark">
                            {reportAreas.map((area, i) => (
                                <button key={i} className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                    <div className="rounded-circle p-2 bg-white shadow-sm text-primary text-dark">
                                        <FontAwesomeIcon icon={area.icon} />
                                    </div>
                                    <div className="flex-grow-1 text-dark">
                                        <div className="fw-bold small text-dark">{area.name}</div>
                                        <div className="x-small text-muted text-dark">{area.count} reports available</div>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-muted x-small text-dark" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`card border-0 rounded-4 shadow-sm p-4 bg-primary text-white text-dark`}>
                        <div className="d-flex align-items-center gap-3 mb-3 text-dark">
                            <FontAwesomeIcon icon={faArrowDownWideShort} size="xl" className="text-dark" />
                            <h6 className="fw-bold mb-0 text-dark">Analytical Depth</h6>
                        </div>
                        <p className="small opacity-90 mb-4 text-dark text-white">Unlock record-level exploration and root cause investigation across all system modules.</p>
                        <div className="d-grid gap-2 text-dark">
                            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 text-dark">
                                <div className="fw-bold small text-white">Real-time Data Sync</div>
                                <div className="x-small opacity-75 text-white">Active (0.2s latency)</div>
                            </div>
                            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 text-dark">
                                <div className="fw-bold small text-white">Drill Path History</div>
                                <div className="x-small opacity-75 text-white">Tracking active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .cursor-pointer { cursor: pointer; }
                .hover-bg-primary:hover { background-color: rgba(79, 70, 229, 0.05) !important; color: #4f46e5 !important; }
            `}</style>
        </div>
    );
};

export default DrillDownReports;
