
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGavel, faCheckDouble, faShieldAlt, faHistory,
    faFileContract, faExclamationTriangle, faSearch, faFilter,
    faDownload, faGlobe, faBook, faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const ComplianceManagement = ({ isDark }) => {
    const [selectedRegion, setSelectedRegion] = useState('Global');

    const [complianceStats, setComplianceStats] = useState([]);
    const [regulatoryAlerts, setRegulatoryAlerts] = useState([]);
    useEffect(() => { getTabData('compliance-management').then(res => { const d = res.data?.data || {}; setComplianceStats(d.complianceStats || []); setRegulatoryAlerts(d.regulatoryAlerts || []); }).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faGavel} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Compliance Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Regulatory Tracking & Enterprise Policy Governance</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <select 
                                className={`form-select form-select-sm rounded-pill px-4 fw-black x-small border shadow-sm ${isDark ? 'bg-dark-alt text-white border-opacity-10' : 'bg-white'}`}
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                style={{ width: 'auto' }}
                            >
                                <option>Global</option>
                                <option>North America</option>
                                <option>European Union</option>
                                <option>APAC Region</option>
                            </select>
                            <button className="btn btn-primary rounded-pill px-4 fw-black x-small shadow-sm">
                                <FontAwesomeIcon icon={faDownload} className="me-2" /> EXPORT AUDIT
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {complianceStats.map((s, i) => (
                            <div key={i} className="col-md-3">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border position-relative overflow-hidden`}>
                                    <div className="position-absolute top-0 end-0 p-3 opacity-10">
                                        <FontAwesomeIcon icon={s.icon} className="fs-2" />
                                    </div>
                                    <h3 className="fw-black mb-1" style={{ color: s.color }}>{s.value}</h3>
                                    <div className="text-muted x-small fw-bold uppercase">{s.label}</div>
                                    <div className="x-small text-muted opacity-75 mt-2 fw-bold">{s.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="row g-4">
                    {/* Regulatory Tracking Table */}
                    <div className="col-lg-8">
                        <div className={`card border-0 rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                            <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="fw-black mb-0">Active Regulatory Alerts</h5>
                                    <span className="badge rounded-pill bg-danger-subtle text-danger x-small fw-black px-3">URGENT</span>
                                </div>
                                <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                            <tr>
                                                <th className="px-5 py-3 border-0">Regulation / Policy</th>
                                                <th className="py-3 border-0">Deadline</th>
                                                <th className="py-3 border-0">Impact</th>
                                                <th className="px-5 py-3 border-0 text-end">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {regulatoryAlerts.map((alert, i) => (
                                                <tr key={i} className="border-0">
                                                    <td className="px-5 py-4 border-0">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${isDark ? 'bg-dark-alt' : 'bg-light'} text-primary`}>
                                                                <FontAwesomeIcon icon={faFileContract} className="x-small" />
                                                            </div>
                                                            <div className="fw-black small">{alert.title}</div>
                                                        </div>
                                                    </td>
                                                    <td className="border-0 fw-bold x-small text-muted">{alert.date}</td>
                                                    <td className="border-0">
                                                        <span className={`x-small fw-black ${
                                                            alert.impact === 'Critical' ? 'text-danger' : 
                                                            alert.impact === 'High' ? 'text-warning' : 'text-info'
                                                        }`}>{alert.impact.toUpperCase()}</span>
                                                    </td>
                                                    <td className="px-5 border-0 text-end">
                                                        <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                            alert.status === 'Ongoing' ? 'bg-success' : 
                                                            alert.status === 'In Progress' ? 'bg-primary' : 'bg-secondary'
                                                        }`}>
                                                            {alert.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Compliance Features */}
                    <div className="col-lg-4">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20' : 'bg-primary bg-opacity-5 border border-primary border-opacity-10'}`}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary p-2 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faUserShield} />
                                </div>
                                <h6 className="fw-black mb-0 uppercase ls-wide">Governance Tools</h6>
                            </div>
                            
                            <div className="space-y-4">
                                {[
                                    { title: "Multi-Jurisdiction", desc: "Support for regional accounting and legal standards.", icon: faGlobe },
                                    { title: "Policy Management", desc: "Centralized repository for all enterprise compliance documents.", icon: faBook },
                                    { title: "Audit Trail", desc: "Immutable logs for all financial and administrative actions.", icon: faHistory },
                                    { title: "Risk Assessment", desc: "AI-powered detection of potential compliance gaps.", icon: faShieldAlt }
                                ].map((feature, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-white shadow-sm border'} mb-3`}>
                                        <div className="d-flex gap-3">
                                            <FontAwesomeIcon icon={feature.icon} className="text-primary mt-1" />
                                            <div>
                                                <div className="small fw-black uppercase x-small mb-1">{feature.title}</div>
                                                <p className="x-small mb-0 fw-bold opacity-75">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn btn-primary w-100 rounded-pill mt-4 fw-black x-small py-3 shadow-primary">
                                START COMPLIANCE AUDIT
                            </button>
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
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
            `}</style>
        </div>
    );
};

export default ComplianceManagement;
