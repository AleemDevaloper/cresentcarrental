import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLaptop, faMobile, faIdCard, faSimCard, faCar, faCheckCircle,
  faTimes, faClock, faEye, faPlus, faFilter, faChartBar,
  faBuilding, faDesktop, faArchive, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listAssetClearances, createAssetClearance, updateAssetClearance, finalizeAssetClearance } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AssetClearancePortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    laptop_returned: false,
    mobile_returned: false,
    sim_card_returned: false,
    id_card_returned: false,
    vehicle_returned: false,
    notes: ''
  });

  const assetFields = [
    { key: 'laptop_returned', label: 'Laptop', icon: faLaptop, color: '#4f46e5' },
    { key: 'mobile_returned', label: 'Mobile', icon: faMobile, color: '#10b981' },
    { key: 'sim_card_returned', label: 'SIM Card', icon: faSimCard, color: '#f59e0b' },
    { key: 'id_card_returned', label: 'ID Card', icon: faIdCard, color: '#ec4899' },
    { key: 'vehicle_returned', label: 'Vehicle', icon: faCar, color: '#8b5cf6' },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAssetClearances();
      setClearances(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAssetClearance(formData);
      addNotification(t('clearance_created'), 'success');
      setShowModal(false);
      setFormData({ employee_id: '', laptop_returned: false, mobile_returned: false, sim_card_returned: false, id_card_returned: false, vehicle_returned: false, notes: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_creating'), 'error');
    }
  };

  const handleFinalize = async (id) => {
    try {
      await finalizeAssetClearance(id);
      addNotification(t('clearance_finalized'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_finalizing'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'completed': return 'bg-success-subtle text-success border-success';
      case 'in_progress': return 'bg-info-subtle text-info border-info';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const toggleAsset = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const statsCards = [
    { label: t('total_clearances'), value: clearances.length, icon: faArchive, color: '#4f46e5' },
    { label: t('completed'), value: clearances.filter(c => c.status === 'completed').length, icon: faCheckCircle, color: '#10b981' },
    { label: t('in_progress'), value: clearances.filter(c => c.status === 'in_progress').length, icon: faClock, color: '#f59e0b' },
    { label: t('recovery_rate'), value: clearances.length > 0 ? `${Math.round((clearances.filter(c => c.status === 'completed').length / clearances.length) * 100)}%` : '0%', icon: faChartBar, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('asset_clearance_portal')}</h4><p className="text-muted small mb-0">{t('manage_asset_recovery')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && clearances.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('asset_clearance_portal')}</h4>
          <p className="text-muted small mb-0">{t('manage_asset_recovery')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_clearance')}
        </button>
      </div>

      <div className="row g-3 mb-4">
        {statsCards.map((s, i) => (
          <div key={i} className="col-md-3">
            <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">{t('clearance_records')}</h5>
          {clearances.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('assets')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                <tbody>
                  {clearances.map(c => (
                    <tr key={c.id}>
                      <td><div className="small fw-bold">{c.user?.name || c.employee_name || 'N/A'}</div></td>
                      <td>
                        <div className="d-flex gap-1">
                          {assetFields.map(a => c[a.key] && <FontAwesomeIcon key={a.key} icon={a.icon} className="text-success" title={a.label} />)}
                        </div>
                      </td>
                      <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          {c.status !== 'completed' && (
                            <button className="btn btn-sm btn-success rounded-3" onClick={() => handleFinalize(c.id)}><FontAwesomeIcon icon={faCheckCircle} /></button>
                          )}
                          <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted small">{t('no_clearances')}</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('new_clearance')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('employee')}</label>
                      <input type="text" className="form-control rounded-3" placeholder={t('employee_id')} value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('assets_to_return')}</label>
                      {assetFields.map((a, i) => (
                        <div key={i} className="form-check mb-1">
                          <input className="form-check-input" type="checkbox" id={`asset-${i}`} checked={formData[a.key]} onChange={() => toggleAsset(a.key)} />
                          <label className="form-check-label small" htmlFor={`asset-${i}`}><FontAwesomeIcon icon={a.icon} className="me-1" style={{ color: a.color }} />{a.label}</label>
                        </div>
                      ))}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('notes')}</label>
                      <textarea className="form-control rounded-3" rows="2" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('create')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
      `}} />
    </div>
  );
};

export default AssetClearancePortal;
