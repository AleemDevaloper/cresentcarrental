import React, { useState } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileAlt, faFilePdf, faFileExcel, faFileCsv, faDownload,
  faCalendarAlt, faFilter, faEye, faClock, faChartBar,
  faUserGraduate, faClipboardList, faMoneyBillWave,
  faChalkboardTeacher, faBook, faTruck, faBuilding,
  faGraduationCap, faExclamationTriangle, faCheckCircle,
  faHistory, faPlus, faTrash, faPlay, faPause
} from '@fortawesome/free-solid-svg-icons';

const REPORT_TYPES = [
  { id: 'student', label: 'Student Reports', icon: faUserGraduate, color: '#6366f1', desc: 'Student lists, demographics, performance' },
  { id: 'attendance', label: 'Attendance Reports', icon: faClipboardList, color: '#10b981', desc: 'Daily, monthly attendance summaries' },
  { id: 'exam', label: 'Exam Reports', icon: faGraduationCap, color: '#f59e0b', desc: 'Results, grade distributions' },
  { id: 'fee', label: 'Fee Reports', icon: faMoneyBillWave, color: '#ef4444', desc: 'Collections, pending, scholarships' },
  { id: 'teacher', label: 'Teacher Reports', icon: faChalkboardTeacher, color: '#06b6d4', desc: 'Workload, performance, attendance' },
  { id: 'library', label: 'Library Reports', icon: faBook, color: '#8b5cf6', desc: 'Circulation, members, fines' },
  { id: 'transport', label: 'Transport Reports', icon: faTruck, color: '#ec4899', desc: 'Fleet, routes, fuel consumption' },
  { id: 'hostel', label: 'Hostel Reports', icon: faBuilding, color: '#f97316', desc: 'Occupancy, allocations, maintenance' },
];

const SCHEDULED_REPORTS = [
  { id: 1, name: 'Daily Attendance Summary', type: 'attendance', frequency: 'Daily', nextRun: '2026-07-28', status: 'Active' },
  { id: 2, name: 'Weekly Fee Collection', type: 'fee', frequency: 'Weekly', nextRun: '2026-08-01', status: 'Active' },
  { id: 3, name: 'Monthly Student Report', type: 'student', frequency: 'Monthly', nextRun: '2026-08-01', status: 'Paused' },
];

const EmsReports = () => {
  const { theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [selectedReport, setSelectedReport] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  return (
    <div className={`p-4 ${isDark ? 'text-white' : ''}`} style={{ background: isDark ? 'linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)' : 'linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)', minHeight: '100vh' }}>
      <div className={`rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ background: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.92)', border: `1px solid ${borderColor}`, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div>
            <h4 className="fw-bold mb-1">EMS Reports</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Generate, view, and schedule institutional reports</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger rounded-3 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faFilePdf} /> PDF</button>
            <button className="btn btn-outline-success rounded-3 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faFileExcel} /> Excel</button>
            <button className="btn btn-outline-primary rounded-3 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faFileCsv} /> CSV</button>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2">
          <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>Automated</span>
          <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>Scheduled</span>
          <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>Executive-ready</span>
        </div>
      </div>

      <h6 className="fw-bold mb-3" style={{ color: textColor }}>Report Types</h6>
      <div className="row g-3 mb-4">
        {REPORT_TYPES.map(rp => (
          <div key={rp.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'} ${selectedReport === rp.id ? 'ring-2' : ''}`} style={{ cursor: 'pointer', outline: selectedReport === rp.id ? `2px solid ${rp.color}` : 'none', boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)' }} onClick={() => setSelectedReport(rp.id)}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${rp.color}15` }}>
                    <FontAwesomeIcon icon={rp.icon} style={{ color: rp.color, fontSize: '18px' }} />
                  </div>
                  <div>
                    <div className="fw-bold small" style={{ color: textColor }}>{rp.label}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{rp.desc}</div>
                  </div>
                </div>
                <button className={`btn btn-sm rounded-3 w-100 mt-2 ${selectedReport === rp.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={e => { e.stopPropagation(); setSelectedReport(rp.id); }}>
                  <FontAwesomeIcon icon={faEye} className="me-1" /> View Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <>
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="small fw-bold text-muted mb-2">Date From</label>
                <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-muted mb-2">Date To</label>
                <input type="date" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-muted mb-2">Format</label>
                <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}>
                  <option>PDF</option><option>Excel</option><option>CSV</option>
                </select>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary rounded-3 w-100 d-flex align-items-center justify-content-center gap-2">
                  <FontAwesomeIcon icon={faDownload} /> Generate Report
                </button>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0" style={{ color: textColor }}>Report Preview</h6>
              <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{REPORT_TYPES.find(r => r.id === selectedReport)?.label}</span>
            </div>
            <div className="d-flex align-items-center justify-content-center" style={{ height: '300px', background: isDark ? 'rgba(255,255,255,0.02)' : '#f8f9fc', borderRadius: '12px', border: `1px dashed ${borderColor}` }}>
              <div className="text-center">
                <FontAwesomeIcon icon={faChartBar} className="fs-1 text-muted opacity-50 mb-3" />
                <h6 className="fw-bold text-muted">Report Preview</h6>
                <p className="small text-muted mb-0">Select filters and click Generate to preview</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold mb-0" style={{ color: textColor }}><FontAwesomeIcon icon={faClock} className="me-2 text-primary" />Scheduled Reports</h6>
          <button className="btn btn-sm btn-primary rounded-3"><FontAwesomeIcon icon={faPlus} className="me-1" /> Schedule New</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Report Name</th><th>Type</th><th>Frequency</th><th>Next Run</th><th>Status</th><th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULED_REPORTS.map(sr => (
                <tr key={sr.id}>
                  <td className="ps-4 fw-semibold small"><FontAwesomeIcon icon={faHistory} className="me-2 text-muted" />{sr.name}</td>
                  <td className="small">{REPORT_TYPES.find(r => r.id === sr.type)?.label}</td>
                  <td className="small">{sr.frequency}</td>
                  <td className="small">{sr.nextRun}</td>
                  <td><span className={`badge rounded-pill ${sr.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>{sr.status}</span></td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1"><FontAwesomeIcon icon={sr.status === 'Active' ? faPause : faPlay} /></button>
                    <button className="btn btn-sm btn-danger rounded-3"><FontAwesomeIcon icon={faTrash} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default EmsReports;
