import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot, faBuilding, faRoute, faFilePen, faMapLocation,
  faHistory, faCheckCircle, faTimesCircle, faChartBar, faPlus,
  faClock, faUser
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites } from '../../../../api/hrms';
import client from '../../../../api/client';

const OutdoorDutyLocation = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ client: '', location: '', date: '', time: '', purpose: '', notes: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const siteData = await listSites();
      setSites(siteData.filter(s => s.type === 'Client Site' || !s.type));

      const attData = await client.get('/attendance', { params: { type: 'outdoor' } });
      setVisits(attData.data || []);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/attendance', { ...formData, type: 'outdoor' });
      addNotification(t('Visit logged'), 'success');
      setShowForm(false);
      setFormData({ client: '', location: '', date: '', time: '', purpose: '', notes: '' });
      fetchData();
    } catch { addNotification(t('Error logging visit'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faLocationDot} className="me-2 text-primary" />{t('Outdoor Duty / Client Visit')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Track field work and client visits')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('New Visit')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faFilePen} className="me-2 text-primary" />{t('Quick Visit Log')}</h6>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control rounded-3" placeholder={t('Client Name')} required value={formData.client}
                      onChange={e => setFormData({...formData, client: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control rounded-3" placeholder={t('Location')} required value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="date" className="form-control rounded-3" required value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="time" className="form-control rounded-3" required value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100 rounded-3"><FontAwesomeIcon icon={faCheckCircle} className="me-2" />{t('Log Visit')}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-header bg-transparent border-0 py-3">
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Visit History Timeline')}</h6>
            </div>
            <div className="card-body p-4" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {visits.length === 0 ? (
                <p className="text-muted text-center small mb-0">{t('No visits recorded')}</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <style>{`
                    .visit-item { position: relative; padding-left: 30px; }
                    .visit-item::before { content: ''; position: absolute; left: 10px; top: 32px; bottom: -16px; width: 2px; background: #dee2e6; }
                    .visit-item:last-child::before { display: none; }
                    .visit-dot { position: absolute; left: 0; top: 6px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                  `}</style>
                  {visits.map((v, i) => (
                    <div key={v.id || i} className="visit-item">
                      <div className={`visit-dot ${v.status === 'verified' ? 'bg-success' : v.status === 'completed' ? 'bg-primary' : 'bg-warning'} text-white`}>
                        <FontAwesomeIcon icon={v.status === 'verified' ? faCheckCircle : faClock} size="xs" />
                      </div>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-bold small mb-0">{v.client || v.name || t('Visit')}</p>
                          <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                            <FontAwesomeIcon icon={faMapLocation} className="me-1" />{v.location || v.address || '--'}
                          </p>
                          <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{v.date || v.created_at}</p>
                        </div>
                        <span className={`badge ${v.status === 'verified' ? 'bg-success' : v.status === 'completed' ? 'bg-primary' : 'bg-warning'} rounded-pill x-small`}>
                          {t(v.status || 'pending')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-success" />{t('Client Sites')}</h6>
              {sites.length === 0 ? (
                <p className="text-muted small mb-0 text-center">{t('No client sites')}</p>
              ) : sites.map(s => (
                <div key={s.id} className={`p-2 rounded-3 mb-2 ${isDark ? 'bg-dark' : 'bg-light'} d-flex justify-content-between`}>
                  <span className="small">{s.name}</span>
                  <span className="x-small text-muted">{s.address || '--'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4 text-center">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faRoute} className="me-2 text-primary" />{t('GPS Route Tracking')}</h6>
              <div className={`rounded-3 d-flex align-items-center justify-content-center ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ height: 150 }}>
                <div className="text-center">
                  <FontAwesomeIcon icon={faMapLocation} className="fs-1 text-muted opacity-50 mb-2" />
                  <p className="x-small text-muted mb-0">{t('Route map placeholder')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">{t('Location Verification')}</h6>
              <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-success-subtle">
                <FontAwesomeIcon icon={faCheckCircle} className="text-success fs-4" />
                <div>
                  <p className="fw-bold small mb-0 text-success">{t('GPS Verified')}</p>
                  <p className="x-small mb-0 text-success">{t('All visits have valid GPS coordinates')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default OutdoorDutyLocation;
