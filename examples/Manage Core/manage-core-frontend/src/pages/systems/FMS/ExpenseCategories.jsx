
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTags, faPlus, faChartPie, faCog, faTrash, faEdit,
    faLayerGroup, faSitemap
} from '@fortawesome/free-solid-svg-icons';

const ExpenseCategories = ({ isDark }) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => { getTabData('expense-categories').then(res => setCategories(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-sm">
                                <FontAwesomeIcon icon={faTags} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Expense Classification Taxonomy</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">GL Account Mapping & Budget Hierarchies</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> ADD CATEGORY
                        </button>
                    </div>

                    <div className="row g-4">
                        {categories.map((cat, i) => (
                            <div key={i} className="col-xl-3 col-md-6">
                                <div className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10' : 'bg-light border-light'}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div className="fw-black text-primary">{cat.code}</div>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-xs btn-light rounded-circle"><FontAwesomeIcon icon={faEdit} /></button>
                                        </div>
                                    </div>
                                    <h6 className="fw-black mb-1">{cat.name}</h6>
                                    <div className="progress rounded-pill mb-4" style={{ height: '6px' }}>
                                        <div className="progress-bar rounded-pill" style={{ width: '65%', background: cat.color }}></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="x-small fw-bold text-muted uppercase">Spent: {cat.spent}</div>
                                        <div className="x-small fw-bold text-muted uppercase">Budget: {cat.budget}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 mt-4 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Category Hierarchy Explorer</h5>
                    </div>
                    <div className="card-body p-5 pt-0">
                        {[
                            { parent: 'Personnel Expenses', subs: ['Salaries', 'Bonuses', 'Benefits', 'Insurance'] },
                            { parent: 'Infrastructure', subs: ['Office Rent', 'Utilities', 'Software Licenses', 'Hardware'] },
                            { parent: 'Logistics', subs: ['Freight', 'Warehousing', 'Last Mile Delivery'] },
                        ].map((node, idx) => (
                            <div key={idx} className="mb-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <FontAwesomeIcon icon={faLayerGroup} className="text-primary small" />
                                    <div className="fw-black small">{node.parent.toUpperCase()}</div>
                                </div>
                                <div className="d-flex flex-wrap gap-2 ps-5">
                                    {node.subs.map((s, si) => (
                                        <span key={si} className="badge rounded-pill bg-light text-muted fw-bold x-small px-3 py-2 border">
                                            {s}
                                        </span>
                                    ))}
                                    <button className="btn btn-xs rounded-pill bg-primary bg-opacity-10 text-primary border-0 fw-black x-small">+ SUB</button>
                                </div>
                            </div>
                        ))}
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

export default ExpenseCategories;
