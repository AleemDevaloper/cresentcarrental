import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePen, faClock, faUserCheck, faCheckCircle, faTimesCircle,
  faHourglassHalf, faPaperPlane, faPaperclip, faHistory,
  faArrowRight, faCircle
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listAttendanceCorrections, createAttendanceCorrection } from '../../../../api/hrms';

const REQUEST_TYPES = ['Missed Check-In', 'Missed Check-Out', 'Attendance Dispute', 'Attendance Adjustment'];
const STEPS = ['Employee', 'Manager', 'HR', 'Updated'];

const ManualAttendanceRequest = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Missed Check-In',
    correction_date: '',
    scheduled_time: '',
    actual_time: '',
    reason: '',
    attachment: null
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await listAttendanceCorrections();
      setRequests(data);
    } catch {
      addNotification(t('Failed to load requests'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.correction_date || !formData.reason) {
      addNotification(t('Please fill required fields'), 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('type', formData.type);
      payload.append('correction_date', formData.correction_date);
      if (formData.scheduled_time) payload.append('scheduled_time', formData.scheduled_time);
      if (formData.actual_time) payload.append('actual_time', formData.actual_time);
      payload.append('reason', formData.reason);
      if (formData.attachment) payload.append('attachment', formData.attachment);

      await createAttendanceCorrection(payload);
      addNotification(t('Request submitted successfully'), 'success');
      setShowForm(false);
      setFormData({
        type: 'Missed Check-In',
        correction_date: '',
        scheduled_time: '',
        actual_time: '',
        reason: '',
        attachment: null
      });
      await fetchRequests();
    } catch (err) {
      addNotification(err?.message || t('Error submitting request'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Pending': { color: 'warning', icon: faHourglassHalf },
      'Manager Approved': { color: 'info', icon: faUserCheck },
      'HR Verified': { color: 'primary', icon: faCheckCircle },
      'Completed': { color: 'success', icon: faCheckCircle },
      'Rejected': { color: 'danger', icon: faTimesCircle },
      'approved': { color: 'success', icon: faCheckCircle },
      'rejected': { color: 'danger', icon: faTimesCircle },
      'pending': { color: 'warning', icon: faHourglassHalf },
    };
    const s = map[status] || map['Pending'];
    return (
      <span className={`badge bg-${s.color}-subtle text-${s.color} rounded-pill`}>
        <FontAwesomeIcon icon={s.icon} className="me-1" />{t(status)}
      </span>
    );
  };

  const getCurrentStep = () => {
    const completedStatuses = ['Completed', 'HR Verified', 'Manager Approved'];
    for (let i = requests.length - 1; i >= 0; i--) {
      if (completedStatuses.includes(requests[i].status)) return STEPS.length;
      if (requests[i].status === 'Manager Approved') return 2;
      if (requests[i].status === 'Pending') return 1;
    }
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faFilePen} className="me-2 text-primary" />{t('Attendance Correction')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Request manual attendance adjustments')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2" />{t('New Request')}
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* My Requests Table */}
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2" />{t('My Requests')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Type')}</th>
                    <th>{t('Date')}</th>
                    <th>{t('Reason')}</th>
                    <th>{t('Status')}</th>
                    <th className="pe-4">{t('Date Requested')}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                  ) : requests.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">{t('No correction requests')}</td></tr>
                  ) : requests.map(r => (
                    <tr key={r.id}>
                      <td className="ps-4 fw-bold">{t(r.type || r.request_type)}</td>
                      <td>{r.correction_date || r.date}</td>
                      <td className={`${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{r.reason?.substring(0, 30)}...</td>
                      <td>{getStatusBadge(r.status)}</td>
                      <td className="pe-4">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Approval Workflow Visualization */}
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">{t('Approval Workflow')}</h6>
              <div className="d-flex flex-column align-items-center gap-3">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="d-flex align-items-center gap-3 w-100">
                      <div className={`p-2 rounded-circle ${i <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'}`}>
                        <FontAwesomeIcon icon={i <= currentStep ? faCheckCircle : faCircle} />
                      </div>
                      <div>
                        <p className="fw-bold small mb-0">{t(step)}</p>
                        <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                          {i < currentStep ? t('Completed') : i === currentStep ? t('In Progress') : t('Pending')}
                        </p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && <FontAwesomeIcon icon={faArrowRight} className="text-muted" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{t('New Correction Request')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Request Type')}</label>
                      <select className="form-select rounded-3" value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}>
                        {REQUEST_TYPES.map(rt => <option key={rt} value={rt}>{t(rt)}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Correction Date')}</label>
                      <input type="date" className="form-control rounded-3" required value={formData.correction_date}
                        onChange={e => setFormData({...formData, correction_date: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Scheduled Time')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.scheduled_time}
                        onChange={e => setFormData({...formData, scheduled_time: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Actual Time')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.actual_time}
                        onChange={e => setFormData({...formData, actual_time: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" required value={formData.reason}
                        onChange={e => setFormData({...formData, reason: e.target.value})}
                        placeholder={t('Explain the reason for correction...')} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Supporting Document')}</label>
                      <div className="border-2 border-dashed rounded-3 p-3 text-center cursor-pointer"
                        onClick={() => document.getElementById('attachInput').click()}>
                        <FontAwesomeIcon icon={faPaperclip} className="text-primary me-2" />
                        <span className="small text-muted">{t('Click to attach file')}</span>
                        <input id="attachInput" type="file" className="d-none"
                          onChange={e => setFormData({...formData, attachment: e.target.files[0]})} />
                      </div>
                      {formData.attachment && <p className="x-small mt-1 text-primary">{formData.attachment.name}</p>}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={submitting}>
                    {submitting ? <><div className="spinner-border spinner-border-sm me-1" />{t('Submitting')}</> : t('Submit Request')}
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

export default ManualAttendanceRequest;
