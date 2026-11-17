import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCertificate, faSearch, faDownload, faEye, faExclamationTriangle,
  faCheckCircle, faTimesCircle, faFilter, faPlus, faPrint,
  faUserGraduate, faFilePdf
} from '@fortawesome/free-solid-svg-icons';

const CERTIFICATE_TYPES = [
  { value: 'Passing', label: 'Passing Certificate', color: '#10b981' },
  { value: 'Completion', label: 'Completion Certificate', color: '#6366f1' },
  { value: 'Merit', label: 'Merit Certificate', color: '#f59e0b' },
  { value: 'Participation', label: 'Participation Certificate', color: '#06b6d4' },
  { value: 'Transcript', label: 'Transcript', color: '#8b5cf6' },
];

const Certificates = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', dateFrom: '', dateTo: '', department: '' });
  const [previewCert, setPreviewCert] = useState(null);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData([
        { id: 1, student: 'Ali Ahmed', type: 'Passing', date: '2025-06-15', status: 'Generated', dept: 'Science' },
        { id: 2, student: 'Sara Khan', type: 'Merit', date: '2025-06-20', status: 'Generated', dept: 'Arts' },
        { id: 3, student: 'Usman Ali', type: 'Completion', date: '2025-07-01', status: 'Pending', dept: 'Commerce' },
        { id: 4, student: 'Fatima Noor', type: 'Transcript', date: '2025-07-05', status: 'Generated', dept: 'Science' },
        { id: 5, student: 'Hassan Raza', type: 'Participation', date: '2025-07-10', status: 'Pending', dept: 'IT' },
        { id: 6, student: 'Ayesha Malik', type: 'Merit', date: '2025-07-12', status: 'Generated', dept: 'Engineering' },
        { id: 7, student: 'Bilal Ahmed', type: 'Passing', date: '2025-07-15', status: 'Pending', dept: 'Science' },
        { id: 8, student: 'Zainab Ali', type: 'Transcript', date: '2025-07-18', status: 'Generated', dept: 'Medical' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (id) => {
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.('Certificate generated successfully', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to generate certificate', 'danger');
    }
  };

  const getTypeStyle = (type) => {
    const found = CERTIFICATE_TYPES.find(t => t.value === type);
    return found || { color: '#64748b' };
  };

  const templatePreview = (item) => {
    const typeStyle = getTypeStyle(item.type);
    return (
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="display-4 mb-3" style={{ color: typeStyle.color }}>
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <h3 className="fw-bold" style={{ color: textColor }}>Certificate of {item.type}</h3>
            <div className="divider mx-auto my-3" style={{ width: '100px', height: '3px', background: typeStyle.color, borderRadius: '2px' }} />
          </div>
          <div className="text-center mb-4">
            <p className="text-muted small mb-1">This is to certify that</p>
            <h4 className="fw-bold" style={{ color: textColor }}>{item.student}</h4>
            <p className="text-muted small mb-0">has successfully completed the requirements</p>
            <p className="text-muted small">for the {item.type.toLowerCase()} in the academic year 2024-2025</p>
          </div>
          <div className="row mt-4 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="col text-start">
              <p className="x-small text-muted mb-0">Date: {item.date}</p>
            </div>
            <div className="col text-end">
              <p className="x-small text-muted mb-0">Authorized Signature</p>
            </div>
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-primary rounded-3 px-4" onClick={() => addNotification?.('Certificate downloaded', 'success')}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />Download
            </button>
            <button className="btn btn-outline-secondary rounded-3 px-4">
              <FontAwesomeIcon icon={faPrint} className="me-2" />Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Certificates</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Generate and manage student certificates</p>
        </div>
        <button className="btn btn-primary rounded-3"><FontAwesomeIcon icon={faPlus} className="me-2" />Generate New</button>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by student..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
              <option value="">All Types</option>
              {CERTIFICATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})}>
              <option value="">All Departments</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
              <option value="Engineering">Engineering</option>
              <option value="Medical">Medical</option>
              <option value="IT">IT</option>
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} placeholder="From" />
          </div>
          <div className="col-md-1">
            <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} placeholder="To" />
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setFilters({ type: '', dateFrom: '', dateTo: '', department: '' }); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className="row g-4">
        <div className="col-xl-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th className="ps-4">Student Name</th>
                    <th>Certificate Type</th>
                    <th>Date</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <FontAwesomeIcon icon={faCertificate} className="fs-1 text-muted opacity-50 mb-3" />
                        <h6 className="fw-bold">No certificates found</h6>
                      </td>
                    </tr>
                  ) : data.map(item => {
                    const typeStyle = getTypeStyle(item.type);
                    return (
                      <tr key={item.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-primary opacity-50" />
                            <span className="fw-semibold small" style={{ color: textColor }}>{item.student}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge rounded-pill" style={{ background: `${typeStyle.color}15`, color: typeStyle.color }}>
                            {item.type}
                          </span>
                        </td>
                        <td className="small">{item.date}</td>
                        <td className="small">{item.dept}</td>
                        <td>
                          <span className={`badge rounded-pill ${item.status === 'Generated' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                            <FontAwesomeIcon icon={item.status === 'Generated' ? faCheckCircle : faTimesCircle} className="me-1" />
                            {item.status}
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => setPreviewCert(item)}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => handleGenerate(item.id)} disabled={item.status === 'Generated'}>
                            <FontAwesomeIcon icon={faCertificate} />
                          </button>
                          <button className="btn btn-sm btn-primary rounded-3">
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          {previewCert ? (
            templatePreview(previewCert)
          ) : (
            <div className={`card border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="text-center p-5">
                <FontAwesomeIcon icon={faCertificate} className="fs-1 text-muted opacity-25 mb-3" />
                <h6 className="fw-bold" style={{ color: textColor }}>Certificate Preview</h6>
                <p className="small text-muted">Select a certificate to preview its template</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default Certificates;
