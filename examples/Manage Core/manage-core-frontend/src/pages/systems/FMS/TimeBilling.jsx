import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, faFileInvoice, faHourglassHalf, faCalendarCheck, faMoneyBillWave,
    faUserClock, faPlus, faTimes, faSearch, faFilter, faArrowRight,
    faReceipt, faStopwatch, faCalendarDay
} from '@fortawesome/free-solid-svg-icons';

const TimeBilling = ({ isDark }) => {
    const [showModal, setShowModal] = useState(false);

    const [billings, setBillings] = useState([]);
    useEffect(() => { getTabData('time-billing').then(res => setBillings(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                {/* Header */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-indigo p-3 text-white shadow-indigo" style={{ backgroundColor: '#6366f1' }}>
                                <FontAwesomeIcon icon={faUserClock} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Time & Billing Management</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Professional Services Automation & Hourly Tracking</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-indigo rounded-pill px-4 fw-black x-small shadow-sm text-white" style={{ backgroundColor: '#6366f1' }} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> SUBMIT TIMESHEET
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Billable Hours (MTD)', v: '1,240 hrs', i: faClock, c: '#6366f1' },
                            { l: 'Pending Revenue', v: '$185.5K', i: faMoneyBillWave, c: '#10b981' },
                            { l: 'Utilization Rate', v: '88.4%', i: faHourglassHalf, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100 d-flex align-items-center gap-4`}>
                                    <div className="rounded-4 p-3 bg-white shadow-sm">
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} className="fs-5" />
                                    </div>
                                    <div>
                                        <div className="text-muted x-small fw-bold uppercase ls-wide mb-1">{s.l}</div>
                                        <h4 className="fw-black mb-0" style={{ color: s.c }}>{s.v}</h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timesheet Registry */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="fw-black mb-0">Billing Ledger</h5>
                            <span className="badge rounded-pill bg-indigo-subtle text-indigo x-small fw-black px-3">HOURLY & MILESTONE</span>
                        </div>
                        <div className="d-flex gap-3">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '250px' }}>
                                <span className="input-group-text bg-transparent border-0 ps-3">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search resources..." />
                            </div>
                            <button className="btn btn-xs btn-light rounded-circle border"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-5 py-3 border-0">Resource & Activity</th>
                                    <th className="py-3 border-0">Duration</th>
                                    <th className="py-3 border-0">Service Rate</th>
                                    <th className="py-3 border-0 text-center">Total Charge</th>
                                    <th className="px-5 py-3 border-0 text-end">Billing Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billings.map((b, i) => (
                                    <tr key={i} className="border-0">
                                        <td className="px-5 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="rounded-circle p-2 bg-indigo bg-opacity-10 text-indigo">
                                                    <FontAwesomeIcon icon={faCalendarCheck} />
                                                </div>
                                                <div>
                                                    <div className="fw-black small">{b.resource}</div>
                                                    <div className="text-muted x-small fw-bold uppercase ls-wide">{b.project}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <div className="d-flex align-items-center gap-2">
                                                <FontAwesomeIcon icon={faStopwatch} className="text-muted x-small" />
                                                <span className="x-small fw-black text-muted">{b.hours} HRS</span>
                                            </div>
                                        </td>
                                        <td className="border-0">
                                            <span className="x-small fw-bold text-muted">{b.rate}</span>
                                        </td>
                                        <td className="border-0 text-center fw-black small text-indigo">{b.total}</td>
                                        <td className="px-5 border-0 text-end">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                b.status === 'Invoiced' ? 'bg-success text-white' : 
                                                b.status === 'Approved' ? 'bg-indigo text-white' : 'bg-light border text-dark'
                                            }`}>{b.status.toUpperCase()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <DialogBox
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Time Entry Submission"
                size="md"
            >
                <form className="row g-4">
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Resource Name</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Alex Rivera" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Date of Service</label>
                        <input type="date" className="form-control rounded-pill x-small fw-bold border-2" />
                    </div>
                    <div className="col-md-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Project / Milestone</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Frontend Redesign</option>
                            <option>API Integration</option>
                            <option>Cloud Migration</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Duration (Hours)</label>
                        <input type="number" step="0.5" className="form-control rounded-pill x-small fw-bold border-2" placeholder="0.0" />
                    </div>
                    <div className="col-md-6">
                        <label className="x-small fw-black uppercase text-muted mb-2">Service Category</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Consulting</option>
                            <option>Development</option>
                            <option>Design</option>
                            <option>Management</option>
                        </select>
                    </div>
                    <div className="col-12 mt-5">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowModal(false)}>DISCARD</button>
                            <button type="button" className="btn btn-indigo rounded-pill w-100 fw-black x-small py-3 shadow-indigo text-white" style={{ backgroundColor: '#6366f1' }}>POST TIME ENTRY</button>
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
                .shadow-indigo { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
            `}</style>
        </div>
    );
};

export default TimeBilling;
