
import React, { useState, useEffect } from 'react';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartPie, faArrowUpRightFromSquare, faCoins, faBriefcase,
    faHandHoldingDollar, faShieldHeart, faArrowTrendUp, faTimeline,
    faPlus, faTimes, faChevronRight, faCircleInfo, faRotateLeft, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const InvestmentTracking = ({ isDark }) => {
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [stats, setStats] = useState({ totalInvested: 0, portfolioValue: 0, totalReturns: 0, roi: '0%' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getTabData('investment');
                const d = res.data?.data || {};
                setStats(d.stats || { totalInvested: 0, portfolioValue: 0, totalReturns: 0, roi: '0%' });
            } catch (error) {
                console.error("Failed to fetch investment stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const investments = [
        { id: 'INV-101', name: 'Strategic Equity Fund', type: 'Equity', capital: '$500,000', current: '$612,400', returns: '+22.48%', risk: 'High', allocation: '48%' },
        { id: 'INV-102', name: 'Corporate Bonds - Series B', type: 'Fixed Income', capital: '$250,000', current: '$268,500', returns: '+7.40%', risk: 'Low', allocation: '21%' },
        { id: 'INV-103', name: 'Commercial Real Estate REIT', type: 'REIT', capital: '$350,000', current: '$392,000', returns: '+12.00%', risk: 'Medium', allocation: '31%' },
    ];

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Portfolio Summary */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-warning p-3 text-white shadow-warning">
                                <FontAwesomeIcon icon={faCoins} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Investment Portfolio Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Monitor Returns, Capital Gains & Risk Exposure</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faRotateLeft} className="me-2" /> REBALANCE
                            </button>
                            <button className="btn btn-warning rounded-pill px-4 fw-black x-small text-white shadow-sm" onClick={() => setShowBuyModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW INVESTMENT
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded-4 bg-warning text-white shadow-warning h-100 position-relative overflow-hidden">
                                <h6 className="uppercase fw-black x-small ls-wide opacity-75 mb-3">Portfolio Value</h6>
                                <h2 className="fw-black mb-1">${(stats.portfolioValue / 1000).toFixed(1)}K</h2>
                                <div className="x-small fw-bold text-white-50">{stats.roi} Overall Yield</div>
                            </div>
                        </div>
                        {[
                            { l: 'Invested Capital', v: `$${(stats.totalInvested / 1000).toFixed(1)}K`, i: faBriefcase, c: '#4f46e5' },
                            { l: 'Total Returns', v: `$${(stats.totalReturns / 1000).toFixed(1)}K`, i: faHandHoldingDollar, iColor: '#10b981' },
                            { l: 'Risk Index', v: 'Moderate', i: faShieldHeart, iColor: '#ef4444' },
                        ].map((s, i) => (
                            <div key={i} className="col-lg-3 col-md-6">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="d-flex justify-content-between mb-3">
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">{s.l}</h6>
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.iColor || s.c }} />
                                    </div>
                                    <h3 className="fw-black mb-0">{s.v}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Asset Class View */}
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3">
                                <h5 className="fw-black mb-0">Active Holdings</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                        <tr>
                                            <th className="px-5 py-3 border-0">Investment Name</th>
                                            <th className="py-3 border-0 text-end">Allocation</th>
                                            <th className="py-3 border-0 text-end">Market Value</th>
                                            <th className="py-3 border-0 text-end">Returns</th>
                                            <th className="px-5 py-3 border-0 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {investments.map(inv => (
                                            <tr key={inv.id} className="border-0">
                                                <td className="px-5 py-4 border-0">
                                                    <div className="fw-black small">{inv.name}</div>
                                                    <div className="text-muted x-small fw-bold">{inv.id} • {inv.type}</div>
                                                </td>
                                                <td className="border-0 text-end">
                                                    <div className="x-small fw-black mb-1">{inv.allocation}</div>
                                                    <div className="progress ms-auto" style={{ height: '4px', width: '60px' }}>
                                                        <div className="progress-bar bg-warning" style={{ width: inv.allocation }}></div>
                                                    </div>
                                                </td>
                                                <td className="border-0 text-end fw-black small text-primary">{inv.current}</td>
                                                <td className="border-0 text-end fw-black small text-success">
                                                    <FontAwesomeIcon icon={faArrowTrendUp} className="me-1" />
                                                    {inv.returns}
                                                </td>
                                                <td className="px-5 border-0 text-end">
                                                    <button className="btn btn-xs btn-light rounded-circle"><FontAwesomeIcon icon={faChevronRight} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'} h-100`}>
                            <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4 text-dark">Risk Assessment</h6>
                            <div className="p-4 rounded-4 bg-light border text-center">
                                <FontAwesomeIcon icon={faShieldHeart} className="fs-1 text-warning mb-3 opacity-25" />
                                <h5 className="fw-black mb-1">92/100</h5>
                                <p className="x-small fw-bold text-muted uppercase">Reliability Score</p>
                                <div className="mt-4 p-3 rounded-3 bg-white border x-small fw-bold text-start d-flex gap-2 align-items-center">
                                    <FontAwesomeIcon icon={faCircleInfo} className="text-primary" />
                                    <span>Portfolio is currently within the defined risk tolerance parameters.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                title="Commit New Investment"
                size="md"
            >
                <div className="row g-4">
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Asset / Fund Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Vanguard Total Stock Market" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Asset Class</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Equity</option>
                            <option>Fixed Income</option>
                            <option>Commodities</option>
                            <option>REITs</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Initial Capital ($)</label>
                        <input type="number" className="form-control rounded-pill x-small fw-bold border-2" />
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowBuyModal(false)}>CANCEL</button>
                            <button className="btn btn-warning rounded-pill w-100 fw-black x-small py-3 shadow-warning text-white">EXECUTE PURCHASE</button>
                        </div>
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
                .shadow-warning { box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.4); }
            `}</style>
        </div>
    );
};

export default InvestmentTracking;
