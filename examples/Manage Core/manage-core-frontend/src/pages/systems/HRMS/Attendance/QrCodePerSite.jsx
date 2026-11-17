import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode, faDownload, faPrint, faRefresh, faGear, faShield,
  faHistory, faChartBar, faQ, faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites, regenerateSiteQR, validateQRCode } from '../../../../api/hrms';

const QrCodePerSite = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [qrData, setQrData] = useState(null);
  const [scanLog, setScanLog] = useState([]);
  const [stats, setStats] = useState({ total: 0, unique: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [validationCode, setValidationCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const fetchSites = async () => {
    try {
      const data = await listSites();
      setSites(data);
      if (data.length > 0) setSelectedSite(data[0].id.toString());
    } catch { addNotification(t('Failed to load sites'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSites(); }, []);

  const handleRegenerate = async () => {
    if (!selectedSite) return;
    try {
      const result = await regenerateSiteQR(selectedSite);
      setQrData(result);
      addNotification(t('QR code regenerated'), 'success');
    } catch { addNotification(t('Error regenerating QR'), 'danger'); }
  };

  const handleValidate = async () => {
    if (!validationCode) return;
    try {
      const result = await validateQRCode({ code: validationCode, site_id: selectedSite });
      setValidationResult(result);
      addNotification(t('QR validated'), 'success');
    } catch (err) {
      setValidationResult({ valid: false });
      addNotification(err.message || t('Invalid QR code'), 'danger');
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faQrcode} className="me-2 text-primary" />{t('QR Code Per Site')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Manage site-specific QR codes')}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : sites.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faQrcode} className="fs-1 text-muted mb-3 opacity-50" />
          <p className="text-muted">{t('No sites available')}</p>
        </div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-5">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <label className="small fw-bold text-muted mb-2">{t('Select Site')}</label>
              <select className="form-select rounded-3 mb-4" value={selectedSite} onChange={e => { setSelectedSite(e.target.value); setQrData(null); setValidationResult(null); }}>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <div className={`rounded-4 p-5 text-center mb-4 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                <div className={`d-inline-block p-4 rounded-3 ${isDark ? 'bg-dark-subtle' : 'bg-white'} shadow-sm`}>
                  <FontAwesomeIcon icon={faQrcode} className="text-dark" style={{ fontSize: '6rem' }} />
                </div>
                <p className={`mt-2 small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {sites.find(s => s.id.toString() === selectedSite)?.name || ''} - {t('QR Code')}
                </p>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-warning flex-grow-1 rounded-3" onClick={handleRegenerate}>
                  <FontAwesomeIcon icon={faRefresh} className="me-2" />{t('Regenerate')}
                </button>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faShield} className="me-2 text-secondary" />{t('Validate QR Code')}</h6>
              <div className="input-group mb-3">
                <input type="text" className="form-control rounded-3" placeholder={t('Enter QR code')} value={validationCode}
                  onChange={e => setValidationCode(e.target.value)} />
                <button className="btn btn-primary rounded-3 ms-2" onClick={handleValidate}>{t('Validate')}</button>
              </div>
              {validationResult && (
                <div className={`p-3 rounded-3 ${validationResult.valid ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                  <FontAwesomeIcon icon={validationResult.valid ? faCheckCircle : faTimesCircle} className={validationResult.valid ? 'text-success me-2' : 'text-danger me-2'} />
                  <span className={validationResult.valid ? 'text-success' : 'text-danger'}>
                    {validationResult.valid ? t('Valid QR code') : t('Invalid QR code')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="row g-3 mb-4">
            {[
              { label: 'Total Scans', value: stats.total, icon: faQ, color: 'primary' },
              { label: 'Unique Scans', value: stats.unique, icon: faChartBar, color: 'success' },
              { label: 'Failed Attempts', value: stats.failed, icon: faTimesCircle, color: 'danger' },
            ].map((s, i) => (
              <div key={i} className="col-4">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-3 text-center">
                    <FontAwesomeIcon icon={s.icon} className={`text-${s.color} fs-3 mb-2`} />
                    <p className="h4 fw-bold mb-0">{s.value}</p>
                    <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t(s.label)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Scan Log')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Time')}</th>
                    <th>{t('Employee')}</th>
                    <th className="pe-4">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {scanLog.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">{t('No scans recorded')}</td></tr>
                  ) : scanLog.map((log, i) => (
                    <tr key={i}>
                      <td className="ps-4">{log.time}</td>
                      <td>{log.employee}</td>
                      <td className="pe-4">
                        <FontAwesomeIcon icon={log.status === 'valid' ? faCheckCircle : faTimesCircle}
                          className={log.status === 'valid' ? 'text-success' : 'text-danger'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default QrCodePerSite;
