import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileExcel,
  faFileCsv,
  faFilePowerpoint,
  faCalendarCheck,
  faShieldHalved,
  faImage,
  faCloudArrowDown,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { exportReport } from '../../../../api/tms';

const TmsExportReports = () => {
  const { addNotification } = useApp();
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [branding, setBranding] = useState('Company Standard (Default)');
  const [dataRange, setDataRange] = useState('Current Sprint (Sprint 25)');
  const [exporting, setExporting] = useState(false);
  const [recentExports, setRecentExports] = useState([]);

  const formats = [
    { type: 'PDF', label: 'Professional Document', icon: faFilePdf, color: '#EF4444', desc: 'Best for executive summaries and presentations.' },
    { type: 'Excel', label: 'Data Spreadsheet', icon: faFileExcel, color: '#10B981', desc: 'Ideal for deep data analysis and pivot tables.' },
    { type: 'CSV', label: 'Raw Data', icon: faFileCsv, color: '#3B82F6', desc: 'Optimized for machine learning and system imports.' },
    { type: 'PPT', label: 'Slide Deck', icon: faFilePowerpoint, color: '#F59E0B', desc: 'Automatically generated slides for meetings.' },
  ];

  useEffect(() => {
    const defaultExports = [
      { name: 'Monthly_Productivity_May_2026.pdf', date: '2 hours ago', size: '4.2 MB', status: 'ready' },
      { name: 'Team_Performance_Q2_Final.xlsx', date: 'Yesterday', size: '12.8 MB', status: 'ready' },
      { name: 'Sprint_24_Burndown_Raw.csv', date: '3 days ago', size: '1.1 MB', status: 'expired' },
    ];
    setRecentExports(defaultExports);
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      const result = await exportReport({
        format: selectedFormat.toLowerCase(),
        branding,
        data_range: dataRange,
      });
      const newExport = {
        name: result.filename || `Report_${new Date().toISOString().split('T')[0]}.${selectedFormat.toLowerCase()}`,
        date: 'Just now',
        size: result.size || '0 KB',
        status: 'ready',
        url: result.url,
      };
      setRecentExports(prev => [newExport, ...prev]);
      addNotification(`${selectedFormat} report generated successfully.`, 'success');
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (err) {
      console.error('Failed to export report', err);
      addNotification(err.response?.data?.message || 'Failed to generate report. Please try again.', 'danger');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Export Studio</h2>
          <p className="text-muted small mb-0">Professional grade data extraction and reporting hub.</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn btn-white shadow-sm rounded-pill border px-4">
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2 text-primary" /> Scheduled Tasks
            </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Format Selection */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">1. Select Format</h5>
            <div className="row g-4">
              {formats.map((fmt) => (
                <div className="col-md-6" key={fmt.type}>
                  <div
                    className={`format-card p-4 rounded-4 border-2 h-100 position-relative cursor-pointer ${selectedFormat === fmt.type ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setSelectedFormat(fmt.type)}
                    style={selectedFormat === fmt.type ? { borderColor: '#2828e2' } : {}}
                  >
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="p-3 rounded-4 shadow-sm" style={{ background: `${fmt.color}15`, color: fmt.color }}>
                            <FontAwesomeIcon icon={fmt.icon} className="fs-3" />
                        </div>
                        <div>
                            <h6 className="fw-bold mb-0">{fmt.type}</h6>
                            <span className="x-small text-muted fw-bold">{fmt.label}</span>
                        </div>
                    </div>
                    <p className="small text-muted mb-0">{fmt.desc}</p>
                    <div className={`selection-check position-absolute top-0 end-0 m-3 ${selectedFormat === fmt.type ? 'opacity-100' : 'opacity-0'}`}>
                        <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="fw-bold mb-4 mt-5">2. Export Configuration</h5>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Branding</label>
                    <select
                      className="form-select rounded-3 border-light bg-light bg-opacity-50"
                      value={branding}
                      onChange={(e) => setBranding(e.target.value)}
                    >
                        <option>Company Standard (Default)</option>
                        <option>Minimalist Tech</option>
                        <option>Executive Dark Mode</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Data Range</label>
                    <select
                      className="form-select rounded-3 border-light bg-light bg-opacity-50"
                      value={dataRange}
                      onChange={(e) => setDataRange(e.target.value)}
                    >
                        <option>Current Sprint (Sprint 25)</option>
                        <option>Last 30 Days</option>
                        <option>Custom Range</option>
                    </select>
                </div>
                <div className="col-12 mt-4">
                    <div className="d-flex gap-3 p-3 rounded-4 border border-primary border-opacity-10 bg-primary bg-opacity-5">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-primary mt-1" />
                        <div>
                            <h6 className="small fw-bold mb-1">Enterprise Security Enabled</h6>
                            <p className="x-small text-muted mb-0">Files are encrypted with AES-256. Professional watermarks will be applied based on your role (Admin).</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-3">
                <button
                  className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg w-100"
                  onClick={handleExport}
                  disabled={exporting}
                >
                    {exporting ? (
                      <span><span className="spinner-border spinner-border-sm me-2" role="status" />Generating...</span>
                    ) : (
                      <span><FontAwesomeIcon icon={faCloudArrowDown} className="me-2" /> Generate & Download Report</span>
                    )}
                </button>
            </div>
          </div>
        </div>

        {/* History & Status */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-4">Export History</h6>
            <div className="d-grid gap-3">
                {recentExports.length === 0 ? (
                  <div className="text-center py-3 text-muted small">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />
                    No recent exports
                  </div>
                ) : (
                  recentExports.map((item, i) => (
                    <div key={i} className="p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="fw-bold small text-truncate pe-2">{item.name}</div>
                            {item.status === 'ready' ?
                                <FontAwesomeIcon icon={faCheckCircle} className="text-success x-small" /> :
                                <FontAwesomeIcon icon={faClock} className="text-muted x-small" />
                            }
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="x-small text-muted">{item.date} • {item.size}</span>
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noreferrer" className="btn btn-link btn-sm p-0 x-small fw-bold text-primary text-decoration-none">Download</a>
                            ) : (
                              <button className="btn btn-link btn-sm p-0 x-small fw-bold text-primary text-decoration-none">Re-download</button>
                            )}
                        </div>
                    </div>
                  ))
                )}
            </div>
            <button className="btn btn-outline-secondary btn-sm rounded-pill mt-4 w-100" onClick={() => setRecentExports([])}>Clear History</button>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white overflow-hidden position-relative">
             <div className="position-relative" style={{ zIndex: 1 }}>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faImage} className="text-primary" /> Visual Assets
                </h6>
                <p className="x-small text-white text-opacity-75 mb-4">Your exports include real-time high-res chart snapshots for presentations.</p>
                <div className="chart-mockup p-3 rounded-3 bg-white bg-opacity-10">
                    <div className="d-flex gap-2 align-items-end" style={{ height: 40 }}>
                        <div className="bg-primary rounded-pill flex-grow-1" style={{ height: '60%' }} />
                        <div className="bg-primary rounded-pill flex-grow-1" style={{ height: '90%' }} />
                        <div className="bg-primary rounded-pill flex-grow-1" style={{ height: '40%' }} />
                        <div className="bg-primary rounded-pill flex-grow-1" style={{ height: '70%' }} />
                    </div>
                </div>
             </div>
             <div className="position-absolute top-0 end-0 m-n5 p-5 bg-primary bg-opacity-20 rounded-circle" style={{ width: 200, height: 200 }} />
          </div>
        </div>
      </div>

      <style>{`
        .format-card {
            background: #fff;
            border: 2px solid #f1f5f9;
            transition: all 0.2s ease;
        }
        .format-card:hover {
            border-color: #2828e2;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .format-card:hover .selection-check {
            opacity: 1;
        }
        .hover-border-primary:hover {
            border-color: #2828e2 !important;
            background: #fff !important;
        }
        .transition { transition: all 0.2s ease; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default TmsExportReports;
