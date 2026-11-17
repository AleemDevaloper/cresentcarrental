import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot, faRuler, faCheckCircle, faTimesCircle, faHistory,
  faChartPie, faShield, faExclamationTriangle, faSatelliteDish
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites } from '../../../../api/hrms';
import { apiRequest } from '../../../../api/client';

const SiteGpsRadius = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(true);
  const [violations] = useState([]);
  const [radiusHistory, setRadiusHistory] = useState([]);

  const fetchData = async () => {
    try {
      const data = await listSites();
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0].id.toString());
        setRadius(data[0].radius || 100);
      }
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveRadius = async () => {
    try {
      await apiRequest(`/api/v1/sites/${selectedSite}`, { method: 'PATCH', body: { radius } });
      addNotification(t('Radius updated'), 'success');
      setRadiusHistory(prev => [{ radius, date: new Date().toLocaleString() }, ...prev]);
    } catch { addNotification(t('Error saving radius'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faLocationDot} className="me-2 text-primary" />{t('GPS Radius Configuration')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Configure geofence validation per site')}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : sites.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faLocationDot} className="fs-1 text-muted mb-3 opacity-50" />
          <p className="text-muted">{t('No sites available')}</p>
        </div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-5">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <label className="small fw-bold text-muted mb-2">{t('Select Site')}</label>
              <select className="form-select rounded-3 mb-4" value={selectedSite} onChange={e => {
                setSelectedSite(e.target.value);
                const site = sites.find(s => s.id.toString() === e.target.value);
                if (site) setRadius(site.radius || 100);
              }}>
                {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label className="small fw-bold text-muted mb-2">{t('Allowed GPS Radius')}: <strong>{radius}m</strong></label>
              <input type="range" className="form-range mb-3" min="10" max="500" step="10" value={radius}
                onChange={e => setRadius(parseInt(e.target.value))} />
              <div className="d-flex justify-content-between x-small text-muted mb-4">
                <span>10m</span><span>500m</span>
              </div>

              <button className="btn btn-primary w-100 rounded-3" onClick={handleSaveRadius}>
                <FontAwesomeIcon icon={faShield} className="me-2" />{t('Save Configuration')}
              </button>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faSatelliteDish} className="me-2 text-info" />{t('GPS Accuracy Requirements')}</h6>
              <div className={`p-3 rounded-3 mb-2 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                <div className="d-flex justify-content-between">
                  <span className="small">{t('Minimum Accuracy')}</span>
                  <span className="fw-bold small">50m</span>
                </div>
              </div>
              <div className={`p-3 rounded-3 mb-2 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                <div className="d-flex justify-content-between">
                  <span className="small">{t('Recommended Accuracy')}</span>
                  <span className="fw-bold small text-success">10m</span>
                </div>
              </div>
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                <div className="d-flex justify-content-between">
                  <span className="small">{t('Max Allowed Distance')}</span>
                  <span className="fw-bold small">{radius}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4 text-center">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartPie} className="me-2 text-primary" />{t('Validation Status')}</h6>
              <div className={`p-4 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                <FontAwesomeIcon icon={faChartPie} className="fs-1 text-muted mb-2 opacity-50" />
                <p className="text-muted small mb-0">{t('Stats available after attendance tracking')}</p>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />{t('Violation Attempt Log')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Employee')}</th>
                    <th>{t('Time')}</th>
                    <th>{t('Distance')}</th>
                    <th>{t('Radius')}</th>
                    <th className="pe-4">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">{t('No violations recorded')}</td></tr>
                  ) : violations.map((v, i) => (
                    <tr key={i}>
                      <td className="ps-4">{v.employee}</td>
                      <td>{v.time}</td>
                      <td>{v.distance}m</td>
                      <td>{v.radius}m</td>
                      <td className="pe-4"><FontAwesomeIcon icon={faTimesCircle} className="text-danger" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Radius Adjustment History')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Date')}</th>
                    <th>{t('Radius')}</th>
                    <th className="pe-4">{t('Changed By')}</th>
                  </tr>
                </thead>
                <tbody>
                  {radiusHistory.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">{t('No adjustments yet')}</td></tr>
                  ) : radiusHistory.map((r, i) => (
                    <tr key={i}>
                      <td className="ps-4">{r.date}</td>
                      <td className="fw-bold">{r.radius}m</td>
                      <td className="pe-4">{t('You')}</td>
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

export default SiteGpsRadius;
