
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHandHoldingUsd, faFileSignature, faBuilding, faHistory,
    faPlus, faSearch, faFilter, faChevronRight, faAddressCard
} from '@fortawesome/free-solid-svg-icons';

const WithholdingTax = ({ isDark }) => {
    const [vendors, setVendors] = useState([]);
    useEffect(() => { getTabData('withholding-tax').then(res => setVendors(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white">
                                <FontAwesomeIcon icon={faAddressCard} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Withholding Tax (WHT/TDS) Ledger</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Non-Resident Tax Compliance & Certificate Issuance</p>
                            </div>
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW TAX PROFILE
                        </button>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Withheld', v: '$245,800', c: '#4f46e5' },
                            { l: 'Remittance Due', v: '$42,100', c: '#ef4444' },
                            { l: 'Certificates Pending', v: '18', c: '#f59e0b' },
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
                        <h5 className="fw-black mb-0">Vendor Tax Deductibility Master</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="x-small fw-black uppercase text-muted">
                                    <tr>
                                        <th className="px-5 py-3 border-0">Vendor Entity</th>
                                        <th className="py-3 border-0">Jurisdiction</th>
                                        <th className="py-3 border-0 text-center">WHT Rate</th>
                                        <th className="py-3 border-0 text-end">YTD Withheld</th>
                                        <th className="py-3 border-0 text-center">Status</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.map(v => (
                                        <tr key={v.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small">{v.name}</div>
                                                <div className="text-muted x-small fw-bold uppercase">{v.id} | {v.cat}</div>
                                            </td>
                                            <td className="border-0 fw-bold small text-muted">{v.country}</td>
                                            <td className="border-0 text-center fw-black small">{v.rate}</td>
                                            <td className="border-0 text-end fw-black small text-primary">{v.withheld}</td>
                                            <td className="border-0 text-center">
                                                <span className="badge rounded-pill bg-success bg-opacity-10 text-success x-small fw-black px-3 py-2">COMPLIANT</span>
                                            </td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs rounded-circle bg-light border-0"><FontAwesomeIcon icon={faFileSignature} /></button>
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

export default WithholdingTax;
