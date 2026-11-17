
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLayerGroup, faChartPie, faCogs, faHistory,
    faPlus, faSync, faChevronRight, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';

import { getTabData } from '../../../api/fms';

const StockValuation = ({ isDark }) => {
    const [assets, setAssets] = useState([]);
    useEffect(() => { getTabData('stock-valuation').then(res => setAssets(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faChartPie} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Real-time Stock Valuation Engine</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Multi-Model Inventory Assessment (FIFO/LIFO/WAC)</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <select className="form-select form-select-sm rounded-pill px-4 x-small fw-black border-0 bg-light">
                                <option>VALUATION MODEL: FIFO</option>
                                <option>VALUATION MODEL: LIFO</option>
                                <option>VALUATION MODEL: AVERAGE</option>
                            </select>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">RUN ASSESSMENT</button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Aggregate Value', v: '$2,458,000', delta: '+4.2%', c: '#4f46e5' },
                            { l: 'Holding Cost', v: '$12,400/mo', delta: '-1.5%', c: '#f59e0b' },
                            { l: 'Write-off Reserve', v: '$85,000', delta: 'Stable', c: '#10b981' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 bg-light bg-opacity-50 border border-light">
                                    <div className="d-flex justify-content-between mb-1">
                                        <h3 className="fw-black mb-0" style={{ color: k.c }}>{k.v}</h3>
                                        <span className="x-small fw-black text-success">{k.delta}</span>
                                    </div>
                                    <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Asset Valuation Inventory</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Asset Descriptor</th>
                                        <th className="py-3 border-0">Quantity on Hand</th>
                                        <th className="py-3 border-0">Unit Valuation</th>
                                        <th className="py-3 border-0 text-center">Accounting Model</th>
                                        <th className="py-3 border-0 text-end">Extended Value</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map(a => (
                                        <tr key={a.id} className="border-0 cursor-pointer">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small">{a.name}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{a.id}</div>
                                            </td>
                                            <td className="border-0 fw-bold small text-muted">{a.qty}</td>
                                            <td className="border-0 fw-black small">{a.val}</td>
                                            <td className="border-0 text-center">
                                                <span className="badge rounded-pill bg-light text-primary x-small fw-black px-3 py-2">{a.model.toUpperCase()}</span>
                                            </td>
                                            <td className="border-0 text-end fw-black small text-primary">{a.total}</td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs rounded-circle bg-light border-0"><FontAwesomeIcon icon={faChevronRight} /></button>
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
                .bg-dark-card { background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
            `}</style>
        </div>
    );
};

export default StockValuation;
