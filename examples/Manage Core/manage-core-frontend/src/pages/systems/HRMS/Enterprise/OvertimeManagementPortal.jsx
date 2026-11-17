import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faPlus, faCheckCircle, faTimes, faEye, faChartBar,
  faDollarSign, faToggleOn, faToggleOff, faCog, faUsers,
  faCalendarAlt, faSortAmountUp, faArrowUp, faArrowDown,
  faFilter, faSearch, faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listOvertimes, createOvertime, updateOvertimeStatus, deleteOvertime, runOvertimeAutoDetect } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const OvertimeManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const [formData, setFormData] = useState({
    overtime_date: '', hours: '', reason: '', shift_type: 'Regular', employee_id: currentUser?.id || ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOvertimes();
      setOvertimes(Array.isArray(data) ? data : []);
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
      await createOvertime(formData);
      addNotification(t('overtime_submitted'), 'success');
      setShowModal(false);
      setFormData({ overtime_date: '', hours: '', reason: '', shift_type: 'Regular', employee_id: currentUser?.id || '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_submitting'), 'error');
    }
  };

  const handleAutoDetect = async () => {
    if (!autoDetect) {
      try {
        await runOvertimeAutoDetect({});
        addNotification(t('auto_detect_complete'), 'success');
        setAutoDetect(true);
        fetchData();
      } catch (err) {
        addNotification(err.message || t('auto_detect_failed'), 'error');
      }
    } else {
      setAutoDetect(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOvertimeStatus(id, status);
      addNotification(t('status_updated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await deleteOvertime(id);
      addNotification(t('deleted'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_deleting'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success';
      case 'paid': return 'bg-info-subtle text-info border-info';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const statsCards = [
    { label: t('total_overtime_hours'), value: overtimes.reduce((sum, o) => sum + parseFloat(o.hours || 0), 0), icon: faClock, color: '#4f46e5' },
    { label: t('total_cost'), value: `$${(overtimes.reduce((sum, o) => sum + parseFloat(o.hours || 0), 0) * 25).toLocaleString()}`, icon: faDollarSign, color: '#10b981' },
    { label: t('pending_approval'), value: overtimes.filter(o => o.status === 'pending').length, icon: faEye, color: '#f59e0b' },
    { label: t('this_month'), value: overtimes.filter(o => new Date(o.overtime_date).getMonth() === new Date().getMonth()).length, icon: faCalendarAlt, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('overtime_management')}</h4><p className="text-muted small mb-0">{t('manage_overtime_requests')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && overtimes.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('overtime_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_overtime_requests')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className={`btn rounded-3 ${autoDetect ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAutoDetect}>
            <FontAwesomeIcon icon={autoDetect ? faToggleOn : faToggleOff} className="me-1" /> {t('auto_detect')}
          </button>
          <button className="btn btn-outline-secondary rounded-3" onClick={() => setShowRules(!showRules)}>
            <FontAwesomeIcon icon={faCog} className="me-1" /> {t('rules')}
          </button>
          <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_request')}
          </button>
        </div>
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
          <h5 className="fw-bold mb-3">{t('overtime_requests')}</h5>
          {overtimes.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('date')}</th><th>{t('hours')}</th><th>{t('shift')}</th><th>{t('reason')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                <tbody>
                  {overtimes.map(o => (
                    <tr key={o.id}>
                      <td><div className="small fw-bold">{o.user?.name || 'N/A'}</div></td>
                      <td className="small">{o.overtime_date ? new Date(o.overtime_date).toLocaleDateString() : '-'}</td>
                      <td className="small fw-bold">{o.hours}h</td>
                      <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${o.shift_type === 'Holiday' ? '#ef4444' : o.shift_type === 'Weekend' ? '#f59e0b' : '#4f46e5'}20`, color: o.shift_type === 'Holiday' ? '#ef4444' : o.shift_type === 'Weekend' ? '#f59e0b' : '#4f46e5' }}>{o.shift_type}</span></td>
                      <td className="small text-muted">{o.reason || '-'}</td>
                      <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(o.status)}`}>{o.status}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          {o.status === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(o.id, 'approved')}><FontAwesomeIcon icon={faCheckCircle} /></button>
                              <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(o.id, 'rejected')}><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                          )}
                          <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                          {o.status === 'pending' && (
                            <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(o.id)}><FontAwesomeIcon icon={faTrash} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted small">{t('no_overtime_requests')}</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('request_overtime')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('overtime_date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.overtime_date} onChange={e => setFormData({ ...formData, overtime_date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('hours')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.hours} onChange={e => setFormData({ ...formData, hours: e.target.value })} min="1" max="12" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('shift_type')}</label>
                      <select className="form-select rounded-3" value={formData.shift_type} onChange={e => setFormData({ ...formData, shift_type: e.target.value })}>
                        {['Regular', 'Holiday', 'Weekend', 'Night'].map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('submit')}</button>
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
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
      `}} />
    </div>
  );
};

export default OvertimeManagementPortal;
