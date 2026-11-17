
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperclip, faCloudArrowUp, faFileLines, faFileImage,
    faFilePdf, faFolderTree, faSearch, faTrashCan, faDownload,
    faEye, faInfoCircle, faFilter, faPlus, faTimes, faFileArchive
} from '@fortawesome/free-solid-svg-icons';
import client from '../../../api/client';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { getTabData } from '../../../api/fms';

const FileAttachments = ({ isDark }) => {
    const { addNotification } = useApp();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);
    useEffect(() => { getTabData('file-attachments').then(res => setFiles(res.data?.data || [])).catch(() => {}); }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('attachable_type', 'General');
        formData.append('attachable_id', 1);

        try {
            await client.post('/attachments', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowUploadModal(false);
            addNotification("File attached successfully", 'success');
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'PDF': return faFilePdf;
            case 'ZIP': return faFileArchive;
            case 'Excel': return faFileLines;
            default: return faPaperclip;
        }
    };

    const getColor = (type) => {
        switch(type) {
            case 'PDF': return 'text-danger';
            case 'ZIP': return 'text-warning';
            case 'Excel': return 'text-success';
            default: return 'text-primary';
        }
    };

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Header Section */}
                <div className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div className="d-flex align-items-center gap-4">
                            <div className="rounded-4 bg-purple p-3 text-white shadow-purple">
                                <FontAwesomeIcon icon={faPaperclip} className="fs-4" />
                            </div>
                            <div>
                                <h4 className="fw-black mb-1">Financial Document Repository</h4>
                                <p className="text-muted x-small fw-bold uppercase ls-wide mb-0">Secure Storage, Versioning & Audit-Linked Attachments</p>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light rounded-pill px-4 fw-black x-small border" onClick={() => {}}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" /> FILTER
                            </button>
                            <button className="btn btn-purple rounded-pill px-4 fw-black x-small shadow-sm text-white" onClick={() => setShowUploadModal(true)}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> UPLOAD NEW FILE
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {[
                            { l: 'Total Storage Used', v: '154.2 MB', i: faCloudArrowUp, c: '#a855f7' },
                            { l: 'Total Documents', v: '1,240', i: faFileLines, c: '#6366f1' },
                            { l: 'Pending Reviews', v: '12 Files', i: faInfoCircle, c: '#f59e0b' },
                        ].map((s, i) => (
                            <div key={i} className="col-md-4">
                                <div className={`p-4 rounded-4 ${isDark ? 'bg-dark-alt' : 'bg-light'} border h-100`}>
                                    <div className="d-flex justify-content-between mb-3">
                                        <h6 className="uppercase fw-black x-small ls-wide text-muted mb-0">{s.l}</h6>
                                        <FontAwesomeIcon icon={s.i} style={{ color: s.c }} />
                                    </div>
                                    <h3 className="fw-black mb-0">{s.v}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="row g-4">
                    <div className="col-lg-3">
                        <div className={`p-4 rounded-5 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm'} border h-100`}>
                            <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4">Categories</h6>
                            <div className="space-y-1">
                                {['All Documents', 'Tax Invoices', 'Legal Contracts', 'Asset Proofs', 'Audit Reports'].map((cat, i) => (
                                    <button key={i} className={`btn w-100 text-start border-0 rounded-4 px-3 py-2 d-flex align-items-center gap-3 mb-2 ${i === 0 ? 'bg-purple text-white shadow-sm' : 'btn-light'}`}>
                                        <FontAwesomeIcon icon={faFolderTree} className={i === 0 ? 'text-white' : 'text-purple'} />
                                        <span className="x-small fw-black">{cat}</span>
                                    </button>
                                ))}
                            </div>
                            <hr className="my-4 opacity-10" />
                            <h6 className="uppercase fw-black x-small ls-wide text-muted mb-4">Storage Insight</h6>
                            <div className="p-3 rounded-4 bg-light border">
                                <div className="d-flex justify-content-between x-small fw-black mb-2">
                                    <span>Usage</span>
                                    <span>31%</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div className="progress-bar bg-purple" style={{ width: '31%' }}></div>
                                </div>
                                <p className="x-small text-muted mt-2 mb-0">154.2 MB of 500 MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className={`card border-0 rounded-5 overflow-hidden shadow-sm h-100 ${isDark ? 'bg-dark-card text-white' : 'bg-white'}`}>
                            <div className="card-header bg-transparent p-4 border-0 d-flex justify-content-between align-items-center">
                                <div className="input-group input-group-sm rounded-pill border overflow-hidden" style={{ width: '300px' }}>
                                    <span className="input-group-text bg-transparent border-0 ps-3">
                                        <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                    </span>
                                    <input type="text" className="form-control border-0 x-small fw-bold" placeholder="Search file repository..." />
                                </div>
                                <div className="x-small fw-bold text-muted uppercase">Showing {files.length} Files</div>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className={`x-small fw-black uppercase text-muted ${isDark ? 'bg-dark-alt' : 'bg-light'}`}>
                                        <tr>
                                            <th className="px-5 py-3 border-0">File Name</th>
                                            <th className="py-3 border-0">Category</th>
                                            <th className="py-3 border-0 text-end">Size</th>
                                            <th className="py-3 border-0 text-center">Owner</th>
                                            <th className="px-5 py-3 border-0 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {files.map(file => (
                                            <tr key={file.id} className="border-0">
                                                <td className="px-5 py-4 border-0">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className={`rounded-3 p-2 bg-light border ${getColor(file.type)}`}>
                                                            <FontAwesomeIcon icon={getIcon(file.type)} />
                                                        </div>
                                                        <div>
                                                            <div className="fw-black small">{file.name}</div>
                                                            <div className="text-muted x-small fw-bold">{file.id} • {file.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-0">
                                                    <span className="badge rounded-pill bg-light text-dark border x-small fw-bold px-3">{file.category}</span>
                                                </td>
                                                <td className="border-0 text-end fw-bold small text-muted">{file.size}</td>
                                                <td className="border-0 text-center fw-black x-small">{file.owner}</td>
                                                <td className="px-5 border-0 text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button className="btn btn-xs btn-light rounded-circle shadow-sm"><FontAwesomeIcon icon={faEye} /></button>
                                                        <button className="btn btn-xs btn-light rounded-circle shadow-sm text-primary"><FontAwesomeIcon icon={faDownload} /></button>
                                                        <button className="btn btn-xs btn-light rounded-circle shadow-sm text-danger"><FontAwesomeIcon icon={faTrashCan} /></button>
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
            </motion.div>

      <DialogBox
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload New Document"
        size="sm"
        footer={
          <div className="d-flex gap-2 w-100">
            <button className="btn btn-light rounded-pill w-100 fw-black x-small py-3 border" onClick={() => setShowUploadModal(false)}>CANCEL</button>
            <button className="btn btn-purple rounded-pill w-100 fw-black x-small py-3 text-white shadow-sm" onClick={() => {}} disabled={uploading}>
              {uploading ? 'UPLOADING...' : 'COMPLETE UPLOAD'}
            </button>
          </div>
        }
      >
        <div className="p-5 border-dashed border-2 rounded-5 text-center mb-4 bg-light">
          <FontAwesomeIcon icon={faCloudArrowUp} className="fs-1 text-purple mb-3 opacity-50" />
          <p className="x-small fw-black text-muted mb-3">DRAG & DROP FILE HERE</p>
          <input type="file" className="form-control form-control-sm" onChange={handleUpload} />
        </div>

        <div className="space-y-4">
          <div className="mb-3">
            <label className="x-small fw-black uppercase text-muted mb-2">Assign Category</label>
            <select className="form-select rounded-pill x-small fw-bold border-2">
              <option>Select Category...</option>
              <option>Tax Invoices</option>
              <option>Legal Contracts</option>
              <option>Asset Proofs</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="x-small fw-black uppercase text-muted mb-2">Description / Notes</label>
            <textarea className="form-control rounded-4 x-small fw-bold border-2" rows="3" placeholder="Enter file details..."></textarea>
          </div>
        </div>
      </DialogBox>

      <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .bg-dark-alt { background: rgba(30, 41, 59, 0.8); }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.1em; }
                .uppercase { text-transform: uppercase; }
                .bg-purple { background: #a855f7; }
                .shadow-purple { box-shadow: 0 10px 20px -5px rgba(168, 85, 247, 0.4); }
                .border-dashed { border-style: dashed !important; border-color: #a855f7 !important; }
            `}</style>
        </div>
    );
};

export default FileAttachments;
