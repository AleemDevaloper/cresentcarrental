
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHandHoldingDollar, faChartPie, faEarthAmericas, faTag,
    faArrowTrendUp, faArrowTrendDown, faFilter, faDownload,
    faEllipsisH, faCircleDollarToSlot, faScaleBalanced
} from '@fortawesome/free-solid-svg-icons';

const ProfitCenterManagement = ({ isDark }) => {
    const [viewType, setViewType] = useState('Region');

    const [regionalData, setRegionalData] = useState([]);
    useEffect(() => { getTabData('profit-center').then(res => setRegionalData(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-teal p-3 text-white shadow-teal" style={{ backgroundColor: '#14b8a6' }}>
                                <FontAwesomeIcon icon={faHandHoldingDollar} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Profit Center Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Margin Calculation & Global Revenue Allocation</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faScaleBalanced} className="me-2" /> RECONCILE
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm" style={{ backgroundColor: '#14b8a6', borderColor: '#14b8a6' }}>
                                <FontAwesomeIcon icon={faDownload} className="me-2" /> MARGIN REPORT
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Consolidated Revenue', v: '$14.7M', i: faCircleDollarToSlot, c: '#14b8a6', t: '+12% vs LY' },
                            { l: 'Average Net Margin', v: '32.4%', i: faChartPie, c: '#6366f1', t: '+2.5% vs PQ' },
                            { l: 'Underperforming Units', v: '03 Units', i: faArrowTrendDown, c: '#ef4444', t: 'Action Required' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="text-muted x-small fw-bold uppercase ls-wide">{s.l}</div>
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} className="opacity-50" />
                                    </div>
                                    <h2 className="fw-black mb-1" style={{ color: s.c }}>{s.v}</h2>
                                    <div className="x-small fw-bold opacity-75">{s.t}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analysis View */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-3">
                                <button 
                                    className={`btn rounded-pill px-4 x-small fw-black ${viewType === 'Region' ? 'btn-dark text-white' : 'btn-light border'}`}
                                    onClick={() => setViewType('Region')}
                                >
                                    BY REGION
                                </button>
                                <button 
                                    className={`btn rounded-pill px-4 x-small fw-black ${viewType === 'Product' ? 'btn-dark text-white' : 'btn-light border'}`}
                                    onClick={() => setViewType('Product')}
                                >
                                    BY PRODUCT LINE
                                </button>
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>

                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                    <tr>
                                        <th className="px-5 py-3 border-0">{viewType} Details</th>
                                        <th className="py-3 border-0">Gross Revenue</th>
                                        <th className="py-3 border-0">Total Expenses</th>
                                        <th className="py-3 border-0">Profit Margin</th>
                                        <th className="px-5 py-3 border-0 text-end">Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regionalData.map((row, i) => (
                                        <tr key={i} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle p-2 bg-light border">
                                                        <FontAwesomeIcon icon={viewType === 'Region' ? faEarthAmericas : faTag} className="text-muted" />
                                                    </div>
                                                    <div className="fw-black small">{row.region}</div>
                                                </div>
                                            </td>
                                            <td className="border-0 fw-black small text-primary">{row.revenue}</td>
                                            <td className="border-0 fw-black small text-danger">{row.expenses}</td>
                                            <td className="border-0">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1" style={{ height: '6px', width: '100px' }}>
                                                        <div className="progress-bar bg-success" style={{ width: row.margin }}></div>
                                                    </div>
                                                    <span className="fw-black small">{row.margin}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                    row.status === 'High' ? 'bg-success' : row.status === 'Medium' ? 'bg-primary' : 'bg-danger shadow-sm'
                                                }`}>
                                                    {row.status.toUpperCase()}
                                                performance</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                .shadow-teal { box-shadow: 0 10px 20px -5px rgba(20, 184, 166, 0.4); }
            `}</style>
        </div>
    );
};

export default ProfitCenterManagement;
