
import React, { useState, useEffect } from 'react';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, faChartArea, faWarehouse,
    faCogs, faBolt, faWater, faChevronRight, faMapMarkerAlt,
    faPlus, faTimes, faArrowTrendUp, faShield
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const WarehouseFinancialTracking = ({ isDark }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [stats, setStats] = useState({ totalWarehouseCost: 0, warehouseRevenue: 0, warehouseProfitability: 0, totalWarehouses: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getTabData('warehouse-financial');
                const d = res.data?.data || {};
                setStats(d.stats || { totalWarehouseCost: 0, warehouseRevenue: 0, warehouseProfitability: 0, totalWarehouses: 0 });
            } catch (error) {
                console.error("Failed to fetch warehouse stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const warehouses = [
        { id: 'WH-001', name: 'Central Distribution Center', location: 'Chicago, IL', operationalCost: '$85,400', revenueGenerated: '$420,000', margin: '79.6%', utilization: '92%' },
        { id: 'WH-002', name: 'Western Logistics Hub', location: 'Los Angeles, CA', operationalCost: '$112,000', revenueGenerated: '$380,000', margin: '70.5%', utilization: '85%' },
        { id: 'WH-003', name: 'East Coast Node', location: 'Newark, NJ', operationalCost: '$65,000', revenueGenerated: '$290,000', margin: '77.5%', utilization: '78%' },
    ];

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Header Stats */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex align-items-center justify-content-between mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-success p-3 text-white shadow-success">
                                <FontAwesomeIcon icon={faWarehouse} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Warehouse Financial Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Operational Efficiency & P&L per Facility</p>
                            </div>
                        </div>
                        <button className="btn btn-success rounded-pill px-4 fw-black x-small text-white shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> ADD FACILITY
                        </button>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="p-5 rounded-5 bg-primary text-white position-relative overflow-hidden shadow-primary h-100">
                                <div className="position-absolute top-0 end-0 p-5 opacity-20">
                                    <FontAwesomeIcon icon={faChartArea} style={{ fontSize: '150px' }} />
                                </div>
                                <div className="z-index-1 position-relative">
                                    <h6 className="uppercase fw-black x-small ls-wide opacity-75 mb-4">Consolidated Warehouse ROI</h6>
                                    <div className="d-flex align-items-end gap-3 mb-5">
                                        <h1 className="fw-black mb-0" style={{ fontSize: '4rem' }}>76.4%</h1>
                                        <div className="badge bg-white text-primary rounded-pill px-3 py-2 x-small fw-black mb-2">
                                            <FontAwesomeIcon icon={faArrowTrendUp} className="me-1" /> +4.2%
                                        </div>
                                    </div>
                                    <div className="d-flex gap-5">
                                        <div>
                                            <div className="x-small fw-bold opacity-75 uppercase ls-wide">Total OpEx</div>
                                            <div className="fw-black h3 mb-0">${(stats.totalWarehouseCost / 1000).toFixed(1)}K</div>
                                        </div>
                                        <div className="border-start border-white border-opacity-25 ps-5">
                                            <div className="x-small fw-bold opacity-75 uppercase ls-wide">Total Revenue</div>
                                            <div className="fw-black h3 mb-0">${(stats.warehouseRevenue / 1000).toFixed(1)}K</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                <h6 className="uppercase fw-black x-small ls-wide text-muted mb-5">Utility Optimization</h6>
                                <div className="space-y-4">
                                    {[
                                        { l: 'Electricity', v: '$42,500', i: faBolt, c: 'text-warning', p: '65%' },
                                        { l: 'Water', v: '$8,200', i: faWater, c: 'text-info', p: '12%' },
                                        { l: 'Maintenance', v: '$15,400', i: faCogs, c: 'text-primary', p: '23%' },
                                    ].map((u, i) => (
                                        <div key={i} className="mb-4">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FontAwesomeIcon icon={u.i} className={u.c} />
                                                    <span className="x-small fw-bold text-muted">{u.l}</span>
                                                </div>
                                                <span className="small fw-black">{u.v}</span>
                                            </div>
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div className={`progress-bar ${u.c.replace('text', 'bg')}`} style={{ width: u.p }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facility List */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-0">
                        <h5 className="fw-black mb-0">Facility Financial Registry</h5>
                    </div>
                    <div className="card-body p-5">
                        <div className="row g-4">
                            {warehouses.map(wh => (
                                <div key={wh.id} className="col-12">
                                    <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border transition-all hover-border-primary cursor-pointer`} onClick={() => setShowDetail(true)}>
                                        <div className="row align-items-center">
                                            <div className="col-md-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-white shadow-sm p-3 border">
                                                        <FontAwesomeIcon icon={faBuilding} className="text-success" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-black small">{wh.name}</div>
                                                        <div className="text-muted x-small fw-bold">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 opacity-50" />
                                                            {wh.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2 text-center">
                                                <div className="x-small fw-bold text-muted uppercase mb-1">Utilization</div>
                                                <div className="fw-black h5 mb-0 text-primary">{wh.utilization}</div>
                                            </div>
                                            <div className="col-md-2 text-center">
                                                <div className="x-small fw-bold text-muted uppercase mb-1">OpEx</div>
                                                <div className="fw-black h5 mb-0 text-danger">{wh.operationalCost}</div>
                                            </div>
                                            <div className="col-md-2 text-center">
                                                <div className="x-small fw-bold text-muted uppercase mb-1">Revenue</div>
                                                <div className="fw-black h5 mb-0 text-success">{wh.revenueGenerated}</div>
                                            </div>
                                            <div className="col-md-2 text-end">
                                                <button className="btn btn-xs btn-light rounded-pill px-3 fw-black x-small">
                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showDetail}
                onClose={() => setShowDetail(false)}
                title="Facility Deep Dive"
                size="lg"
            >
                <div className="p-4 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 mb-5 d-flex align-items-center gap-3">
                    <FontAwesomeIcon icon={faShield} className="text-success fs-3" />
                    <div>
                        <div className="fw-black small text-success">OPTIMIZED FACILITY</div>
                        <div className="x-small fw-bold text-success opacity-75">Performing 12% above regional average.</div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-3">Revenue Streams</h6>
                        {['Storage Fees', 'Handling Charges', 'VA Services'].map((s, i) => (
                            <div key={i} className="d-flex justify-content-between mb-2">
                                <span className="small fw-bold text-muted">{s}</span>
                                <span className="small fw-black">${(i + 1) * 120},000</span>
                            </div>
                        ))}
                    </div>
                    <hr className="opacity-10" />
                    <div>
                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-3">Operational Risk Profile</h6>
                        <div className="badge bg-light text-dark border rounded-pill px-3 py-2 x-small fw-black">LOW RISK - SCORE: 92/100</div>
                    </div>
                </div>

                <div className="mt-4">
                    <button className="btn btn-primary w-100 rounded-pill py-3 fw-black x-small ls-wide shadow-primary">DOWNLOAD FULL FACILITY P&L</button>
                </div>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-success { box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .hover-border-primary:hover { border-color: #4f46e5 !important; }
                .z-index-1 { z-index: 1; }
            `}</style>
        </div>
    );
};

export default WarehouseFinancialTracking;
