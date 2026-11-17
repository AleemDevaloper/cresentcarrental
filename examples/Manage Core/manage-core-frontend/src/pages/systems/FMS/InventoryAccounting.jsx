
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalculator, faBox, faArrowRight, faSync,
    faPlus, faSearch, faFilter, faChevronRight, faFileInvoice
} from '@fortawesome/free-solid-svg-icons';

import { getTabData } from '../../../api/fms';

const InventoryAccounting = ({ isDark }) => {
    const [journalEntries, setJournalEntries] = useState([]);
    useEffect(() => { getTabData('inventory-accounting').then(res => setJournalEntries(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faCalculator} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Inventory Ledger & GL Integration</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">COGS Calculation & Purchase Price Variance Tracking</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW JOURNAL ENTRY
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Inventory Value', v: '$2.4M', c: '#4f46e5' },
                            { l: 'COGS (Current Month)', v: '$458,000', c: '#10b981' },
                            { l: 'Unreconciled Variances', v: '$12,450', c: '#ef4444' },
                        ].map((k, i) => (
                            <div key={i} className="col-md-4">
                                <div className="p-4 rounded-4 bg-light border border-light">
                                    <h3 className="fw-black mb-1" style={{ color: k.c }}>{k.v}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{k.l}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3">
                        <h5 className="fw-black mb-0">Inventory Journal Logs</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Reference</th>
                                        <th className="py-3 border-0">GL Account</th>
                                        <th className="py-3 border-0">Description</th>
                                        <th className="py-3 border-0 text-end">Debit</th>
                                        <th className="py-3 border-0 text-end">Credit</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {journalEntries.map(je => (
                                        <tr key={je.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small text-primary">{je.id}</div>
                                                <div className="text-muted x-small fw-bold">{je.date}</div>
                                            </td>
                                            <td className="border-0 fw-bold small">{je.account}</td>
                                            <td className="border-0 text-muted small">{je.desc}</td>
                                            <td className="border-0 text-end fw-black small text-success">{je.debit}</td>
                                            <td className="border-0 text-end fw-black small text-danger">{je.credit}</td>
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

export default InventoryAccounting;
