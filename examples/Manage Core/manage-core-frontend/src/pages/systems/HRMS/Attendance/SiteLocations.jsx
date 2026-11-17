import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faLocationDot, faUser, faUsers, faToggleOn,
  faToggleOff, faEdit, faTrash, faPlus, faSave, faMapLocation,
  faCircleCheck, faCircleXmark
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites } from '../../../../api/hrms';
import { apiRequest } from '../../../../api/client';
import { EnableDisableButton } from '../../../../components/common';

const SITE_TYPES = ['HQ', 'Regional Office', 'Factory', 'Warehouse', 'Project Site', 'Client Site', 'Remote'];

const SiteLocations = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSite, setEditSite] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', type: 'HQ', address: '', latitude: '', longitude: '',
    manager: '', capacity: 100, status: 'Active'
  });

  const fetchSites = async () => {
    setLoading(true);
    try {
      const data = await listSites();
      setSites(data);
    } catch { addNotification(t('Failed to load sites'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSites(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editSite) {
        await apiRequest(`/api/v1/sites/${editSite.id}`, { method: 'PATCH', body: formData });
        addNotification(t('Site updated'), 'success');
      } else {
        await apiRequest('/api/v1/sites', { method: 'POST', body: formData });
        addNotification(t('Site created'), 'success');
      }
      setShowModal(false); setEditSite(null);
      fetchSites();
    } catch { addNotification(t('Error saving site'), 'danger'); }
  };

  const toggleStatus = async (site) => {
    try {
      await apiRequest(`/api/v1/sites/${site.id}`, { method: 'PATCH', body: { status: site.status === 'Active' ? 'Inactive' : 'Active' } });
      fetchSites();
    } catch { addNotification(t('Error toggling status'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this site?'))) return;
    try {
      await apiRequest(`/api/v1/sites/${id}`, { method: 'DELETE' });
      addNotification(t('Site deleted'), 'success');
      fetchSites();
    } catch { addNotification(t('Error deleting site'), 'danger'); }
  };

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faBuilding} className="me-2 text-primary" />{t('Site Locations')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Manage enterprise locations')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditSite(null); setFormData({ name: '', code: '', type: 'HQ', address: '', latitude: '', longitude: '', manager: '', capacity: 100, status: 'Active' }); setShowModal(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Location')}
        </button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : sites.length === 0 ? (
          <div className="col-12 text-center py-5">
            <FontAwesomeIcon icon={faLocationDot} className="fs-1 text-muted mb-3 opacity-50" />
            <p className="text-muted">{t('No locations added yet')}</p>
          </div>
        ) : sites.map(site => (
          <div key={site.id} className="col-md-6 col-lg-4">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill mb-2">{site.type || 'HQ'}</span>
                    <h6 className="fw-bold mb-0">{site.name}</h6>
                    <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{site.code}</span>
                  </div>
                  <div className="d-flex gap-1">
                    <button className={`btn btn-sm rounded-3 ${site.status === 'Active' ? 'btn-success' : 'btn-secondary'}`} onClick={() => toggleStatus(site)}>
                      <FontAwesomeIcon icon={site.status === 'Active' ? faToggleOn : faToggleOff} />
                    </button>
                    <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditSite(site); setFormData(site); setShowModal(true); }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(site.id)}>
                      <FontAwesomeIcon icon={faTrash} className="text-danger" />
                    </button>
                  </div>
                </div>
                <p className={`small mb-2 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>
                  <FontAwesomeIcon icon={faLocationDot} className="me-1 text-danger" />{site.address || t('No address')}
                </p>
                <div className="mb-3">
                  <p className="x-small text-muted mb-1"><FontAwesomeIcon icon={faUser} className="me-1" />{t('Manager')}: {site.manager || t('Unassigned')}</p>
                  <p className="x-small text-muted mb-0">{t('GPS')}: {site.latitude || '--'}, {site.longitude || '--'}</p>
                </div>
                <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="x-small text-muted">{t('Capacity')}</span>
                    <span className="x-small fw-bold">{site.capacity || 0}</span>
                  </div>
                  <div className="progress rounded-3" style={{ height: 4 }}>
                    <div className="progress-bar bg-info" style={{ width: `${site.capacity ? Math.min(100, (site.capacity / site.capacity) * 100) : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editSite ? t('Edit Location') : t('Add Location')}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Location Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Code')}</label>
                      <input type="text" className="form-control rounded-3" value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Type')}</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        {SITE_TYPES.map(st => <option key={st} value={st}>{t(st)}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Address')}</label>
                      <textarea className="form-control rounded-3" rows="2" value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Latitude')}</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.latitude}
                        onChange={e => setFormData({...formData, latitude: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Longitude')}</label>
                      <input type="number" step="any" className="form-control rounded-3" value={formData.longitude}
                        onChange={e => setFormData({...formData, longitude: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Capacity')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Manager')}</label>
                      <input type="text" className="form-control rounded-3" value={formData.manager}
                        onChange={e => setFormData({...formData, manager: e.target.value})} />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <EnableDisableButton
                        checked={formData.status === 'Active'}
                        onClick={() => setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})}
                        label={t('Active')}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />{editSite ? t('Update') : t('Save Location')}
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

export default SiteLocations;
