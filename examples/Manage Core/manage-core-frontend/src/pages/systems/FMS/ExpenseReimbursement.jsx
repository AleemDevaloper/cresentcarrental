
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faWallet, faClock, 
     faPlane, faUtensils, faCar, 
     faLaptop, 
     faFileInvoiceDollar, 
    faCloudUploadAlt,
     faMicrochip, 
    faShieldAlt, faGlobe, 
    faExclamationTriangle, faFileExport, faChevronRight,
     faArrowUp,
    faArrowDown, faCalendarAlt, faBuilding, 
     faStamp, faCalculator, faHandHoldingUsd,
    faSync,  faFingerprint, faSignature,
    faBolt, 
    faImages, faTable, faList, faHistory, faSearch, faFilter,
    faEye, faCheckCircle, faTimesCircle, faExclamationCircle,
    faPlus, faTrash, faCopy, faLink, faFileInvoice,
    faStore, faDollarSign, faTag, faChartLine, faFolderOpen,
    faLock, faCloud, faCamera, faProjectDiagram, faSitemap,
    faFlag, faUserShield, faFileSignature, faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpenseReimbursement = ({ isDark }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

    // --- HIGH-FIDELITY ENTERPRISE DATA ---
    const [kpis, setKpis] = useState([]);
    useEffect(() => { getTabData('expense-reimbursement').then(res => setKpis(res.data?.data || [])).catch(() => {}); }, []);

    const [categories, setCategories] = useState([]);
    useEffect(() => { getTabData('expense-reimbursement').then(res => setCategories(res.data?.data || [])).catch(() => {}); }, []);

    const [claims, setClaims] = useState([]);
    useEffect(() => { getTabData('expense-reimbursement').then(res => setClaims(res.data?.data || [])).catch(() => {}); }, []);

    // --- CHART CONFIGS (Executive Grade) ---
    const [financialPulseData, setFinancialPulseData] = useState({});
    useEffect(() => { getTabData('expense-reimbursement').then(res => setFinancialPulseData(res.data?.data || {})).catch(() => {}); }, []);

    // --- RECEIPT DATA (used in Receipt Module) ---
    const [receiptKpis, setReceiptKpis] = useState([]);
    useEffect(() => { getTabData('expense-reimbursement').then(res => setReceiptKpis(res.data?.data || [])).catch(() => {}); }, []);

    const [receiptLibrary, setReceiptLibrary] = useState([]);
    useEffect(() => { getTabData('expense-reimbursement').then(res => setReceiptLibrary(res.data?.data || [])).catch(() => {}); }, []);

    const [receiptStatusColors, setReceiptStatusColors] = useState({});
    useEffect(() => { getTabData('expense-reimbursement').then(res => setReceiptStatusColors(res.data?.data || {})).catch(() => {}); }, []);

    const doughnutOptions = {
        cutout: '75%',
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    // --- INTERACTIVE LOGIC ---
    const triggerScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
        }, 2500);
    };

    const renderOverview = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* KPI STRIP */}
            <div className="row g-4 mb-4">
                {kpis.map((kpi, i) => (
                    <div key={i} className="col-12 col-md-4 col-xl-2">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className={`card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}
                        >
                            <div className="card-body p-4 position-relative z-1">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '40px', height: '40px', background: `${kpi.color}15`, color: kpi.color }}>
                                        <FontAwesomeIcon icon={kpi.icon} className="small" />
                                    </div>
                                    <div className={`x-small fw-black d-flex align-items-center gap-1 ${kpi.trend === 'up' ? (i === 4 ? 'text-danger' : 'text-success') : 'text-info'}`}>
                                        <FontAwesomeIcon icon={kpi.trend === 'up' ? faArrowUp : faArrowDown} />
                                        {kpi.delta}
                                    </div>
                                </div>
                                <h3 className={`fw-black mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>{kpi.value}</h3>
                                <p className="text-muted x-small fw-bold text-uppercase mb-0 ls-wide opacity-75">{kpi.label}</p>
                            </div>
                            <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '3px', background: `linear-gradient(90deg, ${kpi.color}00, ${kpi.color}, ${kpi.color}00)` }}></div>
                        </motion.div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* PRIMARY ANALYTICS */}
                <div className="col-xl-8">
                    <div className={`card border-0 shadow-sm rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`} style={{ border: '1px solid' }}>
                        <div className="card-header bg-transparent border-0 p-5 pb-0 d-flex justify-content-between align-items-end">
                            <div>
                                <h4 className="fw-black mb-1">Financial Settlement Pulse</h4>
                                <p className="text-muted small fw-bold mb-0">REAL-TIME REIMBURSEMENT VELOCITY TRACKING</p>
                            </div>
                            <div className="d-flex gap-2">
                                <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-black x-small">LIVE SYSTEM</div>
                            </div>
                        </div>
                        <div className="card-body p-5 pt-4" style={{ height: '400px' }}>
                            <Line data={financialPulseData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } } } }} />
                        </div>
                    </div>

                    {/* ACTIVE LEDGER */}
                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                        <div className="card-header bg-transparent border-0 p-5 pb-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-black mb-0">Active Claim Ledger</h5>
                            <div className="d-flex gap-3">
                                <button className="btn btn-sm btn-light rounded-pill px-4 fw-black x-small">FILTER REPOSITORY</button>
                                <button className="btn btn-sm btn-primary rounded-pill px-4 fw-black x-small">BULK DISBURSE</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className={`x-small fw-black ${isDark ? 'bg-white bg-opacity-5 text-white-50' : 'bg-light text-muted'}`}>
                                        <tr>
                                            <th className="px-5 py-3 border-0">IDENTIFIER</th>
                                            <th className="py-3 border-0">BENEFICIARY</th>
                                            <th className="py-3 border-0 text-end">GROSS SETTLEMENT</th>
                                            <th className="py-3 border-0 text-center">INTEGRITY</th>
                                            <th className="py-3 border-0 text-center">LIFECYCLE</th>
                                            <th className="py-3 border-0 text-end px-5">ORCHESTRATION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {claims.map((claim) => (
                                            <tr key={claim.id} className="border-0 cursor-pointer transition-all hover-bg-opacity">
                                                <td className="px-5 border-0">
                                                    <div className="fw-black text-primary small">{claim.id}</div>
                                                    <div className="text-muted x-small fw-bold">{claim.date} 2026</div>
                                                </td>
                                                <td className="border-0">
                                                    <div className="fw-bold small">{claim.user}</div>
                                                    <div className="text-muted x-small fw-bold opacity-75">{claim.dept}</div>
                                                </td>
                                                <td className="text-end border-0">
                                                    <div className="fw-black small">{claim.amt}</div>
                                                    <div className="text-muted x-small fw-bold">USD BASE</div>
                                                </td>
                                                <td className="text-center border-0">
                                                    <div className={`badge rounded-pill px-2 py-1 x-small fw-black ${claim.risk === 'Low' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                        {claim.risk.toUpperCase()} RISK
                                                    </div>
                                                </td>
                                                <td className="text-center border-0">
                                                    <span className={`badge rounded-pill px-3 py-1 fw-black x-small`} style={{ 
                                                        background: claim.status === 'Paid' || claim.status === 'Approved' ? '#10b98115' : (claim.status === 'Flagged' ? '#ef444415' : '#f59e0b15'),
                                                        color: claim.status === 'Paid' || claim.status === 'Approved' ? '#10b981' : (claim.status === 'Flagged' ? '#ef4444' : '#f59e0b'),
                                                    }}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="text-end px-5 border-0">
                                                    <button className="btn btn-xs rounded-circle bg-primary bg-opacity-10 text-primary border-0"><FontAwesomeIcon icon={faChevronRight} className="x-small" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INTELLIGENCE SIDEBAR */}
                <div className="col-xl-4">
                    <div className={`card border-0 shadow-sm rounded-5 mb-4 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                        <div className="card-body p-5">
                            <h6 className="fw-black mb-4 d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                                Policy Compliance Engine
                            </h6>
                            <div className="space-y-4">
                                {categories.slice(0, 4).map((cat, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="x-small fw-black opacity-75">{cat.name.toUpperCase()}</span>
                                            <span className="x-small fw-black text-primary">{Math.round((cat.spent / cat.limit) * 100)}% UTILIZED</span>
                                        </div>
                                        <div className="progress rounded-pill shadow-inner" style={{ height: '6px' }}>
                                            <div className="progress-bar rounded-pill" style={{ width: `${(cat.spent / cat.limit) * 100}%`, background: cat.color }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                                <div className="d-flex gap-3">
                                    <div className="text-primary mt-1"><FontAwesomeIcon icon={faMicrochip} /></div>
                                    <div>
                                        <div className="fw-black x-small mb-1">AI INSIGHT</div>
                                        <p className="text-muted x-small fw-bold mb-0">Engineering spend is projected to exceed budget by 14% this quarter.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden ${isDark ? 'bg-dark-card border-info border-opacity-20' : 'bg-white border-info border-opacity-10'}`} style={{ border: '1px solid' }}>
                        <div className="card-body p-5">
                            <div className="d-flex align-items-center justify-content-between mb-5">
                                <h6 className="fw-black mb-0">Audit Action Center</h6>
                                <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 x-small fw-black">8 PENDING</span>
                            </div>
                            {[
                                { title: 'DUPLICATE DETECTED', desc: 'Identical vendor invoice in EXP-90452', type: 'danger' },
                                { title: 'POLICY VARIANCE', desc: 'Travel booking exceeds standard per-diem', type: 'warning' },
                                { title: 'MANDATORY DOCUMENT', desc: 'Missing VAT certification for FMS-2026', type: 'info' },
                            ].map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-4 mb-3 d-flex gap-4 align-items-start transition-all hover-lift ${isDark ? 'bg-white bg-opacity-5' : 'bg-light'}`}>
                                    <div className={`text-${item.type} mt-1`}><FontAwesomeIcon icon={faExclamationTriangle} /></div>
                                    <div>
                                        <div className="fw-black x-small mb-1">{item.title}</div>
                                        <p className="text-muted x-small fw-bold mb-3 opacity-75">{item.desc}</p>
                                        <button className={`btn btn-xs rounded-pill px-4 fw-black bg-${item.type} text-white border-0`}>RESOLVE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderSubmission = () => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="row g-4 justify-content-center">
            <div className="col-xl-11">
                <div className={`card border-0 shadow-3xl rounded-5 overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}>
                    <div className="row g-0">
                        {/* FORM CORE */}
                        <div className="col-lg-8 p-5 p-xl-5">
                            <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom">
                                <div className="rounded-4 bg-primary p-3 shadow-2xl text-white">
                                    <FontAwesomeIcon icon={faSignature} className="fs-4" />
                                </div>
                                <div>
                                    <h3 className="fw-black mb-1">Initiate Disbursement Request</h3>
                                    <p className="text-muted x-small fw-bold mb-0 opacity-75">ORCHESTRATING ENTERPRISE FINANCIAL WORKFLOWS v4.2</p>
                                </div>
                            </div>

                            <form className="row g-5">
                                <div className="col-12">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Transaction Narrative</label>
                                    <input type="text" className={`form-control form-control-lg rounded-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`} placeholder="Provide an executive summary of the expense purpose..." />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Policy Category</label>
                                    <select className={`form-select form-select-lg rounded-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`}>
                                        {categories.map(c => <option key={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Incurred Timestamp</label>
                                    <input type="date" className={`form-control form-control-lg rounded-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Gross Amount</label>
                                    <div className="input-group">
                                        <span className={`input-group-text border-0 ps-4 ${isDark ? 'bg-white bg-opacity-5 text-white-50' : 'bg-light'}`}>$</span>
                                        <input type="number" className={`form-control form-control-lg rounded-end-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`} placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Target Currency</label>
                                    <select className={`form-select form-select-lg rounded-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`}>
                                        <option>USD - United States Dollar</option>
                                        <option>EUR - European Euro</option>
                                        <option>GBP - British Pound</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label x-small fw-black text-uppercase text-muted ls-wide">Settlement Method</label>
                                    <select className={`form-select form-select-lg rounded-4 border-0 p-4 shadow-inner-soft ${isDark ? 'bg-white bg-opacity-5 text-white' : 'bg-light text-dark'}`}>
                                        <option>Personal Expenditure</option>
                                        <option>Corporate Card</option>
                                        <option>Petty Cash Reserve</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-5 pt-4">
                                    <button className="btn btn-primary w-100 rounded-pill py-4 fw-black shadow-3xl d-flex align-items-center justify-content-center gap-3 transition-all hover-lift-lg" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none', letterSpacing: '0.1em' }}>
                                        <FontAwesomeIcon icon={faFingerprint} className="fs-4" />
                                        AUTHENTICATE & SUBMIT CLAIM
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* OCR SIDE-WIDGET */}
                        <div className={`col-lg-4 p-5 ${isDark ? 'bg-white bg-opacity-5' : 'bg-light bg-opacity-50'}`} style={{ borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                            <div className="h-100 d-flex flex-column">
                                <h5 className="fw-black mb-5">Substantiation Engine</h5>
                                
                                <div onClick={triggerScan} className={`flex-grow-1 p-5 border-2 border-dashed rounded-5 text-center d-flex flex-column align-items-center justify-content-center cursor-pointer transition-all mb-5 group ${isScanning ? 'border-primary border-opacity-100 bg-primary bg-opacity-5' : 'border-primary border-opacity-20 hover-bg-white'}`}>
                                    <AnimatePresence mode="wait">
                                        {isScanning ? (
                                            <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <FontAwesomeIcon icon={faMicrochip} size="4x" className="text-primary mb-4 animate-spin-slow" />
                                                <h6 className="fw-black text-primary">SCANNING NEURAL NET...</h6>
                                                <p className="text-muted x-small fw-bold">EXTRACTING METADATA</p>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-4 mb-4 transition-all group-hover-scale">
                                                    <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" />
                                                </div>
                                                <h6 className="fw-black mb-2">Deploy Evidence</h6>
                                                <p className="text-muted x-small fw-bold px-4 uppercase opacity-50">HEIC, PDF, JPG RECOGNIZED (MAX 25MB)</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className={`card border-0 shadow-lg rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                                    <div className="card-body p-4 pt-5">
                                        <div className="d-flex align-items-center gap-3 mb-5 pb-4 border-bottom border-opacity-10">
                                            <div className="rounded-3 bg-success bg-opacity-10 text-success p-2 px-3 fw-black small">99.2% MATCH</div>
                                            <div className="x-small fw-black text-muted uppercase ls-wide">AI VISION OUTPUT</div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-5">
                                            {[
                                                { k: 'MERCHANT', v: scanComplete ? 'Marriott International' : '---', i: faBuilding },
                                                { k: 'AMOUNT', v: scanComplete ? '$450.00' : '---', i: faCalculator },
                                                { k: 'TIMESTAMP', v: scanComplete ? 'Jun 05, 2026' : '---', i: faCalendarAlt },
                                            ].map((item, idx) => (
                                                <div key={idx} className="d-flex align-items-center justify-content-between mb-3 p-3 rounded-4 bg-white bg-opacity-5 border border-opacity-10">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <FontAwesomeIcon icon={item.i} className="text-muted x-small" />
                                                        <span className="x-small fw-black text-muted opacity-50">{item.k}</span>
                                                    </div>
                                                    <span className="small fw-black text-primary">{item.v}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button disabled={!scanComplete} className="btn btn-outline-info w-100 rounded-pill py-3 fw-black x-small shadow-sm transition-all hover-lift">SYNCHRONIZE TO LEDGER</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderReceiptModule = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-5">
            {/* KPI OVERVIEW */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className={`p-4 rounded-5 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm'}`} style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h4 className="fw-black mb-1">Receipt Governance Dashboard</h4>
                                <p className="text-muted x-small fw-bold mb-0 uppercase ls-wide">Enterprise Receipt Upload & Management Module v4.2</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-xs rounded-pill px-3 bg-primary bg-opacity-10 text-primary fw-black border-0">AUDIT LOGS</button>
                                <button className="btn btn-xs rounded-pill px-3 bg-info bg-opacity-10 text-info fw-black border-0">POLICY GUIDE</button>
                            </div>
                        </div>
                        <div className="row g-4">
                            {receiptKpis.map((kpi, i) => (
                                <div key={i} className="col-6 col-md-4 col-xl-2">
                                    <div className="text-center p-3 rounded-4 bg-light bg-opacity-50">
                                        <div className="mb-2" style={{ color: kpi.color }}>
                                            <FontAwesomeIcon icon={kpi.icon} className="fs-4" />
                                        </div>
                                        <h4 className="fw-black mb-1">{kpi.value}</h4>
                                        <div className="text-muted x-small fw-bold uppercase opacity-75">{kpi.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* UPLOAD CENTER */}
                <div className="col-xl-4">
                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                        <div className="card-body p-5">
                            <div className="d-flex align-items-center gap-3 mb-5">
                                <div className="rounded-4 bg-primary bg-opacity-10 text-primary p-3">
                                    <FontAwesomeIcon icon={faCloudUploadAlt} className="fs-4" />
                                </div>
                                <div>
                                    <h5 className="fw-black mb-0">Upload Center</h5>
                                    <p className="text-muted x-small fw-bold mb-0">SMART OCR QUEUE</p>
                                </div>
                            </div>

                            <div 
                                className={`upload-zone rounded-5 border-2 border-dashed p-5 text-center cursor-pointer transition-all mb-4 ${isUploading ? 'border-primary bg-primary bg-opacity-5' : 'border-primary border-opacity-20 hover-bg-light'}`}
                                onClick={() => setIsUploading(!isUploading)}
                            >
                                <div className="mb-4">
                                    <FontAwesomeIcon icon={isUploading ? faSync : faCloudUploadAlt} size="3x" className={`text-primary ${isUploading ? 'animate-spin-slow' : 'opacity-25'}`} />
                                </div>
                                <h6 className="fw-black mb-2">{isUploading ? 'PROCESSING OCR...' : 'Drop Enterprise Documents'}</h6>
                                <p className="text-muted x-small fw-bold uppercase px-3 opacity-50">JPG, PNG, PDF, HEIC SUPPORTED (MAX 50MB per file)</p>
                                {!isUploading && (
                                    <button className="btn btn-sm btn-primary rounded-pill px-4 mt-3 fw-black x-small shadow-sm">BROWSE REPOSITORY</button>
                                )}
                            </div>

                            <div className="d-flex gap-2 mb-5">
                                <button className="btn btn-outline-light border-dark border-opacity-10 text-dark flex-grow-1 rounded-pill py-3 x-small fw-black d-flex align-items-center justify-content-center gap-2">
                                    <FontAwesomeIcon icon={faCamera} /> CAMERA
                                </button>
                                <button className="btn btn-outline-light border-dark border-opacity-10 text-dark flex-grow-1 rounded-pill py-3 x-small fw-black d-flex align-items-center justify-content-center gap-2">
                                    <FontAwesomeIcon icon={faCopy} /> BULK
                                </button>
                            </div>

                            <div className="p-4 rounded-4 bg-info bg-opacity-5 border border-info border-opacity-10">
                                <div className="d-flex gap-3 mb-3">
                                    <div className="text-info"><FontAwesomeIcon icon={faLightbulb} /></div>
                                    <div className="fw-black x-small uppercase">Smart Insights</div>
                                </div>
                                <ul className="list-unstyled mb-0 space-y-2">
                                    <li className="text-muted x-small fw-bold d-flex align-items-start gap-2">
                                        <div className="mt-1 rounded-circle bg-info p-1" style={{ width: '4px', height: '4px' }}></div>
                                        Travel expenses increased by 18% this month.
                                    </li>
                                    <li className="text-muted x-small fw-bold d-flex align-items-start gap-2">
                                        <div className="mt-1 rounded-circle bg-info p-1" style={{ width: '4px', height: '4px' }}></div>
                                        Duplicate receipt submissions detected (+5%).
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECEIPT LIBRARY */}
                <div className="col-xl-8">
                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                        <div className="card-header bg-transparent border-0 p-5 pb-3">
                            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                                <h5 className="fw-black mb-0">Receipt Library & Archive</h5>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="input-group input-group-sm rounded-pill overflow-hidden bg-light border-0 shadow-inner-soft px-3 py-1" style={{ maxWidth: '300px' }}>
                                        <span className="input-group-text bg-transparent border-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                                        <input 
                                            type="text" 
                                            className="form-control bg-transparent border-0 x-small fw-bold" 
                                            placeholder="Search by vendor, ID, or amount..." 
                                            value={receiptSearch}
                                            onChange={(e) => setReceiptSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="btn-group rounded-pill overflow-hidden shadow-sm">
                                        <button onClick={() => setReceiptViewMode('grid')} className={`btn btn-xs ${receiptViewMode === 'grid' ? 'btn-primary' : 'btn-light border-0'}`}><FontAwesomeIcon icon={faImages} /></button>
                                        <button onClick={() => setReceiptViewMode('table')} className={`btn btn-xs ${receiptViewMode === 'table' ? 'btn-primary' : 'btn-light border-0'}`}><FontAwesomeIcon icon={faTable} /></button>
                                        <button onClick={() => setReceiptViewMode('list')} className={`btn btn-xs ${receiptViewMode === 'list' ? 'btn-primary' : 'btn-light border-0'}`}><FontAwesomeIcon icon={faList} /></button>
                                    </div>
                                    <button className="btn btn-xs btn-light rounded-circle shadow-sm"><FontAwesomeIcon icon={faFilter} /></button>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-5 pt-0">
                            {receiptViewMode === 'grid' ? (
                                <div className="row g-4 mt-2">
                                    {receiptLibrary.map((rec) => (
                                        <div key={rec.id} className="col-12 col-md-6 col-xxl-4">
                                            <motion.div 
                                                whileHover={{ y: -5 }}
                                                onClick={() => setSelectedReceipt(rec)}
                                                className={`p-0 rounded-4 border overflow-hidden cursor-pointer transition-all ${isDark ? 'border-white border-opacity-10 bg-white bg-opacity-5' : 'bg-white border-light shadow-hover'}`}
                                            >
                                                <div className="position-relative bg-light p-5 text-center overflow-hidden" style={{ height: '140px' }}>
                                                    <FontAwesomeIcon icon={faFileInvoice} className="text-primary opacity-25 fs-1" />
                                                    <div className="position-absolute top-0 end-0 p-3">
                                                        <span className="badge rounded-pill x-small fw-black" style={{ 
                                                            backgroundColor: receiptStatusColors[rec.status].bg, 
                                                            color: receiptStatusColors[rec.status].text 
                                                        }}>{rec.status.toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <div className="fw-black small mb-1">{rec.vendor}</div>
                                                            <div className="text-muted x-small fw-bold uppercase opacity-50">{rec.id}</div>
                                                        </div>
                                                        <div className="fw-black text-primary">{rec.amt}</div>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <FontAwesomeIcon icon={faTag} className="x-small text-muted opacity-50" />
                                                        <span className="x-small fw-black text-muted opacity-75">{rec.cat}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-opacity-10">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center x-small" style={{ width: '20px', height: '20px' }}>
                                                                {rec.uploader.charAt(0)}
                                                            </div>
                                                            <span className="x-small fw-bold text-muted opacity-75">{rec.date}</span>
                                                        </div>
                                                        <FontAwesomeIcon icon={faChevronRight} className="x-small text-muted" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    ))}
                                    <div className="col-12 col-md-6 col-xxl-4">
                                        <div className="h-100 rounded-4 border-2 border-dashed border-primary border-opacity-20 d-flex flex-column align-items-center justify-content-center p-5 text-center opacity-50 hover-opacity-100 cursor-pointer transition-all">
                                            <FontAwesomeIcon icon={faPlus} className="text-primary mb-3 fs-3" />
                                            <div className="fw-black x-small uppercase">Upload More</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive mt-3">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="x-small fw-black uppercase text-muted ls-wide">
                                            <tr>
                                                <th className="pb-4 border-0">Identifier</th>
                                                <th className="pb-4 border-0">Vendor</th>
                                                <th className="pb-4 border-0">Amount</th>
                                                <th className="pb-4 border-0">Category</th>
                                                <th className="pb-4 border-0">Status</th>
                                                <th className="pb-4 border-0 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-0">
                                            {receiptLibrary.map((rec) => (
                                                <tr key={rec.id} className="border-0 cursor-pointer">
                                                    <td className="py-3 border-0">
                                                        <div className="fw-black small text-primary">{rec.id}</div>
                                                        <div className="text-muted x-small fw-bold">{rec.date}</div>
                                                    </td>
                                                    <td className="py-3 border-0">
                                                        <div className="fw-bold small">{rec.vendor}</div>
                                                        <div className="text-muted x-small fw-bold opacity-75">{rec.dept}</div>
                                                    </td>
                                                    <td className="py-3 border-0">
                                                        <div className="fw-black small">{rec.amt}</div>
                                                        <div className="text-muted x-small fw-bold opacity-75">{rec.currency}</div>
                                                    </td>
                                                    <td className="py-3 border-0">
                                                        <span className="badge rounded-pill bg-light text-dark x-small fw-black px-3 py-2">{rec.cat.toUpperCase()}</span>
                                                    </td>
                                                    <td className="py-3 border-0">
                                                        <span className="badge rounded-pill x-small fw-black px-3 py-2" style={{ 
                                                            backgroundColor: receiptStatusColors[rec.status].bg, 
                                                            color: receiptStatusColors[rec.status].text 
                                                        }}>{rec.status.toUpperCase()}</span>
                                                    </td>
                                                    <td className="py-3 border-0 text-end">
                                                        <button className="btn btn-xs rounded-circle bg-primary bg-opacity-10 text-primary border-0"><FontAwesomeIcon icon={faEye} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ANALYTICS SECTION */}
            <div className="row g-4">
                <div className="col-xl-8">
                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`} style={{ border: '1px solid' }}>
                        <div className="card-header bg-transparent border-0 p-5 pb-0 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-black mb-1">Receipt Volume Trends</h5>
                                <p className="text-muted x-small fw-bold mb-0 uppercase ls-wide">MONTHLY SUBMISSION METRICS</p>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-black x-small border border-primary border-opacity-10">99.8% UPTIME</span>
                            </div>
                        </div>
                        <div className="card-body p-5 pt-4" style={{ height: '350px' }}>
                            <Line 
                                data={{
                                    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
                                    datasets: [{
                                        label: 'Receipt Volume',
                                        data: [1500, 1800, 1600, 2100, 1900, 1892],
                                        borderColor: '#4f46e5',
                                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                        borderWidth: 3,
                                        fill: true,
                                        tension: 0.4
                                    }]
                                }} 
                                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} 
                            />
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className={`card border-0 shadow-sm rounded-5 overflow-hidden h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`} style={{ border: '1px solid' }}>
                        <div className="card-header bg-transparent border-0 p-5 pb-0 text-center">
                            <h5 className="fw-black mb-1">OCR Accuracy</h5>
                            <p className="text-muted x-small fw-bold mb-0 uppercase ls-wide">NEURAL ENGINE PERFORMANCE</p>
                        </div>
                        <div className="card-body p-5 pt-4 d-flex flex-column align-items-center justify-content-center">
                            <div className="position-relative mb-4" style={{ width: '180px', height: '180px' }}>
                                <Doughnut 
                                    data={{
                                        labels: ['Accurate', 'Manual Review'],
                                        datasets: [{
                                            data: [98.4, 1.6],
                                            backgroundColor: ['#4f46e5', '#e2e8f0'],
                                            borderWidth: 0
                                        }]
                                    }} 
                                    options={doughnutOptions} 
                                />
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                    <h3 className="fw-black mb-0">98.4%</h3>
                                    <div className="x-small fw-bold text-muted uppercase">SCORE</div>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-4 py-2 fw-black x-small mb-3">EXECUTIVE GRADE</div>
                                <p className="text-muted x-small fw-bold px-4">OCR confidence has increased by 0.5% after the last model update.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECEIPT DETAIL MODAL (SIMULATED) */}
            <AnimatePresence>
                {selectedReceipt && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-4"
                        style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)' }}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className={`card border-0 rounded-5 overflow-hidden shadow-3xl ${isDark ? 'bg-dark-card' : 'bg-white'}`}
                            style={{ maxWidth: '1000px', width: '100%' }}
                        >
                            <div className="row g-0">
                                <div className="col-lg-6 bg-light p-5 d-flex flex-column align-items-center justify-content-center min-vh-50">
                                    <FontAwesomeIcon icon={faFileInvoice} className="text-primary opacity-10 mb-4" size="10x" />
                                    <div className="text-center">
                                        <h5 className="fw-black mb-2">RECEIPT PREVIEW</h5>
                                        <p className="text-muted x-small fw-bold uppercase opacity-50">Original Scanned Document (simulated)</p>
                                    </div>
                                    <div className="mt-5 p-4 rounded-4 bg-white shadow-sm w-75">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="x-small fw-black text-muted opacity-50 uppercase ls-wide">Integrity</span>
                                            <span className="x-small fw-black text-success">VERIFIED DOCUMENT</span>
                                        </div>
                                        <div className="progress rounded-pill" style={{ height: '4px' }}>
                                            <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 p-5">
                                    <div className="d-flex align-items-center justify-content-between mb-5">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-4 bg-primary p-3 text-white shadow-sm">
                                                <FontAwesomeIcon icon={faFileSignature} />
                                            </div>
                                            <div>
                                                <h5 className="fw-black mb-0">{selectedReceipt.id}</h5>
                                                <p className="text-muted x-small fw-bold mb-0">OCR EXTRACTED METADATA</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedReceipt(null)} className="btn btn-xs btn-light rounded-circle shadow-sm"><FontAwesomeIcon icon={faTimesCircle} /></button>
                                    </div>

                                    <div className="row g-4 mb-5">
                                        {[
                                            { k: 'Vendor', v: selectedReceipt.vendor, i: faBuilding },
                                            { k: 'Amount', v: selectedReceipt.amt, i: faDollarSign },
                                            { k: 'Tax', v: selectedReceipt.tax, i: faCalculator },
                                            { k: 'Category', v: selectedReceipt.cat, i: faTag },
                                            { k: 'Project', v: selectedReceipt.project, i: faProjectDiagram },
                                            { k: 'Status', v: selectedReceipt.status, i: faFlag },
                                        ].map((item, idx) => (
                                            <div key={idx} className="col-6">
                                                <div className="p-3 rounded-4 bg-light border border-dark border-opacity-5">
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <FontAwesomeIcon icon={item.i} className="text-muted x-small" />
                                                        <span className="x-small fw-black text-muted opacity-50 uppercase">{item.k}</span>
                                                    </div>
                                                    <div className="small fw-black text-primary">{item.v}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10 mb-5">
                                        <div className="fw-black x-small mb-3 uppercase opacity-50">Verification Actions</div>
                                        <div className="d-flex gap-3">
                                            <button className="btn btn-success flex-grow-1 rounded-pill py-3 fw-black x-small shadow-sm d-flex align-items-center justify-content-center gap-2 border-0">
                                                <FontAwesomeIcon icon={faCheckCircle} /> APPROVE
                                            </button>
                                            <button className="btn btn-danger flex-grow-1 rounded-pill py-3 fw-black x-small shadow-sm d-flex align-items-center justify-content-center gap-2 border-0">
                                                <FontAwesomeIcon icon={faTimesCircle} /> REJECT
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <button className="btn btn-outline-light border-dark border-opacity-10 text-dark flex-grow-1 rounded-pill py-3 x-small fw-black d-flex align-items-center justify-content-center gap-2">
                                            <FontAwesomeIcon icon={faHistory} /> AUDIT HISTORY
                                        </button>
                                        <button className="btn btn-outline-light border-dark border-opacity-10 text-dark flex-grow-1 rounded-pill py-3 x-small fw-black d-flex align-items-center justify-content-center gap-2">
                                            <FontAwesomeIcon icon={faCopy} /> DUPLICATE CHECK
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
            {/* STRATEGY HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="d-flex flex-column flex-xl-row justify-content-between align-items-start align-items-xl-center mb-5 gap-5"
            >
                <div className="d-flex align-items-center gap-4">
                    <motion.div 
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        className="rounded-5 shadow-3xl d-flex align-items-center justify-content-center p-3 text-white transition-all" 
                        style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                            boxShadow: '0 15px 35px rgba(79, 70, 229, 0.3), 0 0 0 8px rgba(79, 70, 229, 0.05)'
                        }}
                    >
                        <FontAwesomeIcon icon={faFileInvoiceDollar} className="fs-1" />
                    </motion.div>
                    <div>
                        <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-black x-small ls-wide border border-primary border-opacity-20">
                                <FontAwesomeIcon icon={faMicrochip} className="me-2" />
                                NODE-04 / REIMBURSEMENT-CORE
                            </span>
                            <div className="d-flex align-items-center gap-3 py-2 px-3 rounded-pill bg-success bg-opacity-25 border border-success border-opacity-10">
                                <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '12px', height: '12px' }}>
                                    <div className="pulse-dot bg-success"></div>
                                    <div className="position-absolute w-100 h-100 rounded-circle bg-success animate-ping opacity-50"></div>
                                </div>
                                <span className="x-small text-success fw-black ls-wide uppercase">Gateway Protocol Active</span>
                            </div>
                        </div>
                        <h3 className={`fw-black mb-0 ls-tight ${isDark ? 'text-white' : 'text-dark'}`}>
                            Enterprise Expense Hub
                        </h3>
                    </div>
                </div>
                
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-xl-end gap-2 w-100 w-xl-auto">
                    <div className={`nav nav-pills p-1 rounded-pill shadow-inner-soft glass-switcher ${isDark ? 'bg-dark-card border border-white border-opacity-10' : 'bg-light border border-black border-opacity-5'}`}>
                        {[
                            { id: 'overview', label: 'Executive' },
                            { id: 'ledger', label: 'Ledger' },
                            { id: 'submit', label: 'Submit' },
                            { id: 'audit', label: 'Compliance' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)} 
                                className={`nav-link rounded-pill px-4 py-2 fw-black transition-all x-small uppercase ls-wide ${activeTab === tab.id ? 'active bg-primary shadow-2xl scale-105' : 'text-muted opacity-75 hover-opacity-100'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-primary rounded-pill px-4 py-3 shadow-3xl fw-black transition-all hover-lift-lg d-flex align-items-center gap-2" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', border: 'none' }}>
                            <FontAwesomeIcon icon={faFileExport} className="small" />
                            <span className="ls-wide x-small">BI EXPORT</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* MAIN CANVAS */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'submit' && renderSubmission()}
                {activeTab !== 'overview' && activeTab !== 'submit' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-5 mt-5">
                        <div className="p-5 rounded-5 border-2 border-dashed border-primary border-opacity-10 mx-auto bg-primary bg-opacity-5 shadow-inner" style={{ maxWidth: '700px' }}>
                            <div className="mb-5 d-inline-flex position-relative">
                                <FontAwesomeIcon icon={faSync} size="5x" className="text-primary opacity-25 animate-spin-slow" />
                                <FontAwesomeIcon icon={faGlobe} className="position-absolute top-50 start-50 translate-middle text-primary fs-2" />
                            </div>
                            <h2 className="fw-black mb-3">SYNCHRONIZING GLOBAL DIRECTORY</h2>
                            <p className="text-muted fw-bold x-small ls-wide uppercase mb-5 px-5 opacity-75">Establishing secure handshake with regional ERP nodes and tax compliance repositories. This process is optimized for multinational financial governance.</p>
                            <div className="progress rounded-pill mb-5 mx-5" style={{ height: '4px' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '65%' }}></div>
                            </div>
                            <button onClick={() => setActiveTab('overview')} className="btn btn-primary rounded-pill px-5 py-3 fw-black ls-wide shadow-2xl">HALT SYNC & RETURN</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .ls-tight { letter-spacing: -0.04em; }
                .shadow-inner-soft { box-shadow: inset 0 2px 8px rgba(0,0,0,0.04); }
                .shadow-2xl { box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2); }
                .shadow-3xl { box-shadow: 0 30px 60px -15px rgba(31, 38, 135, 0.25); }
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .pulse-dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 15px rgba(16, 185, 129, 0.6); }
                .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.15) !important; }
                .hover-lift-lg:hover { transform: translateY(-10px); box-shadow: 0 2.5rem 6rem rgba(31, 38, 135, 0.2) !important; }
                .hover-rotate:hover { transform: rotate(-8deg) scale(1.1); }
                .ls-tight { letter-spacing: -0.05em; }
                .hover-bg-opacity:hover { background-color: rgba(var(--bs-primary-rgb), 0.03); }
                .space-y-6 > * + * { margin-top: 2rem; }
                .space-y-4 > * + * { margin-top: 1.5rem; }
                .space-y-5 > * + * { margin-top: 1.8rem; }
                .uppercase { text-transform: uppercase; }
                
                input::placeholder { opacity: 0.4; }
                .form-control:focus, .form-select:focus { 
                    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important; 
                    background-color: ${isDark ? 'rgba(255,255,255,0.08)' : '#fff'} !important; 
                }
            `}</style>
        </div>
    );
};

export default ExpenseReimbursement;
