import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt, faSignOutAlt, faLocationDot, faCamera, faClock,
  faHistory, faBell, faChartLine, faStopwatch, faUserCheck,
  faTriangleExclamation, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listAttendance, clockIn, clockOut, getAttendanceCheckStatus } from '../../../../api/hrms';

const CheckInOut = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkStatus, setCheckStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [gpsData, setGpsData] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [selfieFile, setSelfieFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selfiePreviewUrl = useMemo(() => {
    if (selfieFile) return URL.createObjectURL(selfieFile);
    return null;
  }, [selfieFile]);

  useEffect(() => {
    return () => {
      if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    };
  }, [selfiePreviewUrl]);

  const today = new Date().toISOString().split('T')[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [status, data] = await Promise.all([
        getAttendanceCheckStatus(),
        listAttendance({ date: today })
      ]);
      setCheckStatus(status);
      setAttendance(data || []);
    } catch {
      addNotification(t('Failed to fetch attendance'), 'danger');
    } finally {
      setLoading(false);
    }
  }, [today, addNotification, t]);

  useEffect(() => {
    fetchData();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsData({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true }
      );
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const isCheckedIn = checkStatus?.is_checked_in;
  const checkedInSince = checkStatus?.checked_in_at;
  const siteInfo = checkStatus?.site;

  const elapsedSeconds = checkedInSince
    ? Math.floor((new Date() - new Date(checkedInSince)) / 1000)
    : 0;
  const elapsedHours = Math.floor(elapsedSeconds / 3600);
  const elapsedMinutes = Math.floor((elapsedSeconds % 3600) / 60);

  const todayPunches = attendance.filter(r => r.date === today);

  const handleClockIn = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (gpsData) {
        formData.append('latitude', gpsData.latitude);
        formData.append('longitude', gpsData.longitude);
      }
      if (selfieFile) formData.append('selfie', selfieFile);
      if (siteInfo?.id) formData.append('site_id', siteInfo.id);
      formData.append('device_info', navigator.userAgent || 'web');
      await clockIn(formData);
      addNotification(t('Checked in successfully'), 'success');
      setSelfieFile(null);
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Check-in failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (gpsData) {
        formData.append('latitude', gpsData.latitude);
        formData.append('longitude', gpsData.longitude);
      }
      if (selfieFile) formData.append('selfie', selfieFile);
      await clockOut(formData);
      addNotification(t('Checked out successfully'), 'success');
      setSelfieFile(null);
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Check-out failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const totalHours = checkStatus?.total_hours_today;

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="row g-4">
        {/* Status Card */}
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-body p-4 text-center ${isCheckedIn ? 'bg-success text-white' : checkStatus?.clocked_out_today ? 'bg-secondary text-white' : ''}`}>
              <div className={`d-inline-block p-4 rounded-circle mb-3 ${isCheckedIn ? 'bg-white bg-opacity-25' : checkStatus?.clocked_out_today ? 'bg-white bg-opacity-25' : 'bg-light'}`}>
                <FontAwesomeIcon icon={isCheckedIn ? faSignInAlt : checkStatus?.clocked_out_today ? faSignOutAlt : faClock} className="fs-1" />
              </div>
              <h3 className="fw-bold mb-0">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
              <p className={`mb-0 ${isCheckedIn ? 'text-white opacity-75' : 'text-muted'}`}>{currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              {isCheckedIn && (
                <p className="fw-bold mt-2 mb-0">{t('Duration')}: {elapsedHours}h {elapsedMinutes}m</p>
              )}
              {totalHours && (
                <p className="small mb-0">{t('Total Today')}: {totalHours}h</p>
              )}
            </div>
            <div className="card-body p-4">
              <div className="d-flex gap-2 mb-3">
                <button
                  className={`btn flex-grow-1 py-3 rounded-3 fw-bold ${!isCheckedIn && !checkStatus?.clocked_out_today ? 'btn-success' : 'btn-outline-secondary'}`}
                  disabled={isCheckedIn || checkStatus?.clocked_out_today || submitting}
                  onClick={handleClockIn}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />{submitting ? t('Processing...') : t('CHECK IN')}
                </button>
                <button
                  className={`btn flex-grow-1 py-3 rounded-3 fw-bold ${isCheckedIn ? 'btn-danger' : 'btn-outline-secondary'}`}
                  disabled={!isCheckedIn || submitting}
                  onClick={handleClockOut}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{submitting ? t('Processing...') : t('CHECK OUT')}
                </button>
              </div>

              {/* GPS & Selfie */}
              <div className="d-flex gap-2 mb-3">
                <div className={`flex-grow-1 p-2 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} d-flex align-items-center gap-2`}>
                  <FontAwesomeIcon icon={faLocationDot} className={`${gpsData ? 'text-success' : 'text-warning'}`} />
                  <span className="x-small">{gpsData ? 'GPS Active' : 'GPS Offline'}</span>
                </div>
                <div className={`flex-grow-1 p-2 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} d-flex align-items-center gap-2 cursor-pointer`} onClick={() => document.getElementById('selfieInputCheck').click()}>
                  <FontAwesomeIcon icon={faCamera} className="text-primary" />
                  <span className="x-small">{selfieFile ? t('Retake') : t('Selfie')}</span>
                  <input type="file" id="selfieInputCheck" className="d-none" accept="image/*" capture="environment" onChange={(e) => {
                    if (e.target.files[0]) setSelfieFile(e.target.files[0]);
                  }} />
                </div>
              </div>
              {selfieFile && (
                <div className="text-center mb-3">
                  <img src={selfiePreviewUrl} className="rounded-3 shadow-sm" style={{ width: 80, height: 80, objectFit: 'cover' }} alt="selfie" />
                </div>
              )}

              {/* Shift Info */}
              {checkStatus?.shift && (
                <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} mb-3`}>
                  <p className="x-small text-muted mb-1 fw-bold">{t('SHIFT INFO')}</p>
                  <div className="d-flex justify-content-between">
                    <span className="small fw-bold">{checkStatus.shift.name || t('Shift')}</span>
                    <span className="small text-muted">{checkStatus.shift.start_time} - {checkStatus.shift.end_time}</span>
                  </div>
                </div>
              )}

              {/* Site Info */}
              {siteInfo && (
                <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'} mb-3`}>
                  <p className="x-small text-muted mb-1 fw-bold">{t('SITE')}</p>
                  <div className="d-flex justify-content-between">
                    <span className="small fw-bold">{siteInfo.name}</span>
                  </div>
                </div>
              )}

              {/* Manual Punch */}
              {currentUser?.role === 'admin' && (
                <button className="btn btn-outline-primary w-100 rounded-3" onClick={() => setShowManual(true)}>
                  <FontAwesomeIcon icon={faUserCheck} className="me-2" />{t('Manual Punch')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline & Analytics */}
        <div className="col-lg-8">
          {/* Alerts */}
          {checkStatus?.is_late && (
            <div className="alert alert-warning d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm mb-4">
              <FontAwesomeIcon icon={faTriangleExclamation} /><strong>{t('Late Arrival')}</strong> - {t('You arrived')} {checkStatus.late_minutes}m {t('late')}
            </div>
          )}
          {checkStatus?.early_exit && (
            <div className="alert alert-info d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm mb-4">
              <FontAwesomeIcon icon={faBell} /><strong>{t('Early Exit')}</strong> - {t('You left')} {checkStatus.early_minutes}m {t('early')}
            </div>
          )}

          {/* Analytics Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Avg Check-In', value: checkStatus?.avg_check_in || '--', icon: faSignInAlt, color: 'success' },
              { label: 'Avg Check-Out', value: checkStatus?.avg_check_out || '--', icon: faSignOutAlt, color: 'danger' },
              { label: 'Avg Hours', value: checkStatus?.avg_hours ? `${checkStatus.avg_hours}h` : '--', icon: faStopwatch, color: 'info' },
              { label: 'On-Time %', value: checkStatus?.on_time_percent ? `${checkStatus.on_time_percent}%` : '--', icon: faChartLine, color: 'primary' }
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-3 text-center">
                    <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color} fs-4 mb-2`} />
                    <p className="fw-bold mb-0 small">{stat.value}</p>
                    <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t(stat.label)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Timeline */}
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faClock} className="me-2 text-primary" />{t("Today's Timeline")}</h6>
              <span className="badge bg-primary rounded-pill">{todayPunches.length} {t('punches')}</span>
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
              ) : todayPunches.length === 0 ? (
                <p className={`text-center text-muted small mb-0 ${isDark ? 'text-light opacity-50' : ''}`}>{t('No punches today')}</p>
              ) : (
                <div className="timeline-vertical d-flex flex-column gap-3">
                  <style>{`
                    .timeline-item { position: relative; padding-left: 30px; }
                    .timeline-item::before { content: ''; position: absolute; left: 8px; top: 24px; bottom: -16px; width: 2px; background: #dee2e6; }
                    .timeline-item:last-child::before { display: none; }
                    .timeline-dot { position: absolute; left: 0; top: 4px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                  `}</style>
                  {todayPunches.map((p, i) => (
                    <div key={i} className="timeline-item">
                      <div className={`timeline-dot ${p.type === 'out' ? 'bg-danger' : 'bg-success'} text-white`}>
                        <FontAwesomeIcon icon={p.type === 'out' ? faSignOutAlt : faSignInAlt} size="xs" />
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="fw-bold small mb-0">{p.type === 'out' ? t('Check Out') : t('Check In')}</p>
                          <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{p.site?.name || t('Main Office')}</p>
                        </div>
                        <div className="text-end">
                          <p className="fw-bold mb-0">{p.time || p.clock_in || p.clock_out}</p>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success x-small" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Punches Table */}
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Recent Punches')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Date')}</th>
                    <th>{t('In')}</th>
                    <th>{t('Out')}</th>
                    <th>{t('Hours')}</th>
                    <th className="pe-4">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                  ) : attendance.slice(0, 7).map(r => (
                    <tr key={r.id}>
                      <td className="ps-4">{new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                      <td className="text-success fw-bold">{r.clock_in || '--'}</td>
                      <td className="text-danger fw-bold">{r.clock_out || '--'}</td>
                      <td>{r.total_hours || '--'}</td>
                      <td className="pe-4">
                        <span className={`badge rounded-pill ${r.status === 'Present' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Punch Modal */}
      {showManual && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{t('Manual Punch')}</h5>
                <button className="btn-close" onClick={() => setShowManual(false)} />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">{t('Punch Type')}</label>
                  <select className="form-select rounded-3">
                    <option value="in">{t('Check In')}</option>
                    <option value="out">{t('Check Out')}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">{t('Date & Time')}</label>
                  <input type="datetime-local" className="form-control rounded-3" />
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">{t('Reason')}</label>
                  <textarea className="form-control rounded-3" rows="2" placeholder={t('Reason for manual punch...')} />
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowManual(false)}>{t('Cancel')}</button>
                <button className="btn btn-primary rounded-3 px-4">{t('Submit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOut;
