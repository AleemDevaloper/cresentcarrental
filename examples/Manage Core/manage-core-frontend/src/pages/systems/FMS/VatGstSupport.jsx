
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileContract, faPercent, faShieldAlt, faFileExport,
    faPlus, faSync, faChevronRight, faCalculator
} from '@fortawesome/free-solid-svg-icons';

const VatGstSupport = ({ isDark }) => {
    const [taxRules, setTaxRules] = useState([]);
    useEffect(() => { getTabData('vat-gst').then(res => setTaxRules(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faPercent} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Global Indirect Tax Configuration</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">VAT/GST Compliance & Input Credit Automation</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> ADD TAX REGION
                        </button>
                    </div>

                    <div className="row g-4">
                        {taxRules.map((tax, i) => (
                            <div key={i} className="col-xl-4 col-md-6">
                                <div className={`p-4 rounded-4 border ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-light border-light'}`}>
                                    <div className="d-flex justify-content-between mb-4">
                                        <div className="fw-black text-primary small">{tax.id}</div>
                                        <div className="badge bg-success bg-opacity-10 text-success x-small fw-black">{tax.status}</div>
                                    </div>
                                    <h6 className="fw-black mb-1">{tax.region}</h6>
                                    <div className="d-flex align-items-center gap-3 mb-0">
                                        <h4 className="fw-black mb-0">{tax.rate}</h4>
                                        <span className="x-small fw-black text-muted uppercase">{tax.type} RATE</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-xl-8">
                        <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3">
                                <h5 className="fw-black mb-0">Tax Liability & Input Credits</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="x-small fw-black uppercase text-muted">
                                            <tr>
                                                <th className="px-5 py-3 border-0">Tax Period</th>
                                                <th className="py-3 border-0">Output Tax</th>
                                                <th className="py-3 border-0">Input Credit</th>
                                                <th className="py-3 border-0 text-end">Net Payable</th>
                                                <th className="px-5 py-3 border-0 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { period: 'May 2026', output: '$45,200', input: '$12,800', net: '$32,400' },
                                                { period: 'April 2026', output: '$38,400', input: '$10,200', net: '$28,200' },
                                                { period: 'March 2026', output: '$41,000', input: '$15,000', net: '$26,000' },
                                            ].map((row, idx) => (
                                                <tr key={idx} className="border-0">
                                                    <td className="px-5 py-4 border-0 fw-black small">{row.period}</td>
                                                    <td className="border-0 fw-bold small text-danger">{row.output}</td>
                                                    <td className="border-0 fw-bold small text-success">{row.input}</td>
                                                    <td className="border-0 text-end fw-black small text-primary">{row.net}</td>
                                                    <td className="px-5 border-0 text-end">
                                                        <button className="btn btn-xs rounded-circle bg-light border-0"><FontAwesomeIcon icon={faFileExport} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'}`}>
                            <div className="card-body p-5">
                                <div className="d-flex align-items-center gap-3 mb-5">
                                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary fs-4" />
                                    <h6 className="fw-black mb-0 uppercase ls-wide">Compliance Health</h6>
                                </div>
                                <div className="text-center py-4 mb-4">
                                    <h2 className="fw-black text-success">98.5%</h2>
                                    <div className="x-small fw-black text-muted uppercase">Accuracy Score</div>
                                </div>
                                <div className="p-4 rounded-4 bg-light border border-opacity-10 mb-3">
                                    <div className="fw-black x-small uppercase mb-2">Audit Readiness</div>
                                    <p className="text-muted small fw-bold mb-0">All tax certificates for Q2 2026 have been generated and archived.</p>
                                </div>
                            </div>
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

export default VatGstSupport;
