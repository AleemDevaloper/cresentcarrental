
import React, { useState, useEffect } from 'react';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faBoxOpen, faArrowTrendUp, faArrowTrendDown,
    faFileInvoiceDollar, faSearch, faFilter, faDownload,
    faPlus, faTimes, faHistory, faLayerGroup, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const InventoryCostTracking = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({ totalItems: 0, avgCostIncrease: '0%', totalInventoryValue: '$0.00' });
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', sku: '', category: '', unit: 'unit', unit_cost: '', effective_date: '', vendor_reference: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTabData('inventory-cost');
            const d = res.data?.data || {};
            setStats(d.stats || { totalItems: 0, avgCostIncrease: '0%', totalInventoryValue: '$0.00' });
            setInventory(d.items || []);
        } catch (error) {
            console.error("Failed to fetch inventory data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Failed to create inventory item", error);
        }
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Main Dashboard Card */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faChartLine} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Inventory Cost Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Monitor Price Variances & Procurement Trends</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faHistory} className="me-2" /> COST HISTORY
                            </button>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm" onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW COST ENTRY
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Avg Cost Increase', v: stats.avgCostIncrease, c: '#4f46e5', i: faArrowTrendUp, d: 'vs last quarter' },
                            { l: 'Total Inventory Value', v: stats.totalInventoryValue, c: '#10b981', i: faArrowTrendDown, d: 'across all categories' },
                            { l: 'Total Items Tracked', v: stats.totalItems, c: '#f59e0b', i: faFileInvoiceDollar, d: 'require approval' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border position-relative overflow-hidden`}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <FontAwesomeIcon icon={k.i} className="fs-1" />
                                    </div>
                                    <h3 className="fw-black mb-1" style={{ color: k.c }}>{k.v}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                    <div className="x-small text-muted opacity-75 mt-2 fw-bold">{k.d}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SKU Analysis Table */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">SKU Cost Analysis</h5>
                            <span className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">LIVE FEED</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search SKU..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                    <tr>
                                        <th className="px-5 py-3 border-0">Item Description</th>
                                        <th className="py-3 border-0">Category</th>
                                        <th className="py-3 border-0 text-end">Current Cost</th>
                                        <th className="py-3 border-0 text-end">Variance</th>
                                        <th className="px-5 py-3 border-0 text-end">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map(item => {
                                        const latestCost = item.costs?.[0] || {};
                                        return (
                                            <tr key={item.id} className="border-0">
                                                <td className="px-5 py-4 border-0">
                                                    <div className="fw-black small">{item.name}</div>
                                                    <div className="text-muted x-small fw-bold">{item.sku}</div>
                                                </td>
                                                <td className="border-0">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FontAwesomeIcon icon={faLayerGroup} className="text-muted x-small" />
                                                        <span className="x-small fw-bold text-muted uppercase">{item.category || 'Uncategorized'}</span>
                                                    </div>
                                                </td>
                                                <td className="border-0 text-end fw-black small">${latestCost.unit_cost || '0.00'}</td>
                                                <td className="border-0 text-end fw-black small">
                                                    <span className={`${latestCost.variance > 0 ? 'text-danger' : latestCost.variance < 0 ? 'text-success' : 'text-muted'}`}>
                                                        {latestCost.variance ? `${latestCost.variance > 0 ? '+' : ''}${latestCost.variance}%` : '0.0%'}
                                                    </span>
                                                </td>
                                                <td className="px-5 border-0 text-end">
                                                    <button className="btn btn-xs btn-light rounded-circle shadow-sm">
                                                        <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Record New Cost Entry"
                size="md"
            >
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Item Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="Item Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">SKU</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="SKU-001" required value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Category</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="Raw Materials" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Unit Cost ($)</label>
                        <input type="number" step="0.01" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.00" required value={formData.unit_cost} onChange={(e) => setFormData({...formData, unit_cost: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Effective Date</label>
                        <input type="date" className="form-control rounded-pill x-small fw-bold border-2" required value={formData.effective_date} onChange={(e) => setFormData({...formData, effective_date: e.target.value})} />
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>CANCEL</button>
                            <button type="submit" className="btn btn-primary rounded-pill w-100 fw-black x-small py-3 shadow-primary">POST ENTRY</button>
                        </div>
                    </div>
                </form>
            </DialogBox>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.7); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
            `}</style>
        </div>
    );
};

export default InventoryCostTracking;
