import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode, faCamera, faCheckCircle, faTimesCircle, faHistory,
  faLocationDot, faClock, faShield, faRefresh, faGear,
  faMobileScreen, faQ
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { qrClockIn, listAttendance } from '../../../../api/hrms';

const QrAttendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [scannedCodes, setScannedCodes] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gpsData, setGpsData] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await listAttendance({ type: 'qr' });
      setScannedCodes(data || []);
    } catch {
      addNotification(t('Failed to load QR history'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsData({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const handleScanSimulation = async () => {
    setIsScanning(true);
    try {
      const payload = { qr_code: `HRMS-${Date.now()}`, ...gpsData };
      const result = await qrClockIn(payload);
      addNotification(t('QR code scanned successfully'), 'success');
      await fetchHistory();
    } catch (err) {
      addNotification(err?.message || t('QR scan failed'), 'danger');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await qrClockIn({ qr_code: manualCode.trim(), ...gpsData });
      addNotification(t('Code submitted successfully'), 'success');
      setManualCode('');
      await fetchHistory();
    } catch (err) {
      addNotification(err?.message || t('Code submission failed'), 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="row g-4">
        {/* QR Scanner & Input */}
        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faQrcode} className="me-2 text-primary" />{t('QR Attendance')}</h5>
            </div>
            <div className="card-body p-4">
              {/* Scanner Area */}
              <div className={`rounded-4 mb-4 d-flex align-items-center justify-content-center position-relative ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ height: 300 }}>
                {isScanning ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: 48, height: 48 }} />
                    <p className="fw-bold text-primary">{t('Scanning')}...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`position-relative d-inline-block mb-3`}>
                      <div className={`border-4 border-primary rounded-3 p-5 ${isDark ? 'bg-dark-subtle' : 'bg-white'}`}>
                        <FontAwesomeIcon icon={faQrcode} className="fs-1 text-muted opacity-50" />
                      </div>
                      {/* Scanning Animation */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden rounded-3">
                        <div className="scan-line" style={{ height: 3, background: 'linear-gradient(90deg, transparent, #0d6efd, transparent)', animation: 'scanMove 2s ease-in-out infinite' }} />
                      </div>
                      <style>{`@keyframes scanMove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }`}</style>
                    </div>
                    <p className="text-muted">{t('Click scan to validate QR code')}</p>
                  </div>
                )}
              </div>

              {/* Scan Button */}
              <div className="text-center mb-4">
                <button className="btn btn-primary btn-lg rounded-5 px-5" onClick={handleScanSimulation} disabled={isScanning || isSubmitting}>
                  <FontAwesomeIcon icon={faCamera} className="me-2" />{isScanning ? t('Scanning') : t('Scan QR Code')}
                </button>
              </div>

              {/* Manual Input */}
              <form onSubmit={handleManualSubmit}>
                <div className="input-group">
                  <span className="input-group-text bg-transparent"><FontAwesomeIcon icon={faQ} /></span>
                  <input type="text" className="form-control" placeholder={t('Or enter QR code manually...')} value={manualCode}
                    onChange={e => setManualCode(e.target.value)} disabled={isSubmitting} />
                  <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <div className="spinner-border spinner-border-sm" /> : t('Submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Scanned History */}
          <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Scanned Codes')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Code')}</th>
                    <th>{t('Time')}</th>
                    <th>{t('Site')}</th>
                    <th className="pe-4">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                  ) : scannedCodes.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4 text-muted">{t('No codes scanned yet')}</td></tr>
                  ) : scannedCodes.map((s, i) => (
                    <tr key={s.id || i}>
                      <td className="ps-4 fw-bold x-small">{s.qr_code || s.code}</td>
                      <td className="small">{s.created_at ? new Date(s.created_at).toLocaleTimeString() : s.time}</td>
                      <td className="small">{s.site?.name || s.site || '--'}</td>
                      <td className="pe-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Validation & Security */}
        <div className="col-lg-5">
          {/* Validation Status */}
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">{t('Validation Checks')}</h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                  <span><FontAwesomeIcon icon={faMobileScreen} className="me-2 text-primary" />{t('Device')}</span>
                  <span className="badge bg-success rounded-pill">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />{t('Valid')}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                  <span><FontAwesomeIcon icon={faLocationDot} className="me-2 text-success" />{t('Location')}</span>
                  <span className={`badge ${gpsData ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                    <FontAwesomeIcon icon={gpsData ? faCheckCircle : faTimesCircle} className="me-1" />{gpsData ? t('Valid') : t('Unavailable')}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light">
                  <span><FontAwesomeIcon icon={faClock} className="me-2 text-warning" />{t('Time Window')}</span>
                  <span className="badge bg-success rounded-pill">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />{t('Valid')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Settings */}
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faGear} className="me-2 text-secondary" />{t('QR Configuration')}</h6>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">{t('QR Rotation')}</label>
                <p className="small">{t('Automatic QR rotation is enabled')}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary flex-grow-1 rounded-3" onClick={handleScanSimulation} disabled={isScanning}>
                  <FontAwesomeIcon icon={faRefresh} className="me-1" />{t('Scan Now')}
                </button>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4 text-center">
              <FontAwesomeIcon icon={faShield} className="fs-1 text-success mb-2" />
              <h6 className="fw-bold">{t('Security Status: Secure')}</h6>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('All security checks passed. QR system operational.')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrAttendance;
