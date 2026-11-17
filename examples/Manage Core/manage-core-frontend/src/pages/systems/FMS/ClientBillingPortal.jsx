
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFileInvoiceDollar, faCreditCard, faHistory, faFileAlt,
    faClock, faWallet, faChartLine, faBell, faHandshake,
    faGlobe, faLock, faShieldAlt, faCircleCheck, faPlus,
    faArrowRight, faDownload, faEye, faSync, faBuilding,
    faUserShield, faScaleBalanced, faEnvelopeOpenText
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const ClientBillingPortal = ({ isDark }) => {
    const [activeTab, setActiveTab] = useState('invoices');

    const [billingMetrics, setBillingMetrics] = useState([]);
    useEffect(() => { getTabData('client-billing').then(res => setBillingMetrics(res.data?.data || [])).catch(() => {}); }, []);

    const [invoices, setInvoices] = useState([]);
    useEffect(() => { getTabData('client-billing').then(res => setInvoices(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Client Billing Portal</h2>
                    <p className="text-muted mb-0">Manage invoices, payments, and client financial records.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        Create Invoice
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faBell} className="me-2" />
                        Notify Clients
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="row g-3 mb-4">
                {billingMetrics.map((m, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="rounded-circle p-3" style={{ background: `${m.color}15`, color: m.color }}>
                                        <FontAwesomeIcon icon={m.icon} size="lg" />
                                    </div>
                                    <span className="badge bg-light text-muted fw-normal border">Real-time</span>
                                </div>
                                <h3 className="fw-bold mb-1">{m.value}</h3>
                                <div className="text-muted small fw-bold text-uppercase mb-2">{m.label}</div>
                                <div className="small text-success fw-bold">{m.sub}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-xl-8">
                    {/* Billing Table */}
                    <div className={`card border-0 rounded-4 shadow-sm overflow-hidden ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <div className="card-header bg-transparent border-0 p-4 pb-0">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Invoice Registry</h5>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold active text-primary">Active</button>
                                    <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold">Archived</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0 mt-3 text-dark">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 text-dark">
                                    <thead className="bg-light text-muted small text-uppercase text-dark">
                                        <tr className="text-dark">
                                            <th className="px-4 text-dark">Invoice</th>
                                            <th className="text-dark">Client</th>
                                            <th className="text-dark">Amount</th>
                                            <th className="text-dark">Due Date</th>
                                            <th className="text-dark">Status</th>
                                            <th className="text-end px-4 text-dark">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((inv, i) => (
                                            <tr key={i}>
                                                <td className="px-4">
                                                    <div className="fw-bold text-dark">{inv.id}</div>
                                                    <div className="x-small text-muted">{inv.date}</div>
                                                </td>
                                                <td className="text-dark">{inv.client}</td>
                                                <td className="fw-bold text-primary text-dark">{inv.amount}</td>
                                                <td className="text-dark">{inv.due}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${inv.status === 'Paid' ? 'bg-success' : inv.status === 'Overdue' ? 'bg-danger' : 'bg-warning'}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4 text-dark">
                                                    <div className="btn-group">
                                                        <button className="btn btn-sm btn-light rounded-circle me-1"><FontAwesomeIcon icon={faEye} /></button>
                                                        <button className="btn btn-sm btn-light rounded-circle"><FontAwesomeIcon icon={faDownload} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 text-dark">
                    {/* Subscription Management */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4">Subscription Overview</h5>
                        <div className="d-grid gap-3">
                            <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-20">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold text-primary">Enterprise Plan</span>
                                    <span className="badge bg-primary rounded-pill">32 Clients</span>
                                </div>
                                <div className="progress rounded-pill mb-2" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                                </div>
                                <div className="d-flex justify-content-between x-small text-muted">
                                    <span>Quota Usage</span>
                                    <span>85%</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-20">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold text-success">Professional</span>
                                    <span className="badge bg-success rounded-pill">12 Clients</span>
                                </div>
                                <div className="progress rounded-pill mb-2" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-success" style={{ width: '45%' }}></div>
                                </div>
                                <div className="d-flex justify-content-between x-small text-muted">
                                    <span>Quota Usage</span>
                                    <span>45%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Settings */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4">Billing Configuration</h5>
                        <div className="d-grid gap-2 text-dark">
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faCreditCard} className="text-primary" />
                                <div>
                                    <div className="fw-bold small">Payment Gateways</div>
                                    <div className="x-small text-muted">Stripe, PayPal, Wire</div>
                                </div>
                            </button>
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faGlobe} className="text-info" />
                                <div>
                                    <div className="fw-bold small">Multi-Currency</div>
                                    <div className="x-small text-muted">24 currencies active</div>
                                </div>
                            </button>
                            <button className="btn btn-light text-start p-3 rounded-4 d-flex align-items-center gap-3 transition hover-bg-primary text-dark">
                                <FontAwesomeIcon icon={faUserShield} className="text-success" />
                                <div>
                                    <div className="fw-bold small">Client Self-Service</div>
                                    <div className="x-small text-muted">Portal access active</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .x-small { font-size: 11px; }
                .transition { transition: all 0.3s ease; }
                .hover-bg-primary:hover { background-color: rgba(79, 70, 229, 0.05) !important; color: #4f46e5 !important; }
            `}</style>
        </div>
    );
};

export default ClientBillingPortal;
