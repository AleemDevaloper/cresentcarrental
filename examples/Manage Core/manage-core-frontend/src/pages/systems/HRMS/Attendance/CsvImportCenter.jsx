import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCsv, faUpload, faDownload, faCheckCircle,
  faTimesCircle, faExclamationTriangle, faHistory, faRefresh,
  faTable, faFileImport, faTrash, faEye, faFileExport,
  faList, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  listImports, previewImport, processImport, getImportMapping,
  validateImport, rollbackImport, downloadImportTemplate, getImportLogs
} from '../../../../api/hrms';

const IMPORT_TYPES = [
  'Employees', 'Departments', 'Designations', 'Branches',
  'Attendance', 'Leave Balances', 'Payroll Components', 'Assets', 'Documents'
];

const CsvImportCenter = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [imports, setImports] = useState([]);
  const [importLogs, setImportLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importType, setImportType] = useState('Employees');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchImports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listImports();
      setImports(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load import history');
      addNotification?.(err.message || 'Failed to load import history', 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => { fetchImports(); }, [fetchImports]);

  const handleFileChange = async (f) => {
    setFile(f);
    setPreview(null);
    setValidation(null);
    if (!f) return;
    try {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('import_type', importType);
      const data = await previewImport(fd);
      setPreview(data);
    } catch (err) {
      addNotification?.(err.message || 'Preview failed', 'danger');
    }
  };

  const handleValidate = async () => {
    if (!file) return;
    setValidating(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('import_type', importType);
      const data = await validateImport(fd);
      setValidation(data);
      addNotification?.('Validation complete', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Validation failed', 'danger');
    } finally {
      setValidating(false);
    }
  };

  const handleProcessImport = async () => {
    if (!file) return;
    setImporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 500);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('import_type', importType);
      await processImport(fd);
      clearInterval(interval);
      setProgress(100);
      addNotification?.('Import completed successfully', 'success');
      setTimeout(() => {
        setProgress(0);
        setImporting(false);
        setFile(null);
        setPreview(null);
        setValidation(null);
        fetchImports();
      }, 1500);
    } catch (err) {
      clearInterval(interval);
      addNotification?.(err.message || 'Import failed', 'danger');
      setImporting(false);
    }
  };

  const handleRollback = async () => {
    if (!window.confirm('Rollback the last import? This cannot be undone.')) return;
    try {
      await rollbackImport();
      addNotification?.('Import rolled back successfully', 'success');
      fetchImports();
    } catch (err) {
      addNotification?.(err.message || 'Rollback failed', 'danger');
    }
  };

  const handleDownloadTemplate = async (type) => {
    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const token = localStorage.getItem('auth_token');
      const url = `${baseUrl}/api/v1/hrms/csv-imports/template/${type}`;
      const a = document.createElement('a');
      a.href = token ? `${url}?token=${encodeURIComponent(token)}` : url;
      a.download = `${type.toLowerCase()}-template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addNotification?.('Template download started', 'success');
    } catch {
      addNotification?.('Download failed', 'danger');
    }
  };

  const handleViewLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await getImportLogs();
      setImportLogs(Array.isArray(data) ? data : data?.data || []);
      setShowLogs(true);
    } catch (err) {
      addNotification?.(err.message || 'Failed to load logs', 'danger');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleMapping = async () => {
    try {
      const data = await getImportMapping();
      if (data) addNotification?.('Mapping retrieved', 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to get mapping', 'danger');
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faFileImport} className="me-2 text-primary" />CSV / Excel Import Center</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Bulk import data from CSV or Excel files</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className="row g-4">
        {/* Left Panel */}
        <div className="col-lg-8">
          {/* Import Type */}
          <div className="mb-4">
            <label className="small fw-bold text-muted mb-2">Import Type</label>
            <div className="d-flex flex-wrap gap-2">
              {IMPORT_TYPES.map(it => (
                <button key={it} className={`btn rounded-3 ${importType === it ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                  onClick={() => setImportType(it)}>
                  <FontAwesomeIcon icon={faTable} className="me-1" />{it}
                </button>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div className={`border-2 border-dashed rounded-4 p-5 text-center mb-4 transition ${file ? 'bg-primary-subtle border-primary' : isDark ? 'border-secondary bg-dark-subtle' : 'border-light bg-light'}`}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]); }}>
            <FontAwesomeIcon icon={faFileCsv} className="fs-1 mb-3 text-success opacity-75" />
            <h6 className="fw-bold">Drag & drop your file here</h6>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Supports CSV, XLSX formats</p>
            {file ? (
              <p className="mt-2 small text-primary fw-bold">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
            ) : (
              <button className="btn btn-sm btn-outline-primary rounded-3 mt-2" onClick={() => document.getElementById('csvInput').click()}>Browse Files</button>
            )}
            <input type="file" id="csvInput" className="d-none" accept=".csv,.xlsx,.xls" onChange={e => e.target.files[0] && handleFileChange(e.target.files[0])} />
          </div>

          {/* Preview Table */}
          {preview && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className={`card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center`}>
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faEye} className="me-2 text-primary" />Preview</h6>
                <span className="small text-muted">First rows</span>
              </div>
              <div className="table-responsive">
                <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                  <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <tr>
                      {(preview.headers || preview.columns || []).map((h, i) => (
                        <th key={i} className="small fw-bold">{typeof h === 'string' ? h : h.name || h.label || `Column ${i + 1}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {((preview.rows || preview.data || [])).slice(0, 10).map((row, ri) => (
                      <tr key={ri}>
                        {(preview.headers || preview.columns || []).map((h, ci) => (
                          <td key={ci} className="small">
                            {row[typeof h === 'string' ? h : h.name || h.key || h.field] ?? (Array.isArray(row) ? row[ci] : '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {(!preview.rows && !preview.data) && Array.isArray(preview) && preview.slice(0, 10).map((row, ri) => (
                      <tr key={ri}>
                        {Object.values(row).map((cell, ci) => (
                          <td key={ci} className="small">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validation Result */}
          {validation && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className={`card-header bg-transparent border-0 py-3`}>
                <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faClipboardList} className="me-2 text-info" />Validation Result</h6>
              </div>
              <div className="card-body p-4">
                {validation.valid !== undefined && (
                  <div className={`d-flex align-items-center gap-2 mb-3 ${validation.valid ? 'text-success' : 'text-danger'}`}>
                    <FontAwesomeIcon icon={validation.valid ? faCheckCircle : faTimesCircle} />
                    <span className="fw-bold">{validation.valid ? 'Valid' : 'Invalid'}</span>
                  </div>
                )}
                {validation.errors && validation.errors.length > 0 && (
                  <div>
                    <p className="small fw-bold text-danger mb-2">Errors:</p>
                    <ul className="small mb-0">
                      {validation.errors.map((err, i) => (
                        <li key={i}>{typeof err === 'string' ? err : err.message || JSON.stringify(err)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validation.warnings && validation.warnings.length > 0 && (
                  <div className="mt-2">
                    <p className="small fw-bold text-warning mb-2">Warnings:</p>
                    <ul className="small mb-0">
                      {validation.warnings.map((w, i) => (
                        <li key={i}>{typeof w === 'string' ? w : w.message || JSON.stringify(w)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {(!validation.errors || validation.errors.length === 0) && (!validation.warnings || validation.warnings.length === 0) && (
                  <p className="small text-success mb-0">No issues found</p>
                )}
              </div>
            </div>
          )}

          {/* Import Progress */}
          {importing && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold small">Importing...</span>
                  <span className="fw-bold small">{progress}%</span>
                </div>
                <div className="progress rounded-3" style={{ height: 8 }}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <button className="btn btn-success rounded-3 px-4" disabled={!file || importing} onClick={handleProcessImport}>
              <FontAwesomeIcon icon={faUpload} className="me-2" />Start Import
            </button>
            <button className="btn btn-info rounded-3 px-4 text-white" disabled={!file || importing} onClick={handleValidate}>
              {validating ? <><span className="spinner-border spinner-border-sm me-2" />Validating...</> : <><FontAwesomeIcon icon={faCheckCircle} className="me-2" />Validate</>}
            </button>
            <button className="btn btn-outline-secondary rounded-3 px-4" onClick={() => handleDownloadTemplate(importType)}>
              <FontAwesomeIcon icon={faDownload} className="me-2" />Template
            </button>
            <button className="btn btn-outline-info rounded-3 px-4" onClick={handleMapping}>
              <FontAwesomeIcon icon={faTable} className="me-2" />Mapping
            </button>
            <button className="btn btn-danger rounded-3 px-4" onClick={handleRollback}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />Rollback
            </button>
          </div>
        </div>

        {/* Right Panel - Import History */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className={`card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-warning" />Import History</h6>
              <button className="btn btn-sm btn-outline-primary rounded-3" onClick={handleViewLogs}>
                <FontAwesomeIcon icon={faList} className="me-1" />Logs
              </button>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></div>
              ) : imports.length === 0 ? (
                <div className="text-center py-4 text-muted small">No imports yet</div>
              ) : (
                imports.map((imp, i) => (
                  <div key={imp.id || i} className={`p-3 border-bottom ${isDark ? 'border-secondary' : ''}`}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-bold small">{imp.import_type || imp.type}</span>
                      <span className={`badge ${imp.status === 'completed' || imp.status === 'success' ? 'bg-success' : imp.status === 'failed' ? 'bg-danger' : 'bg-warning'} rounded-pill x-small`}>
                        {imp.status}
                      </span>
                    </div>
                    <p className={`x-small mb-1 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                      {imp.created_at ? new Date(imp.created_at).toLocaleString() : imp.date ? new Date(imp.date).toLocaleString() : '-'}
                    </p>
                    <div className="d-flex gap-2 x-small">
                      {imp.imported !== undefined && <span className="text-success"><FontAwesomeIcon icon={faCheckCircle} className="me-1" />{imp.imported}</span>}
                      {imp.failed !== undefined && <span className="text-danger"><FontAwesomeIcon icon={faTimesCircle} className="me-1" />{imp.failed}</span>}
                      {imp.total !== undefined && <span className={isDark ? 'text-light opacity-75' : 'text-muted'}>Total: {imp.total}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-3 text-center">
            <button className="btn btn-sm btn-outline-primary rounded-3" onClick={fetchImports}>
              <FontAwesomeIcon icon={faRefresh} className="me-1" />Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold"><FontAwesomeIcon icon={faClipboardList} className="me-2 text-info" />Import Logs</h5>
                <button className="btn-close" onClick={() => setShowLogs(false)} />
              </div>
              <div className="modal-body p-0">
                {logsLoading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
                ) : importLogs.length === 0 ? (
                  <div className="text-center py-5 text-muted">No logs available</div>
                ) : (
                  <div className="table-responsive">
                    <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                      <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                        <tr>
                          <th className="ps-4">Timestamp</th>
                          <th>Level</th>
                          <th>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importLogs.map((log, i) => (
                          <tr key={i}>
                            <td className="ps-4">{log.timestamp || log.created_at ? new Date(log.timestamp || log.created_at).toLocaleString() : '-'}</td>
                            <td>
                              <span className={`badge ${log.level === 'error' ? 'bg-danger' : log.level === 'warning' ? 'bg-warning' : 'bg-info'}`}>
                                {log.level || 'info'}
                              </span>
                            </td>
                            <td>{log.message || JSON.stringify(log)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-4">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowLogs(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvImportCenter;
