
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSignature, faFilePen, faCircleCheck, faClock,
    faUserCheck, faShieldHalved, faStamp, faLink,
    faTimes, faChevronRight, faFileLines, faFingerprint
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const ESignatureSupport = ({ isDark }) => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [stats, setStats] = useState({ pendingRequests: 0, completedSignatures: 0, rejectedRequests: 0, expiredRequests: 0 });
    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        getTabData('e-signature').then(res => {
            const data = res.data?.data || {};
            setStats({ pendingRequests: data.pendingRequests || 0, completedSignatures: data.completedSignatures || 0, rejectedRequests: data.rejectedRequests || 0, expiredRequests: data.expiredRequests || 0 });
            setRequests(data.requests || []);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                {/* Header Stats */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-orange p-3 text-white shadow-orange">
                                <FontAwesomeIcon icon={faSignature} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">E-Signature & Digital Validation</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Legally Binding Approvals, Biometric Links & Audit Trails</p>
                            </div>
                        </div>
                        <button className="btn btn-orange rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowRequestModal(true)}>
                            <FontAwesomeIcon icon={faFilePen} className="me-2" /> INITIATE SIGNING REQUEST
                        </button>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="p-5 rounded-5 bg-dark text-white shadow-lg h-100 position-relative overflow-hidden border border-white border-opacity-10">
                                <div className="position-absolute bottom-0 end-0 p-4 opacity-10">
                                    <FontAwesomeIcon icon={faStamp} style={{ fontSize: '150px' }} />
                                </div>
                                <h6 className="uppercase fw-black x-small ls-wide opacity-50 mb-4 position-relative">Trust Profile</h6>
                                <div className="d-flex align-items-center gap-4 mb-5 position-relative">
                                    <div className="rounded-circle bg-success p-3 shadow-lg">
                                        <FontAwesomeIcon icon={faShieldHalved} className="fs-3" />
                                    </div>
                                    <div>
                                        <h4 className="fw-black mb-1">FIPS 140-2 Validated</h4>
                                        <p className="x-small fw-bold text-white-50 mb-0 uppercase ls-wide">Active Cryptographic Keys: 24</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-20 d-inline-flex align-items-center gap-3 position-relative">
                                    <FontAwesomeIcon icon={faLink} className="text-orange" />
                                    <span className="x-small fw-black">Immutable Blockchain Audit Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100 text-center d-flex flex-column justify-content-center`}>
                                <h1 className="fw-black text-warning mb-1" style={{ fontSize: '3.5rem' }}>{stats.pendingRequests.toString().padStart(2, '0')}</h1>
                                <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">Pending Requests</h6>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className={`p-5 rounded-5 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100 text-center d-flex flex-column justify-content-center`}>
                                <h1 className="fw-black text-success mb-1" style={{ fontSize: '3.5rem' }}>{stats.completedSignatures.toString().padStart(2, '0')}</h1>
                                <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">Secured Documents</h6>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracking View */}
                <div className={`card border-0 rounded-5 overflow-hidden ${isDark ? 'bg-dark-card shadow-lg text-white' : 'bg-white shadow-sm border'}`}>
                    <div className="card-header bg-transparent border-0 p-5 pb-0">
                        <h5 className="fw-black mb-0 text-dark">Signature Pipeline</h5>
                    </div>
                    <div className="table-responsive p-5 pt-3">
                        <table className="table table-hover align-middle mb-0">
                            <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                <tr>
                                    <th className="px-4 py-3 border-0">Document Context</th>
                                    <th className="py-3 border-0">Signatory</th>
                                    <th className="py-3 border-0 text-center">Status</th>
                                    <th className="py-3 border-0 text-center">Priority</th>
                                    <th className="px-4 py-3 border-0 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-0">
                                        <td className="px-4 py-4 border-0">
                                            <div className="d-flex align-items-center gap-3">
                                                <FontAwesomeIcon icon={faFileLines} className="text-muted opacity-50" />
                                                <div>
                                                    <div className="fw-black small text-primary">{req.doc}</div>
                                                    <div className="text-muted x-small fw-bold">REF: {req.id} • {req.requested}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-0 small fw-bold text-dark">
                                            <FontAwesomeIcon icon={faUserCheck} className="me-2 opacity-25" />
                                            {req.signer}
                                        </td>
                                        <td className="border-0 text-center">
                                            <span className={`badge rounded-pill x-small fw-black px-3 ${
                                                req.status === 'Completed' ? 'bg-success text-white shadow-sm' : 
                                                req.status === 'Pending' ? 'bg-warning text-white shadow-sm' : 
                                                'bg-info text-white shadow-sm'
                                            }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="border-0 text-center">
                                            <div className={`x-small fw-black uppercase ${req.priority === 'Critical' ? 'text-danger' : 'text-muted opacity-50'}`}>{req.priority}</div>
                                        </td>
                                        <td className="px-4 border-0 text-end">
                                            <button className="btn btn-xs btn-light rounded-pill px-3 fw-black x-small shadow-xs border">
                                                {req.status === 'Completed' ? 'VERIFY' : 'REMIND'}
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
                show={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                title="Issue Signing Mandate"
                size="md"
                footer={
                    <div className="d-flex gap-2 w-100">
                        <button className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowRequestModal(false)}>CANCEL</button>
                        <button className="btn btn-orange rounded-pill w-100 fw-black x-small py-3 text-white shadow-orange">SEND SIGNATURE REQUEST</button>
                    </div>
                }
            >
                <div className="row g-4">
                    <div className="col-12">
                        <label className="x-small fw-black uppercase text-muted mb-2">Upload Document to Sign</label>
                        <div className="p-4 border-dashed border-2 rounded-4 text-center bg-light">
                            <FontAwesomeIcon icon={faFileLines} className="text-muted opacity-25 fs-2 mb-2" />
                            <p className="x-small fw-bold text-muted mb-0">Drop file here or browse</p>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <label className="x-small fw-black uppercase text-muted mb-2">Signatory Name / Role</label>
                        <input type="text" className="form-control rounded-pill x-small fw-bold border-2" placeholder="e.g. Finance Director" />
                    </div>
                    <div className="col-md-5">
                        <label className="x-small fw-black uppercase text-muted mb-2">Priority</label>
                        <select className="form-select rounded-pill x-small fw-bold border-2">
                            <option>Normal</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 d-flex gap-3 align-items-center mb-2">
                            <FontAwesomeIcon icon={faFingerprint} className="text-primary" />
                            <p className="x-small fw-bold mb-0">Biometric identity verification will be required for the signer.</p>
                        </div>
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
                .bg-orange { background: #f59e0b; }
                .btn-orange { background: #f59e0b; border-color: #f59e0b; }
                .btn-orange:hover { background: #d97706; border-color: #d97706; }
                .shadow-orange { box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.4); }
                .text-dark { color: #1e293b !important; }
                .border-dashed { border-style: dashed !important; border-color: #f59e0b !important; }
            `}</style>
        </div>
    );
};

export default ESignatureSupport;
