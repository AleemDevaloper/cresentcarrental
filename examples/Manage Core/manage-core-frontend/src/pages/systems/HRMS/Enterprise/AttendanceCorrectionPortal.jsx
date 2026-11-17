import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faExclamationTriangle, faCheckCircle, faTimes, faEye,
  faUpload, faFile, faUserCheck, faFilter, faPlus, faChartBar,
  faArrowRight, faSearch, faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listAttendanceCorrections, createAttendanceCorrection, updateAttendanceCorrectionStatus, deleteAttendanceCorrection } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

const AttendanceCorrectionPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const [formData, setFormData] = useState({
    request_type: 'Missing Punch',
    correction_date: '',
    time_in: '',
    time_out: '',
    reason: '',
    attachment: null
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter !== 'All') {
        const filterMap = { 'Pending': 'pending', 'Approved': 'approved', 'Rejected': 'rejected', 'Manager_Review': 'manager_review', 'HR_Verification': 'hr_verified' };
        params.status = filterMap[filter] || filter.toLowerCase();
      }
      const data = await listAttendanceCorrections(params);
      setCorrections(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, employee_id: currentUser?.id };
      delete payload.attachment;
      await createAttendanceCorrection(payload);
      addNotification(t('correction_submitted'), 'success');
      setShowModal(false);
      setFormData({ request_type: 'Missing Punch', correction_date: '', time_in: '', time_out: '', reason: '', attachment: null });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_submitting'), 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAttendanceCorrectionStatus(id, status);
      addNotification(t('status_updated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await deleteAttendanceCorrection(id);
      addNotification(t('deleted'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_deleting'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'hr_verified': return 'bg-info-subtle text-info border-info';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const statsCards = [
    { label: t('total_requests'), value: corrections.length, icon: faFile, color: '#4f46e5' },
    { label: t('approved'), value: corrections.filter(c => c.status === 'approved').length, icon: faCheckCircle, color: '#10b981' },
    { label: t('rejected'), value: corrections.filter(c => c.status === 'rejected').length, icon: faTimes, color: '#ef4444' },
    { label: t('compliance_rate'), value: corrections.length > 0 ? `${Math.round((corrections.filter(c => c.status === 'approved').length / corrections.length) * 100)}%` : '0%', icon: faChartBar, color: '#8b5cf6' },
  ];

  const requestTypes = ['Missing Punch', 'Late Entry', 'Early Exit'];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('attendance_correction_portal')}</h4><p className="text-muted small mb-0">{t('manage_attendance_exceptions')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && corrections.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('attendance_correction_portal')}</h4>
          <p className="text-muted small mb-0">{t('manage_attendance_exceptions')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_request')}
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{t('review_queue')}</h5>
            <div className="d-flex gap-2 flex-wrap">
              {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                <button key={f} className={`btn btn-sm rounded-pill px-3 ${filter === f ? 'btn-primary' : isDark ? 'btn-outline-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>{t(f.toLowerCase().replace('_', '_'))}</button>
              ))}
            </div>
          </div>
          {corrections.length > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('type')}</th><th>{t('date')}</th><th>{t('reason')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                <tbody>
                  {corrections.map(c => (
                    <tr key={c.id}>
                      <td><div className="small fw-bold">{c.user?.name || currentUser?.name || 'N/A'}</div></td>
                      <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${c.request_type === 'Missing Punch' ? '#4f46e5' : c.request_type === 'Late Entry' ? '#f59e0b' : '#ef4444'}20`, color: c.request_type === 'Missing Punch' ? '#4f46e5' : c.request_type === 'Late Entry' ? '#f59e0b' : '#ef4444' }}>{c.request_type}</span></td>
                      <td className="small">{c.correction_date ? new Date(c.correction_date).toLocaleDateString() : '-'}</td>
                      <td className="small text-muted">{c.reason || '-'}</td>
                      <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(c.status)}`}>{c.status}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          {c.status === 'pending' && (
                            <>
                              <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(c.id, 'approved')}><FontAwesomeIcon icon={faCheckCircle} /></button>
                              <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(c.id, 'rejected')}><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                          )}
                          <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                          {c.status === 'pending' && (
                            <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(c.id)}><FontAwesomeIcon icon={faTrash} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted small">{t('no_corrections')}</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('new_correction_request')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('request_type')}</label>
                      <select className="form-select rounded-3" value={formData.request_type} onChange={e => setFormData({ ...formData, request_type: e.target.value })}>
                        {requestTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('correction_date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.correction_date} onChange={e => setFormData({ ...formData, correction_date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('time_in')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.time_in} onChange={e => setFormData({ ...formData, time_in: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('time_out')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.time_out} onChange={e => setFormData({ ...formData, time_out: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('attachment')}</label>
                      <input type="file" className="form-control rounded-3" onChange={e => setFormData({ ...formData, attachment: e.target.files[0] })} />
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
      `}} />
    </div>
  );
};

export default AttendanceCorrectionPortal;
