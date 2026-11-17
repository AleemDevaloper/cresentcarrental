
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBuilding, faChartPie, faTools, faHistory,
    faCalendarCheck, faShieldAlt, faArrowUpRightDots, faTags,
    faPlus, faChevronRight, faWrench, faFileSignature, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const AssetTracking = ({ isDark }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({ totalAssets: 0, activeAssets: 0, totalValue: 0, underMaintenance: 0 });
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', asset_code: '', category_id: 1, purchase_cost: '', purchase_date: '', location: '', status: 'active' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTabData('asset-tracking');
            const d = res.data?.data || {};
            setStats(d.stats || { totalAssets: 0, activeAssets: 0, totalValue: 0, underMaintenance: 0 });
            setAssets(d.items || []);
        } catch (error) {
            console.error("Failed to fetch asset data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setShowAddModal(false);
            fetchData();
        } catch (error) {
            console.error("Failed to register asset", error);
        }
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* Dashboard Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-info p-3 text-white shadow-info">
                                <FontAwesomeIcon icon={faBuilding} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Asset Tracking & Valuation</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Depreciation, Maintenance & Lifecycle Management</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border">
                                <FontAwesomeIcon icon={faHistory} className="me-2" /> AUDIT LOGS
                            </button>
                            <button className="btn btn-dark rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowAddModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTER NEW ASSET
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Fixed Assets', v: `$${(stats.totalValue / 1000000).toFixed(1)}M`, i: faBuilding, c: '#0ea5e9', d: `${stats.totalAssets} Items` },
                            { l: 'Active Assets', v: stats.activeAssets, i: faChartPie, c: '#f43f5e', d: 'In Operation' },
                            { l: 'Under Maintenance', v: stats.underMaintenance, i: faTools, c: '#f59e0b', d: 'In Repair' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="rounded-circle bg-white shadow-sm p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <FontAwesomeIcon icon={s.i} style={{ color: s.c }} />
                                        </div>
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">{s.l}</h6>
                                    </div>
                                    <h2 className="fw-black mb-1" style={{ color: s.c }}>{s.v}</h2>
                                    <div className="x-small text-muted fw-bold opacity-75">{s.d}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Registry View */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-black mb-0 text-dark">Asset Lifecycle Registry</h5>
                        <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                            <span className="input-group-text bg-transparent border-0 ps-3">
                                <FontAwesomeIcon icon={faSearch} className="text-muted" />
                            </span>
                            <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search Assets..." />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Asset Details</th>
                                    <th className="py-3 border-0 text-end">Current Value</th>
                                    <th className="py-3 border-0 text-center">Status</th>
                                    <th className="px-5 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map(asset => (
                                    <tr key={asset.id} className="border-0 cursor-pointer">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className={`rounded-4 p-3 bg-light border ${asset.status === 'maintenance' ? 'text-danger' : 'text-primary'}`}>
                                                    <FontAwesomeIcon icon={faBuilding} />
                                                </div>
                                                <div>
                                                    <div className="fw-black small text-dark">{asset.name}</div>
                                                    <div className="text-muted x-small fw-bold">{asset.asset_code} • {asset.category?.name || 'Uncategorized'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0 fw-black small text-primary text-end">${asset.current_value}</td>
                                        <td className="border-0 text-center">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${asset.status === 'active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                {asset.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <button className="btn btn-xs btn-light rounded-circle shadow-sm">
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Register New Capital Asset"
                size="md"
                footer={
                    <div className="d-flex gap-2 w-100">
                        <button className="btn btn-light rounded-pill w-100 fw-bold small py-2 border" onClick={() => setShowAddModal(false)}>CANCEL</button>
                        <button className="btn btn-dark rounded-pill w-100 fw-bold small py-2 shadow-info text-white" onClick={handleSubmit}>GENERATE ASSET TAG & SAVE</button>
                    </div>
                }
            >
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Asset Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Server Rack A1" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Asset Code</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="AST-001" required value={formData.asset_code} onChange={(e) => setFormData({...formData, asset_code: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Purchase Value ($)</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" required value={formData.purchase_cost} onChange={(e) => setFormData({...formData, purchase_cost: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Purchase Date</label>
                        <input type="date" className="form-control rounded-pill x-small fw-bold border-2" required value={formData.purchase_date} onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} />
                    </div>
                </div>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-info { box-shadow: 0 10px 20px -5px rgba(14, 165, 233, 0.4); }
                .text-dark { color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default AssetTracking;
