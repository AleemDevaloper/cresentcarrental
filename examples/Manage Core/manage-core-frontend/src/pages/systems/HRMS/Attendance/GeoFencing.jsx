import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapLocation, faLocationDot, faShield, faPlus, faEdit, faTrash,
  faToggleOn, faToggleOff, faCircle, faDrawPolygon, faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites, getSiteGeoFences, createGeoFence, updateGeoFence, deleteGeoFence } from '../../../../api/hrms';

const GeoFencing = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'Circular', latitude: '', longitude: '', radius: 100, active: true });
  const [editZone, setEditZone] = useState(null);

  const fetchSites = async () => {
    try {
      const data = await listSites();
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0].id.toString());
      }
    } catch { addNotification(t('Failed to load sites'), 'danger');
    } finally { setLoading(false); }
  };

  const fetchZones = async (siteId) => {
    if (!siteId) return;
    try {
      const data = await getSiteGeoFences(siteId);
      setZones(data);
    } catch { addNotification(t('Failed to load geo-fences'), 'danger'); }
  };

  useEffect(() => { fetchSites(); }, []);

  useEffect(() => {
    if (selectedSite) fetchZones(selectedSite);
  }, [selectedSite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, site_id: selectedSite };
      if (editZone) {
        await updateGeoFence(editZone.id, payload);
        addNotification(t('Zone updated'), 'success');
      } else {
        await createGeoFence(payload);
        addNotification(t('Zone created'), 'success');
      }
      setShowForm(false); setEditZone(null);
      fetchZones(selectedSite);
    } catch { addNotification(t('Error saving zone'), 'danger'); }
  };

  const toggleZone = async (zone) => {
    try {
      await updateGeoFence(zone.id, { active: !zone.active });
      fetchZones(selectedSite);
    } catch { addNotification(t('Error toggling zone'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this zone?'))) return;
    try {
      await deleteGeoFence(id);
      addNotification(t('Zone deleted'), 'success');
      fetchZones(selectedSite);
    } catch { addNotification(t('Error deleting zone'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faMapLocation} className="me-2 text-primary" />{t('Geo-Fencing')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Location-based security zones')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditZone(null); setFormData({ name: '', type: 'Circular', latitude: '', longitude: '', radius: 100, active: true }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Create Zone')}
        </button>
      </div>

      <div className="mb-4">
        <label className="small fw-bold text-muted mb-2">{t('Select Site')}</label>
        <select className="form-select rounded-3" value={selectedSite} onChange={e => setSelectedSite(e.target.value)} style={{ maxWidth: 400 }}>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="row g-3">
            {zones.length === 0 ? (
              <div className="col-12 text-center py-5">
                <FontAwesomeIcon icon={faMapLocation} className="fs-1 text-muted mb-3 opacity-50" />
                <p className="text-muted">{t('No geo-fences configured for this site')}</p>
              </div>
            ) : zones.map(zone => (
              <div key={zone.id} className="col-12">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`p-3 rounded-4 ${zone.type === 'Circular' ? 'bg-primary-subtle' : 'bg-warning-subtle'}`}>
                          <FontAwesomeIcon icon={zone.type === 'Circular' ? faCircle : faDrawPolygon} className={zone.type === 'Circular' ? 'text-primary' : 'text-warning'} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{zone.name}</h6>
                          <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                            <FontAwesomeIcon icon={faLocationDot} className="me-1" />{t(zone.type)} {t('Zone')}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button className={`btn btn-sm rounded-3 ${zone.active ? 'btn-success' : 'btn-secondary'}`} onClick={() => toggleZone(zone)}>
                          <FontAwesomeIcon icon={zone.active ? faToggleOn : faToggleOff} />
                        </button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditZone(zone); setFormData(zone); setShowForm(true); }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(zone.id)}>
                          <FontAwesomeIcon icon={faTrash} className="text-danger" />
                        </button>
                      </div>
                    </div>
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">{t('Coordinates')}</span>
                        <span className="fw-bold small">{zone.latitude || '--'}, {zone.longitude || '--'}</span>
                      </div>
                      {zone.type === 'Circular' && (
                        <div className="d-flex justify-content-between small mt-1">
                          <span className="text-muted">{t('Radius')}</span>
                          <span className="fw-bold small">{zone.radius || 0}m</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={`badge ${zone.active ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                        {zone.active ? t('Active') : t('Inactive')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4 text-center">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faMapLocation} className="me-2 text-primary" />{t('Zone Map')}</h6>
              <div className={`rounded-4 d-flex align-items-center justify-content-center ${isDark ? 'bg-dark' : 'bg-light'}`} style={{ height: 300 }}>
                <div>
                  <FontAwesomeIcon icon={faLocationDot} className="fs-1 text-muted mb-2 opacity-50" />
                  <p className="text-muted small">{t('Map visualization placeholder')}</p>
                  <p className={`x-small mb-0 ${isDark ? 'text-light opacity-25' : 'text-muted'}`}>{t('Zones displayed as overlay on map')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3 d-flex justify-content-between`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faCircleExclamation} className="me-2 text-warning" />{t('Geo Alerts')}</h6>
              <span className="badge bg-danger rounded-pill">{t('Live')}</span>
            </div>
            <div className="card-body p-4 text-center">
              <p className="text-muted small mb-0">{t('No alerts')}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editZone ? t('Edit Zone') : t('Create Geo-Fence')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Zone Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Zone Type')}</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="Circular">{t('Circular')}</option>
                        <option value="Polygon">{t('Polygon')}</option>
                      </select>
                    </div>
                    {formData.type === 'Circular' && (
                      <div className="col-md-6">
                        <label className="small fw-bold text-muted mb-2">{t('Radius (meters)')}</label>
                        <input type="number" className="form-control rounded-3" value={formData.radius}
                          onChange={e => setFormData({...formData, radius: e.target.value})} />
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Latitude')}</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.latitude}
                        onChange={e => setFormData({...formData, latitude: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Longitude')}</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.longitude}
                        onChange={e => setFormData({...formData, longitude: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faShield} className="me-2" />{editZone ? t('Update Zone') : t('Create Zone')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoFencing;
