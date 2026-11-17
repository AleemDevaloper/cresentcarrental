import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle, faCheckCircle, faTimesCircle, faHistory,
  faUserCheck, faChartBar, faRefresh, faChartLine, faBuilding,
  faHourglassHalf, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  listAttendanceCorrections,
  createAttendanceCorrection,
  updateAttendanceCorrectionStatus
} from '../../../../api/hrms';

const MissingPunchCorrection = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [formData, setFormData] = useState({
    type: 'missing_punch',
    correction_date: '',
    scheduled_time: '',
    actual_time: '',
    reason: ''
  });

  const fetchCorrections = async () => {
    setLoading(true);
    try {
      const data = await listAttendanceCorrections({ type: 'missing_punch' });
      setCorrections(data || []);
    } catch {
      addNotification(t('Failed to load'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCorrections(); }, []);

  const handleCreateCorrection = async (e) => {
    e.preventDefault();
    if (!formData.correction_date || !formData.reason) {
      addNotification(t('Please fill required fields'), 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await createAttendanceCorrection({
        ...formData,
        correction_date: formData.correction_date,
        scheduled_time: formData.scheduled_time || undefined,
        actual_time: formData.actual_time || undefined
      });
      addNotification(t('Correction created'), 'success');
      setShowForm(false);
      setFormData({ type: 'missing_punch', correction_date: '', scheduled_time: '', actual_time: '', reason: '' });
      await fetchCorrections();
    } catch (err) {
      addNotification(err?.message || t('Error creating correction'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAttendanceCorrectionStatus(id, status);
      addNotification(t(`Correction ${status}`), 'success');
      await fetchCorrections();
    } catch (err) {
      addNotification(err?.message || t('Status update failed'), 'danger');
    }
  };

  const filteredCorrections = corrections.filter(c => {
    if (activeTab === 'pending') return c.status === 'Pending' || c.status === 'pending';
    if (activeTab === 'manager_approval') return c.status === 'Manager Approved' || c.status === 'manager_approved';
    if (activeTab === 'hr_verification') return c.status === 'HR Verified' || c.status === 'hr_verified';
    if (activeTab === 'completed') return c.status === 'Completed' || c.status === 'completed' || c.status === 'approved' || c.status === 'rejected';
    return true;
  });

  const totalCorrections = corrections.length;
  const approvedCount = corrections.filter(c => c.status === 'approved' || c.status === 'Completed').length;
  const rejectedCount = corrections.filter(c => c.status === 'rejected' || c.status === 'Rejected').length;
  const approvalRate = totalCorrections > 0 ? Math.round((approvedCount / totalCorrections) * 100) : 0;
  const rejectionRate = totalCorrections > 0 ? Math.round((rejectedCount / totalCorrections) * 100) : 0;

  const departmentStats = corrections.reduce((acc, c) => {
    const dept = c.department || c.department_name || 'Other';
    if (!acc[dept]) acc[dept] = 0;
    acc[dept]++;
    return acc;
  }, {});

  const deptEntries = Object.entries(departmentStats).sort((a, b) => b[1] - a[1]);
  const totalDept = deptEntries.reduce((s, [, v]) => s + v, 0);

  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'admin';

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />{t('Missing Punch Correction')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Detect and resolve missing punches')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary rounded-3" onClick={fetchCorrections} disabled={loading}>
            <FontAwesomeIcon icon={faRefresh} className={`me-2 ${loading ? 'fa-spin' : ''}`} />{t('Refresh')}
          </button>
          <button className="btn btn-primary rounded-3" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />{t('New Correction')}
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Missing Punch Rate', value: totalCorrections > 0 ? `${Math.round((totalCorrections / Math.max(totalCorrections + 100, 1)) * 100)}%` : '0%', icon: faExclamationTriangle, color: 'warning' },
          { label: 'Total Corrections', value: totalCorrections, icon: faHistory, color: 'info' },
          { label: 'Approved %', value: `${approvalRate}%`, icon: faCheckCircle, color: 'success' },
          { label: 'Rejection Rate', value: `${rejectionRate}%`, icon: faTimesCircle, color: 'danger' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`p-3 rounded-3 bg-${s.color}-subtle`}>
                  <FontAwesomeIcon icon={s.icon} className={`text-${s.color} fs-4`} />
                </div>
                <div>
                  <p className="h5 fw-bold mb-0">{s.value}</p>
                  <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t(s.label)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        {['pending', 'manager_approval', 'hr_verification', 'completed'].map(tab => (
          <button key={tab} className={`btn btn-sm rounded-3 ${activeTab === tab ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            onClick={() => setActiveTab(tab)}>
            {t(tab === 'pending' ? 'Pending' : tab === 'manager_approval' ? 'Manager Approval' : tab === 'hr_verification' ? 'HR Verification' : 'Completed')}
          </button>
        ))}
      </div>

      {/* Department Comparison */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-primary" />{t('Department Missing Punch Comparison')}</h6>
              {deptEntries.length === 0 ? (
                <p className="text-muted small text-center">{t('No data available')}</p>
              ) : deptEntries.slice(0, 6).map(([dept, count]) => {
                const pct = totalDept > 0 ? Math.round((count / totalDept) * 100) : 0;
                return (
                  <div key={dept} className="d-flex align-items-center gap-2 mb-2">
                    <span className="small flex-grow-1">{dept}</span>
                    <div className="progress flex-grow-1 rounded-3" style={{ height: 6 }}>
                      <div className="progress-bar bg-warning" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="x-small fw-bold">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />{t('Correction Status Breakdown')}</h6>
              {['Pending', 'Approved', 'Rejected'].map(status => {
                const count = status === 'Pending'
                  ? corrections.filter(c => c.status === 'Pending' || c.status === 'pending').length
                  : status === 'Approved'
                    ? approvedCount
                    : rejectedCount;
                const pct = totalCorrections > 0 ? Math.round((count / totalCorrections) * 100) : 0;
                const barColor = status === 'Pending' ? 'bg-warning' : status === 'Approved' ? 'bg-success' : 'bg-danger';
                return (
                  <div key={status} className="d-flex align-items-center gap-2 mb-2">
                    <span className="small flex-grow-1">{t(status)}</span>
                    <div className="progress flex-grow-1 rounded-3" style={{ height: 6 }}>
                      <div className={`progress-bar ${barColor}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="x-small fw-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Corrections Table */}
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
        <div className={`card-header bg-transparent border-0 py-3`}>
          <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2" />{t('Corrections')}</h6>
        </div>
        <div className="table-responsive">
          <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr>
                <th className="ps-4">{t('Employee')}</th>
                <th>{t('Date')}</th>
                <th>{t('Punch Type')}</th>
                <th>{t('Reason')}</th>
                <th>{t('Status')}</th>
                <th className="pe-4">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
              ) : filteredCorrections.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-muted">{t('No corrections')}</td></tr>
              ) : filteredCorrections.map(c => (
                <tr key={c.id}>
                  <td className="ps-4 fw-bold">{c.employee_name || c.employee?.name || '--'}</td>
                  <td>{c.correction_date || c.date}</td>
                  <td><span className="badge bg-info-subtle text-info">{c.punch_type || c.type || '--'}</span></td>
                  <td className={`${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{c.reason?.substring(0, 25)}</td>
                  <td>
                    <span className={`badge ${c.status === 'approved' || c.status === 'Completed' ? 'bg-success' : c.status === 'rejected' || c.status === 'Rejected' ? 'bg-danger' : 'bg-warning'} rounded-pill`}>
                      {t(c.status)}
                    </span>
                  </td>
                  <td className="pe-4">
                    {(c.status === 'Pending' || c.status === 'pending') && isManager && (
                      <>
                        <button className="btn btn-sm btn-success rounded-3 me-1" onClick={() => handleUpdateStatus(c.id, 'approved')}
                          title={t('Approve')}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                        <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleUpdateStatus(c.id, 'rejected')}
                          title={t('Reject')}>
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </>
                    )}
                    {c.status !== 'Pending' && c.status !== 'pending' && (
                      <span className="x-small text-muted">{t('No actions')}</span>
                    )}
                    {!isManager && (
                      <span className="x-small text-muted">{t('Awaiting approval')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Correction Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{t('New Correction')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleCreateCorrection}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Date')}</label>
                      <input type="date" className="form-control rounded-3" required value={formData.correction_date}
                        onChange={e => setFormData({...formData, correction_date: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Scheduled')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.scheduled_time}
                        onChange={e => setFormData({...formData, scheduled_time: e.target.value})} />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-muted mb-2">{t('Actual')}</label>
                      <input type="time" className="form-control rounded-3" value={formData.actual_time}
                        onChange={e => setFormData({...formData, actual_time: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" required value={formData.reason}
                        onChange={e => setFormData({...formData, reason: e.target.value})}
                        placeholder={t('Reason for correction...')} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={submitting}>
                    {submitting ? <div className="spinner-border spinner-border-sm" /> : t('Submit')}
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

export default MissingPunchCorrection;
