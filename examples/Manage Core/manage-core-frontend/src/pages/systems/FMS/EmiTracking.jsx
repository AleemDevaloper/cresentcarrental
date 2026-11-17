
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCalendarDays, faClock, faMoneyBillWave, faArrowRight,
    faCircleCheck, faBell, faTriangleExclamation, faFileInvoice,
    faSearch, faCheckCircle, faPlus, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const EmiTracking = ({ isDark }) => {
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedEmi, setSelectedEmi] = useState(null);
    const [stats, setStats] = useState({ activeLoans: 0, totalOutstanding: 0, monthlyLiability: 0, upcomingEmis: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getTabData('emi');
                const d = res.data?.data || {};
                setStats(d.stats || { activeLoans: 0, totalOutstanding: 0, monthlyLiability: 0, upcomingEmis: 0 });
            } catch (error) {
                console.error("Failed to fetch EMI stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const upcomingEmis = [
        { id: 'EMI-901', loanId: 'LOAN-001', amount: '$12,450', dueDate: '2026-06-15', daysLeft: '7 Days', status: 'Pending', bank: 'Global Bank' },
        { id: 'EMI-902', loanId: 'LOAN-002', amount: '$3,800', dueDate: '2026-06-20', daysLeft: '12 Days', status: 'Upcoming', bank: 'City FinCorp' },
        { id: 'EMI-903', loanId: 'LOAN-004', amount: '$25,000', dueDate: '2026-07-01', daysLeft: '23 Days', status: 'Scheduled', bank: 'HSBC' },
    ];

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-primary p-3 text-white shadow-primary">
                                <FontAwesomeIcon icon={faCalendarDays} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">EMI Repayment Tracking</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Upcoming Obligations, Payment History & Liquidity Planning</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-end">
                                <div className="x-small fw-black text-muted uppercase">Next Liquidity Drain</div>
                                <div className="fw-black text-danger">June 15, 2026</div>
                            </div>
                            <button className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <FontAwesomeIcon icon={faBell} />
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded-4 bg-primary text-white shadow-primary text-center h-100 d-flex flex-column justify-content-center">
                                <h6 className="uppercase fw-black x-small ls-wide opacity-75 mb-3">Monthly Liability</h6>
                                <h2 className="fw-black mb-0">${(stats.monthlyLiability / 1000).toFixed(1)}K</h2>
                            </div>
                        </div>
                        {[
                            { l: 'Upcoming EMIs', v: stats.upcomingEmis, i: faCheckCircle, c: '#10b981' },
                            { l: 'Active Loans', v: stats.activeLoans, i: faClock, c: '#f59e0b' },
                            { l: 'Total Outstanding', v: `$${(stats.totalOutstanding / 1000000).toFixed(1)}M`, i: faFileInvoice, c: '#6366f1' },
                        ].map((s, i) => (
                            <div key={i} className="col-lg-3 col-md-6">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100 text-center`}>
                                    <FontAwesomeIcon icon={s.i} className="fs-4 mb-3" style={{ color: s.c }} />
                                    <h6 className="uppercase fw-black x-small ls-wide text-muted mb-2">{s.l}</h6>
                                    <h4 className="fw-black mb-0">{s.v}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Upcoming EMI Pipeline</h5>
                            <span className="badge bg-danger-subtle text-danger rounded-pill px-3 x-small fw-black">CRITICAL ACTION</span>
                        </div>
                        <button className="btn btn-xs btn-light rounded-pill px-3 fw-black x-small border shadow-sm">
                            <FontAwesomeIcon icon={faHistory} className="me-2" /> PAYMENT LOGS
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">EMI Reference</th>
                                    <th className="py-3 border-0">Institution</th>
                                    <th className="py-3 border-0 text-end">Amount Due</th>
                                    <th className="py-3 border-0 text-center">Due Date</th>
                                    <th className="py-3 border-0 text-center">Status</th>
                                    <th className="px-5 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingEmis.map(emi => (
                                    <tr key={emi.id} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="fw-black small text-primary">{emi.id}</div>
                                            <div className="text-muted x-small fw-bold">Installment for {emi.loanId}</div>
                                        </td>
                                        <td className="border-0 fw-bold small text-muted uppercase">{emi.bank}</td>
                                        <td className="border-0 text-end fw-black small text-danger">{emi.amount}</td>
                                        <td className="border-0 text-center">
                                            <div className="fw-black small">{emi.dueDate}</div>
                                            <div className="x-small fw-bold text-warning">{emi.daysLeft} left</div>
                                        </td>
                                        <td className="border-0 text-center">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${emi.status === 'Pending' ? 'bg-warning text-white' : 'bg-info text-white'}`}>
                                                {emi.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 border-0 text-end">
                                            <button className="btn btn-sm btn-dark rounded-pill x-small fw-black px-4 shadow-sm" onClick={() => { setSelectedEmi(emi); setShowPayModal(true); }}>
                                                PAY NOW
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
                show={showPayModal}
                onClose={() => setShowPayModal(false)}
                title="Authorize EMI Payment"
                size="md"
                footer={
                    <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold small shadow-primary">COMPLETE WIRE TRANSFER</button>
                }
            >
                <div className="p-4 rounded-4 bg-light border mb-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="x-small fw-black text-muted uppercase">Amount to Remit</span>
                        <span className="fw-black h4 mb-0 text-danger">{selectedEmi?.amount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span className="x-small fw-black text-muted uppercase">Beneficiary</span>
                        <span className="small fw-black">{selectedEmi?.bank}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="x-small fw-black uppercase text-muted mb-2">Select Source Account</label>
                    <select className="form-select rounded-pill x-small fw-bold border-2">
                        <option>Main Operating Account (..9012)</option>
                        <option>Payroll Reserve (..5541)</option>
                        <option>Petty Cash Fund (..2210)</option>
                    </select>
                </div>
                <div className="p-3 rounded-4 bg-warning bg-opacity-10 border border-warning border-opacity-25 d-flex gap-3 align-items-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning" />
                    <p className="x-small fw-bold mb-0">Ensure sufficient funds are available to avoid bounce penalties.</p>
                </div>
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

export default EmiTracking;
