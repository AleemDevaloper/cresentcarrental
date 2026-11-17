
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHandHoldingHand, faBuildingColumns, faPercent, 
    faScaleUnbalanced, faPlus,
    faTimes, faClockRotateLeft, 
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const LoanManagement = ({ isDark }) => {
    const [showApplyModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({ activeLoans: 0, totalOutstanding: 0, monthlyLiability: 0, upcomingEmis: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getTabData('loan');
                const d = res.data?.data || {};
                setStats(d.stats || { activeLoans: 0, totalOutstanding: 0, monthlyLiability: 0, upcomingEmis: 0 });
            } catch (error) {
                console.error("Failed to fetch loan stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const loans = [
        { id: 'LOAN-2026-001', institution: 'Global Commerce Bank', type: 'Working Capital', principal: '$1,000,000', interest: '6.5%', tenure: '60 Months', balance: '$820,000', status: 'Active', nextPayment: '2026-06-15' },
        { id: 'LOAN-2026-002', institution: 'City FinCorp', type: 'Equipment Lease', principal: '$150,000', interest: '8.2%', tenure: '36 Months', balance: '$45,000', status: 'Repaying', nextPayment: '2026-06-20' },
        { id: 'LOAN-2026-003', institution: 'SME Relief Fund', type: 'Grant-Linked', principal: '$50,000', interest: '4.0%', tenure: '24 Months', balance: '$12,500', status: 'Near Closure', nextPayment: '2026-07-01' },
    ];


    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header Stats */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-danger p-3 text-white shadow-danger">
                                <FontAwesomeIcon icon={faBuildingColumns} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Corporate Loan Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Debt Portfolios, Interest Benchmarking & Repayment Plans</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border shadow-sm">
                                <FontAwesomeIcon icon={faClockRotateLeft} className="me-2" /> HISTORY
                            </button>
                            <button className="btn btn-danger rounded-pill px-4 fw-black x-small shadow-sm" onClick={() => setShowAddModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> APPLY FOR NEW LOAN
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="p-4 rounded-5 bg-dark text-white shadow-lg h-100 position-relative overflow-hidden">
                                <div className="position-absolute bottom-0 end-0 p-3 opacity-10">
                                    <FontAwesomeIcon icon={faScaleUnbalanced} style={{ fontSize: '100px' }} />
                                </div>
                                <h6 className="uppercase fw-black x-small ls-wide opacity-50 mb-3">Total Debt Exposure</h6>
                                <h1 className="fw-black mb-1">$877,500</h1>
                                <p className="x-small fw-bold text-danger">WACD: 6.85% (Weighted Avg Cost of Debt)</p>
                            </div>
                        </div>
                        {[
                            { l: 'Total Principal', v: '$1.20M', i: faHandHoldingHand, c: '#4f46e5' },
                            { l: 'Interest Paid (YTD)', v: '$42.8K', i: faPercent, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-lg-4">
                                <div className={`p-4 rounded-5 ${isDark ? 'bg-dark-alt border-white border-opacity-5' : 'bg-light border'} h-100`}>
                                    <div className="rounded-circle bg-white shadow-sm p-3 d-inline-flex align-items-center justify-content-center mb-3 border">
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} />
                                    </div>
                                    <h6 className="uppercase fw-black x-small ls-wide text-muted mb-2">{s.l}</h6>
                                    <h3 className="fw-black mb-0">{s.v}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loan Portfolio Table */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-0">
                        <h5 className="fw-black mb-0 text-dark">Liability Registry</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                    <tr>
                                        <th className="px-5 py-3 border-0">Financial Institution</th>
                                        <th className="py-3 border-0 text-end">Principal</th>
                                        <th className="py-3 border-0 text-center">Interest</th>
                                        <th className="py-3 border-0 text-end">Outstanding</th>
                                        <th className="py-3 border-0 text-center">Next Payment</th>
                                        <th className="px-5 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.map(loan => (
                                        <tr key={loan.id} className="border-0">
                                            <td className="px-5 py-4 border-0">
                                                <div className="fw-black small text-dark">{loan.institution}</div>
                                                <div className="text-muted x-small fw-bold">{loan.id} • {loan.type}</div>
                                            </td>
                                            <td className="border-0 text-end fw-bold small text-muted">{loan.principal}</td>
                                            <td className="border-0 text-center">
                                                <div className="badge bg-danger-subtle text-danger rounded-pill px-3 x-small fw-black">{loan.interest}</div>
                                            </td>
                                            <td className="border-0 text-end">
                                                <div className="fw-black small text-primary">{loan.balance}</div>
                                                <div className="progress mt-1 ms-auto" style={{ height: '3px', width: '80px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: '60%' }}></div>
                                                </div>
                                            </td>
                                            <td className="border-0 text-center x-small fw-black text-danger">{loan.nextPayment}</td>
                                            <td className="px-5 border-0 text-end">
                                                <button className="btn btn-xs btn-light rounded-pill px-3 fw-black x-small shadow-sm border">VIEW PLAN</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>

      <DialogBox
        show={showApplyModal}
        onClose={() => setShowAddModal(false)}
        title="Debt Application Wizard"
        size="md"
        footer={
          <div className="d-flex gap-2 w-100">
            <button className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowAddModal(false)}>CANCEL</button>
            <button className="btn btn-danger rounded-pill w-100 fw-black x-small py-3 shadow-danger text-white">SUBMIT FOR BOARD REVIEW</button>
          </div>
        }
      >
        <div className="row g-4">
          <div className="col-12">
            <label className="x-small fw-black uppercase text-muted mb-2">Target Institution</label>
            <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. JPMorgan Chase" />
          </div>
          <div className="col-md-6">
            <label className="x-small fw-black uppercase text-muted mb-2">Requested Amount ($)</label>
            <input type="number" className="form-control rounded-pill x-small fw-bold border-2" />
          </div>
          <div className="col-md-6">
            <label className="x-small fw-black uppercase text-muted mb-2">Preferred Tenure (Mo)</label>
            <input type="number" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. 36" />
          </div>
          <div className="col-12">
            <label className="x-small fw-black uppercase text-muted mb-2">Purpose of Loan</label>
            <textarea className="form-control rounded-4 x-small fw-bold border-2" rows="3" placeholder="Describe the business need..."></textarea>
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
                .shadow-danger { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4); }
            `}</style>
        </div>
    );
};

export default LoanManagement;
