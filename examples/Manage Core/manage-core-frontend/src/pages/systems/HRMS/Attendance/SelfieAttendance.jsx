import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera, faFaceSmile, faShield, faCheckCircle, faTimesCircle,
  faHistory, faImage, faSliders, faRobot, faCircleExclamation,
  faClockRotateLeft, faCloudArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getPhotoHistory, clockIn } from '../../../../api/hrms';

const SelfieAttendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [photoHistory, setPhotoHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [capturedFile, setCapturedFile] = useState(null);
  const [capturedPreview, setCapturedPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getPhotoHistory();
      setPhotoHistory(data || []);
    } catch {
      addNotification(t('Failed to load photo history'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setCapturedFile(file);
    setCapturedPreview(URL.createObjectURL(file));
    setUploadResult(null);
  };

  useEffect(() => {
    return () => {
      if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    };
  }, [capturedPreview]);

  const handleUpload = async () => {
    if (!capturedFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('selfie', capturedFile);
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          formData.append('latitude', pos.coords.latitude);
          formData.append('longitude', pos.coords.longitude);
        } catch {}
      }
      const result = await clockIn(formData);
      setUploadResult(result);
      addNotification(t('Selfie uploaded and clocked in'), 'success');
      setCapturedFile(null);
      setCapturedPreview(null);
      await fetchHistory();
    } catch (err) {
      addNotification(err?.message || t('Upload failed'), 'danger');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="row g-4">
        {/* Camera & Capture */}
        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3 d-flex justify-content-between align-items-center`}>
              <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faCamera} className="me-2 text-primary" />{t('Facial Verification')}</h5>
              {uploadResult && (
                <span className={`badge ${uploadResult?.status === 'success' ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                  {uploadResult?.status === 'success' ? t('Verified') : t('Failed')}
                </span>
              )}
            </div>
            <div className="card-body p-4">
              {/* Camera Preview */}
              <div className={`rounded-4 overflow-hidden mb-4 position-relative ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ height: 320 }}>
                {!capturedPreview ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faCamera} className="fs-1 text-muted mb-3 opacity-50" />
                      <p className="text-muted">{t('Click below to capture selfie')}</p>
                    </div>
                  </div>
                ) : (
                  <img src={capturedPreview} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="captured" />
                )}
                {uploading && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="text-center text-white">
                      <div className="spinner-border mb-2" role="status" />
                      <p className="small">{t('Uploading')}...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Capture & Upload Buttons */}
              <div className="text-center mb-4">
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-primary btn-lg rounded-5 px-4 py-3 shadow" onClick={() => document.getElementById('selfieCaptureInput').click()}>
                    <FontAwesomeIcon icon={faCamera} className="me-2" />{capturedFile ? t('Retake') : t('Capture Selfie')}
                  </button>
                  {capturedFile && (
                    <button className="btn btn-success btn-lg rounded-5 px-4 py-3 shadow" onClick={handleUpload} disabled={uploading}>
                      <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" />{t('Upload & Clock In')}
                    </button>
                  )}
                </div>
                <input type="file" id="selfieCaptureInput" className="d-none" accept="image/*" capture="user" onChange={handleFileCapture} />
              </div>

              {/* Results */}
              {uploadResult && (
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className={`p-3 rounded-4 text-center ${uploadResult?.face_match ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                      <FontAwesomeIcon icon={uploadResult?.face_match ? faCheckCircle : faTimesCircle}
                        className={`fs-2 mb-2 ${uploadResult?.face_match ? 'text-success' : 'text-danger'}`} />
                      <p className="fw-bold small mb-0">{t('Face Match')}</p>
                      <p className="small mb-0">{uploadResult?.face_match ? t('Verified') : t('Unverified')}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={`p-3 rounded-4 text-center ${uploadResult?.liveness ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                      <FontAwesomeIcon icon={faFaceSmile} className={`fs-2 mb-2 ${uploadResult?.liveness ? 'text-success' : 'text-danger'}`} />
                      <p className="fw-bold small mb-0">{t('Liveness')}</p>
                      <p className="small mb-0">{uploadResult?.liveness ? t('Passed') : t('Failed')}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className={`p-3 rounded-4 text-center ${uploadResult?.fraud_status === 'clean' ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                      <FontAwesomeIcon icon={faShield} className={`fs-2 mb-2 ${uploadResult?.fraud_status === 'clean' ? 'text-success' : 'text-danger'}`} />
                      <p className="fw-bold small mb-0">{t('Fraud Detection')}</p>
                      <p className="small mb-0">{uploadResult?.fraud_status === 'clean' ? t('Clean') : t('Suspicious')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recognition Badge */}
              <div className="d-flex align-items-center gap-2 p-3 bg-info-subtle rounded-3">
                <FontAwesomeIcon icon={faRobot} className="text-info" />
                <span className="small fw-bold text-info">{t('AI Recognition Ready')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-lg-5">
          {/* Photo Comparison Slider */}
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faSliders} className="me-2 text-primary" />{t('Captured Photo')}</h6>
              {capturedPreview ? (
                <div className="rounded-3 overflow-hidden mb-3" style={{ height: 200 }}>
                  <img src={capturedPreview} className="w-100 h-100" style={{ objectFit: 'contain', backgroundColor: '#000' }} alt="selfie preview" />
                </div>
              ) : (
                <p className="text-muted small text-center">{t('Capture a selfie to preview')}</p>
              )}
            </div>
          </div>

          {/* Photo History */}
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faClockRotateLeft} className="me-2 text-info" />{t('Attendance Photo History')}</h6>
            </div>
            <div className="card-body p-3" style={{ maxHeight: 350, overflowY: 'auto' }}>
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></div>
              ) : photoHistory.length === 0 ? (
                <p className="text-muted small text-center mb-0">{t('No photos taken yet')}</p>
              ) : (
                <div className="row g-2">
                  {photoHistory.map((p, i) => (
                    <div key={p.id || i} className="col-4">
                      <div className="position-relative">
                        <img src={p.photo_url || p.url} className="w-100 rounded-3" style={{ height: 80, objectFit: 'cover' }} alt={`selfie ${i}`} />
                        {p.match_score !== undefined && (
                          <span className={`position-absolute top-0 end-0 badge rounded-pill x-small ${p.match_score >= 90 ? 'bg-success' : 'bg-warning'}`}>
                            {p.match_score}%
                          </span>
                        )}
                      </div>
                      <p className={`x-small mt-1 mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                        {p.created_at ? new Date(p.created_at).toLocaleTimeString() : p.time || ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Verification Timeline */}
            {uploadResult && (
              <div className="card-footer bg-transparent border-0 p-3">
                <p className="x-small fw-bold text-muted mb-2">{t('Verification Timeline')}</p>
                <div className="d-flex justify-content-between x-small text-muted">
                  <span>{t('Captured')}</span>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                  <span>{t('Processed')}</span>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                  <span>{t('Verified')}</span>
                  {uploadResult?.face_match ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                  ) : (
                    <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieAttendance;
