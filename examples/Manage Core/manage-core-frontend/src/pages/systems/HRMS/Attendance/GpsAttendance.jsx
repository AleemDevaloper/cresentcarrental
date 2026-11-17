import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot, faCrosshairs, faMapLocation, faCheckCircle,
  faTimesCircle, faShield, faHistory, faRuler, faSatelliteDish,
  faCircleInfo, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites, gpsValidate, getSiteStats } from '../../../../api/hrms';

const GpsAttendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [gps, setGps] = useState({ latitude: 0, longitude: 0, accuracy: 0 });
  const [sites, setSites] = useState([]);
  const [assignedSite, setAssignedSite] = useState(null);
  const [distance, setDistance] = useState(null);
  const [inRadius, setInRadius] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [gpsLog, setGpsLog] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [address, setAddress] = useState('');
  const [gpsError, setGpsError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const siteList = await listSites();
        setSites(siteList || []);

        let assigned = null;
        if (Array.isArray(siteList)) {
          assigned = siteList.find(s => s.is_assigned) || siteList[0] || null;
        }
        setAssignedSite(assigned);
      } catch {
        addNotification(t('Failed to load site data'), 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [addNotification, t]);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsError(t('GPS not available'));
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const data = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        };
        setGps(data);
        setGpsLog(prev => [...prev.slice(-19), { ...data, time: new Date().toLocaleTimeString() }]);
        setGpsError(null);

        if (data.latitude && data.longitude) {
          setValidating(true);
          try {
            const result = await gpsValidate({
              latitude: data.latitude,
              longitude: data.longitude
            });
            setValidationResult(result);
            if (result) {
              setDistance(result.distance);
              setInRadius(result.within_radius);
              if (result.site) setAssignedSite(result.site);
              if (result.address) setAddress(result.address);
            }
          } catch {
            if (assignedSite) {
              calcDistance(data, assignedSite);
            }
          } finally {
            setValidating(false);
          }
        }
      },
      (err) => {
        setGpsError(t('GPS access denied'));
        addNotification(t('GPS access denied'), 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [assignedSite]);

  const calcDistance = (gpsData, site) => {
    if (!site?.latitude || !site?.longitude) return;
    const R = 6371e3;
    const φ1 = gpsData.latitude * Math.PI / 180;
    const φ2 = parseFloat(site.latitude) * Math.PI / 180;
    const Δφ = (parseFloat(site.latitude) - gpsData.latitude) * Math.PI / 180;
    const Δλ = (parseFloat(site.longitude) - gpsData.longitude) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    setDistance(d);
    setInRadius(d <= (site.radius || 100));
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="row g-4">
        {/* GPS Main Card */}
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faSatelliteDish} className="me-2 text-primary" />{t('GPS Location Tracking')}</h5>
                <span className={`badge ${validationResult?.anti_spoof === 'clean' || (!validationResult && !gpsError) ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                  <FontAwesomeIcon icon={faShield} className="me-1" />{t('Secure')}
                </span>
              </div>

              {/* Coordinates Display */}
              <div className={`p-4 rounded-4 mb-4 ${isDark ? 'bg-dark' : 'bg-light'} text-center`}>
                <FontAwesomeIcon icon={faCrosshairs} className="fs-1 text-primary mb-3" />
                <h3 className="fw-bold mb-2">{gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)}</h3>
                <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {t('Accuracy')}: {gps.accuracy.toFixed(0)}m
                </p>
                {address && <p className="small text-muted mt-2">{address}</p>}
                {gpsError && <p className="small text-danger mt-2">{gpsError}</p>}
              </div>

              {/* Map Placeholder */}
              <div className={`rounded-4 mb-4 d-flex align-items-center justify-content-center ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ height: 250 }}>
                <div className="text-center">
                  <FontAwesomeIcon icon={faMapLocation} className="fs-1 text-muted mb-2 opacity-50" />
                  <p className="small text-muted mb-0">{t('Map view')}</p>
                  <p className={`x-small mb-0 ${isDark ? 'text-light opacity-25' : 'text-muted'}`}>
                    {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Site Match Status */}
              {loading ? (
                <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary" /></div>
              ) : assignedSite ? (
                <div className={`p-4 rounded-4 ${inRadius ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <FontAwesomeIcon icon={inRadius ? faCheckCircle : faTimesCircle} className={inRadius ? 'text-success fs-2' : 'text-danger fs-2'} />
                    <div>
                      <h6 className="fw-bold mb-0">{inRadius ? t('Within Site Radius') : t('Outside Site Radius')}</h6>
                      <p className="small mb-0">
                        {t('Target Site')}: {assignedSite.name} | {t('Distance')}: {distance !== null ? `${distance.toFixed(0)}m` : '...'}
                      </p>
                      {validationResult?.message && (
                        <p className="x-small mb-0 mt-1">{validationResult.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-4 bg-warning-subtle">
                  <p className="small mb-0"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />{t('No site assigned. Contact your administrator.')}</p>
                </div>
              )}

              {/* GPS Accuracy Meter */}
              <div className="mt-4">
                <p className="small fw-bold mb-2">{t('GPS Accuracy')}</p>
                <div className="progress rounded-3" style={{ height: 8 }}>
                  <div className={`progress-bar ${gps.accuracy < 10 ? 'bg-success' : gps.accuracy < 50 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${Math.max(0, 100 - gps.accuracy)}%` }} />
                </div>
                <p className={`x-small mt-1 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  {gps.accuracy < 10 ? t('Excellent') : gps.accuracy < 50 ? t('Good') : t('Poor')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location History */}
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Location History')}</h6>
            </div>
            <div className="card-body p-0" style={{ maxHeight: 500, overflowY: 'auto' }}>
              {gpsLog.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  {loading ? <div className="spinner-border spinner-border-sm text-primary" /> : t('No GPS data yet')}
                </div>
              ) : [...gpsLog].reverse().map((entry, i) => (
                <div key={i} className={`p-3 border-bottom ${isDark ? 'border-secondary' : ''}`}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="x-small fw-bold">{entry.time}</span>
                    <span className={`badge ${entry.accuracy < 10 ? 'bg-success' : 'bg-warning'} rounded-pill x-small`}>{entry.accuracy.toFixed(0)}m</span>
                  </div>
                  <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4 text-center">
              <FontAwesomeIcon icon={faShield} className="fs-1 text-success mb-2" />
              <h6 className="fw-bold">{t('Location Verified')}</h6>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                {validationResult?.verified ? t('All location checks passed') : t('Waiting for GPS fix')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GpsAttendance;
