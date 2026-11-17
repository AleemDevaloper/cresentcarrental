
import React, { useState, useEffect } from 'react';
import { getTabData } from '../../../api/fms';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCloudUploadAlt, faCamera, faCopy, faSync, faMicrochip, 
    faLightbulb, faFileInvoice, faCheckCircle, faTimesCircle,
    faBuilding, faCalculator, faCalendarAlt, faFileSignature,
    faHistory, faSearch, faFilter, faImages, faTable, faList,
    faChevronRight, faEye, faDollarSign, faTag, faProjectDiagram, faFlag, faPlus,
    faClock
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
import { Line, Doughnut } from 'react-chartjs-2';

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

const ReceiptUpload = ({ isDark }) => {
    // --- RECEIPT MODULE STATE ---
    const [receiptViewMode, setReceiptViewMode] = useState('grid');
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [receiptSearch, setReceiptSearch] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // --- HIGH-FIDELITY ENTERPRISE DATA ---
    const [receiptKpis, setReceiptKpis] = useState([]);
    useEffect(() => { getTabData('receipt-upload').then(res => setReceiptKpis(res.data?.data || [])).catch(() => {}); }, []);

    const [receiptLibrary, setReceiptLibrary] = useState([]);
    useEffect(() => { getTabData('receipt-upload').then(res => setReceiptLibrary(res.data?.data || [])).catch(() => {}); }, []);

    const [receiptStatusColors, setReceiptStatusColors] = useState({});
    useEffect(() => { getTabData('receipt-upload').then(res => setReceiptStatusColors(res.data?.data || {})).catch(() => {}); }, []);

    const doughnutOptions = {
        cutout: '75%',
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    const triggerScan = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
        }, 2500);
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode' : ''}`}>
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
                                    onClick={triggerScan}
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
                <div className="row g-4 mt-4">
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

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .animate-spin-slow { animation: spin 12s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .shadow-inner-soft { box-shadow: inset 0 2px 8px rgba(0,0,0,0.04); }
                .uppercase { text-transform: uppercase; }
            `}</style>
        </div>
    );
};

export default ReceiptUpload;
